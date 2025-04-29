import { Space } from 'antd';

export default function LayoutScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-x-clip overflow-y-auto px-8">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {children}
      </Space>
    </div>
  );
}
