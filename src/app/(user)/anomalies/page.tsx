'use client';
import { useState, useEffect } from 'react';
import { Tabs, Button, Row, Typography, Space, notification } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useGetAnomaliesQuery } from '@/store/api/anomalyApi';
import { LayoutStatic, PageTitle } from '@/components/common';
import { DetectedAnomalies, HistoricalAnalysis } from '@/components/anomalies';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  appendGroupedAnomalies,
  resetGroupedAnomalies,
  selectGroupedAnomalies,
} from '@/store/slices/anomalySlice';
import './page.css';

const { Text } = Typography;

const ITEMS_PER_PAGE = 10;
const POLLING_INTERVAL = 5000; // 5 seconds

const tabItems = [
  {
    key: 'detected',
    label: 'Detected Anomalies',
    children: <DetectedAnomalies />,
  },
  {
    key: 'historical',
    label: 'Historical Analysis',
    children: <HistoricalAnalysis />,
  },
];

export default function AnomaliesPage() {
  const dispatch = useAppDispatch();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [currentOffset, setCurrentOffset] = useState(0);
  const { total } = useAppSelector(selectGroupedAnomalies);

  // Use RTK Query with polling
  const { data: anomaliesData } = useGetAnomaliesQuery(
    {
      limit: ITEMS_PER_PAGE,
      offset: currentOffset,
      start_time: 'now-24h',
      end_time: 'now',
      group_by: 'event_id',
    },
    {
      pollingInterval: POLLING_INTERVAL,
    },
  );

  // Update state when new data arrives
  useEffect(() => {
    if (anomaliesData && 'groups' in anomaliesData) {
      dispatch(
        appendGroupedAnomalies({
          groups: anomaliesData.groups,
          total: anomaliesData.total,
        }),
      );
    }
  }, [anomaliesData, dispatch]);

  // Handle load more
  const handleLoadMore = () => {
    if (total && currentOffset < total) {
      setCurrentOffset((prev) => prev + ITEMS_PER_PAGE);
    } else {
      notificationApi.info({
        message: 'No more anomalies',
        description: 'No more anomalies to fetch',
        duration: 3,
      });
    }
  };

  // Handle reset
  const handleReset = () => {
    setCurrentOffset(0);
    dispatch(resetGroupedAnomalies());
  };

  return (
    <LayoutStatic>
      {notificationContextHolder}
      <Row justify="space-between" align="middle">
        <PageTitle title="Anomaly Detection" />
        <Space>
          <Text type="secondary" style={{ marginBottom: 0 }}>
            <ClockCircleOutlined /> Last updated:{' '}
            {new Date().toLocaleTimeString()}
          </Text>
          <Button
            type="link"
            onClick={handleReset}
            disabled={currentOffset === 0}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={handleLoadMore}
            disabled={total ? currentOffset >= total : true}
          >
            Load More
          </Button>
        </Space>
      </Row>

      <Tabs
        defaultActiveKey="detected"
        items={tabItems}
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
        }}
      />
    </LayoutStatic>
  );
}
