import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("x-webhook-key");
    if (authHeader !== process.env.WEBHOOK_SECRET_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await req.json();
    const { record, old_record } = payload;

    if (record.status === old_record.status) {
      return NextResponse.json({ message: "Bukan perubahan status. Skip." });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name")
      .eq("id", record.user_id)
      .single();

    if (profileError || !profile?.email) {
      console.error("User email tidak ditemukan:", profileError);
      return NextResponse.json(
        { error: "Customer email not found" },
        { status: 404 },
      );
    }

    const statusLabels: Record<string, string> = {
      pending_payment: "Menunggu Pembayaran",
      paid: "Pembayaran Diterima",
      processing: "Sedang Diproses",
      ready_to_ship: "Siap Dikirim",
      shipped: "Dalam Pengiriman",
      delivered: "Telah Sampai",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };

    const statusColor =
      record.status === "completed" || record.status === "delivered"
        ? "#10b981"
        : record.status === "cancelled"
          ? "#ef4444"
          : "#2563eb";

    const mailOptions = {
      from: `"Geraiku Store" <${process.env.EMAIL_USER}>`,
      to: profile.email,
      subject: `Update Pesanan #${record.order_number} - ${statusLabels[record.status] || record.status.toUpperCase()}`,
      html: `
        <div style="background-color: #f4f4f7; padding: 40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            
            <div style="background-color: ${statusColor}; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Geraiku Store</h1>
            </div>

            <div style="padding: 40px 30px;">
              <h2 style="color: #1a1f36; margin-top: 0; font-size: 20px;">Halo, ${profile.full_name}! 👋</h2>
              <p style="color: #4f566b; line-height: 1.6; font-size: 16px;">
                Ada kabar terbaru mengenai pesanan Anda. Saat ini, pesanan Anda telah diperbarui menjadi:
              </p>

              <div style="background-color: #f8fafc; border: 2px dashed ${statusColor}; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
                <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: bold;">Status Terbaru</p>
                <p style="margin: 10px 0 0 0; font-size: 28px; font-weight: 800; color: ${statusColor}; text-transform: uppercase;">
                  ${statusLabels[record.status] || record.status}
                </p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <tr>
                  <td style="color: #8898aa; font-size: 14px; padding: 5px 0;">Nomor Pesanan</td>
                  <td style="text-align: right; color: #1a1f36; font-size: 14px; font-weight: bold; padding: 5px 0;">#${record.order_number}</td>
                </tr>
                <tr>
                  <td style="color: #8898aa; font-size: 14px; padding: 5px 0;">Metode Pengiriman</td>
                  <td style="text-align: right; color: #1a1f36; font-size: 14px; font-weight: bold; padding: 5px 0;">${record.delivery_method === "pickup" ? "Ambil di Toko" : "Kurir"}</td>
                </tr>
              </table>

              <div style="text-align: center; margin-top: 40px;">
                <a href="https://domain-kamu.com/orders/${record.id}" 
                  style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Lihat Detail Pesanan
                </a>
              </div>
            </div>

            <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #edf2f7;">
              <p style="margin: 0; color: #8898aa; font-size: 12px;">
                Jika Anda memiliki pertanyaan, silakan hubungi Customer Service kami via WhatsApp.
              </p>
              <p style="margin: 10px 0 0 0; color: #8898aa; font-size: 11px;">
                &copy; 2026 Geraiku Store. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: `Email terkirim ke ${profile.email} untuk status ${record.status}`,
    });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
