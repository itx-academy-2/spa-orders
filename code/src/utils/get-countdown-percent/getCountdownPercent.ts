import { EXPIRATION_HOURS } from "@/constants/reservations";
import { Duration } from "luxon";

// Calculates totalSeconds and the progress percentage for the CircularCountdown.
export const getCountdownPercent = (duration: Duration | null) => {
  if (!duration) {
    return { totalSeconds: 0, percent: 0 };
  }

  const totalSeconds = Math.max(0, Math.floor(duration.as("seconds")));

  const percent = Math.max(
    0,
    Math.min(100, (totalSeconds / (EXPIRATION_HOURS * 3600)) * 100)
  );

  return { totalSeconds, percent };
};