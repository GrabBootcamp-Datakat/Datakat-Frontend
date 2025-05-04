'use client';
import { Card, Col, Row } from 'antd';
import { useAppSelector } from '@/hooks/hook';
import { selectIsLoading, selectSummary } from '@/store/slices/dashboardSlice';
import { ChartSkeleton } from '../common/Skeleton';
import { LogLevelCards, LogLevelDistribution } from './logs';

export default function LogLevelOverviewCard() {
  const isLoading = useAppSelector(selectIsLoading);
  const summary = useAppSelector(selectSummary);

  if (isLoading) {
    return <ChartSkeleton title="Log Level Overview" />;
  }

  return (
    <Card title="Log Level Overview" hoverable style={{ flex: 2 }}>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <LogLevelCards summary={summary} />
        </Col>
        <Col span={12}>
          <LogLevelDistribution summary={summary} />
        </Col>
      </Row>
    </Card>
  );
}
