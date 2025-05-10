'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_AI_SERVICE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const aiApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: baseQuery,
  endpoints: () => ({}),
  tagTypes: ['Anomalies'],
});
