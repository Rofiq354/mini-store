"use server";

import { createClient } from "@/utils/supbase/server";

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if user is merchant
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "merchant") {
    return { error: "Unauthorized - Not a merchant" };
  }

  try {
    // Get date ranges
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Total Revenue (completed orders this month)
    const { data: revenueThisMonth } = await supabase
      .from("orders")
      .select("total_price")
      .eq("merchant_id", user.id)
      .eq("status", "completed")
      .gte("created_at", startOfMonth.toISOString());

    const totalRevenue =
      revenueThisMonth?.reduce(
        (sum, order) => sum + Number(order.total_price),
        0,
      ) || 0;

    // Revenue last month
    const { data: revenueLastMonth } = await supabase
      .from("orders")
      .select("total_price")
      .eq("merchant_id", user.id)
      .eq("status", "completed")
      .gte("created_at", startOfLastMonth.toISOString())
      .lte("created_at", endOfLastMonth.toISOString());

    const lastMonthRevenue =
      revenueLastMonth?.reduce(
        (sum, order) => sum + Number(order.total_price),
        0,
      ) || 0;

    const revenueGrowth =
      lastMonthRevenue > 0
        ? Math.round(
            ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
          )
        : 0;

    // Total Orders (this month)
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    // Total Orders last month
    const { count: lastMonthOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", user.id)
      .gte("created_at", startOfLastMonth.toISOString())
      .lte("created_at", endOfLastMonth.toISOString());

    const ordersGrowth =
      lastMonthOrders && lastMonthOrders > 0
        ? Math.round(
            (((totalOrders || 0) - lastMonthOrders) / lastMonthOrders) * 100,
          )
        : 0;

    // Total Products
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", user.id)
      .eq("is_active", true);

    // Total Customers (unique users who ordered)
    const { data: customers } = await supabase
      .from("orders")
      .select("user_id")
      .eq("merchant_id", user.id);

    const totalCustomers = new Set(customers?.map((o) => o.user_id)).size;

    // Orders by status
    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", user.id)
      .eq("status", "pending_payment");

    const { count: processingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", user.id)
      .eq("status", "processing");

    const { count: shippedOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", user.id)
      .eq("status", "shipped");

    const { count: completedOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("merchant_id", user.id)
      .eq("status", "completed");

    return {
      data: {
        totalRevenue,
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalCustomers,
        pendingOrders: pendingOrders || 0,
        processingOrders: processingOrders || 0,
        shippedOrders: shippedOrders || 0,
        completedOrders: completedOrders || 0,
        revenueGrowth,
        ordersGrowth,
      },
    };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return { error: error.message };
  }
}

/**
 * Get chart data for dashboard
 */
export async function getChartData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Revenue data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const revenueData = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const { data: orders } = await supabase
          .from("orders")
          .select("total_price")
          .eq("merchant_id", user.id)
          .in("status", ["completed", "delivered"])
          .gte("created_at", date.toISOString())
          .lt("created_at", nextDay.toISOString());

        const revenue =
          orders?.reduce((sum, order) => sum + Number(order.total_price), 0) ||
          0;

        return {
          date: date.toISOString(),
          revenue,
        };
      }),
    );

    // Order status distribution (active orders only)
    const statuses = [
      "pending_payment",
      "paid",
      "processing",
      "ready_to_ship",
      "shipped",
      "delivered",
      "completed",
    ];

    const orderStatusData = await Promise.all(
      statuses.map(async (status) => {
        const { count } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("merchant_id", user.id)
          .eq("status", status);

        return {
          status,
          count: count || 0,
        };
      }),
    );

    return {
      data: {
        revenueData,
        orderStatusData: orderStatusData.filter((item) => item.count > 0),
      },
    };
  } catch (error: any) {
    console.error("Error fetching chart data:", error);
    return { error: error.message };
  }
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limit: number = 5) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles:user_id (
        full_name,
        email
      ),
      order_items (
        quantity
      )
    `,
    )
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Get top selling products
 */
export async function getTopProducts(limit: number = 5) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get all order items for completed orders
    const { data: orderItems } = await supabase
      .from("order_items")
      .select(
        `
        product_id,
        quantity,
        price_at_time,
        products (
          id,
          name,
          price,
          image_url
        ),
        order_id,
        orders!inner (
          merchant_id,
          status
        )
      `,
      )
      .eq("orders.merchant_id", user.id)
      .in("orders.status", ["completed", "delivered"]);

    if (!orderItems || orderItems.length === 0) {
      return { data: [] };
    }

    // Aggregate by product
    const productStats = orderItems.reduce((acc: any, item: any) => {
      const productId = item.product_id;

      if (!acc[productId]) {
        acc[productId] = {
          id: productId,
          name: item.products?.name || "Unknown",
          price: item.products?.price || 0,
          image_url: item.products?.image_url,
          total_sold: 0,
          total_revenue: 0,
        };
      }

      acc[productId].total_sold += item.quantity;
      acc[productId].total_revenue +=
        item.quantity * Number(item.price_at_time);

      return acc;
    }, {});

    // Convert to array and sort
    const topProducts = Object.values(productStats)
      .sort((a: any, b: any) => b.total_sold - a.total_sold)
      .slice(0, limit);

    return { data: topProducts };
  } catch (error: any) {
    console.error("Error fetching top products:", error);
    return { error: error.message };
  }
}
