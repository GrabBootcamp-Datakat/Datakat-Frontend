'use client';
import { Space } from 'antd';
import { useState } from 'react';
import { useSendQueryMessageMutation } from '@/store/api/queryApi';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/hook';
import {
  addUserMessage,
  selectHasUserMessages,
  addBotMessage,
  addBotErrorMessage,
} from '@/store/slices/querySlice';
import { ExampleQueries, QueryInput } from '@/components/query/message';

export default function QueryInputArea() {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState('');
  const [sendQueryMessage, { isLoading }] = useSendQueryMessageMutation();

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    dispatch(addUserMessage(inputValue));
    setInputValue('');

    const res = await sendQueryMessage(inputValue);
    if (res.error) {
      dispatch(addBotErrorMessage);
    } else {
      const resData = res.data;
      dispatch(addBotMessage(resData));
    }
  };

  const hasUserMessages = useAppSelector(selectHasUserMessages);
  return (
    <div className="h-min">
      <div className="!mx-auto !max-w-4xl">
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <QueryInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            isLoading={isLoading}
          />
          {hasUserMessages && <ExampleQueries onSelect={setInputValue} />}
        </Space>
      </div>
    </div>
  );
}
