import { fireEvent, screen } from "@testing-library/react";

import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";
import typeIntoInput from "@/utils/type-into-input/typeIntoInput";

import { SalesPageFilters } from "../../SalesPage.types";
import SalesFilterDrawer from "./SalesFilterDrawer";

const mockApplyFilters = jest.fn();
const mockCheckFilterActive = jest.fn(() => true);
const mockResetFilterByKey = jest.fn();
const mockUpdateFilterByKey = jest.fn();
const mockResetFilters = jest.fn();
const mockCloseFilterDrawer = jest.fn();

const defaultFilters: SalesPageFilters = {
  tags: new Set(["category:computer", "category:mobile", "category:tablet"]),
  discountPercentage: { start: 50, end: 150 },
  priceWithDiscount: { start: 10, end: 110 }
};

const expectedTags = new Set(["category:mobile", "category:tablet"]);

type RenderAndMock = {
  activeFiltersCount?: number;
  filters?: Partial<SalesPageFilters>;
};

const renderAndMock = ({
  activeFiltersCount = 0,
  filters: filtersFromArgs = {}
}: RenderAndMock = {}) => {
  const filters = { ...defaultFilters, ...filtersFromArgs };

  return renderWithProviders(
    <SalesFilterDrawer
      activeFiltersCount={activeFiltersCount}
      filters={filters}
      filterActions={{
        applyFilters: mockApplyFilters,
        checkFilterActive: mockCheckFilterActive,
        resetFilterByKey: mockResetFilterByKey,
        updateFilterByKey: mockUpdateFilterByKey,
        resetFilters: mockResetFilters
      }}
      closeFilterDrawer={mockCloseFilterDrawer}
      defaultFilters={defaultFilters}
    />
  );
};

describe("Test SalesFilterDrawer component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should render title", () => {
    renderAndMock();

    const titleEl = screen.getByTestId("sales-filter-title");
    expect(titleEl).toBeInTheDocument();
  });

  test("Should render reset button", () => {
    renderAndMock({ activeFiltersCount: 2 });

    const resetBtnEl = screen.getByTestId("sales-filter-reset-btn");
    expect(resetBtnEl).toBeInTheDocument();
  });

  test("Should render apply button", () => {
    renderAndMock();

    const applyBtnEl = screen.getByTestId("sales-filter-apply-btn");
    expect(applyBtnEl).toBeInTheDocument();
  });

  test("Should apply filters after apply click", () => {
    renderAndMock();

    const applyFilterButton = screen.getByTestId("sales-filter-apply-btn");

    fireEvent.click(applyFilterButton);

    expect(mockApplyFilters).toHaveBeenCalledWith({
      additionalParams: { page: "1" }
    });

    expect(mockCloseFilterDrawer).toHaveBeenCalled();
  });

  test("Should have categories checked by default", () => {
    renderAndMock();

    const checkboxes = screen.getAllByRole("checkbox");

    checkboxes.forEach((el) => {
      expect(el).toBeChecked();
    });
  });

  test("Should have default values in discount range", () => {
    renderAndMock();

    const [discountRangeStartInput, priceRangeStartInput] =
      screen.getAllByTestId("range-start");
    const [discountRangeEndInput, priceRangeEndInput] =
      screen.getAllByTestId("range-end");

    expect(discountRangeStartInput).toHaveValue(50);
    expect(discountRangeEndInput).toHaveValue(150);

    expect(priceRangeStartInput).toHaveValue(10);
    expect(priceRangeEndInput).toHaveValue(110);
  });

  test("Should correctly update discount percentage", async () => {
    renderAndMock();

    const start = 10;
    const [discountRangeStartInput] = screen.getAllByTestId("range-start");

    await typeIntoInput(discountRangeStartInput, start);

    expect(mockUpdateFilterByKey).toHaveBeenCalledWith("discountPercentage", {
      start: start.toString(),
      end: defaultFilters.discountPercentage.end.toString()
    });
  });

  test("Should correctly update price", async () => {
    renderAndMock();

    const start = 20;
    const [, priceRangeStartInput] = screen.getAllByTestId("range-start");

    await typeIntoInput(priceRangeStartInput, start);

    expect(mockUpdateFilterByKey).toHaveBeenCalledWith("priceWithDiscount", {
      start: start.toString(),
      end: defaultFilters.priceWithDiscount.end.toString()
    });
  });

  test("Should correctly update category", () => {
    renderAndMock();

    const computersCheckbox = screen.getByTestId(
      "sales-page-filter-computer-checkbox"
    );

    const mobilesCheckbox = screen.getByTestId(
      "sales-page-filter-mobile-checkbox"
    );

    fireEvent.click(computersCheckbox);
    fireEvent.click(mobilesCheckbox);
    fireEvent.click(mobilesCheckbox);

    expect(mockUpdateFilterByKey).toHaveBeenCalledWith("tags", expectedTags);
  });

  test("Should reset filter", () => {
    renderAndMock({ filters: { priceWithDiscount: { start: 1, end: 4 } } });

    const resetFilterIcon = screen.getAllByTestId("FilterAltOffIcon")[0];

    fireEvent.click(resetFilterIcon);
  });
});
