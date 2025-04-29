import { appApi } from './appApi';
import { LogCountDto } from '@/types/logsType';

export const logsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogsCount: builder.query<LogCountDto, void>({
      query: () => ({
        url: '/api/logs/count',
        method: 'GET',
      }),
      providesTags: ['Logs'],
    }),
  }),
});

export const { useGetLogsCountQuery } = logsApi;
