import { createClient } from "@/utils/supbase/server";
import { CategoryDialog } from "./components/CategoryDialog";
import { CategoryTable } from "./components/CategoryTable";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("merchant_id", user?.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Gagal ambil kategori:", error.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize your products into groups.
          </p>
        </div>
        <CategoryDialog />
      </div>

      <div className="bg-card">
        <CategoryTable data={categories || []} />
      </div>
    </div>
  );
}
