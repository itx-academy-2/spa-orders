import { screen } from "@testing-library/react";

import OrderProductItem from "@/containers/order-item/components/order-product-item/OrderProductItem";

import { Product } from "@/types/product.types";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockProduct: Product = {
  id: "1",
  name: "Test Product",
  description: "This is a test product",
  price: 100,
  image: "test-image-url",
  status: "AVAILABLE",
  tags: []
};

const mockProductWithDiscount: Product = {
  id: "1",
  name: "Test Product",
  description: "This is a test product",
  price: 100,
  image: "test-image-url",
  status: "AVAILABLE",
  tags: [],
  discount: 20,
  priceWithDiscount: 80
};

describe("OrderProductItem", () => {
  test("renders product information correctly", () => {
    const quantity = 2;
    const totalPrice = mockProduct.price * quantity;

    renderWithProviders(
      <OrderProductItem
        product={mockProduct}
        quantity={quantity}
        totalPrice={totalPrice}
      />
    );
    const productName = screen.getByText(mockProduct.name);
    expect(productName).toBeInTheDocument();
  });

  test("Should not render discount badge and discounted price when there is no discount", () => {
    renderWithProviders(
      <OrderProductItem product={mockProduct} quantity={2} totalPrice={1000} />
    );

    const badge = screen.queryByTestId("spa-order-product-discount-badge");
    const discountedPrice = screen.queryByTestId(
      "spa-order-product-discounted-price"
    );

    expect(badge).not.toBeInTheDocument();
    expect(discountedPrice).not.toBeInTheDocument();
  });

  test("Should render discount badge and discounted price when the product is on sale", () => {
    renderWithProviders(
      <OrderProductItem
        product={mockProductWithDiscount}
        quantity={2}
        totalPrice={1000}
      />
    );

    const badge = screen.getByTestId("spa-order-product-discount-badge");
    const discountedPrice = screen.getByTestId(
      "spa-order-product-discounted-price-container"
    );

    expect(badge).toBeInTheDocument();
    expect(discountedPrice).toBeInTheDocument();
  });
});
