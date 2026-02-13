"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        "overflow-hidden transition-all duration-300",
        isRemoving && "opacity-0 scale-95",
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <Link
          href={`/products/${item.id}`}
          className="relative h-40 w-full sm:h-auto sm:w-40 shrink-0"
        >
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="160px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Store className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="flex flex-1 flex-col p-4">
          {/* Header: Name & Remove Button */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link
                href={`/products/${item.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
              >
                {item.name}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Store className="h-3.5 w-3.5" />
                <span>{item.merchant_name}</span>
              </div>
              {item.category_name && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {item.category_name}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Footer: Quantity Controls & Price */}
          <div className="mt-4 flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center text-sm font-medium">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                Rp {subtotal.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-muted-foreground">
                @ Rp {item.price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Stock Warning */}
          {item.quantity >= item.stock && (
            <div className="mt-2 text-xs text-orange-600">
              Stok maksimal: {item.stock}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
