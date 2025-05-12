import { Col, Row } from 'antd';
import { LayoutScroll, PageTitle } from '@/components/common';
import {
  LogLevelOverviewCard,
  AnomalyDetectionCard,
  ComponentDistributionCard,
  ApplicationFrequencyCard,
} from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <LayoutScroll>
      <PageTitle title="Log Analytics Dashboard" />
      <Row gutter={24}>
        <Col span={12}>
          <LogLevelOverviewCard />
        </Col>
        <Col span={12}>
          <AnomalyDetectionCard />
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <ApplicationFrequencyCard />
        </Col>
        <Col span={12}>
          <ComponentDistributionCard />
        </Col>
      </Row>
    </LayoutScroll>
  );
}
