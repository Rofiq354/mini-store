import { removeFromCartDb, upsertCartDb } from "@/services/cart-action";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // product_id
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  quantity: number;
  merchant_id: string;
  merchant_name: string;
  category_name?: string;
}

interface CartStore {
  items: CartItem[];

  // Actions
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  setItems: (items: CartItem[]) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: (shouldSyncWithDb?: boolean) => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      setItems: (newItems) => set({ items: newItems }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );
          let newItems;

          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) return state; // Handle stock di UI
            newItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item,
            );
          } else {
            if (quantity > product.stock) return state;
            newItems = [...state.items, { ...product, quantity }];
          }

          // SYNC KE DATABASE (Background)
          const targetQty =
            newItems.find((i) => i.id === product.id)?.quantity || 0;
          upsertCartDb(product.id, product.merchant_id, targetQty);

          return { items: newItems };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          const item = state.items.find((i) => i.id === productId);
          if (!item) return state;

          if (quantity <= 0) {
            removeFromCartDb(productId); // SYNC DELETE
            return { items: state.items.filter((i) => i.id !== productId) };
          }

          if (quantity > item.stock) return state;

          // SYNC UPDATE
          upsertCartDb(productId, item.merchant_id, quantity);

          return {
            items: state.items.map((i) =>
              i.id === productId ? { ...i, quantity } : i,
            ),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          removeFromCartDb(productId); // SYNC DELETE
          return { items: state.items.filter((item) => item.id !== productId) };
        });
      },

      clearCart: async (shouldSyncWithDb = false) => {
        set({ items: [] });

        if (shouldSyncWithDb) {
          await removeFromCartDb();
        }
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getItemQuantity: (productId) => {
        const state = get();
        const item = state.items.find((item) => item.id === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: "geraiku-cart-storage", // localStorage key
      skipHydration: true,
    },
  ),
);
