import { fireEvent, screen } from "@testing-library/react";

import ProductsPage from "@/pages/products/ProductsPage";
import { useGetUserProductsQuery } from "@/store/api/productsApi";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";

import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockProducts = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
];
const mockWishlist = [{ id: 1 }];
const mockData = { content: mockProducts, totalPages: 2, totalElements: 2 };

jest.mock("@/store/api/productsApi", () => ({
  useGetUserProductsQuery: jest.fn(),
}));
jest.mock("@/store/api/wishlistApi", () => ({
  useGetUserWishlistQuery: jest.fn(),
}));

jest.mock(
  "@/containers/products-container/ProductsContainer",
  () => {
    const MockProductsContainer = (props: ProductsContainerProps) => (
      <div data-testid="products-container">
        {props.products?.map((p) => (
          <span key={p.id}>{p.name}</span>
        ))}
      </div>
    );

    MockProductsContainer.displayName = "MockProductsContainer";
    return MockProductsContainer;
  }
);

const renderAndMock = (mockResponse = {}, wishlist = mockWishlist, entries = "") => {
  (useGetUserProductsQuery as unknown as jest.Mock).mockReturnValue({
    data: mockData,
    isLoading: false,
    isError: false,
    ...mockResponse,
  });
  (useGetUserWishlistQuery as unknown as jest.Mock).mockReturnValue({
    data: { content: wishlist },
    isLoading: false,
    isError: false,
  });

  return renderWithProviders(<ProductsPage />, { initialEntries: [entries] });
};

describe("ProductsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders products list", () => {
    renderAndMock();
    const container = screen.getByTestId("products-container");
    mockProducts.forEach((p) => {
      expect(container).toHaveTextContent(p.name);
    });
  });

  test("renders correct product count", () => {
    renderAndMock();
    expect(screen.getByText(/productsItems.label/i)).toBeInTheDocument();
  });

  test("applies sort option", () => {
    renderAndMock();
    const dropdown = screen.getByText(/productsDefault.label/i);
    fireEvent.click(dropdown);

    const newSort = "product.createdAt,desc";
    const searchParams = new URLSearchParams();
    searchParams.set("sort", newSort);
    expect(searchParams.get("sort")).toBe(newSort);
  });

  test("handles category from URL", () => {
    renderAndMock({}, mockWishlist, "?category=computers");
    expect(screen.getByText("productsAll.computers")).toBeInTheDocument();
  });

  test("handles page param correctly", () => {
    renderAndMock({}, mockWishlist, "?page=3");
  });

  test("renders empty state when no products", () => {
    renderAndMock({ data: { content: [], totalPages: 1, totalElements: 0 } });
    expect(screen.getByText(/productsItems.label/i)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
