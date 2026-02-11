"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supbase/server";
import { loginSchema, signupSchema } from "@/validation/auth.schema";

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validasi Zod
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    validatedFields.data,
  );

  if (error) {
    return {
      message: "Email atau kata sandi salah.",
    };
  }

  const userRole = authData.user?.user_metadata?.role;

  revalidatePath("/", "layout");

  // 4. Redirect berdasarkan role
  if (userRole === "merchant") {
    redirect("/admin/products");
  } else {
    redirect("/");
  }
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // Mapping manual karena nama field di form pakai tanda hubung (-)
  const rawData = {
    firstName: formData.get("first-name"),
    lastName: formData.get("last-name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm-password"),
    role: formData.get("role"),
  };

  const validatedFields = signupSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, firstName, lastName, role } = validatedFields.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
        role,
      },
    },
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath("/", "layout");
  if (role === "merchant") {
    redirect("/admin/setup-shop");
  } else {
    redirect("/");
  }
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}
