'use client';
import { Card, Typography, Space, Tag } from 'antd';
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
    if (!data) return { total: 0, anomalies: 0, severity: 'low' as const };
    const anomalies = data.logs.slice(0, 3);
    return {
      total: data.totalCount,
      anomalies: anomalies.length,
      severity: anomalies.some((log) => log.level === LogLevel.ERROR)
        ? ('high' as const)
        : ('medium' as const),
    };
  }, [data]);

  const anomalies = useMemo(() => {
    if (!data) return [];
    return data.logs.slice(0, 3);
  }, [data]);

  if (isLoading || !data) {
    return <ChartSkeleton title="Anomaly Detection" />;
  }

  return (
    <Card title="Anomaly Detection" hoverable style={{ height: '100%' }}>
      <AnomalyStats stats={stats} />
      <AnomalyList anomalies={anomalies} />
    </Card>
  );
});

export default AnomalyDetectionCard;
AnomalyDetectionCard.displayName = 'AnomalyDetection';

interface AnomalyStats {
  total: number;
  anomalies: number;
  severity: 'high' | 'medium' | 'low';
}

const AnomalyStats = memo(({ stats }: { stats: AnomalyStats }) => {
  const severityColor = {
    high: 'red',
    medium: 'orange',
    low: 'blue',
  };

  return (
    <div className="flex items-center justify-between">
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
    <div className="mt-4 space-y-2">
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
