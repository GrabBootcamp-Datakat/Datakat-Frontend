import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogLevel, SortBy } from '@/types/logs';
import dayjs from 'dayjs';
import type { SortOrder } from 'antd/es/table/interface';

interface FilterState {
  searchQuery: string;
  levelFilter: LogLevel[];
  serviceFilter: string[];
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
    levelFilter: [],
    serviceFilter: [],
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

    setLevelFilter: (state, action: PayloadAction<LogLevel[]>) => {
      state.filters.levelFilter = action.payload;
      state.pagination.currentPage = 1;
    },

    setServiceFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.serviceFilter = action.payload;
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
  setSearchQuery,
  setLevelFilter,
  setServiceFilter,
  setDateRange,
  setPagination,
  setSort,
  setActiveTab,
  resetFilters,
} = logsSlice.actions;

export default logsSlice.reducer;
