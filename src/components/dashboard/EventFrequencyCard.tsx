'use client';
import React from 'react';
import { Card } from 'antd';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { CHART_COLORS } from '../constants/color';
import { useGetEventFrequencyQuery } from '@/store/api/logsApi';
import { NoDataStatus } from '../common/Status';
import { ChartSkeleton } from '../common/Skeleton';

export default function EventFrequencyCard() {
  const { data: eventFrequency, isLoading } = useGetEventFrequencyQuery();

  if (isLoading) {
    return (
      <Card title="Event Frequency" hoverable>
        <ChartSkeleton />
      </Card>
    );
  }

  if (!eventFrequency) {
    return <NoDataStatus />;
  }

  return (
    <Card title="Event Frequency" hoverable>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={eventFrequency}>
          <XAxis dataKey="eventId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill={CHART_COLORS.total} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
