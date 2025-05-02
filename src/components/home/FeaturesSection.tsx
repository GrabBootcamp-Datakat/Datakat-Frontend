import {
  SearchOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';
import FeatureCard, { FeatureCardProps } from './FeatureCard';

const features: FeatureCardProps[] = [
  {
    title: 'Anomaly Detection',
    description: 'Machine learning-powered anomaly detection',
    icon: <ThunderboltOutlined className="!text-4xl !text-blue-500" />,
    stats: ['Detection Rate: 98.5%', 'False Positives: 0.2%'],
    linkText: 'View Anomalies',
    linkHref: '/anomalies',
  },
  {
    title: 'Natural Language Q&A',
    description: 'Query your logs and metrics using natural language',
    icon: <SearchOutlined className="!text-4xl !text-green-500" />,
    stats: ['Query Accuracy: 95%', 'Response Time: 1s'],
    linkText: 'Try Queries',
    linkHref: '/query',
  },
  {
    title: 'Advanced Visualizations',
    description: 'Comprehensive visualization options for logs and metrics',
    icon: <BarChartOutlined className="!text-4xl !text-purple-500" />,
    stats: ['Chart Types: 15+', 'Real-time Updates'],
    linkText: 'View Metrics',
    linkHref: '/metrics',
  },
];

export default function FeaturesSection() {
  return (
    <div className="!md:py-24 !lg:py-32 !w-full !py-16">
      <div className="!md:px-6 !container !mx-auto !px-4">
        <div className="!mb-16 !text-center">
          <Title level={2} className="!md:text-4xl !text-3xl !text-gray-900">
            Key Features
          </Title>
          <Paragraph className="!m-0 !text-lg">
            Our monitoring system provides powerful tools for analyzing logs and
            metrics.
          </Paragraph>
        </div>
        <Row gutter={[32, 32]} justify="center">
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <FeatureCard {...feature} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
