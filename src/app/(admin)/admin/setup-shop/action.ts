"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supbase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { setupShopSchema } from "@/app/validation/auth.schema";

export async function setupShop(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Sesi Anda berakhir, silakan login kembali." };
  }

  const rawData = {
    shopName: formData.get("shop-name"),
    phoneNumber: formData.get("phone-number"),
    description: formData.get("description"),
    address: formData.get("address"),
  };

  const validatedFields = setupShopSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { shopName, phoneNumber, description, address } = validatedFields.data;

  try {
    await prisma.profiles.update({
      where: { id: user.id },
      data: {
        shop_name: shopName,
        phone_number: phoneNumber,
        description: description,
        business_address: address,
        role: "merchant", // Memastikan role-nya terupdate
      },
    });
  } catch (error) {
    return { message: "Database error: Gagal menyimpan profil toko." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}
