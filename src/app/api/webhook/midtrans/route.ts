import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const notificationBody = await req.json();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const signaturePayload = `${notificationBody.order_id}${notificationBody.status_code}${notificationBody.gross_amount}${serverKey}`;
  const localSignature = crypto
    .createHash("sha512")
    .update(signaturePayload)
    .digest("hex");

  if (localSignature !== notificationBody.signature_key) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const transactionStatus = notificationBody.transaction_status;
  const externalId = notificationBody.order_id;
  let finalStatus: "pending" | "settlement" | "expire" | "cancel" | "deny" =
    "pending";

  if (transactionStatus === "capture" || transactionStatus === "settlement") {
    finalStatus = "settlement";

    const { data: transaction } = await supabaseAdmin
      .from("transactions")
      .select("id")
      .eq("external_id", externalId)
      .single();

    if (transaction) {
      const { data: orderItems } = await supabaseAdmin
        .from("transaction_items")
        .select("product_id, quantity")
        .eq("transaction_id", transaction.id);

      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          await supabaseAdmin.rpc("decrement_product_stock", {
            p_id: item.product_id,
            qty: item.quantity,
          });
        }
      }
    }
  } else if (transactionStatus === "pending") {
    finalStatus = "pending";
  } else if (transactionStatus === "deny" || transactionStatus === "cancel") {
    finalStatus = "cancel";
  } else if (transactionStatus === "expire") {
    finalStatus = "expire";
  }

  const { error: updateError } = await supabaseAdmin
    .from("transactions")
    .update({
      status: finalStatus,
      payment_type: notificationBody.payment_type,
      updated_at: new Date().toISOString(),
    })
    .eq("external_id", externalId);

  if (updateError) {
    console.error("Webhook Update Error:", updateError.message);
    return NextResponse.json(
      { message: "Failed to update database" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "OK" });
}
