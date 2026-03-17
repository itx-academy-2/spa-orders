import { Product, ReservationMetadata } from "@/types/product.types";

export type ProductsContainerProps = {
  products: Product[];
  isLoading?: boolean;
  loadingItemsCount?: number;
  className?: string;
  isError?: boolean;
  errorMessage?: string;
  maxColumns?: number;
  isViewHistory?: boolean;
  wishlist?: Product[];
  reservationsMetadata?: ReservationMetadata[];
};

export type HandleCartIconClickParam = Product & { isInCart: boolean };
