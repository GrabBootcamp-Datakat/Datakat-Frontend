'use client';
import {
  Card,
  Select,
  Space,
  Tooltip as AntTooltip,
  Alert,
  Switch,
} from 'antd';
import { useState, useEffect } from 'react';
import {
  processChartData,
  getChartMargins,
  getReferenceLinesData,
} from './components/utils';
import { BarChartOutlined, SwitcherOutlined } from '@ant-design/icons';
import { CHART_TYPES } from './distribution/constants';
import { ChartType } from './distribution/type';
import { ChartIcon, RenderChart } from './distribution';
import { ChartDataMap, DistributionData } from './distribution/type';
import { LogSearchRequest } from '@/types/logs';
import { Dimension } from '@/types/metrics';
import Text from 'antd/es/typography/Text';

interface DistributionChartProps {
  data: DistributionData[];
  height?: number;
  className?: string;
  dimension?: Dimension;
  logsQuery?: LogSearchRequest;
  isMultiMode: boolean;
  setIsMultiMode: (isMultiMode: boolean) => void;
  chartTypes: ChartType[];
  onChartTypesChange: (chartTypes: ChartType[]) => void;
}

export default function DistributionChart(props: DistributionChartProps) {
  const {
    data,
    dimension,
    logsQuery,
    isMultiMode,
    setIsMultiMode,
    chartTypes,
    onChartTypesChange,
  } = props;
  const [chartDataMap, setChartDataMap] = useState<ChartDataMap>({});

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartDataMap({});
      return;
    }

    const newChartDataMap: ChartDataMap = {};
    chartTypes.forEach((chartType) => {
      const processed = processChartData(data, chartType);
      const referenceLinesData = getReferenceLinesData(processed.data);
      const margins = getChartMargins(processed.totalItems, chartType);

      newChartDataMap[chartType] = {
        processedData: processed,
        referenceLinesData,
        margins,
      };
    });

    setChartDataMap(newChartDataMap);
  }, [data, chartTypes]);

  // When switching modes, ensure we follow the mode's rules
  useEffect(() => {
    if (!isMultiMode && chartTypes.length > 1) {
      onChartTypesChange([chartTypes[0]]);
    }
  }, [isMultiMode, chartTypes, onChartTypesChange]);

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

  const handleChartTypeChange = (values: ChartType[] | ChartType) => {
    const newValues = Array.isArray(values) ? values : [values];
    if (isMultiMode) {
      if (newValues.length === 0) {
        onChartTypesChange(['bar']); // Default to bar chart if nothing selected
      } else {
        onChartTypesChange(newValues);
      }
    } else {
      // In single mode, always take the last selected value
      onChartTypesChange([newValues[newValues.length - 1] || 'bar']);
    }
  };

  const handleModeChange = (checked: boolean) => {
    setIsMultiMode(checked);
  };

  return (
    <>
      <Card>
        <Space className="w-full justify-between">
          <div className="flex items-center gap-2">
            <ChartIcon chartType={chartTypes?.[0] || 'bar'} />
            <Text className="font-medium">Charts</Text>
          </div>
          <Space>
            <Space size="small">
              <AntTooltip
                title={
                  isMultiMode ? 'Multiple charts mode' : 'Single chart mode'
                }
              >
                <Switch
                  size="small"
                  checked={isMultiMode}
                  onChange={handleModeChange}
                  checkedChildren={<SwitcherOutlined />}
                  unCheckedChildren={<BarChartOutlined />}
                />
              </AntTooltip>
              <AntTooltip placement="left">
                <Select
                  size="small"
                  mode={isMultiMode ? 'multiple' : undefined}
                  maxTagCount={isMultiMode ? 1 : undefined}
                  value={chartTypes}
                  onChange={handleChartTypeChange}
                  options={CHART_TYPES}
                  style={{ width: 225 }}
                  placeholder={
                    isMultiMode ? 'Select chart types' : 'Select chart type'
                  }
                />
              </AntTooltip>
            </Space>
          </Space>
        </Space>
      </Card>
      <div className="flex flex-col gap-4">
        {chartTypes?.map((chartType) => {
          const chartData = chartDataMap[chartType];
          if (!chartData) return null;

          return (
            <Card
              key={chartType}
              title={
                <Space>
                  <ChartIcon chartType={chartType} />
                  <Text strong>
                    {CHART_TYPES.find((t) => t.value === chartType)?.label}
                  </Text>
                  {chartData.processedData.hasOthers && (
                    <Text type="secondary" className="text-sm">
                      (Showing top {chartData.processedData.data.length - 1} of{' '}
                      {chartData.processedData.totalItems} items)
                    </Text>
                  )}
                </Space>
              }
              styles={{ body: { padding: 0 } }}
            >
              <RenderChart
                chartData={chartData.processedData.data}
                chartType={chartType}
                margins={chartData.margins}
                referenceLinesData={chartData.referenceLinesData}
                dimension={dimension}
                logsQuery={logsQuery}
              />
            </Card>
          );
        })}
      </div>
    </>
  );
}
