'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogLevel, LogEntry, LogStats } from '@/types/logs';
import { RootState } from '../store';
import dayjs from 'dayjs';

export interface LogLevelSummary {
  total: number;
  info: number;
  warn: number;
  error: number;
  debug: number;
}

export interface DashboardState {
  dateRange: [string, string];
  logs: LogEntry[];
  summary: LogLevelSummary;
  logStats: LogStats;
  timeSeriesData: Array<{ time: string; count: number }>;
  timeDistributionData: Array<{
    hour: string;
    INFO: number;
    WARN: number;
    ERROR: number;
  }>;
  applicationFrequencyData: Array<{ application: string; count: number }>;
  componentData: Array<{ name: string; value: number }>;
  componentAnalysisData: Array<{ component: string; count: number }>;
  isLoading: boolean;
}

const initialState: DashboardState = {
  dateRange: [dayjs().subtract(9, 'year').toISOString(), dayjs().toISOString()],
  logs: [],
  summary: {
    total: 0,
    info: 0,
    warn: 0,
    error: 0,
    debug: 0,
  },
  logStats: {
    total: 0,
    byLevel: {
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0,
      [LogLevel.DEBUG]: 0,
      [LogLevel.UNKNOWN]: 0,
    },
    byComponent: {},
    byHour: {},
    byDate: {},
  },
  timeSeriesData: [],
  timeDistributionData: [],
  applicationFrequencyData: [],
  componentData: [],
  componentAnalysisData: [],
  isLoading: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange: (
      state,
      action: PayloadAction<[dayjs.Dayjs, dayjs.Dayjs]>,
    ) => {
      state.dateRange = [
        action.payload[0].toISOString(),
        action.payload[1].toISOString(),
      ];
    },

    setLogs: (state, action: PayloadAction<LogEntry[]>) => {
      state.logs = action.payload;

      // calculate summary
      state.summary = {
        total: state.logs.length,
        info: state.logs.filter((log) => log.level === LogLevel.INFO).length,
        warn: state.logs.filter((log) => log.level === LogLevel.WARN).length,
        error: state.logs.filter((log) => log.level === LogLevel.ERROR).length,
        debug: state.logs.filter((log) => log.level === LogLevel.DEBUG).length,
      };

      // Calculate time series data
      const timeSeriesMap = new Map<string, number>();
      state.logs.forEach((log) => {
        const time = dayjs(log['@timestamp']).format('YYYY-MM-DD HH:mm:ss');
        timeSeriesMap.set(time, (timeSeriesMap.get(time) || 0) + 1);
      });
      state.timeSeriesData = Array.from(timeSeriesMap.entries()).map(
        ([time, count]) => ({
          time,
          count,
        }),
      );

      // Calculate time distribution data
      const hourlyDistribution = Array.from({ length: 24 }, (_, i) => ({
        hour: i.toString(),
        INFO: 0,
        WARN: 0,
        ERROR: 0,
      }));
      state.logs.forEach((log) => {
        const hour = dayjs(log['@timestamp']).hour();
        if (log.level === LogLevel.INFO) {
          hourlyDistribution[hour].INFO++;
        } else if (log.level === LogLevel.WARN) {
          hourlyDistribution[hour].WARN++;
        } else if (log.level === LogLevel.ERROR) {
          hourlyDistribution[hour].ERROR++;
        }
      });
      state.timeDistributionData = hourlyDistribution;

      // Calculate application frequency data
      const applicationFrequencyMap = new Map<string, number>();
      state.logs.forEach((log) => {
        const application = log.application;
        applicationFrequencyMap.set(
          application,
          (applicationFrequencyMap.get(application) || 0) + 1,
        );
      });
      state.applicationFrequencyData = Array.from(
        applicationFrequencyMap.entries(),
      )
        .map(([application, count]) => ({ application, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Calculate component data
      const componentMap = new Map<string, number>();
      state.logs.forEach((log) => {
        if (log.component) {
          componentMap.set(
            log.component,
            (componentMap.get(log.component) || 0) + 1,
          );
        }
      });
      state.componentData = Array.from(componentMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      // Calculate component analysis data
      state.componentAnalysisData = Array.from(componentMap.entries())
        .map(([component, count]) => ({ component, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // calculate log stats
      state.logs.forEach((log) => {
        try {
          // Count by level
          state.logStats.byLevel[log.level]++;

          // Count by component
          if (log.component) {
            state.logStats.byComponent[log.component] =
              (state.logStats.byComponent[log.component] || 0) + 1;
          }

          // Count by hour
          if (log['@timestamp']) {
            const hour = dayjs(log['@timestamp']).hour();
            if (!state.logStats.byHour[hour]) {
              state.logStats.byHour[hour] = {
                [LogLevel.INFO]: 0,
                [LogLevel.WARN]: 0,
                [LogLevel.ERROR]: 0,
                [LogLevel.DEBUG]: 0,
                [LogLevel.UNKNOWN]: 0,
              };
            }
            state.logStats.byHour[hour][log.level]++;
          }

          // Count by date
          if (log['@timestamp']) {
            const date = dayjs(log['@timestamp']).format('YYYY-MM-DD');
            state.logStats.byDate[date] =
              (state.logStats.byDate[date] || 0) + 1;
          }
        } catch (error) {
          console.error('Error processing log:', log, error);
        }
      });
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setDateRange, setLogs, setIsLoading } = dashboardSlice.actions;
export default dashboardSlice.reducer;

export const selectDateRange = (state: RootState) => state.dashboard.dateRange;
export const selectLogs = (state: RootState) => state.dashboard.logs;
export const selectSummary = (state: RootState) => state.dashboard.summary;
export const selectIsLoading = (state: RootState) => state.dashboard.isLoading;
export const selectLogStats = (state: RootState) => state.dashboard.logStats;
export const selectTimeSeriesData = (state: RootState) =>
  state.dashboard.timeSeriesData;
export const selectTimeDistributionData = (state: RootState) =>
  state.dashboard.timeDistributionData;
export const selectApplicationFrequencyData = (state: RootState) =>
  state.dashboard.applicationFrequencyData;
export const selectComponentData = (state: RootState) =>
  state.dashboard.componentData;
export const selectComponentAnalysisData = (state: RootState) =>
  state.dashboard.componentAnalysisData;
