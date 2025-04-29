'use client';
import { Card, Space, Button, DatePicker, Typography } from 'antd';
import { memo, useCallback } from 'react';
import { useAppDispatch } from '@/lib/hooks/hook';
import { setTimeAnalysisCustomization } from '@/store/slices/chartCustomizationSlice';
import { TimeUnit } from '@/types/log';
import { ChartSkeleton } from '../common/Skeleton';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface TimeCustomizationProps {
  isLoading?: boolean;
}

export const TimeCustomization = memo(
  ({ isLoading }: TimeCustomizationProps) => {
    const dispatch = useAppDispatch();

    const handleCustomize = useCallback(() => {
      dispatch(setTimeAnalysisCustomization({ isCustomizing: true }));
    }, [dispatch]);

    if (isLoading) {
      return (
        <Card title="Time Customization" hoverable>
          <ChartSkeleton />
        </Card>
      );
    }

    return (
      <Card
        title="Time Customization"
        hoverable
        extra={
          <Button type="primary" onClick={handleCustomize}>
            Apply
          </Button>
        }
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Text strong>Time Range</Text>
            <RangePicker
              style={{ width: '100%', marginTop: 8 }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </div>
          <div>
            <Text strong>Time Unit</Text>
            <Space style={{ marginTop: 8 }}>
              {Object.values(TimeUnit).map((unit) => (
                <Button key={unit} type="default">
                  {unit}
                </Button>
              ))}
            </Space>
          </div>
        </Space>
      </Card>
    );
  },
);

TimeCustomization.displayName = 'TimeCustomization';
