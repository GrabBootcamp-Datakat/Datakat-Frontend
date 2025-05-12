import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from 'antd';
import { CHART_COLORS } from '@/components/constants/color';
import Title from 'antd/es/typography/Title';
import { MetricDistributionItem } from '@/types/metrics';

const getLevelColor = (level: string) => {
  switch (level.toUpperCase()) {
    case 'INFO':
      return CHART_COLORS.info;
    case 'WARN':
      return CHART_COLORS.warn;
    case 'ERROR':
      return CHART_COLORS.error;
    default:
      return CHART_COLORS.unknown;
  }
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      total: number;
      color: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg bg-white p-2 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">Count: {data.value.toLocaleString()}</p>
        <p className="text-sm text-gray-500">
          Percentage: {((data.value / data.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function LogLevelDistribution({
  distribution,
}: {
  distribution: MetricDistributionItem[];
}) {
  const total = distribution.reduce((sum, item) => sum + item.value, 0);

  const chartData = distribution.map((item) => ({
    name: item.name,
    value: item.value,
    total: total,
    color: getLevelColor(item.name),
  }));

  // Sort data by value in descending order
  chartData.sort((a, b) => b.value - a.value);

  return (
    <Card style={{ height: '100%' }}>
      <Title level={5} className="mb-3 text-sm">
        Log Level Distribution
      </Title>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toUpperCase()}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value) => value.toUpperCase()}
          />
          <Bar dataKey="value" fill={CHART_COLORS.info} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
