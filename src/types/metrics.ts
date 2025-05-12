export enum MetricName {
  LOG_EVENT = 'log_event',
  ERROR_EVENT = 'error_event',
}

export enum TimeInterval {
  ONE_MINUTE = '1 minute',
  FIVE_MINUTES = '5 minute',
  TEN_MINUTES = '10 minute',
  THIRTY_MINUTES = '30 minute',
  ONE_HOUR = '1 hour',
  ONE_DAY = '1 day',
}

export enum GroupBy {
  LEVEL = 'level',
  COMPONENT = 'component',
  ERROR_KEY = 'error_key',
  APPLICATION = 'application',
  TOTAL = 'total',
}

export enum Dimension {
  LEVEL = 'level',
  COMPONENT = 'component',
  ERROR_KEY = 'error_key',
  APPLICATION = 'application',
}

export interface MetricSummaryRequest {
  startTime: string;
  endTime: string;
  applications?: string[];
}

export interface MetricSummaryResponse {
  totalLogEvents: number;
  totalErrorEvents: number;
}

export interface MetricTimeseriesRequest {
  startTime: string;
  endTime: string;
  applications?: string[];
  metricName: MetricName;
  interval: TimeInterval;
  groupBy?: GroupBy;
}

export interface MetricTimeseriesSeries {
  name: string;
  data: {
    timestamp: number;
    value: number;
  }[];
}

export interface MetricTimeseriesResponse {
  timestamps: string[];
  series: MetricTimeseriesSeries[];
}

export interface ApplicationListResponse {
  applications: string[];
}

export interface MetricDistributionRequest {
  startTime: string;
  endTime: string;
  applications?: string[];
  metricName: MetricName;
  dimension: Dimension;
}

export interface MetricDistributionItem {
  name: string;
  value: number;
}

export interface MetricDistributionResponse {
  distribution: MetricDistributionItem[];
}
