'use client';

import { Input, Button, Typography, Avatar, Space, Card } from 'antd';
import {
  SendOutlined,
  UserOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import PageTitle from '@/components/common/PageTitle';
import { Line, Bar, Pie } from '@ant-design/plots';
import { useSendChatMessageMutation } from '@/store/api/chatApi';
import { Message, ChartData, NLVResponse, ChartType } from '@/types/chat';

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Example queries to help users get started
 * @constant
 */
const exampleQueries = [
  'Which components logged the most events from 01/01/2017 to 01/01/2018.',
  'Show me the count of errors per application from 01/01/2017 to 01/01/2018 as a bar chart',
];

/**
 * Chart component for visualizing data
 * @component
 */
const ChartVisualization = ({ data }: { data: ChartData }) => {
  if (!data) return null;

  const chartProps = {
    data: data.data,
    ...data.config,
  };

  switch (data.type) {
    case 'line':
      return <Line {...chartProps} />;
    case 'bar':
      return <Bar {...chartProps} />;
    case 'pie':
      return <Pie {...chartProps} />;
    default:
      return null;
  }
};

/**
 * ChatMessage component for displaying individual messages
 * @component
 */
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`!flex w-full ${isUser ? '!justify-end' : '!justify-start'}`}
    >
      <div className="!flex !max-w-4xl !grow !items-start !gap-3">
        {!isUser && (
          <Avatar
            icon={<ThunderboltOutlined className="!text-blue-600" />}
            style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0' }}
          />
        )}
        <Card
          style={{
            background: isUser ? '#1890ff' : '#f5f5f5',
            borderRadius: '12px',
            width: '100%',
            minWidth: '600px',
          }}
        >
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
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
            {!isUser && message.data && (
              <div className="mt-4 w-full">
                <div className="mb-2">
                  <Text strong>{message.data.title}</Text>
                </div>
                <div
                  className="w-full"
                  style={{ height: '300px', minWidth: '500px' }}
                >
                  <ChartVisualization data={message.data} />
                </div>
                {message.nlvResponse?.interpretedQuery && (
                  <div className="mb-2 text-sm text-gray-500">
                    Time Range:{' '}
                    {new Date(
                      message.nlvResponse.interpretedQuery.time_range.start,
                    ).toLocaleString()}{' '}
                    -{' '}
                    {new Date(
                      message.nlvResponse.interpretedQuery.time_range.end,
                    ).toLocaleString()}
                  </div>
                )}
              </div>
            )}
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
            icon={<UserOutlined className="!text-gray-600" />}
            style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0' }}
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
      Example queries
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

const convertNLVResponseToChartData = (
  nlvResponse: NLVResponse,
): ChartData | undefined => {
  if (!nlvResponse.data || !nlvResponse.columns) return undefined;
  const type = nlvResponse.interpretedQuery?.visualization_hint as ChartType;

  // For timeseries data
  if (nlvResponse.resultType === 'timeseries') {
    const timeIndex = nlvResponse.columns.indexOf('timestamp');
    const valueIndex = nlvResponse.columns.indexOf('value');
    const componentIndex = nlvResponse.columns.indexOf('component');

    // If we have component data, aggregate it into a bar chart
    if (componentIndex !== -1) {
      // Aggregate values by component
      const componentTotals = nlvResponse.data.reduce(
        (acc: Record<string, number>, row: unknown[]) => {
          const component = row[componentIndex] as string;
          const value = row[valueIndex] as number;
          acc[component] = (acc[component] || 0) + value;
          return acc;
        },
        {},
      );

      // Sort components by total count
      const sortedComponents = Object.entries(componentTotals)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10); // Show top 10 components

      return {
        type: type,
        title: nlvResponse.originalQuery,
        data: sortedComponents.map(([component, count]) => ({
          component,
          count,
        })),
        config: {
          xField: 'component',
          yField: 'count',
          label: {
            position: 'top',
            style: {
              fontSize: 12,
            },
          },
          meta: {
            count: {
              alias: 'Number of Events',
            },
            component: {
              alias: 'Component',
            },
          },
        },
      };
    }

    // For regular timeseries data
    if (timeIndex !== -1 && valueIndex !== -1) {
      const groupByIndex = nlvResponse.columns.findIndex(
        (col: string) => col !== 'timestamp' && col !== 'value',
      );

      return {
        type: type,
        title: nlvResponse.originalQuery,
        data: nlvResponse.data.map((row: unknown[]) => ({
          time: new Date(row[timeIndex] as number).toLocaleTimeString(),
          value: row[valueIndex] as number,
          ...(groupByIndex !== -1 && {
            [nlvResponse.columns![groupByIndex]]: row[groupByIndex],
          }),
        })),
        config: {
          xField: 'time',
          yField: 'value',
          ...(groupByIndex !== -1 && {
            seriesField: nlvResponse.columns![groupByIndex],
          }),
          smooth: true,
        },
      };
    }
  }

  // For log list data
  if (nlvResponse.resultType === 'log_list') {
    const levelIndex = nlvResponse.columns.indexOf('level');
    if (levelIndex === -1) return undefined;

    const levelCounts = nlvResponse.data.reduce(
      (acc: Record<string, number>, row: unknown[]) => {
        const level = row[levelIndex] as string;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      },
      {},
    );

    return {
      type: type,
      title: 'Log Level Distribution',
      data: Object.entries(levelCounts).map(([level, count]) => ({
        level,
        count: count as number,
      })),
      config: {
        angleField: 'count',
        colorField: 'level',
      },
    };
  }

  // For other data types, create a bar chart
  if (!nlvResponse.columns || nlvResponse.columns.length < 2) return undefined;

  return {
    type: type,
    title: nlvResponse.originalQuery,
    data: nlvResponse.data.map((row: unknown[]) => {
      const obj: Record<string, unknown> = {};
      nlvResponse.columns?.forEach((col: string, i: number) => {
        obj[col] = row[i];
      });
      return obj;
    }),
    config: {
      xField: nlvResponse.columns[0],
      yField: nlvResponse.columns[1],
    },
  };
};

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();

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

    try {
      const response = await sendChatMessage(inputValue).unwrap();
      const chartData = convertNLVResponseToChartData(response);

      const botResponse: Message = {
        id: messages.length + 2,
        content:
          response.errorMessage ||
          `Here's the analysis for: "${response.originalQuery}"`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        data: chartData,
        nlvResponse: response,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        content: 'Sorry, I encountered an error while processing your request.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const hasUserMessages = messages.some((m) => m.sender === 'user');

  return (
    <div className="flex h-full flex-col gap-4 px-8">
      <PageTitle title="Natural Language Query" />

      {/* Chat Messages */}
      <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-4">
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
