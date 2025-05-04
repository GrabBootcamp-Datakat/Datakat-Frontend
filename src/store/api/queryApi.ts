'use client';
import { appApi } from './appApi';
import { NLVQueryResponse } from '@/types/query';

export const queryApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    sendQueryMessage: builder.mutation<NLVQueryResponse, string>({
      query: (message) => ({
        url: '/api/v1/nlv/query',
        method: 'POST',
        body: { query: message },
      }),
    }),
  }),
});

export const { useSendQueryMessageMutation } = queryApi;
