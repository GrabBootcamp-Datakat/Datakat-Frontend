'use client';
import { useState, useMemo } from 'react';
import { Card, Space, Button, Select } from 'antd';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { SettingOutlined } from '@ant-design/icons';
import { TimeUnit } from '@/types/logs';
import { CHART_COLORS } from '../constants/color';
import { setTimeAnalysisCustomization } from '@/store/slices/chartCustomizationSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectIsLoading,
  selectTimeSeriesData,
} from '@/store/slices/dashboardSlice';
import { NoDataStatus, ChartSkeleton } from '../common';
import dayjs from 'dayjs';

// Utility to aggregate data based on selected unit
const aggregateData = (data: any[], unit: TimeUnit) => {
  const grouped: Record<string, number[]> = {};

  data.forEach((item) => {
    const key = dayjs(item.time).startOf(unit.toLowerCase() as any).format();
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item.count);
  });

  return Object.entries(grouped).map(([time, counts]) => ({
    time,
    count: Math.round(counts.reduce((a, b) => a + b, 0) / counts.length),
  }));
};

export default function TimeSeriesCard() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const timeSeriesData = useAppSelector(selectTimeSeriesData);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.MINUTE);

  const data = useMemo(
    () => (timeSeriesData ? aggregateData(timeSeriesData, timeUnit) : []),
    [timeSeriesData, timeUnit]
  );

  const handleCustomizeTimeAnalysis = () => {
    dispatch(setTimeAnalysisCustomization({ isCustomizing: true }));
  };

  if (isLoading) return <ChartSkeleton title="Time Series Analysis" />;
  if (!data || data.length === 0) return <NoDataStatus title="Time Series Analysis" />;

  return (
    <Card
      title={
        <Space>
          <span>Time Series Analysis</span>
          <Select
            value={timeUnit}
            onChange={(value) => setTimeUnit(value as TimeUnit)}
            style={{ width: 120 }}
          >
            <Select.Option value={TimeUnit.SECOND}>By Second</Select.Option>
            <Select.Option value={TimeUnit.MINUTE}>By Minute</Select.Option>
            <Select.Option value={TimeUnit.HOUR}>By Hour</Select.Option>
            <Select.Option value={TimeUnit.DAY}>By Day</Select.Option>
            <Select.Option value={TimeUnit.MONTH}>By Month</Select.Option>
            <Select.Option value={TimeUnit.YEAR}>By Year</Select.Option>
          </Select>
        </Space>
      }
      hoverable
      extra={
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={handleCustomizeTimeAnalysis}
        >
          Customize
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.total} stopOpacity={0.8} />
              <stop offset="95%" stopColor={CHART_COLORS.total} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tickFormatter={(tick) => dayjs(tick).format('HH:mm')} />
          <YAxis />
          <Tooltip labelFormatter={(label) => dayjs(label).format('YYYY-MM-DD HH:mm')} />
          <Legend />
          <Area
            type="monotone"
            dataKey="count"
            stroke={CHART_COLORS.total}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
