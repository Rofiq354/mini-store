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
type CardLayout = "grid" | "list";

interface ProductCardProps {
  product: any;
  context?: CardContext;
  layout?: CardLayout;
}

export function ProductCard({
  product,
  context = "landing",
  layout = "grid",
}: ProductCardProps) {
  if (layout === "list") {
    return <ProductListCard product={product} context={context} />;
  }

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

      <CardHeader className="p-4 pb-0 xs:py-0 sm:p-4 sm:pb-0 grow xs:gap-0 sm:gap-2">
        {!isMerchant && (
          <Link
            href={`/stores/${product.profiles?.shop_slug}`}
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

      <CardContent className="p-4 xs:py-0 sm:py-4">
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

function ProductListCard({
  product,
  context,
}: {
  product: any;
  context: CardContext;
}) {
  return (
    <Card className="group py-0 overflow-hidden gap-4 border-none shadow-sm hover:shadow-md transition-all duration-300 flex flex-row rounded-2xl bg-white w-full h-32 md:h-36">
      <Link
        href={`/products/${product.id}`}
        className="relative w-28 md:w-32 h-full p-2 shrink-0"
      >
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-50 shadow-inner">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
              <Store className="h-6 w-6 opacity-20" />
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Badge
                variant="secondary"
                className="bg-white text-foreground font-bold text-[7px] py-0 px-1 h-4"
              >
                Habis
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-3 pr-4 overflow-hidden justify-center">
        <div className="min-w-0">
          <Link
            href={`/stores/${product.profiles?.shop_slug}`}
            className="flex items-center gap-1 mb-0.5 text-primary/70 font-bold text-[9px] uppercase tracking-tighter hover:underline"
          >
            <span className="truncate max-w-30">
              {product.profiles?.shop_name || product.store_name || "Toko"}
            </span>
          </Link>

          <Link href={`/products/${product.id}`}>
            <h3 className="font-bold text-sm md:text-base capitalize leading-tight line-clamp-1 text-gray-800 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[9px] font-black text-primary">Rp</span>
            <span className="text-base md:text-lg font-black text-primary tracking-tight">
              {product.price.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="w-10 h-10 md:w-auto">
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
              size="icon"
              className="rounded-full shadow-sm"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
