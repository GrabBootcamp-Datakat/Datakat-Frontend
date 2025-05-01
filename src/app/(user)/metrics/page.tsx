'use client';
import { useEffect, useState } from 'react';
import { Typography, Tabs, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { MetricName, TimeInterval } from '@/types/metrics';
import { useAppDispatch } from '@/lib/hooks/hook';
import { appApi } from '@/store/api/appApi';
import MetricsFilters from '@/components/metrics/MetricsFilters';
import MetricsStats from '@/components/metrics/MetricsStats';
import MetricsChart from '@/components/metrics/MetricsChart';
import LayoutScroll from '@/components/common/LayoutScroll';
import PageTitle from '@/components/common/PageTitle';
import dayjs from 'dayjs';
const { Text } = Typography;

export default function MetricsPage() {
  const dispatch = useAppDispatch();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(25, 'year'),
    dayjs(),
  ]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    [],
  );
  const [selectedMetric, setSelectedMetric] = useState<MetricName>(
    MetricName.LOG_EVENT,
  );
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>(
    TimeInterval.ONE_MINUTE,
  );

  useEffect(() => {
    dispatch(appApi.util.invalidateTags(['Metrics']));
  }, [dispatch, selectedApplications, selectedMetric, selectedInterval]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(appApi.util.invalidateTags(['Metrics']));
    }, 3000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const currentTime = new Date().toLocaleTimeString();

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <MetricsFilters
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedApplications={selectedApplications}
            setSelectedApplications={setSelectedApplications}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            selectedInterval={selectedInterval}
            setSelectedInterval={setSelectedInterval}
          />

          <MetricsStats
            dateRange={dateRange}
            selectedApplications={selectedApplications}
          />

          <MetricsChart
            dateRange={dateRange}
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
