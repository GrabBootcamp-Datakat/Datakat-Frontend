'use client';
import { Table, Tag } from 'antd';
import { AnomalyLogEntry } from '../../types';
import { LOG_LEVEL_COLORS_TAG } from '@/constants/colors';
import Paragraph from 'antd/es/typography/Paragraph';

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
      render: (level: string) => {
        return (
          <Tag
            color={
              LOG_LEVEL_COLORS_TAG[level as keyof typeof LOG_LEVEL_COLORS_TAG]
            }
          >
            {level}
          </Tag>
        );
      },
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
      render: (content: string) => {
        return (
          content && (
            <Paragraph ellipsis copyable title={content}>
              {content}
            </Paragraph>
          )
        );
      },
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
