'use client';
import { Card, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { NoDataStatus, ChartSkeleton } from '../common';
import {
  useGetApplicationsQuery,
  useGetDistributionMetricsQuery,
} from '@/store/api/metricsApi';
import { useAppSelector } from '@/hooks/hook';
import { selectApplicationDistribution } from '@/store/slices/dashboardSlice';
import { useState } from 'react';
import {
  TimeRangeCard,
  CustomizationDrawer,
  DistributionChart,
} from './charts';
import { ChartType } from './charts/distribution/type';
export default function ApplicationDistributionCard() {
  const [open, setOpen] = useState(false);
  const { startTime, endTime, metricName, dimension } = useAppSelector(
    selectApplicationDistribution,
  );

  const { data: applications, isLoading: isApplicationsLoading } =
    useGetApplicationsQuery({
      startTime,
      endTime,
    });

  const { data: distributionMetrics, isLoading: isDistributionLoading } =
    useGetDistributionMetricsQuery({
      startTime,
      endTime,
      metricName,
      dimension,
    });

  const [isMultiMode, setIsMultiMode] = useState<boolean>(false);
  const [selectedChartTypes, setSelectedChartTypes] = useState<ChartType[]>([
    'bar',
  ]);

  if (isDistributionLoading || isApplicationsLoading) {
    return <ChartSkeleton title="Application Distribution" />;
  }

  if (!distributionMetrics || !applications) {
    return <NoDataStatus title="Application Distribution" />;
  }

  return (
    <>
      <Card
        title="Application Distribution"
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
            isMultiMode={isMultiMode}
            setIsMultiMode={setIsMultiMode}
            chartTypes={selectedChartTypes}
            onChartTypesChange={setSelectedChartTypes}
          />
        </div>
      </Card>

      <CustomizationDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Application Distribution"
        type="application"
        currentSettings={{
          metricName,
          startTime,
          endTime,
          applications: applications.applications,
          chartTypes: selectedChartTypes,
          isMultiMode,
        }}
        onChartTypesChange={setSelectedChartTypes}
        onIsMultiModeChange={setIsMultiMode}
      />
    </>
  );
}
