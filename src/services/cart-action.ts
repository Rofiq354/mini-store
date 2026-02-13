"use server";

import { createClient } from "@/utils/supbase/server";

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

  // Check if product is available
  if (!product.is_active) {
    return {
      error: "Produk tidak tersedia",
    };
  }

  // Access first element since Supabase returns relations as arrays
  const merchant = Array.isArray(product.profiles)
    ? product.profiles[0]
    : product.profiles;
  const category = Array.isArray(product.categories)
    ? product.categories[0]
    : product.categories;

  // Format response
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
  }[],
) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Anda harus login untuk checkout",
    };
  }

  // Validate stock first
  const validation = await validateCartStock(
    items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  );

  if (validation.error) {
    return validation;
  }

  // Get merchant_id from first product (assume all from same merchant for now)
  const { data: product } = await supabase
    .from("products")
    .select("merchant_id")
    .eq("id", items[0].productId)
    .single();

  if (!product) {
    return {
      error: "Produk tidak ditemukan",
    };
  }

  // Calculate total
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Create transaction
  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .insert({
      merchant_id: product.merchant_id,
      total_price: totalPrice,
      payment_method: "cash", // Default to cash, can be updated
    })
    .select()
    .single();

  if (transactionError || !transaction) {
    return {
      error: "Gagal membuat transaksi",
    };
  }

  // Create transaction items
  const transactionItems = items.map((item) => ({
    transaction_id: transaction.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_time: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("transaction_items")
    .insert(transactionItems);

  if (itemsError) {
    // Rollback transaction if items creation fails
    await supabase.from("transactions").delete().eq("id", transaction.id);
    return {
      error: "Gagal menyimpan detail transaksi",
    };
  }

  // Update product stocks
  for (const item of items) {
    const { error: stockError } = await supabase.rpc("decrement_stock", {
      product_id: item.productId,
      quantity: item.quantity,
    });

    if (stockError) {
      console.error("Failed to update stock:", stockError);
    }
  }

  return {
    success: true,
    transactionId: transaction.id,
  };
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

  // Buat query dasar: hapus data milik user yang login
  let query = supabase.from("cart_items").delete().eq("user_id", user.id);

  // Jika ada productId, tambahkan filter spesifik
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
