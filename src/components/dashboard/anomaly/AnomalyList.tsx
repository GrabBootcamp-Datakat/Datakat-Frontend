'use client';
import { Card, Tag, Typography, Tooltip, Button } from 'antd';
import { memo } from 'react';
import { AnomalyLogEntry } from '@/types/anomaly';
import {
  ClockCircleOutlined,
  AlertOutlined,
  AppstoreOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { LOG_LEVEL_COLORS, COMPONENT_COLORS } from '@/constants/colors';

const { Text, Paragraph } = Typography;

const AnomalyList = memo(({ anomalies }: { anomalies: AnomalyLogEntry[] }) => {
  const router = useRouter();

  const severityColor = (level: string) => {
    return (
      LOG_LEVEL_COLORS[level.toUpperCase() as keyof typeof LOG_LEVEL_COLORS] ||
      LOG_LEVEL_COLORS.DEFAULT
    );
  };

  const getRelativeTime = (timestamp: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diff = new Date(timestamp).getTime() - Date.now();
    const diffMinutes = Math.round(diff / (1000 * 60));
    const diffHours = Math.round(diff / (1000 * 60 * 60));

    if (Math.abs(diffMinutes) < 60) {
      return rtf.format(diffMinutes, 'minute');
    }
    return rtf.format(diffHours, 'hour');
  };

  const handleViewDetails = (anomaly: AnomalyLogEntry) => {
    router.push(`/anomalies?event_id=${anomaly.event_id}`);
  };

  if (!anomalies.length) {
    return (
      <Card
        size="small"
        className="py-6 text-center"
        style={{ background: COMPONENT_COLORS.BG_LIGHT }}
      >
        <Text type="secondary">No anomalies detected in the last 24 hours</Text>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {anomalies.map((anomaly) => (
        <Card
          key={anomaly.id}
          size="small"
          className="transition-shadow duration-200 hover:shadow-md"
          bodyStyle={{ padding: '12px' }}
          style={{
            borderColor: COMPONENT_COLORS.BORDER_LIGHT,
          }}
        >
          <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag
                  icon={<AlertOutlined />}
                  style={{
                    margin: 0,
                    color: severityColor(anomaly.level),
                    borderColor: severityColor(anomaly.level),
                    backgroundColor: `${severityColor(anomaly.level)}10`,
                  }}
                >
                  {anomaly.level}
                </Tag>
                <Tooltip title="Component">
                  <Tag
                    icon={<AppstoreOutlined />}
                    style={{
                      margin: 0,
                      color: LOG_LEVEL_COLORS.INFO,
                      borderColor: LOG_LEVEL_COLORS.INFO,
                      backgroundColor: `${LOG_LEVEL_COLORS.INFO}10`,
                    }}
                  >
                    {anomaly.component}
                  </Tag>
                </Tooltip>
              </div>
              <Tooltip title={new Date(anomaly.timestamp).toLocaleString()}>
                <Text
                  type="secondary"
                  className="flex items-center gap-1"
                  style={{ color: COMPONENT_COLORS.TEXT_SECONDARY }}
                >
                  <ClockCircleOutlined />
                  {getRelativeTime(anomaly.timestamp)}
                </Text>
              </Tooltip>
            </div>

            {/* Content */}
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{
                margin: 0,
                fontSize: '13px',
                color: COMPONENT_COLORS.TEXT_PRIMARY,
              }}
            >
              {anomaly.content}
            </Paragraph>

            {/* Footer */}
            <div className="mt-1 flex items-center justify-between">
              <div className="flex gap-2">
                {anomaly.metadata &&
                  Object.entries(anomaly.metadata).map(([key, value]) => (
                    <Tooltip key={key} title={key}>
                      <Tag
                        style={{
                          margin: 0,
                          color: LOG_LEVEL_COLORS.DEFAULT,
                          borderColor: LOG_LEVEL_COLORS.DEFAULT,
                          backgroundColor: `${LOG_LEVEL_COLORS.DEFAULT}10`,
                        }}
                      >
                        {value}
                      </Tag>
                    </Tooltip>
                  ))}
              </div>
              <Button
                type="link"
                size="small"
                className="flex items-center"
                style={{ color: LOG_LEVEL_COLORS.INFO }}
                onClick={() => handleViewDetails(anomaly)}
              >
                View Details
                <RightOutlined />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
});

AnomalyList.displayName = 'AnomalyList';
export default AnomalyList;
