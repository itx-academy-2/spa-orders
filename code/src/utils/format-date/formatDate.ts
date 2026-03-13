import { DateTime } from "luxon";

type FormatDateOptions = {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
};

const formatDate = (
  dateLike: string | Date,
  { locale = "en-GB", options = {} }: FormatDateOptions = {}
) => {
  const date =
    dateLike instanceof Date
      ? DateTime.fromJSDate(dateLike)
      : DateTime.fromISO(dateLike, { zone: "utc" });

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Europe/Kyiv"
  };

  return new Intl.DateTimeFormat(locale, {
    ...defaultOptions,
    ...options,
  }).format(date.toJSDate());
};

export default formatDate;
