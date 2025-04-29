import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TimeUnit, LogLevel } from "@/types/logsType";

export interface TimeDataPoint {
  time: string;
  [LogLevel.INFO]: number;
  [LogLevel.WARN]: number;
  [LogLevel.ERROR]: number;
  [LogLevel.DEBUG]: number;
}

export interface ComponentDataPoint {
  component: string;
  count: number;
  [LogLevel.INFO]: number;
  [LogLevel.WARN]: number;
  [LogLevel.ERROR]: number;
  [LogLevel.DEBUG]: number;
}

export interface ChartCustomizationState {
  timeAnalysis: {
    isCustomizing: boolean;
    query: string;
    timeUnit: TimeUnit;
    data: TimeDataPoint[];
  };
  componentAnalysis: {
    isCustomizing: boolean;
    query: string;
    data: ComponentDataPoint[];
  };
}

const initialState: ChartCustomizationState = {
  timeAnalysis: {
    isCustomizing: false,
    query: "",
    timeUnit: TimeUnit.HOUR,
    data: [],
  },
  componentAnalysis: {
    isCustomizing: false,
    query: "",
    data: [],
  },
};

const chartCustomizationSlice = createSlice({
  name: "chartCustomization",
  initialState,
  reducers: {
    setTimeAnalysisCustomization: (
      state,
      action: PayloadAction<Partial<ChartCustomizationState["timeAnalysis"]>>
    ) => {
      state.timeAnalysis = { ...state.timeAnalysis, ...action.payload };
    },
    setComponentAnalysisCustomization: (
      state,
      action: PayloadAction<
        Partial<ChartCustomizationState["componentAnalysis"]>
      >
    ) => {
      state.componentAnalysis = {
        ...state.componentAnalysis,
        ...action.payload,
      };
    },
    resetChartCustomization: (state) => {
      state.timeAnalysis = initialState.timeAnalysis;
      state.componentAnalysis = initialState.componentAnalysis;
    },
  },
});

export const {
  setTimeAnalysisCustomization,
  setComponentAnalysisCustomization,
  resetChartCustomization,
} = chartCustomizationSlice.actions;

export default chartCustomizationSlice.reducer;
