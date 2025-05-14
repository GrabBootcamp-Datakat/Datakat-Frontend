'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  Dimension,
  MetricDistributionRequest,
  MetricName,
} from '@/types/metrics';
import dayjs from 'dayjs';

export interface DashboardState {
  applications: string[];
  logLevelOverview: MetricDistributionRequest;
  componentDistribution: MetricDistributionRequest;
  applicationDistribution: MetricDistributionRequest;
}

const initialState: DashboardState = {
  applications: [],
  logLevelOverview: {
    startTime: dayjs().subtract(10, 'year').toISOString(),
    endTime: dayjs().toISOString(),
    metricName: MetricName.LOG_EVENT,
    dimension: Dimension.LEVEL,
  },
  componentDistribution: {
    startTime: dayjs().subtract(10, 'year').toISOString(),
    endTime: dayjs().toISOString(),
    metricName: MetricName.LOG_EVENT,
    dimension: Dimension.COMPONENT,
  },
  applicationDistribution: {
    startTime: dayjs().subtract(10, 'year').toISOString(),
    endTime: dayjs().toISOString(),
    metricName: MetricName.LOG_EVENT,
    dimension: Dimension.APPLICATION,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLogLevelOverview: (
      state,
      action: PayloadAction<Partial<MetricDistributionRequest>>,
    ) => {
      state.logLevelOverview = {
        ...state.logLevelOverview,
        ...action.payload,
      };
    },

    setComponentDistribution: (
      state,
      action: PayloadAction<Partial<MetricDistributionRequest>>,
    ) => {
      state.componentDistribution = {
        ...state.componentDistribution,
        ...action.payload,
      };
    },

    setApplicationDistribution: (
      state,
      action: PayloadAction<Partial<MetricDistributionRequest>>,
    ) => {
      state.applicationDistribution = {
        ...state.applicationDistribution,
        ...action.payload,
      };
    },

    setDateRangeFromToday: (state) => {
      const startTime = dayjs().subtract(10, 'year').toISOString();
      const endTime = dayjs().toISOString();
      state.logLevelOverview.startTime = startTime;
      state.logLevelOverview.endTime = endTime;
      state.componentDistribution.startTime = startTime;
      state.componentDistribution.endTime = endTime;
      state.applicationDistribution.startTime = startTime;
      state.applicationDistribution.endTime = endTime;
    },
  },
});

export const {
  setLogLevelOverview,
  setComponentDistribution,
  setApplicationDistribution,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;

export const selectLogLevelOverview = (state: RootState) =>
  state.dashboard.logLevelOverview;
export const selectComponentDistribution = (state: RootState) =>
  state.dashboard.componentDistribution;
export const selectApplicationDistribution = (state: RootState) =>
  state.dashboard.applicationDistribution;
