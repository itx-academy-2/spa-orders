import { renderHook } from "@testing-library/react";

import { BREAKPOINTS } from "@/constants/breakpoints";
import useProductsPageSize from "@/hooks/use-products-page-size/useProductsPageSize";

Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: BREAKPOINTS.xl
});

describe("Test useProductsPageSize hook", () => {
  test("Should return 4 for sales page", () => {
    const { result } = renderHook(() => useProductsPageSize("sales"));
    expect(result.current).toBe(4);
  });

  test("Should return 10 for other pages", () => {
    const { result } = renderHook(() => useProductsPageSize());
    expect(result.current).toBe(10);
  });
});
