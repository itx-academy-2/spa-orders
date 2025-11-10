export type RangeFilter = {
  start: number;
  end: number;
};
export type ProductsPageFilters = {
  tags: string[];
  price: RangeFilter;
  discount?: boolean;
  nonDiscount?: boolean;
  availability?: boolean;
  nonAvailability?: boolean;
  deliveryNovaPost?: boolean;
  deliveryUkrPost?: boolean;
};