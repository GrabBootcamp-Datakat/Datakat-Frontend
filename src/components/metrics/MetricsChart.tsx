/* eslint-disable */
'use client';
import { Card, Select } from 'antd';
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  Dot,
} from 'recharts';
import { useMemo, useState, useEffect } from 'react';
import { useGetTimeseriesMetricsQuery } from '@/store/api/metricsApi';
import { ChartSkeleton } from '@/components/common/Skeleton';
import { PRIMARY_COLORS } from '@/components/constants/color';
import { useAppSelector } from '@/hooks/hook';
import {
  selectDateRange,
  selectSelectedApplications,
  selectSelectedMetric,
  selectSelectedInterval,
  selectSelectedGroupBy,
} from '@/store/slices/metricsSlice';
import { MetricTimeseriesSeries } from '@/types/metrics';
import Title from 'antd/es/typography/Title';
import dayjs from 'dayjs';

export default function MetricsChart() {
  const dateRange = useAppSelector(selectDateRange);
  const selectedApplications = useAppSelector(selectSelectedApplications);
  const selectedMetric = useAppSelector(selectSelectedMetric);
  const selectedInterval = useAppSelector(selectSelectedInterval);
  const selectedGroupBy = useAppSelector(selectSelectedGroupBy);

  const { data: timeseriesData, isLoading: isLoadingTimeseries } =
    useGetTimeseriesMetricsQuery({
      startTime: dateRange[0],
      endTime: dateRange[1],
      applications: selectedApplications,
      metricName: selectedMetric,
      interval: selectedInterval,
      groupBy: selectedGroupBy,
    });

  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);
  const [prevSeries, setPrevSeries] = useState<MetricTimeseriesSeries[]>([]);

  const sortedSeries = useMemo(() => {
    if (!timeseriesData?.series) return [];
    return [...timeseriesData.series].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [timeseriesData?.series]);

  useEffect(() => {
    if (sortedSeries.length > 0 && selectedSeries.length === 0) {
      setSelectedSeries([sortedSeries[0].name]);
    }
  }, [sortedSeries, selectedSeries]);

  useEffect(() => {
    if (
      sortedSeries.length > 0 &&
      JSON.stringify(sortedSeries) !== JSON.stringify(prevSeries)
    ) {
      setSelectedSeries([sortedSeries[0].name]);
    }
  }, [sortedSeries]);

  useEffect(() => {
    setPrevSeries(sortedSeries);
  }, [sortedSeries]);

  if (isLoadingTimeseries || !sortedSeries) {
    return <ChartSkeleton title="Metrics Over Time" />;
  }

  const handleSelectChange = (value: string[]) => {
    setSelectedSeries(value);
  };

  const filteredSeries =
    sortedSeries.length > 1
      ? sortedSeries.filter((series) => selectedSeries.includes(series.name))
      : sortedSeries;

  return (
    <>
      <div className="flex items-center justify-between">
        <Title level={4} style={{ marginBottom: 0 }}>
          Metrics Over Time
        </Title>
        {sortedSeries.length > 1 && (
          <Select
            mode="multiple"
            maxTagCount={1}
            onChange={handleSelectChange}
            placeholder="Select series"
            value={selectedSeries}
            options={sortedSeries.map((series) => ({
              label: series.name,
              value: series.name,
            }))}
            style={{ width: 'max-content', minWidth: 125 }}
          />
        )}
      </div>

      {filteredSeries.map((series) => {
        const chartData = [...series.data]
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((d) => ({
            ...d,
            timestamp: dayjs(d.timestamp).format('YYYY-MM-DD HH:mm'),
          }));
        const values = chartData.map((d) => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const avgValue = values.reduce((a, b) => a + b, 0) / values.length;

        return (
          <Chart
            key={series.name}
            name={series.name}
            chartData={chartData}
            minValue={minValue}
            avgValue={avgValue}
            maxValue={maxValue}
          />
        );
      })}
    </>
  );
}

type ChartProps = {
  name: string;
  chartData: { timestamp: string; value: number }[];
  minValue: number;
  avgValue: number;
  maxValue: number;
};

const Chart = ({
  name,
  chartData,
  minValue,
  avgValue,
  maxValue,
}: ChartProps) => {
  const uniqueTicks = Array.from(new Set([minValue, avgValue, maxValue])).sort(
    (a, b) => a - b,
  );

  return (
    <Card title={name} style={{ marginTop: 12 }}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PRIMARY_COLORS} stopOpacity={0.8} />
              <stop offset="95%" stopColor={PRIMARY_COLORS} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp" padding={{ right: 10 }} />
          <YAxis yAxisId="left" />
          <YAxis
            yAxisId="right"
            orientation="right"
            ticks={uniqueTicks}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip />
          <Legend />
          <ReferenceLine
            yAxisId="right"
            y={maxValue}
            stroke="red"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            yAxisId="right"
            y={avgValue}
            stroke="orange"
            strokeDasharray="3 3"
          />
          <ReferenceLine
            yAxisId="right"
            y={minValue}
            stroke="blue"
            strokeDasharray="3 3"
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="value"
            stroke={PRIMARY_COLORS}
            fillOpacity={1}
            fill="url(#colorCount)"
            dot={(props) => {
              const { cx, cy, value, ...rest } = props;
              return (
                <CustomDot
                  {...rest}
                  cx={cx}
                  cy={cy}
                  value={value}
                  minValue={minValue}
                  maxValue={maxValue}
                />
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

type CustomDotProps = {
  className?: string;
  cx?: number;
  cy?: number;
  r?: number;
  clipDot?: boolean;
  value?: number | number[];
  payload?: any;
  minValue: number;
  maxValue: number;
};

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy, value, minValue, maxValue } = props;
  const currentValue =
    typeof value === 'number' ? value : Array.isArray(value) ? value[1] : 0;

  if (currentValue === maxValue) {
    return <Dot cx={cx} cy={cy} r={4} fill="red" />;
  }

  if (currentValue === minValue) {
    return <Dot cx={cx} cy={cy} r={4} fill="blue" />;
  }

  return <Dot />;
};
