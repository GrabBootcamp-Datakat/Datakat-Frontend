'use client';
import { Card, Space } from 'antd';
import {
  FilterSearch,
  FilterEventId,
  FilterLevel,
  FilterComponent,
} from './filters';

export default function FilterCard() {
  return (
    <Card title="Filter">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <FilterSearch />
        <div className="flex flex-wrap gap-2">
          <div className="flex-[1]">
            <FilterEventId />
          </div>
          <div className="flex-[1]">
            <FilterLevel />
          </div>
          <div className="grow">
            <FilterComponent />
          </div>
        </div>
      </Space>
    </Card>
  );
}
