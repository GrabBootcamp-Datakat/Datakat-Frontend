'use client';
import { appApi } from './appApi';
import { NLVQueryResponse } from '@/types/chat';

export const chatApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation<NLVQueryResponse, string>({
      query: (message) => ({
        url: '/api/v1/nlv/query',
        method: 'POST',
        body: { query: message },
      }),
    }),
  }),
});

export const { useSendChatMessageMutation } = chatApi;
