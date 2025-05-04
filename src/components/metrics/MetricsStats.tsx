'use client';
import { Card, Statistic } from 'antd';
import { useGetSummaryMetricsQuery } from '@/store/api/metricsApi';
import dayjs from 'dayjs';

interface MetricsStatsProps {
  dateRange: [string, string];
  selectedApplications: string[];
}

export default function MetricsStats({
  dateRange,
  selectedApplications,
}: MetricsStatsProps) {
  const { data: summaryData, isLoading } = useGetSummaryMetricsQuery({
    startTime: dateRange[0],
    endTime: dateRange[1],
    applications: selectedApplications,
  });

  const totalLogEvents = summaryData?.totalLogEvents || 0;
  const totalErrorEvents = summaryData?.totalErrorEvents || 0;
  const errorRate =
    totalLogEvents > 0
      ? ((totalErrorEvents / totalLogEvents) * 100).toFixed(2)
      : 0;

  // Calculate hours between start and end time
  const hoursDiff = dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'hour');
  const avgLogsPerHour =
    totalLogEvents > 0 && hoursDiff > 0
      ? (totalLogEvents / hoursDiff).toFixed(0)
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <Statistic
          title="Total Logs"
          value={totalLogEvents}
          loading={isLoading}
        />
      </Card>
      <Card>
        <Statistic
          title="Total Errors"
          value={totalErrorEvents}
          loading={isLoading}
          valueStyle={{ color: '#cf1322' }}
        />
      </Card>
      <Card>
        <Statistic
          title="Error Rate"
          value={errorRate}
          suffix="%"
          loading={isLoading}
          valueStyle={{ color: '#cf1322' }}
        />
      </Card>
      <Card>
        <Statistic
          title="Average Logs/Hour"
          value={avgLogsPerHour}
          loading={isLoading}
        />
      </Card>
    </div>
  );
}
