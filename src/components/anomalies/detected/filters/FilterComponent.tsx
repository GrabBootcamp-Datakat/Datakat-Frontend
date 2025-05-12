'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectFilters,
  setFilters,
  resetGroupedAnomalies,
} from '@/store/slices/anomalySlice';
import { useGetDistinctComponentsQuery } from '@/store/api/anomalyApi';
import { useCallback } from 'react';

export default function FilterComponent() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  // Fetch distinct components
  const { data: componentsData } = useGetDistinctComponentsQuery({
    start_time: 'now-24h',
    end_time: 'now',
  });

  const handleChange = useCallback(
    (value: string) => {
      dispatch(setFilters({ field: 'componentFilter', value }));
      dispatch(resetGroupedAnomalies());
    },
    [dispatch],
  );

  const options = [
    { value: 'all', label: 'All Components' },
    ...(componentsData?.values || []).map((component: string) => ({
      value: component,
      label: component,
    })),
  ];

  return (
    <Select
      value={filters.componentFilter}
      onChange={handleChange}
      options={options}
      style={{ width: '100%' }}
      placeholder="Select Component"
    />
  );
}
