'use client';
import { Select } from 'antd';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectFilters,
  setFilters,
  resetGroupedAnomalies,
} from '@/store/slices/anomalySlice';
import { useGetDistinctLevelsQuery } from '@/store/api/anomalyApi';
import { useCallback } from 'react';

export default function FilterLevel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  // Fetch distinct levels
  const { data: levelsData } = useGetDistinctLevelsQuery({
    start_time: 'now-24h',
    end_time: 'now',
  });

  const handleChange = useCallback(
    (value: string) => {
      dispatch(setFilters({ field: 'levelFilter', value }));
      dispatch(resetGroupedAnomalies());
    },
    [dispatch],
  );

  const options = [
    { value: 'all', label: 'All Levels' },
    ...(levelsData?.values || []).map((level) => ({
      value: level,
      label: level,
    })),
  ];

  return (
    <Select
      value={filters.levelFilter}
      onChange={handleChange}
      options={options}
      style={{ width: '100%' }}
      placeholder="Select Level"
    />
  );
}
