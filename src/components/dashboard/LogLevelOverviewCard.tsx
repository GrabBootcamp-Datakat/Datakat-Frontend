'use client';

import { BarChartOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Progress, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '../constants/color';
import { useGetLogsCountQuery } from '@/store/api/logsApi';
import { ChartSkeleton } from '../common/Skeleton';
import { LogCountDto } from '@/types/logs';
import { NoDataStatus } from '../common/Status';
const { Text, Title } = Typography;

interface LogLevelCardProps {
  icon: React.ReactNode;
  level: 'INFO' | 'WARN' | 'ERROR';
  count: number;
  total: number;
  color: string;
}

const LogLevelCard = ({
  icon,
  level,
  count,
  total,
  color,
}: LogLevelCardProps) => {
  const percentage = Number(((count / total) * 100).toFixed(1));

  return (
    <Card
      styles={{
        body: {
          padding: '12px',
        },
      }}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <Text strong className="text-sm">
              {level}
            </Text>
            <Text className="text-sm">{count}</Text>
          </div>
          <Progress
            percent={percentage}
            strokeColor={color}
            trailColor={CHART_COLORS.background}
            showInfo={false}
            size="small"
          />
          <Text type="secondary" className="mt-1 block text-xs">
            {percentage}%
          </Text>
        </div>
      </div>
    </Card>
  );
};

const LogLevelDistribution = ({ logCount }: { logCount: LogCountDto }) => {
  const pieData = [
    {
      name: 'INFO',
      value: logCount.INFO,
      color: CHART_COLORS.info,
    },
    {
      name: 'WARN',
      value: logCount.WARN,
      color: CHART_COLORS.warn,
    },
    {
      name: 'ERROR',
      value: logCount.ERROR,
      color: CHART_COLORS.error,
    },
  ];

  return (
    <Card
      style={{ height: '100%' }}
      styles={{
        body: {
          padding: '12px',
        },
      }}
    >
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
};

const LogLevelCards = ({ logCount }: { logCount: LogCountDto }) => (
  <div className="flex flex-col gap-3">
    <LogLevelCard
      icon={
        <CheckCircleOutlined
          style={{ color: CHART_COLORS.info, fontSize: '24px' }}
        />
      }
      level="INFO"
      count={logCount.INFO}
      total={logCount.total}
      color={CHART_COLORS.info}
    />
    <LogLevelCard
      icon={
        <WarningOutlined
          style={{ color: CHART_COLORS.warn, fontSize: '24px' }}
        />
      }
      level="WARN"
      count={logCount.WARN}
      total={logCount.total}
      color={CHART_COLORS.warn}
    />
    <LogLevelCard
      icon={
        <CloseCircleOutlined
          style={{ color: CHART_COLORS.error, fontSize: '24px' }}
        />
      }
      level="ERROR"
      count={logCount.ERROR}
      total={logCount.total}
      color={CHART_COLORS.error}
    />
  </div>
);

export default function LogLevelOverviewCard() {
  const { data: logCount, isLoading } = useGetLogsCountQuery();

  if (isLoading) {
    return <ChartSkeleton title="Log Level Overview" />;
  }

  if (!logCount) {
    return <NoDataStatus title="Log Level Overview" />;
  }

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          <span>Log Level Overview</span>
        </Space>
      }
      hoverable
      style={{ flex: 2 }}
      styles={{
        body: {
          padding: '12px',
        },
      }}
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <LogLevelCards logCount={logCount} />
        </Col>
        <Col span={12}>
          <LogLevelDistribution logCount={logCount} />
        </Col>
      </Row>
    </Card>
  );
}
