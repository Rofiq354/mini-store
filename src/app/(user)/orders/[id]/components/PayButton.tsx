"use client";

declare global {
  interface Window {
    snap: any;
  }
}

import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PayButton({ snapToken }: { snapToken: string }) {
  const router = useRouter();
  const handlePay = () => {
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: function (result: any) {
          router.refresh(); // Refresh data order
        },
        onPending: function (result: any) {
          router.refresh();
        },
        onError: function (result: any) {
          router.refresh();
        },
        onClose: function () {
          console.log("User closed the popup without finishing the payment");
        },
      });
    }
  };

  return (
    <Button
      onClick={handlePay}
      className="w-full h-12 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
    >
      <CreditCard className="mr-2 h-5 w-5" /> Bayar Sekarang
    </Button>
  );
}
