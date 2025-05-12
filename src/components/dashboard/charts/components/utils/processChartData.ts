'use client';

import { DistributionData } from '../../distribution/type';
export const MAX_VISIBLE_ITEMS = 3;
export const MIN_VISIBLE_ITEMS = 3;

export interface ProcessedChartData {
  data: DistributionData[];
  totalItems: number;
  hasOthers: boolean;
  othersValue: number;
}

export default function processChartData(
  data: DistributionData[],
  chartType: string,
) {
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
