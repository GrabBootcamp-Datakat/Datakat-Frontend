'use client';
import { Table, TablePaginationConfig, Space, Tag } from 'antd';
import { LogLevel, LogEntry, SortBy } from '@/types/logs';
import { WarningOutlined } from '@ant-design/icons';
import { LOG_LEVEL_COLORS_TAG } from '@/constants/colors';
import type {
  SorterResult,
  SortOrder as AntSortOrder,
  FilterValue,
} from 'antd/es/table/interface';
import Paragraph from 'antd/es/typography/Paragraph';
import short from 'short-uuid';
import Text from 'antd/es/typography/Text';

interface LogsTableProps {
  data: LogEntry[];
  pagination?: TablePaginationConfig;
  onChange?: (pagination: TablePaginationConfig) => void;
  onSort?: (field: SortBy, order: AntSortOrder | undefined) => void;
  currentSort?: {
    sortField: SortBy;
    sortOrder: AntSortOrder | undefined;
  };
}

export default function LogsTable({
  data,
  pagination,
  onChange,
  onSort,
  currentSort,
}: LogsTableProps) {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: '@timestamp',
      key: '@timestamp',
      sorter: true,
      sortOrder:
        currentSort?.sortField === SortBy.TIMESTAMP
          ? currentSort.sortOrder
          : undefined,
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
      sorter: true,
      sortOrder:
        currentSort?.sortField === SortBy.LEVEL
          ? currentSort.sortOrder
          : undefined,
      render: (text: LogLevel) => (
        <Tag
          color={
            LOG_LEVEL_COLORS_TAG[text as keyof typeof LOG_LEVEL_COLORS_TAG]
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Application',
      dataIndex: 'application',
      key: 'application',
      sorter: true,
      sortOrder:
        currentSort?.sortField === SortBy.APPLICATION
          ? currentSort.sortOrder
          : undefined,
    },
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      render: (text: string, record: LogEntry) => (
        <Space>
          {record.level === LogLevel.ERROR && (
            <WarningOutlined style={{ color: 'red' }} />
          )}
          {text && text.length > 0 && (
            <Paragraph
              ellipsis={{
                rows: 1,
              }}
              copyable
              type="secondary"
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            >
              {text}
            </Paragraph>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<LogEntry> | SorterResult<LogEntry>[],
  ) => {
    if (onChange) {
      onChange(pagination);
    }

    if (onSort && !Array.isArray(sorter)) {
      if (sorter.field) {
        onSort(sorter.field as SortBy, sorter.order);
      } else if (currentSort?.sortField) {
        // When clearing sort, pass the current field with undefined order
        onSort(currentSort.sortField, undefined);
      }
    }
  };

  const logsWithIds: LogEntry[] = data.map((item) => ({
    ...item,
    id: short.generate(),
  }));

  return (
    <Table
      rowKey={(record) => record.id || short.generate()}
      columns={columns}
      dataSource={logsWithIds}
      pagination={pagination}
      onChange={handleTableChange}
      sticky
    />
  );
}
