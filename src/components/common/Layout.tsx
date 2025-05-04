import { Space } from 'antd';

export const LayoutStatic = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-full flex-col gap-4 px-8">{children}</div>;
};

export const LayoutScroll = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col overflow-x-clip overflow-y-auto px-8 pb-4">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {children}
      </Space>
    </div>
  );
};
