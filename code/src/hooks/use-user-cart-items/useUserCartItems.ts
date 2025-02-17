import { useEffect, useState } from "react";

import useGetCart from "@/hooks/use-get-cart/useGetCart";
import useRemoveFromCart from "@/hooks/use-remove-from-cart/useRemoveFromCart";
import useSnackbar from "@/hooks/use-snackbar/useSnackbar";
import useUpdateCartItemQuantity from "@/hooks/use-update-cart-item-quantity/useUpdateCartItemQuantity";
import { useUserDetailsSelector } from "@/store/slices/userSlice";
import { CartItem } from "@/types/cart.types";

const useUserCartItems = () => {
  const [optimisticTotalPrice, setOptimisticTotalPrice] = useState(0);
  const user = useUserDetailsSelector();
  const { openSnackbarWithTimeout } = useSnackbar();

  const {
    data: cartItems,
    isError,
    isLoading: isCartItemsLoading
  } = useGetCart();

  const [removeItem] = useRemoveFromCart();

  const {
    updateQuantity,
    isLoading: isUpdating,
    isError: updateError
  } = useUpdateCartItemQuantity();

  useEffect(() => {
    setOptimisticTotalPrice(cartItems.totalPrice);
  }, [cartItems]);

  const handleRemoveItem = (product: CartItem) => {
    removeItem(product);
  };

  const handleQuantityChange = async (
    product: CartItem,
    newQuantity: number
  ) => {
    if (user) {
      const oldQuantity = product.quantity;
      const unitPrice =
        product.productPriceWithDiscount ?? product.productPrice;
      const priceDifference = unitPrice * (newQuantity - oldQuantity);

      setOptimisticTotalPrice((prevState) => prevState + priceDifference);

      try {
        await updateQuantity({
          userId: user.id,
          productId: product.productId,
          quantity: newQuantity
        });
      } catch {
        openSnackbarWithTimeout({
          messageTranslationKey: "cart.itemQuantityUpdate.fail",
          variant: "error"
        });
        setOptimisticTotalPrice((prevState) => prevState - priceDifference);
      }
    }
  };

  const totalDiscountedPrice = cartItems.items.reduce((total, item) => {
    const itemPrice = item.productPriceWithDiscount ?? item.productPrice;
    return total + item.quantity * itemPrice;
  }, 0);

  return {
    user,
    cartItems,
    isCartItemsLoading,
    isError,
    handleRemoveItem,
    handleQuantityChange,
    isUpdating,
    updateError,
    optimisticTotalPrice,
    totalDiscountedPrice
  };
};

export default useUserCartItems;
