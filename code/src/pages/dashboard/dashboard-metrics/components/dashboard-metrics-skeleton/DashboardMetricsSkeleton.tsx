import { Skeleton } from "@mui/material";

import AppBox from "@/components/app-box/AppBox";

import "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-skeleton/DashboardMetricsSkeleton.scss";

const DashboardMetricsSkeleton = () => {
  const barHeights = [160, 425, 120, 280, 340];

  return (
    <AppBox
      data-testid="DashboardMetricsSkeleton"
      className="dashboard-metrics-skeleton"
    >
      <AppBox className="dashboard-metrics-skeleton__header">
        <Skeleton variant="text" width="310px" height={45} />
      </AppBox>
      <AppBox className="dashboard-metrics-skeleton__barsContainer">
        {barHeights.map((height, index) => (
          <AppBox key={index} className="dashboard-metrics-skeleton__bar">
            <Skeleton variant="rounded" width="160px" height={`${height}px`} />
            <Skeleton
              variant="text"
              width="160px"
              height={55}
              className="dashboard-metrics-skeleton__barLabel"
            />
          </AppBox>
        ))}
      </AppBox>
    </AppBox>
  );
};

export default DashboardMetricsSkeleton;
