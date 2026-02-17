"use client";

import { useRouter } from "next/navigation";
import { CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { formatIDR } from "@/lib/utils";

export function CartSummary() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();

  const subtotal: number = getTotalPrice() || 0;
  const shipping: number = 0;
  const total: number = subtotal + shipping;

  const handleGoToCheckout = () => {
    if (items.length === 0) return toast.error("Keranjang kosong");
    router.push("/checkout");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ongkir</span>
              <span className="font-medium text-green-600">
                {shipping === 0 ? "Gratis" : formatIDR(shipping)}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">
                {formatIDR(total)}
              </p>
              {/* <p className="text-xs text-muted-foreground">
                Sudah termasuk pajak
              </p> */}
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleGoToCheckout}>
            Lanjut ke Checkout
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Pembayaran aman dengan SSL</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Checkout Aman</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Informasi pembayaran Anda terenkripsi dan aman di sistem kami.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
