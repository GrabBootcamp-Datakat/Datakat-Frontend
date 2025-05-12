'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { LLMAnalysisResponse, AnomalyGroupResponse } from '@/types/anomaly';
import { AnomalyLogEntry } from '@/components/anomalies/types';

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
  filters: {
    search: string;
    eventIdFilter: string;
    levelFilter: string;
    componentFilter: string;
  };
  selectedGroupId: string | null;
  settings: {
    autoDetect: boolean;
    notify: boolean;
    threshold: number;
  };
  analysisResults: Record<string, LLMAnalysisResponse>;
  page: number;
  anomalies: AnomalyLogEntry[];
  chartData: ChartData | null;
  groupedAnomalies: {
    groups: AnomalyGroupResponse[];
    total: number;
  };
}

const initialState: AnomalyState = {
  filters: {
    search: '',
    eventIdFilter: 'all',
    levelFilter: 'all',
    componentFilter: 'all',
  },
  selectedGroupId: null,
  settings: {
    autoDetect: true,
    notify: true,
    threshold: 60,
  },
  analysisResults: {},
  page: 1,
  anomalies: [],
  chartData: null,
  groupedAnomalies: {
    groups: [],
    total: 0,
  },
};

const anomalySlice = createSlice({
  name: 'anomaly',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<{
        field: keyof AnomalyState['filters'];
        value: string;
      }>,
    ) => {
      state.filters[action.payload.field] = action.payload.value;
    },

    setSelectedGroupId: (state, action: PayloadAction<string | null>) => {
      state.selectedGroupId = action.payload;
    },

    setSettings: (
      state,
      action: PayloadAction<Partial<AnomalyState['settings']>>,
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
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
      state.page += 1;
    },

    setAnomalies: (state, action: PayloadAction<AnomalyLogEntry[]>) => {
      state.anomalies = action.payload;
    },

    setChartData: (state, action: PayloadAction<ChartData>) => {
      state.chartData = action.payload;
    },

    appendGroupedAnomalies: (
      state,
      action: PayloadAction<{
        groups: AnomalyGroupResponse[];
        total: number;
      }>,
    ) => {
      state.groupedAnomalies.groups = [
        ...state.groupedAnomalies.groups,
        ...action.payload.groups,
      ];
      state.groupedAnomalies.total = action.payload.total;
    },

    resetGroupedAnomalies: (state) => {
      state.groupedAnomalies = initialState.groupedAnomalies;
    },
  },
});

export const {
  setFilters,
  setSelectedGroupId,
  setSettings,
  resetFilters,
  setAnalysisResult,
  clearAnalysisResult,
  clearAllAnalysisResults,
  loadMore,
  setAnomalies,
  setChartData,
  appendGroupedAnomalies,
  resetGroupedAnomalies,
} = anomalySlice.actions;

export default anomalySlice.reducer;

// Selectors
export const selectFilters = (state: RootState) => state.anomaly.filters;
export const selectSelectedGroupId = (state: RootState) =>
  state.anomaly.selectedGroupId;
export const selectSettings = (state: RootState) => state.anomaly.settings;
export const selectAnalysisResult = (state: RootState) => {
  const selectedGroupId = state.anomaly.selectedGroupId;
  return selectedGroupId
    ? state.anomaly.analysisResults[selectedGroupId]
    : null;
};
export const selectAnalysisResults = (state: RootState) =>
  state.anomaly.analysisResults;
export const selectPage = (state: RootState) => state.anomaly.page;
export const selectAnomalies = (state: RootState) => state.anomaly.anomalies;
export const selectChartData = (state: RootState) => state.anomaly.chartData;
export const selectGroupedAnomalies = (state: RootState) =>
  state.anomaly.groupedAnomalies;
