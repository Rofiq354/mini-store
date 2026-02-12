import { getProductsAction } from "@/services/product-action";
import { ProductCard } from "../../../../components/ProductCard";
import { ProductSortHeader } from "./ProductShortHeader";
import { ShoppingBag } from "lucide-react";

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

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2rem] border border-dashed">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-800">
          Produk Tidak Ditemukan
        </h3>
        <p className="text-sm text-gray-500">
          Coba ganti filter atau kata kunci pencarianmu.
        </p>
      </div>
    );
  }

  return (
    <>
      <ProductSortHeader totalProducts={products.length} />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} context="products" />
        ))}
      </div>
    </>
  );
}
