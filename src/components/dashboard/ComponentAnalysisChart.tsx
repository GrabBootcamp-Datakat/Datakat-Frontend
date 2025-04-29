import React from "react";
import { BaseChart } from "./BaseChart";
import { Column } from "@ant-design/plots";

interface ComponentDataPoint {
  component: string;
  value: number;
  type: string;
}

interface ComponentAnalysisChartProps {
  data: ComponentDataPoint[];
  onCustomize: (timePattern: string) => void;
  initialTimeValue?: string;
}

export const ComponentAnalysisChart: React.FC<ComponentAnalysisChartProps> = ({
  data,
  onCustomize,
  initialTimeValue,
}) => {
  const config = {
    data,
    xField: "component",
    yField: "value",
    seriesField: "type",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    animation: {
      appear: {
        animation: "wave-in",
        duration: 1000,
      },
    },
  };

  return (
    <BaseChart
      title="Component Analysis"
      onCustomize={onCustomize}
      initialTimeValue={initialTimeValue}
    >
      <Column {...config} />
    </BaseChart>
  );
};
