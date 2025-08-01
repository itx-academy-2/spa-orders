import { useIsAuthSelector } from "@/store/slices/userSlice";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";

const useWishlistIfAuth = () => {
  const isAuthenticated = useIsAuthSelector();

  return useGetUserWishlistQuery(undefined, {
    skip: !isAuthenticated
  });
};

export default useWishlistIfAuth;
