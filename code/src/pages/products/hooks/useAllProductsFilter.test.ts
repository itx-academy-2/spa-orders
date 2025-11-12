import { renderHook, act } from "@testing-library/react";

import { useLocaleContext } from "@/context/i18n/I18nProvider";

import { useGetUserProductsQuery } from "@/store/api/productsApi";
import { useFiltersStore } from "@/store/zustand/filtersStore";

import usePagination from "@/hooks/use-pagination/usePagination";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";

import { defaultAllProductsFilters } from "@/pages/products/ProductsPage.constants";

import useAllProductsFilter from "@/pages/products/hooks/useAllProductsFilter";

jest.mock("@/context/i18n/I18nProvider");
jest.mock("@/store/api/productsApi");
jest.mock("@/store/zustand/filtersStore");
jest.mock("@/hooks/use-pagination/usePagination");
jest.mock("@/utils/check-screen-size/useScreenSize");
jest.mock("@/utils/set-product-size/setProductsPerPageSize");

describe("useAllProductsFilter hook", () => {
    const mockSetFilters = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useLocaleContext as jest.Mock).mockReturnValue({ locale: "en" });

        (usePagination as jest.Mock).mockReturnValue({ page: 2 });

        (useFiltersStore as unknown as jest.Mock).mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (selector: any) => {
            const storeState = {
                setFilters: mockSetFilters,
                filtersByTab: {},
            };
            return selector(storeState);
        });

        (useScreenSize as jest.Mock).mockReturnValue({ width: 1024 });

        (setProductsPerPageSize as jest.Mock).mockReturnValue(10);

        (useGetUserProductsQuery as jest.Mock).mockReturnValue({
            data: {
                content: [{ id: "1", name: "Product 1", price: 100 }],
                totalPages: 5,
                totalElements: 50,
                minProductPrice: 50,
                maxProductPrice: 500,
            },
            isLoading: false,
            isError: false,
        });
    });

    test("returns default filters and products correctly", () => {
        const { result } = renderHook(() => useAllProductsFilter());

        expect(result.current.filters).toEqual(defaultAllProductsFilters);
        expect(result.current.products).toHaveLength(1);
        expect(result.current.totalPages).toBe(5);
        expect(result.current.totalElements).toBe(50);
        expect(result.current.isCategoryFilterVisible).toBe(true);
    });

    test("calculates activeFiltersCount correctly", () => {
        const { result } = renderHook(() => useAllProductsFilter());

        expect(result.current.activeFiltersCount).toBe(1);
    });

    test("resetFilters calls setFilters with correct values", () => {
        const { result } = renderHook(() =>
            useAllProductsFilter({ category: "computer" })
        );

        act(() => {
            result.current.resetFilters();
        });

        expect(mockSetFilters).toHaveBeenCalledWith("computer", {
            ...defaultAllProductsFilters,
            price: { start: 50, end: 500 },
            tags: ["category:computer"],
        });
    });

    test("applies category tag if extraParams.category is provided", () => {
        const { result } = renderHook(() =>
            useAllProductsFilter({ category: "electronics" })
        );

        expect(result.current.filters.tags).toEqual(["category:electronics"]);
    });

    test("passes correct queryParams to useGetUserProductsQuery", () => {
        renderHook(() => useAllProductsFilter());

        expect(useGetUserProductsQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                lang: "en",
                page: 1,
                size: 10,
            })
        );
    });
});
