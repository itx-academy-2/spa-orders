import FilterRecordAccordion from "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion";
import AppCheckbox from "@/components/app-checkbox/AppCheckbox";

import { useFiltersStore } from "@/store/zustand/filtersStore";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import { DeliveryProps } from "@/pages/products/components/products-filter-drawer/drawer-sections/DrawerSections.types";


const DeliverySection = ({ tabKey, draft }: DeliveryProps) => {
    const resetSection = useFiltersStore(s => s.resetSection);

    const isFilterActive = () => draft.deliveryUkrPost !== defaultFilters.deliveryUkrPost ||
        draft.deliveryNovaPost !== defaultFilters.deliveryNovaPost;

    return (
        <FilterRecordAccordion
            isFilterActive={isFilterActive()}
            resetFilter={() => resetSection(tabKey, ["deliveryUkrPost", "deliveryNovaPost"])}
            sectionCaptionTranslationKey="productsFilter.delivery"
        >
            <AppCheckbox
                checked={draft.deliveryUkrPost ?? defaultFilters.deliveryUkrPost}
                labelTranslationKey="productsFilter.deliveryUkrPost"
                variant="dark"
                disabled
            />
            <AppCheckbox
                checked={draft.deliveryNovaPost ?? defaultFilters.deliveryNovaPost}
                labelTranslationKey="productsFilter.deliveryNovaPost"
                variant="dark"
                disabled
            />
        </FilterRecordAccordion>
    )
};

export default DeliverySection;