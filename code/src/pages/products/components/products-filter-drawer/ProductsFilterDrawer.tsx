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
import AppLoader from "@/components/app-loader/AppLoader";

import { useFiltersStore } from "@/store/zustand/filtersStore";

import { categoryProbableFilters } from "@/pages/sales/SalesPage.constants";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";

import "@/pages/products/components/products-filter-drawer/ProductsFilterDrawer.scss";

import { ProductFilterParams } from "@/types/product.types";
import useProductsFilter from "../../hooks/useProductsFilter";

type ProductsFilterDrawerProps = {
  closeFilterDrawer: () => void;
  resetFilters: () => void;
  activeFiltersCount: number;
  tabKey: string;
  productsResponse?: {
    minProductPrice: number;
    maxProductPrice: number;
    isLoading?: boolean;
  };
};

const ProductsFilterDrawer = ({
  closeFilterDrawer,
  resetFilters,
  activeFiltersCount,
  tabKey,
  productsResponse: data
}: ProductsFilterDrawerProps) => {
  const { draft, setDraft, apply, applied, resetSection, resetPriceSection } = useFiltersStore();

  const handleSliderChange = (value: number[]) => {
    setDraft({ priceMin: value[0], priceMax: value[1] });
  };

  const handleCheckboxChange =
    (key: keyof ProductFilterParams, value?: string) =>
      (event: SyntheticEvent, checked: boolean) => {
        if (key === "tags" && value) {
          const updated = checked
            ? Array.from(new Set([...(draft.tags || []), value]))
            : (draft.tags || []).filter((t) => t !== value);
          setDraft({ tags: updated });
        } else {
          setDraft({ [key]: checked });
        }
      };

  const handleApplyFilters = () => {
    apply();
    closeFilterDrawer();
  };

  const handleResetFilters = () => {
    resetFilters();
    closeFilterDrawer();
  };

  const isFilterActive = (sectionKeys: (keyof ProductFilterParams)[]) =>
    sectionKeys.some(key => draft[key] !== defaultFilters[key] && draft[key] != null);

  const isCategoriesActive =
    JSON.stringify(draft.tags ?? defaultFilters.tags) !== JSON.stringify(defaultFilters.tags);

  const isPriceFilterActive = (min?: number, max?: number) => {
    if (!data) return false;
    const priceMin = draft.priceMin ?? min;
    const priceMax = draft.priceMax ?? max;
    return priceMin !== (defaultFilters.priceMin ?? min) ||
      priceMax !== (defaultFilters.priceMax ?? max);
  };

  const renderSections = () => {
    if (!data || data.isLoading || data.minProductPrice === undefined || data.maxProductPrice === undefined) {
      return <AppLoader variant="disabled" size="small" />;
    }

    const min = data.minProductPrice;
    const max = data.maxProductPrice;

    return (
      <>
        {/* Секція категорій */}
        {tabKey === "all" && (
          <FilterRecordAccordion
            isFilterActive={isCategoriesActive}
            resetFilter={() => resetSection(["tags"])}
            sectionCaptionTranslationKey="productsFilter.category"
          >
            {categoryProbableFilters.map(({ id, translationKey }) => (
              <AppCheckbox
                key={id}
                checked={draft.tags?.includes(id) ?? defaultFilters.tags?.includes(id)}
                onChange={handleCheckboxChange("tags", id)}
                labelTranslationKey={translationKey}
                variant="dark"
              />
            ))}
          </FilterRecordAccordion>
        )}

        {/* Секція знижок */}
        <FilterRecordAccordion
          isFilterActive={isFilterActive(["discount", "nonDiscount"])}
          resetFilter={() => resetSection(["discount", "nonDiscount"])}
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

        {/* Секція ціни */}
        <FilterRecordAccordion
          isFilterActive={isPriceFilterActive(min, max)}
          resetFilter={() => resetPriceSection(min, max)}
          sectionCaptionTranslationKey="productsFilter.price"
        >
          <AppRangeSlider
            // value={[
            //   draft.priceMin ?? initialDraft.priceMin ?? min ?? 0,
            //   draft.priceMax ?? initialDraft.priceMax ?? max ?? 0,
            // ]}
            value={[
              draft.priceMin ?? defaultFilters.priceMin ?? min ?? 0,
              draft.priceMax ?? defaultFilters.priceMax ?? max ?? 0,
            ]}
            onChange={handleSliderChange}
            min={min}
            max={max}
            data-testid="products-price-slider"
          />
        </FilterRecordAccordion>

        {/* Секція доступності */}
        <FilterRecordAccordion
          isFilterActive={isFilterActive(["availability", "nonAvailability"])}
          resetFilter={() => resetSection(["availability", "nonAvailability"])}
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
      </>
    );
  };

  const resetFiltersIcon =
    activeFiltersCount > 0 && (
      <AppTooltip titleTranslationKey="productsFilter.clear" className="products-filters__clear-filters-tooltip">
        <AppBadge badgeContent={activeFiltersCount} size="small">
          <AppIconButton onClick={handleResetFilters} data-testid="products-filters-clear-filters-btn">
            <FilterListOffIcon />
          </AppIconButton>
        </AppBadge>
      </AppTooltip>
    );

  return (
    <AppBox className="products-filters">
      <AppBox className="products-filters__header">
        <AppTypography variant="subtitle2" translationKey="productsFilter.title" component="h2" fontWeight="extra-bold" />
        {resetFiltersIcon}
      </AppBox>
      <AppBox className="products-filters__items">{renderSections()}</AppBox>
      <AppBox className="products-filters__footer">
        <AppButton data-testid="products-filter-reset-btn" onClick={handleResetFilters} className="products-filters__reset-button">
          <AppTypography translationKey="productsFilter.reset" />
        </AppButton>
        <AppButton data-testid="products-filter-apply-btn" onClick={handleApplyFilters}>
          <AppTypography translationKey="productsFilter.apply" />
        </AppButton>
      </AppBox>
    </AppBox>
  );
};

export default ProductsFilterDrawer;
