"use client";

import { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signup } from "@/services/auth-action";
import { SubmitButton } from "../../../../components/SubmitButton";
import { Label } from "@/components/ui/label";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction] = useActionState(signup, null);
  const [selectedRole, setSelectedRole] = useState("customer");

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Daftar Akun</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Lengkapi data di bawah untuk mulai mengelola gerai Anda
          </p>
        </div>

        {state?.message && (
          <div className="bg-primary/10 p-3 rounded-md text-primary text-sm">
            {state.message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="first-name">Nama Depan</FieldLabel>
            <Input id="first-name" name="first-name" placeholder="Budi" />
            {state?.errors?.firstName && (
              <p className="text-primary text-xs">
                {state.errors.firstName[0]}
              </p>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="last-name">Nama Belakang</FieldLabel>
            <Input id="last-name" name="last-name" placeholder="Santoso" />
            {state?.errors?.lastName && (
              <p className="text-primary text-xs">{state.errors.lastName[0]}</p>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="nama@email.com"
          />
          {state?.errors?.email ? (
            <p className="text-primary text-xs">{state.errors.email[0]}</p>
          ) : (
            <FieldDescription>
              Kami akan mengirimkan konfirmasi ke email ini.
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel>Daftar sebagai</FieldLabel>
          <div className="flex flex-col gap-3 mt-2">
            <Label
              className={cn(
                "flex items-start gap-3 border rounded-xl p-4 cursor-pointer font-normal transition-colors",
                selectedRole === "customer"
                  ? "border-primary bg-orange-50/30"
                  : "hover:bg-muted/50",
              )}
            >
              <input
                type="radio"
                name="role"
                value="customer"
                checked={selectedRole === "customer"}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <div className="grid gap-0.5">
                <span className="text-sm font-medium">Pembeli (Customer)</span>
                <span className="text-xs text-muted-foreground">
                  Langsung belanja produk UMKM favoritmu.
                </span>
              </div>
            </Label>

            <Label
              className={cn(
                "flex items-start gap-3 border rounded-xl p-4 cursor-pointer font-normal transition-colors",
                selectedRole === "merchant"
                  ? "border-primary bg-orange-50/30"
                  : "hover:bg-muted/50",
              )}
            >
              <input
                type="radio"
                name="role"
                value="merchant"
                checked={selectedRole === "merchant"}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <div className="grid gap-0.5">
                <span className="text-sm font-medium">Penjual (Merchant)</span>
                <span className="text-xs text-muted-foreground">
                  Buka gerai dan mulai kelola jualanmu.
                </span>
              </div>
            </Label>
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
          />
          {state?.errors?.password && (
            <p className="text-primary text-xs">{state.errors.password[0]}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirm-password">
            Konfirmasi Kata Sandi
          </FieldLabel>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            placeholder="••••••••"
          />
          {state?.errors?.confirmPassword && (
            <p className="text-primary text-xs">
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </Field>

        <Field className="pt-2">
          <SubmitButton
            loadingText={
              selectedRole === "merchant" ? "Menyiapkan..." : "Mendaftarkan..."
            }
          >
            {selectedRole === "merchant"
              ? "Lanjut Isi Data Toko"
              : "Daftar Sekarang"}
          </SubmitButton>
        </Field>

        <Field>
          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className=" text-primary underline underline-offset-4"
            >
              Masuk di sini
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  );
}
