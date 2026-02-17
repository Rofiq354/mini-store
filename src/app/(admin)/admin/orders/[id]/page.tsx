import { getOrderDetail } from "@/services/order-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowLeft,
  Printer,
  Calendar,
  MessageCircle,
  Store,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cn, formatIDR } from "@/lib/utils";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import OrderStatusTimeline from "@/app/(user)/orders/[id]/components/OrderStatusTimeline";
import UpdateStatusForm from "./components/UpdateStatusForm";
import { Badge } from "@/components/ui/badge";
import CopyAddressButton from "./components/CopyAddressButton";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: order, error } = await getOrderDetail(id);

  if (error || !order) notFound();

  const statusConfig = {
    pending_payment: {
      label: "Menunggu Pembayaran",
      color: "bg-amber-500",
      bgColor: "bg-amber-50", // Background halus
      textColor: "text-amber-700", // Teks kontras
      icon: Clock,
    },
    paid: {
      label: "Dibayar",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      icon: CheckCircle2,
    },
    processing: {
      label: "Diproses",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      icon: Package,
    },
    ready_to_ship: {
      label:
        order.delivery_method === "pickup" ? "Siap Diambil" : "Siap Dikirim",
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      icon: Truck,
    },
    shipped: {
      label: "Dalam Pengiriman",
      color: "bg-cyan-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      icon: Truck,
    },
    delivered: {
      label:
        order.delivery_method === "pickup" ? "Sudah Diambil" : "Sudah Diterima",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      icon: CheckCircle2,
    },
    completed: {
      label: "Selesai",
      color: "bg-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "Dibatalkan",
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      icon: XCircle,
    },
    failed: {
      label: "Gagal",
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      icon: XCircle,
    },
  };

  const currentStatus =
    statusConfig[order.status as keyof typeof statusConfig] ||
    statusConfig.pending_payment;
  const StatusIcon = currentStatus.icon;

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
            <BreadcrumbLink
              href="/admin/orders"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Truck className="h-3.5 w-3.5" />
              Daftar Pesanan
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              Order #{order.order_number.slice(-8).toUpperCase()}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Link>
          </Button>

          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="overflow-hidden border-none py-0 shadow-sm ring-1 ring-border">
              <div
                className={cn(
                  "p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors",
                  currentStatus.bgColor,
                )}
              >
                <div className="flex items-center gap-4 w-full min-w-0">
                  {/* Status Icon */}
                  <div
                    className={cn(
                      "p-2.5 rounded-xl shadow-sm text-white shrink-0",
                      currentStatus.color,
                    )}
                  >
                    <StatusIcon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1
                        className={cn(
                          "text-lg font-bold tracking-tight",
                          currentStatus.textColor,
                        )}
                      >
                        {currentStatus.label}
                      </h1>
                      <Badge
                        variant="outline"
                        className="font-mono bg-background/50 border-border text-[10px] px-1.5 py-0"
                      >
                        {order.order_number}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(
                          new Date(order.created_at),
                          "dd MMM yyyy • HH:mm",
                          { locale: idLocale },
                        )}
                      </span>
                      <span className="opacity-40">|</span>
                      <span className="capitalize font-semibold text-foreground/60 tracking-wide">
                        {order.delivery_method === "pickup"
                          ? "Ambil di Tempat"
                          : "Pengiriman Kurir"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Area */}
              <CardContent className="p-6 bg-card border-t border-dashed">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-px w-12 bg-border" />
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] whitespace-nowrap">
                      Log Progres Pesanan
                    </p>
                    <div className="h-px w-12 bg-border" />
                  </div>

                  <OrderStatusTimeline
                    currentStatus={order.status}
                    deliveryMethod={order.delivery_method}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border py-0">
              <CardHeader className="bg-muted/30 py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                  <User className="h-4 w-4" />
                  Informasi Customer
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    {/* Nama & Avatar Placeholder */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {order.profiles?.full_name?.charAt(0) || "C"}
                      </div>
                      <div>
                        <p className="font-bold text-foreground leading-none">
                          {order.profiles?.full_name || "Nama tidak tersedia"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Customer ID: {order.user_id.split("-")[0]}...
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Email */}
                      <div className="flex items-center gap-3 group">
                        <div className="p-2 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                          <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">
                            Email
                          </span>
                          <span className="text-sm font-medium break-all">
                            {order.profiles?.email || "Email tidak tersedia"}
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp / Phone */}
                      {order.profiles?.phone_number && (
                        <div className="flex items-center gap-3 group">
                          <div className="p-2 rounded-md bg-muted group-hover:bg-green-500/10 transition-colors">
                            <Phone className="h-4 w-4 text-muted-foreground group-hover:text-green-600" />
                          </div>
                          <div className="flex flex-col flex-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">
                              WhatsApp / No. Telp
                            </span>
                            <span className="text-sm font-medium">
                              {order.profiles.phone_number}
                            </span>
                          </div>

                          {/* Quick Action: Chat WA */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            asChild
                          >
                            <a
                              href={`https://wa.me/${order.profiles.phone_number.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-sm border-muted-foreground/10 py-0">
              <CardHeader className="bg-muted/30 py-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-base">
                    <MapPin className="h-5 w-5 text-primary" />
                    {order.delivery_method === "delivery"
                      ? "Detail Pengiriman"
                      : "Metode Pengambilan"}
                  </div>
                  <Badge
                    variant={
                      order.delivery_method === "delivery"
                        ? "default"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {order.delivery_method}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="py-6">
                {order.delivery_method === "delivery" && order.addresses ? (
                  <div className="space-y-6">
                    {/* Nama & Kontak */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Penerima
                        </p>
                        <p className="font-bold text-lg">
                          {order.addresses.recipient_name}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Phone className="h-3.5 w-3.5" />
                          <span className="text-sm">
                            {order.addresses.phone_number}
                          </span>
                        </div>
                      </div>
                      {/* Tombol Copy Alamat untuk Admin */}
                      <CopyAddressButton address={order.addresses} />
                    </div>

                    {/* Alamat Lengkap */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                        Alamat Lengkap
                      </p>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {order.addresses.street_address}
                        <br />
                        <span className="font-semibold text-slate-900">
                          {order.addresses.district_name},{" "}
                          {order.addresses.city_name}
                        </span>
                        <br />
                        {order.addresses.province_name},{" "}
                        {order.addresses.postal_code}
                      </p>
                    </div>

                    {/* Informasi Logistik */}
                    {order.shipping_courier && (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">
                            Kurir & Layanan
                          </p>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-blue-600" />
                            <p className="text-sm font-bold uppercase italic">
                              {order.shipping_courier}{" "}
                              <span className="text-blue-600">
                                ({order.shipping_service})
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">
                            Nomor Resi
                          </p>
                          {order.tracking_number ? (
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                {order.tracking_number}
                              </code>
                            </div>
                          ) : (
                            <p className="text-sm text-amber-600 font-medium italic">
                              Resi belum diinput
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* UI KHUSUS PICKUP */
                  <div className="relative overflow-hidden p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="relative z-10 flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Store className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-emerald-900">
                          Self Pickup (Ambil Sendiri)
                        </h4>
                        <p className="text-sm text-emerald-700 leading-relaxed">
                          Customer memilih untuk mengambil pesanan langsung di
                          lokasi Anda. Pastikan status diubah menjadi{" "}
                          <span className="font-bold">Ready for Pickup</span>{" "}
                          agar customer mendapat notifikasi.
                        </p>
                        <div className="pt-3 flex items-center gap-4">
                          <div className="text-[11px] font-bold bg-white/50 px-2 py-1 rounded border border-emerald-200 text-emerald-800">
                            PEMBAYARAN: {order.payment_method?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Background Decorative Icon */}
                    <Store className="absolute -right-4 -bottom-4 h-24 w-24 text-emerald-200/50 -rotate-12" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Daftar Produk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        {item.product_image_url ? (
                          <Image
                            src={item.product_image_url}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-2">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.quantity} x {formatIDR(item.price_at_time)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold">{formatIDR(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatIDR(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="font-medium">
                      {order.shipping_cost === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatIDR(order.shipping_cost)
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">
                      {formatIDR(order.total_price)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {(order.customer_notes || order.admin_notes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Catatan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.customer_notes && (
                    <div>
                      <p className="text-sm font-semibold mb-1">
                        Catatan Customer:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_notes}
                      </p>
                    </div>
                  )}
                  {order.admin_notes && (
                    <div>
                      <p className="text-sm font-semibold mb-1">
                        Catatan Admin:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.admin_notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Update Status */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <UpdateStatusForm order={order} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
