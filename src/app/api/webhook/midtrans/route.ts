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
  } else if (transactionStatus === "deny" || transactionStatus === "cancel") {
    finalStatus = "cancel";
  } else if (transactionStatus === "expire") {
    finalStatus = "expire";
  }

  const { data: transaction, error: updateError } = await supabaseAdmin
    .from("transactions")
    .update({
      status: finalStatus,
      payment_type: notificationBody.payment_type,
      updated_at: new Date().toISOString(),
    })
    .eq("external_id", externalId)
    .select("id")
    .single();

  if (updateError || !transaction) {
    console.error("Webhook Error: Transaction not found", externalId);
    return NextResponse.json(
      { message: "Transaction not found" },
      { status: 404 },
    );
  }

  if (finalStatus === "settlement") {
    const { data: orderItems } = await supabaseAdmin
      .from("transaction_items")
      .select("product_id, quantity")
      .eq("transaction_id", transaction.id);

    if (orderItems) {
      for (const item of orderItems) {
        await supabaseAdmin.rpc("decrement_product_stock", {
          p_id: item.product_id,
          qty: item.quantity,
        });
      }
    }

    const { data: orderData } = await supabaseAdmin
      .from("orders")
      .select("id, delivery_method")
      .eq("transaction_id", transaction.id)
      .single();

    if (orderData) {
      const newOrderStatus =
        orderData.delivery_method === "pickup" ? "completed" : "paid";
      await supabaseAdmin
        .from("orders")
        .update({
          status: newOrderStatus,
          paid_at: new Date().toISOString(),
          completed_at:
            newOrderStatus === "completed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderData.id);
    }
  } else if (finalStatus === "cancel" || finalStatus === "expire") {
    await supabaseAdmin
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("transaction_id", transaction.id);
  }

  return NextResponse.json({ message: "OK" });
}
