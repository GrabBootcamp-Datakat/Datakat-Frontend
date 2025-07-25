import { Space, Card } from 'antd';
import { BotAvatar } from './Avatar';
import { Message } from '@/types/message';
import VisualizeQuery from '../visualizations/VisualizeQuery';
import Text from 'antd/es/typography/Text';

export interface MessageProps {
  message: Message;
}

export const UserMessage = (props: MessageProps) => {
  const { message } = props;
  return (
    <Card style={{ background: '#1890ff', maxWidth: 'max-content' }}>
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <Text
          style={{
            color: '#fff',
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
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          {message.timestamp}
        </Text>
      </Space>
    </Card>
  );
};

export const BotMessage = (props: MessageProps) => {
  const { message } = props;

  return (
    <>
      <BotAvatar />
      <Card style={{ width: 'max-content', maxWidth: '100%' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text
            style={{
              color: 'inherit',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </Text>
          {message.nlvQueryResponse?.data && (
            <div className="w-full">
              <VisualizeQuery nlvQueryResponse={message.nlvQueryResponse} />
              {message.nlvQueryResponse?.interpretedQuery && (
                <div className="mt-2 text-sm text-gray-500">
                  Time Range:{' '}
                  {new Date(
                    message.nlvQueryResponse.interpretedQuery.time_range.start,
                  ).toLocaleString()}{' '}
                  -{' '}
                  {new Date(
                    message.nlvQueryResponse.interpretedQuery.time_range.end,
                  ).toLocaleString()}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Text
              type="secondary"
              style={{
                fontSize: '12px',
                color: 'inherit',
              }}
            >
              {message.timestamp}
            </Text>
          </div>
        </Space>
      </Card>
    </>
  );
};
