import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { ProductFilterParams } from "@/types/product.types";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";

type FiltersStore = {
  draft: ProductFilterParams;
  applied: Partial<ProductFilterParams>;

  setDraft: (patch: Partial<ProductFilterParams>) => void;
  apply: () => void;
  reset: () => void;
  resetSection: <K extends keyof ProductFilterParams>(keys: K[]) => void;
  resetPriceSection: (min: number, max: number) => void;
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set) => ({
      draft: { ...defaultFilters },
      applied: {},

      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      apply: () => set((s) => ({ applied: { ...s.draft } })),
      reset: () => set({ draft: { ...defaultFilters }, applied: { ...defaultFilters } }),
      resetSection: (keys) => {
        const updates: Partial<ProductFilterParams> = {};
        keys.forEach((key) => {
          updates[key] = defaultFilters[key];
        });
        set((s) => ({
          draft: { ...s.draft, ...updates },
          applied: { ...s.applied, ...updates }
        }));
      },
      resetPriceSection: (min, max) => {
        const updates: Partial<ProductFilterParams> = {
          priceMin: defaultFilters.priceMin ?? min,
          priceMax: defaultFilters.priceMax ?? max
        };
        set((s) => ({
          draft: { ...s.draft, ...updates },
          applied: { ...s.applied, ...updates }
        }));
      }
    }),
    {
      name: "filters-session-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ applied: state.applied })
    }
  )
);
