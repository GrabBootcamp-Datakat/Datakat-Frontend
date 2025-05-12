export interface AnomalyStatsProps {
  total: number;
  anomalies: number;
  severity: 'high' | 'medium' | 'low';
  rate: string;
  trend: 'up' | 'down' | 'flat';
  mostFrequent: string;
  affectedApps: string[];
}
