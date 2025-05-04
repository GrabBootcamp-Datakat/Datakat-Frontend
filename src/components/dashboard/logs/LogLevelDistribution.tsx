import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from 'antd';
import { LogLevelSummary } from '@/store/slices/dashboardSlice';
import { CHART_COLORS } from '@/components/constants/color';
import Title from 'antd/es/typography/Title';

export default function LogLevelDistribution({
  summary,
}: {
  summary: LogLevelSummary;
}) {
  const pieData = [
    {
      name: 'INFO',
      value: summary.info,
      color: CHART_COLORS.info,
    },
    {
      name: 'WARN',
      value: summary.warn,
      color: CHART_COLORS.warn,
    },
    {
      name: 'ERROR',
      value: summary.error,
      color: CHART_COLORS.error,
    },
  ];

  return (
    <Card style={{ height: '100%' }}>
      <Title level={5} className="mb-3 text-sm">
        Log Level Distribution
      </Title>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
