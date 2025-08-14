import { screen, fireEvent } from "@testing-library/react";
import CartItem from "@/pages/cart/components/cart-item/CartItem";
import { CartItemProps } from "@/types/cart.types";
import formatPrice from "@/utils/format-price/formatPrice";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockedItem = {
  productId: "1",
  image: "image.jpg",
  name: "Test product",
  productPrice: 100,
  quantity: 2,
  calculatedPrice: 200,
};

const mockedItemWithDiscount = {
  ...mockedItem,
  productPriceWithDiscount: 80,
  discount: 20,
};

const mockOnRemove = jest.fn();
const mockOnQuantityChange = jest.fn();

const mockAndRender = (extraProps?: Partial<CartItemProps>) => {
  renderWithProviders(
    <CartItem
      item={mockedItem}
      onRemove={mockOnRemove}
      onQuantityChange={mockOnQuantityChange}
      {...extraProps}
    />
  );
};

describe("CartItem Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("removes item when delete button is clicked", () => {
    mockAndRender();
    const deleteIcon = screen.getByTestId("remove-cart-item-button");
    fireEvent.click(deleteIcon);
    expect(mockOnRemove).toHaveBeenCalledWith(mockedItem);
  });

  test("displays correct total price with discount", () => {
    const expected = formatPrice(
      mockedItemWithDiscount.quantity *
        (mockedItemWithDiscount.productPriceWithDiscount ?? 0)
    );
    mockAndRender({ item: mockedItemWithDiscount });
    expect(
      screen.getByText(expected, { selector: ".spa-cart-item__price-discounted-total" })
    ).toBeInTheDocument();
  });

  test("displays correct total price without discount", () => {
    const expected = formatPrice(mockedItem.quantity * mockedItem.productPrice);
    mockAndRender();
    expect(
      screen.getByText(expected, { selector: ".spa-cart-item__price-value" })
    ).toBeInTheDocument();
  });

  test("shows discount badge when discount is applied", () => {
    mockAndRender({ item: mockedItemWithDiscount });
    expect(screen.getByTestId("cart-item-discount-badge")).toBeInTheDocument();
  });

  test("does not show discount badge without discount", () => {
    mockAndRender();
    expect(screen.queryByTestId("cart-item-discount-badge")).not.toBeInTheDocument();
  });

  test("renders image without discount", () => {
    mockAndRender();
    expect(screen.getByTestId("cart-item-img")).toBeInTheDocument();
  });

  test("does not render image when discount is applied", () => {
    mockAndRender({ item: mockedItemWithDiscount });
    expect(screen.queryByTestId("cart-item-img")).not.toBeInTheDocument();
  });
});
