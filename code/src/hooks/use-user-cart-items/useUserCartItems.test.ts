import { act, renderHook } from "@testing-library/react";

import useGetCart from "@/hooks/use-get-cart/useGetCart";
import useRemoveFromCart from "@/hooks/use-remove-from-cart/useRemoveFromCart";
import useSnackbar from "@/hooks/use-snackbar/useSnackbar";
import useUpdateCartItemQuantity from "@/hooks/use-update-cart-item-quantity/useUpdateCartItemQuantity";
import useUserCartItems from "@/hooks/use-user-cart-items/useUserCartItems";
import { useUserDetailsSelector } from "@/store/slices/userSlice";
import { CartItem, CartType } from "@/types/cart.types";

jest.mock("@/store/slices/userSlice");
jest.mock("@/hooks/use-get-cart/useGetCart");
jest.mock("@/hooks/use-remove-from-cart/useRemoveFromCart");
jest.mock("@/hooks/use-update-cart-item-quantity/useUpdateCartItemQuantity");
jest.mock("@/hooks/use-snackbar/useSnackbar");

const mockUseUserDetailsSelector = useUserDetailsSelector as jest.Mock;
const mockUseGetCart = useGetCart as jest.Mock;
const mockUseRemoveFromCart = useRemoveFromCart as jest.Mock;
const mockUseUpdateCartItemQuantity = useUpdateCartItemQuantity as jest.Mock;
const mockOpenSnackbarWithTimeout = jest.fn();

const mockRemoveItem = jest.fn();
const mockUpdateQuantity = jest.fn();

type RenderWithMockParams = {
  data?: CartType;
  isLoading?: boolean;
  isError?: boolean;
  updateError?: boolean;
  isUpdating?: boolean;
  user?: { id: string } | null;
};

const cartItems = [
  {
    productId: "1",
    name: "Product 1",
    productPrice: 200,
    quantity: 1
  },
  {
    productId: "2",
    name: "Product 2",
    productPriceWithDiscount: 100,
    productPrice: 150,
    quantity: 2
  }
] as CartItem[];
const product = { productId: "1", productPrice: 200, quantity: 1 } as CartItem;

const emptyCartData: CartType = {
  items: [],
  totalPrice: 0,
  totalPriceWithDiscount: 0
};

const calculateTotalDiscountedPrice = (items: CartItem[]) =>
  items.reduce((total, item) => {
    const itemPrice = item.productPriceWithDiscount ?? item.productPrice;
    return total + item.quantity * itemPrice;
  }, 0);

const fullCart: CartType = {
  items: cartItems,
  totalPrice: 400,
  totalPriceWithDiscount: 400
};

const defaultProps = {
  data: emptyCartData,
  isLoading: false,
  isError: false,
  updateError: false,
  isUpdating: false,
  user: { id: "user1" }
};

const renderWithMockParams = ({
  data = emptyCartData,
  isLoading = false,
  isError = false,
  updateError = false,
  isUpdating = false,
  user = { id: "user1" }
}: RenderWithMockParams = defaultProps) => {
  mockUseUserDetailsSelector.mockReturnValue(user);
  mockUseGetCart.mockReturnValue({
    data,
    isLoading,
    isError
  });
  mockUseRemoveFromCart.mockReturnValue([mockRemoveItem]);
  mockUseUpdateCartItemQuantity.mockReturnValue({
    updateQuantity: updateError ? () => Promise.reject() : mockUpdateQuantity,
    isLoading: isUpdating,
    isError: updateError
  });
  (useSnackbar as jest.Mock).mockReturnValue({
    openSnackbarWithTimeout: mockOpenSnackbarWithTimeout
  });

  return renderHook(() => useUserCartItems());
};

