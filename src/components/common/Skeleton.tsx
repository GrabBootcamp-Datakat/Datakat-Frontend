import { Card, Skeleton } from 'antd';

export const ChartSkeleton = ({ title }: { title: string }) => (
  <Card title={title} hoverable>
    <div className="space-y-4">
      <Skeleton.Input active size="small" style={{ width: 200 }} />
      <Skeleton.Input active block style={{ height: 300 }} />
    </div>
  </Card>
);

export const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton.Input active block style={{ height: 40 }} />
    {[...Array(5)].map((_, index) => (
      <Skeleton.Input key={index} active block style={{ height: 50 }} />
    ))}
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, index) => (
      <Card key={index}>
        <Skeleton.Input active block style={{ height: 60 }} />
      </Card>
    ))}
  </div>
);
