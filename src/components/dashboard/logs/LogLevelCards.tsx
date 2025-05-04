import { Card, Progress } from 'antd';
import { CHART_COLORS } from '@/components/constants/color';
import { LogLevelSummary } from '@/store/slices/dashboardSlice';
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import Text from 'antd/es/typography/Text';
import { memo } from 'react';

interface LogLevelCardProps {
  icon: React.ReactNode;
  level: 'INFO' | 'WARN' | 'ERROR';
  count: number;
  total: number;
  color: string;
}

const LogLevelCard = memo((props: LogLevelCardProps) => {
  const { icon, level, count, total, color } = props;
  const percentage = Number(((count / total) * 100).toFixed(1));

  return (
    <Card>
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
});

LogLevelCard.displayName = 'LogLevelCard';

export default function LogLevelCards({
  summary,
}: {
  summary: LogLevelSummary;
}) {
  return (
    <div className="flex flex-col gap-3">
      <LogLevelCard
        icon={
          <CheckCircleOutlined
            style={{ color: CHART_COLORS.info, fontSize: '24px' }}
          />
        }
        level="INFO"
        count={summary.info}
        total={summary.total}
        color={CHART_COLORS.info}
      />
      <LogLevelCard
        icon={
          <WarningOutlined
            style={{ color: CHART_COLORS.warn, fontSize: '24px' }}
          />
        }
        level="WARN"
        count={summary.warn}
        total={summary.total}
        color={CHART_COLORS.warn}
      />
      <LogLevelCard
        icon={
          <CloseCircleOutlined
            style={{ color: CHART_COLORS.error, fontSize: '24px' }}
          />
        }
        level="ERROR"
        count={summary.error}
        total={summary.total}
        color={CHART_COLORS.error}
      />
    </div>
  );
}
