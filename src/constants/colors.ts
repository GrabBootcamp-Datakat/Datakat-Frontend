// Log Levels
export const LOG_LEVEL_COLORS = {
  ERROR: '#ff4d4f', // Red - Critical
  WARN: '#faad14', // Orange - Warning
  INFO: '#1890ff', // Blue - Information
  DEBUG: '#52c41a', // Green - Debug
  TRACE: '#722ed1', // Purple - Trace
  UNKNOWN: '#8c8c8c', // Gray - Unknown
  DEFAULT: '#8c8c8c', // Gray - Default/Fallback
} as const;

export const LOG_LEVEL_COLORS_TAG = {
  ERROR: 'red',
  WARN: 'orange',
  INFO: 'blue',
  DEBUG: 'green',
  TRACE: 'purple',
  UNKNOWN: 'gray',
  DEFAULT: 'default',
} as const;

// Severity Levels
export const SEVERITY_COLORS = {
  HIGH: '#ff4d4f',
  MEDIUM: '#faad14',
  LOW: '#1890ff',
} as const;

export const SEVERITY_COLORS_TAG = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'blue',
} as const;

// Status Colors
export const STATUS_COLORS = {
  SUCCESS: '#52c41a',
  ERROR: '#ff4d4f',
  WARNING: '#faad14',
  INFO: '#1890ff',
  PROCESSING: '#1890ff',
  DEFAULT: '#8c8c8c',
  UNKNOWN: '#8c8c8c',
} as const;

export const STATUS_COLORS_TAG = {
  SUCCESS: 'green',
  ERROR: 'red',
  WARNING: 'orange',
  INFO: 'blue',
  PROCESSING: 'blue',
  DEFAULT: 'gray',
} as const;

// Chart Colors
export const CHART_COLORS = [
  '#1890ff', // Primary Blue
  '#52c41a', // Success Green
  '#faad14', // Warning Yellow
  '#ff4d4f', // Error Red
  '#722ed1', // Purple
  '#13c2c2', // Cyan
  '#eb2f96', // Pink
  '#fa8c16', // Orange
] as const;

// Component Colors
export const COMPONENT_COLORS = {
  // Text
  TEXT_PRIMARY: 'rgba(0, 0, 0, 0.85)',
  TEXT_SECONDARY: 'rgba(0, 0, 0, 0.45)',

  // Borders
  BORDER_LIGHT: '#f0f0f0',

  // Backgrounds
  BG_LIGHT: '#fafafa',
  BG_SELECTED: '#f0f5ff',

  // Shadows
  SHADOW_LIGHT: '0 2px 8px rgba(0,0,0,0.1)',
} as const;

// Timeline Colors
export const TIMELINE_COLORS = {
  PRIMARY: '#1890ff',
  SUCCESS: '#52c41a',
  ERROR: '#ff4d4f',
  WARNING: '#faad14',
  INFO: '#722ed1',
} as const;
