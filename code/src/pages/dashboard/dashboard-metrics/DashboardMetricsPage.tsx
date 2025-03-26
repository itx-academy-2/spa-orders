import { useIntl } from "react-intl";

import DashboardTabContainer from "@/layouts/dashboard-layout/components/dashboard-tab-container/DashboardTabContainer";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import {
  metricTypesToDisplay,
  metricTypesTranslationsMap
} from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.constants";
import DashboardMetricsChart from "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-chart/DashboardMetricsChart";
import DashboardMetricsSkeleton from "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-skeleton/DashboardMetricsSkeleton";
import getChartLabels from "@/pages/dashboard/dashboard-metrics/utils/get-chart-labels/get-chart-labels";
import { useGetMetricsQuery } from "@/store/api/metricsApi";

import "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.scss";

const DashboardMetricsPage = () => {
  const formatter = useIntl();

  const { data, isLoading } = useGetMetricsQuery({ amount: 5 });

  if (isLoading) {
    return (
      <DashboardTabContainer>
        {metricTypesToDisplay.map((metricType) => (
          <DashboardMetricsSkeleton key={metricType} />
        ))}
      </DashboardTabContainer>
    );
  }

  if (!data) {
    return "Error to get Metrics data!";
  }

  const metricsDataToDisplay = data.filterMetrics.filter(({ filterName }) =>
    metricTypesToDisplay.includes(filterName)
  );

  return (
    <DashboardTabContainer>
      {metricsDataToDisplay.map((item) => {
        const data = item.metrics.map((item) => item.count);
        const labels = getChartLabels(item.metrics, formatter);

        return (
          <AppBox className="dashboard-metrics__box" key={item.filterName}>
            <AppBox className="dashboard-metrics__toolbar">
              <AppTypography
                component="h1"
                variant="h3"
                translationKey={metricTypesTranslationsMap[item.filterName]}
              />
            </AppBox>
            <DashboardMetricsChart data={data} labels={labels} />
          </AppBox>
        );
      })}
    </DashboardTabContainer>
  );
};

export default DashboardMetricsPage;
