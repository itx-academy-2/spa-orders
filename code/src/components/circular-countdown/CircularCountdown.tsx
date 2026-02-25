import CircularProgress from "@mui/material/CircularProgress";

import AppBox from "@/components/app-box/AppBox";
import { CircularCountdownProps } from "@/components/circular-countdown/CircularCountdown.types";
import { useTimeLeft } from "@/containers/tables/reservations-table/hooks/useTimeLeft";

import { EXPIRATION_HOURS } from "@/constants/reservations";
import { formatTimeLeft } from "@/utils/calculate-time-left/calculateTimeLeft";

import "@/components/circular-countdown/CircularCountdown.scss";

const CircularCountdown = ({
  reservedAt,
  size = 64,
}: CircularCountdownProps) => {
  const time = useTimeLeft(reservedAt);

  const totalSeconds =
    time.hours * 3600 + time.minutes * 60 + time.seconds;

  const percent = time.expired
    ? 0
    : (totalSeconds / (EXPIRATION_HOURS * 3600)) * 100;

  return (
    <AppBox
      className="circular-countdown"
      position="relative"
      width={size}
      height={size}
    >
      <CircularProgress
        variant="determinate"
        value={percent}
        size={size}
        thickness={4}
        color={time.expired ? "error" : "info"}
      />

      <AppBox
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: "translate(-50%, -50%)", fontSize: 12 }}
      >
        {formatTimeLeft(time)}
      </AppBox>
    </AppBox>
  );
};

export default CircularCountdown;