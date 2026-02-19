import { getStoreProfile } from "@/services/store-action";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MapPin, Phone, Globe, Edit3, Package } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export default async function AdminStoreProfilePage() {
  const store = await getStoreProfile();

  if (!store) {
    redirect("/");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(
    /^https?:\/\//,
    "",
  ).replace(/\/$/, "");

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/dashboard"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Home className="h-3.5 w-3.5" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1">
              <Store className="h-3.5 w-3.5" />
              Store
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="container mx-auto max-w-5xl py-8 px-4 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-sm">
              <Store className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{store.shop_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="font-mono text-[10px]">
                  @{store.shop_slug}
                </Badge>
                {store.is_verified && (
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/store/edit" className="gap-2">
              <Edit3 className="h-4 w-4" /> Edit Profil Toko
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri: Informasi Utama */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tentang Toko</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                {store.description || "Belum ada deskripsi untuk toko ini."}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lokasi & Operasional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Alamat Bisnis</p>
                    <p className="text-sm text-muted-foreground">
                      {store.business_address || "Alamat belum diatur"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      {store.phone_number}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Quick Stats & Links */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Globe className="h-4 w-4" /> Link Publik
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border text-xs font-mono break-all text-primary underline">
                    <Link href={`/stores/${store.shop_slug}`} target="_blank">
                      {siteUrl}/stores/{store.shop_slug}
                    </Link>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    *Gunakan link ini untuk promosi di sosial media Anda.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status Akun</p>
                    <p className="font-bold">
                      {store.is_active ? "Toko Aktif" : "Toko Libur"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
