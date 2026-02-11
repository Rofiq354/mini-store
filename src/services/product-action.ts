"use server";

import { createClient } from "@/utils/supbase/server";
import { revalidatePath } from "next/cache";

type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  category_id?: string | null;
  category?: string | null;
  image_url?: string | null;
  cost_price?: number;
  is_active?: boolean;
};

export async function createProduct(data: CreateProductInput) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User tidak terautentikasi" };
  }

  const { error } = await supabase.from("products").insert([
    {
      merchant_id: user.id,
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock ?? 0,
      category_id: data.category_id ?? null,
      image_url: data.image_url ?? null,
      cost_price: data.cost_price ?? 0,
      is_active: data.is_active ?? true,
    },
  ]);

  if (error) {
    console.error("DB Error:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/products");

  return { success: true };
}

export async function updateProduct(id: string, data: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      image_url: data.image_url,
    })
    .eq("id", id);

  if (error) {
    console.error("Update Error:", error);
    return { error: "Gagal memperbarui produk" };
  }

  revalidatePath("/admin/products");
  return { success: "Produk berhasil diperbarui" };
}

export async function deleteProduct(id: string, imageUrl: string | null) {
  const supabase = await createClient();

  if (imageUrl) {
    const path = imageUrl.split("/").slice(-2).join("/");

    const { error: storageError } = await supabase.storage
      .from("products")
      .remove([path]);

    if (storageError) console.error("Storage Delete Error:", storageError);
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("DB Delete Error:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return { success: true };
}
