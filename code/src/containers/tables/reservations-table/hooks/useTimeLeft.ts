import { useEffect, useState } from "react";

import { calculateTimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";
import type { TimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";

export const useTimeLeft = (addedAt: string) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(addedAt));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft(addedAt));
        }, 1000);

        return () => clearInterval(interval);
    }, [addedAt]);

    return timeLeft;
};
