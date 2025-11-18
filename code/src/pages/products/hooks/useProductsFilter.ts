import { useSearchParams } from "react-router-dom";

import { useFiltersStore } from "@/store/zustand/filtersStore";
import { useGetUserProductsQuery } from "@/store/api/productsApi";

import { GetUserProductsParams } from "@/types/product.types";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import usePagination from "@/hooks/use-pagination/usePagination";

import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";

const DEFAULT_SORT = "createdAt,desc";

export const useProductsFilter = () => {
  const { locale } = useLocaleContext();
  const { page } = usePagination();
  const screenSize = useScreenSize();
  const size = Math.min(setProductsPerPageSize(screenSize.width), 6);
  const [searchParams] = useSearchParams();
  const sortOption = searchParams.get("sort");

  const applied = useFiltersStore(s => s.applied);
  const reset = useFiltersStore(s => s.reset);

  const params: GetUserProductsParams = {
    ...applied,
    lang: locale,
    sort: sortOption ?? DEFAULT_SORT,
    page: page - 1,
    size,
  };

  const { data, isLoading, isError } = useGetUserProductsQuery(params);
  console.log('useProductsFilter render', { appliedRef: applied, page, size, locale });
  console.log("Params for API:", params);

  const products = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const activeFiltersCount = Object.values(applied).filter(Boolean).length;;

  return {
    products,
    totalPages,
    totalElements,
    activeFiltersCount,
    filters: applied,
    defaultFilters: { ...applied },
    resetFilters: reset,
    isLoading,
    isError,
    productsResponse: data
  };
};

export default useProductsFilter;
