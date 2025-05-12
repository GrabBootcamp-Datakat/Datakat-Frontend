import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  DotChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { ChartType } from './type';

export default function ChartIcon({ chartType }: { chartType: ChartType }) {
  switch (chartType) {
    case 'bar':
      return <BarChartOutlined />;
    case 'line':
      return <LineChartOutlined />;
    case 'area':
      return <AreaChartOutlined />;
    case 'pie':
      return <PieChartOutlined />;
    case 'radar':
      return <RadarChartOutlined />;
    case 'radialBar':
      return <PieChartOutlined />;
    case 'composed':
      return <DotChartOutlined />;
    case 'treemap':
      return <AppstoreOutlined />;
  }
}
