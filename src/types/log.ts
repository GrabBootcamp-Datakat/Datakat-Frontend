export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

export enum TimeUnit {
  SECOND = 'second',
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
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

export interface TimeDataPoint {
  time: string;
  count: number;
}

export interface ComponentDataPoint {
  component: string;
  count: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  message: string;
}

export interface LogCountDto {
  total: number;
  INFO: number;
  WARN: number;
  ERROR: number;
  DEBUG: number;
}

export interface TimeDistributionDto {
  hour: string;
  INFO: number;
  WARN: number;
  ERROR: number;
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
