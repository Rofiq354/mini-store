"use client";

import { useEffect, useState } from "react";
import { getAllStores } from "@/services/store-action";
import { Loader2, Store, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/EmptyState";

export default function AllStoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const { data } = await getAllStores();
        setStores(data);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Mencari gerai terbaik...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-16 pb-12 md:py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
          Marketplace Lokal
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Jelajahi Gerai
        </h1>
        <p className="mt-2 text-muted-foreground max-w-lg">
          Temukan produk berkualitas langsung dari penjual terpercaya di sekitar
          kamu.
        </p>
      </div>

      {stores.length === 0 ? (
        <EmptyState
          icon={<Store className="h-10 w-10 text-primary" />}
          title="Belum Ada Gerai"
          description="Saat ini belum ada penjual yang membuka gerai. Tunggu kejutan menarik dari calon mitra kami!"
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/stores/${store.shop_slug || store.id}`}
              className="group"
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] border-border/60 h-full">
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-linear-to-r from-primary/60 via-primary to-primary/40" />

                <CardContent className="p-5">
                  {/* Store identity */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                      <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-sm">
                        <AvatarImage
                          src={store.avatar_url}
                          alt={store.shop_name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                          {store.shop_name?.substring(0, 2).toUpperCase() ||
                            "SH"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator */}
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold truncate group-hover:text-primary transition-colors leading-tight">
                        {store.shop_name ||
                          store.full_name ||
                          "Toko Tanpa Nama"}
                      </h2>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {store.business_address || "Indonesia"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-10 leading-relaxed mb-4">
                    {store.description || "Belum ada deskripsi toko."}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Aktif berjualan
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                      Lihat Produk
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
