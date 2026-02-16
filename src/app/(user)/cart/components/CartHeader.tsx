"use client";

import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { removeFromCartDb } from "@/services/cart-action";
import Link from "next/link";

export function CartHeader() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleClearCart = async () => {
    const result = await removeFromCartDb();
    if (result?.success) {
      clearCart();
    } else {
      throw new Error(result?.error || "Gagal menghapus data");
    }
  };

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        asChild
        className="mb-6 ml-0 md:-ml-4 text-muted-foreground hover:text-primary transition-colors"
      >
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali Belanja
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
          </div>
        </div>

        {items.length > 0 && (
          <DeleteConfirmDialog
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 rounded-xl border-gray-200"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Kosongkan
              </Button>
            }
            title="Kosongkan Keranjang?"
            description="Semua produk di keranjang akan dihapus."
            onConfirm={handleClearCart}
            confirmLabel="Ya, Kosongkan"
            cancelLabel="Batal"
            toastMessages={{
              loading: "Mengosongkan...",
              success: "Berhasil dikosongkan",
              error: "Gagal mengosongkan",
            }}
          />
        )}
      </div>
    </div>
  );
}
