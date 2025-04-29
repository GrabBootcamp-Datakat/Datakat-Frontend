import React from "react";
import { Card, Button, Divider, Tooltip } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/lib/hooks/hook";
import {
  ComponentDataPoint,
  setComponentAnalysisCustomization,
} from "@/store/slices/chartCustomizationSlice";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../constants/color";
import { CHART_COLORS } from "../constants/color";

export interface ComponentAnalysisProps {
  componentAnalysisData: ComponentDataPoint[];
  componentData: Array<{
    name: string;
    value: number;
  }>;
  eventFrequency: Array<{
    eventId: string;
    count: number;
  }>;
}

export const ComponentAnalysis = (props: ComponentAnalysisProps) => {
  const { componentAnalysisData, componentData, eventFrequency } = props;
  const dispatch = useAppDispatch();
  const handleCustomizeComponentAnalysis = () => {
    dispatch(setComponentAnalysisCustomization({ isCustomizing: true }));
  };

  console.log(componentAnalysisData);

  return (
    <Card
      title="Component Analysis"
      hoverable
      extra={
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={handleCustomizeComponentAnalysis}
        >
          Customize
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={componentAnalysisData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="component" width={150} />
          <Tooltip />
          <Bar dataKey="count" fill={CHART_COLORS.total}>
            {componentData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Divider style={{ margin: "12px 0" }} />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={eventFrequency}>
          <XAxis dataKey="eventId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill={CHART_COLORS.total} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
