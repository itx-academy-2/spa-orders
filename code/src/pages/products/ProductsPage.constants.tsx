import { FormattedMessage } from "react-intl";

import { ProductFilterParams } from "@/types/product.types";

export const defaultFilters: ProductFilterParams = {
  tags: ["category:computer", "category:mobile", "category:tablet"],
  discount: true,
  nonDiscount: true,
  priceMin: undefined,
  priceMax: undefined,
  availability: true,
  nonAvailability: false,
  deliveryNovaPost: true,
  deliveryUkrPost: true,
};

export const sortOptions = [
  {
    value: "",
    label: <FormattedMessage id="productsDefault.label" />
  },
  {
    value: "percentageOfTotalOrders,desc",
    label: <FormattedMessage id="sortOptions.bestsellers" />
  },
  {
    value: "product.createdAt,desc",
    label: <FormattedMessage id="sortOptions.newest" />
  },
  {
    value: "product.price,asc",
    label: <FormattedMessage id="sortOptions.priceLowHigh" />
  },
  {
    value: "product.price,desc",
    label: <FormattedMessage id="sortOptions.priceHighLow" />
  },
  { value: "name,asc", label: <FormattedMessage id="sortOptions.nameAZ" /> },
  { value: "name,desc", label: <FormattedMessage id="sortOptions.nameZA" /> }
];
