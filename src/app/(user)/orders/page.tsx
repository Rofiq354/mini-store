import { getUserOrders } from "@/services/order-action";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Plus,
  Package,
  Truck,
  Store,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { EmptyState } from "@/components/EmptyState";
import { formatIDR } from "@/lib/utils";

export default async function OrdersPage() {
  const { data: orders, error } = await getUserOrders();

  if (error)
    return <div className="p-10 text-center">Gagal memuat pesanan.</div>;

  // Sesuaikan statusConfig dengan status_type yang ada di tabel orders
  const statusConfig = {
    pending_payment: {
      label: "Menunggu Pembayaran",
      icon: Clock,
      class: "border-amber-500 text-amber-600 bg-amber-50",
    },
    paid: {
      label: "Dibayar",
      icon: CheckCircle2,
      class: "bg-blue-500 text-white",
    },
    processing: {
      label: "Diproses",
      icon: Package,
      class: "bg-purple-500 text-white",
    },
    ready_to_ship: {
      label: "Siap Dikirim/Ambil",
      icon: Store,
      class: "bg-indigo-500 text-white",
    },
    shipped: {
      label: "Dikirim",
      icon: Truck,
      class: "bg-cyan-500 text-white",
    },
    delivered: {
      label: "Diterima",
      icon: CheckCircle2,
      class: "bg-green-500 text-white",
    },
    completed: {
      label: "Selesai",
      icon: CheckCircle2,
      class: "bg-green-600 text-white",
    },
    cancelled: {
      label: "Dibatalkan",
      icon: XCircle,
      class: "bg-red-500 text-white",
    },
    failed: {
      label: "Gagal",
      icon: XCircle,
      class: "bg-gray-500 text-white",
    },
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-15 md:py-10">
      <Button
        variant="ghost"
        asChild
        className="mb-6 ml-0 md:-ml-4 text-muted-foreground hover:text-primary transition-colors"
      >
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali Belanja
        </Link>
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <ShoppingBag className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Pesanan Saya</h1>
          <p className="text-muted-foreground text-sm">
            Pantau status belanjaanmu di sini
          </p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-10 w-10 text-primary" />}
          title="Belum Ada Pesanan"
          description="Sepertinya kamu belum melakukan transaksi apapun. Yuk, cari produk menarik di toko kami!"
        >
          <Button asChild>
            <Link href="/products">
              <Plus className="mr-2 h-4 w-4" /> Mulai Belanja
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const status =
              statusConfig[order.status as keyof typeof statusConfig] ||
              statusConfig.pending_payment;
            const StatusIcon = status.icon;

            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="group py-0 hover:border-primary/50 transition-all duration-300 rounded-3xl overflow-hidden border-gray-100 shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                            {order.order_number}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(order.created_at), "dd MMM yyyy", {
                              locale: id,
                            })}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg">
                          {order.profiles?.shop_name || "Toko Unnamed"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {order.order_items?.[0]?.product_name}
                          {order.order_items?.length > 1 &&
                            ` +${order.order_items.length - 1} produk lainnya`}
                          <span className="font-semibold text-foreground ml-2">
                            {formatIDR(order.total_price)}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.class}`}
                        >
                          <StatusIcon className="h-4 w-4" />
                          {status.label}
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
