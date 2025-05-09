'use client';
import { Button, Card, Space } from 'antd';
import { useState } from 'react';
import { useSendQueryMessageMutation } from '@/store/api/queryApi';
import { useAppSelector, useAppDispatch } from '@/hooks/hook';
import {
  addUserMessage,
  selectHasUserMessages,
  addBotMessage,
  addBotErrorMessage,
  selectConversation,
} from '@/store/slices/querySlice';
import { ExampleQueries, QueryInput } from '@/components/query/message';
import {
  clearConversation,
  selectConversationMessage,
} from '@/store/slices/querySlice';
import { CloseOutlined } from '@ant-design/icons';
import Paragraph from 'antd/es/typography/Paragraph';

export default function QueryInputArea() {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState<string>('');
  const [sendQueryMessage, { isLoading }] = useSendQueryMessageMutation();
  const { conversationId } = useAppSelector(selectConversation);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    dispatch(addUserMessage(query));
    setQuery('');

    const res = await sendQueryMessage({
      conversationId:
        conversationId !== undefined && conversationId !== 'conversationId'
          ? conversationId
          : undefined,
      query,
    });
    if (res.error) {
      dispatch(addBotErrorMessage);
    } else {
      const resData = res.data;
      dispatch(addBotMessage(resData));
      dispatch(clearConversation());
    }
  };

  const hasUserMessages = useAppSelector(selectHasUserMessages);
  return (
    <div className="h-min">
      <div className="!mx-auto !max-w-4xl">
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <ConversationReply />
          <QueryInput
            value={query}
            onChange={setQuery}
            onSend={handleSend}
            isLoading={isLoading}
          />
          {!hasUserMessages && <ExampleQueries onSelect={setQuery} />}
        </Space>
      </div>
    </div>
  );
}

const ConversationReply = () => {
  const dispatch = useAppDispatch();
  const conversationMessage = useAppSelector(selectConversationMessage);
  return (
    <>
      {conversationMessage && (
        <Card>
          <div className="flex items-center justify-between">
            <Paragraph style={{ margin: 0 }} ellipsis>
              <span className="font-bold text-black">Reply: </span>
              {conversationMessage.content}
            </Paragraph>
            <Button
              type="text"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => dispatch(clearConversation())}
            />
          </div>
        </Card>
      )}
    </>
  );
};
