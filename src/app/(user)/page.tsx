'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  ArrowRightOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Statistic, Progress, Tag } from 'antd';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';

/**
 * Home page component that displays the main landing page with introduction and features sections
 */
export default function Home() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <Introduction />
      <Features />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Card component for displaying metrics with consistent styling
 */
const MetricCard = ({
  title,
  icon,
  children,
  className = '',
}: MetricCardProps) => (
  <Card
    size="small"
    className={`!w-full !rounded-lg !shadow-sm !transition-all !duration-300 hover:!shadow-md ${className}`}
    bodyStyle={{ padding: '16px' }}
    style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
    }}
  >
    <Space direction="vertical" size="small" className="!w-full">
      <div className="!flex !w-full !items-center !gap-2">
        {icon}
        <span className="!font-medium">{title}</span>
      </div>
      {children}
    </Space>
  </Card>
);

/**
 * Introduction section component that displays the main hero section with metrics cards
 */
const Introduction = () => {
  return (
    <div className="!w-full !px-24 !py-8">
      <Row gutter={[32, 32]} align="middle">
        {/* Left Column - Hero Text */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" className="!w-full">
            <div className="!w-full !space-y-4">
              <Title className="!sm:text-5xl !xl:text-6xl !text-4xl !text-gray-900">
                Advanced Log & Metrics Monitoring
              </Title>
              <Title
                className="!max-w-[600px] !text-lg !text-gray-600"
                level={3}
              >
                Powerful analytics, AI-driven anomaly detection, and natural
                language querying for your system logs and metrics.
              </Title>
            </div>
            <Link href="/dashboard" className="!w-full">
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                Go to Dashboard
              </Button>
            </Link>
          </Space>
        </Col>

        {/* Right Column - Metrics Cards */}
        <Col xs={24} lg={12}>
          <Card
            className="!w-full !rounded-xl !shadow-xl !transition-all !duration-300 hover:!shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
            }}
            styles={{
              body: {
                padding: '24px',
              },
            }}
          >
            <Space direction="vertical" size="large" className="!w-full">
              {/* Search Bar */}
              <div className="!flex !w-full !items-center !gap-2">
                <SearchOutlined className="!text-gray-400" />
                <span className="!text-sm !text-gray-500">
                  Search logs and metrics...
                </span>
              </div>

              {/* Metrics Grid */}
              <Row gutter={[16, 16]} className="!w-full">
                {/* Log Analysis Card */}
                <Col span={12}>
                  <MetricCard
                    title="Log Analysis"
                    icon={<FileTextOutlined className="!text-blue-500" />}
                  >
                    <div className="!h-[140px] !w-full !rounded-md !bg-gradient-to-br !from-blue-50 !to-blue-100 !p-4">
                      <Space
                        direction="vertical"
                        size="small"
                        className="!w-full"
                      >
                        <div className="!flex !w-full !items-center !justify-between">
                          <span className="!text-sm !text-gray-600">
                            Total Logs
                          </span>
                          <Tag color="blue">24h</Tag>
                        </div>
                        <Statistic value={12543} className="!text-2xl" />
                        <div className="!w-full !space-y-1">
                          <div className="!flex !w-full !justify-between !text-sm">
                            <span>Info</span>
                            <span>8,432</span>
                          </div>
                          <Progress
                            percent={67}
                            strokeColor="#1890ff"
                            showInfo={false}
                          />
                        </div>
                      </Space>
                    </div>
                  </MetricCard>
                </Col>

                {/* Metrics Card */}
                <Col span={12}>
                  <MetricCard
                    title="Metrics"
                    icon={<BarChartOutlined className="!text-green-500" />}
                  >
                    <div className="!h-[140px] !w-full !rounded-md !bg-gradient-to-br !from-green-50 !to-green-100 !p-4">
                      <Space
                        direction="vertical"
                        size="small"
                        className="!w-full"
                      >
                        <div className="!flex !w-full !items-center !justify-between">
                          <span className="!text-sm !text-gray-600">
                            System Health
                          </span>
                          <Tag color="green">Live</Tag>
                        </div>
                        <div className="!grid !w-full !grid-cols-2 !gap-2">
                          <div className="!w-full">
                            <Statistic
                              title="CPU"
                              value={42}
                              suffix="%"
                              valueStyle={{ color: '#52c41a' }}
                            />
                            <Progress
                              percent={42}
                              strokeColor="#52c41a"
                              showInfo={false}
                            />
                          </div>
                          <div className="!w-full">
                            <Statistic
                              title="Memory"
                              value={65}
                              suffix="%"
                              valueStyle={{ color: '#1890ff' }}
                            />
                            <Progress
                              percent={65}
                              strokeColor="#1890ff"
                              showInfo={false}
                            />
                          </div>
                        </div>
                      </Space>
                    </div>
                  </MetricCard>
                </Col>
              </Row>

              {/* Anomalies Card */}
              <MetricCard
                title="Anomalies"
                icon={<WarningOutlined className="!text-purple-500" />}
              >
                <div className="!h-[120px] !w-full !rounded-md !bg-gradient-to-br !from-purple-50 !to-purple-100 !p-4">
                  <Space direction="vertical" size="small" className="!w-full">
                    <div className="!flex !w-full !items-center !justify-between">
                      <span className="!text-sm !text-gray-600">Recent</span>
                      <Tag color="purple">24h</Tag>
                    </div>
                    <div className="!w-full !space-y-2">
                      <div className="!flex !w-full !items-center !gap-2">
                        <WarningOutlined className="!text-yellow-500" />
                        <span className="!text-sm">CPU spike at 14:30</span>
                      </div>
                      <div className="!flex !w-full !items-center !gap-2">
                        <InfoCircleOutlined className="!text-blue-500" />
                        <span className="!text-sm">Memory pattern changed</span>
                      </div>
                    </div>
                  </Space>
                </div>
              </MetricCard>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  stats: string[];
  linkText: string;
  linkHref: string;
}

