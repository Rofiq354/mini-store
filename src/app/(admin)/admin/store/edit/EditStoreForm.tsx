"use client";

import { useActionState, useState, useEffect } from "react";
import { updateStoreProfile } from "@/services/store-action";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { SubmitButton } from "@/components/SubmitButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Globe, MessageCircle, Store, MapPin } from "lucide-react";

export default function EditStoreForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateStoreProfile, null);

  // States untuk sinkronisasi slug
  const [shopName, setShopName] = useState(initialData.shop_name || "");
  const [slug, setSlug] = useState(initialData.shop_slug || "");
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

  // Sync slug hanya jika user belum pernah edit manual slug-nya
  useEffect(() => {
    if (!isCustomSlug && shopName !== initialData.shop_name) {
      setSlug(slugify(shopName));
    }
  }, [shopName, isCustomSlug, initialData.shop_name]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin/store");
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form
      action={formAction}
      className="space-y-8 bg-card p-6 rounded-xl border shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* NAMA TOKO */}
        <Field className="space-y-2">
          <FieldLabel className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" /> Nama Toko
          </FieldLabel>
          <Input
            name="shopName"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Contoh: Berkah Food"
            required
          />
          {state?.errors?.shopName && (
            <p className="text-destructive text-[10px] font-medium">
              {state.errors.shopName[0]}
            </p>
          )}
        </Field>

        {/* SLUG TOKO */}
        <Field className="space-y-2">
          <FieldLabel className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" /> Slug / URL Toko
          </FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
              /
            </span>
            <Input
              name="shopSlug"
              className="pl-6 font-mono text-sm"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setIsCustomSlug(true);
              }}
              required
            />
          </div>
          <FieldDescription className="text-[10px] truncate">
            URL:{" "}
            <span className="text-primary font-mono">
              {siteUrl}/stores/{slug || "..."}
            </span>
          </FieldDescription>
          {state?.errors?.shopSlug && (
            <p className="text-destructive text-[10px] font-medium">
              {state.errors.shopSlug[0]}
            </p>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* WHATSAPP */}
        <Field className="space-y-2">
          <FieldLabel className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" /> WhatsApp
          </FieldLabel>
          <Input
            name="phoneNumber"
            defaultValue={initialData.phone_number}
            placeholder="0812..."
            type="tel"
            required
          />
          {state?.errors?.phoneNumber && (
            <p className="text-destructive text-[10px] font-medium">
              {state.errors.phoneNumber[0]}
            </p>
          )}
        </Field>

        {/* DESKRIPSI (Singkat) */}
        <Field className="space-y-2">
          <FieldLabel>Tagline / Deskripsi Singkat</FieldLabel>
          <Input
            name="description"
            defaultValue={initialData.description}
            placeholder="Jelaskan tokomu dalam 1 kalimat..."
          />
        </Field>
      </div>

      {/* ALAMAT LENGKAP */}
      <Field className="space-y-2">
        <FieldLabel className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" /> Alamat Bisnis
          Lengkap
        </FieldLabel>
        <Textarea
          name="address"
          defaultValue={initialData.business_address}
          placeholder="Tuliskan alamat lengkap untuk keperluan pengiriman dan pickup..."
          rows={3}
          className="resize-none"
        />
        {state?.errors?.address && (
          <p className="text-destructive text-[10px] font-medium">
            {state.errors.address[0]}
          </p>
        )}
      </Field>

      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 mt-4 border-t border-dashed">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="w-full sm:w-auto text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
        >
          Batal
        </Button>

        <SubmitButton className="w-full sm:w-40 shadow-sm hover:shadow-md transition-shadow duration-200">
          Simpan Perubahan
        </SubmitButton>
      </div>
    </form>
  );
}
