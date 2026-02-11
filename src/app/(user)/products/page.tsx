import { createClient } from "@/utils/supbase/server";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string };
}) {
  const supabase = await createClient();

  // Query Produk dengan Join ke Profile (Toko) dan Category
  let query = supabase
    .from("products")
    .select(
      `
      *,
      profiles (shop_name),
      categories (name)
    `,
    )
    .eq("is_active", true); // Hanya tampilkan produk aktif

  // Logika Filter Sederhana
  if (searchParams.q) query = query.ilike("name", `%${searchParams.q}%`);
  if (searchParams.category)
    query = query.eq("category_id", searchParams.category);

  const { data: products } = await query.order("created_at", {
    ascending: false,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filter */}
        <aside className="w-full md:w-64 shrink-0">
          <FilterSidebar />
        </aside>

        {/* List Produk */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Semua Produk</h1>
            <p className="text-muted-foreground">
              {products?.length || 0} Produk ditemukan
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
