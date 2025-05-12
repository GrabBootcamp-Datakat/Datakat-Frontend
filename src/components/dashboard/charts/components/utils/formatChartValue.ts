interface FormatChartValueProps {
  value: number;
  chartType: string;
  totalValue?: number;
}

export default function formatChartValue(props: FormatChartValueProps): string {
  const { value, chartType, totalValue } = props;
  if (['pie', 'radialBar'].includes(chartType)) {
    if (totalValue) {
      return `${((value * 100) / totalValue).toFixed(1)}%`;
    }
    return value.toLocaleString();
  }
  return value.toLocaleString();
}
