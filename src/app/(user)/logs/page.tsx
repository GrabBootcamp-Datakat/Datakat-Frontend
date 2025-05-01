'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
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
  DatePicker,
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
import {
  useGetLogsQuery,
  useGetLogsApplicationsQuery,
} from '@/store/api/logsApi';
import type { LogEntry } from '@/types/logs';
import { LogLevel, SortBy, SortOrder } from '@/types/logs';
import { TablePaginationConfig } from 'antd/es/table';
import { useDebounce } from '@/hooks/useDebounce';
import dayjs from 'dayjs';
import { TableSkeleton } from '@/components/common/Skeleton';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * Main LogsPage component
 * @component
 */
export default function LogsPage() {
  // Combine related states
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    levelFilter: [],
    serviceFilter: [],
    dateRange: [dayjs().subtract(25, 'year'), dayjs()],
  });

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
  });

  const [sort, setSort] = useState<SortState>({
    sortField: SortBy.TIMESTAMP,
    sortOrder: SortOrder.DESC,
  });

  // Debounce search query
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 500);

  // Memoize query parameters
  const queryParams = useMemo(
    () => ({
      startTime: filters.dateRange[0].toISOString(),
      endTime: filters.dateRange[1].toISOString(),
      query: debouncedSearchQuery,
      levels: filters.levelFilter,
      applications: filters.serviceFilter,
      sortBy: sort.sortField,
      sortOrder: sort.sortOrder,
      page: pagination.currentPage,
      size: pagination.pageSize,
    }),
    [
      filters.dateRange,
      debouncedSearchQuery,
      filters.levelFilter,
      filters.serviceFilter,
      sort.sortField,
      sort.sortOrder,
      pagination.currentPage,
      pagination.pageSize,
    ],
  );

  // API queries
  const { data, isLoading } = useGetLogsQuery(queryParams);
  const { data: applicationsData } = useGetLogsApplicationsQuery({
    startTime: filters.dateRange[0].toISOString(),
    endTime: filters.dateRange[1].toISOString(),
  });

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [
    debouncedSearchQuery,
    filters.levelFilter,
    filters.serviceFilter,
    filters.dateRange,
  ]);

  // Memoize handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  const handleLevelFilterChange = useCallback((value: LogLevel[]) => {
    setFilters((prev) => ({ ...prev, levelFilter: value }));
  }, []);

  const handleServiceFilterChange = useCallback((value: string[]) => {
    setFilters((prev) => ({ ...prev, serviceFilter: value }));
  }, []);

  const handleDateRangeChange = useCallback(
    (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
      if (dates) {
        setFilters((prev) => ({ ...prev, dateRange: dates }));
      }
    },
    [],
  );

  const handleTableChange = useCallback(
    (newPagination: TablePaginationConfig) => {
      setPagination({
        currentPage: newPagination.current || 1,
        pageSize: newPagination.pageSize || 50,
      });
    },
    [],
  );

  const handleSortChange = useCallback((field: SortBy) => {
    setSort((prev) => ({
      sortField: field,
      sortOrder:
        prev.sortField === field && prev.sortOrder === SortOrder.ASC
          ? SortOrder.DESC
          : SortOrder.ASC,
    }));
  }, []);

  // Memoize sort menu
  const sortMenu = useMemo(
    () => (
      <Menu
        items={[
          {
            key: SortBy.TIMESTAMP,
            label: 'Timestamp',
            onClick: () => handleSortChange(SortBy.TIMESTAMP),
          },
          {
            key: SortBy.LEVEL,
            label: 'Level',
            onClick: () => handleSortChange(SortBy.LEVEL),
          },
          {
            key: SortBy.APPLICATION,
            label: 'Application',
            onClick: () => handleSortChange(SortBy.APPLICATION),
          },
        ]}
      />
    ),
    [handleSortChange],
  );

  // Memoize tab items
  const tabItems = useMemo(
    () => [
      {
        key: 'all',
        label: 'All Logs',
        children: (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <LogFilters
              searchQuery={filters.searchQuery}
              setSearchQuery={handleSearchChange}
              levelFilter={filters.levelFilter}
              setLevelFilter={handleLevelFilterChange}
              serviceFilter={filters.serviceFilter}
              setServiceFilter={handleServiceFilterChange}
              dateRange={filters.dateRange}
              setDateRange={handleDateRangeChange}
              services={applicationsData?.applications || []}
            />

            <Card>
              <div className="mb-4 flex items-center justify-between">
                <Title level={4}>All Logs</Title>
                <Space>
                  <Dropdown overlay={sortMenu} trigger={['click']}>
                    <Button icon={<SortAscendingOutlined />}>
                      Sort by {sort.sortField} <DownOutlined />
                    </Button>
                  </Dropdown>
                </Space>
              </div>
              {isLoading ? (
                <TableSkeleton />
              ) : (
                <LogsTable
                  data={data?.logs || []}
                  pagination={{
                    current: pagination.currentPage,
                    pageSize: pagination.pageSize,
                    total: data?.total || 0,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} items`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                  }}
                  onChange={handleTableChange}
                />
              )}
            </Card>
          </Space>
        ),
      },
      {
        key: 'errors',
        label: 'Errors',
        children: (
          <LogsCard
            title="Errors"
            isLoading={isLoading}
            data={
              data?.logs.filter((log) => log.level === LogLevel.ERROR) || []
            }
          />
        ),
      },
      {
        key: 'warnings',
        label: 'Warnings',
        children: (
          <LogsCard
            title="Warnings"
            isLoading={isLoading}
            data={data?.logs.filter((log) => log.level === LogLevel.WARN) || []}
          />
        ),
      },
      {
        key: 'info',
        label: 'Info',
        children: (
          <LogsCard
            title="Info Logs"
            isLoading={isLoading}
            data={data?.logs.filter((log) => log.level === LogLevel.INFO) || []}
          />
        ),
      },
    ],
    [
      filters,
      applicationsData?.applications,
      sort.sortField,
      sortMenu,
      isLoading,
      data?.logs,
      data?.total,
      pagination,
      handleSearchChange,
      handleLevelFilterChange,
      handleServiceFilterChange,
      handleDateRangeChange,
      handleTableChange,
    ],
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

      <Tabs defaultActiveKey="all" items={tabItems} />
    </LayoutScroll>
  );
}

interface FilterState {
  searchQuery: string;
  levelFilter: LogLevel[];
  serviceFilter: string[];
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
}

interface SortState {
  sortField: SortBy;
  sortOrder: SortOrder;
}

const LogsCard = ({
  title,
  isLoading,
  data,
}: {
  title: string;
  isLoading: boolean;
  data: LogEntry[];
}) => {
  return (
    <Card>
      <Title level={4}>{title}</Title>
      {isLoading ? <TableSkeleton /> : <LogsTable data={data || []} />}
    </Card>
  );
};

/**
 * LogLevelBadge component for displaying log levels with appropriate styling
 * @component
 */
const LogLevelBadge = ({ level }: { level: LogLevel }) => {
  const colorMap: Record<LogLevel, string> = {
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
  dateRange,
  setDateRange,
  services,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  levelFilter: LogLevel[];
  setLevelFilter: (value: LogLevel[]) => void;
  serviceFilter: string[];
  setServiceFilter: (value: string[]) => void;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  setDateRange: (value: [dayjs.Dayjs, dayjs.Dayjs]) => void;
  services: string[];
}) => (
  <Card>
    <Card.Meta
      title="Log Filters"
      description="Filter logs by service, level, or search for specific content"
    />
    <div className="mt-4">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            mode="multiple"
            value={levelFilter}
            onChange={setLevelFilter}
            style={{ width: 200 }}
            placeholder="Select levels"
            allowClear
          >
            {Object.values(LogLevel).map((level) => (
              <Select.Option key={level} value={level}>
                {level}
              </Select.Option>
            ))}
          </Select>
          <Select
            mode="multiple"
            value={serviceFilter}
            onChange={setServiceFilter}
            style={{ width: 200 }}
            placeholder="Select services"
            allowClear
          >
            {services.map((service) => (
              <Select.Option key={service} value={service}>
                {service}
              </Select.Option>
            ))}
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) =>
              dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
            }
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
        </Space>
      </Space>
    </div>
  </Card>
);

/**
 * LogsTable component for displaying logs in a table format
 * @component
 */
const LogsTable = ({
  data,
  pagination,
  onChange,
}: {
  data: LogEntry[];
  pagination?: TablePaginationConfig;
  onChange?: (pagination: TablePaginationConfig) => void;
}) => {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: '@timestamp',
      key: '@timestamp',
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
      render: (text: LogLevel) => <LogLevelBadge level={text} />,
    },
    {
      title: 'Application',
      dataIndex: 'application',
      key: 'application',
    },
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (text: string, record: LogEntry) => (
        <Space>
          {record.level === LogLevel.ERROR && (
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
    {
      title: 'Source File',
      dataIndex: 'source_file',
      key: 'source_file',
      render: (text: string) => (
        <Text
          type="secondary"
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        >
          {text}
        </Text>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="@timestamp"
      pagination={pagination}
      onChange={onChange}
      scroll={{ x: 1200 }}
    />
  );
};
