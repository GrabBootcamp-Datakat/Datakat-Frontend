'use client';
import {
  ComponentDataPoint,
  TimeDataPoint,
} from '../slices/chartCustomizationSlice';
import { appApi } from './appApi';
import {
  LogSearchResponse,
  LogSearchRequest,
  LogApplicationsRequest,
  LogApplicationsResponse,
} from '@/types/logs';
import { LogCountDto, TimeUnit } from '@/types/logs';

export const logsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<LogSearchResponse, LogSearchRequest>({
      query: (params) => ({
        url: '/api/v1/logs',
        method: 'GET',
        params: {
          ...params,
          levels: params.levels?.join(','),
          applications: params.applications?.join(','),
        },
      }),
      providesTags: ['Logs'],
    }),

    getLogsApplications: builder.query<
      LogApplicationsResponse,
      LogApplicationsRequest
    >({
      query: (params) => ({
        url: '/api/v1/logs/applications',
        method: 'GET',
        params: {
          ...params,
        },
      }),
      providesTags: ['Logs'],
    }),

    getLogsCount: builder.query<LogCountDto, void>({
      query: () => ({
        url: '/api/logs/count',
        method: 'GET',
      }),
      providesTags: ['Logs'],
    }),

    getTimeAnalysis: builder.query<TimeDataPoint[], TimeUnit>({
      query: (timeUnit) => ({
        url: `/api/logs/time?timeUnit=${timeUnit}`,
        method: 'GET',
      }),
      providesTags: ['Logs'],
    }),

    getTimeDistribution: builder.query<
      Array<{
        hour: string;
        INFO: number;
        WARN: number;
        ERROR: number;
      }>,
      void
    >({
      query: () => ({
        url: '/api/logs/time/distribution',
        method: 'GET',
      }),
      providesTags: ['Logs'],
    }),

    getComponent: builder.query<
      {
        name: string;
        value: number;
      }[],
      void
    >({
      query: () => ({
        url: '/api/logs/component',
        method: 'GET',
      }),
      providesTags: ['Logs'],
    }),

    getComponentAnalysis: builder.query<
      (ComponentDataPoint & { count: number })[],
      void
    >({
      query: () => ({
        url: '/api/logs/component/analysis',
        method: 'GET',
      }),
      providesTags: ['Logs'],
    }),

    getEventFrequency: builder.query<
      { eventId: string; count: number }[],
      void
    >({
      query: () => ({
        url: '/api/logs/event',
        method: 'GET',
      }),
      providesTags: ['Logs'],
    }),
  }),
});

export const {
  useGetLogsQuery,
  useGetLogsApplicationsQuery,
  useGetLogsCountQuery,
  useGetTimeAnalysisQuery,
  useGetTimeDistributionQuery,
  useGetComponentQuery,
  useGetComponentAnalysisQuery,
  useGetEventFrequencyQuery,
} = logsApi;
