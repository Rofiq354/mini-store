import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatIDR } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getRecentOrders } from "@/services/dashboard-action";

export default async function RecentOrders() {
  const { data: orders } = await getRecentOrders();

  const statusColors: Record<string, string> = {
    pending_payment: "bg-amber-500",
    paid: "bg-blue-500",
    processing: "bg-purple-500",
    ready_to_ship: "bg-indigo-500",
    shipped: "bg-cyan-500",
    delivered: "bg-green-500",
    completed: "bg-green-600",
    cancelled: "bg-red-500",
    failed: "bg-gray-500",
  };

  const statusLabels: Record<string, string> = {
    pending_payment: "Pending",
    paid: "Dibayar",
    processing: "Proses",
    ready_to_ship: "Siap",
    shipped: "Kirim",
    delivered: "Terima",
    completed: "Selesai",
    cancelled: "Batal",
    failed: "Gagal",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pesanan Terbaru</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {orders?.length || 0} pesanan terakhir
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            Lihat Semua
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!orders || orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Belum ada pesanan
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                      {order.order_number}
                    </span>
                    <Badge
                      className={`${statusColors[order.status]} text-white text-xs`}
                    >
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <p className="font-medium truncate">
                    {order.profiles?.full_name || "Customer"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "dd MMM, HH:mm", {
                      locale: id,
                    })}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold">{formatIDR(order.total_price)}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.order_items?.reduce(
                      (sum: number, item: any) => sum + item.quantity,
                      0,
                    )}{" "}
                    item
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
