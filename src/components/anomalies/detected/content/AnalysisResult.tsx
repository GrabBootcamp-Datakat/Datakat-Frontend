'use client';
import React from 'react';
import {
  Card,
  Typography,
  Space,
  Tag,
  Collapse,
  Progress,
  Timeline,
  Alert,
} from 'antd';
import { LLMAnalysisResponse } from '@/types/anomaly';
import {
  WarningOutlined,
  BugOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { Panel } = Collapse;

interface AnalysisResultProps {
  analysis: LLMAnalysisResponse;
}

export const SEVERITY_COLORS = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'blue',
};

export const PRIORITY_COLORS = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'blue',
};

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const getSeverityColor = (severity: string) => {
    return SEVERITY_COLORS[
      severity.toUpperCase() as keyof typeof SEVERITY_COLORS
    ];
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[
      priority.toUpperCase() as keyof typeof PRIORITY_COLORS
    ];
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        message="Anomaly Analysis Results"
        description={`Analysis ID: ${analysis.anomaly_detection.anomaly_id}`}
        type="info"
        showIcon
      />

      <Collapse defaultActiveKey={['1']}>
        <Panel
          header={
            <Space>
              <WarningOutlined />
              <Text strong>Anomaly Detection</Text>
              <Tag
                color={getSeverityColor(analysis.anomaly_detection.severity)}
              >
                {analysis.anomaly_detection.severity}
              </Tag>
            </Space>
          }
          key="1"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">Type:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    {analysis.anomaly_detection.type}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Affected Component:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    {analysis.anomaly_detection.affected_component}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Description:</Text>
                  <Text style={{ marginLeft: 8 }}>
                    {analysis.anomaly_detection.description}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Confidence:</Text>
                  <Progress
                    percent={Math.round(
                      analysis.anomaly_detection.confidence * 100,
                    )}
                    size="small"
                    style={{ marginLeft: 8, width: 200 }}
                  />
                </div>
              </Space>
            </Card>

            {analysis.anomaly_detection.related_events.length > 0 && (
              <Card size="small" title="Related Events">
                <Timeline>
                  {analysis.anomaly_detection.related_events.map(
                    (event, index) => (
                      <Timeline.Item key={index} dot={<ClockCircleOutlined />}>
                        <Text strong>
                          {new Date(event.timestamp).toLocaleString()}
                        </Text>
                        <br />
                        <Text>{event.event}</Text>
                        {event.count > 1 && (
                          <Tag color="blue" style={{ marginLeft: 8 }}>
                            {event.count} occurrences
                          </Tag>
                        )}
                      </Timeline.Item>
                    ),
                  )}
                </Timeline>
              </Card>
            )}
          </Space>
        </Panel>

        <Panel
          header={
            <Space>
              <BugOutlined />
              <Text strong>Root Cause Analysis</Text>
            </Space>
          }
          key="2"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {analysis.root_cause_analysis.root_causes.map((cause, index) => (
              <Card key={index} size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text type="secondary">Cause:</Text>
                    <Text strong style={{ marginLeft: 8 }}>
                      {cause.cause}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary">Description:</Text>
                    <Text style={{ marginLeft: 8 }}>{cause.description}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Confidence:</Text>
                    <Progress
                      percent={Math.round(cause.confidence * 100)}
                      size="small"
                      style={{ marginLeft: 8, width: 200 }}
                    />
                  </div>
                  {cause.evidence.length > 0 && (
                    <div>
                      <Text type="secondary">Evidence:</Text>
                      <ul style={{ marginTop: 8 }}>
                        {cause.evidence.map((item, idx) => (
                          <li key={idx}>
                            <Text>{item}</Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Space>
              </Card>
            ))}

            <Card size="small" title="Performance Impact">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">Estimated Slowdown:</Text>
                  <Text strong style={{ marginLeft: 8 }}>
                    {
                      analysis.root_cause_analysis.performance_impact
                        .estimated_slowdown
                    }
                  </Text>
                </div>
                <div>
                  <Text type="secondary">Reason:</Text>
                  <Text style={{ marginLeft: 8 }}>
                    {analysis.root_cause_analysis.performance_impact.reason}
                  </Text>
                </div>
                {analysis.root_cause_analysis.performance_impact
                  .affected_operations.length > 0 && (
                  <div>
                    <Text type="secondary">Affected Operations:</Text>
                    <ul style={{ marginTop: 8 }}>
                      {analysis.root_cause_analysis.performance_impact.affected_operations.map(
                        (op, idx) => (
                          <li key={idx}>
                            <Text>{op}</Text>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </Space>
            </Card>
          </Space>
        </Panel>

        <Panel
          header={
            <Space>
              <BulbOutlined />
              <Text strong>Recommendations</Text>
            </Space>
          }
          key="3"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {analysis.recommendations.recommendations.map((rec, index) => (
              <Card key={index} size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <Text type="secondary">Action:</Text>
                      <Text strong style={{ marginLeft: 8 }}>
                        {rec.action}
                      </Text>
                    </div>
                    <Space>
                      <Tag color={getPriorityColor(rec.priority)}>
                        Priority: {rec.priority}
                      </Tag>
                      <Tag color="blue">Effort: {rec.effort_level}</Tag>
                    </Space>
                  </div>
                  <div>
                    <Text type="secondary">Description:</Text>
                    <Text style={{ marginLeft: 8 }}>{rec.description}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Success Rate:</Text>
                    <Progress
                      percent={Math.round(rec.success_rate * 100)}
                      size="small"
                      style={{ marginLeft: 8, width: 200 }}
                    />
                  </div>
                  <div>
                    <Text type="secondary">Expected Outcome:</Text>
                    <Text style={{ marginLeft: 8 }}>
                      {rec.expected_outcome}
                    </Text>
                  </div>
                  {rec.specific_steps.length > 0 && (
                    <div>
                      <Text type="secondary">Implementation Steps:</Text>
                      <Timeline style={{ marginTop: 8 }}>
                        {rec.specific_steps.map((step, idx) => (
                          <Timeline.Item
                            key={idx}
                            dot={<CheckCircleOutlined />}
                          >
                            <Text>{step}</Text>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  )}
                </Space>
              </Card>
            ))}

            {analysis.recommendations.optimization_opportunities.length > 0 && (
              <Card size="small" title="Optimization Opportunities">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {analysis.recommendations.optimization_opportunities.map(
                    (opp, index) => (
                      <div key={index}>
                        <Text strong>{opp.opportunity}</Text>
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary">Description:</Text>
                          <Text style={{ marginLeft: 8 }}>
                            {opp.description}
                          </Text>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary">Implementation:</Text>
                          <Text style={{ marginLeft: 8 }}>
                            {opp.implementation}
                          </Text>
                        </div>
                      </div>
                    ),
                  )}
                </Space>
              </Card>
            )}
          </Space>
        </Panel>
      </Collapse>
    </Space>
  );
}
