import { renderHook } from "@testing-library/react";

import useSalesFilter from "./useSalesFilter";

const mockSales = [
  { id: 1, name: "Sale Product 1", price: 50 },
  { id: 2, name: "Sale Product 2", price: 100 },
  { id: 3, name: "Sale Product 3", price: 150 }
];

const mockData = {
  pageProducts: { content: mockSales, totalElements: 3, totalPages: 1 }
};

const mockResponse = {
  isLoading: false,
  isError: false,
  isSuccess: true,
  error: null,
  data: mockData
};

jest.mock("@/hooks/use-filters-with-apply/useFiltersWithApply", () => ({
  default: jest.fn(() => {
    const defaultSalesPageFilters = {
      tags: new Set([
        "category:computer",
        "category:mobile",
        "category:tablet"
      ]),
      discountPercentage: { start: 0, end: 100 },
      priceWithDiscount: { start: 0, end: 100 }
    };

    return {
      filters: defaultSalesPageFilters,
      appliedFilters: defaultSalesPageFilters,
      activeFiltersCount: 1,
      actions: { setDefaultFilters: () => {} },
      defaultFilters: defaultSalesPageFilters
    };
  }),
  __esModule: true
}));

jest.mock("@/store/api/productsApi", () => ({
  useGetSalesProductsQuery: jest.fn(() => mockResponse)
}));

jest.mock("@/hooks/use-pagination/usePagination", () => ({
  default: jest.fn(() => ({ page: 2 })),
  __esModule: true
}));

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: jest.fn(() => ({ locale: "en" }))
}));

describe("Test useSalesFiltersHook", () => {
  test("Should return sales response data", () => {
    const { result } = renderHook(() => useSalesFilter());

    expect(result.current.products).toEqual(mockSales);
  });
});
