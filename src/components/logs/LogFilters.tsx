'use client';
import { Card, Input, Select, Space, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { LogLevel } from '@/types/logs';
import { useCallback, useMemo } from 'react';
import { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/hook';
import {
  setSearchQuery,
  setLevelFilter,
  setServiceFilter,
  setDateRange,
} from '@/store/slices/logsSlice';
import { RootState } from '@/store/store';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export interface LogFiltersProps {
  services: string[];
}

export default function LogFilters({ services }: LogFiltersProps) {
  const dispatch = useAppDispatch();
  const {
    filters: { searchQuery, levelFilter, serviceFilter, dateRange },
  } = useAppSelector((state: RootState) => state.logs);

  // Convert ISO strings to dayjs objects for the DatePicker
  const dateRangeValue = useMemo(
    () =>
      [dayjs(dateRange[0]), dayjs(dateRange[1])] as [dayjs.Dayjs, dayjs.Dayjs],
    [dateRange],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchQuery(e.target.value));
    },
    [dispatch],
  );

  const handleLevelFilterChange = useCallback(
    (value: LogLevel[]) => {
      dispatch(setLevelFilter(value));
    },
    [dispatch],
  );

  const handleServiceFilterChange = useCallback(
    (value: string[]) => {
      dispatch(setServiceFilter(value));
    },
    [dispatch],
  );

  const handleDateRangeChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null] | null) => {
      if (dates && dates[0] && dates[1]) {
        dispatch(setDateRange([dates[0], dates[1]]));
      }
    },
    [dispatch],
  );

  return (
    <Card>
      <Card.Meta
        title="Log Filters"
        description="Filter logs by service, level, or search for specific content"
      />
      <div className="mt-4">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space wrap>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search logs..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: 300 }}
            />
            <Select
              mode="multiple"
              value={levelFilter}
              onChange={handleLevelFilterChange}
              style={{ width: 200 }}
              placeholder="Select levels"
              allowClear
            >
              {Object.values(LogLevel).map((level) => (
                <Select.Option key={level} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
            <Select
              mode="multiple"
              value={serviceFilter}
              onChange={handleServiceFilterChange}
              style={{ width: 200 }}
              placeholder="Select services"
              allowClear
            >
              {services.map((service) => (
                <Select.Option key={service} value={service}>
                  {service}
                </Select.Option>
              ))}
            </Select>
            <RangePicker
              value={dateRangeValue}
              onChange={handleDateRangeChange}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              onOk={handleDateRangeChange}
            />
          </Space>
        </Space>
      </div>
    </Card>
  );
}
