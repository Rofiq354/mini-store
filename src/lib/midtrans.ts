import * as midtransClient from "midtrans-client";

export const snap = new midtransClient.Snap({
  isProduction: false, // Set ke false untuk Sandbox
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});
