import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import FilterListIcon from "@mui/icons-material/FilterList";

import PageWrapper from "@/layouts/page-wrapper/PageWrapper";

import PaginationBlock from "@/containers/pagination-block/PaginationBlock";
import ProductsContainer from "@/containers/products-container/ProductsContainer";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppDropdown from "@/components/app-dropdown/AppDropdown";
import AppTypography from "@/components/app-typography/AppTypography";
import AppDrawer from "@/components/app-drawer/AppDrawer";

import usePagination from "@/hooks/use-pagination/usePagination";
import useTrackVisits from "@/hooks/use-track-visits/useTrackVisits";
import useWishlistWithAuthCheck from "@/hooks/use-wishlist-with-auth-check/useWishlistWithAuthCheck";
import { sortOptions } from "@/pages/products/ProductsPage.constants";
import useAllProductsFilter from "@/pages/products/hooks/useAllProductsFilter";
import ProductsFilterDrawer from "@/pages/products/components/products-filter-drawer/ProductsFilterDrawer";

import "@/pages/products/ProductsPage.scss";

const ProductsPage = () => {
  const { page } = usePagination();

  const [searchParams, setSearchParams] = useSearchParams();

  const sortOption = searchParams.get("sort");

  const categoryType = searchParams.get("category");

  const tabKey = categoryType ?? "all";

  const {
    products,
    totalPages = 0,
    activeFiltersCount,
    filters,
    defaultFilters,
    totalElements = 0,
    isCategoryFilterVisible,
    resetFilters,
    isLoading,
    isError,
    productsResponse
  } = useAllProductsFilter({ sort: sortOption ?? undefined, category: categoryType ?? undefined });

  const [isFilterDrawerOpened, setIsFilterDrawerOpened] = useState(false);

  const handleOpenFilterDrawer = () => setIsFilterDrawerOpened(true);
  const handleCloseFilterDrawer = () => setIsFilterDrawerOpened(false);

  useTrackVisits("category", categoryType as string);

  const { data: wishlistData } = useWishlistWithAuthCheck();
  const wishlist = wishlistData?.content ?? [];

  const productsList = products ?? [];

  const pagesCount = totalPages ?? 1;

  const defaultDropdownText = sortOptions.find(
    (item) => item.value === sortOption
  )?.label || <AppTypography translationKey="productsDefault.label" />;

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    setSearchParams(params);
  };

  const productsAllLabels = !categoryType
    ? "productsAll.label"
    : `productsAll.${categoryType}`;

  const productsItemsLabel = !categoryType
    ? "productsItems.label"
    : `productsItems.category.${categoryType}`;
  
  const productsCount = totalElements ?? 0;

  const titleTypography =
    activeFiltersCount > 0 ? (
      <AppTypography
        translationKey="productsFilter.titleWithCount"
        data-cy="applied-filters-count"
        translationProps={{
          values: {
            count: activeFiltersCount
          }
        }}
      />
    ) : (
      <AppTypography translationKey="productsFilter.title" />
    );

  useEffect(() => {
    if (page > pagesCount) {
      const params = new URLSearchParams(searchParams);
      params.set("page", pagesCount.toString());
      setSearchParams(params);
    }
  }, [pagesCount, page, searchParams, setSearchParams]);

  return (
    <PageWrapper>
      <AppBox className="spa-products-page" data-cy="products-page">
        <AppTypography
          variant="h3"
          className="spa-products-page__header"
          translationKey={productsAllLabels}
          component="h1"
        />
        <AppBox className="spa-products-page__info">
          <AppTypography className="spa-products-page__count" component="span">
            <AppTypography
              translationKey={productsItemsLabel}
              component="span"
              translationProps={{ values: { count: productsCount } }}
            />
          </AppTypography>
          <AppBox className="spa-products-page__actions">
            <AppDropdown
              key={sortOption}
              options={sortOptions}
              onSelect={handleSortChange}
              defaultLabel={defaultDropdownText}
              className="spa-products-page__sort"
              data-cy="products-dropdown"
            />
            <AppButton variant="dark" onClick={handleOpenFilterDrawer}>
              {titleTypography}
              <FilterListIcon />
            </AppButton>
          </AppBox>
        </AppBox>
        <ProductsContainer
          className="spa-products-page__grid"
          products={productsList ?? []}
          loadingItemsCount={10}
          isLoading={isLoading}
          isError={isError}
          wishlist={wishlist}
        />
        <PaginationBlock
          page={page}
          totalPages={pagesCount}
        />
      </AppBox>
      <AppDrawer isOpen={isFilterDrawerOpened} onClose={handleCloseFilterDrawer}>
        <ProductsFilterDrawer
          filters={filters}
          defaultFilters={defaultFilters}
          closeFilterDrawer={handleCloseFilterDrawer}
          showCategory={isCategoryFilterVisible}
          tabKey={tabKey}
          resetFilters={resetFilters}
          activeFiltersCount={activeFiltersCount}
          productsResponse={productsResponse}
        />
      </AppDrawer>
    </PageWrapper>
  );
};

export default ProductsPage;
