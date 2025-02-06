import { Product } from "@/types/product.types";

type Align = "vertical" | "horizontal";

export type PriceLabelProps = Pick<Product, "price" | "priceWithDiscount"> & {
  align?: Align;
};
