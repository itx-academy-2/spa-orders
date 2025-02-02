import { screen } from "@testing-library/react";

import { mockProducts } from "@/containers/products-container/ProductContainer.constants";
import ProductsContainer from "@/containers/products-container/ProductsContainer";
import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";

import { ProductCardProps } from "@/components/product-card/ProductCard.types";

import useGetCart from "@/hooks/use-get-cart/useGetCart";
import { Product } from "@/types/product.types";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockOpenDrawer = jest.fn();

jest.mock("@/store/slices/userSlice", () => ({
  useIsAuthLoadingSelector: jest.fn(() => false)
}));

jest.mock("@/hooks/use-get-cart/useGetCart");

jest.mock("@/context/drawer/DrawerContext", () => ({
  ...jest.requireActual("@/context/drawer/DrawerContext"),
  useDrawerContext: jest.fn(() => ({ openDrawer: mockOpenDrawer }))
}));

jest.mock("@/components/product-card/ProductCard", () => ({
  __esModule: true,
  default: ({ product }: ProductCardProps) => (
    <div data-testid="product-card">{product.name}</div>
  )
}));

jest.mock("@/components/product-sale-card/SaleProductCard", () => ({
  __esModule: true,
  default: ({ product }: { product: Product }) => (
    <div data-testid="sale-product-card">{product.name}</div>
  )
}));

type CartItem = {
  productId: string;
  name: string;
};

const mockCartItem = (items: CartItem[]) => {
  (useGetCart as jest.Mock).mockReturnValue({
    data: {
      items
    },
    isLoading: false,
    isFetching: false
  });
};

type RenderProductsContainer = ProductsContainerProps & {
  items: CartItem[];
};

const renderProductsContainer = ({
  items = [],
  ...extraProps
}: Partial<RenderProductsContainer> = {}) => {
  mockCartItem(items);
  return renderWithProviders(
    <ProductsContainer products={mockProducts.slice(0, 10)} {...extraProps} />
  );
};

describe("Test ProductsContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should render 10 products", () => {
    renderProductsContainer();

    const productsElements = screen.getAllByTestId("product-card");
    expect(productsElements.length).toBe(10);
  });

  test("Should render correct amount of skeletons", () => {
    const { container } = renderProductsContainer({
      isLoading: true,
      loadingItemsCount: 10,
      products: []
    });

    const possibleProduct = screen.queryByTestId("product-card");
    expect(possibleProduct).not.toBeInTheDocument();

    const skeletons = container.getElementsByClassName("spa-product-skeleton");
    expect(skeletons.length).toBe(10);
  });

  test("Should accept and set className", () => {
    const { container } = renderProductsContainer({ className: "products" });

    const gridContainer = container.getElementsByClassName("products")[0];

    expect(gridContainer).toBeInTheDocument();
  });

  test("Should render error", () => {
    renderProductsContainer({ isError: true });

    const errorElement = screen.getByText("errors.somethingWentWrong");

    expect(errorElement).toBeInTheDocument();
  });

  test("Should render custom passed error", () => {
    renderProductsContainer({ isError: true, errorMessage: "error" });

    const errorElement = screen.getByText("error");

    expect(errorElement).toBeInTheDocument();
  });

  test("Should render SaleProductCard when product has a discount", () => {
    const discountedProduct = {
      ...mockProducts[0],
      priceWithDiscount: 299,
      discount: 20
    };

    renderProductsContainer({ products: [discountedProduct] });

    const saleProductElement = screen.getByTestId("sale-product-card");
    expect(saleProductElement).toBeInTheDocument();

    const productElement = screen.queryByTestId("product-card");
    expect(productElement).not.toBeInTheDocument();
  });

  test("Should render ProductCard when product has no discount", () => {
    const nonDiscountedProduct = {
      ...mockProducts[0],
      priceWithDiscount: undefined,
      discount: undefined
    };

    renderProductsContainer({ products: [nonDiscountedProduct] });

    const productElement = screen.getByTestId("product-card");

    expect(productElement).toBeInTheDocument();

    const saleProductElement = screen.queryByTestId("sale-product-card");

    expect(saleProductElement).not.toBeInTheDocument();
  });

  test("Should render different amount of columns based on passed maxColumns", () => {
    renderProductsContainer({ maxColumns: 4 });

    const gridElement = screen.getByTestId("products-container");

    expect(gridElement).toHaveClass("products-container__4-cols");
  });
});
