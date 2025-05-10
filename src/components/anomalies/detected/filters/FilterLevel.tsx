'use client';
import { useAppSelector, useAppDispatch } from '@/hooks/hook';
import {
  selectFilters,
  selectUniqueValues,
  setFilters,
} from '@/store/slices/anomalySlice';
import { Select } from 'antd';

export default function FilterLevel() {
  const dispatch = useAppDispatch();
  const levelFilter = useAppSelector(selectFilters).levelFilter;
  const levels = useAppSelector(selectUniqueValues).levels;

  const handleLevelFilter = (value: string) => {
    dispatch(setFilters({ field: 'levelFilter', value }));
  };

  return (
    <Select
      value={levelFilter}
      onChange={handleLevelFilter}
      style={{ width: '100%' }}
    >
      <Select.Option value="all">All Levels</Select.Option>
      {levels.map((level) => (
        <Select.Option key={level} value={level}>
          {level}
        </Select.Option>
      ))}
    </Select>
  );
}
