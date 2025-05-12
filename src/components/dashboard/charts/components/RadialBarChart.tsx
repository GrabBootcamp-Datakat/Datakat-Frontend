'use client';
import {
  RadialBarChart,
  RadialBar,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/components/constants/color';
import { formatChartValue } from './utils';
import { RenderChartProps } from '../distribution/RenderChart';

export default function RadialBarChartComponent(props: RenderChartProps) {
  const { chartData, chartType, referenceLinesData } = props;
  const { maxValue } = referenceLinesData;
  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const sortedChartData = [...chartData].sort((a, b) => a.value - b.value);
  console.log(sortedChartData);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadialBarChart
        innerRadius="10%"
        outerRadius="80%"
        data={sortedChartData}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          label={{ fill: '#666', position: 'insideStart' }}
          background
          dataKey="value"
        >
          {sortedChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.name === 'Others'
                  ? '#999'
                  : entry.value === maxValue
                    ? 'red'
                    : CHART_COLORS.total
              }
            />
          ))}
        </RadialBar>
        <Legend />
        <Tooltip
          labelFormatter={(label) => `Name: ${label}`}
          formatter={(value: number) => [
            `${formatChartValue({ value, chartType, totalValue })}%`,
            'Percentage',
          ]}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
