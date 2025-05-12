import { DistributionData } from '../../distribution/type';

export default function getReferenceLinesData(data: DistributionData[]) {
  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  const uniqueTicks = Array.from(new Set([minValue, avgValue, maxValue])).sort(
    (a, b) => a - b,
  );
  return { uniqueTicks, maxValue, avgValue, minValue };
}
