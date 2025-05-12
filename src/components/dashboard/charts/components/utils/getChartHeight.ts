interface GetChartHeightProps {
  dataLength: number;
  chartType: string;
  defaultHeight?: number;
}

export default function getChartHeight(props: GetChartHeightProps): number {
  const { dataLength, chartType, defaultHeight = 300 } = props;

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
