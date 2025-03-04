import { fireEvent, screen } from "@testing-library/react";

import usePagination from "@/hooks/use-pagination/usePagination";
import SalesPage from "@/pages/sales/SalesPage";
import useSalesFilter from "@/pages/sales/hooks/useSalesFilter";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

jest.mock("@/pages/sales/SalesPage.constants", () => ({
  sortSaleOptions: [
    { label: "Newest", value: "sale.createdAt,desc" },
    { label: "Oldest", value: "" }
  ]
}));

jest.mock("@/pages/sales/hooks/useSalesFilter", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock(
  "@/pages/sales/components/sales-filter-drawer/SalesFilterDrawer",
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="sales-filter-drawer">Sales Filter Drawer</div>
    )
  })
);

jest.mock("@/containers/products-container/ProductsContainer", () => ({
  __esModule: true,
  default: ({
    isLoading,
    isError,
    products
  }: {
    isLoading: boolean;
    isError: boolean;
    products: { id: number; name: string; price: number }[] | null;
  }) => (
    <div data-testid="sales-container">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error!</div>}
      {products && products.length > 0
        ? products.map(
            (product: { id: number; name: string; price: number }) => (
              <a key={product.id} role="link">
                {product.name} - ${product.price}
              </a>
            )
          )
        : null}
    </div>
  )
}));

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: jest.fn(() => ({ locale: "en" }))
}));

jest.mock("@/hooks/use-pagination/usePagination", () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock("@/pages/sales/hooks/useSalesFilter", () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockSet = jest.fn();
const mockDelete = jest.fn();

const mockUsePagination = usePagination as jest.MockedFunction<
  typeof usePagination
>;
const mockSales = [
  { id: 1, name: "Sale Product 1", price: 50 },
  { id: 2, name: "Sale Product 2", price: 100 },
  { id: 3, name: "Sale Product 3", price: 150 }
];

const renderAndMock = (mockResponse = {}) => {
  (useSalesFilter as jest.Mock).mockReturnValue({
    sales: mockSales,
    totalPages: 3,
    activeFiltersCount: 0,
    filterActions: {},
    filters: {},
    defaultFilters: {},
    totalElements: mockSales.length,
    isLoading: false,
    isError: false,
    ...mockResponse
  });
  return renderWithProviders(<SalesPage />);
};

describe("SalesPage", () => {
  beforeAll(() => {
    jest.spyOn(URLSearchParams.prototype, "set").mockImplementation(mockSet);
    jest
      .spyOn(URLSearchParams.prototype, "delete")
      .mockImplementation(mockDelete);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePagination.mockReturnValue({ page: 1, setPage: jest.fn() });
  });

  test("renders the sales count correctly when data is available", () => {
    renderAndMock();
    const salesCountElement = screen.getByText(/salesPage\.label/i);
    expect(salesCountElement).toHaveTextContent("3");
  });

  test("renders the sales count as 0 when data is undefined", () => {
    renderAndMock({ totalElements: 0, products: [] });
    const salesCount = screen.getByText(/salesPage\.label/i);
    expect(salesCount).toHaveTextContent("0");
  });

  test("renders the sales count as 0 when content is empty", () => {
    renderAndMock({ totalElements: 0, products: [] });
    const salesCount = screen.getByText(/salesPage\.label/i);
    expect(salesCount).toHaveTextContent("0");
  });

  test("displays loading state correctly", () => {
    renderAndMock({ isLoading: true, products: [] });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error state correctly", () => {
    renderAndMock({ isError: true, products: [] });
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  test("should not render pagination block if there is one total page", () => {
    renderAndMock({ totalPages: 1 });
    const paginationBlock = screen.queryByTestId("pagination-block");
    expect(paginationBlock).not.toBeInTheDocument();
  });

  test("should render pagination block if there are more than one total pages", () => {
    renderAndMock({ totalPages: 3 });
    const paginationBlock = screen.getByTestId("pagination-block");
    expect(paginationBlock).toBeInTheDocument();
  });
});

describe("SalesPage handleSortChange", () => {
  beforeAll(() => {
    jest.spyOn(URLSearchParams.prototype, "set").mockImplementation(mockSet);
    jest
      .spyOn(URLSearchParams.prototype, "delete")
      .mockImplementation(mockDelete);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePagination.mockReturnValue({ page: 1, setPage: jest.fn() });
  });

  test("should set the sort parameter when a sort option is selected", () => {
    renderAndMock();
    const dropdown = screen.getByText("Sort");
    fireEvent.click(dropdown);
    const sortOption = screen.getByText("Newest");
    fireEvent.click(sortOption);
    expect(mockSet).toHaveBeenCalledWith("sort", "sale.createdAt,desc");
  });

  test("should delete the sort parameter when the default sort is selected", () => {
    renderAndMock();
    const dropdown = screen.getByText("Sort");
    fireEvent.click(dropdown);
    const defaultOption = screen.getByText("Oldest");
    fireEvent.click(defaultOption);
    expect(mockDelete).toHaveBeenCalledWith("sort");
  });
});

describe("SalesPage page > totalPages logic", () => {
  beforeAll(() => {
    jest.spyOn(URLSearchParams.prototype, "set").mockImplementation(mockSet);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sets the 'page' search param to totalPages when page > totalPages", () => {
    mockUsePagination.mockReturnValue({ page: 5, setPage: jest.fn() });
    renderAndMock({
      totalPages: 3,
      products: mockSales,
      totalElements: 3
    });
    expect(mockSet).toHaveBeenCalledWith("page", "3");
  });

  test("does NOT set the 'page' search param when page <= totalPages", () => {
    mockUsePagination.mockReturnValue({ page: 1, setPage: jest.fn() });
    renderAndMock({
      totalPages: 3,
      products: mockSales,
      totalElements: 3
    });
    expect(mockSet).not.toHaveBeenCalledWith("page", "3");
  });

  test("does nothing if salesResponse is undefined", () => {
    mockUsePagination.mockReturnValue({ page: 5, setPage: jest.fn() });
    renderAndMock({ totalElements: 0, products: undefined, totalPages: 0 });
    expect(mockSet).not.toHaveBeenCalled();
  });
});
