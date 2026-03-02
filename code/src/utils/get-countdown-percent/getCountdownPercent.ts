import { EXPIRATION_HOURS } from "@/constants/reservations";

import { TimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";

// Calculates totalSeconds and the progress percentage for the CircularCountdown.
export const getCountdownPercent = (time: TimeLeft) => {
    const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;

    const percent = time.expired
        ? 0
        : (totalSeconds / (EXPIRATION_HOURS * 3600)) * 100;

    return { totalSeconds, percent };
};