import { URLS } from "@/constants/requests";
import { appApi } from "@/store/api/appApi";
import { GetMetricsParams, GetMetricsResponse } from "@/types/metric.types";

const metricsApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getMetrics: build.query<GetMetricsResponse, GetMetricsParams | void>({
      query: (params) => ({
        url: URLS.metrics.getMetrics,
        params: params ?? {}
      })
    })
  })
});

export const { useGetMetricsQuery } = metricsApi;
