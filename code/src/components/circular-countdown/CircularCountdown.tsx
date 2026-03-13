import CircularProgress from "@mui/material/CircularProgress";

import AppBox from "@/components/app-box/AppBox";
import AppTooltip from "@/components/app-tooltip/AppTooltip";
import { CircularCountdownProps } from "@/components/circular-countdown/CircularCountdown.types";
import { useTimeLeft } from "@/containers/tables/reservations-table/hooks/useTimeLeft";

import { getCountdownPercent } from "@/utils/get-countdown-percent/getCountdownPercent";

import "@/components/circular-countdown/CircularCountdown.scss";

const CircularCountdown = ({
  reservedAt,
  size,
}: CircularCountdownProps) => {
  const duration = useTimeLeft(reservedAt);

  const { percent } = getCountdownPercent(duration);

  const time = duration
    ?.shiftTo("hours", "minutes", "seconds")
    .toObject() ?? { hours: 0, minutes: 0, seconds: 0 };

  const pad = (num: number | undefined) => String(Math.floor(num ?? 0)).padStart(2, "0");

  return (
    <AppBox
      className="circular-countdown"
      position="relative"
      width={size}
      height={size}
      data-testid="circular-countdown"
    >
      <AppTooltip titleTranslationKey="circular-countdown.tooltip">
        <CircularProgress
          variant="determinate"
          value={percent}
          size={size}
          thickness={2}
        />
      </AppTooltip>
      <AppBox className="circular-countdown__text">
        <AppBox className="circular-countdown__text-time-hm">
          {pad(time.hours)} : {pad(time.minutes)}
        </AppBox>

        <AppBox className="circular-countdown__text-time-s">
          : {pad(time.seconds)}
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default CircularCountdown;