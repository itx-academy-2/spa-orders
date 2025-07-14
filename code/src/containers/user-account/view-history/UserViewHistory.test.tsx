import { screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { RedirectConfig } from "@/hooks/use-error-page-redirect/useErrorPageRedirect.types";
import {
  useDeleteAllViewProductsMutation,
  useGetViewHistoryApiQuery
} from "@/store/api/viewHistoryApi";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

import UserViewHistoryPage from "./UserViewHistory";

const mockProducts = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
  { id: 4, name: "Product 4", price: 400 },
  { id: 5, name: "Product 5", price: 100 },
  { id: 6, name: "Product 6", price: 200 },
  { id: 7, name: "Product 7", price: 300 },
  { id: 8, name: "Product 8", price: 400 }
];

const mockData = { content: mockProducts, totalPages: 2, totalElements: 8 };
const deleteAllViewProductsMock = jest.fn();

const mockSetSearchParams = jest.fn();
const mockSearchParams = new URLSearchParams();
const mockRedirect = ({
  errorMessageTranslationKey
}: Pick<RedirectConfig, "errorMessageTranslationKey">) => (
  <div>{errorMessageTranslationKey}</div>
);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: () => [mockSearchParams, mockSetSearchParams]
}));

jest.mock("@/store/api/viewHistoryApi");

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: jest.fn(() => ({ locale: "en" }))
}));

jest.mock("@/hooks/use-error-page-redirect/useErrorPageRedirect", () => ({
  __esModule: true,
  default: jest.fn(() => ({ renderRedirectComponent: mockRedirect }))
}));

jest.mock("@/containers/products-container/ProductsContainer", () => ({
  __esModule: true,
  default: ({
    products,
    isLoading = false
  }: {
    products: { id: number; name: string; price: number }[] | null;
    isLoading?: boolean;
  }) => (
    <div data-testid="product-container">
      {isLoading && <span>Loading...</span>}
      {products && products.length > 0 && !isLoading
        ? products.map(
            (product: { id: number; name: string; price: number }) => (
              <a key={product.id} role="link">
                {product.name} - ${product.price}
              </a>
            )
          )
        : null}
    </div>
  )
}));

const renderAndMock = ({
  mockResponse = {},
  isLoading = false,
  isError = false,
  error
}: {
  mockResponse?: Partial<ReturnType<typeof useGetViewHistoryApiQuery>>;
  isLoading?: boolean;
  isError?: boolean;
  error?: { status: number };
} = {}) => {
  (useDeleteAllViewProductsMutation as jest.Mock).mockReturnValue([
    deleteAllViewProductsMock
  ]);

  (useGetViewHistoryApiQuery as jest.Mock).mockReturnValue({
    isLoading,
    isError,
    data: mockResponse?.data ?? mockData,
    error: error ?? null
  });

  return renderWithProviders(<UserViewHistoryPage />);
};

describe("UserViewHistory", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render viewed products", () => {
    renderAndMock();

    const productLinks = screen.getAllByRole("link");

    expect(productLinks.length).toBe(mockProducts.length);
  });

  it("should show no products message when no products", () => {
    renderAndMock({ mockResponse: { data: { content: [] } } });
    const noProducts = screen.getByText("userViewHistory.noProducts");

    expect(noProducts).toBeInTheDocument();
  });

  it("should show Loading", () => {
    renderAndMock({ isLoading: true });
    const skeletons = screen.queryAllByTestId("spa-product-skeleton");

    expect(skeletons.length).toBe(10);
  });

  it("should call deleteAllViewProducts when button is clicked", async () => {
    renderAndMock();

    const deleteButton = screen.getByText("userViewHistory.clearAll");

    await userEvent.click(deleteButton);

    expect(deleteAllViewProductsMock).toHaveBeenCalled();
  });

  it("should set sort param when handleSortChange is called", async () => {
    renderAndMock();

    const sortDropdown = screen.getByTestId("products-dropdown");
    await userEvent.click(sortDropdown);

    const sortOption = screen.getByText("sortOptions.oldest");
    await userEvent.click(sortOption);

    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams)
    );

    const updatedParams = mockSetSearchParams.mock.calls[0][0].toString();
    expect(updatedParams).toContain("sort=product.createdAt%2Casc");
  });

  it("should handle page not found error", () => {
    renderAndMock({
      error: { status: 404 },
      isError: true
    });

    const errorMessage = screen.getByText("product.productNotFound");

    expect(errorMessage).toBeInTheDocument();
  });
});
