import { fireEvent, screen } from "@testing-library/react";

import SaleProductCard from "@/components/product-sale-card/SaleProductCard";

import routes from "@/constants/routes";
import useAddToCartOrOpenDrawer from "@/hooks/use-add-to-cart-or-open-drawer/useAddToCartOrOpenDrawer";
import { Product } from "@/types/product.types";
import formatPrice from "@/utils/format-price/formatPrice";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockAddToCartOrOpenDrawer = jest.fn();

jest.mock("@/hooks/use-add-to-cart-or-open-drawer/useAddToCartOrOpenDrawer");

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  description: "This is a test product",
  price: 100,
  image: "test-image-url",
  status: "AVAILABLE",
  tags: [],
  priceWithDiscount: 80,
  discount: 20
};

const renderAndMock = (product: Product, isProductInCart: boolean) => {
  (useAddToCartOrOpenDrawer as jest.Mock).mockReturnValue({
    isProductInCart,
    addToCartOrOpenDrawer: mockAddToCartOrOpenDrawer
  });

  return renderWithProviders(<SaleProductCard product={product} />);
};

describe("SaleProductCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when product is not in cart", () => {
    let result: ReturnType<typeof renderAndMock>;

    beforeEach(() => {
      result = renderAndMock(mockProduct, false);
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

      renderAndMock(productWithoutDiscount, false);

      const discountedPrice = screen.getByText(formatPrice(0));
      expect(discountedPrice).toBeInTheDocument();
    });

    test("should render price as 0 when priceWithDiscount is null", () => {
      const productWithNullDiscount = {
        ...mockProduct,
        priceWithDiscount: null
      };

      renderAndMock(productWithNullDiscount, false);

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
      result = renderAndMock(mockProduct, true);
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
});
