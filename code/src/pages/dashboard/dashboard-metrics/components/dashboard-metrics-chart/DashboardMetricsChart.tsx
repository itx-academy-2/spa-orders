import { Bar } from "react-chartjs-2";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  TooltipItem
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type DashboardMetricsChartProps = {
  data: number[];
  labels: string[];
  title: string;
};

const DashboardMetricsChart = ({
  data,
  labels,
  title
}: DashboardMetricsChartProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"bar">) => `${tooltipItem.raw}`
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default DashboardMetricsChart;
