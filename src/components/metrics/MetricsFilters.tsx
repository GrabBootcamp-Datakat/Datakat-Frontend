'use client';
import { Card, Select, Space, DatePicker } from 'antd';
import { MetricName, TimeInterval } from '@/types/metrics';
import dayjs from 'dayjs';
import { useGetApplicationsQuery } from '@/store/api/metricsApi';

const { RangePicker } = DatePicker;

interface MetricsFiltersProps {
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  setDateRange: (dates: [dayjs.Dayjs, dayjs.Dayjs]) => void;
  selectedApplications: string[];
  setSelectedApplications: (apps: string[]) => void;
  selectedMetric: MetricName;
  setSelectedMetric: (metric: MetricName) => void;
  selectedInterval: TimeInterval;
  setSelectedInterval: (interval: TimeInterval) => void;
}

export default function MetricsFilters({
  dateRange,
  setDateRange,
  selectedApplications,
  setSelectedApplications,
  selectedMetric,
  setSelectedMetric,
  selectedInterval,
  setSelectedInterval,
}: MetricsFiltersProps) {
  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useGetApplicationsQuery({
      startTime: dateRange[0].toISOString(),
      endTime: dateRange[1].toISOString(),
    });

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space wrap>
          <RangePicker
            value={dateRange}
            onChange={(dates) =>
              dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
            }
            showTime
            format="YYYY-MM-DD HH:mm:ss"
          />
          <Select
            mode="multiple"
            value={selectedApplications}
            onChange={setSelectedApplications}
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
            onChange={setSelectedMetric}
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
            onChange={setSelectedInterval}
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
        </Space>
      </Space>
    </Card>
  );
}
