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
  TooltipProps,
} from 'recharts';
import { groupAndAggregateData } from './converter';
import { ChartType, NLVQueryResponse } from '@/types/query';
import { COLORS, PRIMARY_COLORS } from '@/components/constants';
import { Alert } from 'antd';

interface ChartDataPoint {
  [key: string]: string | number;
}

export default function ChartVisualization(
  nlvQueryResponse: NLVQueryResponse,
): React.ReactNode {
  console.log(nlvQueryResponse);
  const chartProps = convertNLVResponseToChartData(nlvQueryResponse);

  if (!chartProps) return null;

  if (chartProps.data.length === 1) {
    const xField = chartProps.config.xField;
    const yField = chartProps.config.yField;
    return (
      <Alert
        message={
          <>
            <p>
              <b>{xField}:</b>{' '}
              {chartProps.data[0][xField as keyof (typeof chartProps.data)[0]]}
            </p>
            <p>
              <b>{yField}:</b>{' '}
              {chartProps.data[0][yField as keyof (typeof chartProps.data)[0]]}
            </p>
          </>
        }
        type="info"
        showIcon
      />
    );
  }

  switch (chartProps.type) {
    case ChartType.LINE:
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartProps.data}>
            <XAxis dataKey={chartProps.config.xField} />
            <YAxis />
            <Legend />
            <Tooltip
              content={(props: TooltipProps<number, string>) => (
                <CustomizedTooltip {...props} />
              )}
            />
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
            <XAxis
              dataKey={chartProps.config.xField}
              tickFormatter={(value: string) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <YAxis />
            <Tooltip
              content={(props: TooltipProps<number, string>) => (
                <CustomizedTooltip {...props} />
              )}
            />
            {/* <Legend /> */}
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
            <Tooltip
              content={(props: TooltipProps<number, string>) => (
                <CustomizedTooltipPie {...props} />
              )}
            />
            {/* <Legend /> */}
          </PieChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
}

const CustomizedTooltip = (props: TooltipProps<number, string>) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length && label) {
    return (
      <div className="max-w-[300px] border border-gray-300 bg-white p-2">
        <p
          title={label}
          className="overflow-hidden font-semibold text-ellipsis whitespace-nowrap"
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomizedTooltipPie = (props: TooltipProps<number, string>) => {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const name = payload[0].name || '';
    const value = payload[0].value || '';
    const label = data?.[name] || '';

    return (
      <div className="max-w-[300px] border border-gray-300 bg-white p-2">
        <p
          title={label}
          className="overflow-hidden font-semibold text-ellipsis whitespace-nowrap"
        >
          {String(label).length > 40
            ? `${String(label).slice(0, 40)}...`
            : label}
        </p>
        <p className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
          {name}: {value}
        </p>
      </div>
    );
  }

  return null;
};

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

  let typeHint: ChartType = ChartType.BAR;
  if (interpretedQuery.visualization_hint?.includes('line')) {
    typeHint = ChartType.LINE;
  } else if (interpretedQuery.visualization_hint?.includes('bar')) {
    typeHint = ChartType.BAR;
  } else if (interpretedQuery.visualization_hint?.includes('pie')) {
    typeHint = ChartType.PIE;
  }

  const groupBys = (interpretedQuery.group_by || []).map((col) => {
    if (col.includes('tags.')) {
      return col.replace('tags.', '');
    }
    return col;
  });
  const aggOps =
    interpretedQuery.aggregation === 'COUNT'
      ? 'SUM'
      : interpretedQuery.aggregation;

  const grouped = groupAndAggregateData(nlvQueryResponse);
  if (!grouped) return;

  const groupKey = groupBys[0];

  return {
    type: typeHint,
    title: originalQuery || '',
    data: grouped,
    config: {
      xField: groupBys[0],
      yField: `value_${aggOps.toLowerCase()}`,
      ...(groupKey && { seriesField: groupKey }),
      smooth: true,
    },
  };
};
