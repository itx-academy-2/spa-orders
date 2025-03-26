import { useIntl } from "react-intl";

import { ChartOptions, TooltipItem } from "chart.js";

export const metricTypesMap = {
  CATEGORY_USAGE_METRIC: "tag_filter_usage_total",
  MINIMUM_DISCOUNT_USAGE_METRIC: "minimum_discount_filter_usage_total",
  MAXIMUM_DISCOUNT_USAGE_METRIC: "maximum_discount_filter_usage_total",
  MINIMUM_PRICE_WITH_DISCOUNT_USAGE_METRIC:
    "minimum_price_with_discount_filter_usage_total",
  MAXIMUM_PRICE_WITH_DISCOUNT_USAGE_METRIC:
    "maximum_price_with_discount_filter_usage_total"
};

export const metricTypesToDisplay = [
  metricTypesMap.CATEGORY_USAGE_METRIC,
  metricTypesMap.MINIMUM_DISCOUNT_USAGE_METRIC,
  metricTypesMap.MINIMUM_PRICE_WITH_DISCOUNT_USAGE_METRIC
];

export const metricTypesTranslationsMap = {
  [metricTypesMap.CATEGORY_USAGE_METRIC]: "dashboardTabs.metrics.category",
  [metricTypesMap.MINIMUM_DISCOUNT_USAGE_METRIC]:
    "dashboardTabs.metrics.discount",
  [metricTypesMap.MINIMUM_PRICE_WITH_DISCOUNT_USAGE_METRIC]:
    "dashboardTabs.metrics.priceWithDiscount"
};

export const weekIndexTranslationMap = {
  0: "dashboardTabs.metrics.thisWeek",
  1: "dashboardTabs.metrics.weekLabel",
  2: "dashboardTabs.metrics.weekLabel",
  3: "dashboardTabs.metrics.weekLabel",
  4: "dashboardTabs.metrics.weekLabel"
} as Record<number, string>;

type ChartTooltipCallbacks = {
  tooltipTitleCallback: (tooltipItem: TooltipItem<"bar">[]) => string;
  tooltipLabelCallback: (tooltipItem: TooltipItem<"bar">) => string;
};

export const getChartOptions = (
  callbacks: ChartTooltipCallbacks,
  formatMessage: ReturnType<typeof useIntl>["formatMessage"]
): ChartOptions<"bar"> => {
  const defaultChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        display: true,
        title: {
          padding: 20,
          display: true,
          text: formatMessage({ id: "dashboardTabs.metrics.usage" }),
          font: {
            weight: "bold",
            size: 14
          }
        }
      },
      x: {
        ticks: {
          font: {
            lineHeight: 1.6
          }
        },
        display: true,
        title: {
          padding: 20,
          display: true,
          text: formatMessage({ id: "dashboardTabs.metrics.weeks" }),
          font: {
            weight: "bolder",
            size: 14
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        displayColors: false,
        bodyAlign: "center",
        callbacks: {
          title: callbacks.tooltipTitleCallback,
          label: callbacks.tooltipLabelCallback
        }
      }
    }
  };

  return defaultChartOptions;
};
