import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supbase/server";
import { ShoppingBag, Store, Package } from "lucide-react";

export default async function Hero() {
  const supabase = await createClient();

  const [
    {
      data: { user },
    },
    { count: customerCount },
    { count: merchantCount },
    { count: productCount },
    { data: latestMerchants },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "merchant"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("shop_name, avatar_url")
      .eq("role", "merchant")
      .not("shop_name", "is", null)
      .limit(3)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <section className="relative bg-linear-to-b from-primary/5 via-background to-background pb-16 pt-20 sm:pb-20 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-y-12 lg:grid-cols-2 lg:gap-x-16">
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Store className="h-4 w-4 mr-2" />
              Platform UMKM Digital Indonesia
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Belanja Mudah dari{" "}
              <span className="text-primary">Warung Lokal</span> Favoritmu
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Temukan ribuan produk UMKM berkualitas. Fresh, terpercaya, dan
              mendukung ekonomi lokal.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
              {user ? (
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/products">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Mulai Belanja
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link href="/products">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Mulai Belanja
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 hover:text-primary"
                    asChild
                  >
                    <Link href="/signup">
                      <Store className="h-5 w-5 mr-2" />
                      Buka Gerai Gratis
                    </Link>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {latestMerchants?.map((m, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded-full border-2 border-background flex items-center justify-center overflow-hidden text-[10px] font-bold text-primary
                        ${i === 0 ? "bg-primary/20" : i === 1 ? "bg-primary/30" : "bg-primary/40"}`}
                    >
                      {m.avatar_url ? (
                        <img
                          src={m.avatar_url}
                          alt={m.shop_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        m.shop_name?.substring(0, 1).toUpperCase() || "W"
                      )}
                    </div>
                  ))}
                  {merchantCount && merchantCount > 3 && (
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      +{merchantCount - 3}
                    </div>
                  )}
                </div>

                <span className="font-medium">
                  <span className="text-foreground font-bold">
                    {merchantCount || 0}+
                  </span>{" "}
                  Warung Bergabung
                </span>
              </div>

              <div className="h-4 w-px bg-border" />

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>
                  <span className="font-bold text-foreground">
                    {productCount || 0}+
                  </span>{" "}
                  Produk Tersedia
                </span>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto">
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/5 to-transparent rounded-3xl" />

              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                  <Store className="h-12 w-12 text-primary-foreground" />
                </div>

                <h3 className="text-3xl font-black text-foreground">
                  Gerai<span className="text-primary">Ku</span>
                </h3>
                <p className="mt-2 text-muted-foreground font-medium">
                  Marketplace UMKM Digital
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4 w-full">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {merchantCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Warung</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {productCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Produk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {customerCount || 0}+
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pelanggan
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-2">
                  <div className="h-2 w-12 rounded-full bg-primary"></div>
                  <div className="h-2 w-2 rounded-full bg-primary/30"></div>
                  <div className="h-2 w-2 rounded-full bg-primary/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
