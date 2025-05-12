import { Dot } from 'recharts';

interface CustomDotProps {
  className?: string;
  cx?: number;
  cy?: number;
  r?: number;
  clipDot?: boolean;
  value?: number | number[];
  minValue: number;
  maxValue: number;
}

export default function CustomDot(props: CustomDotProps) {
  const { cx, cy, value, minValue, maxValue } = props;
  const currentValue = Array.isArray(value) ? value[1] : (value ?? 0);

  if (currentValue === maxValue) {
    return <Dot cx={cx} cy={cy} r={4} fill="red" />;
  }

  if (currentValue === minValue) {
    return <Dot cx={cx} cy={cy} r={4} fill="blue" />;
  }

  return <Dot />;
}
