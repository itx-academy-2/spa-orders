import { renderHook, act } from "@testing-library/react";

import useToggleFavorite from "@/hooks/use-toggle-favorite/useToggleFavorite";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation
} from "@/store/api/wishlistApi";
import { Product } from "@/types/product.types";

jest.mock("@/store/api/wishlistApi", () => ({
  useAddToWishlistMutation: jest.fn(),
  useRemoveFromWishlistMutation: jest.fn()
}));

const mockAddToWishlist = jest.fn();
const mockRemoveFromWishlist = jest.fn();

const mockProduct: Product = {
  id: "123",
  name: "Mobile Phone Samsung Galaxy A55 5G 8/256GB Lilac",
  description:
    'Screen: 6.6" Super AMOLED, 2340x1080 / Samsung Exynos 1480 (4 x 2.75 GHz + 4 x 2.0 GHz) / Main Triple Camera: 50 MP + 12 MP + 5 MP, Front Camera: 32 MP / RAM 8 GB / 256 GB internal storage + microSD (up to 1 TB) / 3G / LTE / 5G / GPS / A-GPS / GLONASS / BDS / Dual SIM support (Nano-SIM) / Android 14 / 5000 mAh',
  status: "AVAILABLE",
  tags: ["category:mobile"],
  image:
    "https://j65jb0fdkxuua0go.public.blob.vercel-storage.com/phone_2-tTDYhyoyqsEkwPzySFdXflYCe7TkUb.jpg",
  price: 500
};

describe("useToggleFavorite", () => {
  beforeEach(() => {
    (useAddToWishlistMutation as jest.Mock).mockReturnValue([mockAddToWishlist]);
    (useRemoveFromWishlistMutation as jest.Mock).mockReturnValue([mockRemoveFromWishlist]);
    jest.clearAllMocks();
  });

  const mockWishlist = [
    { ...mockProduct, id: "1", name: "Product 1" },
    { ...mockProduct, id: "2", name: "Product 2" }
  ];

  test("isFavorite returns true for existing product", () => {
    const { result } = renderHook(() => useToggleFavorite(mockWishlist));

    expect(result.current.isFavorite("1")).toBe(true);
    expect(result.current.isFavorite("999")).toBe(false);
  });

  test("toggle calls removeFromWishlist if product is favorite", async () => {
    const { result } = renderHook(() => useToggleFavorite(mockWishlist));

    act(() => {
      result.current.toggle("1");
    });

    expect(mockRemoveFromWishlist).toHaveBeenCalledWith("1");
    expect(mockAddToWishlist).not.toHaveBeenCalled();
  });

  test("toggle calls addToWishlist if product is not favorite", async () => {
    const { result } = renderHook(() => useToggleFavorite(mockWishlist));

    act(() => {
      result.current.toggle("3");
    });

    expect(mockAddToWishlist).toHaveBeenCalledWith("3");
    expect(mockRemoveFromWishlist).not.toHaveBeenCalled();
  });

  test("handles empty wishlist correctly", async () => {
    const { result } = renderHook(() => useToggleFavorite([]));

    expect(result.current.isFavorite("abc")).toBe(false);

    act(() => {
      result.current.toggle("abc");
    });

    expect(mockAddToWishlist).toHaveBeenCalledWith("abc");
  });
});
