'use client';
import { Space, Tag, Typography } from 'antd';
import { memo } from 'react';

const { Text } = Typography;

type Severity = 'high' | 'medium' | 'low';
type Trend = 'up' | 'down' | 'flat';

export interface AnomalyStatsProps {
  total: number;
  anomalies: number;
  severity: Severity;
  rate: string;
  trend: Trend;
  mostFrequent: string;
  affectedApps: string[];
}

const AnomalyStats = memo(({ stats }: { stats: AnomalyStatsProps }) => {
  const severityColor: Record<Severity, string> = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  };

  const trendSymbol: Record<Trend, string> = {
    up: '↑ Increasing',
    down: '↓ Decreasing',
    flat: '→ Stable',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Space direction="vertical" size={0}>
          <Text type="secondary">Total Logs</Text>
          <Text strong>{stats.total}</Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text type="secondary">Anomalies</Text>
          <Text strong>{stats.anomalies}</Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text type="secondary">Severity</Text>
          <Tag color={severityColor[stats.severity]}>{stats.severity}</Tag>
        </Space>
      </div>

      <div className="flex justify-between pt-2">
        <Space direction="vertical" size={0}>
          <Text type="secondary">Anomaly Rate</Text>
          <Text strong>{stats.rate}</Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text type="secondary">Trend</Text>
          <Text
            strong
            style={{ color: stats.trend === 'up' ? 'red' : 'green' }}
          >
            {trendSymbol[stats.trend]}
          </Text>
        </Space>
        <Space direction="vertical" size={0}>
          <Text type="secondary">Affected</Text>
          <Text strong>{stats.affectedApps.join(', ')}</Text>
        </Space>
      </div>

      {stats.mostFrequent && (
        <div className="pt-2">
          <Text type="secondary">Most Frequent Issue</Text>
          <br />
          <Text strong>{stats.mostFrequent}</Text>
        </div>
      )}
    </div>
  );
});

AnomalyStats.displayName = 'AnomalyStats';
export default AnomalyStats;
