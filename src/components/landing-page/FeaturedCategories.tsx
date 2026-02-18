import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { getAllUniqueCategories } from "@/services/category-action";
import { EmptyState } from "../EmptyState";

const categoryStyleMap: Record<string, { icon: string; color: string }> = {
  // --- Kebutuhan Pokok ---
  sembako: { icon: "🌾", color: "from-green-500/10 to-green-500/5" },
  "mie-instan": { icon: "🍜", color: "from-yellow-600/10 to-yellow-600/5" },

  // --- Konsumsi ---
  makanan: { icon: "🍱", color: "from-orange-500/10 to-orange-500/5" },
  minuman: { icon: "🥤", color: "from-blue-500/10 to-blue-500/5" },
  snack: { icon: "🍿", color: "from-amber-500/10 to-amber-500/5" },
  bumbu: { icon: "🧂", color: "from-red-500/10 to-red-500/5" },

  // --- Kebersihan & Perawatan ---
  "sabun-kebersihan": { icon: "🧼", color: "from-cyan-500/10 to-cyan-500/5" },
  "perawatan-tubuh": { icon: "🧴", color: "from-pink-500/10 to-pink-500/5" },

  // --- Rumah Tangga ---
  "kebutuhan-rumah": {
    icon: "🧹",
    color: "from-purple-500/10 to-purple-500/5",
  },
  "obat-obatan": { icon: "💊", color: "from-emerald-500/10 to-emerald-500/5" },

  // --- Tambahan UMKM ---
  frozen: { icon: "🧊", color: "from-sky-500/10 to-sky-500/5" },
  "rokok-korek": { icon: "🔥", color: "from-slate-500/10 to-slate-500/5" },
};

export default async function FeaturedCategories() {
  const categoriesData = await getAllUniqueCategories();

  const knownCategories: any[] = [];
  const unknownCategories: any[] = [];

  categoriesData.forEach((cat) => {
    if (categoryStyleMap[cat.id]) {
      knownCategories.push(cat);
    } else {
      unknownCategories.push(cat);
    }
  });

  let displayed = [...knownCategories];

  if (unknownCategories.length > 0) {
    displayed.push({
      id: "others",
      label: "Produk Lainnya",
      isOther: true,
      count: unknownCategories.length,
    });
  }

  const displayedCategories = displayed.slice(3, 12);

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Jelajahi Kategori
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Temukan produk pilihan dari kategori favoritmu
          </p>
        </div>

        {displayedCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {displayedCategories.map((cat) => {
              if (cat.isOther) {
                return (
                  <Link key="others" href="/products">
                    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-2xl md:rounded-3xl bg-muted/50">
                      <CardContent className="p-4 md:p-6 text-center">
                        <div className="mx-auto mb-3 md:mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-xl md:rounded-2xl bg-linear-to-br from-gray-500/10 to-gray-500/5 transition-transform duration-300 group-hover:scale-110">
                          <span className="text-3xl md:text-4xl">📦</span>
                        </div>

                        <h3 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {cat.label}
                        </h3>

                        <p className="mt-1 text-[10px] md:text-xs text-primary font-bold uppercase tracking-wider">
                          {cat.count}+ Kategori
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }

              const style = categoryStyleMap[cat.id];
              return (
                <Link key={cat.id} href={`/products?category=${cat.id}`}>
                  <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-2xl md:rounded-3xl">
                    <CardContent className="p-4 md:p-6 text-center">
                      <div
                        className={`mx-auto mb-3 md:mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-xl md:rounded-2xl bg-linear-to-br ${style.color} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <span className="text-3xl md:text-4xl">
                          {style.icon}
                        </span>
                      </div>

                      <h3 className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {cat.label}
                      </h3>

                      <p className="mt-1 text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        Cek Produk
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<span className="text-4xl">🏪</span>}
            title="Kategori Belum Tersedia"
            description="Saat ini belum ada kategori produk yang tersedia dari warung-warung mitra. Silakan kembali lagi nanti!"
            className="rounded-3xl bg-muted/20"
          />
        )}

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
          >
            Lihat Semua Kategori
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
