import { renderHook, act } from "@testing-library/react";
import { useSearchParams } from "react-router-dom";

import useToggleFavorite from "@/hooks/use-toggle-favorite/useToggleFavorite";
import {
  useAddWishlistMutation,
  useRemoveWishlistMutation,
  useGetWishlistQuery,
} from "@/store/api/wishlistApi";

jest.mock("@/store/api/wishlistApi", () => ({
  useGetWishlistQuery: jest.fn(),
  useAddWishlistMutation: jest.fn(),
  useRemoveWishlistMutation: jest.fn(),
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
const mockUseGetWishlistQuery = useGetWishlistQuery as jest.Mock;
const mockAddWishlist = jest.fn();
const mockRemoveWishlist = jest.fn();

describe("useToggleFavorite", () => {
  beforeEach(() => {
    const params = new URLSearchParams();
    params.set("sort", "bestsellers,desc");

    mockUseSearchParams.mockReturnValue([params]);

    (useAddWishlistMutation as jest.Mock).mockReturnValue([mockAddWishlist]);
    (useRemoveWishlistMutation as jest.Mock).mockReturnValue([
      mockRemoveWishlist,
    ]);

    jest.clearAllMocks();
  });

  const mockWishlist = [
    { id: "1", name: "Phone 1" },
    { id: "2", name: "Phone 2" },
  ];

  test("should return wishlist and flags correctly", () => {
    mockUseGetWishlistQuery.mockReturnValue({
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
    mockUseGetWishlistQuery.mockReturnValue({
      data: { content: mockWishlist },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    expect(result.current.isFavorite("1")).toBe(true);
    expect(result.current.isFavorite("999")).toBe(false);
  });

  test("toggle calls removeWishlist if product is favorite", () => {
    mockUseGetWishlistQuery.mockReturnValue({
      data: { content: mockWishlist },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    act(() => {
      result.current.toggle("2");
    });

    expect(mockRemoveWishlist).toHaveBeenCalledWith("2");
    expect(mockAddWishlist).not.toHaveBeenCalled();
  });

  test("toggle calls addWishlist if product is not favorite", () => {
    mockUseGetWishlistQuery.mockReturnValue({
      data: { content: mockWishlist },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    act(() => {
      result.current.toggle("5");
    });

    expect(mockAddWishlist).toHaveBeenCalledWith("5");
    expect(mockRemoveWishlist).not.toHaveBeenCalled();
  });

  test("works correctly with empty wishlist", () => {
    mockUseGetWishlistQuery.mockReturnValue({
      data: { content: [] },
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => useToggleFavorite());

    expect(result.current.isFavorite("abc")).toBe(false);

    act(() => {
      result.current.toggle("abc");
    });

    expect(mockAddWishlist).toHaveBeenCalledWith("abc");
  });

  test("calls useGetWishlistQuery with correct params", () => {
    mockUseGetWishlistQuery.mockReturnValue({
      data: { content: [] },
      isLoading: false,
      isError: false,
    });

    renderHook(() => useToggleFavorite());

    expect(mockUseGetWishlistQuery).toHaveBeenCalledWith({
      lang: "en",
      sort: "bestsellers,desc",
    });
  });
});
