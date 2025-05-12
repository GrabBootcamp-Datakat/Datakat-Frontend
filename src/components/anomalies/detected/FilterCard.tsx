'use client';
import { Card, Space, Button } from 'antd';
import {
  FilterSearch,
  FilterEventId,
  FilterLevel,
  FilterComponent,
} from './filters';
import { useAppDispatch } from '@/hooks/hook';
import {
  resetFilters,
  resetGroupedAnomalies,
} from '@/store/slices/anomalySlice';

export default function FilterCard() {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(resetGroupedAnomalies());
  };

  return (
    <Card
      title="Filter"
      extra={
        <Button type="link" onClick={handleReset}>
          Reset Filters
        </Button>
      }
    >
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
