import { render, screen } from "@testing-library/react";

import ReservedProductDetails from "@/pages/reservations-details/components/reserved-product-details/ReservedProductDetails";
import { useGetUserProductByIdQuery } from "@/store/api/productsApi";
import { useLocaleContext } from "@/context/i18n/I18nProvider";

jest.mock("@/store/api/productsApi");
jest.mock("@/context/i18n/I18nProvider");
jest.mock('@/utils/get-category-from-tags/getCategoryFromTags');

const mockedUseGetUserProductByIdQuery = useGetUserProductByIdQuery as jest.Mock;
const mockedUseLocaleContext = useLocaleContext as jest.Mock;

describe("ReservedProductDetails", () => {
    const productId = "1";

    const mockProduct = {
        id: "1",
        name: "Test Product",
        image: "test-image.png",
        tags: ["category:mobile"],
        quantity: 5,
        price: 100,
        priceWithDiscount: 80,
        discount: 20
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseLocaleContext.mockReturnValue({ locale: "uk" });
    });

    test("renders loading fallback while fetching product", () => {
        mockedUseGetUserProductByIdQuery.mockReturnValue({
            data: null,
            isLoading: true,
            error: null
        });

        render(<ReservedProductDetails productId={productId} />);
        expect(screen.getByTestId("page-loading-fallback")).toBeInTheDocument();
    });

    test("renders error message if no product or error occurs", () => {
        mockedUseGetUserProductByIdQuery.mockReturnValue({
            data: null,
            isLoading: false,
            error: true
        });

        render(<ReservedProductDetails productId={productId} />);
        expect(screen.getByText("errors.somethingWentWrong")).toBeInTheDocument();
    });

    test("renders product details correctly", () => {
        mockedUseGetUserProductByIdQuery.mockReturnValue({
            data: mockProduct,
            isLoading: false,
            error: null
        });

        render(<ReservedProductDetails productId={productId} />);

        expect(screen.getByRole("img")).toHaveAttribute("src", "test-image.png");
        expect(screen.getByRole("img")).toHaveAttribute("alt", "Test Product");
        expect(screen.getByText("Test Product")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("80")).toBeInTheDocument();
        expect(screen.getByText("20%")).toBeInTheDocument();
    });
});
