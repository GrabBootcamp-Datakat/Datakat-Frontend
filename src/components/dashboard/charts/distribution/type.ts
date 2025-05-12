import { ProcessedChartData } from '../components/utils/processChartData';

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

export interface ChartDataMap {
  [key: string]: {
    processedData: ProcessedChartData;
    referenceLinesData: {
      uniqueTicks: number[];
      maxValue: number;
      avgValue: number;
      minValue: number;
    };
    margins: { top: number; right: number; bottom: number; left: number };
  };
}
