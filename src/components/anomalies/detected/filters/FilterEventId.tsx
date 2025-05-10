'use client';
import { useAppSelector, useAppDispatch } from '@/hooks/hook';
import {
  selectFilters,
  selectUniqueValues,
  setFilters,
} from '@/store/slices/anomalySlice';
import { Select } from 'antd';

export default function FilterEventId() {
  const dispatch = useAppDispatch();
  const eventIdFilter = useAppSelector(selectFilters).eventIdFilter;
  const eventIds = useAppSelector(selectUniqueValues).eventIds;

  const handleEventIdFilter = (value: string) => {
    dispatch(setFilters({ field: 'eventIdFilter', value }));
  };

  return (
    <Select
      value={eventIdFilter}
      onChange={handleEventIdFilter}
      style={{ width: '100%' }}
    >
      <Select.Option value="all">All Events</Select.Option>
      {eventIds.map((id) => (
        <Select.Option key={id} value={id}>
          {id}
        </Select.Option>
      ))}
    </Select>
  );
}
