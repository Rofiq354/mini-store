import { getTransactionDetail } from "@/services/cart-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PayButton from "./components/PayButton";
import OrderStatusWatcher from "./components/OrderStatusWatcher";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: order, error } = await getTransactionDetail(id);

  if (error || !order) notFound();

  const statusConfig = {
    settlement: {
      label: "Berhasil",
      color: "bg-green-500",
      icon: CheckCircle2,
    },
    pending: {
      label: "Menunggu Pembayaran",
      color: "bg-amber-500",
      icon: Clock,
    },
    expire: { label: "Kedaluwarsa", color: "bg-gray-500", icon: XCircle },
    cancel: { label: "Dibatalkan", color: "bg-red-500", icon: XCircle },
    deny: { label: "Ditolak", color: "bg-red-600", icon: XCircle },
  };

  const currentStatus =
    statusConfig[order.status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <OrderStatusWatcher orderId={id} />

      <Button
        variant="ghost"
        asChild
        className="mb-6 -ml-4 text-muted-foreground hover:text-primary transition-colors"
      >
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Link>
      </Button>

      <div className="space-y-6">
        {/* Status Header */}
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border shadow-sm">
          <div
            className={`p-4 rounded-full ${currentStatus.color} text-white mb-4`}
          >
            <StatusIcon className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold">Pesanan {currentStatus.label}</h1>
          <p className="text-muted-foreground mt-1 text-sm uppercase tracking-widest font-mono">
            {order.external_id}
          </p>
        </div>

        {/* Rincian Produk */}
        <Card className="rounded-3xl overflow-hidden border-none shadow-sm ring-1 ring-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="font-bold">Rincian Produk</h2>
            </div>
            <div className="space-y-4">
              {order.transaction_items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gray-50 border">
                    <Image
                      src={item.products?.image_url || "/placeholder.jpg"}
                      alt={item.products?.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">
                      {item.products?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x Rp{" "}
                      {Number(item.price_at_time).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-bold text-sm">
                    Rp{" "}
                    {(item.quantity * item.price_at_time).toLocaleString(
                      "id-ID",
                    )}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Metode Pembayaran</span>
                <span className="font-medium uppercase">
                  {order.payment_type || "Belum dipilih"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Total Bayar</span>
                <span className="text-primary">
                  Rp {Number(order.total_price).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tombol Bayar Lagi (Hanya jika pending) */}
        {order.status === "pending" && order.snap_token && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl space-y-4">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">
                  Selesaikan Pembayaran
                </p>
                <p className="text-sm text-amber-700">
                  Pesananmu sudah kami amankan. Segera bayar sebelum waktu
                  habis.
                </p>
              </div>
            </div>
            <PayButton snapToken={order.snap_token} />
          </div>
        )}
      </div>
    </div>
  );
}
