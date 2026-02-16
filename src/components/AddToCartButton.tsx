"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/store/useCartStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { createClient } from "@/utils/supbase/client";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  disabled?: boolean;
  buttonLabel?: string | null;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "default",
  size = "default",
  className,
  showIcon = true,
  buttonLabel,
  disabled = false,
}: AddToCartButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const { addItem, getItemQuantity } = useCartStore();

  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: user } = useSWR("auth-user", async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.user ?? null;
  });

  const { data: role } = useSWR(user ? `role-${user.id}` : null, async () => {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id)
      .single();
    return data?.role || "customer";
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentQuantity = getItemQuantity(product.id);
  const isInCart = currentQuantity > 0;
  const isIconOnly = size === "icon";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Silahkan login terlebih dahulu", {
        description: "Anda harus masuk akun untuk mulai belanja.",
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    if (role === "merchant") {
      toast.error("Akses Dibatasi", {
        description: "Akun Merchant tidak dapat menambah barang ke keranjang.",
      });
      return;
    }

    if (product.stock <= 0) {
      toast.error("Produk sedang habis");
      return;
    }

    if (currentQuantity + quantity > product.stock) {
      toast.error(`Stok hanya tersedia ${product.stock} item`);
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      addItem(product, quantity);
      setIsAdding(false);
      setJustAdded(true);

      toast.success(`${product.name} ditambahkan`, {
        description: `${quantity} item berhasil masuk keranjang.`,
      });

      setTimeout(() => setJustAdded(false), 2000);
    }, 300);
  };

  const isDisabled = disabled || product.stock <= 0 || isAdding;

  // let buttonLabel;
  if (isIconOnly) {
    buttonLabel = null;
  } else if (isAdding) {
    buttonLabel = "Menambahkan...";
  } else if (justAdded) {
    buttonLabel = "Ditambahkan!";
  } else if (product.stock <= 0) {
    buttonLabel = "Stok Habis";
  } else if (mounted && user && role === "customer" && isInCart) {
    buttonLabel = `Tambah lagi (${currentQuantity})`;
  } else {
    buttonLabel = buttonLabel || "Tambah";
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleAddToCart}
      disabled={isDisabled}
    >
      {showIcon && (
        <>
          {isAdding ? (
            <Loader2
              className={cn("h-4 w-4 animate-spin", !isIconOnly && "mr-2")}
            />
          ) : justAdded ? (
            <Check className={cn("h-4 w-4", !isIconOnly && "mr-2")} />
          ) : (
            <ShoppingCart className={cn("h-4 w-4", !isIconOnly && "mr-2")} />
          )}
        </>
      )}
      {buttonLabel}
    </Button>
  );
}
