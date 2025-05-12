import { Card, Progress } from 'antd';
import { CHART_COLORS } from '@/components/constants/color';
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import { memo } from 'react';
import { MetricDistributionItem } from '@/types/metrics';

interface LogLevelCardProps {
  icon: React.ReactNode;
  level: string;
  count: number;
  total: number;
  color: string;
}

const LogLevelCard = memo((props: LogLevelCardProps) => {
  const { icon, level, count, total, color } = props;
  const percentage = total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0;

  return (
    <Card>
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <Text strong className="text-sm">
              {level}
            </Text>
            <Text className="text-sm">{count.toLocaleString()}</Text>
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
});

LogLevelCard.displayName = 'LogLevelCard';

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

const getLevelIcon = (level: string) => {
  switch (level.toUpperCase()) {
    case 'INFO':
      return (
        <CheckCircleOutlined
          style={{ color: CHART_COLORS.info, fontSize: '24px' }}
        />
      );
    case 'WARN':
      return (
        <WarningOutlined
          style={{ color: CHART_COLORS.warn, fontSize: '24px' }}
        />
      );
    case 'ERROR':
      return (
        <CloseCircleOutlined
          style={{ color: CHART_COLORS.error, fontSize: '24px' }}
        />
      );
    default:
      return (
        <QuestionCircleOutlined
          style={{ color: CHART_COLORS.unknown, fontSize: '24px' }}
        />
      );
  }
};

export default function LogLevelCards({
  distribution,
}: {
  distribution: MetricDistributionItem[];
}) {
  const total = distribution.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      {distribution.map((item) => (
        <LogLevelCard
          key={item.name}
          icon={getLevelIcon(item.name)}
          level={item.name}
          count={item.value}
          total={total}
          color={getLevelColor(item.name)}
        />
      ))}
    </div>
  );
}
