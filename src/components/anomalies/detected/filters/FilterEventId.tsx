'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectFilters,
  setFilters,
  resetGroupedAnomalies,
} from '@/store/slices/anomalySlice';
import { useGetDistinctEventIdsQuery } from '@/store/api/anomalyApi';
import { useCallback } from 'react';

export default function FilterEventId() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  // Fetch distinct event IDs
  const { data: eventIdsData } = useGetDistinctEventIdsQuery({
    start_time: 'now-24h',
    end_time: 'now',
  });

  const handleChange = useCallback(
    (value: string) => {
      dispatch(setFilters({ field: 'eventIdFilter', value }));
      dispatch(resetGroupedAnomalies());
    },
    [dispatch],
  );

  const options = [
    { value: 'all', label: 'All Event IDs' },
    ...(eventIdsData?.values || []).map((id) => ({
      value: id,
      label: id,
    })),
  ];

  return (
    <Select
      value={filters.eventIdFilter}
      onChange={handleChange}
      options={options}
      style={{ width: '100%' }}
      placeholder="Select Event ID"
    />
  );
}
