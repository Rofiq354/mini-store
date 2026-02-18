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
    <div className="container mx-auto max-w-7xl px-4 pt-14 pb-10 md:py-8">
      {/* Store Hero Card */}
      <div className="relative mb-10 overflow-hidden rounded-2xl lg:rounded-[2rem] border bg-background shadow-sm">
        {/* Background decorative gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-primary/10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary/40 via-primary to-primary/40" />

        <div className="relative p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-background shadow-xl">
                <AvatarImage src={store.avatar_url} alt={store.shop_name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                  {store.shop_name?.substring(0, 2).toUpperCase() || "ST"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-background shadow-sm" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-0.5">
                  Gerai Resmi
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                  {store.shop_name || store.full_name}
                </h1>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
                {store.description || "Selamat datang di gerai resmi kami."}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-primary" />
                  </div>
                  <span className="truncate max-w-45">
                    {store.business_address || "Lokasi tidak dicantumkan"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-3 w-3 text-primary" />
                  </div>
                  <span>{productCount} Produk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-3 w-3 text-primary" />
                  </div>
                  <span>
                    Bergabung{" "}
                    {store.created_at
                      ? new Date(store.created_at).toLocaleDateString("id-ID", {
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap">
            Produk Gerai
          </h2>
          <div className="h-px flex-1 bg-border" />
          {productCount > 0 && (
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full whitespace-nowrap">
              {productCount} item
            </span>
          )}
        </div>

        {productCount === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-10 w-10 text-primary" />}
            title="Belum Ada Produk"
            description={`Sepertinya ${store.shop_name || "penjual"} belum mengunggah produk ke gerai ini.`}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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
