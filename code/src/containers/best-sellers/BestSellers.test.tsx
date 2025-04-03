import { screen } from "@testing-library/react";

import BestSellers from "@/containers/best-sellers/BestSellers";

import { useGetBestsellerProductsQuery } from "@/store/api/productsApi";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

import { ProductsContainerProps } from "../products-container/ProductsContainer.types";

jest.mock("@/store/api/productsApi", () => ({
  useGetBestsellerProductsQuery: jest.fn()
}));

const mockProductsResponse = {
  content: [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" }
  ]
};

jest.mock(
  "@/containers/best-sellers/components/bestseller-container/BestSellerContainer",
  () => ({
    __esModule: true,
    default: ({ isLoading, isError, products }: ProductsContainerProps) => (
      <div data-testid="products-container">
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error!</div>}
        {products.length > 0 && <div>Products List</div>}
      </div>
    )
  })
);

const renderAndMock = (
  mockData: Partial<ReturnType<typeof useGetBestsellerProductsQuery>> = {}
) => {
  (useGetBestsellerProductsQuery as jest.Mock).mockReturnValue({
    data: mockData.data || null,
    isLoading: mockData.isLoading || false,
    isError: mockData.isError || false
  });

  renderWithProviders(<BestSellers />);
};

describe("BestSellers", () => {
  test("Should render bestSellers header", () => {
    renderAndMock();

    const bestSellersHeader = screen.getByText(/bestSellers.header/i);

    expect(bestSellersHeader).toBeInTheDocument();
  });

  test("should pass the correct size to the query and render ProductsContainer with correct props", () => {
    renderAndMock({ data: mockProductsResponse });

    expect(useGetBestsellerProductsQuery).toHaveBeenCalledWith({
      page: 0,
      size: 5,
      lang: "en",
      tags: ""
    });
    const bestSellerContainer = screen.getByTestId("products-container");
    expect(bestSellerContainer).toBeInTheDocument();

    const productsList = screen.getByText("Products List");
    expect(productsList).toBeInTheDocument();
  });

  test("should render loading state", () => {
    renderAndMock({ isLoading: true });
    const loading = screen.getByText("Loading...");
    expect(loading).toBeInTheDocument();
  });

  test("should render error state", () => {
    renderAndMock({ isError: true });
    const error = screen.getByText("Error!");
    expect(error).toBeInTheDocument();
  });

  test("should render the button with correct props", () => {
    renderAndMock();

    const button = screen.getByRole("link", { name: /bestSellers.button/i });
    expect(button).toHaveAttribute(
      "href",
      "/products?sort=percentageOfTotalOrders,desc"
    );
  });
});
