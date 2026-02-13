"use client";

import Link from "next/link";
import { ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyCart() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="h-10 w-10 text-primary" />
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-2">
          Keranjang Anda Kosong
        </h3>

        <p className="text-muted-foreground mb-6 max-w-sm">
          Sepertinya Anda belum menambahkan produk apapun. Yuk mulai belanja!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
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
        </div>
      </CardContent>
    </Card>
  );
}
