import { SyntheticEvent } from "react";

import FilterRecordAccordion from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion";
import AppCheckbox from "@/components/app-checkbox/AppCheckbox";

import { useFiltersStore } from "@/store/zustand/filtersStore";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import { DiscountProps } from "@/pages/products/components/products-filter-drawer/drawer-sections/DrawerSections.types";

import { ProductFilterParams } from "@/types/product.types";

export const DiscountFilterSection = ({ tabKey, draft }: DiscountProps) => {
  const setDraft = useFiltersStore(s => s.setDraft);
  const resetSection = useFiltersStore(s => s.resetSection);

  const handleCheckboxChange = (key: keyof ProductFilterParams) => (event: SyntheticEvent, checked: boolean) => {
    setDraft(tabKey, { [key]: checked } as Partial<ProductFilterParams>);
  };

  const isFilterActive = () => draft.discount !== defaultFilters.discount ||
    draft.nonDiscount !== defaultFilters.nonDiscount;

  return (
    <FilterRecordAccordion
      isFilterActive={isFilterActive()}
      resetFilter={() => resetSection(tabKey, ["discount", "nonDiscount"])}
      sectionCaptionTranslationKey="productsFilter.discount"
    >
      <AppCheckbox
        checked={draft.discount ?? defaultFilters.discount}
        onChange={handleCheckboxChange("discount")}
        labelTranslationKey="productsFilter.discounted"
        variant="dark"
        data-cy="discount-filter-checkbox"
      />
      <AppCheckbox
        checked={draft.nonDiscount ?? defaultFilters.nonDiscount}
        onChange={handleCheckboxChange("nonDiscount")}
        labelTranslationKey="productsFilter.nonDiscounted"
        variant="dark"
        data-cy="non-discount-filter-checkbox"
      />
    </FilterRecordAccordion>
  );
};

export default DiscountFilterSection;
