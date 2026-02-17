"use client";

import { useActionState, useEffect, useState } from "react";
import { setupShop } from "@/services/setup-shop-action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldDescription,
} from "@/components/ui/field";
import { SubmitButton } from "@/components/SubmitButton";
import { Globe } from "lucide-react";

export default function SetupShopPage() {
  const [state, formAction] = useActionState(setupShop, null);
  const [shopName, setShopName] = useState("");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/^https?:\/\//, "").replace(
        /\/$/,
        "",
      )
    : "market.com";

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  useEffect(() => {
    if (!isCustomSlug) {
      setSlug(slugify(shopName));
    }
  }, [shopName, isCustomSlug]);

  return (
    <div className="max-w-md mx-auto py-12">
      <form action={formAction} className="flex flex-col gap-6">
        <FieldGroup>
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">Siapkan Toko Anda</h1>
            <p className="text-sm text-muted-foreground">
              Sedikit lagi untuk mulai berjualan
            </p>
          </div>

          {/* NAMA TOKO */}
          <Field>
            <FieldLabel htmlFor="shop-name">Nama Toko / UMKM</FieldLabel>
            <Input
              id="shop-name"
              name="shop-name"
              placeholder="Misal: Keripik Berkah Jaya"
              required
            />
            {state?.errors?.shopName && (
              <p className="text-primary text-xs">{state.errors.shopName[0]}</p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="shop-slug">Username / Link Toko</FieldLabel>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-muted-foreground">
                <Globe className="h-4 w-4" />
              </div>
              <Input
                id="shop-slug"
                name="shop-slug"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setIsCustomSlug(true); // User mulai kustom sendiri
                }}
                className="pl-9 font-mono text-sm"
                placeholder="nama-toko-anda"
                required
              />
            </div>
            <FieldDescription>
              Link toko Anda:{" "}
              <span className="text-primary font-medium break-all">
                {siteUrl}/stores/{slug || "..."}
              </span>
            </FieldDescription>
            {state?.errors?.shopSlug && (
              <p className="text-destructive text-xs">
                {state.errors.shopSlug[0]}
              </p>
            )}
          </Field>

          {/* NOMOR WHATSAPP */}
          <Field>
            <FieldLabel htmlFor="phone-number">Nomor WhatsApp Toko</FieldLabel>
            <Input
              id="phone-number"
              name="phone-number"
              type="tel"
              placeholder="Contoh: 08123456789"
              required
            />
            {state?.errors?.phoneNumber && (
              <p className="text-primary text-xs">
                {state.errors.phoneNumber[0]}
              </p>
            )}
            <FieldDescription>
              Nomor ini akan digunakan pelanggan untuk menghubungi Anda
              langsung.
            </FieldDescription>
          </Field>

          {/* DESKRIPSI TOKO */}
          <Field>
            <FieldLabel htmlFor="description">Deskripsi Toko</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Jelaskan apa yang unik dari toko Anda..."
              className="resize-none"
            />
            {state?.errors?.description && (
              <p className="text-primary text-xs">
                {state.errors.description[0]}
              </p>
            )}
          </Field>

          {/* ALAMAT */}
          <Field>
            <FieldLabel htmlFor="address">
              Alamat Bisnis / Pengiriman
            </FieldLabel>
            <Textarea
              id="address"
              name="address"
              placeholder="Alamat lengkap untuk keperluan pengiriman..."
              className="resize-none"
            />
            {state?.errors?.address && (
              <p className="text-primary text-xs">{state.errors.address[0]}</p>
            )}
          </Field>

          {state?.message && (
            <p className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 text-center">
              {state.message}
            </p>
          )}

          <SubmitButton loadingText="Menyimpan...">
            Buka Toko Sekarang
          </SubmitButton>
        </FieldGroup>
      </form>
    </div>
  );
}
