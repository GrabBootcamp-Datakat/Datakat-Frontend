export interface AnomalyLogResponse {
  id: string;
  timestamp: string;
  level: string;
  component: string;
  content: string;
  application?: string;
  source_file?: string;
  event_id?: string;
  is_anomaly: boolean;
}

export interface ContentGroup {
  content: string;
  count: number;
  anomalies: AnomalyLogResponse[];
  timestamps: string[];
  analysisResult: LLMAnalysisResponse | null;
}

export interface PaginatedAnomalyResponse {
  total: number;
  offset: number;
  limit: number;
  items: AnomalyLogResponse[];
}

export interface LLMAnalysisRequest {
  log_id: string;
}

interface RelatedEvent {
  timestamp: string;
  event: string;
  count: number;
}

interface AnomalyDetection {
  anomaly_id: string;
  timestamp: string;
  severity: string;
  type: string;
  description: string;
  affected_component: string;
  normal_threshold: string;
  observed_value: string;
  deviation_factor: string;
  related_events: RelatedEvent[];
  confidence: number;
}

interface RootCause {
  cause: string;
  description: string;
  evidence: string[];
  confidence: number;
}

interface PerformanceImpact {
  estimated_slowdown: string;
  reason: string;
  affected_operations: string[];
}

interface RootCauseAnalysis {
  analysis_id: string;
  anomaly_id: string;
  root_causes: RootCause[];
  performance_impact: PerformanceImpact;
}

interface Recommendation {
  action: string;
  description: string;
  specific_steps: string[];
  expected_outcome: string;
  priority: string;
  effort_level: string;
  success_rate: number;
}

interface OptimizationOpportunity {
  opportunity: string;
  description: string;
  implementation: string;
}

interface Recommendations {
  recommendation_id: string;
  anomaly_id: string;
  recommendations: Recommendation[];
  optimization_opportunities: OptimizationOpportunity[];
}

export interface LLMAnalysisResponse {
  anomaly_detection: AnomalyDetection;
  root_cause_analysis: RootCauseAnalysis;
  recommendations: Recommendations;
}
