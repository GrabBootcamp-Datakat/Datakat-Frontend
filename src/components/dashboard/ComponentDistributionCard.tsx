'use client';
import { Card, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { NoDataStatus, ChartSkeleton } from '../common';
import { useGetDistributionMetricsQuery } from '@/store/api/metricsApi';
import { useAppSelector } from '@/hooks/hook';
import { selectComponentDistribution } from '@/store/slices/dashboardSlice';
import { useState } from 'react';
import {
  TimeRangeCard,
  CustomizationDrawer,
  DistributionChart,
} from './charts';

export default function ComponentDistributionCard() {
  const [open, setOpen] = useState(false);
  const { startTime, endTime, metricName, dimension } = useAppSelector(
    selectComponentDistribution,
  );

  const { data: distributionMetrics, isLoading: isDistributionLoading } =
    useGetDistributionMetricsQuery({
      startTime,
      endTime,
      metricName,
      dimension,
    });

  if (isDistributionLoading) {
    return <ChartSkeleton title="Component Distribution" />;
  }

  if (!distributionMetrics) {
    return <NoDataStatus title="Component Distribution" />;
  }

  return (
    <>
      <Card
        title="Component Distribution"
        hoverable
        extra={
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setOpen(true)}
          >
            Customize
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          <TimeRangeCard startTime={startTime} endTime={endTime} />
          <DistributionChart
            data={distributionMetrics.distribution}
            dimension={dimension}
            logsQuery={{ startTime, endTime }}
          />
        </div>
      </Card>

      <CustomizationDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Component Distribution"
        currentSettings={{
          metricName,
          startTime,
          endTime,
        }}
        type="component"
      />
    </>
  );
}
