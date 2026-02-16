"use client";

import { useViewStore } from "@/store/useViewStore";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ProductGridDisplay({ products, context }: any) {
  const { view } = useViewStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-4 opacity-0" />
    );

  return (
    <div
      className={cn(
        "grid mt-4",
        view === "list"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
          : "grid-cols-2 lg:grid-cols-3 gap-6",
      )}
    >
      {products.map((product: any) => (
        <ProductCard
          key={product.id}
          product={product}
          context={context}
          layout={view}
        />
      ))}
    </div>
  );
}
