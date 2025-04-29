'use client';

import { useState } from 'react';
import {
  Input,
  Button,
  Card,
  Table,
  Tabs,
  Select,
  Space,
  Typography,
  Dropdown,
  Menu,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  SortAscendingOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DownOutlined,
} from '@ant-design/icons';
import LayoutScroll from '@/components/common/LayoutScroll';
import PageTitle from '@/components/common/PageTitle';
import { useGetLogsQuery } from '@/store/api/logsApi';
import type { LogEntry } from '@/types/logsType';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

/**
 * LogLevelBadge component for displaying log levels with appropriate styling
 * @component
 */
const LogLevelBadge = ({ level }: { level: LogEntry['level'] }) => {
  const colorMap: Record<LogEntry['level'], string> = {
    ERROR: 'red',
    WARN: 'orange',
    INFO: 'blue',
    DEBUG: 'gray',
  };

  return (
    <Button
      type="text"
      size="small"
      style={{
        backgroundColor: `${colorMap[level]}1`,
        color: colorMap[level],
        border: 'none',
        borderRadius: '12px',
        padding: '0 8px',
      }}
    >
      {level}
    </Button>
  );
};

/**
 * LogFilters component for filtering logs
 * @component
 */
const LogFilters = ({
  searchQuery,
  setSearchQuery,
  levelFilter,
  setLevelFilter,
  serviceFilter,
  setServiceFilter,
  levels,
  services,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  levelFilter: string;
  setLevelFilter: (value: string) => void;
  serviceFilter: string;
  setServiceFilter: (value: string) => void;
  levels: string[];
  services: string[];
}) => (
  <Card
    styles={{
      body: {
        padding: '24px',
      },
    }}
  >
    <Card.Meta
      title="Log Filters"
      description="Filter logs by service, level, or search for specific content"
    />
    <div className="mt-4">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            value={levelFilter}
            onChange={setLevelFilter}
            style={{ width: 150 }}
            placeholder="Select level"
          >
            <Select.Option value="all">All Levels</Select.Option>
            {levels.map((level) => (
              <Select.Option key={level} value={level}>
                {level}
              </Select.Option>
            ))}
          </Select>
          <Select
            value={serviceFilter}
            onChange={setServiceFilter}
            style={{ width: 150 }}
            placeholder="Select service"
          >
            <Select.Option value="all">All Services</Select.Option>
            {services.map((service) => (
              <Select.Option key={service} value={service}>
                {service}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Space>
    </div>
  </Card>
);

/**
 * LogsTable component for displaying logs in a table format
 * @component
 */
const LogsTable = ({ data }: { data: LogEntry[] }) => {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (text: string) => (
        <Text
          type="secondary"
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        >
          {new Date(text).toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (text: LogEntry['level']) => <LogLevelBadge level={text} />,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      width: 150,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text: string, record: LogEntry) => (
        <Space>
          {record.level === 'ERROR' && (
            <WarningOutlined style={{ color: 'red' }} />
          )}
          <Text
            type="secondary"
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          >
            {text}
          </Text>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

/**
 * Sort options for logs
 */
type SortField = 'timestamp' | 'level' | 'service';
type SortOrder = 'ascend' | 'descend';

/**
 * Main LogsPage component
 * @component
 */
export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('descend');

  const { data: logs = [], isLoading } = useGetLogsQuery();

  // Filter logs based on search query and filters
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesService =
      serviceFilter === 'all' || log.service === serviceFilter;

    return matchesSearch && matchesLevel && matchesService;
  });

  // Sort logs based on selected field and order
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortField === 'timestamp') {
      return sortOrder === 'ascend'
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortField === 'level') {
      return sortOrder === 'ascend'
        ? a.level.localeCompare(b.level)
        : b.level.localeCompare(a.level);
    }
    if (sortField === 'service') {
      return sortOrder === 'ascend'
        ? a.service.localeCompare(b.service)
        : b.service.localeCompare(a.service);
    }
    return 0;
  });

  // Get unique services and levels for filter options
  const services = Array.from(new Set(logs.map((log) => log.service)));
  const levels = Array.from(new Set(logs.map((log) => log.level)));

  // Sort menu items
  const sortMenu = (
    <Menu
      items={[
        {
          key: 'timestamp',
          label: 'Timestamp',
          onClick: () => {
            setSortField('timestamp');
            setSortOrder(
              sortField === 'timestamp' && sortOrder === 'ascend'
                ? 'descend'
                : 'ascend',
            );
          },
        },
        {
          key: 'level',
          label: 'Level',
          onClick: () => {
            setSortField('level');
            setSortOrder(
              sortField === 'level' && sortOrder === 'ascend'
                ? 'descend'
                : 'ascend',
            );
          },
        },
        {
          key: 'service',
          label: 'Service',
          onClick: () => {
            setSortField('service');
            setSortOrder(
              sortField === 'service' && sortOrder === 'ascend'
                ? 'descend'
                : 'ascend',
            );
          },
        },
      ]}
    />
  );

  return (
    <LayoutScroll>
      <div className="flex items-center justify-between">
        <PageTitle title="Logs" />
        <div className="flex items-center space-x-2">
          <ClockCircleOutlined className="text-gray-400" />
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </div>
      </div>

      <Tabs defaultActiveKey="all">
        <TabPane tab="All Logs" key="all">
          <LogFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            serviceFilter={serviceFilter}
            setServiceFilter={setServiceFilter}
            levels={levels}
            services={services}
          />

          <Card
            className="mt-4"
            styles={{
              body: {
                padding: '24px',
              },
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <Title level={4}>All Logs</Title>
              <Space>
                <Dropdown overlay={sortMenu} trigger={['click']}>
                  <Button icon={<SortAscendingOutlined />}>
                    Sort by {sortField} <DownOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </div>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spin size="large" />
              </div>
            ) : (
              <LogsTable data={sortedLogs} />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Errors" key="errors">
          <Card
            styles={{
              body: {
                padding: '24px',
              },
            }}
          >
            <Title level={4}>Error Logs</Title>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spin size="large" />
              </div>
            ) : (
              <LogsTable data={logs.filter((log) => log.level === 'ERROR')} />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Warnings" key="warnings">
          <Card
            styles={{
              body: {
                padding: '24px',
              },
            }}
          >
            <Title level={4}>Warning Logs</Title>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spin size="large" />
              </div>
            ) : (
              <LogsTable data={logs.filter((log) => log.level === 'WARN')} />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Info" key="info">
          <Card
            styles={{
              body: {
                padding: '24px',
              },
            }}
          >
            <Title level={4}>Info Logs</Title>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spin size="large" />
              </div>
            ) : (
              <LogsTable data={logs.filter((log) => log.level === 'INFO')} />
            )}
          </Card>
        </TabPane>
      </Tabs>
    </LayoutScroll>
  );
}
