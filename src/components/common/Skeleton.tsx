import { Skeleton } from 'antd';

export const ChartSkeleton = () => (
  <div className="space-y-4">
    <Skeleton.Input active size="small" style={{ width: 200 }} />
    <Skeleton.Input active block style={{ height: 300 }} />
  </div>
);
