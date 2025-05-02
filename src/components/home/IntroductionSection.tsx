import { Space, Col, Row, Tag, Progress, Statistic } from 'antd';
import Title from 'antd/es/typography/Title';
import Button from 'antd/es/button';
import Link from 'next/link';
import {
  ArrowRightOutlined,
  SearchOutlined,
  FileTextOutlined,
  BarChartOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import Paragraph from 'antd/es/typography/Paragraph';
import MetricCard from './MetricCard';
import ShadowCard from './ShadowCard';

export default function IntroductionSection() {
  return (
    <div className="w-full px-16 py-8">
      <Row gutter={[32, 32]} align="middle">
        {/* Left Column - Hero Text */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Space direction="vertical">
              <Title className="!sm:text-5xl !xl:text-6xl">
                Advanced Log & Metrics Monitoring
              </Title>
              <Paragraph type="secondary" className="!m-0 !text-lg">
                Powerful analytics, AI-driven anomaly detection, and natural
                language querying for your system logs and metrics.
              </Paragraph>
            </Space>
            <Link href="/dashboard">
              <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                Go to Dashboard
              </Button>
            </Link>
          </Space>
        </Col>

        {/* Right Column - Metrics Cards */}
        <Col xs={24} lg={12}>
          <ShadowCard>
            <Space direction="vertical" size="large" className="!w-full">
              <Paragraph type="secondary" style={{ margin: 0 }}>
                <SearchOutlined /> Search logs and metrics...
              </Paragraph>

              <Row gutter={[16, 16]} className="!w-full">
                {/* Log Analysis */}
                <Col span={12}>
                  <MetricCard
                    title="Log Analysis"
                    icon={<FileTextOutlined className="!text-blue-500" />}
                    gradientFrom="from-blue-50"
                    gradientTo="to-blue-100"
                  >
                    <Space
                      direction="vertical"
                      size="small"
                      className="!w-full"
                    >
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Total Logs</span>
                        <Tag color="blue">24h</Tag>
                      </div>
                      <Statistic value={12543} className="!text-2xl" />
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
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
                  </MetricCard>
                </Col>

                {/* Metrics */}
                <Col span={12}>
                  <MetricCard
                    title="Metrics"
                    icon={<BarChartOutlined className="!text-green-500" />}
                    gradientFrom="from-green-50"
                    gradientTo="to-green-100"
                  >
                    <Space
                      direction="vertical"
                      size="small"
                      className="!w-full"
                    >
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>System Health</span>
                        <Tag color="green">Live</Tag>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
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
                        <div>
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
                  </MetricCard>
                </Col>
              </Row>

              {/* Anomalies */}
              <MetricCard
                title="Anomalies"
                icon={<WarningOutlined className="!text-purple-500" />}
                gradientFrom="from-purple-50"
                gradientTo="to-purple-100"
                height={120}
              >
                <Space direction="vertical" size="small" className="!w-full">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Recent</span>
                    <Tag color="purple">24h</Tag>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <WarningOutlined className="!text-yellow-500" />
                      <span>CPU spike at 14:30</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <InfoCircleOutlined className="!text-blue-500" />
                      <span>Memory pattern changed</span>
                    </div>
                  </div>
                </Space>
              </MetricCard>
            </Space>
          </ShadowCard>
        </Col>
      </Row>
    </div>
  );
}
