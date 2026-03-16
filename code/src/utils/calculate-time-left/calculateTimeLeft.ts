import { EXPIRATION_HOURS } from "@/constants/reservations";
import { DateTime, Duration } from "luxon";

export const calculateTimeLeft = (addedAt: string): Duration | null => {
    const reserveTime = DateTime.fromISO(addedAt, { zone: "utc" });

    if (!reserveTime.isValid) return null;

    const expiresAt = reserveTime.plus({ hours: EXPIRATION_HOURS });
    const now = DateTime.utc();

    if (expiresAt <= now) return Duration.fromMillis(0);

    return expiresAt.diff(now, ["hours", "minutes", "seconds"]);
};

export const formatTimeLeft = (duration: Duration | null): string => {
  if (!duration) return "Invalid time";
  if (duration.as("milliseconds") <= 0) return "Expired";
  return duration.shiftTo("hours", "minutes", "seconds").toFormat("hh:mm:ss");
};