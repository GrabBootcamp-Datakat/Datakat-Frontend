'use client';
import React from 'react';
import { Card, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/lib/hooks/hook';
import { setComponentAnalysisCustomization } from '@/store/slices/chartCustomizationSlice';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { COLORS } from '../constants/color';
import { CHART_COLORS } from '../constants/color';
import {
  useGetComponentAnalysisQuery,
  useGetComponentQuery,
} from '@/store/api/logsApi';
import { NoDataStatus } from '../common/Status';
import { ChartSkeleton } from '../common/Skeleton';

export default function ComponentDistributionCard() {
  const { data: componentAnalysisData, isLoading } =
    useGetComponentAnalysisQuery();
  const { data: componentData, isLoading: componentDataLoading } =
    useGetComponentQuery();
  const dispatch = useAppDispatch();

  const handleCustomizeComponentAnalysis = () => {
    dispatch(setComponentAnalysisCustomization({ isCustomizing: true }));
  };

  if (isLoading || componentDataLoading) {
    return <ChartSkeleton title="Component Distribution" />;
  }

  if (!componentAnalysisData || !componentData) {
    return <NoDataStatus />;
  }

  return (
    <Card
      title="Component Distribution"
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
    </Card>
  );
}
