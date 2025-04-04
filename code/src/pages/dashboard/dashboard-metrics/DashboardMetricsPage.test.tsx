import { render, screen } from "@testing-library/react";

import DashboardMetricsPage from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage";
import {
  metricTypesMap,
  metricTypesTranslationsMap
} from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.constants";
import { DashboardMetricsChartProps } from "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-chart/DashboardMetricsChart";
import { MetricData, MetricValue } from "@/types/metric.types";

const mockDashboardMetricsChart = jest.fn((props) => (
  <div data-testid="DashboardMetricsChart" {...props} />
));

jest.mock(
  "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-chart/DashboardMetricsChart",
  () => ({
    __esModule: true,
    default: (props: DashboardMetricsChartProps) =>
      mockDashboardMetricsChart(props)
  })
);

jest.mock("@/store/api/metricsApi", () => ({
  useGetMetricsQuery: () => mockUseGetMetricsQuery()
}));

jest.mock(
  "@/pages/dashboard/dashboard-metrics/utils/get-chart-labels/get-chart-labels",
  () => ({
    __esModule: true,
    default: (metrics: MetricValue[]) => metrics.map((item, index) => index)
  })
);

const defaultMetricData: MetricData[] = [
  {
    filterName: metricTypesMap.CATEGORY_USAGE_METRIC,
    sumOfAllCounts: 24,
    metrics: [
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      }
    ]
  },
  {
    filterName: metricTypesMap.MINIMUM_DISCOUNT_USAGE_METRIC,
    sumOfAllCounts: 24,
    metrics: [
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      }
    ]
  },
  {
    filterName: metricTypesMap.MINIMUM_PRICE_WITH_DISCOUNT_USAGE_METRIC,
    sumOfAllCounts: 24,
    metrics: [
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      },
      {
        startDate: [1, 2, 2024],
        endDate: [1, 2, 2024],
        count: 10
      }
    ]
  }
];

const mockUseGetMetricsQuery = jest.fn(() => ({
  data: { filterMetrics: defaultMetricData },
  isLoading: false
}));

const expectLabelsArray = new Array(3).fill([0, 1, 2, 3, 4]);

const expectedData = defaultMetricData.map((item) =>
  item.metrics.map((item) => item.count)
);

const metricTypesToDisplay = [
  metricTypesMap.CATEGORY_USAGE_METRIC,
  metricTypesMap.MINIMUM_DISCOUNT_USAGE_METRIC,
  metricTypesMap.MINIMUM_PRICE_WITH_DISCOUNT_USAGE_METRIC
];

const renderWrapper = (
  filterMetrics: MetricData[] = defaultMetricData,
  isLoading: boolean = false
) => {
  mockUseGetMetricsQuery.mockReturnValue({
    data: { filterMetrics },
    isLoading
  });

  render(<DashboardMetricsPage />);
};

describe("Test DashboardMetricsPage component", () => {
  test("renders all sections with correct headings", () => {
    renderWrapper();

    const discountText = screen.getByText("dashboardTabs.metrics.discount");
    const priceWithDiscountText = screen.getByText(
      "dashboardTabs.metrics.priceWithDiscount"
    );
    const categoryText = screen.getByText("dashboardTabs.metrics.category");

    expect(discountText).toBeInTheDocument();
    expect(priceWithDiscountText).toBeInTheDocument();
    expect(categoryText).toBeInTheDocument();
  });

  test("Should pass right props to chart", () => {
    renderWrapper();

    expectedData.forEach((_, index) => {
      expect(mockDashboardMetricsChart).toHaveBeenCalledWith({
        labels: expectLabelsArray[index],
        data: expectedData[index]
      });
    });
  });

  test("renders loading skeletons when data is not available", () => {
    renderWrapper([], true);

    const skeletons = screen.getAllByTestId("DashboardMetricsSkeleton");

    expect(skeletons).toHaveLength(metricTypesToDisplay.length);
  });

  test("filters and displays only the metrics specified in metricTypesToDisplay", () => {
    renderWrapper();

    metricTypesToDisplay.forEach((metricType) => {
      const heading = screen.getByText(metricTypesTranslationsMap[metricType]);

      expect(heading).toBeInTheDocument();
    });

    const unexpectedMetricTypes = defaultMetricData
      .map((metric) => metric.filterName)
      .filter((metricType) => !metricTypesToDisplay.includes(metricType));

    unexpectedMetricTypes.forEach((metricType) => {
      const heading = screen.queryByText(
        metricTypesTranslationsMap[metricType]
      );

      expect(heading).not.toBeInTheDocument();
    });
  });
});
