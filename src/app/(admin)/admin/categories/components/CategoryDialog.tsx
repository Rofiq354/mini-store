"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDialog } from "@/components/FormDialog";
import { Pencil, Plus, Link as LinkIcon } from "lucide-react";
import { createCategory, updateCategory } from "@/services/category-action";

interface CategoryDialogProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
  };
}

export function CategoryDialog({ initialData }: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slug, setSlug] = useState(initialData?.slug || "");
  const isEdit = !!initialData;

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) {
      setSlug(generateSlug(e.target.value));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
    };

    try {
      let result;
      if (isEdit) {
        result = await updateCategory(initialData.id, rawData);
      } else {
        result = await createCategory(rawData);
      }

      if (result?.error) {
        alert(result.error);
      } else {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const trigger = isEdit ? (
    <Button variant="outline" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  ) : (
    <Button className="rounded-xl">
      <Plus className="h-4 w-4 mr-2" />
      Tambah Kategori
    </Button>
  );

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
      description="Gunakan nama yang jelas. Slug akan menentukan ikon yang muncul di halaman utama."
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
      size="sm"
    >
      <div className="space-y-5 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Kategori</Label>
          <Input
            id="name"
            name="name"
            placeholder="Contoh: Sembako Murah"
            defaultValue={initialData?.name}
            onChange={handleNameChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="flex items-center gap-2">
            <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
            Slug (ID Ikon)
          </Label>
          <Input
            id="slug"
            name="slug"
            placeholder="contoh-slug"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            className="bg-muted/50 font-mono text-xs"
            required
          />
          <p className="text-[10px] text-muted-foreground italic">
            *Gunakan slug:{" "}
            <span className="font-bold text-primary">
              sembako, makanan, minuman, snack, frozen
            </span>{" "}
            agar ikon muncul otomatis.
          </p>
        </div>
      </div>
    </FormDialog>
  );
}
