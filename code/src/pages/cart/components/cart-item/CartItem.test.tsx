import { act, fireEvent, screen, waitFor } from "@testing-library/react";

import CartItem from "@/pages/cart/components/cart-item/CartItem";
import { CartItemProps } from "@/types/cart.types";
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
  quantity: 2,
  calculatedPrice: 200.9
};

const mockedItemWithDiscount = {
  ...mockedItem,
  productPriceWithDiscount: 80,
  discount: 20
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

jest.useFakeTimers();

describe("CartItem Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getQuantityInputElement = () =>
    screen.getByDisplayValue(
      mockedItem.quantity.toString()
    ) as HTMLInputElement;

  test("removes item when delete button is clicked", () => {
    mockAndRender();

    const deleteIcon = screen.getByTestId("remove-cart-item-button");
    fireEvent.click(deleteIcon);
    expect(mockOnRemove).toHaveBeenCalledWith(mockedItem);
  });

  test("increases quantity when add button is clicked", async () => {
    mockAndRender();

    const addIconElement = screen.getByTestId("increase-quantity-button");
    fireEvent.click(addIconElement);

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 3);
    });
  });

  test("decreases quantity but not below 1", async () => {
    mockAndRender();

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
    mockAndRender();

    const quantityInputElement = getQuantityInputElement();
    await typeIntoInput(quantityInputElement, "5");

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 5);
    });
  });

  test("resets quantity on blur if input is zero", async () => {
    mockAndRender();

    const quantityInputElement = getQuantityInputElement();
    await typeIntoInput(quantityInputElement, "0");
    fireEvent.blur(quantityInputElement);

    await waitFor(() => {
      expect(quantityInputElement.value).toBe(mockedItem.quantity.toString());
    });
  });

  test("handles empty input gracefully", async () => {
    mockAndRender();

    const quantityInputElement = getQuantityInputElement();
    await typeIntoInput(quantityInputElement, "");
    expect(quantityInputElement.value).toBe("");
  });

  test("displays correct total price with discount", async () => {
    const expectedTotalPrice = formatPrice(
      mockedItemWithDiscount.quantity *
        (mockedItemWithDiscount.productPriceWithDiscount ?? 0)
    );

    mockAndRender({ item: mockedItemWithDiscount });

    expect(
      screen.getByText(expectedTotalPrice, {
        selector: ".spa-cart-item__price-discounted-total"
      })
    ).toBeInTheDocument();
  });

  test("displays correct total price", async () => {
    mockAndRender();

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
    mockAndRender({ item: mockedItemWithDiscount });

    expect(
      screen.getByText(
        formatPrice(mockedItemWithDiscount.productPriceWithDiscount ?? 0),
        {
          selector: ".spa-cart-item__price-discounted"
        }
      )
    ).toBeInTheDocument();
  });

  test("does not call onQuantityChange when quantity remains the same", async () => {
    mockAndRender();

    const quantityInputElement = getQuantityInputElement();

    await typeIntoInput(quantityInputElement, mockedItem.quantity.toString());
    fireEvent.blur(quantityInputElement);

    await waitFor(() => {
      expect(mockOnQuantityChange).not.toHaveBeenCalled();
    });
  });

  test("Should set intitial quantity when input looses focus with 0 quantity", async () => {
    mockAndRender();

    const quantityInputElement = getQuantityInputElement();

    fireEvent.focus(quantityInputElement);

    await typeIntoInput(quantityInputElement, "");

    fireEvent.blur(quantityInputElement);

    expect(quantityInputElement).toHaveValue(mockedItem.quantity.toString());
  });

  test("Should set user's inputed quantity if it is more than 0", async () => {
    mockAndRender();

    const quantityInputElement = getQuantityInputElement();

    fireEvent.focus(quantityInputElement);

    await typeIntoInput(quantityInputElement, "5");

    fireEvent.blur(quantityInputElement);

    expect(quantityInputElement).toHaveValue("5");
  });

  test("Should show discount badge when discount is applied", () => {
    mockAndRender({ item: mockedItemWithDiscount });

    const badgeWithImage = screen.getByTestId("cart-item-discount-badge");

    expect(badgeWithImage).toBeInTheDocument();
  });

  test("Should not render badge when there is no discount", () => {
    mockAndRender();

    const badgeWithImage = screen.queryByTestId("cart-item-discount-badge");

    expect(badgeWithImage).not.toBeInTheDocument();
  });

  test("Should render separate image when there is no discount", () => {
    mockAndRender();

    const image = screen.getByTestId("cart-item-img");

    expect(image).toBeInTheDocument();
  });

  test("Should not render separate image when discount is applied", () => {
    mockAndRender({ item: mockedItemWithDiscount });

    const image = screen.queryByTestId("cart-item-img");

    expect(image).not.toBeInTheDocument();
  });

  test("Should be able to decrease quantity", () => {
    mockAndRender();

    const decreaseQuantityButton = screen.getByTestId(
      "decrease-quantity-button"
    );

    expect(decreaseQuantityButton).not.toHaveClass("disabled");
  });

  test("Should disable descrease quantity button when quantity equals one", () => {
    mockAndRender({ item: { ...mockedItem, quantity: 1 } });

    const decreaseQuantityButton = screen.getByTestId(
      "decrease-quantity-button"
    );

    expect(decreaseQuantityButton).toHaveClass("disabled");
  });

  test("Should not call onQuantityChange if quantity is not setted", async () => {
    mockAndRender();

    const quantityInputElement = getQuantityInputElement();

    fireEvent.focus(quantityInputElement);

    await typeIntoInput(quantityInputElement, "3");

    await act(() => jest.advanceTimersByTime(1000));

    await typeIntoInput(quantityInputElement, "");

    await act(() => jest.advanceTimersByTime(1000));

    fireEvent.blur(quantityInputElement);

    expect(mockOnQuantityChange).toHaveBeenCalledTimes(1);
  });

  test("Should not set 0 to quantity if 0 is typed", async () => {
    mockAndRender();

    const quantityInputElement = getQuantityInputElement();

    fireEvent.focus(quantityInputElement);

    await typeIntoInput(quantityInputElement, "3");

    await typeIntoInput(quantityInputElement, "0");

    expect(quantityInputElement).toHaveAttribute("data-real-quantity", "3");
  });
});
