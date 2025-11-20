import { useSearchParams } from "react-router-dom";

import { useFiltersStore } from "@/store/zustand/filtersStore";
import { useGetUserProductsQuery } from "@/store/api/productsApi";

import { GetUserProductsParams } from "@/types/product.types";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import usePagination from "@/hooks/use-pagination/usePagination";

import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import { ProductFilterParams } from "@/types/product.types";
import { filterSections } from "../ProductsPage.types";

export const useProductsFilter = () => {
  const { locale } = useLocaleContext();
  const { page } = usePagination();
  const screenSize = useScreenSize();
  const size = Math.min(setProductsPerPageSize(screenSize.width), 6);
  const [searchParams] = useSearchParams();
  const sortOption = searchParams.get("sort");
  const categoryType = searchParams.get("category");
  const tabKey = categoryType ?? "all";

  const appliedByTab = useFiltersStore((s) => s.appliedByTab);
  const draftsByTab = useFiltersStore((s) => s.drafts);

  const applied = appliedByTab[tabKey] ?? defaultFilters;
  const draft = draftsByTab[tabKey] ?? defaultFilters;

  const tags =
    categoryType
      ? [`category:${categoryType}`]
      : (applied.tags && applied.tags.length > 0 ? applied.tags : defaultFilters.tags);

  const params: Partial<GetUserProductsParams> = {
    ...applied,
    tags,
    lang: locale,
    sort: sortOption ?? undefined,
    page: page - 1,
    size,
  };

  const { data, isLoading, isError } = useGetUserProductsQuery(params as GetUserProductsParams);

  const products = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const countActiveSections = (draftLocal: ProductFilterParams, data?: { minProductPrice: number; maxProductPrice: number }) => {
    return filterSections.filter(section => {
      if (section.keys.includes("tags")) {
        return JSON.stringify(draftLocal.tags ?? defaultFilters.tags) !== JSON.stringify(defaultFilters.tags);
      }
      if (section.keys.includes("priceMin") || section.keys.includes("priceMax")) {
        const minDefault = data?.minProductPrice ?? defaultFilters.priceMin ?? 0;
        const maxDefault = data?.maxProductPrice ?? defaultFilters.priceMax ?? 0;
        return (draftLocal.priceMin != null && draftLocal.priceMin !== minDefault) ||
          (draftLocal.priceMax != null && draftLocal.priceMax !== maxDefault);
      }
      return section.keys.some(key => draftLocal[key] !== defaultFilters[key] && draftLocal[key] != null);
    }).length;
  };
  const activeFiltersCount = countActiveSections(draft, data);

  return {
    products,
    totalPages,
    totalElements,
    activeFiltersCount,
    filters: applied,
    defaultFilters: { ...applied },
    isLoading,
    isError,
    productsResponse: data
  };
};

export default useProductsFilter;
