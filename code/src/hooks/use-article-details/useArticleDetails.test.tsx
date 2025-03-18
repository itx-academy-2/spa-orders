import { renderHook } from "@testing-library/react";

import { useArticleDetails } from "@/hooks/use-article-details/useArticleDetails";
import { useGetArticleByIdQuery } from "@/store/api/articlesApi";

jest.mock("@/store/api/articlesApi", () => ({
  useGetArticleByIdQuery: jest.fn()
}));

describe("useArticleDetails Hook", () => {
  const mockUseGetArticleByIdQuery =
    useGetArticleByIdQuery as jest.MockedFunction<
      typeof useGetArticleByIdQuery
    >;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 'No content available' when isExpanded = false (skip=true)", () => {
    mockUseGetArticleByIdQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
      refetch: jest.fn()
    } as ReturnType<typeof useGetArticleByIdQuery>);

    const { result } = renderHook(() => useArticleDetails(123, "en", false));

    expect(result.current.description).toBe("No content available");
  });

  test("should return 'Loading...' when isExpanded = true and isFetching = true", () => {
    mockUseGetArticleByIdQuery.mockReturnValue({
      isFetching: true,
      refetch: jest.fn()
    } as ReturnType<typeof useGetArticleByIdQuery>);

    const { result } = renderHook(() => useArticleDetails(123, "en", true));

    expect(result.current.description).toBe("Loading...");
  });

  test("should return the data.content if present and isExpanded = true", () => {
    mockUseGetArticleByIdQuery.mockReturnValue({
      data: { content: "Test content" },
      isFetching: false,
      refetch: jest.fn()
    } as ReturnType<typeof useGetArticleByIdQuery>);

    const { result } = renderHook(() => useArticleDetails(456, "ua", true));

    expect(result.current.description).toBe("Test content");
  });

  test("should return 'No content available' if data is empty and not fetching", () => {
    mockUseGetArticleByIdQuery.mockReturnValue({
      data: {},
      isFetching: false,
      refetch: jest.fn()
    } as ReturnType<typeof useGetArticleByIdQuery>);

    const { result } = renderHook(() => useArticleDetails(789, "ua", true));

    expect(result.current.description).toBe("No content available");
  });
});
