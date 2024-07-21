import { renderHook } from "@testing-library/react";

import useGetCart from "@/hooks/use-get-cart/useGetCart";
import { useLazyGetCartItemsQuery } from "@/store/api/cartApi";
import { useLocalCartSelector } from "@/store/slices/localCart";
import {
  useIsAuthLoadingSelector,
  useUserDetailsSelector
} from "@/store/slices/userSlice";

jest.mock("@/store/api/cartApi");
jest.mock("@/store/slices/localCart");
jest.mock("@/store/slices/userSlice");

const mockFetchCart = jest.fn();

type ExtraParams = {
  user: { id: number } | null;
  isAuthLoading: boolean;
  isUninitialized: boolean;
  isLoading: boolean;
};

const defaultParams: ExtraParams = {
  user: null,
  isAuthLoading: false,
  isUninitialized: false,
  isLoading: false
};

const renderAndMock = (
  paramsFromArgs: Partial<ExtraParams> = defaultParams
) => {
  const params = { ...defaultParams, ...paramsFromArgs };

  (useLazyGetCartItemsQuery as jest.Mock).mockReturnValueOnce([
    mockFetchCart,
    { isUninitialized: params.isUninitialized, isLoading: params.isLoading }
  ]);
  (useLocalCartSelector as jest.Mock).mockReturnValueOnce({});
  (useIsAuthLoadingSelector as jest.Mock).mockReturnValueOnce(
    params.isAuthLoading
  );
  (useUserDetailsSelector as jest.Mock).mockReturnValueOnce(params.user);

  return renderHook(() => useGetCart());
};

describe("useGetCart", () => {
  describe("isLoading", () => {
    test("returns true if auth is loading", () => {
      const { result } = renderAndMock({ isAuthLoading: true });

      expect(result.current.isLoading).toBe(true);
    });

    test("returns true if request for getting cart items from server is loading", () => {
      const { result } = renderAndMock({ isLoading: true });

      expect(result.current.isLoading).toBe(true);
    });

    test("returns true if user is authorized and request is uninitialized", () => {
      const { result } = renderAndMock({
        isUninitialized: true,
        user: { id: 1 }
      });

      expect(result.current.isLoading).toBe(true);
    });

    test("returns false if user is authorized but request is not ununitialized", () => {
      const { result } = renderAndMock({ user: { id: 1 } });

      expect(result.current.isLoading).toBe(false);
    });

    test("returns false if user is unauthorized and request is ununitialized", () => {
      const { result } = renderAndMock({ isUninitialized: true });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("communicating with server", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("calls fetchCart when user is authorized", () => {
      renderAndMock({ user: { id: 1 } });
      expect(mockFetchCart).toHaveBeenCalledWith({ userId: 1 });
    });

    test("does not call fetchCart when user is unauthorized", () => {
      renderAndMock();
      expect(mockFetchCart).not.toHaveBeenCalled();
    });
  });
});
