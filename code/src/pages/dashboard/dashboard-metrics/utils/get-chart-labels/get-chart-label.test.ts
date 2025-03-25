import { IntlShape } from "react-intl";

import { weekIndexTranslationMap } from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.constants";
import getChartLabels from "@/pages/dashboard/dashboard-metrics/utils/get-chart-labels/get-chart-labels";
import { MetricValue } from "@/types/metric.types";

const metrics = [
  { startDate: ["2023", "01", "01"], endDate: ["2023", "01", "07"] },
  { startDate: ["2023", "01", "08"], endDate: ["2023", "01", "14"] }
] as unknown as MetricValue[];

const expectedLabels = metrics.map((item, index) => [
  `${weekIndexTranslationMap[index]}-${index}`,
  `${item.startDate.join("-")} - ${item.endDate.join("-")}`
]);

describe("Test getChartLabels util", () => {
  const mockFormatter = {
    formatDate: jest.fn((date) => date),
    formatMessage: jest.fn(({ id }, { index }) => `${id}-${index}`)
  } as unknown as IntlShape;

  test("Should format chart labels correctly", () => {
    const labels = getChartLabels(metrics, mockFormatter);

    expect(labels).toEqual(expectedLabels);
  });
});
