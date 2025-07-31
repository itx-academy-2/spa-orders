import { screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { useModalContext } from "@/context/modal/ModalContext";
import { RedirectConfig } from "@/hooks/use-error-page-redirect/useErrorPageRedirect.types";
import {
  useDeleteAllViewProductsMutation,
  useGetViewHistoryApiQuery
} from "@/store/api/viewHistoryApi";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
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

jest.mock("@/store/api/wishlistApi");
const mockUseGetUserWishlistQuery = useGetUserWishlistQuery as jest.Mock;

const mockSetSearchParams = jest.fn();
const mockSearchParams = new URLSearchParams();
const mockedModalOpen = jest.fn();
const mockedModalClose = jest.fn();

const mockRedirect = ({
  errorMessageTranslationKey
}: Pick<RedirectConfig, "errorMessageTranslationKey">) => (
  <div>{errorMessageTranslationKey}</div>
);
jest.mock("@/containers/modals/confirm-modal/ConfirmModal", () => ({
  __esModule: true,
  default: () => {
    return (
      <div id="confirm-modal">
        <button>cancel</button>
        <button>save</button>
      </div>
    );
  }
}));
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

jest.mock("@/context/modal/ModalContext", () => ({
  ...jest.requireActual("@/context/modal/ModalContext"),
  useModalContext: jest.fn()
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
  error,
  wishlistResponse = { content: [] }
}: {
  mockResponse?: Partial<ReturnType<typeof useGetViewHistoryApiQuery>>;
  isLoading?: boolean;
  isError?: boolean;
  error?: { status: number };
  wishlistResponse?: { content: typeof mockProducts };
} = {}) => {
  (useDeleteAllViewProductsMutation as jest.Mock).mockReturnValue([
    deleteAllViewProductsMock
  ]);
  (useModalContext as jest.Mock).mockReturnValue({
    openModal: mockedModalOpen,
    closeModal: mockedModalClose
  });
  (useGetViewHistoryApiQuery as jest.Mock).mockReturnValue({
    isLoading,
    isError,
    data: mockResponse?.data ?? mockData,
    error: error ?? null
  });

  mockUseGetUserWishlistQuery.mockReturnValue({
    data: wishlistResponse,
    isLoading: false,
    isError: false,
    error: null
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
    renderAndMock({
      mockResponse: { data: { content: [], totalElements: 0, totalPages: 0 } }
    });
    const noProducts = screen.getByText("userViewHistory.noProducts");

    expect(noProducts).toBeInTheDocument();
  });

  it("should show Loading", () => {
    renderAndMock({ isLoading: true });
    const skeletons = screen.queryAllByTestId("spa-product-skeleton");

    expect(skeletons.length).toBe(10);
  });

  it("should call clearAll and open modal", async () => {
    renderAndMock();

    const deleteButton = screen.getByText("userViewHistory.clearAll");

    await userEvent.click(deleteButton);

    expect(mockedModalOpen).toHaveBeenCalled();
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
    expect(updatedParams).toContain("sort=viewedAt%2CASC");
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
