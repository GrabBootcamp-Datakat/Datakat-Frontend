'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: baseQuery,
  endpoints: () => ({}),
  tagTypes: ['Logs', 'Metrics', 'Applications'],
});
