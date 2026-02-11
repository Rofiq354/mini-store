import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Makanan",
    icon: "🍔",
    href: "/kategori/makanan",
    color: "from-orange-500/10 to-orange-500/5",
    count: 245,
  },
  {
    name: "Minuman",
    icon: "🥤",
    href: "/kategori/minuman",
    color: "from-blue-500/10 to-blue-500/5",
    count: 189,
  },
  {
    name: "Snack",
    icon: "🍿",
    href: "/kategori/snack",
    color: "from-yellow-500/10 to-yellow-500/5",
    count: 312,
  },
  {
    name: "Sembako",
    icon: "🌾",
    href: "/kategori/sembako",
    color: "from-green-500/10 to-green-500/5",
    count: 156,
  },
  {
    name: "Bumbu",
    icon: "🧂",
    href: "/kategori/bumbu",
    color: "from-red-500/10 to-red-500/5",
    count: 98,
  },
  {
    name: "Frozen Food",
    icon: "🧊",
    href: "/kategori/frozen",
    color: "from-cyan-500/10 to-cyan-500/5",
    count: 127,
  },
  {
    name: "Kebutuhan Rumah",
    icon: "🏠",
    href: "/kategori/rumah-tangga",
    color: "from-purple-500/10 to-purple-500/5",
    count: 203,
  },
  {
    name: "Lainnya",
    icon: "📦",
    href: "/kategori",
    color: "from-gray-500/10 to-gray-500/5",
    count: 432,
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Jelajahi Kategori
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Temukan produk dari berbagai kategori pilihan
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div
                    className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br ${category.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <span className="text-4xl">{category.icon}</span>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.count} produk
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Link
            href="/kategori"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            Lihat Semua Kategori
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
