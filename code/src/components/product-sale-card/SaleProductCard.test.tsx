import { fireEvent, screen } from "@testing-library/react";

import SaleProductCard from "@/components/product-sale-card/SaleProductCard";

import routes from "@/constants/routes";
import useAddToCartOrOpenDrawer from "@/hooks/use-add-to-cart-or-open-drawer/useAddToCartOrOpenDrawer";
import useToggleFavorite from "@/hooks/use-toggle-favorite/useToggleFavorite";
import { useIsProductReserved } from "@/hooks/use-is-product-reserved/useIsProductReserved";
import { Product } from "@/types/product.types";
import formatPrice from "@/utils/format-price/formatPrice";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";
import { useUserRoleSelector, useIsAuthSelector } from "@/store/slices/userSlice";
import { ROLES } from "@/constants/common";

const mockAddToCartOrOpenDrawer = jest.fn();

jest.mock("@/hooks/use-add-to-cart-or-open-drawer/useAddToCartOrOpenDrawer");

jest.mock("@/hooks/use-toggle-favorite/useToggleFavorite");

const mockToggle = jest.fn();

jest.mock("@/store/slices/userSlice", () => ({
  ...jest.requireActual("@/store/slices/userSlice"),
  useUserRoleSelector: jest.fn(),
  useIsAuthSelector: jest.fn()
}));

jest.mock("@/hooks/use-is-product-reserved/useIsProductReserved");

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  description: "This is a test product",
  price: 100,
  image: "test-image-url",
  status: "AVAILABLE",
  tags: [],
  priceWithDiscount: 80,
  discount: 30
};

const renderAndMock = ({
  isProductInCart,
  isFavorite = false,
  product = mockProduct,
  role,
  isAuthenticated = true,
  isReserved = false
}: {
  isProductInCart: boolean;
  isFavorite?: boolean;
  product?: Product;
  role?: string;
  isAuthenticated?: boolean;
  isReserved?: boolean;
}) => {
  (useAddToCartOrOpenDrawer as jest.Mock).mockReturnValue({
    isProductInCart,
    addToCartOrOpenDrawer: mockAddToCartOrOpenDrawer
  });

  (useToggleFavorite as jest.Mock).mockReturnValue({
    isFavorite: () => isFavorite,
    toggle: mockToggle
  });

  (useUserRoleSelector as jest.Mock).mockReturnValue(role);
  (useIsAuthSelector as jest.Mock).mockReturnValue(isAuthenticated);

  (useIsProductReserved as jest.Mock).mockReturnValue({ isReserved });

  return renderWithProviders(<SaleProductCard product={product} />);
};

