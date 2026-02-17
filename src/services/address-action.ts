"use server";

import { createClient } from "@/utils/supbase/server";
import { revalidatePath } from "next/cache";

export interface Address {
  id?: string;
  user_id?: string;
  label: "home" | "office" | "other" | string;
  recipient_name: string;
  phone_number: string;
  province_id: number;
  province_name: string;
  city_id: number;
  city_name: string;
  district_id: number;
  district_name: string;
  village_id?: number;
  village_name?: string;
  postal_code?: string;
  street_address: string;
  notes?: string;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all addresses for current user
 */
export async function getUserAddresses() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Get single address by ID
 */
export async function getAddress(addressId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", addressId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Get primary address for current user
 */
export async function getPrimaryAddress() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .single();

  if (error) {
    // No primary address found is not an error
    if (error.code === "PGRST116") {
      return { data: null };
    }
    return { error: error.message };
  }

  return { data };
}

/**
 * Create new address
 */
export async function createAddress(addressData: Address) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validasi (Sudah Bagus)
  if (!addressData.recipient_name || !addressData.phone_number) {
    return { error: "Nama penerima dan nomor telepon wajib diisi" };
  }
  if (!addressData.street_address) {
    return { error: "Alamat lengkap wajib diisi" };
  }
  if (
    !addressData.district_id ||
    !addressData.city_id ||
    !addressData.province_id
  ) {
    return { error: "Kecamatan, kota, dan provinsi wajib dipilih" };
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      label: addressData.label,
      recipient_name: addressData.recipient_name,
      phone_number: addressData.phone_number,
      province_id: addressData.province_id,
      province_name: addressData.province_name,
      city_id: addressData.city_id,
      city_name: addressData.city_name,
      district_id: addressData.district_id,
      district_name: addressData.district_name,
      village_id: addressData.village_id,
      village_name: addressData.village_name,
      postal_code: addressData.postal_code,
      street_address: addressData.street_address,
      notes: addressData.notes,
      is_primary: addressData.is_primary,
    })
    .select()
    .single();

  if (error) {
    console.error("Insert Error:", error);
    return { error: error.message };
  }

  revalidatePath("/checkout");
  revalidatePath("/profile/addresses");

  return { data };
}

/**
 * Update existing address
 */
export async function updateAddress(addressId: string, addressData: Address) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validation
  if (!addressData.recipient_name || !addressData.phone_number) {
    return { error: "Nama penerima dan nomor telepon wajib diisi" };
  }

  if (!addressData.street_address) {
    return { error: "Alamat lengkap wajib diisi" };
  }

  if (
    !addressData.district_id ||
    !addressData.city_id ||
    !addressData.province_id
  ) {
    return { error: "Kecamatan, kota, dan provinsi wajib dipilih" };
  }

  const { data, error } = await supabase
    .from("addresses")
    .update(addressData)
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/checkout");
  revalidatePath("/profile/addresses");

  return { data };
}

/**
 * Delete address
 */
export async function deleteAddress(addressId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/checkout");
  revalidatePath("/profile/addresses");

  return { success: true };
}

/**
 * Set address as primary
 */
export async function setPrimaryAddress(addressId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // The trigger function will automatically unset other primary addresses
  const { data, error } = await supabase
    .from("addresses")
    .update({ is_primary: true })
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/checkout");
  revalidatePath("/profile/addresses");

  return { data };
}

/**
 * Validate address exists and belongs to user
 */
export async function validateAddress(addressId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { valid: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("addresses")
    .select("id")
    .eq("id", addressId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return { valid: false, error: "Alamat tidak valid" };
  }

  return { valid: true };
}
