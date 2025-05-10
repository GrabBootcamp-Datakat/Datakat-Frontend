import { Row, Col } from 'antd';
import { ContentGroupDetails, ContentGroupList, FilterCard } from './detected';

export default function DetectedAnomalies() {
  return (
    <Row
      gutter={16}
      style={{
        minHeight: '100%',
        height: '100%',
        flex: 1,
      }}
    >
      <Col span={8}>
        <div className="flex h-full flex-col gap-4">
          <FilterCard />
          <ContentGroupList />
        </div>
      </Col>
      <Col span={16}>
        <ContentGroupDetails />
      </Col>
    </Row>
  );
}
