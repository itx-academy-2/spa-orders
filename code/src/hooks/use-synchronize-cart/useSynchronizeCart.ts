import { useEffect } from "react";

import useGetCart from "@/hooks/use-get-cart/useGetCart";
import useSnackbar from "@/hooks/use-snackbar/useSnackbar";
import { useAddToCartMutation } from "@/store/api/cartApi";
import {
  useIsFirstSessionAfterAuthSelector,
  useUserDetailsSelector
} from "@/store/slices/userSlice";
import isErrorWithStatus from "@/utils/is-error-with-status/isErrorWithStatus";

const useSynchronizeCart = () => {
  const { data: cartData } = useGetCart();
  const { openSnackbarWithTimeout } = useSnackbar();
  const [addToCart] = useAddToCartMutation();

  const user = useUserDetailsSelector();
  const isFirstSessionAfterAuth = useIsFirstSessionAfterAuthSelector();

  const userId = user?.id;

  const synchornize = async (userId: number) => {
    // @TODO: change it to make only one request when backend will have such endpoint
    for (const cartItem of cartData.items) {
      try {
        await addToCart({
          productId: cartItem.productId,
          userId: userId
        }).unwrap();
      } catch (e: unknown) {
        // 409 error means user already has this product in the remote cart, no need for error in such case
        if (isErrorWithStatus(e) && e.status !== 409) {
          openSnackbarWithTimeout({
            messageTranslationKey: "cart.itemAdditionToRemote.fail",
            variant: "error"
          });
        }
      }
    }
  };

  useEffect(() => {
    if (userId && isFirstSessionAfterAuth) {
      synchornize(userId);
    }
  }, [userId]);
};

export default useSynchronizeCart;
