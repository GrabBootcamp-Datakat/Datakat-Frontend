"use client"

import React, { useState } from "react"
import {
  Tabs, Card, Input, Select, Switch, Slider, Button, Row, Col, Typography, Space
} from "antd"
import {
  AlertOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  SettingOutlined,
  BarChartOutlined,
  LineChartOutlined
} from "@ant-design/icons"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const { TabPane } = Tabs
const { Title, Text } = Typography
const { Option } = Select

// Mock Data
const anomalies = [
  {
    id: "1",
    timestamp: "2023-04-29T14:35:42Z",
    severity: "high",
    service: "api-gateway",
    metric: "response_time",
    description: "Spike in API response",
    explanation: "High traffic or bottleneck in downstream.",
    recommendation: "Check deployments, scale up API gateway."
  },
  {
    id: "2",
    timestamp: "2023-04-29T12:22:15Z",
    severity: "medium",
    service: "database-service",
    metric: "query_time",
    description: "Slow DB queries",
    explanation: "Several queries taking longer.",
    recommendation: "Review schema, rewrite queries."
  },
  {
    id: "3",
    timestamp: "2023-04-29T08:45:30Z",
    severity: "critical",
    service: "auth-service",
    metric: "error_rate",
    description: "Auth failures spike",
    explanation: "Increase in authentication failures.",
    recommendation: "Implement rate limiting."
  }
]

const weeklyData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  count: Math.floor(Math.random() * 15) + 1
}))

const monthlyData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(month => ({
  month,
  count: Math.floor(Math.random() * 40) + 10
}))

const servicesData = [
  { service: "api-gateway", count: 15, avgDuration: 5.2 },
  { service: "database-service", count: 10, avgDuration: 3.8 },
  { service: "auth-service", count: 8, avgDuration: 4.1 }
]

export default function AnomaliesPage() {
  const [selectedAnomaly, setSelectedAnomaly] = useState(anomalies[0])
  const [severityFilter, setSeverityFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [autoDetect, setAutoDetect] = useState(true)
  const [notify, setNotify] = useState(true)
  const [threshold, setThreshold] = useState(60)

  const severities = ["critical", "high", "medium"]
  const services = [...new Set(anomalies.map(a => a.service))]

  const filtered = anomalies.filter(a =>
    (severityFilter === "all" || a.severity === severityFilter) &&
    (serviceFilter === "all" || a.service === serviceFilter) &&
    (a.description.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3}>Anomaly Detection</Title>
        <Text type="secondary">
          <ClockCircleOutlined /> Last updated: {new Date().toLocaleTimeString()}
        </Text>
      </Row>

      <Tabs defaultActiveKey="1">
        {/* Detected Anomalies */}
        <TabPane tab="Detected Anomalies" key="1">
          <Row gutter={16}>
            <Col span={10}>
              <Card title="Filters" extra={<FilterOutlined />}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Input
                    placeholder="Search anomalies..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <Select value={severityFilter} onChange={setSeverityFilter}>
                    <Option value="all">All Severities</Option>
                    {severities.map(s => (
                      <Option key={s} value={s}>{s}</Option>
                    ))}
                  </Select>
                  <Select value={serviceFilter} onChange={setServiceFilter}>
                    <Option value="all">All Services</Option>
                    {services.map(s => (
                      <Option key={s} value={s}>{s}</Option>
                    ))}
                  </Select>
                </Space>
              </Card>

              <Card title="Anomalies" style={{ marginTop: 16 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {filtered.map(a => (
                    <Card
                      key={a.id}
                      size="small"
                      hoverable
                      onClick={() => setSelectedAnomaly(a)}
                      style={{
                        background: selectedAnomaly.id === a.id ? "#e6f7ff" : undefined
                      }}
                    >
                      <AlertOutlined style={{ color: "#faad14" }} /> <strong>{a.description}</strong><br />
                      <Text type="secondary">{a.service} • {new Date(a.timestamp).toLocaleString()}</Text>
                    </Card>
                  ))}
                </Space>
              </Card>
            </Col>

            <Col span={14}>
              <Card title="Anomaly Details" extra={<BarChartOutlined />}>
                <Title level={5}>{selectedAnomaly.description}</Title>
                <Text type="secondary">
                  {selectedAnomaly.service} • {selectedAnomaly.metric} • {new Date(selectedAnomaly.timestamp).toLocaleString()}
                </Text>
                <br />
                <Text type="warning">{selectedAnomaly.severity.toUpperCase()} Severity</Text>

                <div style={{ marginTop: 24, height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={Array.from({ length: 10 }, (_, i) => ({ time: i, value: Math.random() * 100 }))}>
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ marginTop: 24 }}>
                  <Text strong>AI Analysis:</Text>
                  <p>{selectedAnomaly.explanation}</p>
                  <Text strong>Recommendation:</Text>
                  <p>{selectedAnomaly.recommendation}</p>
                </div>

                <Space style={{ marginTop: 16 }}>
                  <Button>Dismiss</Button>
                  <Button type="primary">Take Action</Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Historical Analysis */}
        <TabPane tab="Historical Analysis" key="2">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="Weekly Anomalies">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Summary">
                <p><strong>Critical Events:</strong> 18</p>
                <p><strong>Avg. Duration:</strong> {
                  (servicesData.reduce((acc, s) => acc + s.avgDuration, 0) / servicesData.length).toFixed(1)
                }s</p>
                <p><strong>Total Anomalies:</strong> {
                  weeklyData.reduce((acc, d) => acc + d.count, 0)
                }</p>
              </Card>
            </Col>

            <Col span={16}>
              <Card title="Monthly Trends">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="count" stroke="#52c41a" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Top Services">
                {servicesData.map(svc => (
                  <p key={svc.service}>
                    <strong>{svc.service}</strong><br />
                    Avg: {svc.avgDuration}s | Count: {svc.count}
                  </p>
                ))}
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* Detection Settings */}
        <TabPane tab="Detection Settings" key="3">
          <Card title={<><SettingOutlined /> Detection Settings</>}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Row justify="space-between">
                <Text>Auto Detection</Text>
                <Switch checked={autoDetect} onChange={setAutoDetect} />
              </Row>
              <Row justify="space-between">
                <Text>Send Notification</Text>
                <Switch checked={notify} onChange={setNotify} />
              </Row>
              <Row justify="space-between">
                <Text>Threshold: {threshold}%</Text>
              </Row>
              <Slider min={0} max={100} step={5} value={threshold} onChange={setThreshold} />
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}
