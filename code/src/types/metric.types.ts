export type GetMetricsParams = {
  amount?: number;
};

export type MetricValue = {
  startDate: [number, number, number];
  endDate: [number, number, number];
  count: number | null;
};

export type MetricData = {
  filterName: string;
  sumOfAllCounts: number;
  metrics: MetricValue[];
};

export type GetMetricsResponse = {
  filterMetrics: MetricData[];
};
