import { createClient } from "@/utils/supbase/server";
import { ProductTable } from "./components/ProductTable";
import { ProductDialog } from "./components/ProductDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Package } from "lucide-react";

export default async function ProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products, error } = await supabase
    .from("products")
    .select(`*, categories (name)`)
    .eq("merchant_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal ambil produk:", error.message);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/dashboard"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Home className="h-3.5 w-3.5" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              Products
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Daftar Produk
          </h1>
          <p className="text-muted-foreground text-sm mt-3">
            Kelola stok, harga, dan informasi detail produk warung Anda di sini.
          </p>
        </div>
        <ProductDialog />
      </div>

      {/* Table Section */}
      <div className="bg-card">
        <ProductTable data={products || []} />
      </div>
    </div>
  );
}
