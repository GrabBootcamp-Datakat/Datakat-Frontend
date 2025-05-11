'use client';
import { useMemo } from 'react';
import { Card, Select, Space, DatePicker } from 'antd';
import { MetricName, TimeInterval, GroupBy } from '@/types/metrics';
import { useGetApplicationsQuery } from '@/store/api/metricsApi';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectDateRange,
  selectSelectedApplications,
  selectSelectedGroupBy,
  selectSelectedInterval,
  selectSelectedMetric,
  setDateRange,
  setSelectedApplications,
  setSelectedGroupBy,
  setSelectedInterval,
  setSelectedMetric,
} from '@/store/slices/metricsSlice';

const { RangePicker } = DatePicker;

export default function MetricsFilters() {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector(selectDateRange);
  const selectedApplications = useAppSelector(selectSelectedApplications);
  const selectedMetric = useAppSelector(selectSelectedMetric);
  const selectedInterval = useAppSelector(selectSelectedInterval);
  const selectedGroupBy = useAppSelector(selectSelectedGroupBy);
  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useGetApplicationsQuery({
      startTime: dateRange[0],
      endTime: dateRange[1],
    });

  // Convert ISO strings to dayjs objects for the DatePicker
  const dateRangeValue = useMemo(
    () =>
      [dayjs(dateRange[0]), dayjs(dateRange[1])] as [dayjs.Dayjs, dayjs.Dayjs],
    [dateRange],
  );

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <RangePicker
            value={dateRangeValue}
            onChange={(dates) => {
              console.log('dates', dates);
              if (dates) {
                const [start, end] = dates;
                dispatch(
                  setDateRange([
                    dayjs(start).toISOString(),
                    dayjs(end).toISOString(),
                  ]),
                );
              }
            }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            needConfirm={false}
            allowClear={false}
          />
          <Select
            mode="multiple"
            value={selectedApplications}
            onChange={(apps) => dispatch(setSelectedApplications(apps))}
            style={{ width: 300 }}
            placeholder="Select applications"
            allowClear
            loading={isApplicationsLoading}
          >
            {applicationsData?.applications?.map((app) => (
              <Select.Option key={app} value={app}>
                {app}
              </Select.Option>
            )) || []}
          </Select>
          <Select
            value={selectedMetric}
            onChange={(metric) => dispatch(setSelectedMetric(metric))}
            style={{ width: 150 }}
          >
            <Select.Option value={MetricName.LOG_EVENT}>
              Log Events
            </Select.Option>
            <Select.Option value={MetricName.ERROR_EVENT}>
              Error Events
            </Select.Option>
          </Select>
          <Select
            value={selectedInterval}
            onChange={(interval) => dispatch(setSelectedInterval(interval))}
            style={{ width: 150 }}
          >
            <Select.Option value={TimeInterval.ONE_MINUTE}>
              1 Minute
            </Select.Option>
            <Select.Option value={TimeInterval.FIVE_MINUTES}>
              5 Minutes
            </Select.Option>
            <Select.Option value={TimeInterval.TEN_MINUTES}>
              10 Minutes
            </Select.Option>
            <Select.Option value={TimeInterval.THIRTY_MINUTES}>
              30 Minutes
            </Select.Option>
            <Select.Option value={TimeInterval.ONE_HOUR}>1 Hour</Select.Option>
            <Select.Option value={TimeInterval.ONE_DAY}>1 Day</Select.Option>
          </Select>
          <Select
            value={selectedGroupBy}
            onChange={(groupBy) => dispatch(setSelectedGroupBy(groupBy))}
            style={{ width: 150 }}
          >
            <Select.Option value={GroupBy.TOTAL}>Total</Select.Option>
            <Select.Option value={GroupBy.LEVEL}>Level</Select.Option>
            <Select.Option value={GroupBy.COMPONENT}>Component</Select.Option>
            <Select.Option value={GroupBy.ERROR_KEY}>Error Key</Select.Option>
            <Select.Option value={GroupBy.APPLICATION}>
              Application
            </Select.Option>
          </Select>
        </Space>
      </Space>
    </Card>
  );
}
