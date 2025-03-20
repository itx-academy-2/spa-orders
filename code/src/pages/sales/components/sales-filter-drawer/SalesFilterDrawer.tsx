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
import { SalesPageFilters } from "@/pages/sales/SalesPage.types";

import "@/pages/sales/components/sales-filter-drawer/SalesFilterDrawer.styles.scss";

type SalesPageFilterDrawerProps = {
  activeFiltersCount: number;
  filters: SalesPageFilters;
  filterActions: FilterActions<SalesPageFilters>;
  defaultFilters: SalesPageFilters;
  closeFilterDrawer: () => void;
};

const SalesFilterDrawer = ({
  activeFiltersCount,
  filters,
  filterActions,
  defaultFilters,
  closeFilterDrawer
}: SalesPageFilterDrawerProps) => {
  const {
    applyFilters,
    updateFilterByKey,
    resetFilters,
    resetFilterByKey,
    checkFilterActive
  } = filterActions;

  const handleCheckboxListChange =
    <Key extends keyof SalesPageFilters>(key: Key, value: string) =>
    (event: SyntheticEvent, checked: boolean) => {
      const filtersSet = new Set(filters["tags"]);

      if (checked) {
        filtersSet.add(value);
      } else {
        filtersSet.delete(value);
      }

      updateFilterByKey(key, filtersSet as SalesPageFilters[Key]);
    };

  const categoriesCheckboxes = categoryProbableFilters.map(
    ({ id, translationKey }) => (
      <AppCheckbox
        key={translationKey}
        checked={filters.tags.has(id)}
        onChange={handleCheckboxListChange("tags", id)}
        data-testid={`sales-page-filter-${id.replace("category:", "")}-checkbox`}
        variant="dark"
        labelTranslationKey={translationKey}
      />
    )
  );

  const handleDiscountPercentageChange = (value: number[]) => {
    updateFilterByKey("discountPercentage", { start: value[0], end: value[1] });
  };

  const handlePriceWithDiscountChange = (value: number[]) => {
    updateFilterByKey("priceWithDiscount", { start: value[0], end: value[1] });
  };

  const resetFiltersButton = activeFiltersCount > 0 && (
    <AppTooltip
      placement="bottom"
      titleTranslationKey="salesFilter.clear"
      className="sales-filters__clear-filters-tooltip"
      data-testid="sales-filter-reset-btn"
    >
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

  const resetFilter = (key: keyof SalesPageFilters) => () =>
    resetFilterByKey(key);

  const isCategoryFilterActive = checkFilterActive("tags");

  const isDiscountPercentageFilterActive =
    checkFilterActive("discountPercentage");
  const isPriceWithDiscountFilterActive =
    checkFilterActive("priceWithDiscount");

  return (
    <AppBox className="sales-filters">
      <AppBox className="sales-filters__header">
        <AppTypography
          variant="subtitle2"
          translationKey="salesFilter.title"
          data-testid="sales-filter-title"
          component="h2"
          fontWeight="extra-bold"
        />
        {resetFiltersButton}
      </AppBox>
      <AppBox className="sales-filters__items">
        <FilterRecordAccordion
          isFilterActive={isCategoryFilterActive}
          resetFilter={resetFilter("tags")}
          sectionCaptionTranslationKey="salesFilter.category"
        >
          {categoriesCheckboxes}
        </FilterRecordAccordion>
        <FilterRecordAccordion
          isFilterActive={isDiscountPercentageFilterActive}
          resetFilter={resetFilter("discountPercentage")}
          sectionCaptionTranslationKey="salesFilter.discount"
        >
          <AppRangeSlider
            value={[
              filters.discountPercentage.start,
              filters.discountPercentage.end
            ]}
            onChange={handleDiscountPercentageChange}
            min={defaultFilters.discountPercentage.start}
            max={defaultFilters.discountPercentage.end}
          />
        </FilterRecordAccordion>
        <FilterRecordAccordion
          isFilterActive={isPriceWithDiscountFilterActive}
          resetFilter={resetFilter("priceWithDiscount")}
          sectionCaptionTranslationKey="salesFilter.price"
        >
          <AppRangeSlider
            value={[
              filters.priceWithDiscount.start,
              filters.priceWithDiscount.end
            ]}
            onChange={handlePriceWithDiscountChange}
            min={defaultFilters.priceWithDiscount.start}
            max={defaultFilters.priceWithDiscount.end}
          />
        </FilterRecordAccordion>
      </AppBox>
      <AppBox className="sales-filters__footer">
        <AppButton
          data-testid="sales-filter-apply-btn"
          onClick={handleApplyFilters}
          fullWidth
        >
          <AppTypography translationKey="salesFilter.apply" />
        </AppButton>
      </AppBox>
    </AppBox>
  );
};

export default SalesFilterDrawer;
