import FilterRecordAccordion from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion";
import AppCheckbox from "@/components/app-checkbox/AppCheckbox";

import { useFiltersStore } from "@/store/zustand/filtersStore";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import { DiscountProps } from "@/pages/products/components/products-filter-drawer/drawer-sections/drawerSections.types";

import { ProductFilterParams } from "@/types/product.types";

export const DiscountFilterSection = ({ tabKey, draft }: DiscountProps) => {
  const setDraft = useFiltersStore(s => s.setDraft);
  const resetSection = useFiltersStore(s => s.resetSection);

  const handleCheckboxChange = (key: keyof ProductFilterParams) => (event: any, checked: boolean) => {
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
      />
      <AppCheckbox
        checked={draft.nonDiscount ?? defaultFilters.nonDiscount}
        onChange={handleCheckboxChange("nonDiscount")}
        labelTranslationKey="productsFilter.nonDiscounted"
        variant="dark"
      />
    </FilterRecordAccordion>
  );
};

export default DiscountFilterSection;