describe("useUserCartItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return loading state when fetching cart items", () => {
    const { result } = renderWithMockParams({ isLoading: true });

    const isCartItemsLoadingResult = result.current.isCartItemsLoading;
    expect(isCartItemsLoadingResult).toBe(true);
  });

  test("should return error state when fetching cart items fails", () => {
    const { result } = renderWithMockParams({ isError: true });

    const isErrorResult = result.current.isError;
    expect(isErrorResult).toBe(true);
  });

  test("should return cart items when fetching is successful", () => {
    const { result } = renderWithMockParams({
      data: fullCart
    });

    const cartItemsResult = result.current.cartItems;
    expect(cartItemsResult).toEqual(fullCart);
  });

  test("should call removeItem when handleRemoveItem is invoked", () => {
    const { result } = renderWithMockParams({
      data: fullCart
    });

    act(() => {
      result.current.handleRemoveItem(cartItems[0]);
    });

    expect(mockRemoveItem).toHaveBeenCalledWith(cartItems[0]);
  });

  test("should call updateQuantity when handleQuantityChange is invoked", () => {
    const { result } = renderWithMockParams({
      data: fullCart
    });

    act(() => {
      result.current.handleQuantityChange(cartItems[0], 2);
    });

    expect(mockUpdateQuantity).toHaveBeenCalledWith({
      userId: "user1",
      productId: "1",
      quantity: 2
    });
  });

  test("should handle isUpdating state when updating quantity", () => {
    const { result } = renderWithMockParams({
      data: fullCart,
      isUpdating: true
    });

    const isUpdatingResult = result.current.isUpdating;
    expect(isUpdatingResult).toBe(true);
  });

  test("should handle update error state when updating quantity fails", () => {
    const { result } = renderWithMockParams({
      data: fullCart,
      updateError: true
    });

    const updateErrorResult = result.current.updateError;
    expect(updateErrorResult).toBe(true);
  });

  test("should handle removal of item", () => {
    const { result } = renderWithMockParams({
      data: fullCart
    });

    result.current.handleRemoveItem(product);

    expect(mockRemoveItem).toHaveBeenCalledWith(product);
  });

  test("should not call updateQuantity if user is not logged in", () => {
    const { result } = renderWithMockParams({
      data: fullCart,
      user: null
    });

    act(() => {
      result.current.handleQuantityChange(cartItems[0], 2);
    });

    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  test("should handle error when updateQuantity fails and call snackbar", async () => {
    const { result } = renderWithMockParams({
      data: fullCart,
      updateError: true
    });

    await act(async () => {
      await result.current.handleQuantityChange(cartItems[0], 2);
    });

    expect(mockOpenSnackbarWithTimeout).toHaveBeenCalledWith({
      messageTranslationKey: "cart.itemQuantityUpdate.fail",
      variant: "error"
    });
  });

  test("Should update optimistic total price when cart items are changed", () => {
    const { result, rerender } = renderWithMockParams();

    const inititalOptimisticPrice = result.current.optimisticTotalPrice;

    mockUseGetCart.mockReturnValue({
      data: fullCart,
      isLoading: false,
      isError: false
    });

    rerender();

    const updatedOptimisticPrice = result.current.optimisticTotalPrice;

    expect(updatedOptimisticPrice).not.toBe(inititalOptimisticPrice);
  });

  test("Should update optimistic total price when quantity is changed", async () => {
    const { result, rerender } = renderWithMockParams({ data: fullCart });

    await act(() => result.current.handleQuantityChange(cartItems[1], 6));

    const updatedCart = [cartItems[0], { ...cartItems[1], quantity: 6 }];

    const totalDiscountedPrice = calculateTotalDiscountedPrice(updatedCart);

    rerender();

    expect(result.current.optimisticTotalPriceWithDiscount).toBe(
      totalDiscountedPrice
    );
  });

  test("Should return right total discounted price", () => {
    const totalDiscountedPrice = calculateTotalDiscountedPrice(cartItems);

    const { result } = renderWithMockParams({ data: fullCart });

    expect(result.current.optimisticTotalPriceWithDiscount).toBe(
      totalDiscountedPrice
    );
  });

  test("Should not react on quantity change if there is no user", () => {
    const { result } = renderWithMockParams({ user: null, data: fullCart });

    result.current.handleQuantityChange(product, 5);

    expect(result.current.optimisticTotalPrice).toBe(fullCart.totalPrice);
  });

  test("Should reset optimistic price when update fails", async () => {
    const { result } = renderWithMockParams({
      data: fullCart,
      updateError: true
    });

    await act(() => result.current.handleQuantityChange(product, 5));

    expect(result.current.optimisticTotalPrice).toBe(fullCart.totalPrice);
  });
});
