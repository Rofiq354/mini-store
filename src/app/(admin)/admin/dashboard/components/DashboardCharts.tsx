"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getChartData } from "@/services/dashboard-action";
import { Loader2 } from "lucide-react";

export default function DashboardCharts() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    setIsLoading(true);
    const { data } = await getChartData();

    if (data) {
      setRevenueData(data.revenueData || []);
      setOrderStatusData(data.orderStatusData || []);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <>
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue 7 Hari Terakhir</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total penjualan harian
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                  });
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  }
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K`;
                  }
                  return value;
                }}
              />
              <Tooltip
                formatter={(value: any) =>
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(value)
                }
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Status Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Status Pesanan</CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribusi status pesanan aktif
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="status"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const labels: Record<string, string> = {
                    pending_payment: "Pending",
                    paid: "Dibayar",
                    processing: "Proses",
                    ready_to_ship: "Siap",
                    shipped: "Kirim",
                    delivered: "Terima",
                    completed: "Selesai",
                  };
                  return labels[value] || value;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => {
                  const labels: Record<string, string> = {
                    pending_payment: "Menunggu Pembayaran",
                    paid: "Dibayar",
                    processing: "Diproses",
                    ready_to_ship: "Siap Dikirim",
                    shipped: "Dalam Pengiriman",
                    delivered: "Sudah Diterima",
                    completed: "Selesai",
                  };
                  return labels[value] || value;
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
