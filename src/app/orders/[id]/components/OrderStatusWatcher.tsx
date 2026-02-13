"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supbase/client";

export default function OrderStatusWatcher({ orderId }: { orderId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!orderId) return;

    function connectRealtime() {
      // Bersihkan jika ada channel yang nyangkut
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channel = supabase
        .channel(`order-room-${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "transactions",
            filter: `id=eq.${orderId}`,
          },
          (payload) => {
            console.log("✅ STATUS BERUBAH:", payload.new.status);
            // Revalidasi data tanpa refresh total jika memungkinkan
            router.refresh();
          },
        )
        .subscribe(async (status) => {
          console.log(`📡 Realtime Status (${orderId}):`, status);

          if (status === "TIMED_OUT") {
            console.log("🔄 Reconnecting...");
            setTimeout(connectRealtime, 2000);
          }
        });

      channelRef.current = channel;
    }

    // Kasih jeda 500ms biar navigasi kelar dulu
    const timer = setTimeout(connectRealtime, 500);

    return () => {
      clearTimeout(timer);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [orderId]); // Dependency cuma orderId

  return null;
}
