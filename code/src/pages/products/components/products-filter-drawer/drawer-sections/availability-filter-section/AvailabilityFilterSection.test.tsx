import { fireEvent, render, screen } from "@testing-library/react";
import { AvailabilityFilterSection } from "./AvailabilityFilterSection";
import { ProductFilterParams } from "@/types/product.types";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";

const mockSetDraft = jest.fn();
const mockResetSection = jest.fn();

jest.mock("@/store/zustand/filtersStore", () => ({
  useFiltersStore: (selector: (store: {
    setDraft: (tabKey: string, patch: Partial<ProductFilterParams>) => void;
    resetSection: (tabKey: string, keys: (keyof ProductFilterParams)[]) => void;
  }) => unknown) => selector({
    setDraft: mockSetDraft,
    resetSection: mockResetSection,
  }),
}));

jest.mock(
  "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion",
  () => ({
    __esModule: true,
    default: (props: {
      isFilterActive: boolean;
      resetFilter: () => void;
      sectionCaptionTranslationKey: string;
      children: React.ReactNode;
    }) => (
      <div data-testid="accordion">
        <div data-testid="is-active">{String(props.isFilterActive)}</div>
        <button data-testid="reset-btn" onClick={props.resetFilter} />
        {props.children}
      </div>
    ),
  })
);

jest.mock("@/components/app-checkbox/AppCheckbox", () => ({
  __esModule: true,
  default: (props: {
    checked: boolean;
    labelTranslationKey: string;
    onChange: (event: React.SyntheticEvent, checked: boolean) => void;
  }) => (
    <input
      type="checkbox"
      checked={props.checked}
      data-testid={`checkbox-${props.labelTranslationKey}`}
      onClick={(e) => props.onChange(e as unknown as React.SyntheticEvent, !props.checked)}
      readOnly
    />
  ),
}));

describe("AvailabilityFilterSection", () => {
  const fullDraft: ProductFilterParams = {
    availability: true,
    nonAvailability: false,
    tags: ["computers"],
    discount: true,
    nonDiscount: true,
    deliveryNovaPost: true,
    deliveryUkrPost: true,
    priceMin: 0,
    priceMax: 1000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders checkboxes with draft values", () => {
    render(<AvailabilityFilterSection tabKey="tab" draft={fullDraft} />);

    expect(
      screen.getByTestId("checkbox-productsFilter.available")
    ).toBeChecked();
    expect(
      screen.getByTestId("checkbox-productsFilter.nonAvailable")
    ).not.toBeChecked();
  });

  test("calls setDraft on checkbox change", () => {
    const draft = { ...fullDraft, availability: false };

    render(<AvailabilityFilterSection tabKey="tab" draft={draft} />);

    fireEvent.click(screen.getByTestId("checkbox-productsFilter.available"));

    expect(mockSetDraft).toHaveBeenCalledWith("tab", { availability: true });
  });

  test("reset button triggers resetSection", () => {
    render(<AvailabilityFilterSection tabKey="tab" draft={fullDraft} />);

    fireEvent.click(screen.getByTestId("reset-btn"));

    expect(mockResetSection).toHaveBeenCalledWith("tab", [
      "availability",
      "nonAvailability",
    ]);
  });
});
