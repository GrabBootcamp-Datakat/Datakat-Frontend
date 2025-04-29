import { appApi } from './appApi';

interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: any[];
  config?: any;
}

interface ChatResponse {
  content: string;
  data?: ChartData;
}

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
