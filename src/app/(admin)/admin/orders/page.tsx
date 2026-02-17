import { getMerchantOrders } from "@/services/order-action";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  ChevronRight,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Store,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn, formatIDR } from "@/lib/utils";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status;

  const { data: orders, error } = await getMerchantOrders(statusFilter as any);

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Gagal memuat pesanan</p>
        <p>error: {error}</p>
      </div>
    );
  }

  // Filter by search if provided
  let filteredOrders = orders || [];
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredOrders = filteredOrders.filter(
      (order: any) =>
        order.order_number.toLowerCase().includes(searchLower) ||
        order.profiles?.full_name?.toLowerCase().includes(searchLower) ||
        order.profiles?.email?.toLowerCase().includes(searchLower),
    );
  }

  // Count by status
  const counts = {
    all: orders?.length || 0,
    pending_payment:
      orders?.filter((o: any) => o.status === "pending_payment").length || 0,
    paid: orders?.filter((o: any) => o.status === "paid").length || 0,
    processing:
      orders?.filter((o: any) => o.status === "processing").length || 0,
    ready_to_ship:
      orders?.filter((o: any) => o.status === "ready_to_ship").length || 0,
    shipped: orders?.filter((o: any) => o.status === "shipped").length || 0,
    delivered: orders?.filter((o: any) => o.status === "delivered").length || 0,
    completed: orders?.filter((o: any) => o.status === "completed").length || 0,
  };

  const statusConfig = {
    pending_payment: {
      label: "Menunggu Bayar",
      icon: Clock,
      color: "bg-amber-500",
    },
    paid: { label: "Dibayar", icon: CheckCircle2, color: "bg-blue-500" },
    processing: { label: "Diproses", icon: Package, color: "bg-purple-500" },
    ready_to_ship: { label: "Siap Kirim", icon: Truck, color: "bg-indigo-500" },
    shipped: { label: "Dikirim", icon: Truck, color: "bg-cyan-500" },
    delivered: { label: "Diterima", icon: CheckCircle2, color: "bg-green-500" },
    completed: { label: "Selesai", icon: CheckCircle2, color: "bg-green-600" },
    cancelled: { label: "Batal", icon: XCircle, color: "bg-red-500" },
    failed: { label: "Gagal", icon: XCircle, color: "bg-gray-500" },
  };

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
              <Truck className="h-3.5 w-3.5" />
              Orders
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Kelola Pesanan</h1>
              <p className="text-muted-foreground text-sm">
                Total {counts.all} pesanan
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 py-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nomor pesanan, nama customer..."
                  className="pl-9"
                  defaultValue={params.search}
                />
              </div>

              {/* Status Filter */}
              <Select defaultValue={statusFilter || "all"}>
                <SelectTrigger className="w-full md:w-50">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua ({counts.all})</SelectItem>
                  <SelectItem value="pending_payment">
                    Menunggu Bayar ({counts.pending_payment})
                  </SelectItem>
                  <SelectItem value="paid">Dibayar ({counts.paid})</SelectItem>
                  <SelectItem value="processing">
                    Diproses ({counts.processing})
                  </SelectItem>
                  <SelectItem value="ready_to_ship">
                    Siap Kirim ({counts.ready_to_ship})
                  </SelectItem>
                  <SelectItem value="shipped">
                    Dikirim ({counts.shipped})
                  </SelectItem>
                  <SelectItem value="delivered">
                    Diterima ({counts.delivered})
                  </SelectItem>
                  <SelectItem value="completed">
                    Selesai ({counts.completed})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="py-0">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Butuh Konfirmasi
              </p>
              <p className="text-2xl font-bold">{counts.paid}</p>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Diproses</p>
              <p className="text-2xl font-bold">{counts.processing}</p>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">Siap Kirim</p>
              <p className="text-2xl font-bold">{counts.ready_to_ship}</p>
            </CardContent>
          </Card>
          <Card className="py-0">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">
                Dalam Pengiriman
              </p>
              <p className="text-2xl font-bold">{counts.shipped}</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="py-0">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {params.search || statusFilter
                  ? "Tidak ada pesanan yang sesuai filter"
                  : "Belum ada pesanan"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order: any) => {
              const status =
                statusConfig[order.status as keyof typeof statusConfig] ||
                statusConfig.paid;
              const StatusIcon = status.icon;

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="group"
                >
                  <Card className="hover:ring-2 hover:ring-primary/20 transition-all duration-300 py-0 shadow-sm border-muted-foreground/10 overflow-hidden h-full">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                      {/* Header: Order Number & Status */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground tracking-tighter">
                            #{order.order_number.slice(-8).toUpperCase()}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] px-2 py-0 h-5 font-bold uppercase tracking-wider text-white border-none",
                              status.color,
                            )}
                          >
                            {status.label}
                          </Badge>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                            {order.profiles?.full_name || "Unknown Customer"}
                          </h4>
                          <div className="flex items-center text-[11px] text-muted-foreground truncate">
                            <span className="truncate">
                              {order.profiles?.email}
                            </span>
                          </div>
                        </div>

                        {/* Order Details (Compact) */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 border-t border-dashed">
                          <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                            <Package className="h-3 w-3" />
                            {order.order_items?.reduce(
                              (sum: number, i: any) => sum + i.quantity,
                              0,
                            )}{" "}
                            item
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {format(
                              new Date(order.created_at),
                              "dd/MM, HH:mm",
                              {
                                locale: id,
                              },
                            )}
                          </div>
                          {order.delivery_method === "delivery" ? (
                            <div className="flex items-center gap-1 text-[11px] font-medium text-blue-600 truncate max-w-30">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">
                                {order.addresses?.city_name ||
                                  "Alamat tidak ada"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[11px] font-medium text-orange-600 truncate">
                              <Store className="h-3 w-3" />
                              <span>Ambil di Toko</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer: Price & Quick Action */}
                      <div className="mt-4 pt-3 border-t flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter leading-none">
                            Total Tagihan
                          </p>
                          <p className="text-sm font-black text-foreground">
                            {formatIDR(order.total_price)}
                          </p>
                        </div>
                        <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          <ChevronRight className="h-4 w-4" />
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
    </>
  );
}
