import { SyntheticEvent } from "react";

import FilterListOffIcon from "@mui/icons-material/FilterListOff";

import FilterRecordAccordion from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion";

import AppBadge from "@/components/app-badge/AppBadge";
import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppCheckbox from "@/components/app-checkbox/AppCheckbox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppRangeSlider from "@/components/app-range-slider/AppRangeSlider";
import AppTooltip from "@/components/app-tooltip/AppTooltip";
import AppTypography from "@/components/app-typography/AppTypography";

import { FilterActions } from "@/hooks/use-filters-with-apply/useFiltersWithApply.types";
import { categoryProbableFilters } from "@/pages/sales/SalesPage.constants";
import { ProductsPageFilters } from "@/pages/products/ProductsPage.types";

import "@/pages/products/components/products-filter-drawer/ProductsFilterDrawer.scss";

type ProductsFilterDrawerProps = {
  activeFiltersCount: number;
  filters: ProductsPageFilters;
  filterActions: FilterActions<ProductsPageFilters>;
  defaultFilters: ProductsPageFilters;
  closeFilterDrawer: () => void;
  showCategory: boolean;
};

const ProductsFilterDrawer = ({
  activeFiltersCount,
  filters,
  filterActions,
  defaultFilters,
  closeFilterDrawer,
  showCategory
}: ProductsFilterDrawerProps) => {
  const {
    applyFilters,
    updateFilterByKey,
    resetFilters,
    resetFilterByKey,
    checkFilterActive
  } = filterActions;

  const handleCheckboxListChange =
    <Key extends keyof ProductsPageFilters>(key: Key, value: string) =>
    (event: SyntheticEvent, checked: boolean) => {
      const filtersSet = new Set(filters["tags"]);

      if (checked) {
        filtersSet.add(value);
      } else {
        filtersSet.delete(value);
      }

      updateFilterByKey(key, filtersSet as ProductsPageFilters[Key]);
    };

  const categoriesCheckboxes = categoryProbableFilters.map(({ id, translationKey }) => (
    <AppCheckbox
      key={translationKey}
      checked={filters.tags.has(id)}
      onChange={handleCheckboxListChange("tags", id)}
      data-testid={`products-page-filter-${id.replace("category:", "")}-checkbox`}
      labelTranslationKey={translationKey}
      variant="dark"
    />
  ));

  const handlePriceChange = (value: number[]) => {
    updateFilterByKey("price", { start: value[0], end: value[1] });
  };

  const resetFiltersButton = activeFiltersCount > 0 && (
    <AppTooltip placement="bottom" titleTranslationKey="productsFilter.clear" className="products-filters__clear-filters-tooltip" data-testid="products-filter-reset-btn">
      <AppBadge badgeContent={activeFiltersCount} size="small">
        <AppIconButton onClick={resetFilters}>
          <FilterListOffIcon />
        </AppIconButton>
      </AppBadge>
    </AppTooltip>
  );

  const handleApplyFilters = () => {
    applyFilters({ additionalParams: { page: "1" } });
    closeFilterDrawer();
  };

  const resetFilter = (key: keyof ProductsPageFilters) => () => resetFilterByKey(key);

  const isCategoryFilterActive = checkFilterActive("tags");

  const isPriceFilterActive = checkFilterActive("price");

  return (
    <AppBox className="products-filters">
      <AppBox className="products-filters__header">
        <AppTypography variant="subtitle2" translationKey="productsFilter.title" data-testid="products-filter-title" component="h2" fontWeight="extra-bold" />
        {resetFiltersButton}
      </AppBox>
      <AppBox className="products-filters__items">
        {showCategory && (
          <FilterRecordAccordion isFilterActive={isCategoryFilterActive} resetFilter={resetFilter("tags")} sectionCaptionTranslationKey="productsFilter.category">
            {categoriesCheckboxes}
          </FilterRecordAccordion>
        )}
        <FilterRecordAccordion isFilterActive={isPriceFilterActive} resetFilter={resetFilter("price")} sectionCaptionTranslationKey="productsFilter.price">
          <AppRangeSlider value={[filters.price.start, filters.price.end]} onChange={handlePriceChange} min={defaultFilters.price.start} max={defaultFilters.price.end} />
        </FilterRecordAccordion>
      </AppBox>
      <AppBox className="products-filters__footer">
        <AppButton data-testid="products-filter-apply-btn" onClick={handleApplyFilters} fullWidth>
          <AppTypography translationKey="productsFilter.apply" />
        </AppButton>
      </AppBox>
    </AppBox>
  );
};

export default ProductsFilterDrawer;
