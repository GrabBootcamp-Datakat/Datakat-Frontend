'use client';
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  ScatterChart,
  Scatter,
  Treemap,
  ResponsiveContainer,
  Dot,
} from 'recharts';
import { Typography, Drawer, Button, Space } from 'antd';
import { CHART_COLORS, COLORS } from '@/components/constants/color';
import { DistributionData, RenderChartProps } from './DistributionChart';
import { formatChartValue } from './chartUtils';
import { useEffect, useState } from 'react';
import { LogsTable, LogFilters } from '@/components/logs';
import { useGetLogsQuery } from '@/store/api/logsApi';
import dayjs from 'dayjs';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

function LogsDrawer({
  open,
  onClose,
  filterName,
  startTime,
  endTime,
}: {
  open: boolean;
  onClose: () => void;
  filterName: string;
  startTime: string;
  endTime: string;
}) {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const { data: logsData, isLoading } = useGetLogsQuery({
    startTime,
    endTime,
    query: filterName,
    page: pagination.currentPage,
    size: pagination.pageSize,
  });

  return (
    <Drawer
      title={`Logs for ${filterName}`}
      placement="right"
      onClose={onClose}
      open={open}
      width={800}
    >
      <div className="flex flex-col gap-4">
        <LogFilters services={[]} />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <LogsTable
            data={logsData?.logs || []}
            pagination={{
              current: pagination.currentPage,
              pageSize: pagination.pageSize,
              total: logsData?.totalCount || 0,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            onChange={(newPagination) => {
              setPagination({
                currentPage: newPagination.current || 1,
                pageSize: newPagination.pageSize || 10,
              });
            }}
          />
        )}
      </div>
    </Drawer>
  );
}

// Add custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DistributionData;
  }>;
  label?: string;
  onViewLogs: (data: DistributionData) => void;
  onClose: (e: React.MouseEvent) => void;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  onViewLogs,
  onClose,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded border border-gray-200 bg-white p-3 shadow-lg">
        <Space direction="vertical" size="small">
          <Text strong>{label}</Text>
          <Text type="secondary">
            Value: {formatChartValue(data.value, 'bar')}
          </Text>
          <div className="flex gap-2">
            <Button
              type="primary"
              size="small"
              icon={<SearchOutlined />}
              onClick={() => onViewLogs(data)}
            >
              View Logs
            </Button>
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={(e: React.MouseEvent) => onClose(e)}
            >
              Close
            </Button>
          </div>
        </Space>
      </div>
    );
  }
  return null;
};

export function BarChartComponent(props: RenderChartProps) {
  const { chartData, margins } = props;
  const { uniqueTicks, maxValue, avgValue, minValue } =
    getReferenceLinesData(chartData);

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
        <BarChart
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
                Max: {formatChartValue(maxValue, 'bar')}
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
                Avg: {formatChartValue(avgValue, 'bar')}
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
                Min: {formatChartValue(minValue, 'bar')}
              </Text>
            }
          />
          <Tooltip
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
          <ReferenceLinesComponent data={chartData} />
          <Bar
            yAxisId="left"
            dataKey="value"
            fill={CHART_COLORS.total}
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.name === 'Others'
                    ? '#000'
                    : entry.value === Math.max(...chartData.map((d) => d.value))
                      ? 'red'
                      : CHART_COLORS.total
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {selectedBar && (
        <LogsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          filterName={selectedBar.name}
          startTime={
            props.startTime || dayjs().subtract(24, 'hours').toISOString()
          }
          endTime={props.endTime || dayjs().toISOString()}
        />
      )}
    </>
  );
}

export function LineChartComponent(props: RenderChartProps) {
  const { chartData, chartType, margins } = props;
  const { uniqueTicks, maxValue, avgValue, minValue } =
    getReferenceLinesData(chartData);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={margins}>
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
            formatChartValue(value, chartType),
            'Value',
          ]}
          labelFormatter={(label) => `Name: ${label}`}
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
              Max: {formatChartValue(maxValue, 'bar')}
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
              Avg: {formatChartValue(avgValue, 'bar')}
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
              Min: {formatChartValue(minValue, 'bar')}
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
  );
}

