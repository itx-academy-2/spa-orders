import { ProductFilterParams } from "@/types/product.types";

export type CategoriesProps = {
  tabKey: string;
  draftTags?: string[];
};

export type DiscountProps = {
  tabKey: string;
  draft: ProductFilterParams
};

export type PriceProps = {
  tabKey: string;
  min: number;
  max: number;
};

export type AvailabilityProps = {
  tabKey: string;
  draft: ProductFilterParams
};

export type DeliveryProps = {
  tabKey: string;
  draft: ProductFilterParams
};
