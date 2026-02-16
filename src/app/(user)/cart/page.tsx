"use client";

import { useCartStore } from "@/store/useCartStore";
import { useCartSync } from "@/hooks/useCartSync";
import { CartHeader } from "./components/CartHeader";
import { CartItem } from "./components/CartItem";
import { CartSummary } from "./components/CartSummary";
import { EmptyCart } from "./components/EmptyCart";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const { isLoading } = useCartSync();
  const { items } = useCartStore();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Memuat keranjang...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-15 md:py-10">
      <CartHeader />

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List Items */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
