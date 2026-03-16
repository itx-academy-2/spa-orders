import { useEffect, useState } from "react";
import { Duration } from "luxon";
import { calculateTimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";

export const useTimeLeft = (addedAt: string) => {
  const [duration, setDuration] = useState<Duration | null>(() =>
    calculateTimeLeft(addedAt)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(calculateTimeLeft(addedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [addedAt]);

  return duration;
};
