import { FieldError } from "react-hook-form";
import { useIntl } from "react-intl";

const getErrorMessage = (error: FieldError | undefined) => {
  const { formatMessage } = useIntl();
  return error && typeof error.message === "string"
    ? formatMessage({ id: error.message })
    : undefined;
};

export default getErrorMessage;
