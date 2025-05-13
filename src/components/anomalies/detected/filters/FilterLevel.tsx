'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectDateRange,
  selectFilters,
  setFilters,
} from '@/store/slices/anomalySlice';
import { useGetDistinctLevelsQuery } from '@/store/api/anomalyApi';
import { useCallback, useMemo } from 'react';

export default function FilterLevel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const dateRange = useAppSelector(selectDateRange);

  // Fetch distinct levels
  const { data: levelsData } = useGetDistinctLevelsQuery({
    start_time: dateRange[0],
    end_time: dateRange[1],
  });

  const handleChange = useCallback(
    (value: string) => {
      dispatch(setFilters({ field: 'level', value }));
    },
    [dispatch],
  );

  const uniqueOptions = useMemo(() => {
    return [
      {
        value: 'all',
        label: 'All Levels',
      },
      ...[...new Set(levelsData?.values || [])].map((level) => ({
        value: level,
        label: level,
      })),
    ];
  }, [levelsData]);

  return (
    <Select
      value={filters.level}
      onChange={handleChange}
      options={uniqueOptions}
      style={{ width: '100%' }}
      placeholder="Select Level"
    />
  );
}
