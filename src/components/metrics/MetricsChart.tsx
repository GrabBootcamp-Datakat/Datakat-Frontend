'use client';
import { Card, Typography } from 'antd';
import { Line } from '@ant-design/plots';
import { useGetTimeseriesMetricsQuery } from '@/store/api/metricsApi';
import { MetricName, TimeInterval } from '@/types/metrics';
import dayjs from 'dayjs';
import { ChartSkeleton } from '@/components/common/Skeleton';

const { Title } = Typography;

interface MetricsChartProps {
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
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
  const { data: timeseriesData, isLoading } = useGetTimeseriesMetricsQuery({
    startTime: dateRange[0].toISOString(),
    endTime: dateRange[1].toISOString(),
    applications: selectedApplications,
    metricName: selectedMetric,
    interval: selectedInterval,
  });

  if (isLoading) {
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
      <Line
        data={chartData}
        xField="time"
        yField="value"
        seriesField="name"
        xAxis={{
          type: 'time',
          tickCount: 5,
          label: {
            formatter: (text: number) =>
              dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
          },
        }}
        yAxis={{
          label: {
            formatter: (v: number) => `${v}`,
          },
        }}
        point={{
          size: 2,
          shape: 'circle',
        }}
        state={{
          active: {
            style: {
              shadowBlur: 4,
              stroke: '#000',
              fill: 'red',
            },
          },
        }}
        interactions={[
          {
            type: 'marker-active',
          },
        ]}
        height={400}
      />
    </Card>
  );
}
