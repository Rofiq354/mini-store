import { SignupForm } from "@/app/(auth)/signup/components/SignupForm";
import { createClient } from "@/utils/supbase/server";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/app/(auth)/components/AuthLayout";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthLayout
      title={
        <>
          Gabung & Kembangkan <br /> Gerai Anda Sekarang.
        </>
      }
      description="Daftar dalam hitungan detik dan nikmati semua fitur manajemen UMKM yang memudahkan bisnis Anda."
    >
      <SignupForm />
    </AuthLayout>
  );
}
