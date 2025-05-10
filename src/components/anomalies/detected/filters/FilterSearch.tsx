'use client';
import { SearchOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { setFilters, selectFilters } from '@/store/slices/anomalySlice';
import { Input } from 'antd';

export default function FilterSearch() {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectFilters).search;

  const handleSearch = (value: string) => {
    dispatch(setFilters({ field: 'search', value }));
  };

  return (
    <Input
      prefix={<SearchOutlined />}
      placeholder="Search in content, component, or event ID"
      value={search}
      onChange={(e) => handleSearch(e.target.value)}
      style={{ marginTop: 8 }}
    />
  );
}
