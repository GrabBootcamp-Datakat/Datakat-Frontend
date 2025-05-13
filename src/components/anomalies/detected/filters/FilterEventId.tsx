'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectDateRange,
  selectFilters,
  setFilters,
} from '@/store/slices/anomalySlice';
import { useGetDistinctEventIdsQuery } from '@/store/api/anomalyApi';
import { useCallback, useMemo } from 'react';

export default function FilterEventId() {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector(selectDateRange);
  const filters = useAppSelector(selectFilters);

  // Fetch distinct event IDs
  const { data: eventIdsData } = useGetDistinctEventIdsQuery({
    start_time: dateRange[0],
    end_time: dateRange[1],
  });

  const handleChange = useCallback(
    (value: string) => {
      dispatch(setFilters({ field: 'eventId', value }));
    },
    [dispatch],
  );

  const uniqueOptions = useMemo(() => {
    return [
      {
        value: 'all',
        label: 'All Event IDs',
      },
      ...[...new Set(eventIdsData?.values || [])]
        .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
        .map((id) => ({
          value: id,
          label: id,
        })),
    ];
  }, [eventIdsData]);

  return (
    <Select
      value={filters.eventId}
      onChange={handleChange}
      options={uniqueOptions}
      style={{ width: '100%' }}
      placeholder="Select Event ID"
    />
  );
}
