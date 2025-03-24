import { useIntl } from "react-intl";

import DashboardTabContainer from "@/layouts/dashboard-layout/components/dashboard-tab-container/DashboardTabContainer";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import { getMockData } from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.constants";
import DashboardMetricsChart from "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-chart/DashboardMetricsChart";

import "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.scss";

const DashboardMetricsPage = () => {
  const { formatMessage } = useIntl();
  const mockData = getMockData(formatMessage);

  return (
    <DashboardTabContainer>
      <AppBox className="dashboard-metrics__box">
        <AppBox className="dashboard-metrics__toolbar">
          <AppTypography
            component="h1"
            variant="h3"
            translationKey="dashboardTabs.metrics.discount"
          />
        </AppBox>
        <DashboardMetricsChart
          data={mockData.discountFilter}
          labels={mockData.weeks}
          title={formatMessage({
            id: "dashboardTabs.metrics.discountSubtitle"
          })}
        />
      </AppBox>
      <AppBox className="dashboard-metrics__box">
        <AppBox className="dashboard-metrics__toolbar">
          <AppTypography
            component="h1"
            variant="h3"
            translationKey="dashboardTabs.metrics.priceWithDiscount"
          />
        </AppBox>
        <DashboardMetricsChart
          data={mockData.priceWithDiscountFilter}
          labels={mockData.weeks}
          title={formatMessage({
            id: "dashboardTabs.metrics.priceDiscountSubtitle"
          })}
        />
      </AppBox>
      <AppBox className="dashboard-metrics__box">
        <AppBox className="dashboard-metrics__toolbar">
          <AppTypography
            component="h1"
            variant="h3"
            translationKey="dashboardTabs.metrics.category"
          />
        </AppBox>
        <DashboardMetricsChart
          data={mockData.filterByCategory}
          labels={mockData.weeks}
          title={formatMessage({
            id: "dashboardTabs.metrics.categorySubtitle"
          })}
        />
      </AppBox>
    </DashboardTabContainer>
  );
};

export default DashboardMetricsPage;
