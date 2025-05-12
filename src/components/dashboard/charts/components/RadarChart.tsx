'use client';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/components/constants/color';
import { formatChartValue } from './utils';
import { RenderChartProps } from '../distribution/RenderChart';

export default function RadarChartComponent(props: RenderChartProps) {
  const { chartData, chartType } = props;
  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart outerRadius={90} data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis
          angle={30}
          domain={[0, Math.max(...chartData.map((d) => d.value))]}
        />
        <Radar
          name="Value"
          dataKey="value"
          stroke={CHART_COLORS.total}
          fill={CHART_COLORS.total}
          fillOpacity={0.3}
        />
        <Tooltip
          labelFormatter={(label) => `Name: ${label}`}
          formatter={(value: number) => [
            formatChartValue({ value, chartType, totalValue }),
            'Percentage',
          ]}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}
