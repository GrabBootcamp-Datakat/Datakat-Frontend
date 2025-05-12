'use client';
import {
  Drawer,
  Input,
  Select,
  Typography,
  Spin,
  Alert,
  DatePicker,
} from 'antd';
import { SendOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';
import { MetricName } from '@/types/metrics';
import { useAppDispatch } from '@/hooks/hook';
import {
  setApplicationDistribution,
  setComponentDistribution,
  setLogLevelOverview,
} from '@/store/slices/dashboardSlice';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface AISuggestion {
  metricName?: MetricName;
  applications?: string[];
  startTime?: string;
  endTime?: string;
}

interface CustomizationDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  currentSettings: {
    metricName: MetricName;
    startTime: string;
    endTime: string;
    applications?: string[];
  };
  type: 'application' | 'component' | 'logLevel';
  availableApplications?: string[];
}

export default function CustomizationDrawer({
  open,
  onClose,
  title,
  currentSettings,
  type,
  availableApplications,
}: CustomizationDrawerProps) {
  const dispatch = useAppDispatch();
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const getAction = () => {
    switch (type) {
      case 'application':
        return setApplicationDistribution;
      case 'component':
        return setComponentDistribution;
      case 'logLevel':
        return setLogLevelOverview;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  const handleTimeRangeChange: RangePickerProps['onChange'] = (dates) => {
    if (dates && dates[0] && dates[1]) {
      const [start, end] = dates;
      dispatch(
        getAction()({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        }),
      );
    }
  };

  const handleMetricChange = (value: MetricName) => {
    dispatch(
      getAction()({
        metricName: value,
      }),
    );
  };

  const handleApplicationsChange = (value: string[]) => {
    if (type === 'logLevel') {
      dispatch(
        getAction()({
          applications: value,
        }),
      );
    }
  };

  const processGeminiQuery = async (query: string) => {
    if (!query.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a log metrics assistant. Help modify the ${type} visualization parameters based on the user's request.
                Current settings:
                - Metric: ${currentSettings.metricName}
                ${type === 'logLevel' ? `- Applications: ${(currentSettings.applications || []).join(', ') || 'All'}` : ''}
                - Time range: ${dayjs(currentSettings.startTime).format()} to ${dayjs(currentSettings.endTime).format()}
                
                Available metrics: ${Object.values(MetricName).join(', ')}
                ${availableApplications ? `Available applications: ${availableApplications.join(', ')}` : ''}
                
                User request: "${query}"
                
                Respond with a JSON object that ONLY includes the parameters that need to change.
                Valid parameters are:
                - metricName: one of ${Object.values(MetricName).join(', ')}
                ${type === 'logLevel' ? '- applications: array of application names from the available list (e.g. ["app1", "app2"])' : ''}
                - startTime: ISO date string (e.g. "2024-03-20T00:00:00Z")
                - endTime: ISO date string (e.g. "2024-03-20T00:00:00Z")
                
                Example responses:
                For "show last 24 hours": {"startTime": "2024-03-19T00:00:00Z", "endTime": "2024-03-20T00:00:00Z"}
                For "show error logs": {"metricName": "LOG_ERROR"}
                ${type === 'logLevel' ? `For "show first application": {"applications": ["${availableApplications?.[0] || ''}"]}` : ''}`,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data: GeminiResponse = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const responseText = data.candidates[0].content.parts[0].text.trim();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          setAiSuggestion('Invalid response format. Please try again.');
          return;
        }

        try {
          const suggestion: AISuggestion = JSON.parse(jsonMatch[0]);

          // Validate the suggestion
          if (
            suggestion.metricName &&
            !Object.values(MetricName).includes(suggestion.metricName)
          ) {
            setAiSuggestion(
              'Invalid metric name in suggestion. Please try again.',
            );
            return;
          }

          if (suggestion.applications && availableApplications) {
            const invalidApps = suggestion.applications.filter(
              (app) => !availableApplications.includes(app),
            );
            if (invalidApps.length > 0) {
              setAiSuggestion(
                `Invalid applications in suggestion: ${invalidApps.join(', ')}. Available apps: ${availableApplications.join(', ')}`,
              );
              return;
            }
          }

          if (suggestion.startTime && !dayjs(suggestion.startTime).isValid()) {
            setAiSuggestion(
              'Invalid start time in suggestion. Please try again.',
            );
            return;
          }

          if (suggestion.endTime && !dayjs(suggestion.endTime).isValid()) {
            setAiSuggestion(
              'Invalid end time in suggestion. Please try again.',
            );
            return;
          }

          dispatch(getAction()(suggestion));
          setAiSuggestion(JSON.stringify(suggestion, null, 2));
        } catch (parseError) {
          console.warn('Failed to parse AI suggestion:', parseError);
          setAiSuggestion('Could not parse the AI response. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error processing Gemini query:', error);
      setAiSuggestion('Error processing your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      processGeminiQuery(chatInput);
    }
  };

  return (
    <Drawer
      title={`Customize ${title}`}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="space-y-4">
          <div>
            <Text strong>Metric Type</Text>
            <Select
              className="mt-1 w-full"
              value={currentSettings.metricName}
              onChange={handleMetricChange}
              options={Object.values(MetricName).map((name) => ({
                label: name.replace('_', ' ').toUpperCase(),
                value: name,
              }))}
            />
          </div>

          {type === 'logLevel' && (
            <div>
              <Text strong>Applications</Text>
              <Select
                className="mt-1 w-full"
                mode="multiple"
                placeholder="Select applications"
                value={currentSettings.applications}
                onChange={handleApplicationsChange}
                options={availableApplications?.map((app) => ({
                  label: app,
                  value: app,
                }))}
              />
            </div>
          )}

          <div>
            <Text strong>Time Range</Text>
            <RangePicker
              className="mt-1 w-full"
              showTime
              value={[
                dayjs(currentSettings.startTime),
                dayjs(currentSettings.endTime),
              ]}
              onChange={handleTimeRangeChange}
              presets={[
                {
                  label: 'Last 1h',
                  value: [dayjs().subtract(1, 'hour'), dayjs()],
                },
                {
                  label: 'Last 24h',
                  value: [dayjs().subtract(24, 'hour'), dayjs()],
                },
                {
                  label: 'Last 7d',
                  value: [dayjs().subtract(7, 'day'), dayjs()],
                },
                {
                  label: 'Last 30d',
                  value: [dayjs().subtract(30, 'day'), dayjs()],
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-4 flex-1">
          <Text strong>AI Assistant</Text>
          <div className="mt-2 space-y-2">
            <Input
              placeholder="Ask AI to help customize the visualization... (Press Enter to submit)"
              value={chatInput}
              onChange={handleChatInputChange}
              onPressEnter={handleChatSubmit}
              prefix={<ThunderboltOutlined />}
              suffix={
                isProcessing ? (
                  <Spin size="small" />
                ) : (
                  <SendOutlined className="text-gray-400" />
                )
              }
            />
            {aiSuggestion && (
              <Alert
                type="info"
                message="AI Suggestion"
                description={
                  <pre className="mt-1 text-xs whitespace-pre-wrap">
                    {aiSuggestion}
                  </pre>
                }
              />
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
