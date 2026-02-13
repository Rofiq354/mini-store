"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { useCartSync } from "@/hooks/useCartSync";

export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const { isLoading: cartLoading, user } = useCartSync();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2">
        <ShoppingCart className="h-5 w-5 opacity-20" />
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="relative p-2 animate-pulse">
        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
        <div className="absolute top-0 right-0 bg-muted h-4 w-4 rounded-full border-2 border-background" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-accent rounded-full transition-all active:scale-95"
    >
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
