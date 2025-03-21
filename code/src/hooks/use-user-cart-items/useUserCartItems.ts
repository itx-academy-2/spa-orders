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

  const [optimisticPriceWithDiscount, setOptimisticPriceWithDiscount] =
    useState(0);

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
    setOptimisticPriceWithDiscount(cartItems.totalPriceWithDiscount);
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
      const priceDifference =
        product.productPrice * (newQuantity - oldQuantity);

      setOptimisticTotalPrice((prevState) => prevState + priceDifference);

      const productPriceWithDiscount =
        product.productPriceWithDiscount ?? product.productPrice;
      const priceDifferenceWithDiscount =
        productPriceWithDiscount * (newQuantity - oldQuantity);

      setOptimisticPriceWithDiscount(
        (prevState) => prevState + priceDifferenceWithDiscount
      );

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
        setOptimisticPriceWithDiscount(
          (prevState) => prevState - priceDifferenceWithDiscount
        );
      }
    }
  };

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
    optimisticTotalPriceWithDiscount: optimisticPriceWithDiscount
  };
};

export default useUserCartItems;
