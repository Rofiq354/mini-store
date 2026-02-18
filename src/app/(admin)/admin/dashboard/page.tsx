import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Clock,
  CheckCircle2,
  Truck,
} from "lucide-react";
import { getDashboardStats } from "@/services/dashboard-action";
import { formatIDR } from "@/lib/utils";
import DashboardCharts from "./components/DashboardCharts";
import RecentOrders from "./components/RecentOrders";
import TopProducts from "./components/TopProducts";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "./components/StatsCard";

export default async function AdminDashboardPage() {
  const { data: stats, error } = await getDashboardStats();

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <p className="text-center text-muted-foreground">
          Gagal memuat data dashboard
        </p>
      </div>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    processingOrders,
    shippedOrders,
    completedOrders,
    revenueGrowth,
    ordersGrowth,
  } = stats || {};

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview toko dan performa penjualan
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={formatIDR(totalRevenue || 0)}
          icon={<DollarSign size={24} />}
          trend={revenueGrowth}
          trendLabel="vs bulan lalu"
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />

        <StatsCard
          title="Total Pesanan"
          value={totalOrders || 0}
          icon={<ShoppingBag size={24} />}
          trend={ordersGrowth}
          trendLabel="vs bulan lalu"
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />

        <StatsCard
          title="Total Produk"
          value={totalProducts || 0}
          icon={<Package size={24} />}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />

        <StatsCard
          title="Total Customer"
          value={totalCustomers || 0}
          icon={<Users size={24} />}
          iconColor="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="py-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{processingOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-cyan-100">
                <Truck className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">{shippedOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedOrders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Suspense fallback={<ChartSkeleton />}>
          <DashboardCharts />
        </Suspense>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<TableSkeleton />}>
          <RecentOrders />
        </Suspense>

        <Suspense fallback={<TableSkeleton />}>
          <TopProducts />
        </Suspense>
      </div>
    </div>
  );
}

// Loading Skeletons
function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-75 w-full" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}
