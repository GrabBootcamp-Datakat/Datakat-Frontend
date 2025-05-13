'use client';
import { Typography, Tag } from 'antd';
import { AnomalyGroupResponse } from '../../types';
import { useState } from 'react';
interface ContentGroupHeaderProps {
  group: AnomalyGroupResponse;
}

export function ContentGroupHeader({ group }: ContentGroupHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mb-4">
      <Typography.Title
        level={4}
        copyable
        ellipsis={{
          rows: 3,
          expandable: 'collapsible',
          expanded,
          onExpand: (_, info) => setExpanded(info.expanded),
        }}
      >
        {group.items[0]?.content || 'Unknown Content'}
      </Typography.Title>
      <div className="flex flex-wrap gap-2">
        <Tag color="blue">{group.count} occurrences</Tag>
        <Tag color="purple">Event ID: {group.event_id}</Tag>
        <Tag color="green">
          First: {new Date(group.first_occurrence).toLocaleString()}
        </Tag>
      </div>
    </div>
  );
}
