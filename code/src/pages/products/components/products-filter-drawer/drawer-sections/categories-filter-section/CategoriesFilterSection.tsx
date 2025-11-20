import { SyntheticEvent } from "react";

import AppCheckbox from "@/components/app-checkbox/AppCheckbox";
import FilterRecordAccordion from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion";

import { categoryProbableFilters } from "@/pages/sales/SalesPage.constants";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import { CategoriesProps } from "@/pages/products/components/products-filter-drawer/drawer-sections/DrawerSections.types";

import { useFiltersStore } from "@/store/zustand/filtersStore";

export const CategoriesFilterSection = ({ tabKey, draftTags }: CategoriesProps) => {
  const draft = useFiltersStore(s => s.drafts[tabKey] ?? defaultFilters);
  const setDraft = useFiltersStore(s => s.setDraft);
  const resetSection = useFiltersStore(s => s.resetSection);

  const handleCheckboxChange = (value: string) => (event: SyntheticEvent, checked: boolean) => {
    const updated = checked
      ? Array.from(new Set([...(draft.tags ?? []), value]))
      : (draft.tags ?? []).filter(t => t !== value);
    setDraft(tabKey, { tags: updated });
  };

  const isCategoriesActive =
    JSON.stringify(draft.tags ?? defaultFilters.tags) !== JSON.stringify(defaultFilters.tags);

  return (
    <FilterRecordAccordion
      isFilterActive={isCategoriesActive}
      resetFilter={() => resetSection(tabKey, ["tags"])}
      sectionCaptionTranslationKey="productsFilter.category"
    >
      {categoryProbableFilters.map(({ id, translationKey }) => (
        <AppCheckbox
          key={id}
          checked={draft.tags?.includes(id) ?? defaultFilters.tags?.includes(id)}
          onChange={handleCheckboxChange(id)}
          labelTranslationKey={translationKey}
          variant="dark"
        />
      ))}
    </FilterRecordAccordion>
  );
};

export default CategoriesFilterSection;