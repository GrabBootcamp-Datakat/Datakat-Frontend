export interface AnomalyLogEntry {
  id: string;
  timestamp: string;
  level: string;
  component: string;
  content: string;
  application?: string;
  source_file?: string;
  event_id: string;
  is_anomaly?: boolean;
  metadata?: Record<string, string>;
  detection_timestamp?: string;
}

export interface AnomalyGroupResponse {
  event_id: string;
  count: number;
  first_occurrence: string;
  last_occurrence: string;
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

export interface LLMAnalysisRequest {
  log_id: string;
}

export interface LLMAnalysisResponse {
  anomaly_detection: {
    anomaly_id: string;
    timestamp: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    type: string;
    description: string;
    affected_component: string;
    normal_threshold: string;
    observed_value: string;
    deviation_factor: string;
    related_events: Array<{
      timestamp: string;
      event: string;
      count: string;
    }>;
    confidence: number;
  };
  root_cause_analysis: {
    analysis_id: string;
    anomaly_id: string;
    root_causes: Array<{
      cause: string;
      description: string;
      evidence: string[];
      confidence: number;
    }>;
    performance_impact: {
      estimated_slowdown: string;
      reason: string;
      affected_operations: string[];
    };
  };
  recommendations: {
    recommendation_id: string;
    anomaly_id: string;
    recommendations: Array<{
      action: string;
      description: string;
      specific_steps: string[];
      expected_outcome: string;
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      effort_level: 'HIGH' | 'MEDIUM' | 'LOW';
      success_rate: number;
    }>;
    optimization_opportunities: Array<{
      opportunity: string;
      description: string;
      implementation: string;
    }>;
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
