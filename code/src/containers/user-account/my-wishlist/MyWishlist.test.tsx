import { screen } from "@testing-library/react";
import { useSearchParams } from "react-router-dom";

import MyWishlist from "@/containers/user-account/my-wishlist/MyWishlist";
import { mockProducts } from "@/containers/products-container/ProductContainer.constants";

import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import render from "@/utils/render-with-providers/renderWithProviders";
import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";

jest.mock("@/store/api/wishlistApi", () => ({
  useGetUserWishlistQuery: jest.fn(),
}));

const mockUseGetUserWishlistQuery = useGetUserWishlistQuery as jest.Mock;

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: jest.fn(() => ({ locale: "en" })),
}));

const mockData = { content: mockProducts, totalElements: mockProducts.length };

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
}: {
  mockResponse?: Partial<{ data?: typeof mockData; isLoading?: boolean }>;
} = {}) => {
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

  test("should show empty message, title, 0 products and sort options when wishlist is empty", () => {
    renderAndMock({ mockResponse: { data: { content: [], totalElements: 0 } } });

    expect(screen.getByText(/myWishlist.emptyMessage/i)).toBeInTheDocument();
    expect(screen.getByText(/myWishlist.title/i)).toBeInTheDocument();
    expect(screen.getByText(/myWishlist.productsCount/i)).toBeInTheDocument();
    expect(screen.getByText(/myWishlist\.productsCount\/count:0/i)).toBeInTheDocument();
    expect(screen.getByText(/productsDefault.label/i)).toBeInTheDocument();
  });

  test("should show correct products count when wishlist is not empty", () => {
    renderAndMock({ mockResponse: { data: mockData } });

    expect(screen.getByText(`myWishlist.productsCount/count:${mockData.totalElements}`)).toBeInTheDocument();
  });

  test("should render all wishlist products when not empty", () => {
    renderAndMock({ mockResponse: { data: mockData } });

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(mockData.content.length);

    mockData.content.forEach((product, idx) => {
      expect(links[idx]).toHaveTextContent(product.name);
      expect(links[idx]).toHaveTextContent(String(product.price));
    });
  });

  test("should call useGetUserWishlistQuery with sort and lang params", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("sort", "bestsellers,desc");

    const setSearchParams = jest.fn();

    mockedUseSearchParams.mockReturnValue([searchParams, setSearchParams]);

    renderAndMock();

    expect(mockUseGetUserWishlistQuery).toHaveBeenCalledWith({
      sort: "bestsellers,desc",
      lang: "en",
    });
  });
});
