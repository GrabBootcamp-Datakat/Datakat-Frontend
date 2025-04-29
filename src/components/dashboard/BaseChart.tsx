import React, { useState } from 'react';
import { Card, Space, Button, Modal } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { ChartCustomization } from './ChartCustomization';

interface BaseChartProps {
  title: string;
  children: React.ReactNode;
  onCustomize: (timePattern: string) => void;
  initialTimeValue?: string;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  title,
  children,
  onCustomize,
  initialTimeValue = '1H',
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleCustomize = (timePattern: string) => {
    onCustomize(timePattern);
  };

  return (
    <Card
      title={
        <Space>
          <span>{title}</span>
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setIsCustomizing(true)}
          />
        </Space>
      }
    >
      {children}
      <Modal
        open={isCustomizing}
        onCancel={() => setIsCustomizing(false)}
        footer={null}
        width={600}
      >
        <ChartCustomization
          chartTitle={title}
          onCustomize={handleCustomize}
          onClose={() => setIsCustomizing(false)}
          initialTimeValue={initialTimeValue}
        />
      </Modal>
    </Card>
  );
};
