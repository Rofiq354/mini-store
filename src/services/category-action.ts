"use server";

import { createClient } from "@/utils/supbase/server";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("merchant_id", user.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

export async function createCategory(data: { name: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("categories").insert({
    ...data,
    merchant_id: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/categories");
}

export async function updateCategory(id: string, data: { name: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi anda telah berakhir. Silakan login kembali." };
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name: data.name,
    })
    .eq("id", id)
    .eq("merchant_id", user.id);

  if (error) {
    console.error("Update Category Error:", error.message);
    return { error: "Gagal memperbarui kategori: " + error.message };
  }

  revalidatePath("/categories");

  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { count, error: countError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    throw new Error(
      "Kategori tidak bisa dihapus karena masih digunakan produk.",
    );
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("merchant_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
  return { success: true };
}