describe("SaleProductCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when product is not in cart", () => {
    let result: ReturnType<typeof renderAndMock>;

    beforeEach(() => {
      result = renderAndMock({ isProductInCart: false });
    });

    test("should render product name", () => {
      const productName = screen.getByText(mockProduct.name);
      expect(productName).toBeInTheDocument();
    });

    test("should render product price", () => {
      const productPrice = screen.getByText(formatPrice(mockProduct.price));
      expect(productPrice).toBeInTheDocument();
    });

    test("should render product discounted price", () => {
      const discountedPrice = screen.getByText(
        formatPrice(mockProduct.priceWithDiscount ?? 0)
      );
      expect(discountedPrice).toBeInTheDocument();
    });

    test("should render price as 0 when priceWithDiscount is undefined", () => {
      const productWithoutDiscount = {
        ...mockProduct,
        priceWithDiscount: undefined
      };

      renderAndMock({
        isProductInCart: false,
        product: productWithoutDiscount
      });

      const discountedPrice = screen.getByText(formatPrice(0));
      expect(discountedPrice).toBeInTheDocument();
    });

    test("should render price as 0 when priceWithDiscount is null", () => {
      const productWithNullDiscount = {
        ...mockProduct,
        priceWithDiscount: null
      };

      renderAndMock({
        isProductInCart: false,
        product: productWithNullDiscount
      });

      const discountedPrice = screen.getByText(formatPrice(0));
      expect(discountedPrice).toBeInTheDocument();
    });

    test("should render product description", () => {
      const productDescription = screen.getByText(mockProduct.description);
      expect(productDescription).toBeInTheDocument();
    });

    test("should render product image with correct src and alt attributes", () => {
      const productImage = screen.getByRole("img", { name: mockProduct.name });
      expect(productImage).toHaveAttribute("src", mockProduct.image);
    });

    test("sets src image on image error", () => {
      const productImage = screen.getByRole("img", { name: mockProduct.name });
      fireEvent.error(productImage);

      expect(productImage).toHaveAttribute("src");
    });

    test("should render product link", () => {
      const productLink = screen.getByRole("link");
      expect(productLink).toHaveAttribute(
        "href",
        routes.productDetails.path(mockProduct.id)
      );
    });

    test("should render icon with plus", () => {
      const addToCartIcon = screen.getByTestId("add-to-cart-icon");
      expect(addToCartIcon).toHaveAttribute(
        "href",
        expect.stringContaining("cart-with-plus")
      );
    });

    test('does not render "active" class', () => {
      const isProductActiveElement = result.container.querySelector(
        ".spa-product-card__cart-button--active"
      );
      expect(isProductActiveElement).not.toBeInTheDocument();
    });
  });

  describe("when product is in cart", () => {
    let result: ReturnType<typeof renderAndMock>;

    beforeEach(() => {
      result = renderAndMock({ isProductInCart: true });
    });

    test("should render icon with check mark", () => {
      const addToCartIcon = screen.getByTestId("add-to-cart-icon");
      expect(addToCartIcon).toHaveAttribute(
        "href",
        expect.stringContaining("cart-with-check")
      );

      const isProductActiveElement = result.container.querySelector(
        ".spa-product-card__cart-button--active"
      );
      expect(isProductActiveElement).toBeInTheDocument();
    });
  });

  describe("when product is favorite", () => {
    let result: ReturnType<typeof renderAndMock>;

    beforeEach(() => {
      result = renderAndMock({ isProductInCart: false, isFavorite: true });
    });

    test("should render filled heart icon when product is favorite", () => {
      const filledHeart = screen.getByTestId("FavoriteIcon");
      expect(filledHeart).toBeInTheDocument();
    });

    test("should apply active class when product is favorite", () => {
      const isProductFavoriteElementActive = result.container.querySelector(
        ".spa-product-card__favorite-button--active"
      );
      expect(isProductFavoriteElementActive).toBeInTheDocument();
    });
  });

  describe("when product is not favorite", () => {
    let result: ReturnType<typeof renderAndMock>;

    beforeEach(() => {
      result = renderAndMock({ isProductInCart: false, isFavorite: false });
    });

    test("should render unfilled heart icon when product is not favorite", () => {
      const unfilledHeart = screen.getByTestId("FavoriteBorderIcon");
      expect(unfilledHeart).toBeInTheDocument();
    });


    test("should call toggle function on favorite button click", () => {
      const favoriteButton = screen.getByTestId("FavoriteBorderIcon");
      fireEvent.click(favoriteButton);

      expect(mockToggle).toHaveBeenCalledWith(mockProduct.id);
    });
    test('should not apply active class when product is not favorite', () => {
      const isProductActiveElement = result.container.querySelector(
        ".spa-product-card__favorite-button--active"
      );
      expect(isProductActiveElement).not.toBeInTheDocument();
    });
  });

  describe("discount percentage display", () => {
    test("should render discount label when discount percentage is greater than 0", () => {
      const discountedProduct = {
        ...mockProduct,
        price: 100,
        priceWithDiscount: 70
      };

      renderAndMock({
        isProductInCart: false,
        product: discountedProduct
      });

      expect(screen.getByTestId("discount-label")).toHaveTextContent("-30%");
    });

    test("should NOT render discount label when discount percentage is 0", () => {
      const noDiscountProduct = {
        ...mockProduct,
        price: 100,
        priceWithDiscount: 100
      };

      renderAndMock({
        isProductInCart: false,
        product: noDiscountProduct
      });

      expect(screen.queryByText(/-%/)).not.toBeInTheDocument();
    });

    test("should NOT render discount label when priceWithDiscount is missing", () => {
      const undefinedDiscountProduct = {
        ...mockProduct,
        priceWithDiscount: undefined
      };

      renderAndMock({
        isProductInCart: false,
        product: undefinedDiscountProduct
      });

      expect(screen.queryByText(/-%/)).not.toBeInTheDocument();
    });
  });

  describe("bestsellers block", () => {
    test("should NOT render bestsellers block when percentageOfTotalOrders is undefined", () => {
      const productWithoutPercentage = {
        ...mockProduct,
        percentageOfTotalOrders: undefined
      };

      renderAndMock({
        isProductInCart: false,
        product: productWithoutPercentage
      });

      expect(screen.queryByTestId("best-sellers")).not.toBeInTheDocument();
    });

    test("should NOT render bestsellers block when percentageOfTotalOrders is 0", () => {
      const productWithZeroPercentage = {
        ...mockProduct,
        percentageOfTotalOrders: 0
      };

      renderAndMock({
        isProductInCart: false,
        product: productWithZeroPercentage
      });

      expect(screen.queryByTestId("best-sellers")).not.toBeInTheDocument();
    });

    test("should render bestsellers when percentageOfTotalOrders > 0", () => {
      const product = {
        ...mockProduct,
        percentageOfTotalOrders: 20
      };

      renderAndMock({ isProductInCart: false, product });

      expect(screen.getByTestId("best-sellers")).toBeInTheDocument();
    });
  });

  describe("role-based rendering of action buttons", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("renders favorite and cart buttons for not authenticated user", () => {
      (useUserRoleSelector as jest.Mock).mockReturnValue(undefined);
      (useIsAuthSelector as jest.Mock).mockReturnValue(false);

      renderAndMock({ isProductInCart: false, isFavorite: false });

      expect(screen.getByTestId("FavoriteBorderIcon")).toBeInTheDocument();
      expect(screen.getByTestId("add-to-cart-icon")).toBeInTheDocument();
    });

    test("renders favorite and cart buttons for USER role", () => {
      (useUserRoleSelector as jest.Mock).mockReturnValue(ROLES.USER);
      (useIsAuthSelector as jest.Mock).mockReturnValue(true);

      renderAndMock({ isProductInCart: false, isFavorite: false });

      expect(screen.getByTestId("FavoriteBorderIcon")).toBeInTheDocument();
      expect(screen.getByTestId("add-to-cart-icon")).toBeInTheDocument();
    });

    test("does NOT render favorite and cart buttons for SHOP_MANAGER role", () => {
      renderAndMock({ isProductInCart: false, role: ROLES.SHOP_MANAGER });

      expect(screen.queryByTestId("FavoriteIcon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("FavoriteBorderIcon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("add-to-cart-icon")).not.toBeInTheDocument();
    });

    test("does NOT render favorite and cart buttons for ADMIN role", () => {
      renderAndMock({ isProductInCart: false, role: ROLES.ADMIN });

      expect(screen.queryByTestId("FavoriteIcon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("FavoriteBorderIcon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("add-to-cart-icon")).not.toBeInTheDocument();
    });
  });

  describe("reserved label", () => {
    test("should render reserved label when product is reserved", () => {
      renderAndMock({ isProductInCart: false, isReserved: true });
      expect(screen.getByTestId("reserved-label")).toBeInTheDocument();
    });

    test("should NOT render reserved label when product is not reserved", () => {
      renderAndMock({ isProductInCart: false, isReserved: false });
      expect(screen.queryByTestId("reserved-label")).not.toBeInTheDocument();
    });
  });
});
