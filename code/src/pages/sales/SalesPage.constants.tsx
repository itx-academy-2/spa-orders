import { FormattedMessage } from "react-intl";

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

export const sortSaleOptions = [
  {
    value: "",
    label: <FormattedMessage id="productsDefault.label" />
  },
  {
    value: "discount,asc",
    label: <FormattedMessage id="sortSaleOptions.discountLowHigh" />
  },
  {
    value: "discount,desc",
    label: <FormattedMessage id="sortSaleOptions.discountHighLow" />
  },
  {
    value: "priceWithDiscount,asc",
    label: <FormattedMessage id="sortSaleOptions.priceLowHigh" />
  },
  {
    value: "priceWithDiscount,desc",
    label: <FormattedMessage id="sortSaleOptions.priceHighLow" />
  },
  {
    value: "name,asc",
    label: <FormattedMessage id="sortSaleOptions.nameAZ" />
  },
  {
    value: "name,desc",
    label: <FormattedMessage id="sortSaleOptions.nameZA" />
  }
];
