import { createClient } from "@/utils/supbase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./components/LoginForm";
import { AuthLayout } from "@/app/(auth)/components/AuthLayout";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return (
    <AuthLayout
      title={
        <>
          Mulai Langkah Digital <br /> Gerai Anda Bersama Kami.
        </>
      }
      description="Kelola stok, pantau penjualan, dan kembangkan usaha dalam satu genggaman."
    >
      <LoginForm />
    </AuthLayout>
  );
}
