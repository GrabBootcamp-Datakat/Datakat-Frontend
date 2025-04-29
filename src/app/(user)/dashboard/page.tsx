import { Col, Row } from 'antd';
import LayoutScroll from '@/components/common/LayoutScroll';
import PageTitle from '@/components/common/PageTitle';
import LogLevelOverviewCard from '@/components/dashboard/LogLevelOverviewCard';
import AnomalyDetectionCard from '@/components/dashboard/AnomalyDetectionCard';
import TimeSeriesCard from '@/components/dashboard/TimeSeriesCard';
import TimeDistributionCard from '@/components/dashboard/TimeDistributionCard';
import ComponentDistributionCard from '@/components/dashboard/ComponentDistributionCard';
import EventFrequencyCard from '@/components/dashboard/EventFrequencyCard';

export default function DashboardPage() {
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
          <EventFrequencyCard />
        </Col>
      </Row>
    </LayoutScroll>
  );
}
