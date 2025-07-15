import { renderHook, act } from "@testing-library/react";
import { useSearchParams } from "react-router-dom";

import useToggleFavorite from "@/hooks/use-toggle-favorite/useToggleFavorite";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserWishlistQuery,
} from "@/store/api/wishlistApi";

jest.mock("@/store/api/wishlistApi", () => ({
  useGetUserWishlistQuery: jest.fn(),
  useAddToWishlistMutation: jest.fn(),
  useRemoveFromWishlistMutation: jest.fn(),
}));

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: () => ({ locale: "en" }),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useSearchParams: jest.fn(),
  };
});

const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUseGetUserWishlistQuery = useGetUserWishlistQuery as jest.Mock;
const mockAddToWishlist = jest.fn();
const mockRemoveFromWishlist = jest.fn();

describe("useToggleFavorite", () => {
  beforeEach(() => {
    const params = new URLSearchParams();
    params.set("sort", "bestsellers,desc");

    mockUseSearchParams.mockReturnValue([params]);

    (useAddToWishlistMutation as jest.Mock).mockReturnValue([mockAddToWishlist]);
    (useRemoveFromWishlistMutation as jest.Mock).mockReturnValue([
      mockRemoveFromWishlist,
    ]);

    jest.clearAllMocks();
  });

  const mockWishlist = [
    { id: "1", name: "Phone 1" },
    { id: "2", name: "Phone 2" },
  ];

  test("should return wishlist and flags correctly", () => {
    mockUseGetUserWishlistQuery.mockReturnValue({
      data: { content: mockWishlist },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    expect(result.current.wishlist).toEqual(mockWishlist);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  test("isFavorite returns true for existing product", () => {
    mockUseGetUserWishlistQuery.mockReturnValue({
      data: { content: mockWishlist },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    expect(result.current.isFavorite("1")).toBe(true);
    expect(result.current.isFavorite("999")).toBe(false);
  });

  test("toggle calls removeFromWishlist if product is favorite", () => {
    mockUseGetUserWishlistQuery.mockReturnValue({
      data: { content: mockWishlist },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    act(() => {
      result.current.toggle("2");
    });

    expect(mockRemoveFromWishlist).toHaveBeenCalledWith("2");
    expect(mockAddToWishlist).not.toHaveBeenCalled();
  });

  test("toggle calls addToWishlist if product is not favorite", () => {
    mockUseGetUserWishlistQuery.mockReturnValue({
      data: { content: mockWishlist },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    act(() => {
      result.current.toggle("5");
    });

    expect(mockAddToWishlist).toHaveBeenCalledWith("5");
    expect(mockRemoveFromWishlist).not.toHaveBeenCalled();
  });

  test("works correctly with empty wishlist", () => {
    mockUseGetUserWishlistQuery.mockReturnValue({
      data: { content: [] },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    expect(result.current.isFavorite("abc")).toBe(false);

    act(() => {
      result.current.toggle("abc");
    });

    expect(mockAddToWishlist).toHaveBeenCalledWith("abc");
  });

  test("calls useGetUserWishlistQuery with correct params", () => {
    mockUseGetUserWishlistQuery.mockReturnValue({
      data: { content: [] },
      isLoading: false,
      isError: false,
    });

    renderHook(() => useToggleFavorite());

    expect(mockUseGetUserWishlistQuery).toHaveBeenCalledWith({
      lang: "en",
      sort: "bestsellers,desc",
    });
  });
});
