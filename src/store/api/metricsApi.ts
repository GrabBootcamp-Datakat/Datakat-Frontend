'use client';
import { appApi } from './appApi';
import {
  MetricSummaryRequest,
  MetricSummaryResponse,
  MetricTimeseriesRequest,
  MetricTimeseriesResponse,
  ApplicationListResponse,
  MetricDistributionRequest,
  MetricDistributionResponse,
} from '@/types/metrics';

export const metricsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSummaryMetrics: builder.query<
      MetricSummaryResponse,
      MetricSummaryRequest
    >({
      query: (params) => ({
        url: '/api/v1/metrics/summary',
        method: 'GET',
        params: {
          ...params,
          applications: params.applications?.join(','),
        },
      }),
      providesTags: ['Metrics'],
    }),

    getTimeseriesMetrics: builder.query<
      MetricTimeseriesResponse,
      MetricTimeseriesRequest
    >({
      query: (params) => ({
        url: '/api/v1/metrics/timeseries',
        method: 'GET',
        params: {
          ...params,
          applications: params.applications?.join(','),
        },
      }),
      providesTags: ['Metrics'],
    }),

    getApplications: builder.query<
      ApplicationListResponse,
      { startTime: string; endTime: string }
    >({
      query: (params) => ({
        url: '/api/v1/logs/applications',
        method: 'GET',
        params,
      }),
      providesTags: ['Applications'],
    }),

    getDistributionMetrics: builder.query<
      MetricDistributionResponse,
      MetricDistributionRequest
    >({
      query: (params) => ({
        url: '/api/v1/metrics/distribution',
        method: 'GET',
        params: {
          ...params,
          applications: params.applications?.join(','),
        },
      }),
      providesTags: ['Metrics'],
    }),
  }),
});

export const {
  useGetSummaryMetricsQuery,
  useGetTimeseriesMetricsQuery,
  useGetApplicationsQuery,
  useGetDistributionMetricsQuery,
} = metricsApi;
