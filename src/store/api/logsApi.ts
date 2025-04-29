import { TimeDataPoint } from '../slices/chartCustomizationSlice';
import { appApi } from './appApi';
import { LogEntry, LogCountDto, TimeUnit } from '@/types/logsType';

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
  }),
});

export const {
  useGetLogsQuery,
  useGetLogsCountQuery,
  useGetTimeAnalysisQuery,
} = logsApi;
