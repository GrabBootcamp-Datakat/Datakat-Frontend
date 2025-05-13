'use client';
import { Card, Input, Select, Space, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { LogLevel } from '@/types/logs';
import { useCallback, useMemo } from 'react';
import { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  setSearchQuery,
  setlevel,
  setDateRange,
  selectLogsFilters,
  setApplicationFilter,
} from '@/store/slices/logsSlice';
import dayjs from 'dayjs';
import { useGetLogsApplicationsQuery } from '@/store/api/logsApi';

const { RangePicker } = DatePicker;

export default function LogFilters() {
  const dispatch = useAppDispatch();
  const { searchQuery, level, applicationFilter, dateRange } =
    useAppSelector(selectLogsFilters);

  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useGetLogsApplicationsQuery({
      startTime: dayjs(dateRange[0]).toISOString(),
      endTime: dayjs(dateRange[1]).toISOString(),
    });

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

  const handlelevelChange = useCallback(
    (value: LogLevel[]) => {
      dispatch(setlevel(value));
    },
    [dispatch],
  );

  const handleApplicationChange = useCallback(
    (value: string[]) => {
      dispatch(setApplicationFilter(value));
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
              value={level}
              onChange={handlelevelChange}
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
              value={applicationFilter}
              onChange={handleApplicationChange}
              style={{ width: 200 }}
              placeholder="Select applications"
              allowClear
              loading={isApplicationsLoading}
            >
              {applicationsData?.applications.map((application) => (
                <Select.Option key={application} value={application}>
                  {application}
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
