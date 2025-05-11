'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MetricName } from '@/types/metrics';
import { GroupBy } from '@/types/metrics';
import { TimeInterval } from '@/types/metrics';
import { RootState } from '../store';
import dayjs from 'dayjs';

export interface MetricsState {
  dateRange: [string, string];
  selectedApplications: string[];
  selectedMetric: MetricName;
  selectedInterval: TimeInterval;
  selectedGroupBy: GroupBy;
}

const initialState: MetricsState = {
  dateRange: [
    dayjs().subtract(15, 'year').toISOString(),
    dayjs().toISOString(),
  ],
  selectedApplications: [],
  selectedMetric: MetricName.LOG_EVENT,
  selectedInterval: TimeInterval.TEN_MINUTES,
  selectedGroupBy: GroupBy.TOTAL,
};

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<[string, string]>) => {
      state.dateRange = [action.payload[0], action.payload[1]];
    },

    setSelectedApplications: (state, action: PayloadAction<string[]>) => {
      state.selectedApplications = [...action.payload];
    },

    setSelectedMetric: (state, action: PayloadAction<MetricName>) => {
      state.selectedMetric = action.payload;
    },

    setSelectedInterval: (state, action: PayloadAction<TimeInterval>) => {
      state.selectedInterval = action.payload;
    },

    setSelectedGroupBy: (state, action: PayloadAction<GroupBy>) => {
      state.selectedGroupBy = action.payload;
    },
  },
});

export const {
  setDateRange,
  setSelectedApplications,
  setSelectedMetric,
  setSelectedInterval,
  setSelectedGroupBy,
} = metricsSlice.actions;
export default metricsSlice.reducer;

export const selectDateRange = (state: RootState) => state.metrics.dateRange;
export const selectSelectedApplications = (state: RootState) =>
  state.metrics.selectedApplications;
export const selectSelectedMetric = (state: RootState) =>
  state.metrics.selectedMetric;
export const selectSelectedInterval = (state: RootState) =>
  state.metrics.selectedInterval;
export const selectSelectedGroupBy = (state: RootState) =>
  state.metrics.selectedGroupBy;
