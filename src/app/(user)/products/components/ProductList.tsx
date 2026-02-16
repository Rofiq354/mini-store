import { getProductsAction } from "@/services/product-action";
import { ProductSortHeader } from "./ProductShortHeader";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductGridDisplay } from "./ProductGridDisplay";

interface ProductListProps {
  params: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    ready?: string;
    limit?: string;
  };
}

export async function ProductList({ params }: ProductListProps) {
  const currentLimit = Number(params.limit) || 6;

  const { data: products, count } = await getProductsAction({
    context: "products",
    limit: currentLimit,
    isReady: params.ready,
    categoryId: params.category,
    searchTerm: params.search,
    sortBy: params.sort || "terbaru",
    priceRange: params.minPrice
      ? [Number(params.minPrice), Number(params.maxPrice || 99999999)]
      : undefined,
  });

  const totalAvailable = count || 0;
  const displayedCount = Math.min(currentLimit, totalAvailable);
  const hasMore = currentLimit < totalAvailable;

  return (
    <>
      <ProductSortHeader totalProducts={displayedCount} />

      {!products || products.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<ShoppingBag className="h-10 w-10 text-primary" />}
            title="Produk Tidak Ditemukan"
            description="Coba ganti filter atau kata kunci pencarianmu."
          />
        </div>
      ) : (
        <>
          <ProductGridDisplay products={products} context="products" />

          <div className="mt-12 flex justify-center">
            {hasMore ? (
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-10 border-primary text-primary hover:bg-primary/5 shadow-sm transition-all"
                asChild
              >
                <Link
                  href={{
                    pathname: "/products",
                    query: { ...params, limit: currentLimit + 6 },
                  }}
                  scroll={false}
                  replace={true}
                >
                  Muat Lebih Banyak
                </Link>
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-medium bg-gray-50 inline-block px-6 py-2 rounded-full border">
                  Semua produk telah ditampilkan
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
