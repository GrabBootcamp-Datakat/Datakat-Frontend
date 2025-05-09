'use client';
import { Message, MessageSender } from '@/types/message';
import {
  UserMessage,
  BotMessage,
  UserAvatar,
} from '@/components/query/message/ui';
import { Card, Button } from 'antd';
import { EnterOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/hooks/hook';
import { setConversation } from '@/store/slices/querySlice';
import { Conversation } from '@/store/slices/querySlice';
import Paragraph from 'antd/es/typography/Paragraph';

export interface ChatMessageProps {
  message: Message;
}

export default function QueryMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === MessageSender.USER;
  const messageId = message.id;
  const conversationId = message.nlvQueryResponse?.conversationId || '';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      {isUser ? (
        <div className="flex w-max max-w-[75%] grow flex-col justify-end">
          {message.nlvQueryResponse?.originalQuery && (
            <div className="flex translate-y-4 items-start justify-end gap-2">
              <ConversationCard
                messageReply={message.nlvQueryResponse?.originalQuery}
                conversationId={conversationId}
              />
              <div className="opacity-0">
                <UserAvatar />
              </div>
            </div>
          )}
          <div className="flex items-start justify-end gap-2">
            <UserMessage message={message} />
            <UserAvatar />
          </div>
        </div>
      ) : (
        <div
          id={conversationId}
          className="group flex w-max max-w-[75%] grow items-start justify-start gap-2"
        >
          <BotMessage message={message} />
          <div className="flex h-full w-max flex-col items-center justify-center opacity-0 group-hover:opacity-100">
            <ConversationIdButton
              messageId={messageId}
              conversationId={conversationId}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const ConversationCard = ({
  messageReply,
  conversationId,
}: {
  messageReply: string;
  conversationId: string;
}) => {
  return (
    <a href={`#${conversationId}`}>
      <Card style={{ maxWidth: '100%', background: '#f5f5f5' }}>
        <Paragraph type="secondary" ellipsis>
          {messageReply}
        </Paragraph>
      </Card>
    </a>
  );
};

const ConversationIdButton = ({ messageId, conversationId }: Conversation) => {
  const dispatch = useAppDispatch();
  return (
    <Button
      onClick={() => dispatch(setConversation({ messageId, conversationId }))}
      size="small"
      shape="circle"
    >
      <EnterOutlined />
    </Button>
  );
};
