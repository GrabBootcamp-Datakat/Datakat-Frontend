'use client';
import { Card, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface TimeRangeCardProps {
  startTime: string;
  endTime: string;
}

export default function TimeRangeCard(props: TimeRangeCardProps) {
  const { startTime, endTime } = props;
  return (
    <Card size="small" className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined />
          <Text className="text-sm font-medium">Time Range</Text>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 pl-6 text-sm">
          <div className="flex items-center gap-1">
            <Text className="font-medium">From:</Text>
            <Text className="font-mono">
              {dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </div>
          <div className="flex items-center gap-1">
            <Text className="font-medium">To:</Text>
            <Text>{dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
