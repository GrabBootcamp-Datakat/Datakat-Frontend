'use client';
import { Card, Typography, Space, Tag, Divider } from 'antd';
import { memo, useMemo } from 'react';
import { useGetLogsQuery } from '@/store/api/logsApi';
import { ChartSkeleton } from '../common/Skeleton';
import { LogEntry, LogLevel } from '@/types/logs';
import { useAppSelector } from '@/hooks/hook';
import { selectDateRange } from '@/store/slices/dashboardSlice';

const { Text } = Typography;

const AnomalyDetectionCard = memo(() => {
  const dateRange = useAppSelector(selectDateRange);
  const { data, isLoading } = useGetLogsQuery({
    startTime: dateRange[0],
    endTime: dateRange[1],
    levels: [LogLevel.ERROR, LogLevel.WARN],
  });

  const stats = useMemo(() => {
    if (!data) return { total: 0, anomalies: 0, severity: 'low' as const, rate: '0%', trend: 'flat', mostFrequent: '', affectedApps: [] };

    const anomalies = data.logs.slice(0, 10);
    const severity = anomalies.some((log) => log.level === LogLevel.ERROR) ? 'high' : 'medium';
    const rate = ((anomalies.length / data.totalCount) * 100).toFixed(1) + '%';

    const appCountMap: Record<string, number> = {};
    anomalies.forEach((log) => {
      appCountMap[log.application] = (appCountMap[log.application] || 0) + 1;
    });

    const mostFrequent = Object.entries(appCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
    const affectedApps = Object.keys(appCountMap);

    const trend = anomalies.length % 2 === 0 ? 'down' : 'up';

    return {
      total: data.totalCount,
      anomalies: anomalies.length,
      severity,
      rate,
      trend,
      mostFrequent,
      affectedApps,
    };
  }, [data]);

  const anomalies = useMemo(() => {
    return data?.logs.slice(0, 3) || [];
  }, [data]);

  if (isLoading || !data) {
    return <ChartSkeleton title="Anomaly Detection" />;
  }

  return (
    <Card title="Anomaly Detection" hoverable style={{ height: '100%' }}>
      <AnomalyStats stats={stats} />
      <Divider style={{ margin: '12px 0' }} />
      <AnomalyList anomalies={anomalies} />
    </Card>
  );
});

export default AnomalyDetectionCard;
AnomalyDetectionCard.displayName = 'AnomalyDetection';

interface AnomalyStatsProps {
  total: number;
  anomalies: number;
  severity: 'high' | 'medium' | 'low';
  rate: string;
  trend: 'up' | 'down' | 'flat';
  mostFrequent: string;
  affectedApps: string[];
}

const AnomalyStats = memo(({ stats }: { stats: AnomalyStatsProps }) => {
  const severityColor = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  };

  const trendSymbol = {
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
          <Text strong style={{ color: stats.trend === 'up' ? 'red' : 'green' }}>
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
          <Text type="secondary">Most Frequent Issue</Text><br />
          <Text strong>{stats.mostFrequent}</Text>
        </div>
      )}
    </div>
  );
});
AnomalyStats.displayName = 'AnomalyStats';

const AnomalyList = memo(({ anomalies }: { anomalies: LogEntry[] }) => {
  const severityColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return 'red';
      case LogLevel.WARN:
        return 'orange';
      default:
        return 'blue';
    }
  };

  return (
    <div className="space-y-2">
      {anomalies.map((anomaly) => (
        <Card key={anomaly['@timestamp']} size="small">
          <Space direction="vertical" size={0}>
            <div className="flex items-center justify-between">
              <Text strong>{anomaly.application}</Text>
              <Tag color={severityColor(anomaly.level)}>{anomaly.level}</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(anomaly['@timestamp']).toLocaleString()}
            </Text>
            <Text style={{ fontSize: '12px' }}>{anomaly.content}</Text>
          </Space>
        </Card>
      ))}
    </div>
  );
});
AnomalyList.displayName = 'AnomalyList';
