'use client';

import { Input, Button, Typography, Avatar, Space, Card } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { PageTitle } from '@/components/common/PageTitle';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Message interface representing a chat message
 * @interface Message
 * @property {number} id - Unique identifier for the message
 * @property {string} content - The message content
 * @property {'user' | 'bot'} sender - Who sent the message
 * @property {string} timestamp - When the message was sent
 */
interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

/**
 * Example queries to help users get started
 * @constant
 */
const exampleQueries = [
  'Show me CPU usage for all servers over the last 24 hours',
  'Which services had the most errors yesterday?',
  'Compare network traffic between app-server-01 and app-server-02',
  "What's causing the high memory usage on db-server-01?",
  'Show me the correlation between response time and user traffic',
];

/**
 * ChatMessage component for displaying individual messages
 * @component
 */
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`!flex ${isUser ? '!justify-end' : '!justify-start'}`}>
      <div className="!flex !max-w-3xl !items-start !gap-3">
        {!isUser && (
          <Avatar
            icon={<RobotOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
        )}
        <Card
          size="small"
          style={{
            background: isUser ? '#1890ff' : '#f5f5f5',
            borderRadius: '12px',
          }}
        >
          <Space direction="vertical" size={4}>
            <Text
              style={{
                color: isUser ? '#fff' : 'inherit',
                fontSize: '14px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message.content}
            </Text>
            <Text
              type="secondary"
              style={{
                fontSize: '12px',
                color: isUser ? 'rgba(255,255,255,0.8)' : 'inherit',
              }}
            >
              {message.timestamp}
            </Text>
          </Space>
        </Card>
        {isUser && (
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: '#52c41a' }}
          />
        )}
      </div>
    </div>
  );
};

/**
 * ExampleQueries component for displaying suggested queries
 * @component
 */
const ExampleQueries = ({
  onSelect,
}: {
  onSelect: (query: string) => void;
}) => (
  <div>
    <Text type="secondary" style={{ fontSize: '12px', marginBottom: '8px' }}>
      ; Example queries
    </Text>
    <Space wrap>
      {exampleQueries.map((example, index) => (
        <Button
          key={index}
          size="small"
          type="text"
          onClick={() => onSelect(example)}
          style={{ fontSize: '12px' }}
        >
          {example}
        </Button>
      ))}
    </Space>
  </div>
);

/**
 * ChatInput component for message input and sending
 * @component
 */
const ChatInput = ({
  value,
  onChange,
  onSend,
  isLoading,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}) => (
  <Space.Compact style={{ width: '100%' }}>
    <TextArea
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
          onSend();
        }
      }}
      disabled={isLoading}
    />
    <Button
      type="primary"
      icon={<SendOutlined />}
      onClick={onSend}
      loading={isLoading}
      disabled={isLoading}
      style={{
        borderRadius: '0 20px 20px 0',
        height: 'auto',
        padding: '0 16px',
      }}
    />
  </Space.Compact>
);

/**
 * Main chat page component
 * @component
 */
export default function ChatPage() {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

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

  const hasUserMessages = messages.some((m) => m.sender === 'user');

  return (
    <div className="flex h-full flex-col gap-4">
      <PageTitle title="Natural Language Query" />

      {/* Chat Messages */}
      <div className="scrollbar-hide flex-1 overflow-y-auto rounded-lg border border-gray-200 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="h-min">
        <div className="!mx-auto !max-w-4xl">
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              isLoading={isLoading}
            />

            {!hasUserMessages && <ExampleQueries onSelect={setInputValue} />}
          </Space>
        </div>
      </div>
    </div>
  );
}
