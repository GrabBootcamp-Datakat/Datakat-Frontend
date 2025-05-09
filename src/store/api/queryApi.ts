'use client';
import { appApi } from './appApi';
import { NLVQueryRequest, NLVQueryResponse } from '@/types/query';

export const queryApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    sendQueryMessage: builder.mutation<NLVQueryResponse, NLVQueryRequest>({
      query: (message) => ({
        url: '/api/v1/nlv/query',
        method: 'POST',
        body: message,
      }),
    }),
  }),
});

export const { useSendQueryMessageMutation } = queryApi;
