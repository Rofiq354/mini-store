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
    if (items.length === 0) {
      toast.error("Keranjang Anda kosong");
      return;
    }

    setIsCheckingOut(true);

    try {
      // 1. Siapkan item untuk checkout sesuai schema di cart-action.ts
      const checkoutItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      // 2. Panggil Server Action
      const result = await createTransactionFromCart(checkoutItems);

      // 3. Penanganan Error dari Server
      if (result.error) {
        toast.error(result.error);

        // Jika ada error spesifik per produk (misal: stok habis tiba-tiba)
        if (result.validationErrors) {
          result.validationErrors.forEach((err: { message: string }) => {
            toast.error(err.message, {
              description: "Silakan sesuaikan jumlah di keranjang.",
            });
          });
        }
        return;
      }

      // 4. Sukses: Bersihkan keranjang dan arahkan ke halaman detail pesanan
      if (result.success && result.transactionId) {
        toast.success("Pesanan berhasil dibuat!");
        clearCart();
        router.push(`/orders/${result.transactionId}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Terjadi kesalahan sistem saat checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Helper untuk formatting Rupiah agar tidak berulang
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
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
              <span className="font-medium">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ongkir</span>
              <span className="font-medium text-green-600">
                {shipping === 0 ? "Gratis" : formatRupiah(shipping)}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">
                {formatRupiah(total)}
              </p>
              <p className="text-xs text-muted-foreground">
                Sudah termasuk pajak
              </p>
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
