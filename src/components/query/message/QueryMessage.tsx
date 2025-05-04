'use client';
import { Message, MessageSender } from '@/types/message';
import { UserMessage, BotMessage } from '@/components/query/message/ui';

export interface ChatMessageProps {
  message: Message;
}

export default function QueryMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === MessageSender.USER;
  return (
    <div className="flex w-full">
      {isUser ? (
        <div className="flex w-max grow items-start justify-end gap-2">
          <UserMessage message={message} />
        </div>
      ) : (
        <div className="flex w-max max-w-[75%] grow items-start justify-start gap-2">
          <BotMessage message={message} />
        </div>
      )}
    </div>
  );
}
