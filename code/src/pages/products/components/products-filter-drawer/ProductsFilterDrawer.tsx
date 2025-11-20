import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import AppLoader from "@/components/app-loader/AppLoader";

import { useFiltersStore } from "@/store/zustand/filtersStore";

import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import { ProductsFilterDrawerProps, ProductsResponse } from "@/pages/products/components/products-filter-drawer/ProductsFilterDrawer.types";
import DiscountFilterSection from "@/pages/products/components/products-filter-drawer/drawer-sections/discount-filter-section/DiscountFilterSection";
import AvailabilityFilterSection from "@/pages/products/components/products-filter-drawer/drawer-sections/availability-filter-section/AvailabilityFilterSection";
import PriceFilterSection from "@/pages/products/components/products-filter-drawer/drawer-sections/price-filters-section/PriceFilterSection";
import CategoriesFilterSection from "@/pages/products/components/products-filter-drawer/drawer-sections/categories-filter-section/CategoriesFilterSection";
import ResetFiltersIcon from "@/pages/products/components/products-filter-buttons/reset-filters-icon/resetFiltersIcon";
import ResetFiltersButton from "@/pages/products/components/products-filter-buttons/reset-filters-button/ResetFiltersButton";
import ApplyFiltersButton from "@/pages/products/components/products-filter-buttons/apply-filters-button/ApplyFiltersButton";
import DeliverySection from "@/pages/products/components/products-filter-drawer/drawer-sections/delivery-filter-section/DeliveryFilterSection";

import "@/pages/products/components/products-filter-drawer/ProductsFilterDrawer.scss";

const ProductsFilterDrawer = ({
  closeFilterDrawer,
  activeFiltersCount,
  tabKey,
  productsResponse: data
}: ProductsFilterDrawerProps) => {
  const apply = useFiltersStore(s => s.apply);
  const reset = useFiltersStore(s => s.reset);
  const draftsByTab = useFiltersStore(s => s.drafts);
  const draft = draftsByTab[tabKey] ?? defaultFilters;

  const handleApplyFilters = () => {
    apply(tabKey);
    closeFilterDrawer();
  };

  const handleResetFilters = () => {
    reset(tabKey);
    closeFilterDrawer();
  };

  const renderSections = (tabKey: string, data?: ProductsResponse) => {
    if (!data || data.isLoading || data.minProductPrice === undefined || data.maxProductPrice === undefined) {
      return <AppLoader variant="disabled" size="small" />;
    }

    return (
      <>
        {tabKey === "all" && <CategoriesFilterSection tabKey={tabKey} />}
        <DiscountFilterSection tabKey={tabKey} draft={draft} />
        <PriceFilterSection tabKey={tabKey} min={data.minProductPrice} max={data.maxProductPrice} />
        <AvailabilityFilterSection tabKey={tabKey} draft={draft} />
        <DeliverySection tabKey={tabKey} draft={draft} />
      </>
    );
  };

  return (
    <AppBox className="products-filters">
      <AppBox className="products-filters__header">
        <AppBox className="products-filters__reset-icon">
          <ResetFiltersIcon
            activeFiltersCount={activeFiltersCount}
            onClick={handleResetFilters}
          />
        </AppBox>
        <AppTypography
          variant="subtitle2"
          translationKey="productsFilter.title"
          className="products-filters__title"
          component="h2"
        />
      </AppBox>
      <AppBox className="products-filters__items">
        {renderSections(tabKey, data)}
      </AppBox>
      <AppBox className="products-filters__footer">
        <ResetFiltersButton onClick={handleResetFilters} />
        <ApplyFiltersButton onClick={handleApplyFilters} />
      </AppBox>
    </AppBox>
  );
};

export default ProductsFilterDrawer;
