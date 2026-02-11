import { createClient } from "@/utils/supbase/server";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProductList() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(8)
    .order("created_at", { ascending: false });

  if (error || !products) return null;

  return (
    <section className="py-16 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Produk Terbaru
            </h2>
            <p className="mt-2 text-muted-foreground">
              Temukan barang impianmu dari koleksi UMKM terbaik kami.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-fit border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          >
            Lihat Semua Produk
          </Button>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                    No Image
                  </div>
                )}
                {/* Badge Kategori Melayang */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 backdrop-blur-sm text-orange-600"
                  >
                    {product.category || "Umum"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-4 pb-0">
                <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
              </CardHeader>

              <CardContent className="p-4 pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium text-gray-500">Rp</span>
                  <span className="text-xl font-bold text-gray-900">
                    {product.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-gray-900 hover:bg-orange-600 text-white transition-colors">
                  Tambah Ke Keranjang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
