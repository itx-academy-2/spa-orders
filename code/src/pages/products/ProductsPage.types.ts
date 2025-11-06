export type RangeFilter = {
  start: number;
  end: number;
};
export type ProductsPageFilters = {
  tags: string[];
  price: RangeFilter;
};