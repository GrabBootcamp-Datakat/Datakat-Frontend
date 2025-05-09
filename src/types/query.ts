export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
}

export enum AggregationType {
  COUNT = 'COUNT',
  AVG = 'AVG',
  SUM = 'SUM',
  NONE = 'NONE',
}

export enum IntentType {
  QUERY_METRIC = 'query_metric',
  QUERY_LOG = 'query_log',
  UNKNOWN = 'unknown',
}

export enum ResultType {
  TIMESERIES = 'timeseries',
  TABLE = 'table',
  SCALAR = 'scalar',
  LOG_LIST = 'log_list',
  ERROR = 'error',
}

export enum Operator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  IN = 'IN',
  NOT_IN = 'NOT IN',
  CONTAINS = 'CONTAINS',
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface QueryFilter {
  field: string;
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
  // visualization_hint?: ChartType | null;
  visualization_hint: string;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  limit?: number;
}

export interface NLVQueryRequest {
  conversationId?: string;
  query: string;
}

export interface NLVQueryResponse {
  conversationId: string;
  originalQuery?: string;
  interpretedQuery?: LLMAnalysisResult;
  resultType: ResultType;
  columns?: string[];
  data?: Array<Array<string | number>>;
  errorMessage?: string;
}
