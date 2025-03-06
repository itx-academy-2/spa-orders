import { fireEvent, render, screen } from "@testing-library/react";

import CartDrawerItem from "@/containers/cart-drawer/cart-drawer-item/CartDrawerItem";

import { CartItem } from "@/types/cart.types";

const mockCartItem = {
  productId: "2",
  name: "Product 2",
  productPrice: 20,
  quantity: 1,
  image: "some image",
  calculatedPrice: 20
};

const mockCartItemWithDiscount: CartItem = {
  productId: "2",
  name: "Product 2",
  productPrice: 90,
  quantity: 1,
  image: "some image",
  calculatedPrice: 90,
  discount: 10,
  productPriceWithDiscount: 100
};

describe("Test CartDrawerItem", () => {
  test("Should render CartDrawerItem component", () => {
    render(<CartDrawerItem {...mockCartItem} onRemove={() => {}} />);

    const imageElement = screen.getByRole("img");
    const nameElement = screen.getByText(mockCartItem.name);
    const priceElement = screen.getByText(/\$20.00/);

    expect(imageElement).toBeInTheDocument();
    expect(nameElement).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
  });

  test("Should call onRemove when remove button is clicked", () => {
    const onRemove = jest.fn();
    render(<CartDrawerItem {...mockCartItem} onRemove={onRemove} />);

    const removeButton = screen.getByTestId("remove-item-from-cart-button");
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledWith(mockCartItem);
  });

  test("Should render badge and discounted price if product is on sail", () => {
    render(
      <CartDrawerItem {...mockCartItemWithDiscount} onRemove={() => {}} />
    );

    const discountBadge = screen.getByTestId("cart-item-discount-badge");
    const discountedPrice = screen.getByTestId("cart-item-discounted-price");

    expect(discountBadge).toBeInTheDocument();
    expect(discountedPrice).toBeInTheDocument();
  });

  test("Should not render badge and discounted price if product is not on sail", () => {
    render(<CartDrawerItem {...mockCartItem} onRemove={() => {}} />);

    const discountBadge = screen.queryByTestId("cart-item-discount-badge");
    const discountedPrice = screen.queryByTestId("cart-item-discounted-price");

    expect(discountBadge).not.toBeInTheDocument();
    expect(discountedPrice).not.toBeInTheDocument();
  });
});
