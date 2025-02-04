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

const mockOnRemove = jest.fn();
const mockOnQuantityChange = jest.fn();

describe("CartItem", () => {
  beforeEach(() => {
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

  test("should render the CartItem component with correct data", () => {
    const imageElement = screen.getByRole("img");
    expect(imageElement).toHaveAttribute("src", mockedItem.image);

    const nameElement = screen.getByText(mockedItem.name);
    expect(nameElement).toBeInTheDocument();

    const quantityInputElement = getQuantityInputElement();
    expect(quantityInputElement).toBeInTheDocument();

    const removeIconElement = screen.getByTestId("RemoveCircleOutlineIcon");
    expect(removeIconElement).toBeInTheDocument();

    const addIconElement = screen.getByTestId("AddCircleOutlineIcon");
    expect(addIconElement).toBeInTheDocument();

    const deleteIconElement = screen.getByTestId("DeleteIcon");
    expect(deleteIconElement).toBeInTheDocument();
  });

  test("should remove item after click on button", () => {
    const deleteIcon = screen.getByTestId("DeleteIcon");
    fireEvent.click(deleteIcon);
    expect(mockOnRemove).toHaveBeenCalled();
  });

  test("should increase quantity when add icon is clicked", async () => {
    const addIconElement = screen.getByTestId("AddCircleOutlineIcon");

    fireEvent.click(addIconElement);

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 3);
    });
  });

  test("should decrease quantity correctly", async () => {
    const removeIconElement = screen.getByTestId("RemoveCircleOutlineIcon");

    fireEvent.click(removeIconElement);

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 1);
    });

    fireEvent.click(removeIconElement);

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 1);
    });
  });

  test("should change quantity via input", async () => {
    const quantityInputElement = getQuantityInputElement();

    await typeIntoInput(quantityInputElement, "5");

    await waitFor(() => {
      expect(mockOnQuantityChange).toHaveBeenCalledWith(mockedItem, 5);
    });
  });

  test("should reset quantity to initial value on blur if input is zero", async () => {
    const quantityInputElement = getQuantityInputElement();

    await typeIntoInput(quantityInputElement, "0");
    fireEvent.blur(quantityInputElement);

    expect(quantityInputElement.value).toBe(mockedItem.quantity.toString());
  });

  test("should handle empty input change", async () => {
    const quantityInputElement = getQuantityInputElement();

    await typeIntoInput(quantityInputElement, "");

    expect(quantityInputElement.value).toBe("");
  });

  test("should reset quantity to default value on blur when quantity is zero", async () => {
    const quantityInputElement = getQuantityInputElement();

    await typeIntoInput(quantityInputElement, "");
    fireEvent.blur(quantityInputElement);

    expect(quantityInputElement.value).toBe(mockedItem.quantity.toString());
  });

  test("should handle invalid number input change", async () => {
    const quantityInputElement = getQuantityInputElement();

    await typeIntoInput(quantityInputElement, "-1");

    expect(quantityInputElement.value).toBe("2");
  });

  test("should not reset quantity on blur if input is valid", async () => {
    const quantityInputElement = getQuantityInputElement();

    await typeIntoInput(quantityInputElement, "3");
    fireEvent.blur(quantityInputElement);

    expect(quantityInputElement.value).toBe("3");
  });

  test("should display correct total price with discount", async () => {
    const discountedItem = {
      ...mockedItem,
      priceWithDiscount: 80,
      discount: 20
    };
    const quantity = 2;
    const expectedTotalPrice = formatPrice(
      quantity * (discountedItem.priceWithDiscount ?? 0)
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

  test("should display correct total price without discount", async () => {
    const quantity = 2;
    const expectedTotalPrice = formatPrice(
      quantity * (mockedItem.productPrice ?? 0)
    );

    renderWithProviders(
      <CartItem
        item={mockedItem}
        onRemove={mockOnRemove}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    const totalPriceElements = screen.getAllByText(expectedTotalPrice, {
      selector: ".spa-cart-item__price-value"
    });
    expect(totalPriceElements.length).toBeGreaterThan(0);
  });

  test("should display formatted discounted price", () => {
    const discountedItem = {
      ...mockedItem,
      priceWithDiscount: 80
    };

    renderWithProviders(
      <CartItem
        item={discountedItem}
        onRemove={mockOnRemove}
        onQuantityChange={mockOnQuantityChange}
      />
    );

    expect(
      screen.getByText(formatPrice(discountedItem.priceWithDiscount ?? 0), {
        selector: ".spa-cart-item__price-discounted"
      })
    ).toBeInTheDocument();
  });
});
