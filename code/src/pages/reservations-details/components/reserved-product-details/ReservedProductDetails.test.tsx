import { render, screen } from "@testing-library/react";

import ReservedProductDetails from "@/pages/reservations-details/components/reserved-product-details/ReservedProductDetails";
import { useGetManagerProductQuery } from "@/store/api/productsApi";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import getCategoryFromTags from '@/utils/get-category-from-tags/getCategoryFromTags';

jest.mock("@/store/api/productsApi");
jest.mock("@/context/i18n/I18nProvider");
jest.mock('@/utils/get-category-from-tags/getCategoryFromTags');

const mockedUseGetManagerProductQuery = useGetManagerProductQuery as jest.Mock;
const mockedUseLocaleContext = useLocaleContext as jest.Mock;
const mockedGetCategoryFromTags = getCategoryFromTags as jest.Mock;

describe("ReservedProductDetails", () => {
    const productId = "1";

    const mockProduct = {
        id: "1",
        image: "test-image.png",
        quantity: 5,
        price: 100,
        priceWithDiscount: 80,
        discount: 20,
        tags: [{ id: 1, name: "category:mobile" }],
        productTranslations: [
            { name: "Тестовий продукт", description: "Опис", languageCode: "uk" },
            { name: "Test Product", description: "Description", languageCode: "en" }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseLocaleContext.mockReturnValue({ locale: "uk" });
        mockedGetCategoryFromTags.mockReturnValue("mobile");
    });

    test("renders loading fallback while fetching product", () => {
        mockedUseGetManagerProductQuery.mockReturnValue({
            data: null,
            isLoading: true,
            error: null
        });

        render(<ReservedProductDetails productId={productId} />);
        expect(screen.getByTestId("page-loading-fallback")).toBeInTheDocument();
    });

    test("renders error message if no product or error occurs", () => {
        mockedUseGetManagerProductQuery.mockReturnValue({
            data: null,
            isLoading: false,
            error: true
        });

        render(<ReservedProductDetails productId={productId} />);
        expect(screen.getByText("errors.somethingWentWrong")).toBeInTheDocument();
    });

    test("renders product details correctly", () => {
        mockedUseGetManagerProductQuery.mockReturnValue({
            data: mockProduct,
            isLoading: false,
            error: null
        });

        render(<ReservedProductDetails productId={productId} />);

        expect(screen.getByRole("img")).toHaveAttribute("src", "test-image.png");
        expect(screen.getByRole("img")).toHaveAttribute("alt", "Тестовий продукт");
        expect(screen.getByText("Тестовий продукт")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("100")).toBeInTheDocument();
        expect(screen.getByText("80")).toBeInTheDocument();
        expect(screen.getByText("20%")).toBeInTheDocument();
        expect(screen.getByText("productsAll.mobile")).toBeInTheDocument();
    });
});
