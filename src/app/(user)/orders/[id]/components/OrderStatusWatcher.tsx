"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supbase/client";
import { toast } from "sonner";

export default function OrderStatusWatcher({ orderId }: { orderId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!orderId) return;

    function connectRealtime() {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channel = supabase
        .channel(`order-live-monitor-${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${orderId}`, // Filter berdasarkan ID order
          },
          (payload) => {
            console.log("🚀 ADMIN UPDATED ORDER:", payload.new.status);

            const statusLabels: Record<string, string> = {
              pending_payment: "Menunggu Pembayaran",
              paid: "Pembayaran Berhasil",
              processing: "Sedang Diproses",
              shipped: "Dalam Pengiriman",
              delivered: "Pesanan Sampai",
              completed: "Selesai",
              cancelled: "Dibatalkan",
            };

            const currentLabel =
              statusLabels[payload.new.status] || payload.new.status;

            toast.success(`Update: ${currentLabel}`, {
              description: "Status pesanan kamu telah diperbarui.",
              duration: 5000,
            });

            router.refresh();
          },
        )
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            console.log("✅ Listening to Order:", orderId);
          }

          if (status === "TIMED_OUT") {
            setTimeout(connectRealtime, 2500);
          }
        });

      channelRef.current = channel;
    }

    const timer = setTimeout(connectRealtime, 500);

    return () => {
      clearTimeout(timer);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [orderId, router, supabase]);

  return null;
}
