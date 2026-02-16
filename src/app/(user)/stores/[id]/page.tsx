import { getStoreDetailBySlug } from "@/services/store-action";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Package, Calendar, ShoppingBag } from "lucide-react";
import { notFound } from "next/navigation";

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const { store, products, error } = await getStoreDetailBySlug(slug);

  if (error || !store) {
    notFound();
  }

  const productCount = products?.length || 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-16 pb-8 md:py-8">
      <div className="relative mb-10 overflow-hidden rounded-[2rem] border bg-background p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl md:h-32 md:w-32">
            <AvatarImage src={store.avatar_url} alt={store.shop_name} />
            <AvatarFallback className="text-2xl bg-primary/5 text-primary">
              {store.shop_name?.substring(0, 2).toUpperCase() || "ST"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {store.shop_name || store.full_name}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
              {store.description || "Selamat datang di gerai resmi kami."}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {store.business_address || "Lokasi tidak dicantumkan"}
              </div>
              <div className="flex items-center gap-1.5">
                <Package className="h-4 w-4 text-primary" />
                {productCount} Produk
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                Bergabung{" "}
                {store.created_at
                  ? new Date(store.created_at).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Produk Gerai</h2>
          <div className="h-px flex-1 mx-4 bg-border hidden sm:block" />
        </div>

        {productCount === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-10 w-10 text-primary" />}
            title="Belum Ada Produk"
            description={`Sepertinya ${store.shop_name || "penjual"} belum mengunggah produk ke gerai ini.`}
          />
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products?.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                context="merchant"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
