'use client';
import { Card, Space, Button } from 'antd';
import {
  FilterSearch,
  FilterEventId,
  FilterLevel,
  // FilterComponent,
} from './filters';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { resetFilters, selectFilters } from '@/store/slices/anomalySlice';
import { ReloadOutlined } from '@ant-design/icons';

const initialFilters = {
  search: '',
  eventId: 'all',
  level: 'all',
  component: 'all',
};

export default function FilterCard() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  const handleReset = () => {
    if (JSON.stringify(filters) !== JSON.stringify(initialFilters)) {
      dispatch(resetFilters());
    }
  };

  return (
    <Card
      title="Filter"
      extra={
        <Button
          type="link"
          size="small"
          icon={<ReloadOutlined />}
          onClick={handleReset}
        >
          Reset
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
          {/* <div className="grow">
            <FilterComponent />
          </div> */}
        </div>
      </Space>
    </Card>
  );
}
