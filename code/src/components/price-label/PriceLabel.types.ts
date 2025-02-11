import {
  AppFontWeightVariant,
  AppTypographyVariant
} from "@/components/app-typography/AppTypography.types";

import { Product } from "@/types/product.types";

type Align = "vertical" | "horizontal";

export type PriceLabelProps = Pick<Product, "price" | "priceWithDiscount"> & {
  align?: Align;
  className?: string;
  originalPriceSize?: AppTypographyVariant;
  originalPriceWeight?: AppFontWeightVariant;
  discountedPriceSize?: AppTypographyVariant;
  discountedPriceWeight?: AppFontWeightVariant;
};
