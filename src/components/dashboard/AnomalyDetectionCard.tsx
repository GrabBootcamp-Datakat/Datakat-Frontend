'use client';
import { Card, Typography, Space, Tag } from 'antd';
import { memo, useMemo } from 'react';
import { useGetLogsQuery } from '@/store/api/logsApi';
import { ChartSkeleton } from '../common/Skeleton';
import type { LogEntry } from '@/types/logs';

const { Text } = Typography;

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
  const severityColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return 'red';
      case 'WARN':
        return 'orange';
      default:
        return 'blue';
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {anomalies.map((anomaly) => (
        <Card key={anomaly.id} size="small">
          <Space direction="vertical" size={0}>
            <div className="flex items-center justify-between">
              <Text strong>{anomaly.service}</Text>
              <Tag color={severityColor(anomaly.level)}>{anomaly.level}</Tag>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(anomaly.timestamp).toLocaleString()}
            </Text>
            <Text style={{ fontSize: '12px' }}>{anomaly.message}</Text>
          </Space>
        </Card>
      ))}
    </div>
  );
});

AnomalyList.displayName = 'AnomalyList';

const AnomalyDetectionCard = memo(() => {
  const { data: logs, isLoading } = useGetLogsQuery();

  const stats = useMemo(() => {
    if (!logs) return { total: 0, anomalies: 0, severity: 'low' as const };
    const anomalies = logs
      .slice(0, 3)
      .filter((log) => log.level === 'ERROR' || log.level === 'WARN');
    return {
      total: logs.length,
      anomalies: anomalies.length,
      severity: anomalies.some((log) => log.level === 'ERROR')
        ? ('high' as const)
        : ('medium' as const),
    };
  }, [logs]);

  const anomalies = useMemo(() => {
    if (!logs) return [];
    return logs
      .filter((log) => log.level === 'ERROR' || log.level === 'WARN')
      .slice(0, 3);
  }, [logs]);

  if (isLoading || !logs) {
    return <ChartSkeleton title="Anomaly Detection" />;
  }

  return (
    <Card
      title="Anomaly Detection"
      hoverable
      style={{ height: '100%' }}
      styles={{
        body: {
          padding: '12px',
        },
      }}
    >
      <AnomalyStats stats={stats} />
      <AnomalyList anomalies={anomalies} />
    </Card>
  );
});

export default AnomalyDetectionCard;
AnomalyDetectionCard.displayName = 'AnomalyDetection';
