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
    linkHref: 'anomalies', // Anchor link
  },
  {
    title: 'Natural Language Q&A',
    description: 'Query your logs and metrics using natural language',
    icon: <SearchOutlined className="!text-4xl !text-green-500" />,
    stats: ['Query Accuracy: 95%', 'Response Time: 1s'],
    linkText: 'Try Queries',
    linkHref: 'query', // Anchor link
  },
  {
    title: 'Advanced Visualizations',
    description: 'Comprehensive visualization for logs and metrics',
    icon: <BarChartOutlined className="!text-4xl !text-purple-500" />,
    stats: ['Chart Types: 15+', 'Real-time Updates'],
    linkText: 'View Metrics',
    linkHref: 'metrics', // Anchor link
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <Title level={2} className="text-3xl md:text-4xl text-gray-900">
            Key Features
          </Title>
          <Paragraph className="text-lg m-0">
            Our monitoring system provides powerful tools for analyzing logs and metrics.
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
    </section>
  );
}
