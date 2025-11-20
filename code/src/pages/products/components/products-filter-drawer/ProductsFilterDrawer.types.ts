export type ProductsResponse = {
  minProductPrice: number;
  maxProductPrice: number;
  isLoading?: boolean;
};

export type ProductsFilterDrawerProps = {
  closeFilterDrawer: () => void;
  activeFiltersCount: number;
  tabKey: string;
  productsResponse?: ProductsResponse;
};
