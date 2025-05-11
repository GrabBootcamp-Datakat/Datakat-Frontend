'use client';
import { useEffect, useState } from 'react';
import { Tabs, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/hooks/hook';
import { appApi } from '@/store/api/appApi';
import {
  MetricsFilters,
  MetricsStats,
  MetricsChart,
} from '@/components/metrics';
import { LayoutScroll, PageTitle } from '@/components/common';
import Text from 'antd/es/typography/Title';

const tabItems = [
  {
    key: 'overview',
    label: 'Overview',
    children: (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <MetricsFilters />
        <MetricsStats />
        <MetricsChart />
      </Space>
    ),
  },
  // {
  //   key: 'details',
  //   label: 'Details',
  //   children: <div>Detailed metrics view coming soon...</div>,
  // },
];

export default function MetricsPage() {
  const dispatch = useAppDispatch();
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString(),
  );

  useEffect(() => {
    dispatch(appApi.util.invalidateTags(['Metrics']));
    setCurrentTime(new Date().toLocaleTimeString());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(appApi.util.invalidateTags(['Metrics']));
      setCurrentTime(new Date().toLocaleTimeString());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

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
