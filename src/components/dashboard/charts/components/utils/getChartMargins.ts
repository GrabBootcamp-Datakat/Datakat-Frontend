interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export default function getChartMargins(
  dataLength: number,
  chartType: string,
): ChartMargins {
  const baseMargin: ChartMargins = { top: 20, right: 30, left: 20, bottom: 5 };

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
