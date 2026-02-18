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
  totalPrice: number;
  totalItems: number;

  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  setItems: (items: CartItem[]) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: (shouldSyncWithDb?: boolean) => void;

  // Fungsi pembantu tetap ada jika dibutuhkan
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const calculateTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  return { totalPrice, totalItems };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      totalItems: 0,

      setItems: (newItems) => {
        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },

      addItem: (product, quantity = 1) => {
        const state = get();
        const existingItem = state.items.find((item) => item.id === product.id);
        let newItems;

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) return;
          newItems = state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item,
          );
        } else {
          if (quantity > product.stock) return;
          newItems = [...state.items, { ...product, quantity }];
        }

        // Sync DB
        const targetQty =
          newItems.find((i) => i.id === product.id)?.quantity || 0;
        upsertCartDb(product.id, product.merchant_id, targetQty);

        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },

      updateQuantity: (productId, quantity) => {
        const state = get();
        const item = state.items.find((i) => i.id === productId);
        if (!item) return;

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        if (quantity > item.stock) return;

        const newItems = state.items.map((i) =>
          i.id === productId ? { ...i, quantity } : i,
        );

        upsertCartDb(productId, item.merchant_id, quantity);

        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },

      removeItem: (productId) => {
        const state = get();
        const newItems = state.items.filter((item) => item.id !== productId);

        removeFromCartDb(productId);

        set({
          items: newItems,
          ...calculateTotals(newItems),
        });
      },

      clearCart: async (shouldSyncWithDb = false) => {
        set({ items: [], totalPrice: 0, totalItems: 0 });
        if (shouldSyncWithDb) await removeFromCartDb();
      },

      // Getter tetap dipertahankan untuk backward compatibility
      getTotalItems: () => calculateTotals(get().items).totalItems,
      getTotalPrice: () => calculateTotals(get().items).totalPrice,
      getItemQuantity: (productId: string) =>
        get().items.find((i) => i.id === productId)?.quantity || 0,
    }),
    {
      name: "geraiku-cart-storage",
      skipHydration: true,
    },
  ),
);
