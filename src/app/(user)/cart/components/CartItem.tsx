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
        "group overflow-hidden transition-all p-3 duration-300 rounded-2xl border-gray-100 shadow-sm hover:border-primary/30",
        isRemoving && "opacity-0 scale-95",
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/products/${item.id}`}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-50"
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

          <div className="flex flex-1 flex-col min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/products/${item.id}`}
                  className="font-bold text-sm md:text-base text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  <Store className="h-3 w-3" />
                  <span className="truncate">{item.merchant_name}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
                onClick={handleRemove}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="mt-3 flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground line-through decoration-gray-300">
                  {/* Bisa untuk harga coret jika ada diskon, jika tidak biarkan kosong */}
                </p>
                <p className="font-bold text-primary">
                  Rp {subtotal.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md hover:bg-white hover:shadow-sm"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-xs font-bold">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md hover:bg-white hover:shadow-sm"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {item.quantity >= item.stock && (
              <p className="mt-1 text-[10px] text-orange-600 font-medium">
                Stok maksimal tercapai
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
