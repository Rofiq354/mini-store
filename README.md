# 🏪 GeraiKu - Digital Store Management

<div align="center">

<!-- ![GeraiKu Logo](https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=GeraiKu) -->
<img src="public/icons/logo.svg" alt="GeraiKu Logo" width="100" />

**Solusi Digital untuk UMKM Indonesia** 🇮🇩

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Zod-3068b7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Biome](https://img.shields.io/badge/Biome-60a5fa?style=for-the-badge&logo=biome&logoColor=white)](https://biomejs.dev/)

_Platform manajemen toko & kasir digital yang membantu pedagang kecil mengelola bisnis dengan lebih mudah_

[Demo](#) • [Documentation](#) • [Report Bug](#)

</div>

---

## 📖 Tentang Project

**GeraiKu** adalah aplikasi Point of Sale (POS) dan inventory management yang dirancang khusus untuk UMKM dan warung tradisional Indonesia. Dengan antarmuka yang sederhana namun powerful, GeraiKu membantu pedagang:

- ✅ Mencatat transaksi penjualan secara digital
- 📦 Mengelola stok barang dengan mudah
- 💰 Memantau pendapatan harian/bulanan
- 📊 Mendapatkan insights bisnis yang berguna

### 🎯 Target Pengguna

- **Merchant**: Pemilik warung, toko kelontong, UMKM
- **Customer**: Pembeli yang berbelanja di toko merchant

---

## 🚀 Tech Stack

### Frontend

- **Next.js 16** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Beautiful & accessible components

### Backend & Database

- **Supabase** - PostgreSQL database + Auth + Storage
- **Supabase Auth** - Authentication dengan PKCE flow
- **Prisma ORM** - Type-safe database client for manage schema and query
- **Row Level Security (RLS)** - Data security per user

### Tools & Utilities

- **Zod** - TypeScript-first schema validation for form and API
- **Biome** - High-performance linter & formatter (pengganti ESLint & Prettier)
- **Vercel** - Deployment platform

---

## 📅 Development Progress

### 🗓️ Week 1: Foundation & Core Features

<details open>
<summary><strong>📍 Day 1 - Authentication System</strong> ✅</summary>

#### ✨ What's Done

- [x] Supabase project setup & configuration
- [x] Database schema design (initial tables)
- [x] Authentication flow implementation
  - Sign up (Email/Password)
  - Sign in (Email/Password + Google OAuth)
  - Email verification
  - Password reset
- [x] User roles system (Customer & Merchant)
- [x] Protected routes with middleware
- [x] Auth UI components with Shadcn
  - Login form
  - Register form
  - Role selection

#### 🐛 Known Issues

- [ ] Google OAuth redirect needs production URL setup
- [ ] Email verification template customization pending

</details>

<details>
<summary><strong>📍 Day 2 - Product Catalog</strong> ⏳ (In Progress)</summary>

#### 🎯 Goals

- [ ] Product CRUD operations
- [ ] Image upload to Supabase Storage
- [ ] Product categories
- [ ] Low stock alerts
- [ ] Search & filter functionality

</details>

<details>
<summary><strong>📍 Day 3 - POS System</strong> 🔜</summary>

#### 🎯 Planned Features

- [ ] Transaction creation
- [ ] Cart management
- [ ] Multiple payment methods
- [ ] Receipt generation
- [ ] Stock auto-deduction

</details>

<details>
<summary><strong>📍 Day 4 - Sales Dashboard</strong> 🔜</summary>

#### 🎯 Planned Features

- [ ] Revenue charts
- [ ] Transaction history
- [ ] Top products analytics
- [ ] Daily/monthly reports

</details>

<details>
<summary><strong>📍 Day 5 - Customer Features</strong> 🔜</summary>

#### 🎯 Planned Features

- [ ] Product browsing
- [ ] Shopping cart
- [ ] Order placement
- [ ] Order history

</details>

<details>
<summary><strong>📍 Day 6 - Polish & Testing</strong> 🔜</summary>

#### 🎯 Planned Features

- [ ] Mobile responsiveness check
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] User testing feedback

</details>

<details>
<summary><strong>📍 Day 7 - Deployment</strong> 🔜</summary>

#### 🎯 Planned Features

- [ ] Production environment setup
- [ ] Vercel deployment
- [ ] Domain configuration
- [ ] Documentation finalization

</details>

---

## 🗄️ Database Schema (Supabase/PostgreSQL)

```sql
-- Core Tables

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  stock integer DEFAULT 0 CHECK (stock >= 0),
  category text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  email text UNIQUE,
  phone_number text,
  avatar_url text,
  role USER-DEFINED DEFAULT 'customer'::user_role,
  shop_name text,
  business_address text,
  updated_at timestamp with time zone DEFAULT now(),
  description text,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.transaction_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_time numeric NOT NULL,
  CONSTRAINT transaction_items_pkey PRIMARY KEY (id),
  CONSTRAINT transaction_items_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id),
  CONSTRAINT transaction_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL,
  total_price numeric NOT NULL DEFAULT 0,
  payment_method text DEFAULT 'cash'::text CHECK (payment_method = ANY (ARRAY['cash'::text, 'transfer'::text, 'qris'::text])),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.profiles(id)
);
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Git installed

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rofiq354/mini-store.git
   cd geraiku
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser 🎉

---

## 📁 Project Structure

```
geraiku/
├── app/
│   ├── (auth)/                # Route Group untuk login & register
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (admin)/               # Route Group khusus Admin
│   │   ├── dashboard/
│   ├── (user)/                # Route Group khusus User/Customer
│   │   ├── profile/
│   │   └── orders/
│   ├── validation/            # Folder untuk skema Zod
│   │   └── auth.schema.ts
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx               # Landing page utama
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── Logo.tsx               # Komponen Logo
│   └── Navbar.tsx             # Komponen Navbar
├── lib/
│   ├── supabase/              # Konfigurasi Supabase
│   │   ├── client.ts
│   │   └── server.ts
│   ├── prisma.ts              # Database client
│   └── utils.ts               # Utility (cn untuk Tailwind, dll)
└── types/                     # TypeScript types/interfaces
```

---

## 🎨 Design Principles

### Mobile-First 📱

Pedagang lebih sering menggunakan HP daripada laptop - UI dioptimalkan untuk layar kecil terlebih dahulu.

### High Contrast 🌞

Mudah dibaca di bawah sinar matahari (penting untuk pedagang pasar/kaki lima).

### Minimalist ✨

Menghindari istilah akuntansi yang rumit. Gunakan bahasa sehari-hari:

- ✅ "Uang Masuk" (bukan "Revenue")
- ✅ "Barang Terjual" (bukan "Items Sold")
- ✅ "Stok Menipis" (bukan "Low Inventory Alert")

---

## 🗺️ Roadmap

### Phase 1: MVP (Week 1) 🎯

- [x] Authentication system
- [ ] Product management
- [ ] Basic POS
- [ ] Sales dashboard

### Phase 2: Enhancement (Week 2)

- [ ] Advanced analytics
- [ ] Multi-store support
- [ ] Employee management
- [ ] Expense tracking

### Phase 3: Advanced Features (Week 3)

- [ ] Mobile app (React Native)
- [ ] Loyalty program
- [ ] WhatsApp integration
- [ ] Payment gateway integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ainur Rofiq**

- GitHub: [@Rofiq354](https://github.com/Rofiq354)
- Email: rofik010206@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

<div align="center">

**Made with ❤️ for Indonesian UMKM**

⭐ Star this repo if you find it helpful!

</div>
