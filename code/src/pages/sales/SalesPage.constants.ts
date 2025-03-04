import { SalesPageFilters } from "./SalesPage.types";

export const defaultSalesPageFilters: SalesPageFilters = {
  tags: new Set(["category:computer", "category:mobile", "category:tablet"]),
  discountPercentage: { start: 0, end: 100 },
  priceWithDiscount: { start: 0, end: 100 }
};

export const categoryProbableFilters = [
  {
    id: "category:computer",
    translationKey: "productsAll.computer"
  },
  {
    id: "category:mobile",
    translationKey: "productsAll.mobile"
  },
  {
    id: "category:tablet",
    translationKey: "productsAll.tablet"
  }
];
