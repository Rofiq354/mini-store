import Link from "next/link";
import { createClient } from "@/utils/supbase/server";

export default async function Hero() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="relative bg-white pb-12 pt-10 sm:pb-16 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-y-12 lg:grid-cols-2 lg:gap-x-16">
          {/* Sisi Kiri: Teks & CTA */}
          <div>
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
              🚀 Gerai Digital untuk UMKM Indonesia
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Kelola Gerai Anda, <br />
              <span className="text-orange-600">Mudah & Otomatis</span> <br />
              Bersama GeraiKu.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Ubah cara Anda berjualan. **GeraiKu** hadir sebagai asisten
              digital setia untuk mencatat transaksi, memantau stok, hingga
              menjaga hubungan baik dengan pelanggan setia Anda.
            </p>

            <div className="mt-10 flex items-center gap-x-6">
              {user ? (
                <Link
                  href="/admin/dashboard"
                  className="rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-all"
                >
                  Masuk ke Gerai Saya
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 hover:shadow-none transition-all"
                  >
                    Buka Gerai Sekarang (Gratis)
                  </Link>
                  <Link
                    href="#cara-kerja"
                    className="text-sm font-bold leading-6 text-gray-900 hover:text-orange-600 transition-colors"
                  >
                    Lihat Demo <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Ilustrasi/Gambar Produk */}
          <div className="relative">
            <div className="aspect-square w-full max-w-lg mx-auto bg-gradient-to-tr from-orange-100 via-white to-orange-50 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-orange-100">
              <div className="text-center p-8">
                {/* Ikon Toko Besar */}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-600 shadow-xl shadow-orange-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-black text-gray-900">
                  Gerai<span className="text-orange-600">Ku</span>
                </p>
                <p className="mt-2 text-gray-500 font-medium">
                  Aplikasi Kasir & Inventori UMKM
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <div className="h-2 w-12 rounded-full bg-orange-600"></div>
                  <div className="h-2 w-2 rounded-full bg-orange-200"></div>
                  <div className="h-2 w-2 rounded-full bg-orange-200"></div>
                </div>
              </div>
            </div>

            {/* Dekorasi Floating (Opsional) */}
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-orange-400/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-orange-600/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
