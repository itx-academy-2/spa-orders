import { screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { deliveryMethods } from "@/constants/deliveryMethods";
import { productNotFoundRedirectConfig } from "@/pages/product-details/ProductsDetailsPage.constants";
import BuyNowButton from "@/pages/product-details/components/buy-now-button/BuyNowButton";
import ProductDetailsContainer from "@/pages/product-details/components/product-details-container/ProductDetailsContainer";
import { useGetUserProductByIdQuery } from "@/store/api/productsApi";
import { RTKQueryMockState } from "@/types/common";
import { Product } from "@/types/product.types";
import formatPrice from "@/utils/format-price/formatPrice";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";
import useToggleFavorite from "@/hooks/use-toggle-favorite/useToggleFavorite";
import { useUserRoleSelector, useIsAuthSelector  } from "@/store/slices/userSlice";
import { ROLES } from "@/constants/common";

type MockProduct = Product & { quantity: number };

const mockProduct: MockProduct = {
  id: "1",
  status: "AVAILABLE",
  image:
    "https://j65jb0fdkxuua0go.public.blob.vercel-storage.com/phone_1-QodrkqNjm6MWrKqg9ixBBMMfFU40X7.jpg",
  quantity: 10,
  price: 999,
  tags: ["category:mobile"],
  name: "Mobile Phone Apple iPhone 14 Pro 128GB Space Gray",
  description:
    'Screen: 6.1" Super Retina XDR, 2532x1170 / A16 Bionic chip / Main Triple Camera: 48 MP + 12 MP + 12 MP, Front Camera: 12 MP / RAM 6 GB / 128 GB internal storage / 3G / LTE / 5G / GPS / GLONASS / Dual SIM support (Nano-SIM and eSIM) / iOS 16 / 3200 mAh',
  discount: 20,
  percentageOfTotalOrders: null
};

const wishlist: Product[] = [
  {
    id: "1",
    name: "Mock product",
    price: 100,
    status: "AVAILABLE",
    image: "mock-image.jpg",
    tags: ["category:mobile"],
    description: "Mock description",
    discount: 0,
    percentageOfTotalOrders: null
  },
];

const locale = "en";

const mockRenderRedirectComponent = jest.fn();

const mockOpenModal = jest.fn();

jest.mock("@/context/modal/ModalContext", () => ({
  ...jest.requireActual("@/context/modal/ModalContext"),
  useModalContext: () => ({ openModal: mockOpenModal })
}));

jest.mock("@/store/api/productsApi", () => ({
  useGetUserProductByIdQuery: jest.fn()
}));

jest.mock("@/hooks/use-error-page-redirect/useErrorPageRedirect", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    renderRedirectComponent: mockRenderRedirectComponent
  }))
}));

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: jest.fn(() => ({ locale }))
}));

jest.mock(
  "@/pages/product-details/components/buy-now-button/BuyNowButton",
  () => ({
    __esModule: true,
    default: jest.fn(() => (
      <button data-testid="buy-now-button">Buy now</button>
    ))
  })
);

jest.mock("@/hooks/use-toggle-favorite/useToggleFavorite");

jest.mock("@/store/slices/userSlice", () => ({
  ...jest.requireActual("@/store/slices/userSlice"),
  useUserRoleSelector: jest.fn(),
  useIsAuthSelector: jest.fn()
}));

type MockState = RTKQueryMockState<
  typeof mockProduct,
  Record<string, number | string> | null
>;

const defaultArgs: MockState = {
  data: null,
  isLoading: false,
  error: null
};

const productId = "1";

const renderAndMock = (args?: MockState, wishlistProp: Product[] = wishlist) => {
  (useGetUserProductByIdQuery as jest.Mock).mockReturnValue({
    ...defaultArgs,
    ...args
  });
  return renderWithProviders(<ProductDetailsContainer productId={productId} wishlist={wishlistProp} />);
};

const toggleMock = jest.fn();

