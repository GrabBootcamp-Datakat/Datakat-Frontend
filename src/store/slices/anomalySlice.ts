'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AnomalyLogResponse,
  LLMAnalysisResponse,
  ContentGroup,
} from '@/types/anomaly';
import { RootState } from '../store';

export interface ChartData {
  componentData: Array<{ name: string; value: number }>;
  levelData: Array<{ name: string; value: number }>;
  eventData: Array<{
    id: string;
    count: number;
    component: string;
    level: string;
    firstOccurrence: string;
    lastOccurrence: string;
  }>;
  timeData: Array<{ hour: string; count: number }>;
}

export interface AnomalyState {
  pagination: {
    limit: number;
    offset: number;
  };

  filters: {
    search: string;
    eventIdFilter: string;
    levelFilter: string;
    componentFilter: string;
  };

  uniqueValues: {
    eventIds: string[];
    levels: string[];
    components: string[];
  };

  // content groups
  contentGroups: ContentGroup[];
  selectedGroup: ContentGroup | null;

  // chart
  chartData: ChartData;

  settings: {
    autoDetect: boolean;
    notify: boolean;
    threshold: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: AnomalyState = {
  pagination: {
    limit: 50,
    offset: 0,
  },

  filters: {
    search: '',
    eventIdFilter: 'all',
    levelFilter: 'all',
    componentFilter: 'all',
  },

  uniqueValues: {
    eventIds: [],
    levels: [],
    components: [],
  },

  contentGroups: [],
  selectedGroup: null,

  chartData: {
    componentData: [],
    levelData: [],
    eventData: [],
    timeData: [],
  },

  settings: {
    autoDetect: true,
    notify: true,
    threshold: 60,
  },
  isLoading: false,
  error: null,
};

// Memory-efficient data extraction functions
const extractUniqueValues = (anomalies: AnomalyLogResponse[]) => {
  const eventIds = new Set<string>();
  const levels = new Set<string>();
  const components = new Set<string>();

  const len = anomalies.length;
  for (let i = 0; i < len; i++) {
    const item = anomalies[i];
    if (item.event_id) eventIds.add(item.event_id);
    if (item.level) levels.add(item.level);
    if (item.component) components.add(item.component);
  }

  return {
    eventIds: Array.from(eventIds) as string[],
    levels: Array.from(levels) as string[],
    components: Array.from(components) as string[],
  };
};

const buildContentGroups = (anomalies: AnomalyLogResponse[]) => {
  const groups = new Map();
  const len = anomalies.length;

  for (let i = 0; i < len; i++) {
    const anomaly = anomalies[i];
    const content = anomaly.content;
    if (!content) continue;

    let group = groups.get(content);
    if (!group) {
      group = {
        content,
        count: 0,
        anomalies: [],
        timestamps: [],
        analysisResult: null,
      };
      groups.set(content, group);
    }

    group.count++;
    // Only store the 5 most recent anomalies per group
    if (group.anomalies.length < 5) {
      group.anomalies.push(anomaly);
    } else {
      // Replace oldest if new one is newer
      const oldestIndex = group.anomalies.reduce(
        (
          oldest: number,
          curr: number,
          idx: number,
          arr: AnomalyLogResponse[],
        ) =>
          new Date(arr[oldest].timestamp) < new Date(arr[curr].timestamp)
            ? oldest
            : idx,
        0,
      );
      if (
        new Date(anomaly.timestamp) >
        new Date(group.anomalies[oldestIndex].timestamp)
      ) {
        group.anomalies[oldestIndex] = anomaly;
      }
    }
    group.timestamps.push(anomaly.timestamp);
  }

  // Convert to array and sort once
  return Array.from(groups.values()).sort((a, b) => b.count - a.count);
};

const buildChartData = (anomalies: AnomalyLogResponse[]) => {
  const componentCounts: Record<string, number> = {};
  const levelCounts: Record<string, number> = {};
  const eventMap: Map<
    string,
    {
      id: string;
      count: number;
      component: string;
      level: string;
      firstOccurrence: string;
      lastOccurrence: string;
    }
  > = new Map();
  const timeCounts: Record<string, number> = {};

  const len = anomalies.length;
  for (let i = 0; i < len; i++) {
    const item = anomalies[i];

    // Component data
    componentCounts[item.component] =
      (componentCounts[item.component] || 0) + 1;

    // Level data
    levelCounts[item.level] = (levelCounts[item.level] || 0) + 1;

    // Event data
    if (item.event_id) {
      const eventTime = new Date(item.timestamp).toLocaleString();
      const existingEvent = eventMap.get(item.event_id);

      if (existingEvent) {
        existingEvent.count++;
        existingEvent.lastOccurrence = eventTime;
        if (new Date(eventTime) < new Date(existingEvent.firstOccurrence)) {
          existingEvent.firstOccurrence = eventTime;
        }
      } else {
        eventMap.set(item.event_id, {
          id: item.event_id,
          count: 1,
          component: item.component,
          level: item.level,
          firstOccurrence: eventTime,
          lastOccurrence: eventTime,
        });
      }
    }

    // Time data
    const hourKey = new Date(item.timestamp).toISOString().slice(0, 13);
    const localHour = new Date(hourKey).toLocaleString();
    timeCounts[localHour] = (timeCounts[localHour] || 0) + 1;
  }

  return {
    componentData: Object.entries(componentCounts).map(([name, value]) => ({
      name,
      value,
    })),
    levelData: Object.entries(levelCounts).map(([name, value]) => ({
      name,
      value,
    })),
    eventData: Array.from(eventMap.values()),
    timeData: Object.entries(timeCounts).map(([hour, count]) => ({
      hour,
      count,
    })),
  };
};

const updateChartData = (existing: ChartData, anomaly: AnomalyLogResponse) => {
  // Create shallow copies of all arrays and objects
  const updated = {
    componentData: [...existing.componentData],
    levelData: [...existing.levelData],
    eventData: [...existing.eventData],
    timeData: [...existing.timeData],
  };

  // --- Component ---
  const compIndex = updated.componentData.findIndex(
    (d) => d.name === anomaly.component,
  );
  if (compIndex >= 0) {
    updated.componentData[compIndex] = {
      ...updated.componentData[compIndex],
      value: updated.componentData[compIndex].value + 1,
    };
  } else {
    updated.componentData.push({ name: anomaly.component, value: 1 });
  }

  // --- Level ---
  const levelIndex = updated.levelData.findIndex(
    (d) => d.name === anomaly.level,
  );
  if (levelIndex >= 0) {
    updated.levelData[levelIndex] = {
      ...updated.levelData[levelIndex],
      value: updated.levelData[levelIndex].value + 1,
    };
  } else {
    updated.levelData.push({ name: anomaly.level, value: 1 });
  }

  // --- Event ---
  if (anomaly.event_id) {
    const time = new Date(anomaly.timestamp).toLocaleString();
    const eventIndex = updated.eventData.findIndex(
      (e) => e.id === anomaly.event_id,
    );

    if (eventIndex >= 0) {
      const existingEvent = updated.eventData[eventIndex];
      updated.eventData[eventIndex] = {
        ...existingEvent,
        count: existingEvent.count + 1,
        lastOccurrence: time,
        firstOccurrence:
          new Date(time) < new Date(existingEvent.firstOccurrence)
            ? time
            : existingEvent.firstOccurrence,
      };
    } else {
      updated.eventData.push({
        id: anomaly.event_id,
        count: 1,
        component: anomaly.component,
        level: anomaly.level,
        firstOccurrence: time,
        lastOccurrence: time,
      });
    }
  }

  // --- Time ---
  const hourKey = new Date(anomaly.timestamp).toISOString().slice(0, 13);
  const localHour = new Date(hourKey).toLocaleString();
  const timeIndex = updated.timeData.findIndex((d) => d.hour === localHour);

  if (timeIndex >= 0) {
    updated.timeData[timeIndex] = {
      ...updated.timeData[timeIndex],
      count: updated.timeData[timeIndex].count + 1,
    };
  } else {
    updated.timeData.push({ hour: localHour, count: 1 });
  }

  return updated;
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

    setAnomalies: (state, action: PayloadAction<AnomalyLogResponse[]>) => {
      const anomalies = action.payload;

      // Extract unique values
      state.uniqueValues = extractUniqueValues(anomalies);

      // Build content groups
      state.contentGroups = buildContentGroups(anomalies);

      // Set selected group if not already set
      if (!state.selectedGroup && state.contentGroups.length > 0) {
        state.selectedGroup = state.contentGroups[0];
      }

      // Build chart data
      state.chartData = buildChartData(anomalies);
    },

    addAnomaly: (state, action: PayloadAction<AnomalyLogResponse[]>) => {
      const newAnomalies = action.payload;
      if (!newAnomalies.length) return;

      // 1. Update unique values (only add new values)
      const { eventIds, levels, components } = state.uniqueValues;
      const uniqueUpdates = extractUniqueValues(newAnomalies);

      // Efficiently merge unique values
      state.uniqueValues = {
        eventIds: [
          ...eventIds,
          ...uniqueUpdates.eventIds.filter(
            (id: string) => !eventIds.includes(id),
          ),
        ],
        levels: [
          ...levels,
          ...uniqueUpdates.levels.filter(
            (level: string) => !levels.includes(level),
          ),
        ],
        components: [
          ...components,
          ...uniqueUpdates.components.filter(
            (comp: string) => !components.includes(comp),
          ),
        ],
      };

      // 2. Update content groups
      const groupMap = new Map();
      state.contentGroups.forEach((group) => {
        groupMap.set(group.content, group);
      });

      for (let i = 0; i < newAnomalies.length; i++) {
        const anomaly = newAnomalies[i];
        if (!anomaly.content) continue;

        const existingGroup = groupMap.get(anomaly.content);
        if (existingGroup) {
          existingGroup.count += 1;

          // Keep only 5 most recent anomalies
          if (existingGroup.anomalies.length < 5) {
            existingGroup.anomalies.push(anomaly);
          } else {
            // Find oldest anomaly
            let oldestIdx = 0;
            let oldestTime = new Date(
              existingGroup.anomalies[0].timestamp,
            ).getTime();

            for (let j = 1; j < 5; j++) {
              const currTime = new Date(
                existingGroup.anomalies[j].timestamp,
              ).getTime();
              if (currTime < oldestTime) {
                oldestTime = currTime;
                oldestIdx = j;
              }
            }

            // Replace if newer
            const anomalyTime = new Date(anomaly.timestamp).getTime();
            if (anomalyTime > oldestTime) {
              existingGroup.anomalies[oldestIdx] = anomaly;
            }
          }

          existingGroup.timestamps.push(anomaly.timestamp);
        } else {
          const oldGroup = state.contentGroups.find(
            (g) => g.content === anomaly.content,
          );

          const newGroup = {
            content: anomaly.content,
            count: 1,
            anomalies: [anomaly],
            timestamps: [anomaly.timestamp],
            analysisResult: oldGroup?.analysisResult || null,
          };
          groupMap.set(anomaly.content, newGroup);
        }
      }

      // Convert to array & sort once
      state.contentGroups = Array.from(groupMap.values()).sort(
        (a, b) => b.count - a.count,
      );

      // Update selected group reference if needed
      if (state.selectedGroup) {
        state.selectedGroup =
          state.contentGroups.find(
            (group) => group.content === state.selectedGroup?.content,
          ) || null;
      }

      // 3. Update chartData
      for (let i = 0; i < newAnomalies.length; i++) {
        state.chartData = updateChartData(state.chartData, newAnomalies[i]);
      }
    },

    setSelectedGroup: (state, action: PayloadAction<ContentGroup | null>) => {
      if (action.payload) {
        // Find the group in contentGroups to ensure we have the latest data
        const targetGroup = state.contentGroups.find(
          (g) => g.content === action.payload?.content,
        );
        if (targetGroup) {
          // Preserve the analysis result when selecting a group
          state.selectedGroup = {
            ...targetGroup,
            analysisResult:
              targetGroup.analysisResult || action.payload.analysisResult,
          };
        } else {
          state.selectedGroup = action.payload;
        }
      } else {
        state.selectedGroup = null;
      }
    },

    setAnalysisResult: (state, action: PayloadAction<LLMAnalysisResponse>) => {
      if (state.selectedGroup) {
        const selectedContent = state.selectedGroup.content;
        state.selectedGroup.analysisResult = { ...action.payload };
        const targetGroup = state.contentGroups.find(
          (g) => g.content === selectedContent,
        );
        if (targetGroup) {
          targetGroup.analysisResult = { ...action.payload };
        }
      }
    },

    setPagination: (
      state,
      action: PayloadAction<Partial<AnomalyState['pagination']>>,
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    setSettings: (
      state,
      action: PayloadAction<Partial<AnomalyState['settings']>>,
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    loadMore: (state) => {
      state.pagination.offset += state.pagination.limit;
    },

    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  setAnomalies,
  addAnomaly,
  setSelectedGroup,
  setAnalysisResult,
  setFilters,
  setPagination,
  setSettings,
  setLoading,
  setError,
  resetFilters,
  loadMore,
  resetPagination,
} = anomalySlice.actions;

export default anomalySlice.reducer;

// Memoized selectors
export const selectFilters = (state: RootState) => state.anomaly.filters;
export const selectUniqueValues = (state: RootState) =>
  state.anomaly.uniqueValues;
export const selectContentGroups = (state: RootState) =>
  state.anomaly.contentGroups;
export const selectSelectedGroup = (state: RootState) =>
  state.anomaly.selectedGroup;
export const selectAnalysisResult = (state: RootState) =>
  state.anomaly.selectedGroup?.analysisResult;
export const selectPagination = (state: RootState) => state.anomaly.pagination;
export const selectSettings = (state: RootState) => state.anomaly.settings;
export const selectIsLoading = (state: RootState) => state.anomaly.isLoading;
export const selectError = (state: RootState) => state.anomaly.error;
export const selectChartData = (state: RootState) => state.anomaly.chartData;
