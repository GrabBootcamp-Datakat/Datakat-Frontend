'use client';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectFilters,
  selectUniqueValues,
  setFilters,
} from '@/store/slices/anomalySlice';
import { Select } from 'antd';

export default function FilterComponent() {
  const dispatch = useAppDispatch();
  const componentFilter = useAppSelector(selectFilters).componentFilter;
  const components = useAppSelector(selectUniqueValues).components;

  const handleComponentFilter = (value: string) => {
    dispatch(setFilters({ field: 'componentFilter', value }));
  };

  return (
    <Select
      value={componentFilter}
      onChange={handleComponentFilter}
      style={{ width: '100%' }}
    >
      <Select.Option value="all">All Components</Select.Option>
      {components.map((component) => (
        <Select.Option key={component} value={component}>
          {component}
        </Select.Option>
      ))}
    </Select>
  );
}