export function AreaChartComponent(props: RenderChartProps) {
  const { chartData, chartType, margins } = props;
  const { uniqueTicks, maxValue, avgValue, minValue } =
    getReferenceLinesData(chartData);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData} margin={margins}>
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
            formatChartValue(value, chartType),
            'Value',
          ]}
          labelFormatter={(label) => `Name: ${label}`}
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
              Max: {formatChartValue(maxValue, 'bar')}
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
              Avg: {formatChartValue(avgValue, 'bar')}
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
              Min: {formatChartValue(minValue, 'bar')}
            </Text>
          }
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="value"
          fill={CHART_COLORS.total}
          stroke={CHART_COLORS.total}
          fillOpacity={0.3}
          isAnimationActive={false}
          dot={<CustomDot minValue={minValue} maxValue={maxValue} />}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PieChartComponent(props: RenderChartProps) {
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
          fill={CHART_COLORS.total}
          label={({ name, percent }) =>
            `${name.length > 10 ? name.slice(0, 10) + '…' : name} (${(percent * 100).toFixed(0)}%)`
          }
          isAnimationActive={false}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            formatChartValue(value, chartType),
            'Value',
          ]}
          labelFormatter={(label) => `Name: ${label}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RadarChartComponent(props: RenderChartProps) {
  const { chartData, chartType } = props;
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
          formatter={(value: number) => [
            formatChartValue(value, chartType),
            'Value',
          ]}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function RadialBarChartComponent(props: RenderChartProps) {
  const { chartData, chartType } = props;
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadialBarChart
        innerRadius="10%"
        outerRadius="80%"
        data={chartData}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          label={{ fill: '#666', position: 'insideStart' }}
          background
          dataKey="value"
        >
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
        </RadialBar>
        <Legend />
        <Tooltip
          formatter={(value: number) => [
            `${formatChartValue(value, chartType)}%`,
            'Percentage',
          ]}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export function ComposedChartComponent(props: RenderChartProps) {
  const { chartData, chartType, margins } = props;
  const { uniqueTicks, maxValue, avgValue, minValue } =
    getReferenceLinesData(chartData);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData} margin={margins}>
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
            formatChartValue(value, chartType),
            'Value',
          ]}
          labelFormatter={(label) => `Name: ${label}`}
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
              Max: {formatChartValue(maxValue, 'bar')}
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
              Avg: {formatChartValue(avgValue, 'bar')}
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
              Min: {formatChartValue(minValue, 'bar')}
            </Text>
          }
        />
        <Bar
          yAxisId="left"
          dataKey="value"
          fill={CHART_COLORS.total}
          fillOpacity={0.3}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="value"
          stroke={CHART_COLORS.total}
          strokeWidth={2}
          dot={<CustomDot minValue={minValue} maxValue={maxValue} />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function ScatterChartComponent(props: RenderChartProps) {
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
          tickFormatter={(value) => formatChartValue(value, chartType)}
        />
        <Tooltip
          formatter={(value: number) => [
            formatChartValue(value, chartType),
            'Value',
          ]}
          labelFormatter={(label) => `Name: ${label}`}
        />
        <Legend />
        <ReferenceLinesComponent data={chartData} />
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

export function TreemapChartComponent(props: RenderChartProps) {
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

function getReferenceLinesData(data: DistributionData[]) {
  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  const uniqueTicks = Array.from(new Set([minValue, avgValue, maxValue])).sort(
    (a, b) => a - b,
  );
  return { uniqueTicks, maxValue, avgValue, minValue };
}

export function ReferenceLinesComponent({
  data,
}: {
  data: DistributionData[];
}) {
  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  const uniqueTicks = Array.from(new Set([minValue, avgValue, maxValue])).sort(
    (a, b) => a - b,
  );

  return (
    <>
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
            Max: {formatChartValue(maxValue, 'bar')}
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
            Avg: {formatChartValue(avgValue, 'bar')}
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
            Min: {formatChartValue(minValue, 'bar')}
          </Text>
        }
      />
    </>
  );
}

type CustomDotProps = {
  className?: string;
  cx?: number;
  cy?: number;
  r?: number;
  clipDot?: boolean;
  value?: number | number[];
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
