import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email tidak boleh kosong" })
    .email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "Nama depan minimal 2 karakter"),
    lastName: z.string().min(2, "Nama belakang minimal 2 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
    role: z.enum(["customer", "merchant"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const setupShopSchema = z.object({
  shopName: z.string()
    .min(3, "Nama toko minimal 3 karakter")
    .max(50, "Nama toko terlalu panjang"),
  phoneNumber: z.string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .regex(/^[0-9]+$/, "Nomor WhatsApp hanya boleh angka saja"),
  description: z.string()
    .min(20, "Deskripsi minimal 20 karakter agar pembeli lebih percaya")
    .max(500, "Deskripsi jangan lebih dari 500 karakter"),
  address: z.string()
    .min(10, "Alamat lengkap memudahkan kurir menjemput barang"),
});