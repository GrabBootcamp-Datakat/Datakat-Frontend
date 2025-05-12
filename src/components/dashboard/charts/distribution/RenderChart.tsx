import { LogSearchRequest } from '@/types/logs';
import {
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart,
  TreemapChart,
  ComposedChart,
} from '../components';
import { DistributionData, ChartType } from './type';
import { Dimension } from '@/types/metrics';

export interface RenderChartProps {
  chartData: DistributionData[];
  chartType: ChartType;
  margins?: { top: number; right: number; bottom: number; left: number };
  startTime?: string;
  endTime?: string;
  referenceLinesData: {
    uniqueTicks: number[];
    maxValue: number;
    avgValue: number;
    minValue: number;
  };
  dimension?: Dimension;
  logsQuery?: LogSearchRequest;
}

export default function RenderChart(props: RenderChartProps) {
  const { chartData, chartType } = props;

  if (!chartData || chartData.length === 0) {
    return null;
  }

  switch (chartType) {
    case 'bar':
      return <BarChart {...props} />;
    case 'line':
      return <LineChart {...props} />;
    case 'area':
      return <AreaChart {...props} />;
    case 'pie':
      return <PieChart {...props} />;
    case 'radar':
      return <RadarChart {...props} />;
    case 'radialBar':
      return <RadialBarChart {...props} />;
    case 'composed':
      return <ComposedChart {...props} />;
    case 'scatter':
      return <ScatterChart {...props} />;
    case 'treemap':
      return <TreemapChart {...props} />;
    default:
      return <BarChart {...props} />;
  }
}
