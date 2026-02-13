import { getProductsAction } from "@/services/product-action";
import { ProductCard } from "@/components/ProductCard";
import { ProductSortHeader } from "./ProductShortHeader";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

interface ProductListProps {
  params: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    ready?: string;
  };
}

export async function ProductList({ params }: ProductListProps) {
  const { data: products } = await getProductsAction({
    context: "products",
    limit: 6,
    isReady: params.ready,
    categoryId: params.category,
    searchTerm: params.search,
    sortBy: params.sort || "terbaru",
    priceRange: params.minPrice
      ? [Number(params.minPrice), Number(params.maxPrice || 99999999)]
      : undefined,
  });

  return (
    <>
      {/* Header tetap muncul meskipun produk kosong */}
      <ProductSortHeader totalProducts={products?.length || 0} />

      {!products || products.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<ShoppingBag className="h-10 w-10 text-primary" />}
            title="Produk Tidak Ditemukan"
            description="Coba ganti filter atau kata kunci pencarianmu."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              context="products"
            />
          ))}
        </div>
      )}
    </>
  );
}
