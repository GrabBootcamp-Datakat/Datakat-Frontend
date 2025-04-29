"use client";
import { Button, Card, Progress, Space } from "antd";
import { CHART_COLORS } from "@/components/constants/color";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";

export interface ErrorStatusProps {
  error: string;
  debugInfo: string | null;
}

export const LoadingStatus = () => {
  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: CHART_COLORS.background,
      }}
    >
      <Card>
        <Space direction="vertical" align="center">
          <Title level={4}>Loading Log Data...</Title>
          <Progress type="circle" percent={75} />
        </Space>
      </Card>
    </div>
  );
};

export const ErrorStatus = (props: ErrorStatusProps) => {
  const { error, debugInfo } = props;
  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: CHART_COLORS.background,
      }}
    >
      <Card>
        <Space direction="vertical" align="center">
          <Title level={4} style={{ color: CHART_COLORS.error }}>
            Error Loading Logs
          </Title>
          <Text type="danger">{error}</Text>
          {debugInfo && (
            <Text type="secondary" style={{ whiteSpace: "pre-wrap" }}>
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

export const NoDataStatus = () => {
  return (
    <div
      style={{
        padding: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: CHART_COLORS.background,
      }}
    >
      <Card>
        <Space direction="vertical" align="center">
          <Title level={4}>No Log Data Available</Title>
          <Text type="secondary">
            Please check if the log file exists and is properly formatted.
          </Text>
        </Space>
      </Card>
    </div>
  );
};
