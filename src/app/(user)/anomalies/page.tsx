'use client';
import { Tabs, Row, Typography, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { LayoutStatic, PageTitle } from '@/components/common';
import { DetectedAnomalies, HistoricalAnalysis } from '@/components/anomalies';

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
  return (
    <LayoutStatic>
      <Row justify="space-between" align="middle">
        <PageTitle title="Anomaly Detection" />
        <Space>
          <Text type="secondary" style={{ marginBottom: 0 }}>
            <ClockCircleOutlined /> Last updated:{' '}
            {new Date().toLocaleTimeString()}
          </Text>
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
