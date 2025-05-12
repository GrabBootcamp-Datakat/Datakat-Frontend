'use client';
import { Card, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/hooks/hook';
import { selectLogLevelOverview } from '@/store/slices/dashboardSlice';
import { ChartSkeleton } from '../common/Skeleton';
import { LogLevelCards, LogLevelDistribution } from './logs';
import {
  useGetApplicationsQuery,
  useGetDistributionMetricsQuery,
} from '@/store/api/metricsApi';
import { useState } from 'react';
import { TimeRangeCard, CustomizationDrawer } from './charts';

export default function LogLevelOverviewCard() {
  const {
    startTime,
    endTime,
    metricName,
    dimension,
    applications: selectedApps = [],
  } = useAppSelector(selectLogLevelOverview);
  const [open, setOpen] = useState(false);

  const { data: applications } = useGetApplicationsQuery({
    startTime,
    endTime,
  });

  const { data: distributionMetrics, isLoading: isDistributionLoading } =
    useGetDistributionMetricsQuery({
      startTime,
      endTime,
      metricName,
      dimension,
      applications: selectedApps.length > 0 ? selectedApps : undefined,
    });

  if (isDistributionLoading) {
    return <ChartSkeleton title="Log Level Overview" />;
  }

  return (
    <Card
      title="Log Level Overview"
      hoverable
      style={{ flex: 2 }}
      extra={
        <Button
          size="small"
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
        <LogLevelCards distribution={distributionMetrics?.distribution || []} />
        <LogLevelDistribution
          distribution={distributionMetrics?.distribution || []}
        />
      </div>

      <CustomizationDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Log Level Overview"
        currentSettings={{
          metricName,
          startTime,
          endTime,
          applications: selectedApps,
        }}
        type="logLevel"
        availableApplications={applications?.applications}
      />
    </Card>
  );
}
