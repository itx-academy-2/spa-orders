import { useEffect } from "react";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import useFiltersWithApply from "@/hooks/use-filters-with-apply/useFiltersWithApply";
import usePagination from "@/hooks/use-pagination/usePagination";
import { defaultSalesPageFilters } from "@/pages/sales/SalesPage.constants";
import { useGetSalesProductsQuery } from "@/store/api/productsApi";

type UseSalesFilterExtraParams = {
  sort?: string;
};

const useSalesFilter = (extraParams?: UseSalesFilterExtraParams) => {
  const { locale } = useLocaleContext();

  const { page } = usePagination();

  const {
    filters,
    appliedFilters,
    activeFiltersCount,
    actions: filterActions,
    defaultFilters
  } = useFiltersWithApply(defaultSalesPageFilters);

  const tags = appliedFilters.tags
    ? Array.from(appliedFilters.tags)
    : undefined;

  const {
    data: salesResponse,
    isLoading,
    isError
  } = useGetSalesProductsQuery({
    lang: locale,
    page: page - 1,
    size: 3,
    minimumPriceWithDiscount: appliedFilters.priceWithDiscount?.start,
    maximumPriceWithDiscount: appliedFilters.priceWithDiscount?.end,
    maximumDiscount: appliedFilters.discountPercentage?.end,
    minimumDiscount: appliedFilters.discountPercentage?.start,
    tags,
    sort: extraParams?.sort
  });

  useEffect(() => {
    if (salesResponse) {
      const discountPercentageRange = {
        start: salesResponse?.minimumDiscount ?? 0,
        end: salesResponse?.maximumDiscount ?? 100
      };

      const priceWithDiscountRange = {
        start: salesResponse?.minimumPriceWithDiscount ?? 0,
        end: salesResponse?.maximumPriceWithDiscount ?? 100
      };

      filterActions.setDefaultFilters({
        ...defaultSalesPageFilters,
        discountPercentage: discountPercentageRange,
        priceWithDiscount: priceWithDiscountRange
      });
    }
  }, [isLoading]);

  const products = salesResponse?.pageProducts.content ?? [];
  const totalPages = salesResponse?.pageProducts.totalPages;
  const totalElements = salesResponse?.pageProducts.totalElements;

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
    defaultFilters
  } as const;
};

export default useSalesFilter;
