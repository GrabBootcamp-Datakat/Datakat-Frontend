'use client';
import { Card } from 'antd';
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useGetTimeseriesMetricsQuery } from '@/store/api/metricsApi';
import { MetricName, TimeInterval } from '@/types/metrics';
import { ChartSkeleton } from '@/components/common/Skeleton';
import { PRIMARY_COLORS } from '@/components/constants/color';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';
interface MetricsChartProps {
  dateRange: [string, string];
  selectedApplications: string[];
  selectedMetric: MetricName;
  selectedInterval: TimeInterval;
}

export default function MetricsChart({
  dateRange,
  selectedApplications,
  selectedMetric,
  selectedInterval,
}: MetricsChartProps) {
  const { data: timeseriesData, isLoading: isLoadingTimeseries } =
    useGetTimeseriesMetricsQuery({
      startTime: dateRange[0],
      endTime: dateRange[1],
      applications: selectedApplications,
      metricName: selectedMetric,
      interval: selectedInterval,
    });

  if (isLoadingTimeseries) {
    return <ChartSkeleton title="Metrics Over Time" />;
  }

  const chartData = timeseriesData?.series.flatMap((series) =>
    series.data.map((point) => ({
      time: dayjs(point.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      value: point.value,
      name: series.name,
    })),
  );

  return (
    <Card>
      <Title level={4}>Metrics Over Time</Title>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PRIMARY_COLORS} stopOpacity={0.8} />
              <stop offset="95%" stopColor={PRIMARY_COLORS} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke={PRIMARY_COLORS}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
