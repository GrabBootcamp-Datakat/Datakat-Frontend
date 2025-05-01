'use client';
import { appApi } from './appApi';
import { ChatResponse } from '@/types/chat';

export const chatApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    sendChatMessage: builder.mutation<ChatResponse, string>({
      query: (message) => ({
        url: '/api/chat',
        method: 'POST',
        body: { query: message },
      }),
    }),
  }),
});

export const { useSendChatMessageMutation } = chatApi;
