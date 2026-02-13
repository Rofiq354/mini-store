"use client";

import { ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";

export function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingBag className="h-10 w-10 text-primary" />}
      title="Keranjang Anda Kosong"
      description="Sepertinya Anda belum menambahkan produk apapun. Yuk mulai belanja!"
    >
      <Button asChild>
        <Link href="/products">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Mulai Belanja
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/kategori">
          <Store className="mr-2 h-4 w-4" />
          Lihat Kategori
        </Link>
      </Button>
    </EmptyState>
  );
}
