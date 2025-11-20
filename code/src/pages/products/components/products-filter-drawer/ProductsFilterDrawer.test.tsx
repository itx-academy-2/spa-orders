import { render, screen, fireEvent } from "@testing-library/react";

import { defaultFilters } from "@/pages/products/ProductsPage.constants";
import ProductsFilterDrawer from "@/pages/products/components/products-filter-drawer/ProductsFilterDrawer";
import { useFiltersStore } from "@/store/zustand/filtersStore";

jest.mock("@/store/zustand/filtersStore");
jest.mock("@/components/app-loader/AppLoader", () => jest.fn(() => <div data-testid="loader" />));
jest.mock("@/pages/products/components/products-filter-drawer/drawer-sections/discount-filter-section/DiscountFilterSection", () =>
    jest.fn(() => <div data-testid="discount-section" />)
);
jest.mock("@/pages/products/components/products-filter-drawer/drawer-sections/availability-filter-section/AvailabilityFilterSection", () =>
    jest.fn(() => <div data-testid="availability-section" />)
);
jest.mock("@/pages/products/components/products-filter-drawer/drawer-sections/price-filters-section/PriceFilterSection", () =>
    jest.fn(({ min, max }) => <div data-testid="price-section">{min}-{max}</div>)
);
jest.mock("@/pages/products/components/products-filter-drawer/drawer-sections/categories-filter-section/CategoriesFilterSection", () =>
    jest.fn(() => <div data-testid="categories-section" />)
);
jest.mock("@/pages/products/components/products-filter-drawer/drawer-sections/delivery-filter-section/DeliveryFilterSection", () =>
    jest.fn(() => <div data-testid="delivery-section" />)
);
jest.mock("@/pages/products/components/products-filter-buttons/reset-filters-icon/resetFiltersIcon", () =>
    jest.fn(({ onClick }) => <button data-testid="reset-icon" onClick={onClick} />)
);
jest.mock("@/pages/products/components/products-filter-buttons/reset-filters-button/ResetFiltersButton", () =>
    jest.fn(({ onClick }) => <button data-testid="reset-button" onClick={onClick} />)
);
jest.mock("@/pages/products/components/products-filter-buttons/apply-filters-button/ApplyFiltersButton", () =>
    jest.fn(({ onClick }) => <button data-testid="apply-button" onClick={onClick} />)
);

describe("ProductsFilterDrawer", () => {
    const closeFilterDrawer = jest.fn();
    const applyMock = jest.fn();
    const resetMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useFiltersStore as unknown as jest.Mock).mockImplementation(selector => {
            const store = {
                apply: applyMock,
                reset: resetMock,
                drafts: { all: defaultFilters },
            };
            return selector(store);
        });
    });

    test("renders loader when data is loading or incomplete", () => {
        render(
            <ProductsFilterDrawer
                closeFilterDrawer={closeFilterDrawer}
                activeFiltersCount={0}
                tabKey="all"
                productsResponse={{ minProductPrice: 0, maxProductPrice: 100, isLoading: true }}
            />
        );
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    test("renders all sections correctly when data is available", () => {
        const data = { minProductPrice: 0, maxProductPrice: 100, isLoading: false };
        render(
            <ProductsFilterDrawer
                closeFilterDrawer={closeFilterDrawer}
                activeFiltersCount={0}
                tabKey="all"
                productsResponse={data}
            />
        );

        expect(screen.getByTestId("categories-section")).toBeInTheDocument();
        expect(screen.getByTestId("discount-section")).toBeInTheDocument();
        expect(screen.getByTestId("price-section")).toHaveTextContent("0-100");
        expect(screen.getByTestId("availability-section")).toBeInTheDocument();
        expect(screen.getByTestId("delivery-section")).toBeInTheDocument();
    });

    test("calls apply and closes drawer when apply button is clicked", () => {
        render(
            <ProductsFilterDrawer
                closeFilterDrawer={closeFilterDrawer}
                activeFiltersCount={0}
                tabKey="all"
                productsResponse={{ minProductPrice: 0, maxProductPrice: 100, isLoading: false }}
            />
        );

        fireEvent.click(screen.getByTestId("apply-button"));
        expect(applyMock).toHaveBeenCalledWith("all");
        expect(closeFilterDrawer).toHaveBeenCalled();
    });

    test("calls reset and closes drawer when reset button or icon is clicked", () => {
        render(
            <ProductsFilterDrawer
                closeFilterDrawer={closeFilterDrawer}
                activeFiltersCount={1}
                tabKey="all"
                productsResponse={{ minProductPrice: 0, maxProductPrice: 100, isLoading: false }}
            />
        );

        fireEvent.click(screen.getByTestId("reset-button"));
        expect(resetMock).toHaveBeenCalledWith("all");
        expect(closeFilterDrawer).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByTestId("reset-icon"));
        expect(resetMock).toHaveBeenCalledWith("all");
        expect(closeFilterDrawer).toHaveBeenCalledTimes(2);
    });
});