describe("ProductDetailsContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useToggleFavorite as jest.Mock).mockReturnValue({
      toggle: toggleMock,
      isFavorite: () => false
    });
  });

  test("calls useGetUserProductByIdQuery with correct arguments", () => {
    renderAndMock();

    expect(useGetUserProductByIdQuery).toHaveBeenCalledWith({
      productId,
      lang: locale
    });
  });

  test("renders loading element by default", () => {
    renderAndMock({ isLoading: true });

    const loadingElement = screen.getByTestId("page-loading-fallback-skeleton");
    expect(loadingElement).toBeInTheDocument();
  });

  test("redirects to 404 page when error with status 404 is returned from server", () => {
    renderAndMock({ error: { status: 404 } });

    expect(mockRenderRedirectComponent).toHaveBeenCalledWith(
      productNotFoundRedirectConfig
    );
  });

  test("should not redirect when error with message is received", () => {
    renderAndMock({
      data: mockProduct,
      isLoading: false,
      error: { message: "Test" }
    });

    expect(mockRenderRedirectComponent).not.toHaveBeenCalled();
  });

  test("redirects to not found page when no product data is returned", () => {
    renderAndMock({
      data: null,
      isLoading: false,
      error: null
    });

    expect(mockRenderRedirectComponent).toHaveBeenCalledWith(
      productNotFoundRedirectConfig
    );
  });

  test("renders error message when error exists", () => {
    renderAndMock({
      data: mockProduct,
      isLoading: false,
      error: { message: "Something went wrong" }
    });

    const errorElement = screen.getByText(
      /productDetailsPage.loadErrorMessage/i
    );
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.tagName).toBe("H3");
  });

  test("redirects to not found page when 400 error occurs", () => {
    renderAndMock({
      data: null,
      error: { status: 400 },
      isLoading: false
    });

    expect(mockRenderRedirectComponent).toHaveBeenCalledWith(
      productNotFoundRedirectConfig
    );
  });

  test("renders product information correctly", () => {
    renderAndMock({ data: mockProduct });

    expect(mockRenderRedirectComponent).not.toHaveBeenCalled();

    const productTitle = screen.getByText(mockProduct.name);
    expect(productTitle).toBeInTheDocument();

    const productPrice = screen.getByText(formatPrice(mockProduct.price));
    expect(productPrice).toBeInTheDocument();

    const productImage = screen.getByAltText(mockProduct.name);
    expect(productImage).toHaveAttribute("src", mockProduct.image);

    const categoryTag = screen.getByText("productsAll.mobile");
    expect(categoryTag).toBeInTheDocument();

    const inStockTypography = screen.getByText("productDetailsPage.inStock");
    expect(inStockTypography).toBeInTheDocument();

    const buyNowButton = screen.getByTestId("buy-now-button");
    expect(buyNowButton).toBeInTheDocument();

    expect(BuyNowButton).toHaveBeenCalledWith(
      { productWithId: { ...mockProduct, id: productId } },
      {}
    );
  });

  test("renders delivery methods correctly", () => {
    renderAndMock({ data: mockProduct });

    const deliveryMethodImages = screen.getAllByAltText(
      /dashboardTabs.orders.filters.\w+/
    );
    expect(deliveryMethodImages).toHaveLength(deliveryMethods.length);
  });

  test("renders description correctly", () => {
    renderAndMock({
      data: { ...mockProduct, description: "value1/value2/value3/value4" }
    });

    const descriptionParagraphs = screen.getAllByText(/value\d/);
    expect(descriptionParagraphs).toHaveLength(4);
  });

  test("does not render stock typography when quantity is 0", () => {
    renderAndMock({ data: { ...mockProduct, quantity: 0 } });

    const inStockTypography = screen.queryByText("productDetailsPage.inStock");
    expect(inStockTypography).not.toBeInTheDocument();
  });

  test("does not render category tag if there is no category tag", () => {
    renderAndMock({ data: { ...mockProduct, tags: [] } });

    const categoryTag = screen.queryByText("productsAll.mobile");
    expect(categoryTag).not.toBeInTheDocument();
  });

  test("renders discount label when product has a discount", () => {
    renderAndMock({ data: { ...mockProduct, discount: 20 } });

    const discountLabel = screen.getByText("-20%");
    expect(discountLabel).toBeInTheDocument();
  });

  test("does not render discount label when product has no discount", () => {
    renderAndMock({ data: { ...mockProduct, discount: 0 } });

    const discountLabel = screen.queryByText(/-%/);
    expect(discountLabel).not.toBeInTheDocument();
  });

  test("Should not show best sellers if percentage is null", () => {
    renderAndMock({ data: mockProduct });

    const bestsellersLabel = screen.queryByTestId(
      "product-details-bestseller-label"
    );
    expect(bestsellersLabel).not.toBeInTheDocument();
  });

  test("Should show best sellers if percentage exists", () => {
    renderAndMock({ data: { ...mockProduct, percentageOfTotalOrders: 10 } });

    const bestsellersLabel = screen.getByTestId(
      "product-details-bestseller-label"
    );
    expect(bestsellersLabel).toBeInTheDocument();
  });

  test("renders favorite button (border icon) when not favorite", () => {
    renderAndMock({ data: mockProduct });

    const favoriteIcon = screen.getByTestId("FavoriteBorderIcon");
    expect(favoriteIcon).toBeInTheDocument();
  });

  test("renders favorite button (filled icon) when product is favorite", () => {
    (useToggleFavorite as jest.Mock).mockReturnValue({
      toggle: toggleMock,
      isFavorite: () => true
    });

    renderAndMock({ data: mockProduct });

    const favoriteIcon = screen.getByTestId("FavoriteIcon");
    expect(favoriteIcon).toBeInTheDocument();
  });

  test("should apply active class when product is favorite", () => {
    (useToggleFavorite as jest.Mock).mockReturnValue({
      toggle: toggleMock,
      isFavorite: () => true
    });

    const result = renderAndMock({ data: mockProduct });

    const isProductFavoriteElementActive = result.container.querySelector(
      ".product-details__favorite-button--active"
    );
    expect(isProductFavoriteElementActive).toBeInTheDocument();
  });

  test("should not apply active class when product is not favorite", () => {
    const result = renderAndMock({ data: mockProduct });

    const isProductActiveElement = result.container.querySelector(
      ".product-details__favorite-button--active"
    );
    expect(isProductActiveElement).not.toBeInTheDocument();
  });

  test("redirects unauthenticated user to sign in form when clicking favorite", async () => {
    (useIsAuthSelector as jest.Mock).mockReturnValue(false);
    (useUserRoleSelector as jest.Mock).mockReturnValue(ROLES.USER);

    renderAndMock({ data: mockProduct });

    const favoriteIcon = screen.getByTestId("FavoriteBorderIcon");
    expect(favoriteIcon).toBeInTheDocument();
    await userEvent.click(favoriteIcon);

    expect(mockOpenModal).toHaveBeenCalled();
  });

  test("hides Favorite and Cart icons for ADMIN", () => {
    (useIsAuthSelector as jest.Mock).mockReturnValue(true);
    (useUserRoleSelector as jest.Mock).mockReturnValue(ROLES.ADMIN);

    renderAndMock({ data: mockProduct });

    expect(screen.queryByTestId("FavoriteBorderIcon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cart-icon")).not.toBeInTheDocument();
  });

  test("hides Favorite and Cart icons for MANAGER", () => {
    (useIsAuthSelector as jest.Mock).mockReturnValue(true);
    (useUserRoleSelector as jest.Mock).mockReturnValue(ROLES.SHOP_MANAGER);

    renderAndMock({ data: mockProduct });

    expect(screen.queryByTestId("FavoriteBorderIcon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cart-icon")).not.toBeInTheDocument();
  });

  test("USER can see Favorite icon", () => {
    (useIsAuthSelector as jest.Mock).mockReturnValue(true);
    (useUserRoleSelector as jest.Mock).mockReturnValue(ROLES.USER);

    renderAndMock({ data: mockProduct });

    const favoriteIcon = screen.getByTestId("FavoriteBorderIcon");
    expect(favoriteIcon).toBeInTheDocument();
  });
});

