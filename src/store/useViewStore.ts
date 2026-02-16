import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ViewState {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      view: "grid",
      setView: (view) => set({ view }),
    }),
    {
      name: "product-view-storage",
    },
  ),
);
