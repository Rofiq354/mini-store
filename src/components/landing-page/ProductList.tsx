import { createClient } from "@/utils/supbase/server";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Store, ArrowRight } from "lucide-react";

export default async function ProductList() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(name)
    `,
    )
    .eq("is_active", true)
    .limit(8)
    .order("created_at", { ascending: false });

  if (error || !products) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Produk Terbaru
            </h2>
            <p className="mt-2 text-muted-foreground">
              Temukan produk terbaru dari warung-warung lokal terbaik
            </p>
          </div>
          <Button variant="outline" className="w-fit group" asChild>
            <Link href="/products">
              Lihat Semua Produk
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      <Store className="h-12 w-12" />
                    </div>
                  )}

                  {/* Category Badge */}
                  {product.categories?.name && (
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="bg-background/95 backdrop-blur-sm text-foreground shadow-sm"
                      >
                        {product.categories.name}
                      </Badge>
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="destructive"
                        className="bg-orange-500 text-white"
                      >
                        Stok {product.stock}
                      </Badge>
                    </div>
                  )}

                  {/* Out of Stock Overlay */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge
                        variant="secondary"
                        className="bg-white text-foreground text-sm"
                      >
                        Stok Habis
                      </Badge>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <CardHeader className="p-4 pb-3 grow">
                <Link
                  href={`/products/${product.id}`}
                  className="group-hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold text-base leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Rp
                  </span>
                  <span className="text-xl font-bold text-foreground">
                    {product.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </CardContent>

              {/* Add to Cart Button */}
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  disabled={product.stock === 0}
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <Store className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-muted-foreground">
              Tunggu warung-warung lokal menambahkan produk mereka!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
