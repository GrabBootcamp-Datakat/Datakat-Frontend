'use client';
import { Table, Empty, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { NLVQueryResponse } from '@/types/query';
import { WarningOutlined } from '@ant-design/icons';
import { LogEntry, LogLevel } from '@/types/logs';
import { toJSONDataFrame } from './converter';
import { usePagination } from '@/lib/hooks/usePagination';
import LogLevelBadge from '@/components/logs/LogLevelBadge';
import Text from 'antd/es/typography/Text';

const columns: ColumnsType<LogEntry> = [
  {
    title: 'Timestamp',
    dataIndex: '@timestamp',
    key: '@timestamp',
    render: (text: string) => new Date(text).toLocaleString(),
  },
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    render: (text: LogLevel) => <LogLevelBadge level={text} />,
  },
  {
    title: 'Component',
    dataIndex: 'component',
    key: 'component',
  },
  {
    title: 'Application',
    dataIndex: 'application',
    key: 'application',
  },
  {
    title: 'Source File',
    dataIndex: 'source_file',
    key: 'source_file',
  },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
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
    title: 'Raw Log',
    dataIndex: 'raw_log',
    key: 'raw_log',
    ellipsis: true,
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

export default function LogListVisualization(
  nlvQueryResponse: NLVQueryResponse,
): React.ReactNode {
  const { currentPage, pageSize, handlePageChange } = usePagination();
  const data = toJSONDataFrame(nlvQueryResponse) as LogEntry[];

  if (data.length === 0) {
    return <Empty description="No logs found" imageStyle={{ height: 50 }} />;
  }

  return (
    <Table
      rowKey={(_, index) => index?.toString() || ''}
      dataSource={data}
      columns={columns}
      scroll={{ x: 'max-content' }}
      size="small"
      pagination={{
        pageSize: pageSize,
        pageSizeOptions: [5, 10, 20, 50],
        total: data?.length || 0,
        showSizeChanger: true,
        current: currentPage,
        onChange: handlePageChange,
      }}
    />
  );
}
