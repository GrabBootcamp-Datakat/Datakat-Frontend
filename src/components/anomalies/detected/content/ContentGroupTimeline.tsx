'use client';
import { Card, Empty } from 'antd';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CHART_COLORS, COMPONENT_COLORS } from '@/constants/colors';
import { useAppSelector } from '@/hooks/hook';
import { selectDateRange } from '@/store/slices/anomalySlice';
import { useGetAnomalyOccurrencesQuery } from '@/store/api/anomalyApi';
import { ChartSkeleton } from '@/components/common';

interface ContentGroupTimelineProps {
  applications: string[];
  levels: string[];
}

export function ContentGroupTimeline(props: ContentGroupTimelineProps) {
  const { applications, levels } = props;
  const dateRange = useAppSelector(selectDateRange);
  const { data: anomaliesData, isLoading } = useGetAnomalyOccurrencesQuery({
    start_time: dateRange[0],
    end_time: dateRange[1],
    applications: applications.length > 0 ? [applications[0]] : undefined,
    levels: levels.length > 0 ? [levels[0]] : undefined,
    interval: '1h',
  });

  if (isLoading) {
    return <ChartSkeleton title="Anomaly Occurrences" />;
  }

  if (!anomaliesData) {
    return <Empty description="No data available" />;
  }

  return (
    <Card
      size="small"
      className="mb-4"
      style={{
        background: COMPONENT_COLORS.BG_LIGHT,
        borderColor: COMPONENT_COLORS.BORDER_LIGHT,
      }}
    >
      <div style={{ height: 200, width: '100%' }}>
        <ResponsiveContainer>
          <LineChart
            data={anomaliesData.series}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COMPONENT_COLORS.BORDER_LIGHT}
            />
            <XAxis
              dataKey="timestamp"
              stroke={COMPONENT_COLORS.TEXT_SECONDARY}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke={COMPONENT_COLORS.TEXT_SECONDARY}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: `1px solid ${COMPONENT_COLORS.BORDER_LIGHT}`,
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS[0] }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
