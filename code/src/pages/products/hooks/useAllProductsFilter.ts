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

import { GetUserProductsParams } from "@/types/product.types";

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

  const queryParams: GetUserProductsParams = useMemo(() => {
    const params: GetUserProductsParams = {
      lang: locale,
      page: Math.max(0, (page ?? 1) - 1),
      size,
      sort: extraParams?.sort,
    };

    const isPriceDefault =
      filters.price.start === defaultForThisTab.price.start &&
      filters.price.end === defaultForThisTab.price.end;

    if (tagsParam) params.tags = tagsParam;
    if (filters.discount !== undefined) params.discount = filters.discount;
    if (filters.nonDiscount !== undefined) params.nonDiscount = filters.nonDiscount;
    if (!isPriceDefault) {
      params.priceMin = filters.price.start;
      params.priceMax = filters.price.end;
    }
    if (filters.availability !== undefined) params.availability = filters.availability;
    if (filters.nonAvailability !== undefined) params.nonAvailability = filters.nonAvailability;
    if (filters.deliveryNovaPost !== undefined) params.deliveryNovaPost = filters.deliveryNovaPost;
    if (filters.deliveryUkrPost !== undefined) params.deliveryUkrPost = filters.deliveryUkrPost;

    return params;
  }, [
    locale,
    page,
    size,
    extraParams?.sort,
    tagsParam,
    filters.discount,
    filters.nonDiscount,
    filters.price.start,
    filters.price.end,
    filters.availability,
    filters.nonAvailability,
    filters.deliveryNovaPost,
    filters.deliveryUkrPost
  ]);

  const { data: productsResponse, isLoading, isError } = useGetUserProductsQuery(queryParams);

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
  const priceIsDefault = filters.price.start === defaultForThisTab.price.start && filters.price.end === defaultForThisTab.price.end;

  const activeFiltersCount =
  (tagsAreDefault ? 0 : 1) +
  (priceIsDefault ? 0 : 1) +
  ((filters.discount ?? false) !== (defaultForThisTab.discount ?? false) ? 1 : 0) +
  ((filters.nonDiscount ?? false) !== (defaultForThisTab.nonDiscount ?? false) ? 1 : 0) +
  ((filters.availability ?? false) !== (defaultForThisTab.availability ?? false) ? 1 : 0) +
  ((filters.nonAvailability ?? false) !== (defaultForThisTab.nonAvailability ?? false) ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      ...defaultForThisTab,
      price: defaultForThisTab.price
    });
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
    resetFilters,
    productsResponse
  } as const;
};

export default useAllProductsFilter;
