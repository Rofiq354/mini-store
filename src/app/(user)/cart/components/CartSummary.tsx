"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";
import { createTransactionFromCart } from "@/services/cart-action";
import { toast } from "sonner";
import { formatIDR } from "@/lib/utils";

export function CartSummary() {
  const router = useRouter();
  // Pastikan useCartStore mengembalikan tipe yang benar
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Pastikan subtotal selalu angka (number)
  const subtotal: number = getTotalPrice() || 0;
  const shipping: number = 0; // Free shipping
  const total: number = subtotal + shipping;

  const handleCheckout = async () => {
    if (items.length === 0) return toast.error("Keranjang kosong");

    setIsCheckingOut(true);

    try {
      // 1. Map items dengan tambahan field 'name' untuk Midtrans
      const checkoutItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }));

      const res = await createTransactionFromCart(checkoutItems);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      // 2. Munculkan Pop-up Midtrans Snap
      if (res.success && res.snapToken) {
        clearCart(true);
        // @ts-ignore (Snap dari script Midtrans)
        window.snap.pay(res.snapToken, {
          onSuccess: function (midtransData: any) {
            console.log("Midtrans callback data:", midtransData);
            toast.success("Pembayaran Berhasil!");
            clearCart(); // Kosongkan keranjang di state/DB
            router.push(`/orders/${res.transactionId}`);
          },
          onPending: function (midtransData: any) {
            toast.info("Menunggu pembayaran...");
            router.push(`/orders/${res.transactionId}`);
          },
          onError: function (midtransData: any) {
            toast.error("Pembayaran Gagal!");
          },
          onClose: function () {
            toast.info("Anda menutup jendela pembayaran sebelum selesai.");
          },
        });
      }
    } catch (error) {
      toast.error("Gagal memproses pembayaran");
    } finally {
      setIsCheckingOut(false);
    }
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

          <Button
            size="lg"
            className="w-full"
            disabled={items.length === 0 || isCheckingOut}
            onClick={handleCheckout}
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Checkout Sekarang
              </>
            )}
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
