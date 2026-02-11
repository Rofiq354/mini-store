import { createClient } from "@/utils/supbase/server";
import { ProductTable } from "./components/ProductTable";
import { ProductDialog } from "./components/ProductDialog";

export default async function ProductsPage() {
  const supabase = await createClient();

  // Ambil data produk dari Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal ambil produk:", error.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your store inventory and product details.
          </p>
        </div>
        {/* Component Dialog untuk tambah produk */}
        <ProductDialog />
      </div>

      <div className="rounded-md border bg-card">
        <ProductTable data={products || []} />
      </div>
    </div>
  );
}
