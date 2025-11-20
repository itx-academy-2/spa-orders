import AppRangeSlider from "@/components/app-range-slider/AppRangeSlider";

import FilterRecordAccordion from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion";

import { useFiltersStore } from "@/store/zustand/filtersStore";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import { PriceProps } from "@/pages/products/components/products-filter-drawer/drawer-sections/DrawerSections.types";

export const PriceFilterSection = ({ tabKey, min, max }: PriceProps) => {
  const draft = useFiltersStore(s => s.drafts[tabKey] ?? defaultFilters);
  const setDraft = useFiltersStore(s => s.setDraft);
  const resetPriceSection = useFiltersStore(s => s.resetPriceSection);

  const handleSliderChange = (value: number[]) => {
    setDraft(tabKey, { priceMin: value[0], priceMax: value[1] });
  };

  const isPriceFilterActive = () => {
    const priceMin = draft.priceMin ?? min;
    const priceMax = draft.priceMax ?? max;
    return priceMin !== (defaultFilters.priceMin ?? min) ||
      priceMax !== (defaultFilters.priceMax ?? max);
  };

  return (
    <FilterRecordAccordion
      isFilterActive={isPriceFilterActive()}
      resetFilter={() => resetPriceSection(tabKey, min, max)}
      sectionCaptionTranslationKey="productsFilter.price"
    >
      <AppRangeSlider
        value={[
          draft.priceMin ?? defaultFilters.priceMin ?? min,
          draft.priceMax ?? defaultFilters.priceMax ?? max,
        ]}
        onChange={handleSliderChange}
        min={min}
        max={max}
      />
    </FilterRecordAccordion>
  );
};

export default PriceFilterSection;