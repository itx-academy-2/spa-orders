import { useIsAuthSelector, useUserRoleSelector } from "@/store/slices/userSlice";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";

import { ROLES } from "@/constants/common";

const useWishlistWithAuthCheck = () => {
  const isAuthenticated = useIsAuthSelector();
  const userRole = useUserRoleSelector();

  const skipWishlistQuery =
    !isAuthenticated ||
    userRole === ROLES.SHOP_MANAGER ||
    userRole === ROLES.ADMIN;

  return useGetUserWishlistQuery(undefined, {
    skip: skipWishlistQuery
  });
};

export default useWishlistWithAuthCheck;
