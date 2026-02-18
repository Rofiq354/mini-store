"use server";

import { createClient } from "@/utils/supbase/server";
import { snap } from "@/lib/midtrans";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export type PaymentMethod = "online" | "cod" | "cash_at_store";
export type DeliveryMethod = "delivery" | "pickup";
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "failed";

export interface CreateOrderParams {
  // Cart items
  items: {
    product_id: string;
    quantity: number;
    price: number;
    name: string;
    image_url?: string;
  }[];

  // Payment & Delivery
  payment_method: PaymentMethod;
  delivery_method: DeliveryMethod;

  // Shipping (required if delivery_method = 'delivery')
  address_id?: string;
  shipping_courier?: string;
  shipping_service?: string;
  shipping_cost?: number;
  shipping_etd?: string;

  // Optional
  customer_notes?: string;
}

/**
 * Create new order from cart
 */
export async function createOrder(params: CreateOrderParams) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // Validate delivery method & address
    if (params.delivery_method === "delivery") {
      if (!params.address_id) return { error: "Alamat pengiriman wajib diisi" };
      if (!params.shipping_courier || !params.shipping_service)
        return { error: "Pilih kurir pengiriman" };
      if (params.shipping_cost === undefined || params.shipping_cost < 0)
        return { error: "Ongkir tidak valid" };
    }

    // Get merchant_id from first product
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("merchant_id")
      .eq("id", params.items[0].product_id)
      .single();

    if (productError || !productData)
      return { error: "Produk tidak ditemukan" };

    // Calculate totals
    const subtotal = params.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shipping_cost = params.shipping_cost || 0;
    const total_price = subtotal + shipping_cost;

    const isOnlinePayment = ["online", "cash_at_store"].includes(
      params.payment_method,
    );
    const orderNumber = `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;

    let initialStatus: OrderStatus = isOnlinePayment
      ? "pending_payment"
      : params.payment_method === "cod"
        ? "processing"
        : "pending_payment";

    let transactionId: string | null = null;
    let snapToken = null;

    if (isOnlinePayment) {
      const externalId = `TRX-${nanoid(10).toUpperCase()}`;

      const { data: tx, error: txError } = await supabase
        .from("transactions")
        .insert({
          external_id: externalId,
          user_id: user.id,
          merchant_id: productData.merchant_id,
          total_price,
          status: "pending",
        })
        .select()
        .single();

      if (txError) throw new Error("Gagal membuat transaksi");
      transactionId = tx.id;

      const midtransItems = params.items.map((item) => ({
        id: item.product_id,
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.name.substring(0, 50),
      }));

      if (shipping_cost > 0) {
        midtransItems.push({
          id: "shipping-fee",
          price: Math.round(shipping_cost),
          quantity: 1,
          name: "Ongkir",
        });
      }

      const midtransParams = {
        transaction_details: {
          order_id: externalId,
          gross_amount: Math.round(total_price),
        },
        item_details: midtransItems,
        customer_details: {
          first_name:
            user.user_metadata?.full_name || user.email?.split("@")[0],
          email: user.email,
        },
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderNumber}`,
          error: `${process.env.NEXT_PUBLIC_APP_URL}/orders`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/orders`,
        },
      };

      const midtransTx = await snap.createTransaction(midtransParams);
      snapToken = midtransTx.token;

      await supabase
        .from("transactions")
        .update({ snap_token: snapToken })
        .eq("id", transactionId);

      // Catat item transaksi (untuk referensi Webhook)
      const transactionItems = params.items.map((item) => ({
        transaction_id: transactionId,
        product_id: item.product_id,
        merchant_id: productData.merchant_id,
        quantity: item.quantity,
        price_at_time: item.price,
      }));
      await supabase.from("transaction_items").insert(transactionItems);
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        merchant_id: productData.merchant_id,
        status: initialStatus,
        payment_method: params.payment_method,
        delivery_method: params.delivery_method,
        subtotal,
        shipping_cost,
        total_price,
        address_id: params.address_id || null,
        transaction_id: transactionId, // Link ke transaksi
        shipping_courier: params.shipping_courier || null,
        shipping_service: params.shipping_service || null,
        shipping_etd: params.shipping_etd || null,
        customer_notes: params.customer_notes || null,
      })
      .select()
      .single();

    if (orderError || !order) throw new Error("Gagal membuat pesanan");

    // Buat Record Order Items
    const orderItems = params.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      product_image_url: item.image_url || null,
      quantity: item.quantity,
      price_at_time: item.price,
      subtotal: item.price * item.quantity,
    }));
    await supabase.from("order_items").insert(orderItems);

    revalidatePath("/orders");

    return {
      success: true,
      order_id: order.id,
      order_number: orderNumber,
      snap_token: snapToken,
      requires_payment: isOnlinePayment,
    };
  } catch (error: any) {
    console.error("Create order error:", error);
    return { error: error.message || "Terjadi kesalahan saat membuat pesanan" };
  }
}

/**
 * Get order detail by ID
 */
export async function getOrderDetail(orderId: string) {
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
        email,        
        phone_number
      ),
      addresses (
        recipient_name,
        phone_number,
        street_address,
        district_name,
        city_name,
        province_name,
        postal_code
      ),
      order_items (
        *,
        products (
          name,
          image_url
        )
      ),
      transactions (
        snap_token,
        payment_type,
        status
      )
    `,
    )
    .eq("id", orderId)
    .single();

  if (error) {
    return { error: error.message };
  }

  // Check if user owns this order or is the merchant
  if (data.user_id !== user.id && data.merchant_id !== user.id) {
    return { error: "Unauthorized" };
  }

  return { data };
}

