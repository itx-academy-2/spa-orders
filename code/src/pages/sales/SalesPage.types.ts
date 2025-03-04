export interface SalesPageFilters {
  tags: Set<string>;
  priceWithDiscount: { start: number; end: number };
  discountPercentage: { start: number; end: number };
}
