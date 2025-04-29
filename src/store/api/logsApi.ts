import { appApi } from "./appApi";
import { LogCountDto } from "@/types/logsType";

interface DateRange {
  startDate: string;
  endDate: string;
}

export const logsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLogsCount: builder.query<LogCountDto, DateRange | null>({
      query: (dateRange) => ({
        url: dateRange
          ? `/api/logs/count?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
          : "/api/logs/count",
        method: "GET",
      }),
      providesTags: ["Logs"],
    }),
  }),
});

export const { useGetLogsCountQuery } = logsApi;
