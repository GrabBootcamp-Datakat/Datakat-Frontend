'use client';
import { useEffect, useState } from 'react';
import { Tabs, Button, Row, Typography, Space, notification } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useGetAnomaliesQuery } from '@/store/api/anomalyApi';
import { LayoutStatic, PageTitle } from '@/components/common';
import {
  setAnomalies,
  loadMore,
  addAnomaly,
} from '@/store/slices/anomalySlice';
import { selectPagination } from '@/store/slices/anomalySlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  DetectedAnomalies,
  // DetectionSettings,
  HistoricalAnalysis,
} from '@/components/anomalies';
import './page.css';

const { Text } = Typography;

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
  const [isNotified, setIsNotified] = useState(false);
  const pagination = useAppSelector(selectPagination);
  const { data: anomaliesData, refetch } = useGetAnomaliesQuery({
    limit: pagination.limit,
    offset: pagination.offset,
  });

  useEffect(() => {
    if (!anomaliesData?.items) return;

    const total = anomaliesData.total;
    const isWithinRange = pagination.offset < total;

    if (isWithinRange) {
      if (pagination.offset === 0) {
        dispatch(setAnomalies(anomaliesData.items));
      } else {
        dispatch(addAnomaly(anomaliesData.items));
      }
      setIsNotified(false);
    } else {
      if (!isNotified) {
        notificationApi.open({
          message: 'No more anomalies',
          description: 'No more anomalies to fetch',
          duration: 3,
          type: 'info',
          showProgress: true,
        });
        setIsNotified(true);
      }
    }
  }, [dispatch, anomaliesData, pagination.offset, isNotified, notificationApi]);

  useEffect(() => {
    refetch();
  }, [refetch, pagination]);

  // auto fetch anomalies
  useEffect(() => {
    const total = anomaliesData?.total || 0;
    const interval = setInterval(() => {
      if (pagination.offset < total) {
        dispatch(loadMore());
      } else {
        refetch();
      }
    }, 1000 * 5); // 3 s
    return () => clearInterval(interval);
  }, [dispatch, anomaliesData?.total, pagination.offset, refetch]);

  const handleLoadMore = () => {
    dispatch(loadMore());
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
            onClick={handleLoadMore}
            disabled={pagination.offset === 0}
          >
            Reset
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
