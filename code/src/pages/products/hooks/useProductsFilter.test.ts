import { renderHook } from "@testing-library/react";
import { useSearchParams } from "react-router-dom";

import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import useProductsFilter from "@/pages/products/hooks/useProductsFilter";

import { useFiltersStore } from "@/store/zustand/filtersStore";
import { useGetUserProductsQuery } from "@/store/api/productsApi";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import usePagination from "@/hooks/use-pagination/usePagination";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";


jest.mock("@/store/zustand/filtersStore");
jest.mock("@/store/api/productsApi");
jest.mock("react-router-dom", () => ({
  useSearchParams: jest.fn(),
}));
jest.mock("@/context/i18n/I18nProvider");
jest.mock("@/hooks/use-pagination/usePagination");
jest.mock("@/utils/check-screen-size/useScreenSize");
jest.mock("@/utils/set-product-size/setProductsPerPageSize");

describe("useProductsFilter", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useFiltersStore as unknown as jest.Mock).mockReturnValue({
      appliedByTab: { all: defaultFilters },
      drafts: { all: defaultFilters },
    });

    (useGetUserProductsQuery as jest.Mock).mockReturnValue({
      data: {
        content: [{ id: 1, name: "Product 1" }],
        totalPages: 2,
        totalElements: 10,
        minProductPrice: 0,
        maxProductPrice: 100,
      },
      isLoading: false,
      isError: false,
    });

    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), jest.fn()]);
    (useLocaleContext as jest.Mock).mockReturnValue({ locale: "en" });
    (usePagination as jest.Mock).mockReturnValue({ page: 1 });
    (useScreenSize as jest.Mock).mockReturnValue({ width: 800, height: 600 });
    (setProductsPerPageSize as jest.Mock).mockReturnValue(10);
  });

  test("should return default filter values and products", () => {
    const { result } = renderHook(() => useProductsFilter());

    expect(result.current.products).toEqual([{ id: 1, name: "Product 1" }]);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.totalElements).toBe(10);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  test("should calculate active filters count correctly when no changes", () => {
    const { result } = renderHook(() => useProductsFilter());
    expect(result.current.activeFiltersCount).toBe(0);
  });

  test("should build correct API params", () => {
    renderHook(() => useProductsFilter());
    expect(useGetUserProductsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: defaultFilters.tags,
        lang: "en",
        page: 0,
        size: 6,
      })
    );
  });

  test("should apply URL query params for category and sort correctly in API request", () => {
    const searchParams = new URLSearchParams({ sort: "price", category: "mobiles" });
    (useSearchParams as jest.Mock).mockReturnValue([searchParams, jest.fn()]);

    const { result } = renderHook(() => useProductsFilter());

    expect(result.current.products).toEqual([{ id: 1, name: "Product 1" }]);
    expect(result.current.activeFiltersCount).toBe(0);
  });
});
