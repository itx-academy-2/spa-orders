import { screen } from "@testing-library/react";

import OrderProductItem from "@/containers/order-item/components/order-product-item/OrderProductItem";

import { OrderItem } from "@/types/order.types";
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

const renderAndMock = (extraProps?: Partial<OrderItem>) => {
  const quantity = 2;
  const totalPrice = mockProduct.price * quantity;

  renderWithProviders(
    <OrderProductItem
      product={mockProduct}
      quantity={quantity}
      price={totalPrice}
      priceWithDiscount={null}
      discount={null}
      {...extraProps}
    />
  );
};

describe("OrderProductItem", () => {
  test("renders product information correctly", () => {
    renderAndMock();

    const productName = screen.getByText(mockProduct.name);
    expect(productName).toBeInTheDocument();
  });

  test("Should not render discount badge when there is no discount", () => {
    renderAndMock();

    const badge = screen.queryByTestId("spa-order-product-discount-badge");

    expect(badge).not.toBeInTheDocument();
  });

  test("Should render discount badge when the product is on sale", () => {
    renderAndMock({
      product: { ...mockProduct, discount: 10, priceWithDiscount: 12 }
    });

    const badge = screen.getByTestId("spa-order-product-discount-badge");

    expect(badge).toBeInTheDocument();
  });
});
