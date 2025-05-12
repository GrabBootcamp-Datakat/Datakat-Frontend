import { DistributionData } from '../../distribution/type';

export default function getChartTypeForData(
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
