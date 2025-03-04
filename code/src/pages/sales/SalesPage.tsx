import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import FilterListIcon from "@mui/icons-material/FilterList";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import PaginationBlock from "@/containers/pagination-block/PaginationBlock";
import ProductsContainer from "@/containers/products-container/ProductsContainer";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppDrawer from "@/components/app-drawer/AppDrawer";
import AppDropdown from "@/components/app-dropdown/AppDropdown";
import AppTypography from "@/components/app-typography/AppTypography";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import usePagination from "@/hooks/use-pagination/usePagination";
import { sortSaleOptions } from "@/pages/sales/SalesPage.constants";
import { useGetSalesProductsQuery } from "@/store/api/productsApi";

import "@/pages/sales/SalesPage.scss";

import SalesFilterDrawer from "./components/sales-filter-drawer/SalesFilterDrawer";
import useSalesFilter from "./hooks/useSalesFilter";

const SalesPage = () => {
  const { locale } = useLocaleContext();
  const { page } = usePagination();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOption = searchParams.get("sort");

  // Label for the filters button – showing the applied filters count (1 in this example)
  const filtersLabel = (
    <AppTypography
      translationKey="salesFilter.titleWithCount"
      translationProps={{ values: { count: 1 } }}
    />
  );

  const {
    products: sales,
    totalPages = 0,
    activeFiltersCount,
    filterActions,
    filters,
    defaultFilters
  } = useSalesFilter();

  const {
    data: salesResponse,
    isLoading,
    isError
  } = useGetSalesProductsQuery({
    lang: locale,
    size: 3,
    page: page - 1,
    sort: sortOption ?? undefined
  });

  const [isFilterDrawerOpened, setIsFilterDrawerOpened] = useState(false);

  const handleOpenFilterDrawer = () => setIsFilterDrawerOpened(true);
  const handleCloseFilterDrawer = () => setIsFilterDrawerOpened(false);

  // const salesList = salesResponse?.pageProducts?.content ?? [];
  const salesCount = salesResponse?.pageProducts?.totalElements ?? 0;

  // Changed from using AppTypography for the default label to plain text for testing.
  const defaultDropdownText = "Sort";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    setSearchParams(params);
  };

  useEffect(() => {
    if (salesResponse && page > totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", totalPages.toString());
      setSearchParams(params);
    }
  }, [salesResponse, page, searchParams, setSearchParams, totalPages]);

  return (
    <>
      <PageWrapper>
        <AppBox className="spa-sales-page" data-cy="sales-page">
          <AppBox className="spa-sales-page__header">
            <AppTypography
              variant="h3"
              className="spa-sales-page__header"
              translationKey="productsAll.sales"
              component="h1"
            />
            <AppBox className="spa-sales-page__actions">
              <AppDropdown
                options={sortSaleOptions}
                onSelect={handleSortChange}
                defaultLabel={defaultDropdownText}
              />
              <AppButton variant="dark" onClick={handleOpenFilterDrawer}>
                {filtersLabel}
                <FilterListIcon />
              </AppButton>
            </AppBox>
          </AppBox>
          <AppBox className="spa-sales-page__info">
            <AppTypography className="spa-sales-page__count" component="span">
              <AppTypography
                translationKey="salesPage.label"
                component="span"
                translationProps={{ values: { count: salesCount } }}
              />
            </AppTypography>
          </AppBox>
          <ProductsContainer
            className="spa-sales-page__grid"
            products={sales ?? []} // resolve here
            loadingItemsCount={3}
            isLoading={isLoading}
            isError={isError}
            maxColumns={3}
          />
          <PaginationBlock page={page} totalPages={totalPages} />
        </AppBox>
      </PageWrapper>
      {sales && (
        <AppDrawer
          isOpen={isFilterDrawerOpened}
          onClose={handleCloseFilterDrawer}
        >
          <SalesFilterDrawer
            filters={filters}
            filterActions={filterActions}
            activeFiltersCount={activeFiltersCount}
            closeFilterDrawer={handleCloseFilterDrawer}
            defaultFilters={defaultFilters}
          />
        </AppDrawer>
      )}
    </>
  );
};

export default SalesPage;
