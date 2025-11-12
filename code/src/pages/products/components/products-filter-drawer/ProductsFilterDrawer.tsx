import { SyntheticEvent, useCallback, useEffect, useState } from "react";

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

import { useFiltersStore } from "@/store/zustand/filtersStore";

import { categoryProbableFilters } from "@/pages/sales/SalesPage.constants";
import { ProductsPageFilters } from "@/pages/products/ProductsPage.types";

import "@/pages/products/components/products-filter-drawer/ProductsFilterDrawer.scss";

type ProductsFilterDrawerProps = {
  filters: ProductsPageFilters;
  defaultFilters: ProductsPageFilters;
  closeFilterDrawer: () => void;
  showCategory?: boolean;
  tabKey: string;
  resetFilters: () => void;
  productsResponse?: { minProductPrice?: number; maxProductPrice?: number };
  activeFiltersCount: number;
};

const ProductsFilterDrawer = ({
  filters,
  defaultFilters,
  closeFilterDrawer,
  showCategory,
  tabKey,
  resetFilters,
  productsResponse,
  activeFiltersCount,
}: ProductsFilterDrawerProps) => {
  const setFilters = useFiltersStore((s) => s.setFilters);
  const tags = filters.tags;
  const defaultTags = defaultFilters.tags;

  const priceRange = {
    min: productsResponse?.minProductPrice ?? defaultFilters.price.start,
    max: productsResponse?.maxProductPrice ?? defaultFilters.price.end,
  };

  const [localPrice, setLocalPrice] = useState<[number, number]>([
    filters.price.start ?? priceRange.min,
    filters.price.end ?? priceRange.max,
  ]);

  useEffect(() => {
    setLocalPrice([filters.price.start ?? priceRange.min, filters.price.end ?? priceRange.max]);
  }, [filters.price.start, filters.price.end, priceRange.min, priceRange.max]);

  const handleSliderChange = useCallback((value: number[]) => {
    const newPrice: [number, number] = [value[0], value[1]];
    setLocalPrice(newPrice);

    setFilters(tabKey, { ...filters, price: { start: newPrice[0], end: newPrice[1] } });
  }, [setFilters, tabKey, filters]);

  const handleCheckboxListChange = useCallback(
    (key: keyof ProductsPageFilters, value: string | null) =>
      (event: SyntheticEvent, checked: boolean) => {
        if (key === "tags" && value) {
          const updated = checked ? Array.from(new Set([...tags, value])) : tags.filter((t) => t !== value);
          setFilters(tabKey, { ...filters, tags: updated });
        } else {
          setFilters(tabKey, { ...filters, [key]: checked });
        }
      },
    [tags, setFilters, tabKey, filters]
  );

  const handleApplyFilters = useCallback(() => {
    closeFilterDrawer();
  }, [closeFilterDrawer]);


  const resetFilterSection = (keys: (keyof ProductsPageFilters)[]) => () => {
    const newFilters = { ...filters };

    keys.forEach((key) => {
      if (key === "price") {
        newFilters.price = { start: priceRange.min, end: priceRange.max };
        setLocalPrice([priceRange.min, priceRange.max]);
      } else if (key === "tags") {
        newFilters.tags = [...defaultFilters.tags];
      } else {
        newFilters[key] = defaultFilters[key];
      }
    });

    setFilters(tabKey, newFilters);
  };

  const categoriesSection = categoryProbableFilters.map(({ id, translationKey }) => (
    <AppCheckbox
      key={id}
      checked={tags.includes(id)}
      onChange={handleCheckboxListChange("tags", id)}
      data-testid={`products-page-filter-${id.replace("category:", "")}-checkbox`}
      labelTranslationKey={translationKey}
      variant="dark"
    />
  ));

  const discountSection = (
    <>
      <AppCheckbox
        checked={filters.discount ?? false}
        onChange={handleCheckboxListChange("discount", null)}
        labelTranslationKey="productsFilter.discounted"
        variant="dark"
      />
      <AppCheckbox
        checked={filters.nonDiscount ?? false}
        onChange={handleCheckboxListChange("nonDiscount", null)}
        labelTranslationKey="productsFilter.nonDiscounted"
        variant="dark"
      />
    </>
  );

  const priceSection = (
    <AppRangeSlider
      value={localPrice}
      onChange={handleSliderChange}
      min={priceRange.min}
      max={priceRange.max}
    />
  );

  const availabilitySection = (
    <>
      <AppCheckbox
        checked={filters.availability ?? false}
        onChange={handleCheckboxListChange("availability", null)}
        labelTranslationKey="productsFilter.available"
        variant="dark"
      />
      <AppCheckbox
        checked={filters.nonAvailability ?? false}
        onChange={handleCheckboxListChange("nonAvailability", null)}
        labelTranslationKey="productsFilter.nonAvailable"
        variant="dark"
      />
    </>
  );

  const deliverySection = (
    <>
      <AppCheckbox
        checked={filters.deliveryUkrPost ?? false}
        onChange={handleCheckboxListChange("deliveryUkrPost", null)}
        labelTranslationKey="productsFilter.deliveryUkrPost"
        variant="dark"
        disabled
      />
      <AppCheckbox
        checked={filters.deliveryNovaPost ?? false}
        onChange={handleCheckboxListChange("deliveryNovaPost", null)}
        labelTranslationKey="productsFilter.deliveryNovaPost"
        variant="dark"
        disabled
      />
    </>
  );

  const resetFiltersIcon = activeFiltersCount > 0 && (
    <AppTooltip titleTranslationKey="productsFilter.clear" className="products-filters__clear-filters-tooltip">
      <AppBadge badgeContent={activeFiltersCount} size="small">
        <AppIconButton onClick={resetFilters}>
          <FilterListOffIcon />
        </AppIconButton>
      </AppBadge>
    </AppTooltip>
  );

  return (
    <AppBox className="products-filters">
      <AppBox className="products-filters__header">
        <AppTypography
          variant="subtitle2"
          translationKey="productsFilter.title"
          component="h2"
          fontWeight="extra-bold"
        />
        {resetFiltersIcon}
      </AppBox>
      <AppBox className="products-filters__items">
        {showCategory && (
          <FilterRecordAccordion
            isFilterActive={tags.length !== defaultTags.length || !tags.every((t) => defaultTags.includes(t))}
            resetFilter={resetFilterSection(["tags"])}
            sectionCaptionTranslationKey="productsFilter.category"
          >
            {categoriesSection}
          </FilterRecordAccordion>
        )}
        <FilterRecordAccordion
          isFilterActive={filters.discount !== defaultFilters.discount || filters.nonDiscount !== defaultFilters.nonDiscount}
          resetFilter={resetFilterSection(["discount", "nonDiscount"])}
          sectionCaptionTranslationKey="productsFilter.discount"
        >
          {discountSection}
        </FilterRecordAccordion>
        <FilterRecordAccordion
          isFilterActive={filters.price.start !== priceRange.min || filters.price.end !== priceRange.max}
          resetFilter={resetFilterSection(["price"])}
          sectionCaptionTranslationKey="productsFilter.price"
        >
          {priceSection}
        </FilterRecordAccordion>
        <FilterRecordAccordion
          isFilterActive={filters.availability !== defaultFilters.availability || filters.nonAvailability !== defaultFilters.nonAvailability}
          resetFilter={resetFilterSection(["availability", "nonAvailability"])}
          sectionCaptionTranslationKey="productsFilter.availability"
        >
          {availabilitySection}
        </FilterRecordAccordion>
        <FilterRecordAccordion
          isFilterActive={filters.deliveryUkrPost !== defaultFilters.deliveryUkrPost || filters.deliveryNovaPost !== defaultFilters.deliveryNovaPost}
          resetFilter={resetFilterSection(["deliveryUkrPost", "deliveryNovaPost"])}
          sectionCaptionTranslationKey="productsFilter.delivery"
        >
          {deliverySection}
        </FilterRecordAccordion>
      </AppBox>
      <AppBox className="products-filters__footer">
        <AppButton data-testid="products-filter-btn" onClick={resetFilters} className="products-filters__reset-button">
          <AppTypography translationKey="productsFilter.reset" />
        </AppButton>
        <AppButton data-testid="products-filter-btn" onClick={handleApplyFilters}>
          <AppTypography translationKey="productsFilter.apply" />
        </AppButton>
      </AppBox>
    </AppBox>
  );
};

export default ProductsFilterDrawer;
