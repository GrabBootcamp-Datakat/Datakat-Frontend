'use client';
import { Table } from 'antd';
import { AnomalyLogEntry } from '../../types';

interface ContentGroupTableProps {
  anomalies: AnomalyLogEntry[];
}

export function ContentGroupTable({ anomalies }: ContentGroupTableProps) {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 100,
    },
    {
      title: 'Component',
      dataIndex: 'component',
      key: 'component',
      width: 150,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
  ];

  return (
    <Table
      dataSource={anomalies}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={false}
      className="mb-4"
    />
  );
}
