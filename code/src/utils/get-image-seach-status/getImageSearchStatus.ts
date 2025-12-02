import { IntlShape } from "react-intl";

type ErrorWithStatus = {
  status: number;
};

const hasStatus = (error: unknown): error is ErrorWithStatus => {
  return typeof error === "object" && error !== null && "status" in error;
};

const getImageSearchStatus = (
  params: {
    error: unknown;
    searchValue: string;
    imagesLength: number;
  },
  intl: IntlShape
): string | null => {
  const { error, searchValue, imagesLength } = params;

  if (error) {
    const status = hasStatus(error) ? error.status : undefined;

    if (status === 403) {
      return intl.formatMessage({ id: "searchImageModal.error.accessDenied" });
    }
    if (status === 503) {
      return intl.formatMessage({ id: "searchImageModal.error.unavailable" });
    }
    return intl.formatMessage({ id: "searchImageModal.error.generic" });
  }

  if (!searchValue) {
    return intl.formatMessage({ id: "searchImageModal.info.typeKeyword" });
  }

  if (searchValue.length < 3) {
    return intl.formatMessage({ id: "searchImageModal.info.minChars" });
  }

  if (imagesLength === 0) {
    return intl.formatMessage({ id: "searchImageModal.info.noResults" });
  }

  return null;
};

export default getImageSearchStatus;