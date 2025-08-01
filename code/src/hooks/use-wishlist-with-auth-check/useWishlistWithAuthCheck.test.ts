import { renderHook } from "@testing-library/react";
import useWishlistWithAuthCheck from "@/hooks/use-wishlist-with-auth-check/useWishlistWithAuthCheck";

import { useIsAuthSelector, useUserRoleSelector } from "@/store/slices/userSlice";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";

import { ROLES } from "@/constants/common";

jest.mock("@/store/slices/userSlice");
jest.mock("@/store/api/wishlistApi");

describe("useWishlistWithAuthCheck", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUseGetUserWishlistQuery = useGetUserWishlistQuery as jest.Mock;
  const mockUseIsAuthSelector = useIsAuthSelector as jest.Mock;
  const mockUseUserRoleSelector = useUserRoleSelector as jest.Mock;

  test("should skip wishlist query if user is NOT authenticated", () => {
    mockUseIsAuthSelector.mockReturnValue(false);
    mockUseUserRoleSelector.mockReturnValue(undefined);

    renderHook(() => useWishlistWithAuthCheck());

    expect(mockUseGetUserWishlistQuery).toHaveBeenCalledWith(undefined, {
      skip: true
    });
  });

  test("should skip wishlist query if user role is SHOP_MANAGER", () => {
    mockUseIsAuthSelector.mockReturnValue(true);
    mockUseUserRoleSelector.mockReturnValue(ROLES.SHOP_MANAGER);

    renderHook(() => useWishlistWithAuthCheck());

    expect(mockUseGetUserWishlistQuery).toHaveBeenCalledWith(undefined, {
      skip: true
    });
  });

  test("should skip wishlist query if user role is ADMIN", () => {
    mockUseIsAuthSelector.mockReturnValue(true);
    mockUseUserRoleSelector.mockReturnValue(ROLES.ADMIN);

    renderHook(() => useWishlistWithAuthCheck());

    expect(mockUseGetUserWishlistQuery).toHaveBeenCalledWith(undefined, {
      skip: true
    });
  });

  test("should NOT skip wishlist query if user is authenticated and role is USER", () => {
    mockUseIsAuthSelector.mockReturnValue(true);
    mockUseUserRoleSelector.mockReturnValue(ROLES.USER);

    renderHook(() => useWishlistWithAuthCheck());

    expect(mockUseGetUserWishlistQuery).toHaveBeenCalledWith(undefined, {
      skip: false
    });
  });

  test("should NOT skip wishlist query if user is authenticated and role is undefined (guest?)", () => {
    mockUseIsAuthSelector.mockReturnValue(true);
    mockUseUserRoleSelector.mockReturnValue(undefined);

    renderHook(() => useWishlistWithAuthCheck());

    expect(mockUseGetUserWishlistQuery).toHaveBeenCalledWith(undefined, {
      skip: false
    });
  });
});
