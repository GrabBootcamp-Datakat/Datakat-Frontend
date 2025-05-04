'use client';
import { Button } from 'antd';
import { LogLevel } from '@/types/logs';

const colorMap: Record<LogLevel, string> = {
  ERROR: 'red',
  WARN: 'orange',
  INFO: 'blue',
  DEBUG: 'gray',
  UNKNOWN: 'gray',
};

export default function LogLevelBadge({ level }: { level: LogLevel }) {
  return (
    <Button
      type="text"
      size="small"
      style={{
        backgroundColor: `${colorMap[level]}1`,
        color: colorMap[level],
        border: 'none',
        borderRadius: '12px',
        padding: '0 8px',
      }}
    >
      {level}
    </Button>
  );
}
