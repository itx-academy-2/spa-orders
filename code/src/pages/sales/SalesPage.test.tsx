import { screen } from "@testing-library/react";

import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";

import SalesPage from "@/pages/sales/SalesPage";
import { useGetSalesProductsQuery } from "@/store/api/productsApi";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockSales = [
  { id: 1, name: "Sale Product 1", price: 50 },
  { id: 2, name: "Sale Product 2", price: 100 },
  { id: 3, name: "Sale Product 3", price: 150 }
];

const mockData = { content: mockSales, totalElements: 3, totalPages: 1 };

type MockResponseType = {
  isLoading?: boolean;
  isError?: boolean;
  data?: typeof mockData | null;
};

jest.mock("@/containers/products-container/ProductsContainer", () => ({
  __esModule: true,
  default: ({ isLoading, isError, products }: ProductsContainerProps) => (
    <div data-testid="sales-container">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error!</div>}
      {products.length > 0 &&
        products.map((product) => (
          <a key={product.id} role="link">
            {product.name} - ${product.price}
          </a>
        ))}
    </div>
  )
}));

jest.mock("@/store/api/productsApi", () => ({
  useGetSalesProductsQuery: jest.fn()
}));

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: jest.fn(() => ({ locale: "en" }))
}));

const renderAndMock = (mockResponse: MockResponseType = {}) => {
  (useGetSalesProductsQuery as jest.Mock).mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: true,
    error: null,
    data: mockResponse.data ?? mockData,
    ...mockResponse
  });

  return renderWithProviders(<SalesPage />);
};

describe("SalesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the sales count correctly when data is available", () => {
    renderAndMock();
    const salesCountElement = screen.getByText(
      `salesPage.label/count:${mockSales.length}`
    );
    expect(salesCountElement).toBeInTheDocument();
  });

  test("renders the sales count as 0 when data is undefined", () => {
    renderAndMock({ data: undefined });
    const salesCount = screen.getByText("salesPage.label/count:0");
    expect(salesCount).toBeInTheDocument();
  });

  test("renders the sales count as 0 when content is empty", () => {
    renderAndMock({ data: { content: [], totalElements: 0, totalPages: 1 } });
    const salesCount = screen.getByText("salesPage.label/count:0");
    expect(salesCount).toBeInTheDocument();
  });

  test("displays loading state correctly", () => {
    renderAndMock({ isLoading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error state correctly", () => {
    renderAndMock({ isError: true });
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  test("renders sales products correctly", () => {
    renderAndMock();
    mockSales.forEach((product) => {
      expect(
        screen.getByText(`${product.name} - $${product.price}`)
      ).toBeInTheDocument();
    });
  });

  test("Should not render pagination block if there is one total page", () => {
    renderAndMock();

    const paginationBlock = screen.queryByTestId("pagination-block");

    expect(paginationBlock).not.toBeInTheDocument();
  });

  test("Should render pagination block if there are more than one total pages", () => {
    renderAndMock({ data: { ...mockData, totalPages: 3 } });

    const paginationBlock = screen.getByTestId("pagination-block");

    expect(paginationBlock).toBeInTheDocument();
  });
});
