'use client';
import { Button, Space } from 'antd';
import Text from 'antd/es/typography/Text';

export interface ExampleQueriesProps {
  onSelect: (query: string) => void;
}

export const exampleQueries = [
  'Which components logged the most events from 01/01/2017 to 01/01/2018.',
  'Show me the count of errors per application from 01/01/2017 to 01/01/2018 as a bar chart',
];

export default function ExampleQueries({ onSelect }: ExampleQueriesProps) {
  return (
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
}
