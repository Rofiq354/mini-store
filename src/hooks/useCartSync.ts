"use client";

import useSWR from "swr";
import { useEffect } from "react";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { createClient } from "@/utils/supbase/client";
import { syncCartWithDatabase } from "@/services/cart-action";

export function useCartSync() {
  const supabase = createClient();
  const setItems = useCartStore((state) => state.setItems);

  const {
    data: userData,
    isLoading: authLoading,
    mutate: mutateAuth,
  } = useSWR(
    "auth-user",
    async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      return user;
    },
    {
      revalidateOnMount: true,
    },
  );

  const userId = userData?.id;

  const fetcher = async (uid: string): Promise<CartItem[]> => {
    const { data: dbItems, error } = await supabase
      .from("cart_items")
      .select("product_id, quantity")
      .eq("user_id", uid);

    if (error || !dbItems?.length) return [];

    const response = await syncCartWithDatabase(
      dbItems.map((i) => ({ id: i.product_id })),
    );

    return (
      response.data?.map((product) => {
        const dbItem = dbItems.find((i) => i.product_id === product.id);
        return { ...product, quantity: dbItem?.quantity ?? 1 };
      }) ?? []
    );
  };

  const { data: cartData, isLoading: cartLoading } = useSWR(
    userId ? `cart-data-${userId}` : null,
    () => fetcher(userId!),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      dedupingInterval: 0,
    },
  );

  useEffect(() => {
    if (cartData) {
      setItems(cartData);
    }
    if (!authLoading && !userId) {
      setItems([]);
    }
  }, [cartData, userId, authLoading, setItems]);

  return {
    isLoading: authLoading || cartLoading,
    user: userData,
  };
}
