import { render, screen, fireEvent } from "@testing-library/react";

import { useFiltersStore } from "@/store/zustand/filtersStore";

import { categoryProbableFilters } from "@/pages/sales/SalesPage.constants";
import { defaultAllProductsFilters } from "@/pages/products/ProductsPage.constants";

import ProductsFilterDrawer from "@/pages/products/components/products-filter-drawer/ProductsFilterDrawer";

jest.mock("@/store/zustand/filtersStore");

describe("ProductsFilterDrawer component", () => {
    const mockSetFilters = jest.fn();
    const mockCloseDrawer = jest.fn();
    const mockResetFilters = jest.fn();

    const filters = {
        ...defaultAllProductsFilters,
        price: { start: 50, end: 500 },
        tags: ["category:computer"],
        discount: true,
        nonDiscount: false,
        availability: true,
        nonAvailability: false,
        deliveryUkrPost: true,
        deliveryNovaPost: true,
    };

    const defaultFilters = {
        ...defaultAllProductsFilters,
        price: { start: 0, end: 1000 },
        tags: ["category:computer"],
        discount: false,
        nonDiscount: false,
        availability: false,
        nonAvailability: false,
        deliveryUkrPost: false,
        deliveryNovaPost: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useFiltersStore as unknown as jest.Mock).mockImplementation((selector: (state: { setFilters: typeof mockSetFilters }) => any) => {
            const storeState = { setFilters: mockSetFilters };
            return selector(storeState);
        });
    });

    test("renders correctly with category section when showCategory=true", () => {
        render(
            <ProductsFilterDrawer
                filters={filters}
                defaultFilters={defaultFilters}
                closeFilterDrawer={mockCloseDrawer}
                showCategory
                tabKey="computer"
                resetFilters={mockResetFilters}
                activeFiltersCount={1}
                productsResponse={{ minProductPrice: 50, maxProductPrice: 500 }}
            />
        );

        categoryProbableFilters.forEach(({ id }) => {
            const checkbox = screen.getByTestId(`products-page-filter-${id.replace("category:", "")}-checkbox`);
            expect(checkbox).toBeInTheDocument();
        });

        expect(screen.getByTestId("products-price-slider")).toBeInTheDocument();

        const buttons = screen.getAllByTestId("products-filter-btn");
        expect(buttons).toHaveLength(2);
    });

    test("calls setFilters when a checkbox changes", () => {
        render(
            <ProductsFilterDrawer
                filters={filters}
                defaultFilters={defaultFilters}
                closeFilterDrawer={mockCloseDrawer}
                showCategory
                tabKey="computer"
                resetFilters={mockResetFilters}
                activeFiltersCount={1}
            />
        );

        const firstCheckboxId = categoryProbableFilters[0].id.replace("category:", "");
        fireEvent.click(screen.getByTestId(`products-page-filter-${firstCheckboxId}-checkbox`));

        expect(mockSetFilters).toHaveBeenCalledWith("computer", expect.any(Object));
    });

    test("calls resetFilters when reset icon is clicked", () => {
        render(
            <ProductsFilterDrawer
                filters={filters}
                defaultFilters={defaultFilters}
                closeFilterDrawer={mockCloseDrawer}
                showCategory
                tabKey="computer"
                resetFilters={mockResetFilters}
                activeFiltersCount={1}
            />
        );

        fireEvent.click(screen.getByTestId("products-filters-clear-filters-btn"));

        expect(mockResetFilters).toHaveBeenCalled();
    });

    test("calls closeFilterDrawer when Apply button is clicked", () => {
        render(
            <ProductsFilterDrawer
                filters={filters}
                defaultFilters={defaultFilters}
                closeFilterDrawer={mockCloseDrawer}
                showCategory
                tabKey="computer"
                resetFilters={mockResetFilters}
                activeFiltersCount={1}
            />
        );

        fireEvent.click(screen.getAllByTestId("products-filter-btn")[1]);

        expect(mockCloseDrawer).toHaveBeenCalled();
    });
});
