import {
  ComponentDataPoint,
  TimeDataPoint,
} from '../slices/chartCustomizationSlice';
import { appApi } from './appApi';
import { LogEntry, LogCountDto, TimeUnit } from '@/types/log';

export const logsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<LogEntry[], void>({
      query: () => ({
        url: '/api/logs',
        method: 'GET',
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
  useGetLogsCountQuery,
  useGetTimeAnalysisQuery,
  useGetTimeDistributionQuery,
  useGetComponentQuery,
  useGetComponentAnalysisQuery,
  useGetEventFrequencyQuery,
} = logsApi;
