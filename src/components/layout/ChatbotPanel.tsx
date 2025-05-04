'use client';

import { Layout, Input, Button, Typography, Avatar, Space, Card } from 'antd';
import { useToggle } from '@/hooks/useToggle';
import {
  MessageOutlined,
  SendOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Sider } = Layout;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const exampleQueries = [
  'Show me CPU usage for all servers over the last 24 hours',
  'Which services had the most errors yesterday?',
  'Compare network traffic between app-server-01 and app-server-02',
  "What's causing the high memory usage on db-server-01?",
  'Show me the correlation between response time and user traffic',
];

export default function ChatbotPanel() {
  const { open, toggle } = useToggle(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content:
        "Hello! I'm your AI assistant. How can I help you analyze your system data today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Effect to update main content margin when panel opens/closes
  useEffect(() => {
    const mainLayout = document.querySelector('.ant-layout') as HTMLElement;
    if (mainLayout) {
      mainLayout.style.marginRight = open ? '350px' : '0';
    }
  }, [open]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        content:
          "I'm analyzing your query. Here's what I found:\n\n1. The data shows a clear correlation between CPU usage spikes and increased user traffic.\n2. There's an anomaly at 4 PM that doesn't correlate with traffic patterns.\n3. The application might benefit from additional caching during peak hours (10 AM - 2 PM).",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
  };

  return (
    <Sider
      width={350}
      theme="light"
      collapsed={!open}
      collapsedWidth={0}
      trigger={null}
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Card
          bordered={false}
          style={{
            borderBottom: '1px solid #f0f0f0',
            borderRadius: 0,
          }}
        >
          <Space>
            <Avatar
              icon={<RobotOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                AI Assistant
              </Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Online
              </Text>
            </div>
          </Space>
        </Card>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#f5f5f5',
          }}
        >
          {messages.map((message) => (
            <Card
              key={message.id}
              size="small"
              style={{
                maxWidth: '85%',
                alignSelf:
                  message.sender === 'user' ? 'flex-end' : 'flex-start',
                background: message.sender === 'user' ? '#1890ff' : '#fff',
                borderRadius: '12px',
              }}
            >
              <Space direction="vertical" size={4}>
                <Text
                  style={{
                    color: message.sender === 'user' ? '#fff' : 'inherit',
                    fontSize: '14px',
                    lineHeight: '1.5',
                  }}
                >
                  {message.content}
                </Text>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '12px',
                    color:
                      message.sender === 'user'
                        ? 'rgba(255,255,255,0.8)'
                        : 'inherit',
                  }}
                >
                  {message.timestamp}
                </Text>
              </Space>
            </Card>
          ))}
        </div>

        {/* Input */}
        <Card
          bordered={false}
          style={{
            borderTop: '1px solid #f0f0f0',
            borderRadius: 0,
          }}
        >
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your logs and metrics..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{
                  borderRadius: '20px 0 0 20px',
                  resize: 'none',
                  padding: '8px 16px',
                  fontSize: '14px',
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
                loading={isLoading}
                style={{
                  borderRadius: '0 20px 20px 0',
                  height: 'auto',
                  padding: '0 16px',
                }}
              />
            </Space.Compact>

            <div>
              <Text
                type="secondary"
                style={{ fontSize: '12px', marginBottom: '8px' }}
              >
                Example queries
              </Text>
              <Space wrap>
                {exampleQueries.map((example, index) => (
                  <Button
                    key={index}
                    size="small"
                    type="text"
                    onClick={() => handleExampleClick(example)}
                    style={{ fontSize: '12px' }}
                  >
                    {example}
                  </Button>
                ))}
              </Space>
            </div>
          </Space>
        </Card>
      </div>

      {/* Floating trigger button */}
      <div
        style={{
          position: 'absolute',
          left: -48,
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'pointer',
          background: '#1890ff',
          padding: '12px',
          borderRadius: '8px 0 0 8px',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
        onClick={toggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#40a9ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#1890ff';
        }}
      >
        <MessageOutlined
          style={{
            fontSize: '20px',
            color: '#fff',
            animation: open ? 'none' : 'bounce 1s infinite',
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
