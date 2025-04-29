'use client';
import { Card, Space, Button, Select, Skeleton } from 'antd';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { SettingOutlined } from '@ant-design/icons';
import { TimeUnit } from '@/types/log';
import { CHART_COLORS } from '../constants/color';
import { setTimeAnalysisCustomization } from '@/store/slices/chartCustomizationSlice';
import { useAppDispatch } from '@/lib/hooks/hook';
import { useState, memo, useMemo } from 'react';
import {
  useGetTimeAnalysisQuery,
  useGetTimeDistributionQuery,
} from '@/store/api/logsApi';

const ChartSkeleton = memo(() => (
  <div className="space-y-4">
    <Skeleton.Input active size="small" style={{ width: 200 }} />
    <Skeleton.Input active block style={{ height: 300 }} />
  </div>
));

ChartSkeleton.displayName = 'ChartSkeleton';

const TimeSeriesCard = memo(
  ({
    timeUnit,
    setTimeUnit,
  }: {
    timeUnit: TimeUnit;
    setTimeUnit: (unit: TimeUnit) => void;
  }) => {
    const dispatch = useAppDispatch();
    const { data: timeAnalysisData, isLoading } =
      useGetTimeAnalysisQuery(timeUnit);

    const handleCustomizeTimeAnalysis = () => {
      dispatch(setTimeAnalysisCustomization({ isCustomizing: true }));
    };

    const timeUnitOptions = useMemo(
      () => [
        { value: TimeUnit.SECOND, label: 'By Second' },
        { value: TimeUnit.MINUTE, label: 'By Minute' },
        { value: TimeUnit.HOUR, label: 'By Hour' },
        { value: TimeUnit.DAY, label: 'By Day' },
        { value: TimeUnit.MONTH, label: 'By Month' },
        { value: TimeUnit.YEAR, label: 'By Year' },
      ],
      [],
    );

    return (
      <Card
        title={
          <Space>
            <span>Time Series Analysis</span>
            <Select
              value={timeUnit}
              onChange={(value) => setTimeUnit(value as TimeUnit)}
              style={{ width: 120 }}
              options={timeUnitOptions}
            />
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
  },
);

TimeSeriesCard.displayName = 'TimeSeriesCard';

const TimeDistributionCard = memo(() => {
  const { data: hourlyDistribution, isLoading } = useGetTimeDistributionQuery();

  return (
    <Card title="Hourly Distribution" hoverable>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
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
      )}
    </Card>
  );
});

TimeDistributionCard.displayName = 'TimeDistributionCard';

export const TimeAnalysis = () => {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.HOUR);

  return (
    <div className="space-y-4">
      <TimeSeriesCard timeUnit={timeUnit} setTimeUnit={setTimeUnit} />
      <TimeDistributionCard />
    </div>
  );
};
