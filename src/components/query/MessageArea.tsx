'use client';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/hooks/hook';
import { selectMessages } from '@/store/slices/querySlice';
import { QueryMessage } from '@/components/query/message';

export default function MessageArea() {
  const messages = useAppSelector(selectMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-200 p-4">
      {messages.map((message, index) => (
        <QueryMessage key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
