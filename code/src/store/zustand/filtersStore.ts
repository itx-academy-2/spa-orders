import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ProductsPageFilters } from "@/pages/products/ProductsPage.types";
import { defaultAllProductsFilters } from "@/pages/products/ProductsPage.constants";

type FiltersStore = {
  filtersByTab: Record<string, ProductsPageFilters>;
  setFilters: (tab: string, filters: ProductsPageFilters) => void;
  getFilters: (tab: string) => ProductsPageFilters;
  resetFilters: (tab: string) => void;
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, get) => ({
      filtersByTab: {},
      setFilters: (tab, filters) =>
        set((state) => ({ filtersByTab: { ...state.filtersByTab, [tab]: filters } })),
      getFilters: (tab) => get().filtersByTab[tab] ?? defaultAllProductsFilters,
      resetFilters: (tab) =>
        set((state) => ({ filtersByTab: { ...state.filtersByTab, [tab]: { ...defaultAllProductsFilters } } }))
    }),
    { name: "products-filters" }
  )
);
