import { screen } from "@testing-library/react";

import DashboardMetricsChart from "@/pages/dashboard/dashboard-metrics/components/dashboard-metrics-chart/DashboardMetricsChart";
import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

interface TooltipCallbacks {
  label: (tooltipItem: { raw: unknown }) => string;
}

interface TooltipOptions {
  callbacks: TooltipCallbacks;
}

interface PluginOptions {
  tooltip: TooltipOptions;
}

interface ChartOptions {
  responsive: boolean;
  plugins: PluginOptions;
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface BarProps {
  data: ChartData;
  options: ChartOptions;
}

let capturedProps: BarProps | null = null;

jest.mock("react-chartjs-2", () => {
  return {
    Bar: (props: BarProps) => {
      capturedProps = props;
      return <div data-testid="chart-props" />;
    }
  };
});

const sampleData = [10, 20, 30, 40, 50];
const sampleLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
const sampleTitle = "Sample Chart";

describe("DashboardMetricsChart", () => {
  beforeEach(() => {
    renderWithProviders(
      <DashboardMetricsChart
        data={sampleData}
        labels={sampleLabels}
        title={sampleTitle}
      />
    );
  });

  test("renders a dummy element (our mock) with chart props", () => {
    const chartPropsDiv = screen.getByTestId("chart-props");

    expect(chartPropsDiv).toBeInTheDocument();
  });

  test("passes options to the Bar component", () => {
    expect(capturedProps).not.toBeNull();
  });

  test("tooltip label callback returns the correct value", () => {
    const tooltipItem = { raw: 25 };

    const tooltipLabel =
      capturedProps!.options.plugins.tooltip.callbacks.label(tooltipItem);

    expect(tooltipLabel).toBe("25");
  });
});
