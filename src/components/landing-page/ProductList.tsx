import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { getProductsAction } from "@/services/product-action";

export default async function ProductList() {
  const { data: latestProducts } = await getProductsAction({
    context: "landing",
    limit: 4,
    isReady: "true",
    sortBy: "terbaru",
  });

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Produk Terbaru
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
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
        {latestProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {latestProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                context="landing"
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Store className="h-10 w-10 text-primary/60" />}
            title="Belum Ada Produk"
            description="Tunggu warung-warung lokal menambahkan produk mereka!"
          />
        )}
      </div>
    </section>
  );
}
