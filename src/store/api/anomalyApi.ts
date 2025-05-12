'use client';
import {
  PaginatedAnomalyResponse,
  LLMAnalysisRequest,
  LLMAnalysisResponse,
  GroupedAnomalyResponse,
} from '@/types/anomaly';
import { aiApi } from './aiApi';

interface RawAnomalyLogEntry {
  id: string;
  timestamp: string;
  level: string;
  component: string;
  content: string;
  event_id?: string;
  metadata?: Record<string, string>;
}

interface RawAnomalyGroupResponse {
  event_id: string;
  count: number;
  first_occurrence: string;
  items: RawAnomalyLogEntry[];
}

interface RawGroupedAnomalyResponse {
  groups: RawAnomalyGroupResponse[];
  total: number;
}

interface RawPaginatedAnomalyResponse {
  items: RawAnomalyLogEntry[];
  total: number;
}

interface AnomalyQueryParams {
  limit?: number;
  offset?: number;
  start_time?: string;
  end_time?: string;
  levels?: string[];
  applications?: string[];
  event_ids?: string[];
  search_query?: string;
  group_by?: 'event_id';
}

interface AnomalyOccurrence {
  timestamp: string;
  event_id: string;
  count: number;
}

interface AnomalyOccurrenceResponse {
  series: AnomalyOccurrence[];
}

interface AnomalyOccurrenceParams {
  start_time: string;
  end_time: string;
  interval?: string;
  applications?: string[];
  levels?: string[];
  top_n_event_ids?: number;
}

interface FieldValuesResponse {
  values: string[];
}

interface FieldValuesParams {
  start_time?: string;
  end_time?: string;
  applications?: string[];
}

export const anomalyApi = aiApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnomalies: builder.query<
      PaginatedAnomalyResponse | GroupedAnomalyResponse,
      AnomalyQueryParams
    >({
      query: (params) => ({
        url: '/api/v1/anomalies',
        params: {
          ...params,
          levels: params.levels?.join(','),
          applications: params.applications?.join(','),
          event_ids: params.event_ids?.join(','),
        },
      }),
      transformResponse: (
        response: RawPaginatedAnomalyResponse | RawGroupedAnomalyResponse,
      ) => {
        // Type guard to check if response is grouped
        const isGroupedResponse = (
          resp: RawPaginatedAnomalyResponse | RawGroupedAnomalyResponse,
        ): resp is RawGroupedAnomalyResponse => {
          return 'groups' in resp;
        };

        if (isGroupedResponse(response)) {
          // Handle grouped response
          return {
            groups: response.groups.map((group) => ({
              ...group,
              items: group.items.map((item) => ({
                ...item,
                event_id: item.event_id || item.id,
                is_anomaly: true,
              })),
            })),
            total: response.total,
          } as GroupedAnomalyResponse;
        } else {
          // Handle paginated response
          return {
            items: response.items.map((item) => ({
              ...item,
              event_id: item.event_id || item.id,
              is_anomaly: true,
            })),
            total: response.total,
          } as PaginatedAnomalyResponse;
        }
      },
      providesTags: ['Anomalies'],
    }),

    getAnomalyOccurrences: builder.query<
      AnomalyOccurrenceResponse,
      AnomalyOccurrenceParams
    >({
      query: (params) => ({
        url: '/api/v1/anomalies/occurrences',
        params: {
          ...params,
          levels: params.levels?.join(','),
          applications: params.applications?.join(','),
        },
      }),
      providesTags: ['Anomalies'],
    }),

    getDistinctEventIds: builder.query<FieldValuesResponse, FieldValuesParams>({
      query: (params) => ({
        url: '/api/v1/anomalies/event_ids',
        params: {
          ...params,
          applications: params.applications?.join(','),
        },
      }),
      providesTags: ['Anomalies'],
    }),

    getDistinctLevels: builder.query<FieldValuesResponse, FieldValuesParams>({
      query: (params) => ({
        url: '/api/v1/anomalies/levels',
        params: {
          ...params,
          applications: params.applications?.join(','),
        },
      }),
      providesTags: ['Anomalies'],
    }),

    getDistinctComponents: builder.query<
      FieldValuesResponse,
      FieldValuesParams
    >({
      query: (params) => ({
        url: '/api/v1/anomalies/components',
        params: {
          ...params,
          applications: params.applications?.join(','),
        },
      }),
      providesTags: ['Anomalies'],
    }),

    analyzeAnomaly: builder.mutation<LLMAnalysisResponse, LLMAnalysisRequest>({
      query: (body) => ({
        url: '/api/v1/anomalies/analyze',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Anomalies'],
    }),
  }),
});

export const {
  useGetAnomaliesQuery,
  useGetAnomalyOccurrencesQuery,
  useGetDistinctEventIdsQuery,
  useGetDistinctLevelsQuery,
  useGetDistinctComponentsQuery,
  useAnalyzeAnomalyMutation,
} = anomalyApi;
