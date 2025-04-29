import { Card, Skeleton } from 'antd';

export const ChartSkeleton = ({ title }: { title: string }) => (
  <Card
    title={title}
    hoverable
    styles={{
      body: {
        padding: '12px',
      },
    }}
  >
    <div className="space-y-4">
      <Skeleton.Input active size="small" style={{ width: 200 }} />
      <Skeleton.Input active block style={{ height: 300 }} />
    </div>
  </Card>
);
