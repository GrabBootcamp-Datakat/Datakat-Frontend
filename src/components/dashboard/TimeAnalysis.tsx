"use client";

import { Card, Space, Button, Divider, Select } from "antd";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { SettingOutlined } from "@ant-design/icons";
import { TimeUnit } from "@/types/logsType";
import { CHART_COLORS } from "../constants/color";
import {
  setTimeAnalysisCustomization,
  TimeDataPoint,
} from "@/store/slices/chartCustomizationSlice";
import { useAppDispatch } from "@/lib/hooks/hook";

export interface TimeAnalysisProps {
  timeUnit: TimeUnit;
  setTimeUnit: (unit: TimeUnit) => void;
  timeAnalysisData: TimeDataPoint[];
  hourlyDistribution: Array<{
    hour: string;
    INFO: number;
    WARN: number;
    ERROR: number;
  }>;
}

export const TimeAnalysis = (props: TimeAnalysisProps) => {
  const { timeUnit, setTimeUnit, timeAnalysisData, hourlyDistribution } = props;
  const dispatch = useAppDispatch();
  const handleCustomizeTimeAnalysis = () => {
    dispatch(setTimeAnalysisCustomization({ isCustomizing: true }));
  };

  return (
    <Card
      title={
        <Space>
          <span>Time Analysis</span>
          <Select
            value={timeUnit}
            onChange={(value) => setTimeUnit(value as TimeUnit)}
            style={{ width: 120 }}
          >
            <Select.Option value={TimeUnit.SECOND}>By Second</Select.Option>
            <Select.Option value={TimeUnit.MINUTE}>By Minute</Select.Option>
            <Select.Option value={TimeUnit.HOUR}>By Hour</Select.Option>
            <Select.Option value={TimeUnit.DAY}>By Day</Select.Option>
            <Select.Option value={TimeUnit.MONTH}>By Month</Select.Option>
            <Select.Option value={TimeUnit.YEAR}>By Year</Select.Option>
          </Select>
        </Space>
      }
      hoverable
      extra={
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={handleCustomizeTimeAnalysis}
        >
          Customize
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={timeAnalysisData}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={CHART_COLORS.total}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={CHART_COLORS.total}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="count"
            stroke={CHART_COLORS.total}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <Divider style={{ margin: "12px 0" }} />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={hourlyDistribution}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="INFO" stackId="a" fill={CHART_COLORS.info} />
          <Bar dataKey="WARN" stackId="a" fill={CHART_COLORS.warn} />
          <Bar dataKey="ERROR" stackId="a" fill={CHART_COLORS.error} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
