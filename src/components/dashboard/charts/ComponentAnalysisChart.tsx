'use client';
import { memo } from 'react';
import { Bar } from 'recharts';
import { CHART_COLORS } from '../../constants/color';
import BaseChart from './BaseChart';

interface ChartDataPoint {
  component: string;
  count: number;
}

interface ComponentAnalysisChartProps {
  data: ChartDataPoint[];
  height?: number;
}

const ComponentAnalysisChart = memo(
  ({ data, height }: ComponentAnalysisChartProps) => {
    // Convert data to the format expected by recharts
    const chartData = data.map((item) => ({
      name: item.component,
      value: item.count,
    }));

    return (
      <BaseChart height={height}>
        <Bar
          data={chartData}
          dataKey="value"
          fill={CHART_COLORS.total}
          label={{ position: 'top', fill: CHART_COLORS.text }}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </BaseChart>
    );
  },
);

ComponentAnalysisChart.displayName = 'ComponentAnalysisChart';
export default ComponentAnalysisChart;
