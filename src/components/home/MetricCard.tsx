import { ReactNode } from 'react';
import { Space } from 'antd';
import ShadowCard from './ShadowCard';

export interface MetricCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  height?: number;
}

export default function MetricCard({
  title,
  icon,
  children,
  className = '',
  gradientFrom = 'from-gray-50',
  gradientTo = 'to-gray-100',
  height = 140,
}: MetricCardProps) {
  return (
    <ShadowCard className={className}>
      <Space direction="vertical" size="middle" className="!w-full">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-lg font-medium">{title}</span>
        </div>
        <div
          className={`rounded-md bg-gradient-to-br ${gradientFrom} ${gradientTo} p-4`}
          style={{ height }}
        >
          {children}
        </div>
      </Space>
    </ShadowCard>
  );
}
