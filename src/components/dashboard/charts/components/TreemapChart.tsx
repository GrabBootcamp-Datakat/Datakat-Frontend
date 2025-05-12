'use client';
import { Treemap, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '@/components/constants/color';
import { RenderChartProps } from '../distribution/RenderChart';

export default function TreemapChartComponent(props: RenderChartProps) {
  const { chartData } = props;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={chartData}
        dataKey="value"
        nameKey="name"
        stroke="#fff"
        fill={CHART_COLORS.total}
      >
        <Tooltip />
      </Treemap>
    </ResponsiveContainer>
  );
}
