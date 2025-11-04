export type RangeFilter = { start: number; end: number };

export type ProductsPageFilters = {
  tags: Set<string>;
  price: RangeFilter;
};