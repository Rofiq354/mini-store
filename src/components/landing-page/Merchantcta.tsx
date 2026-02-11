import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";

export default function MerchantCTA() {
  return (
    <section className="py-20 bg-linear-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Store className="h-4 w-4 mr-2" />
              Untuk Pedagang UMKM
            </div>

            <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              Punya Warung?
              <br />
              <span className="text-primary">Digitalisasi Sekarang!</span>
            </h2>

            <p className="mt-6 text-lg text-muted-foreground">
              Bergabunglah dengan ratusan pedagang UMKM yang telah meningkatkan
              penjualan mereka hingga 3x lipat dengan GeraiKu. Gratis selamanya!
            </p>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Setup Cepat 5 Menit
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Buat toko online Anda dalam hitungan menit, tanpa ribet
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Jangkauan Lebih Luas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Produk Anda bisa dilihat ribuan pembeli potensial
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Kelola Stok & Transaksi
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dashboard lengkap untuk pantau bisnis Anda real-time
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">
                  <Store className="h-5 w-5 mr-2" />
                  Buka Gerai Gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#cara-kerja">
                  Lihat Cara Kerja
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Stats Card */}
          <div className="lg:ml-auto">
            <div className="relative rounded-2xl bg-card border shadow-xl p-8 space-y-6">
              {/* Title */}
              <div className="text-center pb-4 border-b">
                <h3 className="text-2xl font-bold text-foreground">
                  Kenapa Bergabung?
                </h3>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-3xl font-black text-primary">100+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Warung Aktif
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-3xl font-black text-primary">5K+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Pembeli Setia
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-3xl font-black text-primary">1K+</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Produk Terjual/Hari
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-3xl font-black text-primary">0%</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Biaya Bulanan
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="pt-4 border-t">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    B
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground italic">
                      "Sejak pakai GeraiKu, penjualan saya naik 3x lipat.
                      Mantap!"
                    </p>
                    <p className="text-xs font-semibold text-foreground mt-2">
                      - Bu Siti, Warung Siti Barokah
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
