"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDialog } from "@/components/FormDialog";
import { Pencil, Plus } from "lucide-react";
import { createCategory, updateCategory } from "@/services/category-action";

interface CategoryDialogProps {
  initialData?: {
    id: string;
    name: string;
  };
}

export function CategoryDialog({ initialData }: CategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get("name") as string,
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
    <Button>
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
      description={`Isi formulir di bawah untuk ${isEdit ? "mengubah" : "menambah"} kategori produk.`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
      size="sm"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nama Kategori <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Contoh: Makanan, Minuman, Dessert"
            defaultValue={initialData?.name}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Pastikan nama kategori belum pernah digunakan sebelumnya.
        </p>
      </div>
    </FormDialog>
  );
}
