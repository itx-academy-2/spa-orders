import { render, screen } from "@testing-library/react";
import MyReservations from "@/containers/user-account/my-reservations/MyReservations";

import { useGetMyReservationsMetadataQuery, useGetMyReservationsQuery } from "@/store/tanstack-api/modules/reservations";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import usePagination from "@/hooks/use-pagination/usePagination";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";

jest.mock("@/store/tanstack-api/modules/reservations");
jest.mock("@/store/api/wishlistApi");
jest.mock("@/context/i18n/I18nProvider");
jest.mock("@/hooks/use-pagination/usePagination");
jest.mock("@/utils/check-screen-size/useScreenSize");
jest.mock("@/utils/set-product-size/setProductsPerPageSize");
jest.mock("@/store/tanstack-api/modules/reservations");

jest.mock(
    "@/containers/products-container/ProductsContainer",
    () => ({
        __esModule: true,
        default: ({ products }: { products: { id: string; name: string }[] }) => (
            <div data-testid="products-container">
                {products.map((p) => (
                    <span key={p.id}>{p.name}</span>
                ))}
            </div>
        ),
    })
);

jest.mock(
    "@/containers/page-loading-fallback/PageLoadingFallback",
    () => ({
        __esModule: true,
        default: () => <div>Loading...</div>,
    })
);

const mockReservations = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" }
];

const mockWishlist = { content: [{ id: "1", name: "Product 1" }] };

describe("MyReservations", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useLocaleContext as jest.Mock).mockReturnValue({ locale: "en" });
        (usePagination as jest.Mock).mockReturnValue({ page: 1 });
        (useScreenSize as jest.Mock).mockReturnValue({ width: 1200 });
        (setProductsPerPageSize as jest.Mock).mockReturnValue(10);

        (useGetMyReservationsQuery as jest.Mock).mockReturnValue({
            data: mockReservations,
            isLoading: false
        });

        (useGetMyReservationsMetadataQuery as jest.Mock).mockReturnValue({
            data: { reservations: mockReservations },
            isLoading: false
        });

        (useGetUserWishlistQuery as jest.Mock).mockReturnValue({
            data: mockWishlist
        });
    });

    test("renders the page title", () => {
        render(<MyReservations />);
        expect(screen.getByText(/MyReservations.title/i)).toBeInTheDocument();
    });

    test("renders count of products", () => {
        render(<MyReservations />);
        expect(screen.getByText(/MyReservations.productsCount/i)).toBeInTheDocument();
    });

    test("renders empty message when no reservations", () => {
        (useGetMyReservationsQuery as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false
        });

        render(<MyReservations />);
        expect(screen.getByText(/MyReservations.emptyMessage/i)).toBeInTheDocument();
    });

    test("renders loading fallback when isLoading is true", () => {
        (useGetMyReservationsQuery as jest.Mock).mockReturnValue({
            data: null,
            isLoading: true
        });

        render(<MyReservations />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("renders ProductsContainer when reservations exist", () => {
        render(<MyReservations />);
        const container = screen.getByTestId("products-container");
        expect(container).toBeInTheDocument();
        mockReservations.forEach((r) => {
            expect(screen.getByText(r.name)).toBeInTheDocument();
        });
    });
});
