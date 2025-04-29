import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Card, Progress, Space, Tag, Typography } from "antd";

const { Text } = Typography;

export function SystemStatus() {
  const systems = [
    {
      id: "1",
      name: "API Gateway",
      status: "operational",
      uptime: "99.98%",
      lastIncident: "7d ago",
      load: 42,
    },
    {
      id: "2",
      name: "Authentication Service",
      status: "operational",
      uptime: "99.95%",
      lastIncident: "3d ago",
      load: 38,
    },
    {
      id: "3",
      name: "Database Cluster",
      status: "operational",
      uptime: "99.99%",
      lastIncident: "14d ago",
      load: 65,
    },
    {
      id: "4",
      name: "Payment Processing",
      status: "degraded",
      uptime: "98.75%",
      lastIncident: "2h ago",
      load: 78,
    },
    {
      id: "5",
      name: "Storage Service",
      status: "operational",
      uptime: "99.97%",
      lastIncident: "5d ago",
      load: 22,
    },
    {
      id: "6",
      name: "Notification Service",
      status: "down",
      uptime: "95.43%",
      lastIncident: "30m ago",
      load: 0,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "degraded":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "down":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "success";
      case "degraded":
        return "warning";
      case "down":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {systems.map((system) => (
        <Card key={system.id} size="small">
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Space>
                <Text strong>{system.name}</Text>
                <Tag
                  icon={getStatusIcon(system.status)}
                  color={getStatusColor(system.status)}
                >
                  {system.status.charAt(0).toUpperCase() +
                    system.status.slice(1)}
                </Tag>
              </Space>
              <Text type="secondary">Uptime: {system.uptime}</Text>
            </Space>
            <Space>
              <Progress
                percent={system.load}
                size="small"
                style={{ width: 200 }}
              />
              <Text type="secondary">{system.load}%</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Last incident: {system.lastIncident}
            </Text>
          </Space>
        </Card>
      ))}
    </Space>
  );
}
