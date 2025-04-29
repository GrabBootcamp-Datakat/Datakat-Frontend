import React, { useState } from "react";
import { Card, Space, Typography, Button } from "antd";
import { TimeCustomization } from "./TimeCustomization";

const { Title } = Typography;

interface ChartCustomizationProps {
  chartTitle: string;
  onCustomize: (timePattern: string) => void;
  onClose: () => void;
  initialTimeValue?: string;
}

export const ChartCustomization: React.FC<ChartCustomizationProps> = ({
  chartTitle,
  onCustomize,
  onClose,
  initialTimeValue = "1H",
}) => {
  const [timePattern, setTimePattern] = useState<string>(initialTimeValue);

  const handleTimeChange = (pattern: string) => {
    setTimePattern(pattern);
  };

  const handleApply = () => {
    onCustomize(timePattern);
    onClose();
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Customize {chartTitle}
          </Title>
        </Space>
      }
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleApply}>
            Apply
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <TimeCustomization
          onTimeChange={handleTimeChange}
          initialValue={initialTimeValue}
          label="Time Range"
        />
      </Space>
    </Card>
  );
};
