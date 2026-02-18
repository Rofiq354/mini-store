import { getProductDetail } from "@/services/product-action";
import { getProductsAction } from "@/services/product-action";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Store, Package, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: product, error } = await getProductDetail(id);

  if (error || !product) notFound();

  const { data: relatedProducts } = await getProductsAction({
    categoryId: product.categories?.slug,
    limit: 4,
  });

  const filteredRelated = relatedProducts.filter((p: any) => p.id !== id);

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-14 pb-8 md:py-8">
      <Button
        variant="ghost"
        asChild
        className="mb-4 ml-0 lg:-ml-4 text-muted-foreground hover:text-primary transition-colors"
      >
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl lg:rounded-[2rem] border bg-white">
          <Image
            src={product.image_url || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-contain p-6 lg:p-8"
            priority
          />
        </div>

        {/* Detail */}
        <div className="flex flex-col space-y-4 lg:space-y-6">
          <div className="space-y-1.5">
            <Badge variant="secondary" className="rounded-full">
              {product.categories?.name}
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
          </div>

          <div className="text-2xl lg:text-3xl font-bold text-primary">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-semibold text-base lg:text-lg">
              Deskripsi Produk
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description || "Tidak ada deskripsi untuk produk ini."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 lg:p-4 rounded-xl bg-gray-50 border">
              <Package className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Stok Tersedia
                </p>
                <p className="font-bold text-sm">{product.stock} Unit</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 lg:p-4 rounded-xl bg-gray-50 border">
              <ShieldCheck className="h-4 w-4 lg:h-5 lg:w-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Status Produk
                </p>
                <p className="font-bold text-sm">
                  {product.stock > 10
                    ? "Tersedia"
                    : product.stock > 0
                      ? "Stok Terbatas"
                      : "Habis"}
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/stores/${product.profiles?.shop_slug}`}
            className="group p-3 lg:p-4 rounded-2xl border hover:border-primary transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Store className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Penjual</p>
                  <p className="font-bold text-sm group-hover:underline">
                    {product.profiles?.shop_name}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
              >
                Kunjungi Toko
              </Button>
            </div>
          </Link>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock,
              image_url: product.image_url,
              merchant_id: product.merchant_id,
              merchant_name:
                product.store_name || product.profiles?.shop_name || "Toko",
            }}
            size="lg"
            buttonLabel="Tambah ke Keranjang"
            className="w-full h-12 lg:h-14 text-base lg:text-lg shadow-lg shadow-primary/20"
          />
        </div>
      </div>

      {filteredRelated.length > 0 && (
        <div className="mt-12 lg:mt-20 space-y-6 lg:space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl lg:text-2xl font-bold">Produk Serupa</h2>
            <Link
              href="/products"
              className="text-primary text-sm font-medium hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredRelated.map((p: any) => (
              <ProductCard key={p.id} product={p} context="products" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
