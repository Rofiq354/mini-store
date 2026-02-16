"use server";

import { createClient } from "@/utils/supbase/server";
import { getProductsAction } from "./product-action";

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
