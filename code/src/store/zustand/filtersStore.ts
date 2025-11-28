import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { removeKeyFromObject } from "@/utils/remove-key-from-object/removeKeyFromObject";
import type { ProductFilterParams } from "@/types/product.types";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";

type FiltersStore = {
  drafts: Record<string, ProductFilterParams>;
  appliedByTab: Record<string, Partial<ProductFilterParams>>;
  setDraft: (tabKey: string, patch: Partial<ProductFilterParams>) => void;
  apply: (tabKey: string) => void;
  reset: (tabKey?: string) => void;
  resetSection: (tabKey: string, keys: (keyof ProductFilterParams)[]) => void;
  resetPriceSection: (tabKey: string, min: number, max: number) => void;
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set) => ({
      drafts: { all: { ...defaultFilters } },
      appliedByTab: {},
      setDraft: (tabKey, patch) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [tabKey]: { ...(s.drafts[tabKey] ?? defaultFilters), ...patch },
          },
        })),
      apply: (tabKey) => {
        set((s) => ({
          appliedByTab: {
            ...s.appliedByTab,
            [tabKey]: { ...(s.drafts[tabKey] ?? defaultFilters) },
          },
        }));
      },
      reset: (tabKey) =>
        set((s) => {
          if (!tabKey) {
            return {
              drafts: { all: { ...defaultFilters } },
              appliedByTab: {},
            };
          }
          const newDrafts = { ...s.drafts, [tabKey]: { ...defaultFilters } };
          const newApplied = removeKeyFromObject(s.appliedByTab, tabKey);
          return { drafts: newDrafts, appliedByTab: newApplied };
        }),
      resetSection: <K extends keyof ProductFilterParams>(tabKey: string, keys: K[]) => {
        set((s) => {
          const current = s.drafts[tabKey] ?? defaultFilters;
          const updates = {} as Partial<ProductFilterParams>;
          keys.forEach((key) => {
            updates[key] = defaultFilters[key];
          });
          return {
            drafts: {
              ...s.drafts,
              [tabKey]: { ...current, ...updates },
            },
          };
        });
      },
      resetPriceSection: (tabKey, min, max) => {
        set((s) => {
          const current = s.drafts[tabKey] ?? defaultFilters;
          const updates: Partial<ProductFilterParams> = {
            priceMin: defaultFilters.priceMin ?? min,
            priceMax: defaultFilters.priceMax ?? max,
          };
          return { drafts: { ...s.drafts, [tabKey]: { ...current, ...updates } } };
        });
      },
    }),
    {
      name: "filters-session-storage-by-tab",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ appliedByTab: state.appliedByTab }),
      onRehydrateStorage: () => (state) => {
        if (state?.appliedByTab) {
          const drafts: Record<string, ProductFilterParams> = {};
          Object.keys(state.appliedByTab).forEach((tab) => {
            const applied = state.appliedByTab![tab];
            drafts[tab] = { ...defaultFilters, ...applied };
          });
          if (!drafts.all) drafts.all = { ...defaultFilters };
          state.drafts = drafts;
        }
      },
    }
  )
);
