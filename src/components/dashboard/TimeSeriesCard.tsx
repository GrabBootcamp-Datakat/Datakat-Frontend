'use client';
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
import { TimeUnit } from '@/types/log';
import { CHART_COLORS } from '../constants/color';
import { setTimeAnalysisCustomization } from '@/store/slices/chartCustomizationSlice';
import { useAppDispatch } from '@/lib/hooks/hook';
import { useGetTimeAnalysisQuery } from '@/store/api/logsApi';
import { ChartSkeleton } from '../common/Skeleton';
import { useState } from 'react';

export default function TimeSeriesCard() {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.MINUTE);
  const dispatch = useAppDispatch();
  const { data: timeAnalysisData, isLoading } =
    useGetTimeAnalysisQuery(timeUnit);

  const handleCustomizeTimeAnalysis = () => {
    dispatch(setTimeAnalysisCustomization({ isCustomizing: true }));
  };

  if (isLoading) {
    return (
      <Card title="Time Series Analysis" hoverable>
        <ChartSkeleton />
      </Card>
    );
  }

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
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeAnalysisData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.total}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.total}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
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
      )}
    </Card>
  );
}
