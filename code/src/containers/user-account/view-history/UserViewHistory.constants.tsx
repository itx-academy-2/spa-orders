import { FormattedMessage } from "react-intl";

export const sortOptions = [
  {
    value: "product.createdAt,desc",
    label: <FormattedMessage id="sortOptions.newest" />
  },
  {
    value: "product.createdAt,asc",
    label: <FormattedMessage id="sortOptions.oldest" />
  }
];

export const userViewHistoryPageNotFoundErrorConfig = {
  errorType: "notFound",
  errorMessageTranslationKey: "product.productNotFound"
} as const;