/**
 * Feature card component for displaying feature information
 */
const FeatureCard = ({
  title,
  description,
  icon,
  stats,
  linkText,
  linkHref,
}: FeatureCardProps) => (
  <Card
    className="!h-full !rounded-xl !shadow-lg !transition-all !duration-300 hover:!shadow-xl"
    bodyStyle={{
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid rgba(226, 232, 240, 0.8)',
    }}
  >
    {/* <Space direction="vertical" size="large" className="!h-full !w-full"> */}
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="!w-full">
        <Title level={4}>{title}</Title>
        <Paragraph className="!text-gray-600">{description}</Paragraph>
      </div>
      <div className="!flex !h-[120px] w-full grow !items-center !justify-center !rounded-md !bg-gradient-to-br !from-blue-50 !to-blue-100 !p-4">
        <Space direction="vertical" size="small" className="!text-center">
          {icon}
          <div className="!text-sm !text-gray-600">
            {stats.map((stat: string, index: number) => (
              <div key={index}>{stat}</div>
            ))}
          </div>
        </Space>
      </div>
      <div className="!mt-auto !w-full">
        <Link href={linkHref} className="!w-full">
          <Button type="primary" block size="large">
            {linkText}
          </Button>
        </Link>
      </div>
    </div>
    {/* </Space> */}
  </Card>
);

/**
 * Features section component that displays the key features of the platform
 */
const Features = () => {
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

  return (
    <div className="!md:py-24 !lg:py-32 !w-full !py-16">
      <div className="!md:px-6 !container !mx-auto !px-4">
        <div className="!mb-16 !text-center">
          <Title level={2} className="!md:text-4xl !text-3xl !text-gray-900">
            Key Features
          </Title>
          <Paragraph className="!mx-auto !mt-4 !max-w-[85%] !text-lg !text-gray-600">
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
};
