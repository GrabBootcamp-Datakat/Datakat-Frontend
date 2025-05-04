'use client';
import { TableSkeleton } from '../common/Skeleton';
import { LogEntry } from '@/types/logs';
import { Card } from 'antd';
import LogsTable from './LogsTable';
import Title from 'antd/es/typography/Title';

export interface LogsCardProps {
  title: string;
  isLoading: boolean;
  data: LogEntry[];
}

export default function LogsCard(props: LogsCardProps) {
  const { title, isLoading, data } = props;
  return (
    <Card>
      <Title level={4}>{title}</Title>
      {isLoading ? <TableSkeleton /> : <LogsTable data={data || []} />}
    </Card>
  );
}
