'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectDateRange,
  selectFilters,
  setFilters,
} from '@/store/slices/anomalySlice';
import { useGetDistinctComponentsQuery } from '@/store/api/anomalyApi';
import { useCallback, useMemo } from 'react';

export default function FilterComponent() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const dateRange = useAppSelector(selectDateRange);

  // Fetch distinct components
  const { data: componentsData } = useGetDistinctComponentsQuery({
    start_time: dateRange[0],
    end_time: dateRange[1],
  });

  const handleChange = useCallback(
    (value: string) => {
      dispatch(setFilters({ field: 'component', value }));
    },
    [dispatch],
  );

  const uniqueOptions = useMemo(() => {
    return [
      {
        value: 'all',
        label: 'All Components',
      },
      ...[...new Set(componentsData?.values || [])].map((component) => ({
        value: component,
        label: component,
      })),
    ];
  }, [componentsData]);

  return (
    <Select
      value={filters.component}
      onChange={handleChange}
      options={uniqueOptions}
      style={{ width: '100%' }}
      placeholder="Select Component"
    />
  );
}
