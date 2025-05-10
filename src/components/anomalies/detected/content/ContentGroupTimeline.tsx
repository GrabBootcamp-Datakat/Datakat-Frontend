'use client';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Paragraph from 'antd/es/typography/Paragraph';

interface ContentGroupTimelineProps {
  timestamps: string[];
}

export default function ContentGroupTimeline({
  timestamps,
}: ContentGroupTimelineProps) {
  const chartData = useMemo(() => {
    const hourlyData = timestamps.reduce(
      (acc, timestamp) => {
        const date = new Date(timestamp);
        const hourKey = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
        ).toISOString();

        acc[hourKey] = (acc[hourKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(hourlyData).map(([hour, count]) => ({
      hour: new Date(hour).toLocaleString(),
      count,
    }));
  }, [timestamps]);

  return (
    <div>
      <Paragraph strong>Timeline</Paragraph>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="count" stroke="#1890ff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
