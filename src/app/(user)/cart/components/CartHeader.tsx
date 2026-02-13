"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { removeFromCartDb } from "@/services/cart-action";

export function CartHeader() {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Keranjang Belanja
        </h1>
      </div>
    );
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Keranjang Belanja
          </h1>
          <p className="mt-2 text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"} •{" "}
            <span className="font-semibold text-foreground">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </p>
        </div>

        <DeleteConfirmDialog
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Kosongkan Keranjang
            </Button>
          }
          title="Kosongkan Keranjang?"
          description="Semua produk di keranjang akan dihapus. Anda dapat menambahkannya kembali nanti."
          onConfirm={handleClearCart}
          confirmLabel="Ya, Kosongkan"
          cancelLabel="Batal"
          toastMessages={{
            loading: "Mengosongkan keranjang...",
            success: "Keranjang berhasil dikosongkan",
            error: "Gagal mengosongkan keranjang",
          }}
        />
      </div>
    </div>
  );
}
