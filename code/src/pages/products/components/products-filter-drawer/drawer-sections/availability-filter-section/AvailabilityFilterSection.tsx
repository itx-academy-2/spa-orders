import FilterRecordAccordion from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion";
import AppCheckbox from "@/components/app-checkbox/AppCheckbox";

import { useFiltersStore } from "@/store/zustand/filtersStore";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import { AvailabilityProps } from "@/pages/products/components/products-filter-drawer/drawer-sections/drawerSections.types";

import { ProductFilterParams } from "@/types/product.types";

export const AvailabilityFilterSection = ({ tabKey, draft }: AvailabilityProps) => {
    const setDraft = useFiltersStore(s => s.setDraft);
    const resetSection = useFiltersStore(s => s.resetSection);

    const handleCheckboxChange = (key: keyof ProductFilterParams) => (event: any, checked: boolean) => {
        setDraft(tabKey, { [key]: checked } as Partial<ProductFilterParams>);
    };

    const isFilterActive = () => draft.availability !== defaultFilters.availability ||
        draft.nonAvailability !== defaultFilters.nonAvailability;

    return (
        <FilterRecordAccordion
            isFilterActive={isFilterActive()}
            resetFilter={() => resetSection(tabKey, ["availability", "nonAvailability"])}
            sectionCaptionTranslationKey="productsFilter.availability"
        >
            <AppCheckbox
                checked={draft.availability ?? defaultFilters.availability}
                onChange={handleCheckboxChange("availability")}
                labelTranslationKey="productsFilter.available"
                variant="dark"
            />
            <AppCheckbox
                checked={draft.nonAvailability ?? defaultFilters.nonAvailability}
                onChange={handleCheckboxChange("nonAvailability")}
                labelTranslationKey="productsFilter.nonAvailable"
                variant="dark"
            />
        </FilterRecordAccordion>
    );
};

export default AvailabilityFilterSection;
