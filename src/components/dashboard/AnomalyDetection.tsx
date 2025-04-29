"use client";
import React from "react";
import { Card, Space, Tag } from "antd";
import { AlertOutlined, CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
import Text from "antd/es/typography/Text";

export const AnomalyDetection = () => {
  return (
    <Card
      title={
        <Space>
          <AlertOutlined />
          <span>Anomaly Detection</span>
        </Space>
      }
      hoverable
      bodyStyle={{ padding: "12px" }}
      style={{ flex: 1 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Card
          bordered={false}
          bodyStyle={{ padding: "12px", background: "#fff2f0" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <AlertOutlined style={{ color: "#ff4d4f", fontSize: "24px" }} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Text strong style={{ fontSize: "14px", color: "#ff4d4f" }}>
                  High Error Rate
                </Text>
                <Tag color="error">Critical</Tag>
              </div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Error rate increased by 150% in the last hour
              </Text>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          bodyStyle={{ padding: "12px", background: "#fffbe6" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <WarningOutlined style={{ color: "#faad14", fontSize: "24px" }} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <Text strong style={{ fontSize: "14px", color: "#faad14" }}>
                  Unusual Pattern
                </Text>
                <Tag color="warning">Warning</Tag>
              </div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Unusual log pattern detected in component
                &quot;spark.SecurityManager&quot;
              </Text>
            </div>
          </div>
        </Card>
        <Card
          bordered={false}
          bodyStyle={{ padding: "12px", background: "#f6ffed" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CheckCircleOutlined
              style={{ color: "#52c41a", fontSize: "24px" }}
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
                <Text strong style={{ fontSize: "14px", color: "#52c41a" }}>
                  System Health
                </Text>
                <Tag color="success">Normal</Tag>
              </div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                All systems operating within normal parameters
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};
