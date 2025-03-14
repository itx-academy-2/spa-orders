import { screen } from "@testing-library/react";

import { mockProducts } from "@/containers/products-container/ProductContainer.constants";
import { ProductsContainerProps } from "@/containers/products-container/ProductsContainer.types";

import { ProductCardProps } from "@/components/product-card/ProductCard.types";

import useGetCart from "@/hooks/use-get-cart/useGetCart";
import { Product } from "@/types/product.types";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

import BestSellerContainer from "./BestSellerContainer";

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

jest.mock("@/components/bestseller-card/BestSellerCard", () => ({
  __esModule: true,
  default: ({ product }: { product: Product }) => (
    <div data-testid="bestseller-card">{product.name}</div>
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
    <BestSellerContainer products={mockProducts.slice(0, 10)} {...extraProps} />
  );
};

describe("BestSellerContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should render 10 best seller products", () => {
    renderProductsContainer();

    const productsElements = screen.getAllByTestId("bestseller-card");
    expect(productsElements.length).toBe(10);
  });

  test("Should render correct amount of skeletons", () => {
    const { container } = renderProductsContainer({
      isLoading: true,
      loadingItemsCount: 10,
      products: []
    });

    const possibleProduct = screen.queryByTestId("bestseller-card");
    expect(possibleProduct).not.toBeInTheDocument();

    const skeletons = container.getElementsByClassName("spa-product-skeleton");
    expect(skeletons.length).toBe(10);
  });

  test("Should accept and set className", () => {
    const { container } = renderProductsContainer({ className: "bestsellers" });

    const gridContainer = container.getElementsByClassName("bestsellers")[0];
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

  test("Should render different amount of columns based on passed maxColumns", () => {
    renderProductsContainer({ maxColumns: 4 });

    const gridElement = screen.getByTestId("products-container");
    expect(gridElement).toHaveClass("products-container__4-cols");
  });
});
