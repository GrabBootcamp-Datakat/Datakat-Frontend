'use client';
import { AnomalyLogResponse } from '@/types/anomaly';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';

interface ContentGroupTableProps {
  anomalies: AnomalyLogResponse[];
}

const columns: TableProps<AnomalyLogResponse>['columns'] = [
  {
    title: 'Time',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (timestamp) => new Date(timestamp).toLocaleString(),
  },
  {
    title: 'Component',
    dataIndex: 'component',
    key: 'component',
  },
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    render: (level) => (
      <Tag color={level === 'ERROR' ? 'red' : 'orange'}>{level}</Tag>
    ),
  },
];

export default function ContentGroupTable({
  anomalies,
}: ContentGroupTableProps) {
  return (
    <div>
      <Paragraph strong>Recent Occurrences (5 latest)</Paragraph>
      <Table
        dataSource={anomalies}
        columns={columns}
        rowKey={(record, index) => `${record.id}-${index}`}
        size="small"
        pagination={false}
      />
    </div>
  );
}
