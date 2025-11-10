import { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  activeFiltersCount?: number;
  resetFilters: () => void;
  resetFilterByKey: <K extends keyof ProductsPageFilters>(key: K) => void;
};

const ProductsFilterDrawer = ({
  filters,
  defaultFilters,
  closeFilterDrawer,
  showCategory,
  tabKey,
  resetFilters
}: ProductsFilterDrawerProps) => {
  const setFilters = useFiltersStore((s) => s.setFilters);

  const tags = filters.tags;
  const defaultTags = defaultFilters.tags;

  const [localPrice, setLocalPrice] = useState<[number, number]>([filters.price.start, filters.price.end]);

  useEffect(() => {
    setLocalPrice([filters.price.start, filters.price.end]);
  }, [filters.price.start, filters.price.end]);

  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, []);

  const applyPriceToStore = useCallback(
    (start: number, end: number) => {
      setFilters(tabKey, { ...filters, price: { start, end } });
    },
    [setFilters, tabKey, filters]
  );

  const handleSliderChange = useCallback(
    (value: number[]) => {
      const [newStart, newEnd] = [value[0], value[1]];
      setLocalPrice([newStart, newEnd]);

      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(() => {
        applyPriceToStore(newStart, newEnd);
        debounceRef.current = null;
      }, 300);
    },
    [applyPriceToStore]
  );

  const handleCheckboxListChange = useCallback(
    (key: keyof ProductsPageFilters, value: any) => (event: SyntheticEvent, checked: boolean) => {
      if (key === "tags") {
        const current = tags;
        const updated = checked ? Array.from(new Set([...current, value])) : current.filter((t) => t !== value);
        setFilters(tabKey, { ...filters, tags: updated });
      } else {
        setFilters(tabKey, { ...filters, [key]: checked });
      }
    },
    [tags, setFilters, tabKey, filters]
  );

  const resetFilterSection = (keys: (keyof ProductsPageFilters)[]) => () => {
    const newFilters = { ...filters };

    keys.forEach((key) => {
      if (key === "price") {
        newFilters.price = { ...defaultFilters.price };
        setLocalPrice([defaultFilters.price.start, defaultFilters.price.end]);
      } else if (key === "tags") {
        newFilters.tags = [...defaultFilters.tags];
      } else {
        newFilters[key] = defaultFilters[key];
      }
    });

    setFilters(tabKey, newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;

    if (tags.length !== defaultTags.length || !tags.every(t => defaultTags.includes(t))) count++;
    if (localPrice[0] !== defaultFilters.price.start || localPrice[1] !== defaultFilters.price.end) count++;
    if (filters.discount !== defaultFilters.discount || filters.nonDiscount !== defaultFilters.nonDiscount) count++;
    if (filters.availability !== defaultFilters.availability || filters.nonAvailability !== defaultFilters.nonAvailability) count++;
    if (filters.deliveryUkrPost !== defaultFilters.deliveryUkrPost || filters.deliveryNovaPost !== defaultFilters.deliveryNovaPost) count++;

    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const handleApplyFilters = useCallback(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setFilters(tabKey, { ...filters, price: { start: localPrice[0], end: localPrice[1] } });
    closeFilterDrawer();
  }, [localPrice, setFilters, tabKey, filters, closeFilterDrawer]);

  const isPriceActive = localPrice[0] !== defaultFilters.price.start || localPrice[1] !== defaultFilters.price.end;
  const isCategoryActive = tags.length !== defaultTags.length || !tags.every((t) => defaultTags.includes(t));
  const isDiscountActive = filters.discount !== defaultFilters.discount || filters.nonDiscount !== defaultFilters.nonDiscount;
  const isAvailabilityActive = filters.availability !== defaultFilters.availability || filters.nonAvailability !== defaultFilters.nonAvailability;
  const isDeliveryActive = filters.deliveryNovaPost !== defaultFilters.deliveryNovaPost || filters.deliveryUkrPost !== defaultFilters.deliveryUkrPost;

  const categoriesSection = useMemo(
    () =>
      categoryProbableFilters.map(({ id, translationKey }) => (
        <AppCheckbox
          key={id}
          checked={tags.includes(id)}
          onChange={handleCheckboxListChange("tags", id)}
          data-testid={`products-page-filter-${id.replace("category:", "")}-checkbox`}
          labelTranslationKey={translationKey}
          variant="dark"
        />
      )),
    [tags, handleCheckboxListChange]
  );

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
      value={[localPrice[0], localPrice[1]]}
      onChange={handleSliderChange}
      min={defaultFilters.price.start}
      max={defaultFilters.price.end}
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

  const resetFiltersButton = (activeFiltersCount ?? 0) > 0 && (
    <AppTooltip
      titleTranslationKey="productsFilter.clear"
      className="products-filters__clear-filters-tooltip"
    >
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
        {resetFiltersButton}
      </AppBox>
      <AppBox className="products-filters__items">
        {showCategory && (
          <FilterRecordAccordion
            isFilterActive={isCategoryActive}
            resetFilter={resetFilterSection(["tags"])}
            sectionCaptionTranslationKey="productsFilter.category"
          >
            {categoriesSection}
          </FilterRecordAccordion>
        )}
        <FilterRecordAccordion
          isFilterActive={isDiscountActive}
          resetFilter={resetFilterSection(["discount", "nonDiscount"])}
          sectionCaptionTranslationKey="productsFilter.discount"
        >
          {discountSection}
        </FilterRecordAccordion>
        <FilterRecordAccordion
          isFilterActive={isPriceActive}
          resetFilter={resetFilterSection(["price"])}
          sectionCaptionTranslationKey="productsFilter.price"
        >
          {priceSection}
        </FilterRecordAccordion>
        <FilterRecordAccordion
          isFilterActive={isAvailabilityActive}
          resetFilter={resetFilterSection(["availability", "nonAvailability"])}
          sectionCaptionTranslationKey="productsFilter.availability"
        >
          {availabilitySection}
        </FilterRecordAccordion>
        <FilterRecordAccordion
          isFilterActive={isDeliveryActive}
          resetFilter={resetFilterSection(["deliveryNovaPost", "deliveryUkrPost"])}
          sectionCaptionTranslationKey="productsFilter.delivery"
        >
          {deliverySection}
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
