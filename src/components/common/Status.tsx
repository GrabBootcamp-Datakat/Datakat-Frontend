import { Button, Card, Space, Spin } from 'antd';
import { CHART_COLORS } from '@/components/constants/color';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';

export interface ErrorStatusProps {
  error: string;
  debugInfo: string | null;
}

export const LoadingStatus = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Space direction="vertical" align="center">
        <Spin size="large" />
        <Title level={5}>Loading...</Title>
      </Space>
    </div>
  );
};

export const ErrorStatus = (props: ErrorStatusProps) => {
  const { error, debugInfo } = props;
  return (
    <div className="flex items-center justify-center">
      <Card>
        <Space direction="vertical" align="center">
          <Title level={4} style={{ color: CHART_COLORS.error }}>
            Error Loading Logs
          </Title>
          <Text type="danger">{error}</Text>
          {debugInfo && (
            <Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
              {debugInfo}
            </Text>
          )}
          <Button type="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export const NoDataStatus = ({ title }: { title: string }) => {
  return (
    <Card title={title} style={{ height: '420px' }}>
      <Space direction="vertical" align="center">
        <Text type="secondary">
          Some data is missing, please check if the log file exists and is
          properly formatted.
        </Text>
      </Space>
    </Card>
  );
};
