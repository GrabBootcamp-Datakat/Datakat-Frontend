"use client";
import React from "react";
import { Card, Table, Tabs, Space, Tag, Tooltip } from "antd";
import {
  AlertOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { LogLevel, LogDetails as LogDetailsType } from "@/types/logsType";
import TabPane from "antd/es/tabs/TabPane";
import Text from "antd/es/typography/Text";

export interface LogDetailsProps {
  errorLogs: LogDetailsType["errorLogs"];
  commonMessages: LogDetailsType["commonMessages"];
}

export const LogDetails = (props: LogDetailsProps) => {
  const { errorLogs, commonMessages } = props;
  return (
    <Card title="Log Details" hoverable>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <Space>
              <AlertOutlined />
              <span>WARN & ERROR Logs</span>
            </Space>
          }
          key="1"
        >
          <Table
            dataSource={errorLogs}
            columns={columns}
            rowKey="LineId"
            pagination={{ pageSize: 5 }}
            size="middle"
          />
        </TabPane>
        <TabPane
          tab={
            <Space>
              <InfoCircleOutlined />
              <span>Common Messages</span>
            </Space>
          }
          key="2"
        >
          <Table
            dataSource={commonMessages}
            columns={messageColumns}
            rowKey="content"
            pagination={{ pageSize: 5 }}
            size="middle"
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

const columns = [
  {
    title: "Time",
    dataIndex: "Time",
    key: "Time",
    render: (text: string) => (
      <Space>
        <ClockCircleOutlined />
        <Text strong>{text}</Text>
      </Space>
    ),
  },
  {
    title: "Level",
    dataIndex: "Level",
    key: "Level",
    render: (level: LogLevel) => (
      <Tag
        color={
          level === LogLevel.INFO
            ? "success"
            : level === LogLevel.WARN
            ? "warning"
            : "error"
        }
      >
        {level}
      </Tag>
    ),
  },
  {
    title: "Component",
    dataIndex: "Component",
    key: "Component",
    render: (text: string) => (
      <Space>
        <BarChartOutlined />
        <Text code>{text}</Text>
      </Space>
    ),
  },
  {
    title: "Content",
    dataIndex: "Content",
    key: "Content",
    ellipsis: true,
    render: (text: string) => (
      <Tooltip title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
  },
];

const messageColumns = [
  {
    title: "Message",
    dataIndex: "content",
    key: "content",
    ellipsis: true,
    render: (text: string) => (
      <Tooltip title={text}>
        <Text>{text}</Text>
      </Tooltip>
    ),
  },
  {
    title: "Count",
    dataIndex: "count",
    key: "count",
    width: 100,
    render: (count: number) => <Tag color="blue">{count}</Tag>,
  },
];
