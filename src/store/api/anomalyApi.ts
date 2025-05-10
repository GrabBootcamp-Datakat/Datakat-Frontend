'use client';
import {
  PaginatedAnomalyResponse,
  LLMAnalysisRequest,
  LLMAnalysisResponse,
} from '@/types/anomaly';
import { aiApi } from './aiApi';

export const anomalyApi = aiApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnomalies: builder.query<
      PaginatedAnomalyResponse,
      { limit?: number; offset?: number }
    >({
      query: ({ limit = 10, offset = 0 }) => ({
        url: '/api/v1/anomalies',
        params: { limit, offset },
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

export const { useGetAnomaliesQuery, useAnalyzeAnomalyMutation } = anomalyApi;
