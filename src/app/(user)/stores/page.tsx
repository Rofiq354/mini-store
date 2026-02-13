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
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Jelajahi Gerai</h1>
        <p className="mt-2 text-muted-foreground">
          Temukan produk berkualitas langsung dari penjual terpercaya.
        </p>
      </div>

      {stores.length === 0 ? (
        <EmptyState
          icon={<Store className="h-10 w-10 text-primary" />}
          title="Belum Ada Gerai"
          description="Saat ini belum ada penjual yang membuka gerai. Tunggu kejutan menarik dari calon mitra kami!"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Link key={store.id} href={`/stores/${store.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md active:scale-[0.98]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border">
                      <AvatarImage
                        src={store.avatar_url}
                        alt={store.shop_name}
                      />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {store.shop_name?.substring(0, 2).toUpperCase() || "SH"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold truncate">
                        {store.shop_name ||
                          store.full_name ||
                          "Toko Tanpa Nama"}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-10">
                        {store.description || "Belum ada deskripsi toko."}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t pt-4">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span className="truncate max-w-37.5">
                            {store.business_address || "Indonesia"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-primary flex items-center">
                          Lihat Produk <ChevronRight className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </div>
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
