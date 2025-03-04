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

import usePagination from "@/hooks/use-pagination/usePagination";
import { sortSaleOptions } from "@/pages/sales/SalesPage.constants";

import "@/pages/sales/SalesPage.scss";

import SalesFilterDrawer from "./components/sales-filter-drawer/SalesFilterDrawer";
import useSalesFilter from "./hooks/useSalesFilter";

const SalesPage = () => {
  const { page } = usePagination();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOption = searchParams.get("sort");

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
    defaultFilters,
    totalElements: salesCount,
    isLoading,
    isError
  } = useSalesFilter({ sort: sortOption ?? undefined });

  const [isFilterDrawerOpened, setIsFilterDrawerOpened] = useState(false);

  const handleOpenFilterDrawer = () => setIsFilterDrawerOpened(true);
  const handleCloseFilterDrawer = () => setIsFilterDrawerOpened(false);

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
    if (sales && page > totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set("page", totalPages.toString());
      setSearchParams(params);
    }
  }, [sales, page, searchParams, setSearchParams, totalPages]);

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
            products={sales ?? []}
            loadingItemsCount={3}
            isLoading={isLoading}
            isError={isError}
            maxColumns={3}
          />
          {totalPages > 1 && (
            <PaginationBlock
              data-testid="pagination-block"
              page={page}
              totalPages={totalPages}
            />
          )}
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
