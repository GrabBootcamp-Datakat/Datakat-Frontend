import { DistributionData } from '../../distribution/type';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Space } from 'antd';
import { formatChartValue } from '../utils';
import { SearchOutlined } from '@ant-design/icons';
import Text from 'antd/es/typography/Text';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DistributionData;
  }>;
  label?: string;
  onViewLogs: (data: DistributionData) => void;
  onClose: (e: React.MouseEvent) => void;
}

export default function CustomTooltip(props: CustomTooltipProps) {
  const { active, payload, label, onViewLogs, onClose } = props;

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded border border-gray-200 bg-white p-3 shadow-lg">
        <Space direction="vertical" size="small">
          <Text strong>{label}</Text>
          <Text type="secondary">
            Value: {formatChartValue({ value: data.value, chartType: 'bar' })}
          </Text>
          <div className="flex gap-2">
            <Button
              type="primary"
              size="small"
              icon={<SearchOutlined />}
              onClick={() => onViewLogs(data)}
            >
              View Logs
            </Button>
            <Button
              size="small"
              icon={<CloseOutlined />}
              onClick={(e: React.MouseEvent) => onClose(e)}
            >
              Close
            </Button>
          </div>
        </Space>
      </div>
    );
  }
  return null;
}
