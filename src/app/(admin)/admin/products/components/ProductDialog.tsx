"use client";

import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "@/services/product-action";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { FormDialog } from "@/components/FormDialog";
import { Pencil, Plus } from "lucide-react";
import { getCategories } from "@/services/category-action";

interface ProductDialogProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: string;
    image_url: string;
  };
}

export function ProductDialog({ initialData }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialData?.category_id || "",
  );

  const isEdit = !!initialData;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    }
    if (open) fetchCategories();
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) return alert("Upload gambar dulu!");
    if (!selectedCategory) return alert("Pilih kategori dulu!");

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category_id: selectedCategory,
      image_url: imageUrl,
    };

    try {
      let result;
      if (isEdit) {
        result = await updateProduct(initialData.id, rawData);
      } else {
        result = await createProduct(rawData);
      }

      if (result?.error) {
        alert(result.error);
      } else {
        setOpen(false);
        if (!isEdit) {
          setImageUrl("");
          setSelectedCategory("");
        }
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
      Tambah Produk
    </Button>
  );

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={isEdit ? "Edit Detail Produk" : "Tambah Produk Baru"}
      description={`Isi formulir di bawah untuk ${isEdit ? "mengubah" : "menambah"} data produk.`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEdit ? "Simpan Perubahan" : "Tambah Produk"}
      submitDisabled={!imageUrl || !selectedCategory}
      size="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Left: Image Upload */}
        <div className="md:col-span-5 space-y-3 md:space-y-4">
          <Label className="font-semibold">Gambar Produk</Label>
          <div className="bg-muted/30 rounded-lg p-4 md:p-6 border-2 border-dashed">
            <ImageUpload
              onUploadSuccess={(url) => setImageUrl(url)}
              defaultValueUrl={isEdit ? initialData.image_url : ""}
            />
            <div className="mt-3 md:mt-4 p-2.5 md:p-3 rounded-md bg-background/50 border text-center">
              <p className="text-xs text-muted-foreground">
                Rekomendasi: 1080x1080 px
                <br />
                Maksimal: 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Right: Form Fields */}
        <div className="md:col-span-7 space-y-3 md:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Produk <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Contoh: Kopi Susu Aren Spesial"
              defaultValue={initialData?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori produk" />
              </SelectTrigger>

              <SelectContent>
                {categories.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center italic">
                    Belum ada kategori...
                  </div>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Harga Jual (Rp) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="0"
                defaultValue={initialData?.price}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">
                Jumlah Stok <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                placeholder="0"
                defaultValue={initialData?.stock}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Deskripsi <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tuliskan keunggulan produk Anda..."
              defaultValue={initialData?.description}
              className="min-h-25 md:min-h-30 resize-none"
              required
            />
          </div>
        </div>
      </div>
    </FormDialog>
  );
}
