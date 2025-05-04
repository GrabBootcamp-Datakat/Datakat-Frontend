'use client';
import { memo } from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { CHART_COLORS } from '../../constants/color';

interface BaseChartProps {
  children: React.ReactNode;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

const BaseChart = memo(
  ({
    children,
    height = 300,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
  }: BaseChartProps) => {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <div>
          <XAxis
            dataKey="time"
            stroke={CHART_COLORS.text}
            tick={{ fill: CHART_COLORS.text }}
          />
          <YAxis
            stroke={CHART_COLORS.text}
            tick={{ fill: CHART_COLORS.text }}
          />
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              opacity={0.5}
            />
          )}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: CHART_COLORS.background,
                border: `1px solid ${CHART_COLORS.border}`,
              }}
              labelStyle={{ color: CHART_COLORS.text }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{
                color: CHART_COLORS.text,
              }}
            />
          )}
          {children}
        </div>
      </ResponsiveContainer>
    );
  },
);

BaseChart.displayName = 'BaseChart';
export default BaseChart;
