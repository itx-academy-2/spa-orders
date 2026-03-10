import { EXPIRATION_HOURS } from "@/constants/reservations";
import { parseUTCDate } from "@/utils/parse-utc-date/parseUTCDate";

export type TimeLeft = {
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
};

export const calculateTimeLeft = (addedAt: string): TimeLeft => {
    const now = Date.now();
    const reserveTime = parseUTCDate(addedAt).getTime();
    const expiresAt = reserveTime + EXPIRATION_HOURS * 60 * 60 * 1000;

    const diff = Math.max(0, expiresAt - now);

    const expired = diff === 0;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { hours, minutes, seconds, expired };
};

/* 
  Formats the remaining time as a string (HH:MM:SS) or shows "expired" 
*/
export const formatTimeLeft = (time: TimeLeft): string => {
    if (time.expired) return "reservationsTable.expired";

    if (!Number.isFinite(time.hours) || !Number.isFinite(time.minutes) || !Number.isFinite(time.seconds)) {
        return "Invalid time";
    }

    return `${time.hours.toString().padStart(2, "0")}:${time.minutes
        .toString()
        .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`;
};