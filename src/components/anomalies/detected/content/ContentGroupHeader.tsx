'use client';
import { ContentGroup } from '@/types/anomaly';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';

interface ContentGroupHeaderProps {
  group: ContentGroup;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export default function ContentGroupHeader(props: ContentGroupHeaderProps) {
  const { group, expanded, setExpanded } = props;
  return (
    <div>
      <Paragraph
        ellipsis={{
          rows: 2,
          expandable: 'collapsible',
          expanded,
          onExpand: (_, info) => setExpanded(info.expanded),
        }}
        copyable
      >
        {group.content ? group.content : 'Unknown Content'}
      </Paragraph>
      <Text type="secondary">Total occurrences: {group.count}</Text>
    </div>
  );
}
