import { fireEvent, screen } from "@testing-library/react";

import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";

import ProductsPage from "@/pages/products/ProductsPage";
import { useGetUserProductsQuery } from "@/store/api/productsApi";
import { PaginationParams, RTKQueryReturnState } from "@/types/common";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";

const mockProducts = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
  { id: 4, name: "Product 4", price: 400 },
  { id: 5, name: "Product 5", price: 100 },
  { id: 6, name: "Product 6", price: 200 },
  { id: 7, name: "Product 7", price: 300 },
  { id: 8, name: "Product 8", price: 400 }
];

const mockData = { content: mockProducts, totalPages: 2, totalElements: 8 };

jest.mock("@/containers/products-container/ProductsContainer", () => ({
  __esModule: true,
  default: ({ isLoading, isError, products }: ProductsContainerProps) => (
    <div data-testid="products-container">
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
  useGetUserProductsQuery: jest.fn()
}));

jest.mock("@/context/i18n/I18nProvider", () => ({
  ...jest.requireActual("@/context/i18n/I18nProvider"),
  useLocaleContext: jest.fn(() => ({ locale: "en" }))
}));

const size = setProductsPerPageSize(window.innerWidth);

const defaultQueryArguments = {
  size,
  page: 0,
  sort: undefined,
  lang: "en",
  tags: ""
};

type TestQueryArguments = PaginationParams & {
  tags: string;
};

const testQueryArguments = (args: Partial<TestQueryArguments> = {}) => {
  expect(useGetUserProductsQuery).toHaveBeenCalledWith({
    ...defaultQueryArguments,
    ...args
  });
};

const mockDelete = jest.fn();
jest
  .spyOn(URLSearchParams.prototype, "delete")
  .mockImplementationOnce(mockDelete);

const renderAndMock = (
  {
    entries = "",
    mockResponse = {}
  }: {
    entries?: string;
    mockResponse?: Partial<RTKQueryReturnState<Partial<typeof mockData>>>;
  } = { entries: "", mockResponse: {} }
) => {
  (useGetUserProductsQuery as jest.Mock).mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: true,
    error: null,
    ...mockResponse,
    data:
      "data" in mockResponse && !mockResponse.data
        ? mockResponse.data
        : { ...mockData, ...mockResponse.data }
  });

  return renderWithProviders(<ProductsPage />, { initialEntries: [entries] });
};

describe("ProductsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the product count correctly", () => {
    renderAndMock();

    const productsCountElement = screen.getByText(
      `productsItems.label/count:${mockProducts.length}`
    );

    expect(productsCountElement).toBeInTheDocument();
  });

  test("Should apply selected sort criteria", () => {
    renderAndMock();

    const dropdownElement = screen.getByText(/sortBy.label/);
    fireEvent.click(dropdownElement);

    const dropdownItemElement = screen.getByText(/sortOptions.newest/);
    fireEvent.click(dropdownItemElement);

    testQueryArguments({ sort: "product.createdAt,desc" });
    expect(mockDelete).not.toHaveBeenCalled();

    fireEvent.click(dropdownElement);

    const defaultOptionElement = screen.getByText(/productsDefault.label/);
    fireEvent.click(defaultOptionElement);

    testQueryArguments();
    expect(mockDelete).toHaveBeenCalled();
  });

  test("Should give substracted page", () => {
    renderAndMock({ entries: "?page=3" });

    testQueryArguments({ page: 2 });
  });

  test("Should give category type correctly", () => {
    renderAndMock({ entries: "?category=computers" });

    testQueryArguments({ tags: `category:computers` });

    const labelByCategory = screen.getByText("productsAll.computers");
    expect(labelByCategory).toBeInTheDocument();

    const categoryAllLabel = screen.queryByText("productsAll.label");
    expect(categoryAllLabel).not.toBeInTheDocument();
  });

  test("Should give default parameters if no params were provided", () => {
    renderAndMock();

    testQueryArguments();
  });

  test("Should query 0 page if page search query is invalid", () => {
    renderAndMock({ entries: "?page=ah" });

    testQueryArguments({ page: 0 });
  });

  test("Should not render pagination if there is only one page", () => {
    renderAndMock({
      mockResponse: {
        data: { totalPages: 1 }
      }
    });

    const linkElements = screen.getAllByRole("link");

    expect(linkElements.length).toBe(mockProducts.length);
  });

  test("Should apply default values for pageCount and productsCount if data is undefined", () => {
    renderAndMock({
      mockResponse: {
        data: undefined
      }
    });

    const productsCount = screen.getByText("productsItems.label/count:0");
    const linksElemnts = screen.queryAllByRole("link");

    expect(productsCount).toBeInTheDocument();
    expect(linksElemnts.length).toBe(0);
  });
});
