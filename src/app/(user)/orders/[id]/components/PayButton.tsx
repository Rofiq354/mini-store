"use client";

declare global {
  interface Window {
    snap: any;
  }
}

import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export default function PayButton({ snapToken }: { snapToken: string }) {
  const handlePay = () => {
    if (window.snap) {
      window.snap.pay(snapToken);
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
