"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useCartStore,
  type CartItem as CartItemType,
} from "@/store/useCartStore";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(item.id);
    }, 300);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    updateQuantity(item.id, newQuantity);
  };

  const subtotal = item.price * item.quantity;

  return (
    <Card
      className={cn(
        "group overflow-hidden py-0 transition-all duration-300 rounded-2xl border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md",
        isRemoving && "opacity-0 scale-95",
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Image */}
          <Link
            href={`/products/${item.id}`}
            className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100"
          >
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="96px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Store className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </Link>

          {/* Content */}
          <div className="flex flex-1 flex-col min-w-0 gap-2">
            {/* Top row: name + delete */}
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.id}`}
                  className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                  <Store className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item.merchant_name}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 -mt-0.5 -mr-1"
                onClick={handleRemove}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Bottom row: price + quantity */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="font-black text-primary text-sm">
                Rp {subtotal.toLocaleString("id-ID")}
              </p>

              <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-7 text-center text-xs font-bold">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md hover:bg-white hover:shadow-sm"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Stock warning */}
            {item.quantity >= item.stock && (
              <p className="text-[10px] text-orange-500 font-semibold flex items-center gap-1">
                <span>⚠</span> Stok maksimal tercapai
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
