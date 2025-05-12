'use client';
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/components/constants/color';
import { formatChartValue } from './utils';
import { RenderChartProps } from '../distribution/RenderChart';

export default function ScatterChartComponent(props: RenderChartProps) {
  const { chartData, chartType, margins } = props;
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart data={chartData} margin={margins}>
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={70}
          tickFormatter={(label) =>
            label.length > 10 ? label.slice(0, 10) + '…' : label
          }
        />
        <YAxis yAxisId="left" />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value) => formatChartValue({ value, chartType })}
        />
        <Tooltip
          formatter={(value: number) => [
            formatChartValue({ value, chartType }),
            'Value',
          ]}
          labelFormatter={(label) => `Name: ${label}`}
        />
        <Legend />
        <Scatter data={chartData} fill={CHART_COLORS.total} name="Distribution">
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.name === 'Others'
                  ? '#999'
                  : entry.value === Math.max(...chartData.map((d) => d.value))
                    ? 'red'
                    : CHART_COLORS.total
              }
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
