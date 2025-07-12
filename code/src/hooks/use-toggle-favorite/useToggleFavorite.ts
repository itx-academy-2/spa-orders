import { useSearchParams } from "react-router-dom";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation
} from "@/store/api/wishlistApi";


const useToggleFavorite = () => {
  const { locale } = useLocaleContext();
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort") ?? undefined;

  const {
    data: wishlistData,
    isLoading,
    isError,
  } = useGetWishlistQuery({
    lang: locale,
    sort
  });

  const wishlist = wishlistData?.content ?? [];

  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();

  const isFavorite = (productId: string): boolean =>
    wishlist.some((item) => item.id === productId);

  const toggle = (productId: string) => {
    if (isFavorite(productId)) {
      removeWishlist(productId);
    } else {
      addWishlist(productId);
    }
  };

  return { toggle, isFavorite, wishlist, isLoading, isError };
};

export default useToggleFavorite;
