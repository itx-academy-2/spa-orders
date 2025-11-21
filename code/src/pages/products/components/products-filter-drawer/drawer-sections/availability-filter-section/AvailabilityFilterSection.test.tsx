import { fireEvent, render, screen } from "@testing-library/react";

import { AvailabilityFilterSection } from "@/pages/products/components/products-filter-drawer/drawer-sections/availability-filter-section/AvailabilityFilterSection";
import { defaultFilters } from "@/pages/products/ProductsPage.constants";

const mockSetDraft = jest.fn();
const mockResetSection = jest.fn();

jest.mock("@/store/zustand/filtersStore", () => ({
  useFiltersStore: jest.fn((selector) =>
    selector({
      setDraft: mockSetDraft,
      resetSection: mockResetSection,
    })
  ),
}));

jest.mock(
  "@/containers/dashboard-orders-filter-drawer/components/filter-record-accordion/FilterRecordAccordion",
  () => {
    const Mock = (props: any) => (
      <div data-testid="accordion">
        <div data-testid="is-active">{String(props.isFilterActive)}</div>
        <button data-testid="reset-btn" onClick={props.resetFilter} />
        {props.children}
      </div>
    );
    Mock.displayName = "MockFilterRecordAccordion";
    return Mock;
  }
);

jest.mock("@/components/app-checkbox/AppCheckbox", () => {
  const Mock = (props: any) => (
    <input
      data-testid={`checkbox-${props.labelTranslationKey}`}
      type="checkbox"
      checked={props.checked}
      readOnly
      onClick={() => props.onChange({}, !props.checked)}
    />
  );
  Mock.displayName = "MockAppCheckbox";
  return Mock;
});

describe("AvailabilityFilterSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders checkboxes with draft values", () => {
    const draft = { availability: true, nonAvailability: false } as any;

    render(<AvailabilityFilterSection tabKey="tab" draft={draft} />);

    expect(
      screen.getByTestId("checkbox-productsFilter.available")
    ).toBeChecked();
    expect(
      screen.getByTestId("checkbox-productsFilter.nonAvailable")
    ).not.toBeChecked();
  });

  test("calls setDraft on checkbox change", () => {
    const draft = { availability: false } as any;

    render(<AvailabilityFilterSection tabKey="tab" draft={draft} />);

    fireEvent.click(
      screen.getByTestId("checkbox-productsFilter.available")
    );

    expect(mockSetDraft).toHaveBeenCalledWith("tab", { availability: true });
  });

  test("computes isFilterActive correctly", () => {
    render(
      <AvailabilityFilterSection
        tabKey="tab"
        draft={{ ...defaultFilters } as any}
      />
    );
    expect(screen.getByTestId("is-active")).toHaveTextContent("false");

    render(
      <AvailabilityFilterSection
        tabKey="tab"
        draft={{ availability: !defaultFilters.availability } as any}
      />
    );
    const list = screen.getAllByTestId("is-active");
    expect(list[list.length - 1]).toHaveTextContent("true");
  });

  test("reset button triggers resetSection", () => {
    render(<AvailabilityFilterSection tabKey="tab" draft={{} as any} />);

    const list = screen.getAllByTestId("reset-btn");
    fireEvent.click(list[list.length - 1]);

    expect(mockResetSection).toHaveBeenCalledWith("tab", [
      "availability",
      "nonAvailability",
    ]);
  });
});
