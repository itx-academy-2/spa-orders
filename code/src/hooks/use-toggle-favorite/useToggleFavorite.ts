import {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation
} from "@/store/api/wishlistApi";

const useToggleFavorite = () => {
  const {
    data: wishlist = [],
    isLoading
   } = useGetWishlistQuery();
  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();

  const toggle = (productId: string) => {
    if (isFavorite(productId)) {
      removeWishlist(productId);
    } else {
      addWishlist(productId);
    }
  };

  const isFavorite = (productId: string) =>
    wishlist.some((item) => item.id === productId);

  return { toggle, isFavorite, wishlist, isLoading };
};

export default useToggleFavorite;
