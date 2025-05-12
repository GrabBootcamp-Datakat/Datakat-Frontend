'use client';
import {
  Card,
  Typography,
  Select,
  Space,
  Tooltip as AntTooltip,
  Alert,
} from 'antd';
import { useState, useEffect } from 'react';
import {
  processChartData,
  getChartMargins,
  getChartTypeForData,
  ProcessedChartData,
} from './chartUtils';
import {
  BarChartComponent,
  LineChartComponent,
  AreaChartComponent,
  PieChartComponent,
  RadarChartComponent,
  RadialBarChartComponent,
  ScatterChartComponent,
  TreemapChartComponent,
  ComposedChartComponent,
} from './chartComponents';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  DotChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

export type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'radar'
  | 'radialBar'
  | 'composed'
  | 'scatter'
  | 'treemap';

export interface DistributionData {
  name: string;
  value: number;
}

interface DistributionChartProps {
  data: DistributionData[];
  height?: number;
  className?: string;
  defaultChartType?: ChartType;
}

const CHART_TYPES = [
  {
    label: 'Bar Chart',
    value: 'bar',
    description: 'Compare values between different groups',
  },
  {
    label: 'Line Chart',
    value: 'line',
    description: 'Track trends over time',
  },
  {
    label: 'Area Chart',
    value: 'area',
    description: 'Show trends with volume emphasis',
  },
  {
    label: 'Pie Chart',
    value: 'pie',
    description: 'Display percentage distribution between groups',
  },
  {
    label: 'Radar Chart',
    value: 'radar',
    description: 'Compare multiple attributes in a circular layout',
  },
  {
    label: 'Radial Bar',
    value: 'radialBar',
    description: 'Circular bar chart for percentage-based metrics',
  },
  {
    label: 'Composed Chart',
    value: 'composed',
    description: 'Combine multiple chart types for complex data',
  },
  // {
  //   label: 'Scatter Chart',
  //   value: 'scatter',
  //   description: 'Show correlation between continuous values',
  // },
  {
    label: 'Treemap',
    value: 'treemap',
    description: 'Visualize hierarchical data with nested rectangles',
  },
];

export interface RenderChartProps {
  chartData: DistributionData[];
  chartType: ChartType;
  margins?: { top: number; right: number; bottom: number; left: number };
  startTime?: string;
  endTime?: string;
}

const RenderChart = (props: RenderChartProps) => {
  const { chartData, chartType } = props;

  if (!chartData || chartData.length === 0) {
    return null;
  }

  switch (chartType) {
    case 'bar':
      return <BarChartComponent {...props} />;
    case 'line':
      return <LineChartComponent {...props} />;
    case 'area':
      return <AreaChartComponent {...props} />;
    case 'pie':
      return <PieChartComponent {...props} />;
    case 'radar':
      return <RadarChartComponent {...props} />;
    case 'radialBar':
      return <RadialBarChartComponent {...props} />;
    case 'composed':
      return <ComposedChartComponent {...props} />;
    case 'scatter':
      return <ScatterChartComponent {...props} />;
    case 'treemap':
      return <TreemapChartComponent {...props} />;
    default:
      return <BarChartComponent {...props} />;
  }
};

export function DistributionChart({
  data,
  defaultChartType = 'bar',
}: DistributionChartProps) {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [processedData, setProcessedData] = useState<ProcessedChartData>({
    data: [],
    totalItems: 0,
    hasOthers: false,
    othersValue: 0,
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      setProcessedData({
        data: [],
        totalItems: 0,
        hasOthers: false,
        othersValue: 0,
      });
      return;
    }

    const suggestedType = getChartTypeForData(data, chartType);
    if (suggestedType !== chartType) {
      setChartType(suggestedType as ChartType);
    }

    const processed = processChartData(data, chartType);
    setProcessedData(processed);
  }, [data, chartType]);

  const { data: chartData, totalItems, hasOthers } = processedData;

  if (!data || data.length === 0) {
    return (
      <Card>
        <Alert
          message="No Data Available"
          description="There is no data to display for the selected time range."
          type="info"
          showIcon
        />
      </Card>
    );
  }

  // const chartHeight = getChartHeight(totalItems, chartType, propHeight);
  const margins = getChartMargins(totalItems, chartType);

  console.log('chartData', chartData);

  return (
    <>
      <Card>
        <Space className="w-full justify-between">
          <div className="flex items-center gap-2">
            {chartType === 'bar' && <BarChartOutlined />}
            {chartType === 'line' && <LineChartOutlined />}
            {chartType === 'area' && <AreaChartOutlined />}
            {chartType === 'pie' && <PieChartOutlined />}
            {chartType === 'radar' && <RadarChartOutlined />}
            {chartType === 'radialBar' && <PieChartOutlined />}
            {chartType === 'composed' && <DotChartOutlined />}
            {chartType === 'treemap' && <AppstoreOutlined />}
            <Text className="font-medium">Chart</Text>
          </div>
          <Space>
            {hasOthers && (
              <Text type="secondary" className="text-sm">
                Showing top {chartData.length - 1} of {totalItems} items
              </Text>
            )}
            <AntTooltip placement="left">
              <Select
                size="small"
                value={chartType}
                onChange={(value: ChartType) => setChartType(value)}
                options={CHART_TYPES}
                style={{ width: 150 }}
              />
            </AntTooltip>
          </Space>
        </Space>
      </Card>
      <Card styles={{ body: { padding: 0 } }}>
        <RenderChart
          chartData={chartData}
          chartType={chartType}
          margins={margins}
        />
      </Card>
    </>
  );
}
