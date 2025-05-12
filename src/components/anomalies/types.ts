export interface AnomalyLogEntry {
  id: string;
  timestamp: string;
  level: string;
  component: string;
  content: string;
  event_id: string;
  metadata?: {
    source?: string;
    environment?: string;
    host?: string;
    service?: string;
    trace_id?: string;
    span_id?: string;
    user_id?: string;
    session_id?: string;
    version?: string;
    tags?: string[];
    attributes?: Record<string, string | number | boolean>;
    [key: string]: unknown;
  };
  is_anomaly?: boolean;
}

export interface AnomalyGroupResponse {
  event_id: string;
  count: number;
  first_occurrence: string;
  items: AnomalyLogEntry[];
}

export interface GroupedAnomalyResponse {
  groups: AnomalyGroupResponse[];
  total: number;
}

export interface PaginatedAnomalyResponse {
  items: AnomalyLogEntry[];
  total: number;
}

export interface LLMAnalysisResponse {
  anomaly_detection: {
    confidence: number;
    explanation: string;
  };
  root_cause_analysis: {
    cause: string;
    impact: string;
    severity: number;
  };
  recommendations: {
    immediate_actions: string[];
    long_term_actions: string[];
  };
}

export interface ContentGroup extends AnomalyGroupResponse {
  analysisResult?: LLMAnalysisResponse;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface EventDataPoint {
  id: string;
  count: number;
  component: string;
  level: string;
  firstOccurrence: string;
  lastOccurrence: string;
}

export interface TimeDataPoint {
  hour: string;
  count: number;
}

export interface ChartData {
  componentData: ChartDataPoint[];
  levelData: ChartDataPoint[];
  eventData: EventDataPoint[];
  timeData: TimeDataPoint[];
}
