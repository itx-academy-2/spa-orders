import { useEffect, useMemo } from "react";

import { useLocaleContext } from "@/context/i18n/I18nProvider";

import { useGetUserProductsQuery } from "@/store/api/productsApi";
import { useFiltersStore } from "@/store/zustand/filtersStore";

import { UseAllProductsFilterExtraParams } from "@/pages/products/hooks/useAllProductsFilter.types";
import { defaultAllProductsFilters } from "@/pages/products/ProductsPage.constants";
import { ProductsPageFilters } from "@/pages/products/ProductsPage.types";

import usePagination from "@/hooks/use-pagination/usePagination";

import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";
import toNum from "@/utils/price-to-number/priceToNumber";

const useAllProductsFilter = (extraParams?: UseAllProductsFilterExtraParams) => {
  const { locale } = useLocaleContext();

  const { page } = usePagination();

  const tabKey = extraParams?.category ?? "all";

  const setFiltersInStore = useFiltersStore((state) => state.setFilters);

  const rawStoredFilters = useFiltersStore((state) => state.filtersByTab[tabKey]);

  const defaultForThisTab: ProductsPageFilters = useMemo(() => {
    if (extraParams?.category) {
      const tag = `category:${String(extraParams.category).trim()}`;
      return { ...defaultAllProductsFilters, tags: [tag] };
    }
    return defaultAllProductsFilters;
  }, [extraParams?.category]);

  const filters: ProductsPageFilters = rawStoredFilters ?? defaultForThisTab;

  const setFilters = (newFilters: ProductsPageFilters) => {
    setFiltersInStore(tabKey, newFilters);
  };

  const tagsParam = useMemo(() => {
    if (extraParams?.category) {
      return `category:${String(extraParams.category).trim()}`;
    }
    return filters.tags.length > 0 ? filters.tags.join(",") : undefined;
  }, [extraParams?.category, filters.tags]);

  const screenSize = useScreenSize();

  const size = setProductsPerPageSize(screenSize.width);

  const {
    data: productsResponse,
    isLoading, isError
  } = useGetUserProductsQuery({
    lang: locale,
    page: Math.max(0, (page ?? 1) - 1),
    size,
    sort: extraParams?.sort,
    tags: tagsParam,
    minProductPrice: filters.price.start,
    maxProductPrice: filters.price.end,
    discount: filters.discount,
    nonDiscount: filters.nonDiscount,
    availability: filters.availability,
    nonAvailability: filters.nonAvailability,
    deliveryNovaPost: filters.deliveryNovaPost,
    deliveryUkrPost: filters.deliveryUkrPost
  });

  useEffect(() => {
    if (!productsResponse) return;

    const priceRange = {
      start: toNum(productsResponse.minProductPrice, defaultForThisTab.price.start),
      end: toNum(productsResponse.maxProductPrice, defaultForThisTab.price.end)
    };

    const isUserPriceDefault =
      filters.price.start === defaultForThisTab.price.start &&
      filters.price.end === defaultForThisTab.price.end;

    if (!isUserPriceDefault) return;

    const hasChanged = filters.price.start !== priceRange.start || filters.price.end !== priceRange.end;
    if (hasChanged) {
      setFilters({ ...filters, price: priceRange });
    }
  }, [productsResponse, filters, setFilters]);

  const products = productsResponse?.content ?? [];
  const totalPages = productsResponse?.totalPages ?? 0;
  const totalElements = productsResponse?.totalElements ?? 0;

  const isCategoryFilterVisible = !extraParams?.category;

  const tagsAreDefault = (() => {
    const current = filters.tags ?? [];
    const def = defaultForThisTab.tags ?? [];
    
    if (current.length !== def.length) return false;
    return current.every((t) => def.includes(t));
  })();

  const priceIsDefault =
    filters.price.start === defaultForThisTab.price.start &&
    filters.price.end === defaultForThisTab.price.end;

  const activeFiltersCount = (tagsAreDefault ? 0 : 1) + (priceIsDefault ? 0 : 1);

  const resetFilterByKey = <K extends keyof ProductsPageFilters>(key: K) => {
    setFilters({ ...filters, [key]: defaultForThisTab[key] } as ProductsPageFilters);
  };

  const resetFilters = () => {
    setFilters(defaultForThisTab);
  };

  return {
    filters,
    setFilters,
    activeFiltersCount,
    products,
    totalPages,
    page,
    isLoading,
    totalElements,
    isError,
    defaultFilters: defaultForThisTab,
    isCategoryFilterVisible,
    resetFilterByKey,
    resetFilters
  } as const;
};

export default useAllProductsFilter;
