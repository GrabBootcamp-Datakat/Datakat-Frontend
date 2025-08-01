'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AnomalyGroupResponse, LLMAnalysisResponse } from '@/types/anomaly';
import { AnomalyLogEntry } from '@/components/anomalies/types';
import dayjs from 'dayjs';

interface ChartDataPoint {
  name: string;
  value: number;
}

interface EventDataPoint {
  id: string;
  count: number;
  component: string;
  level: string;
  firstOccurrence: string;
  lastOccurrence: string;
}

interface TimeDataPoint {
  hour: string;
  count: number;
}

interface ChartData {
  componentData: ChartDataPoint[];
  levelData: ChartDataPoint[];
  eventData: EventDataPoint[];
  timeData: TimeDataPoint[];
}

export interface AnomalyState {
  dateRange: [string, string];
  pagination: {
    offset: number;
    limit: number;
  };
  filters: {
    search: string;
    eventId: string;
    level: string;
    component: string;
  };
  selectedGroup: AnomalyGroupResponse | null;
  settings: {
    autoDetect: boolean;
    notify: boolean;
    threshold: number;
  };
  analysisResults: Record<string, LLMAnalysisResponse>;
  anomalies: AnomalyLogEntry[];
  chartData: ChartData | null;
}

const initialState: AnomalyState = {
  dateRange: [
    dayjs().subtract(30, 'days').toISOString(),
    dayjs().toISOString(),
  ],
  pagination: {
    offset: 0,
    limit: 50,
  },
  filters: {
    search: '',
    eventId: 'all',
    level: 'all',
    component: 'all',
  },
  selectedGroup: null,
  settings: {
    autoDetect: true,
    notify: true,
    threshold: 60,
  },
  analysisResults: {},
  anomalies: [],
  chartData: null,
};

const anomalySlice = createSlice({
  name: 'anomaly',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<[string, string]>) => {
      state.dateRange = action.payload;
    },

    setDateRangeFromToday: (state) => {
      state.dateRange = [
        dayjs().subtract(30, 'days').toISOString(),
        dayjs().toISOString(),
      ];
    },

    setPagination: (
      state,
      action: PayloadAction<{ offset: number; limit: number }>,
    ) => {
      state.pagination = action.payload;
    },

    setFilters: (
      state,
      action: PayloadAction<{
        field: keyof AnomalyState['filters'];
        value: string;
      }>,
    ) => {
      state.filters[action.payload.field] = action.payload.value;
      state.pagination.offset = 0;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.selectedGroup = null;
      state.pagination.offset = 0;
    },

    setSelectedGroup: (
      state,
      action: PayloadAction<AnomalyGroupResponse | null>,
    ) => {
      state.selectedGroup = action.payload;
    },

    setSettings: (
      state,
      action: PayloadAction<Partial<AnomalyState['settings']>>,
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    setAnalysisResult: (
      state,
      action: PayloadAction<{
        groupId: string;
        result: LLMAnalysisResponse;
      }>,
    ) => {
      state.analysisResults[action.payload.groupId] = action.payload.result;
    },

    clearAnalysisResult: (state, action: PayloadAction<string>) => {
      delete state.analysisResults[action.payload];
    },

    clearAllAnalysisResults: (state) => {
      state.analysisResults = {};
    },

    loadMore: (state) => {
      state.pagination.offset += state.pagination.limit;
    },

    setAnomalies: (state, action: PayloadAction<AnomalyLogEntry[]>) => {
      state.anomalies = action.payload;
    },

    setChartData: (state, action: PayloadAction<ChartData>) => {
      state.chartData = action.payload;
    },
  },
});

export const {
  setDateRange,
  setDateRangeFromToday,
  setPagination,
  setFilters,
  resetFilters,
  setSelectedGroup,
  setSettings,
  setAnalysisResult,
  clearAnalysisResult,
  clearAllAnalysisResults,
  loadMore,
  setAnomalies,
  setChartData,
} = anomalySlice.actions;

export default anomalySlice.reducer;

// Selectors
export const selectDateRange = (state: RootState) => state.anomaly.dateRange;
export const selectPagination = (state: RootState) => state.anomaly.pagination;
export const selectFilters = (state: RootState) => state.anomaly.filters;
export const selectSelectedGroup = (state: RootState) =>
  state.anomaly.selectedGroup;
export const selectSettings = (state: RootState) => state.anomaly.settings;
export const selectAnalysisResult = (state: RootState) => {
  const selectedGroupId = state.anomaly.selectedGroup?.event_id;
  return selectedGroupId
    ? state.anomaly.analysisResults[selectedGroupId]
    : null;
};
export const selectAnalysisResults = (state: RootState) =>
  state.anomaly.analysisResults;
export const selectAnomalies = (state: RootState) => state.anomaly.anomalies;
export const selectChartData = (state: RootState) => state.anomaly.chartData;