/**
 * Get all orders for current user
 */
export async function getUserOrders(status?: OrderStatus) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      profiles:merchant_id (
        shop_name
      ),
      order_items (
        quantity
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Get merchant orders (for admin dashboard)
 */
export async function getMerchantOrders(status?: OrderStatus) {
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

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      profiles!user_id (
        full_name,
        email,
        phone_number
      ),
      addresses:address_id (
        recipient_name,
        phone_number,
        city_name,
        province_name
      ),
      order_items (
        quantity,
        product_name,
        subtotal
      )
    `,
    )
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Update order status (Admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  options?: {
    tracking_number?: string;
    admin_notes?: string;
  },
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Get order to check merchant
  const { data: order } = await supabase
    .from("orders")
    .select("merchant_id, status")
    .eq("id", orderId)
    .single();

  if (!order) {
    return { error: "Pesanan tidak ditemukan" };
  }

  if (order.merchant_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Validate status transition
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending_payment: ["paid", "cancelled", "failed"],
    paid: ["processing", "cancelled"],
    processing: ["ready_to_ship", "cancelled"],
    ready_to_ship: ["shipped", "delivered", "cancelled"], // delivered untuk pickup
    shipped: ["delivered", "cancelled"],
    delivered: ["completed"],
    completed: [],
    cancelled: [],
    failed: [],
  };

  if (!validTransitions[order.status as OrderStatus]?.includes(newStatus)) {
    return {
      error: `Tidak bisa mengubah status dari ${order.status} ke ${newStatus}`,
    };
  }

  // Prepare update data
  const updateData: any = {
    status: newStatus,
  };

  if (options?.tracking_number) {
    updateData.tracking_number = options.tracking_number;
  }

  if (options?.admin_notes) {
    updateData.admin_notes = options.admin_notes;
  }

  if (newStatus === "paid") {
    updateData.paid_at = new Date().toISOString();
  }

  if (newStatus === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  // Update order
  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/admin/orders");

  return { data };
}

/**
 * Cancel order
 */
export async function cancelOrder(orderId: string, reason?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Get order
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  if (!order) {
    return { error: "Pesanan tidak ditemukan" };
  }

  // Only user or merchant can cancel
  if (order.user_id !== user.id && order.merchant_id !== user.id) {
    return { error: "Unauthorized" };
  }

  // Only certain statuses can be cancelled
  const cancellableStatuses: OrderStatus[] = [
    "pending_payment",
    "paid",
    "processing",
  ];

  if (!cancellableStatuses.includes(order.status)) {
    return { error: "Pesanan tidak bisa dibatalkan" };
  }

  // Update order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
      admin_notes: reason || "Dibatalkan oleh user",
    })
    .eq("id", orderId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Return stock if order was already paid
  if (order.status !== "pending_payment") {
    for (const item of order.order_items) {
      await supabase.rpc("increment_stock", {
        product_id: item.product_id,
        quantity: item.quantity,
      });
    }
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}

/**
 * Get order status history
 */
export async function getOrderStatusHistory(orderId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order_status_history")
    .select(
      `
      *,
      profiles:changed_by (
        full_name,
        email
      )
    `,
    )
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data };
}
