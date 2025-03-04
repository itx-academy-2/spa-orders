import { useState } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import PaginationBlock from "@/containers/pagination-block/PaginationBlock";
import ProductsContainer from "@/containers/products-container/ProductsContainer";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppDrawer from "@/components/app-drawer/AppDrawer";
import AppTypography from "@/components/app-typography/AppTypography";

import "@/pages/sales/SalesPage.scss";

import SalesFilterDrawer from "./components/sales-filter-drawer/SalesFilterDrawer";
import useSalesFilter from "./hooks/useSalesFilter";

const SalesPage = () => {
  const {
    products: sales,
    totalPages,
    isLoading,
    page,
    activeFiltersCount,
    filterActions,
    filters,
    isError,
    totalElements,
    defaultFilters
  } = useSalesFilter();

  const [isFilterDrawerOpened, setIsFilterDrawerOpened] = useState(false);

  const handleOpenFilterDrawer = () => setIsFilterDrawerOpened(true);
  const handleCloseFilterDrawer = () => setIsFilterDrawerOpened(false);

  const titleTypography =
    activeFiltersCount > 0 ? (
      <AppTypography
        translationKey="salesFilter.titleWithCount"
        data-cy="applied-filters-count"
        translationProps={{
          values: {
            count: activeFiltersCount
          }
        }}
      />
    ) : (
      <AppTypography translationKey="salesFilter.title" />
    );

  const salesCount = totalElements ?? 0;

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
            <AppButton
              variant="dark"
              onClick={handleOpenFilterDrawer}
              data-testid="filter-button"
              data-cy="filter-button"
            >
              {titleTypography}
              <FilterListIcon />
            </AppButton>
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
