"use client";
import { BarChartOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Space,
  Button,
  Modal,
  Skeleton,
  DatePicker,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Progress } from "antd";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../constants/color";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { useGetLogsCountQuery } from "@/store/api/logsApi";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Text: AntText } = Typography;

export const LogLevelOverview = () => {
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const { data: logCount, isLoading } = useGetLogsCountQuery(
    dateRange ? { startDate: dateRange[0], endDate: dateRange[1] } : null
  );

  useEffect(() => {
    if (logCount?.defaultDateRange && !dateRange) {
      setDateRange([
        logCount.defaultDateRange.startDate,
        logCount.defaultDateRange.endDate,
      ]);
    }
  }, [logCount?.defaultDateRange, dateRange]);

  const handleCustomize = (dates: [string, string] | null) => {
    setDateRange(dates);
    setIsCustomizeModalOpen(false);
  };

  const formatDate = (date: string) => {
    const parsedDate = dayjs(date);
    return parsedDate.isValid()
      ? parsedDate.format("YYYY-MM-DD")
      : "Invalid Date";
  };

  const renderSkeleton = () => (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          <span>Log Level Overview</span>
        </Space>
      }
      hoverable
      bodyStyle={{ padding: "12px" }}
      style={{ flex: 2 }}
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} bordered={false} bodyStyle={{ padding: "12px" }}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        </Col>
        <Col span={12}>
          <Card
            bordered={false}
            bodyStyle={{ padding: "12px", height: "100%" }}
          >
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        </Col>
      </Row>
    </Card>
  );

  if (isLoading || !logCount) return renderSkeleton();

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          <span>Log Level Overview</span>
        </Space>
      }
      hoverable
      bodyStyle={{ padding: "12px" }}
      style={{ flex: 2 }}
      extra={
        <Space>
          {dateRange && (
            <AntText type="secondary">
              {formatDate(dateRange[0])} to {formatDate(dateRange[1])}
            </AntText>
          )}
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => setIsCustomizeModalOpen(true)}
          />
        </Space>
      }
    >
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Card bordered={false} bodyStyle={{ padding: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <CheckCircleOutlined
                  style={{ color: CHART_COLORS.info, fontSize: "24px" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <Text strong style={{ fontSize: "14px" }}>
                      INFO
                    </Text>
                    <Text style={{ fontSize: "14px" }}>{logCount.INFO}</Text>
                  </div>
                  <Progress
                    percent={Number(
                      ((logCount.INFO / logCount.total) * 100).toFixed(1)
                    )}
                    strokeColor={CHART_COLORS.info}
                    trailColor={CHART_COLORS.background}
                    showInfo={false}
                    size="small"
                  />
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {((logCount.INFO / logCount.total) * 100).toFixed(1)}%
                  </Text>
                </div>
              </div>
            </Card>
            <Card bordered={false} bodyStyle={{ padding: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <WarningOutlined
                  style={{ color: CHART_COLORS.warn, fontSize: "24px" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <Text strong style={{ fontSize: "14px" }}>
                      WARN
                    </Text>
                    <Text style={{ fontSize: "14px" }}>{logCount.WARN}</Text>
                  </div>
                  <Progress
                    percent={Number(
                      ((logCount.WARN / logCount.total) * 100).toFixed(1)
                    )}
                    strokeColor={CHART_COLORS.warn}
                    trailColor={CHART_COLORS.background}
                    showInfo={false}
                    size="small"
                  />
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {((logCount.WARN / logCount.total) * 100).toFixed(1)}%
                  </Text>
                </div>
              </div>
            </Card>
            <Card bordered={false} bodyStyle={{ padding: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <CloseCircleOutlined
                  style={{ color: CHART_COLORS.error, fontSize: "24px" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <Text strong style={{ fontSize: "14px" }}>
                      ERROR
                    </Text>
                    <Text style={{ fontSize: "14px" }}>{logCount.ERROR}</Text>
                  </div>
                  <Progress
                    percent={Number(
                      ((logCount.ERROR / logCount.total) * 100).toFixed(1)
                    )}
                    strokeColor={CHART_COLORS.error}
                    trailColor={CHART_COLORS.background}
                    showInfo={false}
                    size="small"
                  />
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {((logCount.ERROR / logCount.total) * 100).toFixed(1)}%
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </Col>
        <Col span={12}>
          <Card
            bordered={false}
            bodyStyle={{ padding: "12px", height: "100%" }}
          >
            <Title level={5} style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
              Log Level Distribution
            </Title>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "INFO",
                      value: logCount.INFO,
                      color: CHART_COLORS.info,
                    },
                    {
                      name: "WARN",
                      value: logCount.WARN,
                      color: CHART_COLORS.warn,
                    },
                    {
                      name: "ERROR",
                      value: logCount.ERROR,
                      color: CHART_COLORS.error,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    {
                      name: "INFO",
                      value: logCount.INFO,
                      color: CHART_COLORS.info,
                    },
                    {
                      name: "WARN",
                      value: logCount.WARN,
                      color: CHART_COLORS.warn,
                    },
                    {
                      name: "ERROR",
                      value: logCount.ERROR,
                      color: CHART_COLORS.error,
                    },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Customize Date Range"
        open={isCustomizeModalOpen}
        onCancel={() => setIsCustomizeModalOpen(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <RangePicker
            style={{ width: "100%" }}
            onChange={(dates) => {
              if (dates) {
                handleCustomize([
                  dates[0]?.format("YYYY-MM-DD") || "",
                  dates[1]?.format("YYYY-MM-DD") || "",
                ]);
              } else {
                handleCustomize(null);
              }
            }}
            value={
              dateRange ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null
            }
          />
        </Space>
      </Modal>
    </Card>
  );
};
