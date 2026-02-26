import CircularProgress from "@mui/material/CircularProgress";

import AppBox from "@/components/app-box/AppBox";
import { CircularCountdownProps } from "@/components/circular-countdown/CircularCountdown.types";
import { useTimeLeft } from "@/containers/tables/reservations-table/hooks/useTimeLeft";

import { EXPIRATION_HOURS } from "@/constants/reservations";

import "@/components/circular-countdown/CircularCountdown.scss";

const CircularCountdown = ({
  reservedAt,
  size,
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
        thickness={2}
        sx={{
          transform: 'rotate(-90deg)'
        }}
      />
      <AppBox className="circular-countdown__text">
        <AppBox className="circular-countdown__text-time-hm">
          {String(time.hours).padStart(2, "0")} : {String(time.minutes).padStart(2, "0")}
        </AppBox>
        <AppBox className="circular-countdown__text-time-s">
          : {String(time.seconds).padStart(2, "0")}
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default CircularCountdown;
