import { ProductFilterParams } from "@/types/product.types";

export type FilterSection = {
  name: string;
  keys: (keyof ProductFilterParams)[];
};

export const filterSections: FilterSection[] = [
  { name: "categories", keys: ["tags"] },
  { name: "discount", keys: ["discount", "nonDiscount"] },
  { name: "price", keys: ["priceMin", "priceMax"] },
  { name: "availability", keys: ["availability", "nonAvailability"] },
];