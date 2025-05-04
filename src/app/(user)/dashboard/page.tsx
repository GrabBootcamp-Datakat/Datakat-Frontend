'use client';
import { useEffect } from 'react';
import { Col, Row } from 'antd';
import { LayoutScroll, PageTitle } from '@/components/common';
import {
  LogLevelOverviewCard,
  AnomalyDetectionCard,
  TimeSeriesCard,
  TimeDistributionCard,
  ComponentDistributionCard,
  ApplicationFrequencyCard,
} from '@/components/dashboard';
import { useGetLogsQuery } from '@/store/api/logsApi';
import { setIsLoading, setLogs } from '@/store/slices/dashboardSlice';
import { selectDateRange } from '@/store/slices/dashboardSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/hook';
import { SortBy, SortOrder } from '@/types/logs';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector(selectDateRange);
  const { data, isLoading } = useGetLogsQuery({
    startTime: dateRange[0],
    endTime: dateRange[1],
    page: 1,
    size: 1000,
    sortBy: SortBy.TIMESTAMP,
    sortOrder: SortOrder.ASC,
  });

  useEffect(() => {
    dispatch(setIsLoading(isLoading));
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (data) {
      dispatch(setLogs(data.logs));
    }
  }, [dispatch, data]);

  return (
    <LayoutScroll>
      <PageTitle title="Log Analytics Dashboard" />
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <LogLevelOverviewCard />
        </Col>
        <Col span={12}>
          <AnomalyDetectionCard />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={14}>
          <TimeSeriesCard />
        </Col>
        <Col span={10}>
          <ComponentDistributionCard />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={14}>
          <TimeDistributionCard />
        </Col>
        <Col span={10}>
          <ApplicationFrequencyCard />
        </Col>
      </Row>
    </LayoutScroll>
  );
}
