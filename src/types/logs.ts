export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  UNKNOWN = 'UNKNOWN',
}

export enum TimeUnit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export enum SortBy {
  TIMESTAMP = '@timestamp',
  LEVEL = 'level',
  COMPONENT = 'component',
  APPLICATION = 'application',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface LogMetadata {
  errorCode?: string;
  errorType?: string;
  stackTrace?: string;
  userId?: string;
  requestId?: string;
  duration?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface Log {
  LineId: number;
  Date: string;
  Time: string;
  Level: LogLevel;
  Component: string;
  Content: string;
  EventId: string;
}

export interface LogEntry {
  '@timestamp': string;
  level: LogLevel;
  component: string;
  content: string;
  application: string;
  source_file: string;
  raw_log: string;
  metadata?: LogMetadata;
}

export interface LogSearchRequest {
  startTime: string;
  endTime: string;
  query?: string;
  levels?: LogLevel[];
  applications?: string[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page?: number;
  size?: number;
}

export interface LogSearchResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  size: number;
}

export interface LogApplicationsRequest {
  startTime: string;
  endTime: string;
}

export interface LogApplicationsResponse {
  applications: string[];
}

export interface LogCountDto {
  total: number;
  INFO: number;
  WARN: number;
  ERROR: number;
  DEBUG: number;
}

export interface TimeDataPoint {
  time: string;
  count: number;
}

export interface TimeDistributionDto {
  hour: string;
  INFO: number;
  WARN: number;
  ERROR: number;
}

export interface ComponentDataPoint {
  component: string;
  count: number;
}

export interface ComponentDto {
  name: string;
  value: number;
}

export interface EventFrequencyDto {
  eventId: string;
  count: number;
}

export interface LogStats {
  total: number;
  byLevel: Record<LogLevel, number>;
  byComponent: Record<string, number>;
  byHour: Record<string, Record<LogLevel, number>>;
  byDate: Record<string, number>;
}

export interface LogDetails {
  errorLogs: Log[];
  commonMessages: Array<{
    message: string;
    count: number;
  }>;
}
