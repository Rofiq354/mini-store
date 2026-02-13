"use server";

import { createClient } from "@/utils/supbase/server";
import { getProductsAction } from "./product-action";

export async function getAllStores() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, avatar_url, shop_name, description, business_address",
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

export async function getStoreDetail(storeId: string) {
  const supabase = await createClient();

  // 1. Ambil data profil toko saja
  const { data: store, error: storeError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", storeId)
    .single();

  if (storeError) {
    console.error("Error fetching store:", storeError.message);
    return { error: storeError.message, store: null, products: [] };
  }

  // 2. Gunakan action yang sudah ada untuk ambil produk
  // Kita set context "merchant" dan kirim storeId sebagai merchantId
  const productResult = await getProductsAction({
    context: "merchant",
    merchantId: storeId,
    limit: 100, // Kita ambil lebih banyak untuk halaman detail toko
  });

  return {
    store,
    products: productResult.data || [], // Menggunakan data yang sudah di-format oleh actionmu
    success: true,
  };
}
