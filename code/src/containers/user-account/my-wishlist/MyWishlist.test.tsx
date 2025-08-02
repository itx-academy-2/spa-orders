import { screen } from "@testing-library/react";
import { useSearchParams } from "react-router-dom";

import MyWishlist from "@/containers/user-account/my-wishlist/MyWishlist";
import { mockProducts } from "@/containers/products-container/ProductContainer.constants";

import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import render from "@/utils/render-with-providers/renderWithProviders";
import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";
import userEvent from "@testing-library/user-event";

jest.mock("@/store/api/wishlistApi", () => ({
  useGetUserWishlistQuery: jest.fn(),
}));

const mockUseGetUserWishlistQuery = useGetUserWishlistQuery as jest.Mock;

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: jest.fn(() => ({ locale: "en" })),
}));

const mockData = {
  content: mockProducts,
  totalElements: mockProducts.length,
  totalPages: 3
};

jest.mock("@/containers/products-container/ProductsContainer", () => ({
  __esModule: true,
  default: ({ isLoading, products }: ProductsContainerProps) => (
    <div data-testid="products-container">
      {isLoading && <div>Loading...</div>}
      {products.length > 0 &&
        products.map((product) => (
          <a key={product.id} role="link">
            {product.name} - ${product.price}
          </a>
        ))}
    </div>
  ),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: jest.fn(),
  };
});

const mockedUseSearchParams = useSearchParams as jest.Mock;

const renderAndMock = ({
  mockResponse = {},
  mockSortOption,
}: {
  mockResponse?: Partial<{ data?: typeof mockData; isLoading?: boolean }>;
  mockSortOption?: string;
} = {}) => {
  const searchParams = new URLSearchParams();
  if (mockSortOption) searchParams.set("sort", mockSortOption);
  const setParams = jest.fn();
  mockedUseSearchParams.mockReturnValue([searchParams, setParams]);

  mockUseGetUserWishlistQuery.mockReturnValue({
    isLoading: false,
    ...mockResponse,
    data:
      "data" in mockResponse && !mockResponse.data
        ? mockResponse.data
        : { ...mockData, ...mockResponse.data },
  });

  return render(<MyWishlist />);
};

describe("MyWishlist", () => {
  beforeEach(() => {
    const defaultParams = new URLSearchParams();
    const setParams = jest.fn();

    mockedUseSearchParams.mockReturnValue([defaultParams, setParams]);

    jest.clearAllMocks();
  });

  test("should show loader when loading", () => {
    renderAndMock({ mockResponse: { isLoading: true } });

    expect(screen.getByTestId("page-loading-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("page-loading-fallback-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("products-container")).not.toBeInTheDocument();
  });

  test("should show empty message, title, 0 products and sort options label when wishlist is empty", () => {
    renderAndMock({ mockResponse: { data: { content: [], totalElements: 0, totalPages: 0 } } });

    expect(screen.getByText(/myWishlist.emptyMessage/i)).toBeInTheDocument();
    expect(screen.getByText(/myWishlist.title/i)).toBeInTheDocument();
    expect(screen.getByText(/myWishlist.productsCount/i)).toBeInTheDocument();
    expect(screen.getByText(/myWishlist\.productsCount\/count:0/i)).toBeInTheDocument();
    expect(screen.getByText(/sortBy.label/i)).toBeInTheDocument();
    expect(screen.getByText(/sortOptions.newest/i)).toBeInTheDocument();
  });

  test("should show correct products count when wishlist is not empty", () => {
    renderAndMock({ mockResponse: { data: mockData } });

    expect(screen.getByText(`myWishlist.productsCount/count:${mockData.totalElements}`)).toBeInTheDocument();
  });

  test("should render PaginationBlock with correct props", () => {
    renderAndMock();

    expect(screen.getByText(/myWishlist.title/i)).toBeInTheDocument();
    expect(mockUseGetUserWishlistQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 0,
      })
    );
  });

  test("should fall back to default sort label when sortOption is not matched", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("sort", "nonexistent-sort");

    mockedUseSearchParams.mockReturnValue([searchParams, jest.fn()]);

    renderAndMock();

    expect(screen.getByTestId("default-sort-label")).toBeInTheDocument();
  });

  test("should render all wishlist products from response", () => {
    renderAndMock({ mockResponse: { data: mockData } });

    mockData.content.forEach((product) => {
      expect(screen.getByRole("link", { name: `${product.name} - $${product.price}` })).toBeInTheDocument();
    });
  });

  test("should update sort option on change", async () => {
    renderAndMock({
      mockResponse: { data: mockData },
      mockSortOption: "priceLowToHigh",
    });

    const dropdown = screen.getByTestId("my-wishlist-dropdown");
    await userEvent.click(dropdown);
    const option = screen.getByText("sortOptions.priceHighLow");
    await userEvent.click(option);

    const selectedText = screen.getByText("sortOptions.priceHighLow");
    expect(selectedText).toBeInTheDocument();
  });

  test("should show 0 products when wishlist is undefined", () => {
    renderAndMock({
      mockResponse: { data: undefined },
    });

    expect(screen.getByText(/myWishlist\.productsCount\/count:0/i)).toBeInTheDocument();
  });
});
