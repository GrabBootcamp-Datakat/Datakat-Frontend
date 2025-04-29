import React, { useState } from "react";
import { Input, Select, Space, Typography } from "antd";
import { TimeUnit } from "@/types/logsType";

const { Option } = Select;
const { Text } = Typography;

interface TimeCustomizationProps {
  onTimeChange: (pattern: string) => void;
  label?: string;
}

export const TimeCustomization: React.FC<TimeCustomizationProps> = ({
  onTimeChange,
  label = "Time Range",
}) => {
  const [unit, setUnit] = useState<TimeUnit>(TimeUnit.HOUR);
  const [number, setNumber] = useState<number>(1);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = parseInt(e.target.value, 10) || 1;
    setNumber(newNumber);
    const newPattern = `${newNumber}${unit}`;
    onTimeChange(newPattern);
  };

  const handleUnitChange = (newUnit: TimeUnit) => {
    setUnit(newUnit);
    const newPattern = `${number}${newUnit}`;
    onTimeChange(newPattern);
  };

  const availableUnits = Object.values(TimeUnit).filter(
    (unit) => unit !== TimeUnit.SECOND && unit !== TimeUnit.MINUTE
  );

  const getUnitLabel = (unit: TimeUnit): string => {
    switch (unit) {
      case TimeUnit.YEAR:
        return "Years";
      case TimeUnit.MONTH:
        return "Months";
      case TimeUnit.DAY:
        return "Days";
      case TimeUnit.HOUR:
        return "Hours";
      case TimeUnit.MINUTE:
        return "Minutes";
      case TimeUnit.SECOND:
        return "Seconds";
      default:
        return "Milliseconds";
    }
  };

  return (
    <Space direction="vertical" size="small">
      <Text strong>{label}</Text>
      <Space>
        <Input
          type="number"
          min={1}
          value={number}
          onChange={handleNumberChange}
          style={{ width: 80 }}
        />
        <Select value={unit} onChange={handleUnitChange} style={{ width: 100 }}>
          {availableUnits.map((u) => (
            <Option key={u} value={u}>
              {getUnitLabel(u)}
            </Option>
          ))}
        </Select>
      </Space>
    </Space>
  );
};
