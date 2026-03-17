import { render, screen } from "@testing-library/react";

import ReservedProductDetails from "@/components/reserved-product-details/ReservedProductDetails";
import { ReservedProductDetailsProps } from "@/components/reserved-product-details/ReservedProductDetails.types";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import getCategoryFromTags from '@/utils/get-category-from-tags/getCategoryFromTags';

jest.mock('@/context/i18n/I18nProvider', () => ({
  useLocaleContext: jest.fn(),
}));

jest.mock('@/utils/get-category-from-tags/getCategoryFromTags', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedUseLocaleContext = useLocaleContext as jest.Mock;
const mockedGetCategoryFromTags = getCategoryFromTags as jest.Mock;

describe("ReservedProductDetails", () => {
  const mockProduct: ReservedProductDetailsProps["product"] = {
    id: "1",
    image: "test-image.png",
    quantity: 5,
    reservedQuantity: 2,
    price: 100,
    priceWithDiscount: 80,
    discount: 20,
    tags: [{ id: 1, name: "category:mobile" }],
    productTranslations: [
      { name: "Тестовий продукт", description: "Опис", languageCode: "uk" },
      { name: "Test Product", description: "Description", languageCode: "en" },
    ],
    status: "VISIBLE",
    percentageOfTotalOrders: null,
    createdAt: "2025-12-05T10:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLocaleContext.mockReturnValue({ locale: "uk" });
    mockedGetCategoryFromTags.mockReturnValue("mobile");
  });

  test("renders error fallback if product is undefined", () => {
    render(<ReservedProductDetails product={undefined} />);
    expect(screen.getByText("errors.notFound")).toBeInTheDocument();
  });

  test("renders product details correctly", () => {
    render(<ReservedProductDetails product={mockProduct} />);

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
