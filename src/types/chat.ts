// package dto

export type ChartType = 'line' | 'bar' | 'pie';

export interface ChartData {
  type: ChartType;
  title: string;
  data: Array<{
    time?: string;
    value?: number;
    server?: string;
    service?: string;
    errors?: number;
    level?: string;
    count?: number;
    component?: string;
  }>;
  config?: {
    xField?: string;
    yField?: string;
    seriesField?: string;
    smooth?: boolean;
    angleField?: string;
    colorField?: string;
    label?: {
      position?: string;
      style?: {
        fontSize?: number;
      };
    };
    meta?: {
      [key: string]: {
        alias?: string;
      };
    };
  };
}

export type AggregationType = 'COUNT' | 'AVG' | 'SUM' | 'NONE';
export type IntentType = 'query_metric' | 'query_log' | 'unknown';
export type ResultType =
  | 'timeseries'
  | 'table'
  | 'scalar'
  | 'log_list'
  | 'error';
export type Operator = '=' | '!=' | 'IN' | 'NOT IN' | 'CONTAINS';

export interface TimeRange {
  start: string;
  end: string;
}

export interface QueryFilter {
  field: string; // e.g., "level", "component", etc.
  operator: Operator;
  value: string | number | Array<string | number>;
}

export interface LLMAnalysisResult {
  intent: IntentType;
  metric_name: string | null;
  time_range: TimeRange;
  filters: QueryFilter[];
  group_by: string[];
  aggregation: AggregationType;
  visualization_hint?: ChartType | null;
}

export interface NLVQueryResponse {
  originalQuery: string;
  interpretedQuery?: LLMAnalysisResult;
  resultType: ResultType;
  columns?: string[];
  data?: Array<Array<string | number>>;
  errorMessage?: string;
}

export interface NLVResponse {
  originalQuery: string;
  interpretedQuery?: LLMAnalysisResult;
  resultType: ResultType;
  columns?: string[];
  data?: Array<Array<string | number>>;
  errorMessage?: string;
}

export interface ChatResponse {
  content: string;
  data?: ChartData;
  nlvResponse?: NLVResponse;
}

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  data?: ChartData;
  nlvResponse?: NLVResponse;
}
