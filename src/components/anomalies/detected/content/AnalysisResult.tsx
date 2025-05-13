'use client';
import React from 'react';
import {
  Card,
  Typography,
  Space,
  Tag,
  Collapse,
  Timeline,
  List,
  Descriptions,
  Divider,
} from 'antd';
import { LLMAnalysisResponse } from '@/types/anomaly';
import {
  WarningOutlined,
  BugOutlined,
  AlertOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  RocketOutlined,
  AimOutlined,
} from '@ant-design/icons';
import { SEVERITY_COLORS_TAG, COMPONENT_COLORS } from '@/constants/colors';

const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;

interface AnalysisResultProps {
  analysis: LLMAnalysisResponse;
}

const cardStyles = {
  boxShadow: COMPONENT_COLORS.SHADOW_LIGHT,
  borderRadius: '8px',
  border: `1px solid ${COMPONENT_COLORS.BORDER_LIGHT}`,
};

const panelStyles = {
  marginBottom: '16px',
  borderRadius: '6px',
  overflow: 'hidden',
};

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  const getSeverityColor = (severity: keyof typeof SEVERITY_COLORS_TAG) => {
    return SEVERITY_COLORS_TAG[severity];
  };

  const getPriorityColor = (priority: keyof typeof SEVERITY_COLORS_TAG) => {
    return SEVERITY_COLORS_TAG[priority];
  };

  return (
    <Card
      title={
        <Space>
          <AlertOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 600 }}>Analysis Result</span>
        </Space>
      }
      className="mb-4"
      style={cardStyles}
    >
      <Collapse
        defaultActiveKey={['anomaly', 'rootCause', 'recommendations']}
        style={{ background: 'transparent' }}
      >
        <Panel
          header={
            <Space>
              <WarningOutlined
                style={{
                  color: getSeverityColor(analysis.anomaly_detection.severity),
                }}
              />
              <span style={{ fontWeight: 500 }}>Anomaly Detection</span>
              <Tag
                color={getSeverityColor(analysis.anomaly_detection.severity)}
              >
                {analysis.anomaly_detection.severity}
              </Tag>
            </Space>
          }
          key="anomaly"
          style={panelStyles}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card size="small" style={{ background: '#fafafa' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <Space>
                      <AimOutlined /> Type
                    </Space>
                  }
                >
                  {analysis.anomaly_detection.type}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <AlertOutlined /> Description
                    </Space>
                  }
                >
                  {analysis.anomaly_detection.description}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <ExperimentOutlined /> Affected Component
                    </Space>
                  }
                >
                  {analysis.anomaly_detection.affected_component}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              size="small"
              title={
                <Space>
                  <ClockCircleOutlined /> Related Events
                </Space>
              }
            >
              <Timeline>
                {analysis.anomaly_detection.related_events.map(
                  (event, index) => (
                    <Timeline.Item
                      key={index}
                      color={
                        index === 0
                          ? getSeverityColor(
                              analysis.anomaly_detection.severity,
                            )
                          : 'blue'
                      }
                    >
                      <Text strong>{event.timestamp}</Text>
                      <br />
                      <Text>{event.event}</Text>
                      <Tag style={{ marginLeft: 8 }}>Count: {event.count}</Tag>
                    </Timeline.Item>
                  ),
                )}
              </Timeline>
            </Card>
          </Space>
        </Panel>

        <Panel
          header={
            <Space>
              <BugOutlined style={{ color: '#722ed1' }} />
              <span style={{ fontWeight: 500 }}>Root Cause Analysis</span>
            </Space>
          }
          key="rootCause"
          style={panelStyles}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {analysis.root_cause_analysis.root_causes.map((cause, index) => (
              <Card
                key={index}
                size="small"
                title={
                  <Space>
                    <ExperimentOutlined style={{ color: '#722ed1' }} />
                    Root Cause {index + 1}
                  </Space>
                }
                style={{ background: '#fafafa' }}
              >
                <Paragraph strong style={{ color: '#722ed1' }}>
                  {cause.cause}
                </Paragraph>
                <Paragraph>{cause.description}</Paragraph>
                <Divider style={{ margin: '12px 0' }} />
                <Text strong>Evidence:</Text>
                <List
                  size="small"
                  dataSource={cause.evidence}
                  renderItem={(item) => (
                    <List.Item>
                      <Text style={{ color: '#666' }}>{item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            ))}

            <Card
              size="small"
              title={
                <Space>
                  <RocketOutlined style={{ color: '#eb2f96' }} />
                  Performance Impact
                </Space>
              }
              style={{ background: '#fafafa' }}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Estimated Slowdown">
                  {
                    analysis.root_cause_analysis.performance_impact
                      .estimated_slowdown
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Reason">
                  {analysis.root_cause_analysis.performance_impact.reason}
                </Descriptions.Item>
              </Descriptions>
              <Divider style={{ margin: '12px 0' }} />
              <Text strong>Affected Operations:</Text>
              <List
                size="small"
                dataSource={
                  analysis.root_cause_analysis.performance_impact
                    .affected_operations
                }
                renderItem={(item) => (
                  <List.Item>
                    <Text style={{ color: '#666' }}>{item}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Panel>

        <Panel
          header={
            <Space>
              <ToolOutlined style={{ color: '#52c41a' }} />
              <span style={{ fontWeight: 500 }}>Recommendations</span>
            </Space>
          }
          key="recommendations"
          style={panelStyles}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {analysis.recommendations.recommendations.map((rec, index) => (
              <Card
                key={index}
                size="small"
                title={
                  <Space>
                    <ThunderboltOutlined style={{ color: '#52c41a' }} />
                    {rec.action}
                    <Tag color={getPriorityColor(rec.priority)}>
                      Priority: {rec.priority}
                    </Tag>
                    <Tag color={getPriorityColor(rec.effort_level)}>
                      Effort: {rec.effort_level}
                    </Tag>
                  </Space>
                }
                style={{ background: '#fafafa' }}
              >
                <Paragraph>{rec.description}</Paragraph>
                <Divider style={{ margin: '12px 0' }} />
                <Text strong>Implementation Steps:</Text>
                <List
                  size="small"
                  dataSource={rec.specific_steps}
                  renderItem={(step, stepIndex) => (
                    <List.Item>
                      <Space>
                        <Text strong style={{ color: '#52c41a' }}>
                          {stepIndex + 1}.
                        </Text>
                        <Text>{step}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
                <Divider style={{ margin: '12px 0' }} />
                <Text strong>Expected Outcome: </Text>
                <Paragraph style={{ color: '#666' }}>
                  {rec.expected_outcome}
                </Paragraph>
              </Card>
            ))}

            <Card
              title={
                <Space>
                  <RocketOutlined style={{ color: '#1890ff' }} />
                  Optimization Opportunities
                </Space>
              }
              size="small"
              style={{ background: '#fafafa' }}
            >
              {analysis.recommendations.optimization_opportunities.map(
                (opt, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider style={{ margin: '12px 0' }} />}
                    <Title level={5}>{opt.opportunity}</Title>
                    <Paragraph>{opt.description}</Paragraph>
                    <Text strong>Implementation: </Text>
                    <Paragraph style={{ color: '#666' }}>
                      {opt.implementation}
                    </Paragraph>
                  </React.Fragment>
                ),
              )}
            </Card>
          </Space>
        </Panel>
      </Collapse>
    </Card>
  );
}
