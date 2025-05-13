'use client';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS, COLORS } from '@/components/constants/color';
import { formatChartValue } from './utils';
import { RenderChartProps } from '../distribution/RenderChart';

export default function PieChartComponent(props: RenderChartProps) {
  const { chartData, chartType } = props;
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          isAnimationActive={false}
          fill={CHART_COLORS.total}
          label={({ name, percent }) =>
            `${name.length > 10 ? name.slice(0, 10) + '…' : name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip
          labelFormatter={(label) => `Name: ${label}`}
          formatter={(value: number) => [
            formatChartValue({ value, chartType }),
            'Value',
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
