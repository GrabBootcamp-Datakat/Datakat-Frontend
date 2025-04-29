"use client";

import {
  Layout,
  Input,
  Button,
  Typography,
  Avatar,
  Space,
  Tooltip,
} from "antd";
import { useToggle } from "@/lib/hooks/useToggle";
import {
  MessageOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  CloseOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTimeAnalysisCustomization,
  setComponentAnalysisCustomization,
} from "@/store/slices/chartCustomizationSlice";
import { extractChartQuery } from "@/services/geminiService";
import { TimeUnit } from "@/types/logsType";
import { RootState } from "@/store/store";

const { Sider } = Layout;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}

export default function ChatbotPanel() {
  const { open, toggle } = useToggle(false);
  const dispatch = useDispatch();
  const { timeAnalysis, componentAnalysis } = useSelector(
    (state: RootState) => state.chartCustomization
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content:
        "Hello! I'm your log analysis assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Effect to update main content margin when panel opens/closes
  useEffect(() => {
    const mainLayout = document.querySelector(".ant-layout") as HTMLElement;
    if (mainLayout) {
      mainLayout.style.marginRight = open ? "350px" : "0";
    }
  }, [open]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    try {
      // Extract chart query parameters using Gemini
      const queryParams = await extractChartQuery(inputValue);

      // Update chart customization state based on the query
      if (timeAnalysis.isCustomizing) {
        dispatch(
          setTimeAnalysisCustomization({
            query: inputValue,
            timeUnit: (queryParams.timeUnit as TimeUnit) || TimeUnit.HOUR,
          })
        );
      } else if (componentAnalysis.isCustomizing) {
        dispatch(
          setComponentAnalysisCustomization({
            query: inputValue,
          })
        );
      }

      // Simulate bot response
      const botResponse: Message = {
        id: messages.length + 2,
        content:
          "I've updated the chart based on your request. Is there anything else you'd like to customize?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error processing chart customization:", error);
      const errorResponse: Message = {
        id: messages.length + 2,
        content:
          "I'm sorry, I couldn't process your request. Please try again with a different query.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    }
  };

  return (
    <Sider
      width={350}
      theme="light"
      collapsed={!open}
      collapsedWidth={0}
      trigger={null}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f5f5f5",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Space>
            <Avatar
              icon={<RobotOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                Log Assistant
              </Title>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {timeAnalysis.isCustomizing
                  ? "Customizing Time Analysis"
                  : componentAnalysis.isCustomizing
                  ? "Customizing Component Analysis"
                  : "Online"}
              </Text>
            </div>
          </Space>
          <Space>
            <Tooltip title="Minimize">
              <Button type="text" icon={<MinusOutlined />} onClick={toggle} />
            </Tooltip>
            <Tooltip title="Close">
              <Button type="text" icon={<CloseOutlined />} onClick={toggle} />
            </Tooltip>
          </Space>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            background: "#f5f5f5",
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Space align="start" size={8}>
                {message.sender === "bot" && (
                  <Avatar
                    icon={<RobotOutlined />}
                    style={{ backgroundColor: "#1890ff", flexShrink: 0 }}
                  />
                )}
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: message.sender === "user" ? "#1890ff" : "#fff",
                    color: message.sender === "user" ? "#fff" : "#000",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    position: "relative",
                  }}
                >
                  <Text
                    style={{
                      color: message.sender === "user" ? "#fff" : "inherit",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {message.content}
                  </Text>
                  {message.sender === "bot" && (
                    <div
                      style={{
                        position: "absolute",
                        left: "-8px",
                        top: "12px",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid #fff",
                      }}
                    />
                  )}
                  {message.sender === "user" && (
                    <div
                      style={{
                        position: "absolute",
                        right: "-8px",
                        top: "12px",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderLeft: "8px solid #1890ff",
                      }}
                    />
                  )}
                </div>
                {message.sender === "user" && (
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#52c41a", flexShrink: 0 }}
                  />
                )}
              </Space>
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  marginTop: "4px",
                  marginLeft: message.sender === "user" ? "auto" : "40px",
                }}
              >
                {message.timestamp}
              </Text>
            </div>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "16px",
            background: "#fff",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Space.Compact style={{ width: "100%" }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                timeAnalysis.isCustomizing
                  ? "Customize time analysis (e.g., 'Show data by month for the last 3 months')"
                  : componentAnalysis.isCustomizing
                  ? "Customize component analysis (e.g., 'Show top 10 components with error logs')"
                  : "Type your message..."
              }
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{
                borderRadius: "20px 0 0 20px",
                resize: "none",
                padding: "8px 16px",
                fontSize: "14px",
                borderColor: "#d9d9d9",
              }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              style={{
                borderRadius: "0 20px 20px 0",
                height: "auto",
                padding: "0 16px",
              }}
            />
          </Space.Compact>
        </div>
      </div>

      {/* Floating trigger button */}
      <div
        style={{
          position: "absolute",
          left: -48,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          background: "#1890ff",
          padding: "12px",
          borderRadius: "8px 0 0 8px",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
        }}
        onClick={toggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#40a9ff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#1890ff";
        }}
      >
        <MessageOutlined
          style={{
            fontSize: "20px",
            color: "#fff",
            animation: open ? "none" : "bounce 1s infinite",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </Sider>
  );
}
