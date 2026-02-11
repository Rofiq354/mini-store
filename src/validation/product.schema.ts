import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  price: z.coerce
    .number({
      error: "Harga wajib diisi",
    })
    .min(100, "Harga minimal Rp 100"),

  stock: z.coerce
    .number({
      error: "Stok wajib diisi",
    })
    .min(0, "Stok tidak boleh negatif"),

  category: z.string().min(1, "Pilih kategori produk"),
  image: z.string().min(1, "Gambar produk wajib diunggah"),
});

export type ProductFormValues = z.input<typeof productSchema>;
export type ProductInput = z.output<typeof productSchema>;
