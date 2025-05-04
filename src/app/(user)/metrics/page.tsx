'use client';
import { useEffect, useState } from 'react';
import { Tabs, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { MetricName, TimeInterval } from '@/types/metrics';
import { useAppDispatch } from '@/hooks/hook';
import { appApi } from '@/store/api/appApi';
import {
  MetricsFilters,
  MetricsStats,
  MetricsChart,
} from '@/components/metrics';
import { LayoutScroll, PageTitle } from '@/components/common';
import Text from 'antd/es/typography/Title';
import dayjs from 'dayjs';

export default function MetricsPage() {
  const dispatch = useAppDispatch();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(15, 'year'),
    dayjs(),
  ]);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString(),
  );
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    [],
  );
  const [selectedMetric, setSelectedMetric] = useState<MetricName>(
    MetricName.LOG_EVENT,
  );
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>(
    TimeInterval.TEN_MINUTES,
  );

  // Convert Day.js date range to ISO strings for components
  const dateRangeISO: [string, string] = [
    dateRange[0].toISOString(),
    dateRange[1].toISOString(),
  ];

  useEffect(() => {
    dispatch(appApi.util.invalidateTags(['Metrics']));
    setCurrentTime(new Date().toLocaleTimeString());
  }, [dispatch, selectedApplications, selectedMetric, selectedInterval]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(appApi.util.invalidateTags(['Metrics']));
      setCurrentTime(new Date().toLocaleTimeString());
    }, 3000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <MetricsFilters
            dateRange={dateRangeISO}
            setDateRange={setDateRange}
            selectedApplications={selectedApplications}
            setSelectedApplications={setSelectedApplications}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            selectedInterval={selectedInterval}
            setSelectedInterval={setSelectedInterval}
          />

          <MetricsStats
            dateRange={dateRangeISO}
            selectedApplications={selectedApplications}
          />

          <MetricsChart
            dateRange={dateRangeISO}
            selectedApplications={selectedApplications}
            selectedMetric={selectedMetric}
            selectedInterval={selectedInterval}
          />
        </Space>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      children: <div>Detailed metrics view coming soon...</div>,
    },
  ];

  return (
    <LayoutScroll>
      <div className="flex items-center justify-between">
        <PageTitle title="Metrics" />
        <div className="flex items-center space-x-2">
          <ClockCircleOutlined className="text-gray-400" />
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Last updated: {currentTime}
          </Text>
        </div>
      </div>

      <Tabs defaultActiveKey="overview" items={tabItems} />
    </LayoutScroll>
  );
}
