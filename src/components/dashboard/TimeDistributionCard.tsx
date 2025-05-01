'use client';
import { Card } from 'antd';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { CHART_COLORS } from '../constants/color';
import { useGetTimeDistributionQuery } from '@/store/api/logsApi';
import { ChartSkeleton } from '../common/Skeleton';
import { NoDataStatus } from '../common/Status';

export default function TimeDistributionCard() {
  const { data: hourlyDistribution, isLoading } = useGetTimeDistributionQuery();

  if (isLoading) {
    return <ChartSkeleton title="Time Distribution" />;
  }

  if (!hourlyDistribution) {
    return <NoDataStatus title="Time Distribution" />;
  }

  return (
    <Card title="Hourly Distribution" hoverable>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={hourlyDistribution}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="INFO" stackId="a" fill={CHART_COLORS.info} />
          <Bar dataKey="WARN" stackId="a" fill={CHART_COLORS.warn} />
          <Bar dataKey="ERROR" stackId="a" fill={CHART_COLORS.error} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
