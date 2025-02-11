import { fireEvent, screen, waitFor } from "@testing-library/react";

import CartItem from "@/pages/cart/components/cart-item/CartItem";
import formatPrice from "@/utils/format-price/formatPrice";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";
import typeIntoInput from "@/utils/type-into-input/typeIntoInput";

interface CartItemType {
  productId: string;
  image: string;
  name: string;
  productPrice: number;
  quantity: number;
  calculatedPrice: number;
  productPriceWithDiscount?: number;
  discount?: number;
}

const mockedItem: CartItemType = {
  productId: "8efbee82-8a0c-407a-a4c0-16bbad40a23e",
  image:
    "https://j65jb0fdkxuua0go.public.blob.vercel-storage.com/phone_2-tTDYhyoyqsEkwPzySFdXflYCe7TkUb.jpg",
  name: "Iphone",
  productPrice: 100.45,
  productPriceWithDiscount: 90.45,
  quantity: 2,
  calculatedPrice: 200.9,
  discount: 10
};

const mockOnRemove = jest.fn();
const mockOnQuantityChange = jest.fn();

describe("CartItem Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderWithProviders(
      <CartItem
        item={mockedItem}
        onRemove={mockOnRemove}
        onQuantityChange={mockOnQuantityChange}
      />
    );
  });

  const getQuantityInputElement = () =>
    screen.getByDisplayValue(
      mockedItem.quantity.toString()
    ) as HTMLInputElement;

  test("removes item when delete button is clicked", () => {
    const deleteIcon = screen.getByTestId("remove-cart-item-button");
    fireEvent.click(deleteIcon);
    expect(mockOnRemove).toHaveBeenCalledWith(mockedItem);
  });

  test("increases quantity when add button is clicked", async () => {
    const addIconElement = screen.getByTestId("increase-quantity-button");
    fireEvent.click(addIconElement);

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 3);
    });
  });

  test("decreases quantity but not below 1", async () => {
    const removeIconElement = screen.getByTestId("decrease-quantity-button");
    fireEvent.click(removeIconElement);

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 1);
    });

    fireEvent.click(removeIconElement);
    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledTimes(1);
    });
  });

  test("changes quantity via input and triggers update", async () => {
    const quantityInputElement = getQuantityInputElement();
    await typeIntoInput(quantityInputElement, "5");

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 5);
    });
  });

  test("resets quantity on blur if input is zero", async () => {
    const quantityInputElement = getQuantityInputElement();
    await typeIntoInput(quantityInputElement, "0");
    fireEvent.blur(quantityInputElement);

    await waitFor(() => {
      expect(quantityInputElement.value).toBe(mockedItem.quantity.toString());
    });
  });

  test("handles empty input gracefully", async () => {
    const quantityInputElement = getQuantityInputElement();
    await typeIntoInput(quantityInputElement, "");
    expect(quantityInputElement.value).toBe("");
  });

  test("displays correct total price with discount", async () => {
    const discountedItem = {
      ...mockedItem,
      productPriceWithDiscount: 80,
      discount: 20
    };
    const expectedTotalPrice = formatPrice(
      discountedItem.quantity * (discountedItem.productPriceWithDiscount ?? 0)
    );

    renderWithProviders(
      <CartItem
        item={discountedItem}
        onRemove={mockOnRemove}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    expect(
      screen.getByText(expectedTotalPrice, {
        selector: ".spa-cart-item__price-discounted-total"
      })
    ).toBeInTheDocument();
  });

  test("displays correct total price", async () => {
    const hasDiscount = mockedItem.productPriceWithDiscount !== undefined;
    const expectedTotalPrice = formatPrice(
      mockedItem.quantity *
        (hasDiscount
          ? mockedItem.productPriceWithDiscount!
          : mockedItem.productPrice)
    );

    const priceSelector = hasDiscount
      ? ".spa-cart-item__price-discounted-total"
      : ".spa-cart-item__price-value";

    expect(
      screen.getByText(expectedTotalPrice, { selector: priceSelector })
    ).toBeInTheDocument();
  });

  test("formats and displays discounted price correctly", () => {
    const discountedItem = {
      ...mockedItem,
      productPriceWithDiscount: 80
    };

    renderWithProviders(
      <CartItem
        item={discountedItem}
        onRemove={mockOnRemove}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    expect(
      screen.getByText(
        formatPrice(discountedItem.productPriceWithDiscount ?? 0),
        {
          selector: ".spa-cart-item__price-discounted"
        }
      )
    ).toBeInTheDocument();
  });

  test("does not call onQuantityChange when quantity remains the same", async () => {
    const quantityInputElement = getQuantityInputElement();

    await typeIntoInput(quantityInputElement, mockedItem.quantity.toString());
    fireEvent.blur(quantityInputElement);

    await waitFor(() => {
      expect(mockOnQuantityChange).not.toHaveBeenCalled();
    });
  });
});
