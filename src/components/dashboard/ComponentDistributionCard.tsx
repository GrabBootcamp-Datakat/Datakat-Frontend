'use client';
import { Card, Button } from 'antd';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { SettingOutlined } from '@ant-design/icons';
import { CHART_COLORS } from '../constants/color';
import { setComponentAnalysisCustomization } from '@/store/slices/chartCustomizationSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectComponentAnalysisData,
  selectIsLoading,
} from '@/store/slices/dashboardSlice';
import { NoDataStatus, ChartSkeleton } from '../common';

export default function ComponentDistributionCard() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const componentAnalysisData = useAppSelector(selectComponentAnalysisData);

  const handleCustomizeComponentDistribution = () => {
    dispatch(setComponentAnalysisCustomization({ isCustomizing: true }));
  };

  if (isLoading) {
    return <ChartSkeleton title="Component Distribution" />;
  }

  if (!componentAnalysisData || componentAnalysisData.length === 0) {
    return <NoDataStatus title="Component Distribution" />;
  }

  return (
    <Card
      title="Component Distribution"
      hoverable
      extra={
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={handleCustomizeComponentDistribution}
        >
          Customize
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={componentAnalysisData}>
          <XAxis dataKey="component" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill={CHART_COLORS.total} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
