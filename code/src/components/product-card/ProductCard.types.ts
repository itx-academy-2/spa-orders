import { Product } from "@/types/product.types";

export type ProductCardProps = {
  product: Product;
  isViewHistory?: boolean;
  wishlist?: Product[];
  reservedAt?: string;
};
