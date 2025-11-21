import { fireEvent, render, screen } from "@testing-library/react";
import React, { SyntheticEvent } from "react";
import { AvailabilityFilterSection } from "./AvailabilityFilterSection";
import { ProductFilterParams } from "@/types/product.types";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";

const mockSetDraft = jest.fn();
const mockResetSection = jest.fn();

type FiltersStoreMock = {
  setDraft: (tabKey: string, patch: Partial<ProductFilterParams>) => void;
  resetSection: (tabKey: string, keys: (keyof ProductFilterParams)[]) => void;
};

jest.mock("@/store/zustand/filtersStore", () => ({
  useFiltersStore: (selector: (store: FiltersStoreMock) => unknown) =>
    selector({
      setDraft: mockSetDraft,
      resetSection: mockResetSection,
    }),
}));

type AccordionProps = {
  isFilterActive: boolean;
  resetFilter: () => void;
  sectionCaptionTranslationKey: string;
  children: React.ReactNode;
};

jest.mock(
  "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion",
  () => (props: AccordionProps) => (
    <div data-testid="accordion">
      <div data-testid="is-active">{String(props.isFilterActive)}</div>
      <button data-testid="reset-btn" onClick={props.resetFilter} />
      {props.children}
    </div>
  )
);

type CheckboxProps = {
  checked: boolean;
  onChange: (e: SyntheticEvent, checked: boolean) => void;
  labelTranslationKey: string;
  variant: string;
  disabled?: boolean;
};

jest.mock("@/components/app-checkbox/AppCheckbox", () => (props: CheckboxProps) => (
  <input
    type="checkbox"
    checked={props.checked}
    data-testid={`checkbox-${props.labelTranslationKey}`}
    onClick={(e) => props.onChange(e, !props.checked)}
    readOnly
  />
));

describe("AvailabilityFilterSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fullDraft: ProductFilterParams = {
    availability: true,
    nonAvailability: false,
    tags: ["computers"],
    discount: true,
    nonDiscount: true,
    deliveryNovaPost: true,
    deliveryUkrPost: false,
    priceMin: undefined,
    priceMax: undefined,
  };

  test("renders checkboxes with draft values", () => {
    render(<AvailabilityFilterSection tabKey="tab" draft={fullDraft} />);
    expect(screen.getByTestId("checkbox-productsFilter.available")).toBeChecked();
    expect(screen.getByTestId("checkbox-productsFilter.nonAvailable")).not.toBeChecked();
  });

  test("calls setDraft on checkbox change", () => {
    render(<AvailabilityFilterSection tabKey="tab" draft={fullDraft} />);
    fireEvent.click(screen.getByTestId("checkbox-productsFilter.available"));
    expect(mockSetDraft).toHaveBeenCalledWith("tab", { availability: false });
  });

  test("reset button triggers resetSection", () => {
    render(<AvailabilityFilterSection tabKey="tab" draft={fullDraft} />);
    fireEvent.click(screen.getByTestId("reset-btn"));
    expect(mockResetSection).toHaveBeenCalledWith("tab", ["availability", "nonAvailability"]);
  });
});
