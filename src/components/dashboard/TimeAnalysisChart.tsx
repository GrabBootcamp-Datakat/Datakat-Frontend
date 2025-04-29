'use client';
import { memo } from 'react';
import { Area } from 'recharts';
import { BaseChart } from './BaseChart';
import { CHART_COLORS } from '../constants/color';
import type { TimeDataPoint } from '@/types/log';

interface TimeAnalysisChartProps {
  data: TimeDataPoint[];
  height?: number;
}

export const TimeAnalysisChart = memo(
  ({ data, height }: TimeAnalysisChartProps) => {
    return (
      <BaseChart height={height}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={CHART_COLORS.total}
              stopOpacity={0.8}
            />
            <stop offset="95%" stopColor={CHART_COLORS.total} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          data={data}
          dataKey="count"
          stroke={CHART_COLORS.total}
          fillOpacity={1}
          fill="url(#colorCount)"
        />
      </BaseChart>
    );
  },
);

TimeAnalysisChart.displayName = 'TimeAnalysisChart';
