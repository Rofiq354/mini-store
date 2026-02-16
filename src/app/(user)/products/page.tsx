import { Suspense } from "react";
import { getAllUniqueCategories } from "@/services/category-action";
import { ProductSidebar } from "./components/ProductSidebar";
import { ShoppingBag } from "lucide-react";
import { ProductList } from "./components/ProductList";
import { ProductSkeleton } from "./components/ProductSkeleton";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    limit?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const categories = await getAllUniqueCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 md:py-8">
      <div className="mb-10 p-8 rounded-3xl bg-linear-to-r from-primary to-primary/80 text-primary-foreground shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Mendukung Ekonomi Lokal
          </h2>
          <p className="text-base md:text-lg opacity-90 leading-relaxed mb-2">
            Temukan ribuan produk UMKM berkualitas. Fresh, terpercaya, dan
            langsung dari tetangga Anda.
          </p>
          <p className="text-xs font-medium opacity-75 italic">
            #BanggaBuatanIndonesia #GeraiKu
          </p>
        </div>
        <div className="absolute -right-7.5 -bottom-7.5 opacity-15 rotate-12 transition-transform hover:scale-110 duration-700">
          <ShoppingBag size={250} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProductSidebar categories={categories} />

        <main className="flex-1 w-full min-w-0">
          {params.search && (
            <p className="mb-4 text-sm text-gray-500 px-1">
              Menampilkan hasil pencarian untuk:{" "}
              <span className="font-bold text-primary">"{params.search}"</span>
            </p>
          )}

          <Suspense key={JSON.stringify(params)} fallback={<ProductSkeleton />}>
            <ProductList params={params} />
          </Suspense>
        </main>
      </div>

      <div className="mt-16 p-10 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Mau jualan di GeraiKu?
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          Bergabunglah dengan ratusan pedagang UMKM yang telah meningkatkan
          penjualan hingga <strong>3x lipat</strong>. Bergabung sekarang, gratis
          selamanya!
        </p>
        <Link href="/signup">
          <div className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-10 text-base font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-95 cursor-pointer">
            Daftar Sebagai Penjual
          </div>
        </Link>
      </div>
    </div>
  );
}
