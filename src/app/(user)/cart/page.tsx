"use client";

import { useCartStore } from "@/store/useCartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { CartHeader } from "./components/CartHeader";
import { CartItem } from "./components/CartItem";
import { CartSummary } from "./components/CartSummary";
import { EmptyCart } from "./components/EmptyCart";
import { ContinueShopping } from "./components/ContinueShopping";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const { isLoading } = useCartSync();
  const { items } = useCartStore();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Memuat keranjang...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <CartHeader />

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <ContinueShopping />
          </div>

          <div className="w-full lg:w-96">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
