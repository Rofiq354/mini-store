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

/* FOR ADMIN ONLY ________________________________________________________________ */

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

/* FOR ADMIN ONLY ________________________________________________________________ */

interface GetProductsParams {
  context?: "landing" | "products" | "merchant";
  merchantId?: string;
  categoryId?: string;
  searchTerm?: string;
  priceRange?: [number, number];
  sortBy?: string;
  limit?: number;
  isReady?: string;
}

/* FOR CUSTOMER ONLY _____________________________________________________________ */

export async function getProductsAction({
  context = "products",
  merchantId,
  categoryId,
  searchTerm,
  priceRange,
  sortBy,
  limit = 10,
  isReady,
}: GetProductsParams = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      `
      *,
      profiles:merchant_id (id, shop_name),
      categories:category_id!inner (id, name, slug)
    `,
    )
    .eq("is_active", true);

  if (context === "merchant" && merchantId) {
    query = query.eq("merchant_id", merchantId);
  }

  if (categoryId && categoryId !== "all") {
    const categorySlugs = categoryId.split(",");

    query = query.in("categories.slug", categorySlugs);
  }

  if (isReady === "true") {
    query = query.gt("stock", 0);
  }

  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  if (priceRange) {
    query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);
  }

  switch (sortBy) {
    case "termurah":
      query = query.order("price", { ascending: true });
      break;
    case "termahal":
      query = query.order("price", { ascending: false });
      break;
    case "terbaru":
      query = query.order("created_at", { ascending: false });
      break;
    case "terlama":
      query = query.order("created_at", { ascending: true });
      break;
    case "populer":
      query = query.order("stock", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error.message);
    return { success: false, data: [] };
  }

  const formattedData = data.map((item: any) => ({
    ...item,
    store_name: item.profiles?.shop_name || "Toko Lokal",
    category_name: item.categories?.name || "Uncategorized",
  }));

  return { success: true, data: formattedData };
}

export async function getProductDetail(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      profiles:merchant_id (*),
      categories:category_id (*)
    `,
    )
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error fetching product detail:", error.message);
    return { error: error.message, data: null };
  }

  return { data, success: true };
}

/* FOR CUSTOMER ONLY _____________________________________________________________ */
