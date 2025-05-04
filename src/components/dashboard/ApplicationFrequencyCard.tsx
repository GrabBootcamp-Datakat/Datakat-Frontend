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
import { setTimeAnalysisCustomization } from '@/store/slices/chartCustomizationSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectApplicationFrequencyData,
  selectIsLoading,
} from '@/store/slices/dashboardSlice';
import { NoDataStatus, ChartSkeleton } from '../common';

export default function ApplicationFrequencyCard() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const applicationFrequencyData = useAppSelector(
    selectApplicationFrequencyData,
  );

  const handleCustomizeApplicationFrequency = () => {
    dispatch(setTimeAnalysisCustomization({ isCustomizing: true }));
  };

  if (isLoading) {
    return <ChartSkeleton title="Application Frequency" />;
  }

  if (!applicationFrequencyData) {
    return <NoDataStatus title="Application Frequency" />;
  }

  return (
    <Card
      title="Application Frequency"
      hoverable
      extra={
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={handleCustomizeApplicationFrequency}
        >
          Customize
        </Button>
      }
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={applicationFrequencyData}>
          <XAxis dataKey="application" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill={CHART_COLORS.total} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
