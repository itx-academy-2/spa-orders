import { render, screen } from "@testing-library/react";
import { ChartProps } from "react-chartjs-2";

import { getChartOptions } from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.constants";
import DashboardMetricsChart from "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-chart/DashboardMetricsChart";

let capturedProps: ChartProps<"bar">;

jest.mock("react-chartjs-2", () => ({
  Bar: (props: ChartProps<"bar">) => {
    capturedProps = props;
    return <div data-testid="chart-props" />;
  }
}));

const formatMessage = ({ id }: { id: string }) => id;

jest.mock("react-intl", () => ({
  useIntl: () => ({ formatMessage })
}));

const sampleData = [10, 20, 30, 40, 50];
const sampleLabels = [
  ["Week 1", "March 1 - March 1"],
  ["Week 2", "March 2 - March 2"],
  ["Week 3", "March 3 - March 3"],
  ["Week 4", "March 4 - March 4"],
  ["Week 5", "March 5 - March 5"]
];

const expectedOptions = getChartOptions(
  {
    tooltipTitleCallback: (tooltipItem) => tooltipItem[0].label.split(",")[1],
    tooltipLabelCallback: (tooltipItem) =>
      `dashboardTabs.metrics.usageTooltip ${tooltipItem.raw}`
  },
  formatMessage
);

describe("DashboardMetricsChart", () => {
  beforeEach(() => {
    render(<DashboardMetricsChart data={sampleData} labels={sampleLabels} />);
  });

  test("renders a dummy element (our mock) with chart props", () => {
    const chartPropsDiv = screen.getByTestId("chart-props");
    expect(chartPropsDiv).toBeInTheDocument();
  });

  test("tooltip label callback returns the correct value", () => {
    expect(JSON.stringify(capturedProps.options)).toBe(
      JSON.stringify(expectedOptions)
    );
  });
});
