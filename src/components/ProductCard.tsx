"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

type CardContext = "landing" | "products" | "merchant";

interface ProductCardProps {
  product: any;
  context?: CardContext;
}

export function ProductCard({
  product,
  context = "landing",
}: ProductCardProps) {
  const isLanding = context === "landing";
  const isMerchant = context === "merchant";
  const isProducts = context === "products";

  return (
    <Card className="group overflow-hidden py-0 gap-2 border-none shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col rounded-2xl bg-white h-full">
      <Link href={`/products/${product.id}`} className="block p-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 border border-gray-50 shadow-inner">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
              <Store className="h-12 w-12 opacity-20" />
            </div>
          )}

          {(isLanding || isProducts) && product.categories?.name && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="bg-background/95 backdrop-blur-sm text-foreground shadow-sm font-bold text-[10px] uppercase"
              >
                {product.categories.name}
              </Badge>
            </div>
          )}

          {product.stock <= 10 && product.stock > 0 && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="destructive"
                className="bg-primary text-white font-bold text-[10px]"
              >
                Stok {product.stock}
              </Badge>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Badge
                variant="secondary"
                className="bg-white text-foreground font-bold text-[10px] py-0.5"
              >
                Habis
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardHeader className="p-4 pb-0 grow">
        {!isMerchant && (
          <Link
            href={`/stores/${product.merchant_id}`}
            className="flex items-center gap-1.5 mb-1.5 text-primary/80 font-bold hover:text-primary transition-colors w-fit group/store"
          >
            <Store className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-widest truncate max-w-35 group-hover/store:underline decoration-primary/30 underline-offset-2">
              {product.profiles?.shop_name ||
                product.store_name ||
                "Toko Lokal"}
            </span>
          </Link>
        )}

        <Link
          href={`/products/${product.id}`}
          className="group-hover:text-primary transition-colors block mb-1"
        >
          <h3 className="font-bold text-[15px] capitalize leading-snug line-clamp-2 text-gray-800">
            {product.name}
          </h3>
        </Link>

        {isMerchant && (
          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mt-1">
            {product.description ||
              "Produk lokal berkualitas unggul dari GeraiKu."}
          </p>
        )}
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-black text-primary">Rp</span>
          <span className="text-2xl font-black text-primary tracking-tight">
            {product.price.toLocaleString("id-ID")}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            image_url: product.image_url,
            merchant_id: product.merchant_id,
            merchant_name:
              product.store_name || product.profiles?.shop_name || "Toko",
          }}
          size="lg"
          className="w-full shadow-sm active:scale-95 transition-transform"
        />
      </CardFooter>
    </Card>
  );
}
