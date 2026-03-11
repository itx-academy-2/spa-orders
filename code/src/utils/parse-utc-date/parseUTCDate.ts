import { DateTime } from "luxon";

export function parseUTCDate(isoString: string): Date {
    if (!isoString) {
        return new Date(NaN);
    }

    const dt = DateTime.fromISO(isoString, { zone: "utc" });

    if (!dt.isValid) {
        return new Date(NaN);
    }

    return dt.toJSDate();
}