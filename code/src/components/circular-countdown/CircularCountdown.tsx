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
  const time = useTimeLeft(reservedAt);

  const { percent } = getCountdownPercent(time);

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
