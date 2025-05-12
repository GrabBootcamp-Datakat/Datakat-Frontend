'use client';
import { Card } from 'antd';
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

interface ContentGroupTimelineProps {
  timestamps: string[];
}

export function ContentGroupTimeline({
  timestamps,
}: ContentGroupTimelineProps) {
  // Process timestamps into hourly buckets
  const timeData = timestamps.reduce(
    (acc: { [key: string]: number }, timestamp) => {
      const hour = new Date(timestamp).toLocaleString('en-US', {
        hour: 'numeric',
        hour12: false,
        day: 'numeric',
        month: 'short',
      });
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    },
    {},
  );

  // Convert to array and sort by time
  const chartData = Object.entries(timeData)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => {
      const dateA = new Date(a.hour);
      const dateB = new Date(b.hour);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <Card
      title="Occurrence Timeline"
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
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COMPONENT_COLORS.BORDER_LIGHT}
            />
            <XAxis
              dataKey="hour"
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
