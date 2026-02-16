import { createClient } from "@/utils/supbase/server";
import { CategoryDialog } from "./components/CategoryDialog";
import { CategoryTable } from "./components/CategoryTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("merchant_id", user?.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Gagal ambil kategori:", error.message);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs Section */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/dashboard"
              className="flex items-center gap-1"
            >
              <Home className="h-3.5 w-3.5" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori Produk</h1>
          <p className="text-muted-foreground text-sm mt-3">
            Atur dan kelompokkan produk warung Anda agar lebih mudah ditemukan
            pelanggan.
          </p>
        </div>
        <CategoryDialog />
      </div>

      {/* Content Section */}
      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
        <CategoryTable data={categories || []} />
      </div>
    </div>
  );
}
