'use client';
import { DistributionData } from './DistributionChart';

export const MAX_VISIBLE_ITEMS = 3;
export const MIN_VISIBLE_ITEMS = 3;

export interface ProcessedChartData {
  data: DistributionData[];
  totalItems: number;
  hasOthers: boolean;
  othersValue: number;
}

export function processChartData(
  data: DistributionData[],
  chartType: string,
): ProcessedChartData {
  if (!data || data.length === 0) {
    return {
      data: [],
      totalItems: 0,
      hasOthers: false,
      othersValue: 0,
    };
  }

  // For single data point, return as is
  if (data.length === 1) {
    return {
      data,
      totalItems: 1,
      hasOthers: false,
      othersValue: 0,
    };
  }

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // For circular charts (pie, radar) or when data points exceed threshold
  if (
    ['pie', 'radar', 'radialBar'].includes(chartType) &&
    sortedData.length > MAX_VISIBLE_ITEMS
  ) {
    const visibleData = sortedData.slice(0, MAX_VISIBLE_ITEMS);
    const othersValue = sortedData
      .slice(MAX_VISIBLE_ITEMS)
      .reduce((sum, item) => sum + item.value, 0);

    return {
      data: [...visibleData, { name: 'Others', value: othersValue }],
      totalItems: sortedData.length,
      hasOthers: true,
      othersValue,
    };
  }

  // For other chart types, return all data
  return {
    data: sortedData,
    totalItems: sortedData.length,
    hasOthers: false,
    othersValue: 0,
  };
}

export function getChartHeight(
  dataLength: number,
  chartType: string,
  defaultHeight = 300,
): number {
  // For circular charts, maintain aspect ratio
  if (['pie', 'radar', 'radialBar'].includes(chartType)) {
    return defaultHeight;
  }

  // For bar/line charts, adjust height based on data points
  if (dataLength > 20) {
    return defaultHeight * 1.5; // Taller for more data points
  } else if (dataLength < 5) {
    return defaultHeight * 0.8; // Shorter for fewer data points
  }

  return defaultHeight;
}

export function getChartMargins(
  dataLength: number,
  chartType: string,
): { top: number; right: number; bottom: number; left: number } {
  const baseMargin = { top: 20, right: 30, left: 20, bottom: 5 };

  // For circular charts, use equal margins
  if (['pie', 'radar', 'radialBar'].includes(chartType)) {
    return { top: 30, right: 30, left: 30, bottom: 30 };
  }

  // For bar/line charts, adjust bottom margin based on data points
  if (dataLength > 15) {
    return { ...baseMargin, bottom: 40 }; // More space for labels
  } else if (dataLength > 8) {
    return { ...baseMargin, bottom: 30 };
  }

  return baseMargin;
}

export function formatChartValue(value: number, chartType: string): string {
  if (['pie', 'radialBar'].includes(chartType)) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return value.toLocaleString();
}

export function getChartTypeForData(
  data: DistributionData[],
  currentType: string,
): string {
  if (!data || data.length === 0) return 'bar';

  // If current type is valid, keep it
  if (
    [
      'bar',
      'line',
      'area',
      'pie',
      'radar',
      'radialBar',
      'composed',
      'scatter',
      'treemap',
    ].includes(currentType)
  ) {
    return currentType;
  }

  // Suggest appropriate chart type based on data characteristics
  if (data.length <= 8) {
    return 'pie'; // Good for small datasets
  } else if (data.length <= 15) {
    return 'bar'; // Good for medium datasets
  } else {
    return 'treemap'; // Good for large datasets
  }
}
