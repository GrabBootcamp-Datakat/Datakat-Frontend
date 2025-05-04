'use client';
import { Button, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

export interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export default function QueryInput(props: QueryInputProps) {
  const { value, onChange, onSend, isLoading } = props;
  return (
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
}
