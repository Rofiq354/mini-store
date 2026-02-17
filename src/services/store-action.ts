"use server";

import { createClient } from "@/utils/supbase/server";
import { getProductsAction } from "./product-action";
import { updateStoreSchema } from "@/validation/auth.schema";
import { revalidatePath } from "next/cache";

export async function getAllStores() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, avatar_url, shop_name, description, business_address, shop_slug",
    )
    .eq("role", "merchant")
    .eq("is_active", true)
    .order("shop_name", { ascending: true });

  if (error) {
    console.error("Error fetching stores:", error.message);
    return { error: error.message, data: [] };
  }

  return { data: data || [], success: true };
}

export async function getStoreDetailBySlug(slug: string) {
  const supabase = await createClient();

  const { data: store, error: storeError } = await supabase
    .from("profiles")
    .select("*")
    .eq("shop_slug", slug)
    .single();

  if (storeError || !store) {
    console.error("Error fetching store by slug:", storeError?.message);
    return { error: "Store not found", store: null, products: [] };
  }

  const productResult = await getProductsAction({
    context: "merchant",
    merchantId: store.id,
    limit: 100,
  });

  return {
    store,
    products: productResult.data || [],
    success: true,
  };
}

export async function getStoreProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("role", "merchant")
    .single();

  if (error || !profile) {
    console.error("Bukan merchant atau profile tidak ditemukan");
    return null;
  }

  return profile;
}

export async function updateStoreProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const rawData = {
    shopName: formData.get("shopName"),
    shopSlug: formData.get("shopSlug"),
    phoneNumber: formData.get("phoneNumber"),
    description: formData.get("description"),
    address: formData.get("address"),
  };

  const validated = updateStoreSchema.safeParse(rawData);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      shop_name: validated.data.shopName,
      shop_slug: validated.data.shopSlug,
      phone_number: validated.data.phoneNumber,
      description: validated.data.description,
      business_address: validated.data.address,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .eq("role", "merchant");

  if (error) {
    if (error.code === "23505")
      return { message: "Slug sudah digunakan toko lain." };
    return { message: "Gagal memperbarui profil: " + error.message };
  }

  revalidatePath("/admin/store");
  return { success: true, message: "Profil toko berhasil diperbarui!" };
}
