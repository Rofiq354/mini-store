"use client";

import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "@/services/product-action"; // Tambahin updateProduct nanti
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { Pencil } from "lucide-react"; // Buat ikon edit

// 1. Definisikan tipe data props
interface ProductDialogProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image_url: string;
  };
}

export function ProductDialog({ initialData }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");

  // Mode check
  const isEdit = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) return alert("Upload gambar dulu!");

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      category: formData.get("category") as string,
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
        if (!isEdit) setImageUrl("");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>Tambah Produk</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Gambar Produk</Label>
            {/* Kita kasih defaultValueUrl ke ImageUpload supaya pas edit muncul gambar lamanya */}
            <ImageUpload
              onUploadSuccess={(url) => setImageUrl(url)}
              defaultValueUrl={isEdit ? initialData.image_url : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Produk</Label>
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              name="category"
              defaultValue={initialData?.category}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                name="price"
                type="number"
                defaultValue={initialData?.price}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stok</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={initialData?.stock}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description}
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting || !imageUrl}>
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Produk"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
