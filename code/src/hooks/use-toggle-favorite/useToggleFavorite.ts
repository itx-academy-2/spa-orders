import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation
} from "@/store/api/wishlistApi";
import { Product } from "@/types/product.types";


const useToggleFavorite = (wishlist: Product[]) => {
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isFavorite = (productId: string): boolean =>
    wishlist.some((item) => item.id === productId);

  const toggle = async (productId: string) => {
    if (isFavorite(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return { toggle, isFavorite, wishlist };
};

export default useToggleFavorite;
