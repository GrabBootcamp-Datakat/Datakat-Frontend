import React from "react";
import { BaseChart } from "./BaseChart";
import { Line } from "@ant-design/plots";

interface TimeDataPoint {
  time: string;
  value: number;
  type: string;
}

interface TimeAnalysisChartProps {
  data: TimeDataPoint[];
  onCustomize: (timePattern: string) => void;
  initialTimeValue?: string;
}

export const TimeAnalysisChart: React.FC<TimeAnalysisChartProps> = ({
  data,
  onCustomize,
  initialTimeValue,
}) => {
  const config = {
    data,
    xField: "time",
    yField: "value",
    seriesField: "type",
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
  };

  return (
    <BaseChart
      title="Time Analysis"
      onCustomize={onCustomize}
      initialTimeValue={initialTimeValue}
    >
      <Line {...config} />
    </BaseChart>
  );
};
