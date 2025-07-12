import { useSearchParams } from "react-router-dom";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import {
  useGetUserWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation
} from "@/store/api/wishlistApi";


const useToggleFavorite = () => {
  const { locale } = useLocaleContext();
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort") ?? undefined;

  const {
    data: wishlistData,
    isLoading,
    isError,
  } = useGetUserWishlistQuery({
    lang: locale,
    sort
  });

  const wishlist = wishlistData?.content ?? [];

  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isFavorite = (productId: string): boolean =>
    wishlist.some((item) => item.id === productId);

  const toggle = (productId: string) => {
    if (isFavorite(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return { toggle, isFavorite, wishlist, isLoading, isError };
};

export default useToggleFavorite;
