'use client';
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/components/constants/color';
import { formatChartValue } from './utils';
import { RenderChartProps } from '../distribution/RenderChart';
import { CustomDot, CustomLogsDrawer, CustomTooltip } from './customs';
import { useState, useEffect } from 'react';
import { DistributionData } from '../distribution/type';
import Text from 'antd/es/typography/Text';

export default function LineChartComponent(props: RenderChartProps) {
  const {
    chartData,
    chartType,
    margins,
    referenceLinesData,
    logsQuery,
    dimension,
  } = props;
  const { uniqueTicks, maxValue, avgValue, minValue } = referenceLinesData;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBar, setSelectedBar] = useState<DistributionData | null>(null);

  const handleViewLogs = (data: DistributionData) => {
    setSelectedBar(data);
    setDrawerOpen(true);
  };

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isNeedClose, setIsNeedClose] = useState(false);

  useEffect(() => {
    if (isNeedClose) {
      setTooltipVisible(false);
      setIsNeedClose(false);
    }
  }, [isNeedClose]);

  const handleTooltipClick = () => {
    setTooltipVisible(true);
  };

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={margins}
          onClick={handleTooltipClick}
        >
          <XAxis
            dataKey="name"
            interval="preserveStart"
            angle={-45}
            textAnchor="end"
            height={70}
            tickFormatter={(label) =>
              label.length > 10 ? label.slice(0, 10) + '…' : label
            }
          />

          <YAxis yAxisId="left" />
          <Tooltip
            formatter={(value: number) => [
              formatChartValue({ value, chartType }),
              'Value',
            ]}
            labelFormatter={(label) => `Name: ${label}`}
            trigger="click"
            wrapperStyle={{
              pointerEvents: 'auto',
            }}
            active={tooltipVisible}
            content={({ active, payload, label }) => (
              <CustomTooltip
                active={active}
                payload={
                  payload as Array<{ value: number; payload: DistributionData }>
                }
                label={label}
                onViewLogs={handleViewLogs}
                onClose={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setIsNeedClose(true);
                }}
              />
            )}
            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          />
          <Legend />
          <YAxis
            yAxisId="right"
            orientation="right"
            ticks={uniqueTicks}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <ReferenceLine
            yAxisId="right"
            y={maxValue}
            stroke="red"
            strokeDasharray="3 3"
            label={
              <Text type="secondary" className="text-xs">
                Max: {formatChartValue({ value: maxValue, chartType })}
              </Text>
            }
          />
          <ReferenceLine
            yAxisId="right"
            y={avgValue}
            stroke="orange"
            strokeDasharray="3 3"
            label={
              <Text type="secondary" className="text-xs">
                Avg: {formatChartValue({ value: avgValue, chartType })}
              </Text>
            }
          />
          <ReferenceLine
            yAxisId="right"
            y={minValue}
            stroke="blue"
            strokeDasharray="3 3"
            label={
              <Text type="secondary" className="text-xs">
                Min: {formatChartValue({ value: minValue, chartType })}
              </Text>
            }
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS.total}
            strokeWidth={2}
            dot={<CustomDot minValue={minValue} maxValue={maxValue} />}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {selectedBar && (
        <CustomLogsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          filterName={selectedBar.name}
          dimension={dimension}
          logsQuery={logsQuery}
        />
      )}
    </>
  );
}
