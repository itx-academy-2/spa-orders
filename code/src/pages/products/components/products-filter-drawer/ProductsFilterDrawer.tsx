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
  activeFiltersCount: activeCountFromHook,
  resetFilters,
  resetFilterByKey
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
    (value: string) => (event: SyntheticEvent, checked: boolean) => {
      const current = tags;
      const updated = checked ? Array.from(new Set([...current, value])) : current.filter((t) => t !== value);
      setFilters(tabKey, { ...filters, tags: updated });
    },
    [tags, setFilters, tabKey, filters]
  );

  const resetFilter = (key: keyof ProductsPageFilters) => () =>
    resetFilterByKey(key);

  const handleApplyFilters = useCallback(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setFilters(tabKey, { ...filters, price: { start: localPrice[0], end: localPrice[1] } });
    closeFilterDrawer();
  }, [localPrice, setFilters, tabKey, filters, closeFilterDrawer]);

  const categoriesCheckboxes = useMemo(
    () =>
      categoryProbableFilters.map(({ id, translationKey }) => (
        <AppCheckbox
          key={id}
          checked={tags.includes(id)}
          onChange={handleCheckboxListChange(id)}
          data-testid={`products-page-filter-${id.replace("category:", "")}-checkbox`}
          labelTranslationKey={translationKey}
          variant="dark"
        />
      )),
    [tags, handleCheckboxListChange]
  );

  const isPriceActive = localPrice[0] !== defaultFilters.price.start || localPrice[1] !== defaultFilters.price.end;
  const isCategoryActive = tags.length !== defaultTags.length || !tags.every((t) => defaultTags.includes(t));

  const resetFiltersButton = (activeCountFromHook ?? 0) > 0 && (
    <AppTooltip
      titleTranslationKey="productsFilter.clear"
      className="products-filters__clear-filters-tooltip"
    >
      <AppBadge badgeContent={activeCountFromHook} size="small">
        <AppIconButton onClick={resetFilters}>
          <FilterListOffIcon />
        </AppIconButton>
      </AppBadge>
    </AppTooltip>
  );

  return (
    <AppBox className="products-filters">
      <AppBox className="products-filters__header">
        <AppTypography variant="subtitle2" translationKey="productsFilter.title" component="h2" fontWeight="extra-bold" />
        {resetFiltersButton}
      </AppBox>
      <AppBox className="products-filters__items">
        {showCategory && (
          <FilterRecordAccordion
            isFilterActive={isCategoryActive}
            resetFilter={resetFilter("tags")}
            sectionCaptionTranslationKey="productsFilter.category"
          >
            {categoriesCheckboxes}
          </FilterRecordAccordion>
        )}
        <FilterRecordAccordion
          isFilterActive={isPriceActive}
          resetFilter={resetFilter("price")}
          sectionCaptionTranslationKey="productsFilter.price"
        >
          <AppRangeSlider
            value={[localPrice[0], localPrice[1]]}
            onChange={handleSliderChange}
            min={defaultFilters.price.start}
            max={defaultFilters.price.end}
          />
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
