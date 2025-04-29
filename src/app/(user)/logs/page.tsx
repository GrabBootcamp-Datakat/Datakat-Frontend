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

const { TabPane } = Tabs;
const { Title, Text } = Typography;

/**
 * Log entry interface
 * @interface LogEntry
 */
interface LogEntry {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  message: string;
}

/**
 * Sample log data for demonstration
 * @constant
 */
const logData: LogEntry[] = [
  {
    id: '1',
    timestamp: '2023-04-29T14:35:42Z',
    level: 'ERROR',
    service: 'api-gateway',
    message: 'Connection refused to authentication service',
  },
  {
    id: '2',
    timestamp: '2023-04-29T14:34:21Z',
    level: 'WARN',
    service: 'user-service',
    message: 'Rate limit exceeded for user id: 12345',
  },
  {
    id: '3',
    timestamp: '2023-04-29T14:33:10Z',
    level: 'INFO',
    service: 'payment-service',
    message: 'Payment processed successfully for order #98765',
  },
  {
    id: '4',
    timestamp: '2023-04-29T14:32:45Z',
    level: 'DEBUG',
    service: 'inventory-service',
    message: 'Stock check completed for SKU: ABC123',
  },
  {
    id: '5',
    timestamp: '2023-04-29T14:31:22Z',
    level: 'ERROR',
    service: 'notification-service',
    message: 'Failed to send email to user@example.com',
  },
  {
    id: '6',
    timestamp: '2023-04-29T14:30:15Z',
    level: 'INFO',
    service: 'auth-service',
    message: 'User logged in: user_id=54321',
  },
  {
    id: '7',
    timestamp: '2023-04-29T14:29:30Z',
    level: 'WARN',
    service: 'database-service',
    message: 'Slow query detected: SELECT * FROM users WHERE...',
  },
  {
    id: '8',
    timestamp: '2023-04-29T14:28:12Z',
    level: 'INFO',
    service: 'api-gateway',
    message: 'Request processed in 235ms: GET /api/users',
  },
  {
    id: '9',
    timestamp: '2023-04-29T14:27:45Z',
    level: 'DEBUG',
    service: 'cache-service',
    message: 'Cache hit for key: user:12345:profile',
  },
  {
    id: '10',
    timestamp: '2023-04-29T14:26:33Z',
    level: 'ERROR',
    service: 'payment-service',
    message: 'Payment gateway timeout for transaction id: tx_789012',
  },
];

/**
 * LogLevelBadge component for displaying log levels with appropriate styling
 * @component
 */
const LogLevelBadge = ({ level }: { level: LogEntry['level'] }) => {
  const colorMap = {
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
  <Card>
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

  // Filter logs based on search query and filters
  const filteredLogs = logData.filter((log) => {
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
  const services = Array.from(new Set(logData.map((log) => log.service)));
  const levels = Array.from(new Set(logData.map((log) => log.level)));

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

          <Card className="mt-4">
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
            <LogsTable data={sortedLogs} />
          </Card>
        </TabPane>

        <TabPane tab="Errors" key="errors">
          <Card>
            <Title level={4}>Error Logs</Title>
            <LogsTable data={logData.filter((log) => log.level === 'ERROR')} />
          </Card>
        </TabPane>

        <TabPane tab="Warnings" key="warnings">
          <Card>
            <Title level={4}>Warning Logs</Title>
            <LogsTable data={logData.filter((log) => log.level === 'WARN')} />
          </Card>
        </TabPane>

        <TabPane tab="Info" key="info">
          <Card>
            <Title level={4}>Info Logs</Title>
            <LogsTable data={logData.filter((log) => log.level === 'INFO')} />
          </Card>
        </TabPane>
      </Tabs>
    </LayoutScroll>
  );
}
