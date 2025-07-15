import { FormattedMessage } from "react-intl";

export const sortOptions = [
  {
    value: "viewedAt,DESC",
    label: <FormattedMessage id="sortOptions.newest" />
  },
  {
    value: "viewedAt,ASC",
    label: <FormattedMessage id="sortOptions.oldest" />
  }
];

export const userViewHistoryPageNotFoundErrorConfig = {
  errorType: "notFound",
  errorMessageTranslationKey: "product.productNotFound"
} as const;
