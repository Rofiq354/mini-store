import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getProductsAction } from "@/services/product-action";

export default async function ProductList() {
  const { data: latestProducts } = await getProductsAction({
    context: "landing",
    limit: 4,
    sortBy: "terbaru",
  });

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
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} context="landing" />
          ))}
        </div>

        {/* Empty State */}
        {latestProducts.length === 0 && (
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
