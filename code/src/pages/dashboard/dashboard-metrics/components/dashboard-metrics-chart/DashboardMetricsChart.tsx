import { Bar } from "react-chartjs-2";
import { useIntl } from "react-intl";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";

import { getChartOptions } from "@/pages/dashboard/dashboard-metrics/DashboardMetricsPage.constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type DashboardMetricsChartProps = {
  data: (number | null)[];
  labels: string[][];
};

const DashboardMetricsChart = ({
  data,
  labels
}: DashboardMetricsChartProps) => {
  const { formatMessage } = useIntl();

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<"bar"> = getChartOptions(
    {
      tooltipTitleCallback: (tooltipItem) => tooltipItem[0].label.split(",")[1],
      tooltipLabelCallback: (tooltipItem) =>
        `${formatMessage({ id: "dashboardTabs.metrics.usageTooltip" })} ${tooltipItem.raw}`
    },
    formatMessage
  );

  return <Bar data={chartData} options={options} />;
};

export default DashboardMetricsChart;
