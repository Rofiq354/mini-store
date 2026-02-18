import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, TrendingUp, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTopProducts } from "@/services/dashboard-action";
import { formatIDR } from "@/lib/utils";

export default async function TopProducts() {
  const { data: products } = await getTopProducts();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Produk Terlaris</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Berdasarkan jumlah penjualan
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">
            Lihat Semua
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!products || products.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Belum ada data penjualan
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product: any, index: number) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-lg border"
              >
                {/* Rank */}
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                  {index + 1}
                </div>

                {/* Image */}
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {formatIDR(product.price)}
                    </p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <Badge variant="secondary" className="text-xs">
                      {product.total_sold} terjual
                    </Badge>
                  </div>
                </div>

                {/* Revenue */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm">
                    {formatIDR(product.total_revenue)}
                  </p>
                  <div className="flex items-center gap-1 text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-medium">Revenue</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
