"use server";

import { snap } from "@/lib/midtrans";
import { createClient } from "@/utils/supbase/server";
import { nanoid } from "nanoid";

/**
 * Get product details with merchant info for cart
 */
export async function getProductForCart(productId: string) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      price,
      stock,
      image_url,
      merchant_id,
      category_id,
      is_active,
      profiles!products_merchant_id_fkey (
        shop_name,
        full_name
      ),
      categories (
        name
      )
    `,
    )
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    return {
      error: "Produk tidak ditemukan",
    };
  }

  if (!product.is_active) {
    return {
      error: "Produk tidak tersedia",
    };
  }

  const merchant = Array.isArray(product.profiles)
    ? product.profiles[0]
    : product.profiles;
  const category = Array.isArray(product.categories)
    ? product.categories[0]
    : product.categories;

  return {
    data: {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url,
      merchant_id: product.merchant_id,
      merchant_name: merchant?.shop_name || merchant?.full_name || "Toko",
      category_name: category?.name,
    },
  };
}

/**
 * Validate stock availability for multiple items
 */
export async function validateCartStock(
  items: { productId: string; quantity: number }[],
) {
  const supabase = await createClient();

  const productIds = items.map((item) => item.productId);

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, stock, is_active")
    .in("id", productIds);

  if (error) {
    return {
      error: "Gagal memvalidasi stok produk",
    };
  }

  const validationErrors: { productId: string; message: string }[] = [];

  items.forEach((item) => {
    const product = products?.find((p) => p.id === item.productId);

    if (!product) {
      validationErrors.push({
        productId: item.productId,
        message: "Produk tidak ditemukan",
      });
      return;
    }

    if (!product.is_active) {
      validationErrors.push({
        productId: item.productId,
        message: `${product.name} tidak tersedia`,
      });
      return;
    }

    if (product.stock < item.quantity) {
      validationErrors.push({
        productId: item.productId,
        message: `${product.name} hanya tersisa ${product.stock} stok`,
      });
      return;
    }
  });

  if (validationErrors.length > 0) {
    return {
      error: "Beberapa produk tidak tersedia atau stok tidak mencukupi",
      validationErrors,
    };
  }

  return {
    success: true,
  };
}

/**
 * Create transaction from cart (checkout)
 */
export async function createTransactionFromCart(
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[],
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Anda harus login untuk checkout" };

  // Ambil merchant_id (Asumsi 1 checkout = 1 merchant sesuai diskusi)
  const { data: productData } = await supabase
    .from("products")
    .select("merchant_id")
    .eq("id", items[0].productId)
    .single();

  if (!productData) return { error: "Produk tidak ditemukan" };

  const externalId = `TRX-${nanoid(10).toUpperCase()}`;
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  try {
    // INSERT TRANSACTION (Status Awal: Pending)
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        external_id: externalId,
        user_id: user.id,
        merchant_id: productData.merchant_id,
        total_price: totalPrice,
        status: "pending",
      })
      .select()
      .single();

    if (txError || !transaction)
      throw new Error("Gagal membuat transaksi di database");

    // INSERT TRANSACTION ITEMS
    const transactionItemsData = items.map((item) => ({
      transaction_id: transaction.id,
      product_id: item.productId,
      merchant_id: productData.merchant_id,
      quantity: item.quantity,
      price_at_time: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("transaction_items")
      .insert(transactionItemsData);

    if (itemsError) throw itemsError;

    // HIT MIDTRANS API
    const parameter = {
      transaction_details: {
        order_id: externalId,
        gross_amount: totalPrice,
      },
      item_details: items.map((item) => ({
        id: item.productId,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${transaction.id}`,
      },
      customer_details: {
        first_name: user.user_metadata?.full_name || user.email?.split("@")[0],
        email: user.email,
      },
    };

    const midtransTx = await snap.createTransaction(parameter);

    // UPDATE TRANSACTION DENGAN SNAP TOKEN
    await supabase
      .from("transactions")
      .update({ snap_token: midtransTx.token })
      .eq("id", transaction.id);

    // KURANGI STOK (Gunakan RPC agar atomik)
    for (const item of items) {
      await supabase.rpc("decrement_stock", {
        product_id: item.productId,
        quantity: item.quantity,
      });
    }

    return {
      success: true,
      transactionId: transaction.id,
      snapToken: midtransTx.token,
      externalId: externalId,
    };
  } catch (err: any) {
    console.error("Checkout process failed:", err);
    return {
      error: err.message || "Terjadi kesalahan saat memproses checkout",
    };
  }
}

/**
 * Get transaction detail by id
 * @param {string} id - Transaction id
 * @returns {Promise<{data: TransactionDetail, error: string}>}
 */
export async function getTransactionDetail(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      profiles:merchant_id (shop_name),
      transaction_items (
        *,
        products (name, image_url)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) return { error: error.message };
  return { data };
}

/**
 * Get all orders of a user
 * @returns {Promise<{data: TransactionDetail[], error: string}>}
 * @throws {Unauthorized} if user is not logged in
 */
export async function getUserOrders() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("transactions")
    .select(
      `
      *,
      profiles:merchant_id (shop_name),
      transaction_items (
        count
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

/**
 * Sync cart items with latest product data
 */
export async function syncCartWithDatabase(cartItems: { id: string }[]) {
  const supabase = await createClient();

  const productIds = cartItems.map((item) => item.id);

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      price,
      stock,
      image_url,
      is_active,
      merchant_id,
      profiles!products_merchant_id_fkey (
        shop_name,
        full_name
      ),
      categories (
        name
      )
    `,
    )
    .in("id", productIds);

  if (error) {
    return {
      error: "Gagal memuat data produk",
    };
  }

  return {
    data: products?.map((product) => {
      // Access first element since Supabase returns relations as arrays
      const merchant = Array.isArray(product.profiles)
        ? product.profiles[0]
        : product.profiles;
      const category = Array.isArray(product.categories)
        ? product.categories[0]
        : product.categories;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url,
        is_active: product.is_active,
        merchant_id: product.merchant_id,
        merchant_name: merchant?.shop_name || merchant?.full_name || "Toko",
        category_name: category?.name,
      };
    }),
  };
}

/**
 * Sinkronisasi item tunggal ke Database (Upsert)
 */
export async function upsertCartDb(
  productId: string,
  merchantId: string,
  quantity: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Belum login" };

  const { error } = await supabase.from("cart_items").upsert(
    {
      user_id: user.id,
      product_id: productId,
      merchant_id: merchantId,
      quantity: quantity,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,product_id",
    },
  );

  if (error) throw new Error(error.message);
  return { success: true };
}

/**
 * Hapus item dari Database
 */
export async function removeFromCartDb(productId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  let query = supabase.from("cart_items").delete().eq("user_id", user.id);

  if (productId) {
    query = query.eq("product_id", productId);
  }

  const { error } = await query;

  if (error) {
    console.error("Gagal menghapus data di DB:", error.message);
    return { error: error.message };
  }

  return { success: true };
}
