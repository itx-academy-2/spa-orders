import { IntlShape } from "react-intl";

import { weekIndexTranslationMap } from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.constants";
import { MetricValue } from "@/types/metric.types";

const getChartLabels = (metrics: MetricValue[], formatter: IntlShape) => {
  const formatLabelDate = (date: string) => {
    return formatter.formatDate(date, {
      month: "short",
      day: "numeric"
    });
  };

  const labels = metrics.map((item, index) => [
    formatter.formatMessage({ id: weekIndexTranslationMap[index] }, { index }),
    `${formatLabelDate(item.startDate.join("-"))} - ${formatLabelDate(item.endDate.join("-"))}`
  ]);

  return labels;
};

export default getChartLabels;
