'use client';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { groupAndAggregateData } from './converter';
import { ChartType, NLVQueryResponse } from '@/types/query';
import { COLORS, PRIMARY_COLORS } from '@/components/constants';

interface ChartDataPoint {
  [key: string]: string | number;
}

export default function ChartVisualization(
  nlvQueryResponse: NLVQueryResponse,
): React.ReactNode {
  const chartProps = convertNLVResponseToChartData(nlvQueryResponse);

  if (!chartProps) return null;

  switch (chartProps.type) {
    case ChartType.LINE:
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartProps.data}>
            <XAxis dataKey={chartProps.config.xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              dataKey={chartProps.config.yField}
              stroke={PRIMARY_COLORS}
              fillOpacity={1}
              fill="url(#colorCount)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    case ChartType.BAR:
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartProps.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartProps.config.xField} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={String(chartProps.config.yField)}
              fill={PRIMARY_COLORS}
            >
              {chartProps.data.map((entry: ChartDataPoint, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    case ChartType.PIE:
      return (
        <ResponsiveContainer width="100%" height={600}>
          <PieChart>
            <Pie
              data={chartProps.data}
              dataKey={String(chartProps.config.yField ?? 'value')}
              nameKey={String(chartProps.config.xField ?? 'name')}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={true}
            >
              {chartProps.data.map((entry: ChartDataPoint, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
}

export interface ChartData {
  type: ChartType;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  config: {
    xField?: string;
    yField?: string;
    seriesField?: string;
    smooth?: boolean;
    angleField?: string;
    colorField?: string;
  };
}

const convertNLVResponseToChartData = (
  nlvQueryResponse: NLVQueryResponse,
): ChartData | undefined => {
  const { data, columns, originalQuery, interpretedQuery } = nlvQueryResponse;
  if (!data || !columns || !interpretedQuery) return;

  const typeHint = (interpretedQuery.visualization_hint || 'bar') as ChartType;
  const groupBys = interpretedQuery.group_by || [];
  const aggOps =
    interpretedQuery.aggregation === 'COUNT'
      ? 'SUM'
      : interpretedQuery.aggregation;

  const grouped = groupAndAggregateData(nlvQueryResponse);
  if (!grouped) return;

  const groupKey = groupBys[0];

  return {
    type: typeHint,
    title: originalQuery,
    data: grouped,
    config: {
      xField: groupBys[0],
      yField: `value_${aggOps.toLowerCase()}`,
      ...(groupKey && { seriesField: groupKey }),
      smooth: true,
    },
  };
};
