'use client';
import React, { memo, useMemo } from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import { LogDetails as LogDetailsType } from '@/types/logs';
import { useGetLogsQuery } from '@/store/api/logsApi';
import { ChartSkeleton } from '../common/Skeleton';
import type { LogEntry } from '@/types/logs';

const { Text: TypographyText } = Typography;

export interface LogDetailsProps {
  errorLogs: LogDetailsType['errorLogs'];
  commonMessages: LogDetailsType['commonMessages'];
}

const LogLevelTag = memo(({ level }: { level: LogEntry['level'] }) => {
  const colorMap = {
    ERROR: 'red',
    WARN: 'orange',
    INFO: 'blue',
    DEBUG: 'gray',
  };

  return (
    <Tag color={colorMap[level]} style={{ margin: 0 }}>
      {level}
    </Tag>
  );
});

LogLevelTag.displayName = 'LogLevelTag';

const LogDetailsTable = memo(({ data }: { data: LogEntry[] }) => {
  const columns = useMemo(
    () => [
      {
        title: 'Timestamp',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (text: string) => (
          <TypographyText
            type="secondary"
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          >
            {new Date(text).toLocaleString()}
          </TypographyText>
        ),
      },
      {
        title: 'Level',
        dataIndex: 'level',
        key: 'level',
        render: (text: LogEntry['level']) => <LogLevelTag level={text} />,
      },
      {
        title: 'Service',
        dataIndex: 'service',
        key: 'service',
      },
      {
        title: 'Message',
        dataIndex: 'message',
        key: 'message',
        render: (text: string) => (
          <TypographyText
            type="secondary"
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          >
            {text}
          </TypographyText>
        ),
      },
    ],
    [],
  );

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      size="small"
    />
  );
});

LogDetailsTable.displayName = 'LogDetailsTable';

export const LogDetails = memo(() => {
  const { data: logs, isLoading } = useGetLogsQuery();

  if (isLoading || !logs) {
    return <ChartSkeleton title="Log Details" />;
  }

  return (
    <Card title="Log Details" hoverable>
      <LogDetailsTable data={logs} />
    </Card>
  );
});

LogDetails.displayName = 'LogDetails';
