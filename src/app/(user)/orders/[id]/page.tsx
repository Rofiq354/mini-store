import { getOrderDetail } from "@/services/order-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ArrowLeft,
  Store,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cn, formatIDR } from "@/lib/utils";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import PayButton from "./components/PayButton";
import OrderStatusTimeline from "./components/OrderStatusTimeline";
import CancelOrderButton from "./components/CancelOrderButton";
import { CopyTrackingButton } from "./components/CopyTrackingButton";
import OrderStatusWatcher from "./components/OrderStatusWatcher";

export default async function OrderDetailPage({
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
      icon: Clock,
      textColor: "text-amber-900",
      bgColor: "bg-amber-50",
    },
    paid: {
      label: "Dibayar",
      color: "bg-blue-500",
      icon: CheckCircle2,
      textColor: "text-blue-900",
      bgColor: "bg-blue-50",
    },
    processing: {
      label: "Diproses",
      color: "bg-purple-500",
      icon: Package,
      textColor: "text-purple-900",
      bgColor: "bg-purple-50",
    },
    ready_to_ship: {
      label:
        order.delivery_method === "pickup" ? "Siap Diambil" : "Siap Dikirim",
      color: "bg-indigo-500",
      icon: order.delivery_method === "pickup" ? Store : Truck,
      textColor: "text-indigo-900",
      bgColor: "bg-indigo-50",
    },
    shipped: {
      label: "Dalam Pengiriman",
      color: "bg-cyan-500",
      icon: Truck,
      textColor: "text-cyan-900",
      bgColor: "bg-cyan-50",
    },
    delivered: {
      label:
        order.delivery_method === "pickup" ? "Sudah Diambil" : "Sudah Diterima",
      color: "bg-green-500",
      icon: CheckCircle2,
      textColor: "text-green-900",
      bgColor: "bg-green-50",
    },
    completed: {
      label: "Selesai",
      color: "bg-green-600",
      icon: CheckCircle2,
      textColor: "text-green-900",
      bgColor: "bg-green-50",
    },
    cancelled: {
      label: "Dibatalkan",
      color: "bg-red-500",
      icon: XCircle,
      textColor: "text-red-900",
      bgColor: "bg-red-50",
    },
    failed: {
      label: "Gagal",
      color: "bg-gray-500",
      icon: AlertCircle,
      textColor: "text-gray-900",
      bgColor: "bg-gray-50",
    },
  };

  const isInstantTransaction =
    order.payment_method === "cash_at_store" &&
    order.delivery_method === "pickup";

  const currentStatus =
    statusConfig[order.status as keyof typeof statusConfig] ||
    statusConfig.pending_payment;
  const StatusIcon = currentStatus.icon;

  const canCancel = ["pending_payment", "paid", "processing"].includes(
    order.status,
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-15 md:py-10">
      <OrderStatusWatcher orderId={order.id} />

      <Button
        variant="ghost"
        asChild
        className="mb-6 ml-0 md:-ml-4 text-muted-foreground hover:text-primary transition-colors"
      >
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Pesanan
        </Link>
      </Button>

      <div className="space-y-6">
        {/* Status Header */}
        <Card className="overflow-hidden border-none shadow-md py-0">
          {/* Top Banner Status */}
          <div
            className={cn(
              "p-6 md:p-8 transition-colors duration-500",
              currentStatus.bgColor,
            )}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-5 flex-1">
                {/* Icon with Glassmorphism effect */}
                <div
                  className={cn(
                    "p-4 rounded-2xl shadow-lg ring-4 ring-white/20 text-white animate-in zoom-in duration-300",
                    currentStatus.color,
                  )}
                >
                  <StatusIcon className="h-10 w-10" />
                </div>

                <div className="flex-1 text-center md:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h1
                      className={cn(
                        "text-3xl font-extrabold tracking-tight",
                        currentStatus.textColor,
                      )}
                    >
                      {currentStatus.label}
                    </h1>
                    {/* Badge untuk Order Number */}
                    <span className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground/70 border border-white/20">
                      {order.order_number}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-x-4 gap-y-1 text-muted-foreground/80">
                    <p className="text-sm">
                      Dipesan pada{" "}
                      <span className="font-semibold text-foreground/70">
                        {format(
                          new Date(order.created_at),
                          "dd MMMM yyyy, HH:mm",
                          { locale: idLocale },
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex shrink-0 items-center gap-3">
                {canCancel && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <CancelOrderButton orderId={order.id} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Area */}
          {!(isInstantTransaction && order.status === "completed") && (
            <CardContent className="p-6 bg-card/50">
              <div className="relative max-w-2xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                        Lacak Pesanan
                      </h3>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-tight">
                        Update Terakhir:{" "}
                        {format(new Date(order.updated_at), "HH:mm 'WIB'", {
                          locale: idLocale,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Badge Metode Pengiriman */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border w-fit">
                    <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
                      {order.delivery_method === "delivery"
                        ? "Reguler Delivery"
                        : "Self Pickup"}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="pl-2 border-l-2 border-dashed border-muted space-y-2">
                    <OrderStatusTimeline
                      currentStatus={order.status}
                      deliveryMethod={order.delivery_method}
                    />
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-dashed flex items-start gap-3 text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <p className="text-xs italic leading-relaxed">
                    Status diperbarui secara otomatis oleh sistem. Jika ada
                    kendala, silakan hubungi admin warung.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* JIKA INSTAN DAN SELESAI, TAMPILKAN PESAN SUKSES SAJA */}
        {isInstantTransaction && order.status === "completed" && (
          <Card className="bg-emerald-50 border-emerald-200 overflow-hidden relative">
            {/* Decorative Pattern */}
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <CheckCircle2 className="h-24 w-24 -mr-8 -mt-8" />
            </div>

            <CardContent className="p-8 text-center relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4 animate-bounce-short">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-extrabold text-emerald-900 tracking-tight">
                Transaksi Berhasil!
              </h3>
              <p className="text-sm text-emerald-700/80 max-w-xs mx-auto mt-2 leading-relaxed">
                Terima kasih atas kunjungan Anda. Pembayaran telah diverifikasi
                dan produk sudah diserahkan di lokasi.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tracking Info */}
        {order.tracking_number && order.status === "shipped" && (
          <Card className="border-none shadow-sm bg-linear-to-r from-cyan-50 to-sky-50 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Latar belakang icon di samping (untuk desktop) */}
                <div className="bg-cyan-500 p-6 flex items-center justify-center text-white md:w-20">
                  <Truck className="h-8 w-8" />
                </div>

                <div className="p-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-cyan-950 flex items-center gap-2">
                        Pesanan Sedang Meluncur
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                      </h3>
                      <p className="text-xs text-cyan-800/70 font-medium">
                        Kurir: {order.shipping_courier?.toUpperCase()} —{" "}
                        {order.shipping_service}
                      </p>
                    </div>

                    {/* Nomor Resi Box */}
                    <div className="bg-white/60 backdrop-blur-sm border border-cyan-200 rounded-xl p-3 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-cyan-700/60">
                          Nomor Resi
                        </p>
                        <p className="font-mono font-bold text-sm text-cyan-950 select-all">
                          {order.tracking_number}
                        </p>
                      </div>
                      <CopyTrackingButton
                        trackingNumber={order.tracking_number}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delivery/Pickup Info */}
        <Card className="py-0">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              {order.delivery_method === "delivery" ? (
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
              ) : (
                <Store className="h-5 w-5 text-primary mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold mb-2">
                  {order.delivery_method === "delivery"
                    ? "Alamat Pengiriman"
                    : "Lokasi Pickup"}
                </h3>

                {order.delivery_method === "delivery" && order.addresses ? (
                  <div>
                    <p className="font-medium">
                      {order.addresses.recipient_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.addresses.phone_number}
                    </p>
                    <p className="text-sm mt-2">
                      {order.addresses.street_address}
                      <br />
                      {order.addresses.district_name},{" "}
                      {order.addresses.city_name}
                      <br />
                      {order.addresses.province_name}{" "}
                      {order.addresses.postal_code}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium">{order.profiles?.shop_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles?.phone_number}
                    </p>
                    <p className="text-sm mt-2">
                      {order.profiles?.business_address || "Alamat toko"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="py-0">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Rincian Produk
            </h3>

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

            {/* Price Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatIDR(order.subtotal)}</span>
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

              {order.shipping_courier && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {order.shipping_courier.toUpperCase()}{" "}
                    {order.shipping_service}
                  </span>
                  <span>Estimasi: {order.shipping_etd} hari</span>
                </div>
              )}

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

        {/* Payment Info */}
        <Card className="py-0">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Informasi Pembayaran
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode Pembayaran</span>
                <Badge variant="outline">
                  {order.payment_method === "online"
                    ? "Bayar Online"
                    : order.payment_method === "cod"
                      ? "COD"
                      : "Bayar di Toko"}
                </Badge>
              </div>

              {order.payment_type && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe Pembayaran</span>
                  <span className="font-medium uppercase">
                    {order.payment_type}
                  </span>
                </div>
              )}

              {order.paid_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Waktu Pembayaran
                  </span>
                  <span className="font-medium">
                    {format(new Date(order.paid_at), "dd MMM yyyy, HH:mm", {
                      locale: idLocale,
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Notes */}
        {order.customer_notes && (
          <Card className="py-0">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Catatan Pesanan</h3>
              <p className="text-sm text-muted-foreground">
                {order.customer_notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Admin Notes */}
        {order.admin_notes && (
          <Card className="border-l-4 border-l-blue-500 py-0">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 text-blue-900">
                Catatan dari Penjual
              </h3>
              <p className="text-sm text-muted-foreground">
                {order.admin_notes}
              </p>
            </CardContent>
          </Card>
        )}

        {order.status === "pending_payment" &&
          order.transactions?.snap_token && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:relative md:p-0 md:bg-transparent md:border-none z-50">
              <PayButton snapToken={order.transactions.snap_token} />
            </div>
          )}
      </div>
    </div>
  );
}
