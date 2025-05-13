'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogLevel, SortBy } from '@/types/logs';
import type { SortOrder } from 'antd/es/table/interface';
import { RootState } from '../store';
import dayjs from 'dayjs';

interface FilterState {
  searchQuery: string;
  level: LogLevel[];
  applicationFilter: string[];
  dateRange: [string, string];
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
}

interface SortState {
  sortField: SortBy;
  sortOrder: SortOrder | undefined;
}

export interface LogsState {
  filters: FilterState;
  pagination: PaginationState;
  sort: SortState;
  activeTab: string;
}

const initialState: LogsState = {
  filters: {
    searchQuery: '',
    level: [],
    applicationFilter: [],
    dateRange: [
      dayjs().subtract(9, 'year').toISOString(),
      dayjs().toISOString(),
    ],
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },
  sort: {
    sortField: SortBy.TIMESTAMP,
    sortOrder: 'descend',
  },
  activeTab: 'all',
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      state.pagination.currentPage = 1;
    },

    setlevel: (state, action: PayloadAction<LogLevel[]>) => {
      state.filters.level = action.payload;
      state.pagination.currentPage = 1;
    },

    setApplicationFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.applicationFilter = action.payload;
      state.pagination.currentPage = 1;
    },

    setDateRange: (
      state,
      action: PayloadAction<[dayjs.Dayjs, dayjs.Dayjs]>,
    ) => {
      state.filters.dateRange = [
        action.payload[0].toISOString(),
        action.payload[1].toISOString(),
      ];
      state.pagination.currentPage = 1;
    },

    setPagination: (state, action: PayloadAction<PaginationState>) => {
      state.pagination = action.payload;
    },

    setSort: (state, action: PayloadAction<SortState>) => {
      state.sort = action.payload;
    },

    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
      state.sort = initialState.sort;
      state.activeTab = initialState.activeTab;
    },
  },
});

export const {
  // filters
  setSearchQuery,
  setlevel,
  setApplicationFilter,
  setDateRange,
  // pagination
  setPagination,
  // sort
  setSort,
  // active tab
  setActiveTab,
  // reset
  resetFilters,
} = logsSlice.actions;

export default logsSlice.reducer;

export const selectLogs = (state: RootState) => state.logs;
export const selectLogsFilters = (state: RootState) => state.logs.filters;
export const selectLogsPagination = (state: RootState) => state.logs.pagination;
export const selectLogsSort = (state: RootState) => state.logs.sort;
export const selectLogsActiveTab = (state: RootState) => state.logs.activeTab;
