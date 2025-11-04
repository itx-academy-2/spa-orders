import { useEffect } from "react";

import { useLocaleContext } from "@/context/i18n/I18nProvider";

import useFiltersWithApply from "@/hooks/use-filters-with-apply/useFiltersWithApply";
import usePagination from "@/hooks/use-pagination/usePagination";

import { defaultAllProductsFilters } from "@/pages/products/ProductsPage.constants";
import { ProductsPageFilters } from "@/pages/products/ProductsPage.types";

import { useGetUserProductsQuery } from "@/store/api/productsApi";

type UseAllProductsFilterExtraParams = {
  sort?: string;
  category?: string | null;
};

const useAllProductsFilter = (extraParams?: UseAllProductsFilterExtraParams) => {
  const { locale } = useLocaleContext();

  const { page } = usePagination();

  const {
    filters,
    appliedFilters,
    activeFiltersCount,
    actions: filterActions,
    defaultFilters
  } = useFiltersWithApply<ProductsPageFilters>(defaultAllProductsFilters);

  const tagsArray = appliedFilters.tags ? Array.from(appliedFilters.tags) : undefined;
  const tags = tagsArray ? tagsArray.join(",") : undefined;

  const {
    data: productsResponse,
    isLoading,
    isError
  } = useGetUserProductsQuery({
    lang: locale,
    page: page - 1,
    size: 20,
    priceMin: appliedFilters.price?.start,
    priceMax: appliedFilters.price?.end,
    tags,
    sort: extraParams?.sort
  });

  useEffect(() => {
    if (productsResponse) {
      const priceRange = {
        start: productsResponse?.priceMin ?? defaultAllProductsFilters.price.start,
        end: productsResponse?.priceMax ?? defaultAllProductsFilters.price.end
      };

      filterActions.setDefaultFilters({
        ...defaultAllProductsFilters,
        price: priceRange
      });
    }
  }, [isLoading]);

  const isCategoryFilterVisible = !extraParams?.category;

  const products = productsResponse?.pageProducts?.content ?? productsResponse?.content ?? [];
  const totalPages = productsResponse?.pageProducts?.totalPages ?? productsResponse?.totalPages ?? 0;
  const totalElements = productsResponse?.pageProducts?.totalElements ?? productsResponse?.totalElements ?? 0;

  return {
    filters,
    filterActions,
    activeFiltersCount,
    products,
    totalPages,
    page,
    isLoading,
    totalElements,
    isError,
    defaultFilters,
    isCategoryFilterVisible
  } as const;
};

export default useAllProductsFilter;
