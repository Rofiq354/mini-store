"use client"; // Wajib agar bisa menampung state error

import { useActionState } from "react"; // Hook untuk menangkap return dari action
import { cn } from "@/lib/utils";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/services/auth-action";
import Link from "next/link";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import { SubmitButton } from "../../../../components/SubmitButton";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  // state berisi return dari server action (error zod, dsb)
  const [state, formAction] = useActionState(login, null);

  return (
    <form
      action={formAction} // Gunakan formAction dari hook
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Selamat Datang!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masukan email dan kata sandi Anda untuk mengelola gerai
          </p>
        </div>

        {/* Error umum (misal user tidak ditemukan) */}
        {state?.message && (
          <div className="bg-primary/10 p-3 rounded-md text-primary text-sm">
            {state.message}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@contoh.com"
          />
          {/* Tampilkan error email di sini */}
          {state?.errors?.email && (
            <p className="text-primary text-xs">{state.errors.email[0]}</p>
          )}
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
            <Link
              href="#"
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Lupa kata sandi?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
          />
          {/* Tampilkan error password di sini */}
          {state?.errors?.password && (
            <p className="text-primary text-xs">{state.errors.password[0]}</p>
          )}
        </Field>

        <Field>
          <SubmitButton>Masuk ke Gerai</SubmitButton>
        </Field>

        <FieldSeparator className="text-muted-foreground text-xs uppercase tracking-widest">
          Atau lanjut dengan
        </FieldSeparator>

        <Field className="flex flex-col gap-4">
          <SignInWithGoogleButton />

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              href="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  );
}
