import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { ProductFilterParams } from "@/types/product.types";

type FiltersStore = {
  draft: ProductFilterParams;
  applied: ProductFilterParams;

  setDraft: (patch: Partial<ProductFilterParams>) => void;
  apply: () => void;
  reset: () => void;
};

const defaultFilters: ProductFilterParams = {
  tags: ["category:computer", "category:mobile", "category:tablet"],
  discount: false,
  nonDiscount: true,
  priceMin: 0,
  priceMax: 10000,
  availability: true,
  nonAvailability: false,
  deliveryNovaPost: true,
  deliveryUkrPost: true,
};

export const useFiltersStore = create<FiltersStore>
  ((set) => ({
  draft: { ...defaultFilters },
  applied: { ...defaultFilters },

  setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  apply: () => set((s) => ({ applied: { ...s.draft } })),
  reset: () => set({ draft: { ...defaultFilters }, applied: { ...defaultFilters } }),
}));
