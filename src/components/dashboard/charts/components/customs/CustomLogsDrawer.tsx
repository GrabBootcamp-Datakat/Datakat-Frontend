import { useEffect, useMemo, useState } from 'react';
import { SortOrder } from 'antd/es/table/interface';
import { Drawer } from 'antd';
import {
  useGetLogsApplicationsQuery,
  useGetLogsQuery,
} from '@/store/api/logsApi';
import { LogsTable } from '@/components/logs';
import { Dimension } from '@/types/metrics';
import { LogLevel, LogSearchRequest, SortBy } from '@/types/logs';
import { Card, Input, Select, Space, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface LogsDrawerProps {
  open: boolean;
  onClose: () => void;
  filterName: string;
  dimension?: Dimension;
  logsQuery?: LogSearchRequest;
}

export default function CustomLogsDrawer(props: LogsDrawerProps) {
  const { open, onClose, filterName, dimension, logsQuery } = props;
  const { startTime, endTime } = logsQuery || {};
  const [query, setQuery] = useState<string>('');
  const [levels, setLevels] = useState<LogLevel[]>([]);
  const [applications, setApplications] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs(startTime),
    dayjs(endTime),
  ]);
  const [sort, setSort] = useState<{
    sortField: SortBy;
    sortOrder: SortOrder | undefined;
  }>({
    sortField: SortBy.TIMESTAMP,
    sortOrder: 'descend',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
  });

  const dayjsDateRange = useMemo(
    () => [dayjs(startTime), dayjs(endTime)],
    [startTime, endTime],
  );

  // skip if dimension is application

  const queryParams: LogSearchRequest = useMemo(
    () => ({
      startTime: dayjsDateRange[0].toISOString(),
      endTime: dayjsDateRange[1].toISOString(),
      query:
        dimension === Dimension.APPLICATION
          ? undefined
          : `${filterName} ${query}`,
      levels,
      applications:
        dimension === Dimension.APPLICATION ? [filterName] : applications,
      sortBy: sort.sortField,
      sortOrder: (sort.sortOrder === 'ascend' ? 'asc' : 'desc') as
        | 'asc'
        | 'desc',
      page: pagination.currentPage,
      size: pagination.pageSize,
    }),
    [
      dimension,
      filterName,
      sort,
      query,
      levels,
      applications,
      dayjsDateRange,
      pagination.currentPage,
      pagination.pageSize,
    ],
  );

  const { data, isLoading } = useGetLogsQuery(queryParams);

  const handleSortChange = useCallback(
    (field: SortBy, order: SortOrder | undefined) => {
      setSort({
        sortField: field,
        sortOrder: order,
      });
    },
    [setSort],
  );

  // reset state when change filterName
  useEffect(() => {
    setQuery('');
    setLevels([]);
    setApplications([]);
    setDateRange([dayjs(startTime), dayjs(endTime)]);
  }, [
    setQuery,
    setLevels,
    setApplications,
    dimension,
    filterName,
    startTime,
    endTime,
  ]);

  return (
    <Drawer
      title={`Logs for ${filterName}`}
      placement="right"
      onClose={onClose}
      open={open}
      width={800}
    >
      <div className="flex flex-col gap-4">
        <LogFilters
          dimension={dimension}
          query={query}
          setQuery={setQuery}
          levels={levels}
          setLevels={setLevels}
          applications={applications}
          setApplications={setApplications}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <LogsTable
            data={data?.logs || []}
            pagination={{
              current: pagination.currentPage,
              pageSize: pagination.pageSize,
              total: data?.totalCount || 0,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            onChange={(newPagination) => {
              setPagination({
                currentPage: newPagination.current || 1,
                pageSize: newPagination.pageSize || 10,
              });
            }}
            onSort={handleSortChange}
            currentSort={sort}
          />
        )}
      </div>
    </Drawer>
  );
}

interface LogFiltersProps {
  dimension?: Dimension;
  query: string;
  setQuery: (query: string) => void;
  levels: LogLevel[];
  setLevels: (levels: LogLevel[]) => void;
  applications: string[];
  setApplications: (applications: string[]) => void;
  dateRange: [Dayjs, Dayjs];
  setDateRange: (dateRange: [Dayjs, Dayjs]) => void;
}

export function LogFilters({
  dimension,
  query,
  setQuery,
  levels,
  setLevels,
  applications,
  setApplications,
  dateRange,
  setDateRange,
}: LogFiltersProps) {
  const { data: applicationsData, isLoading: isApplicationsLoading } =
    useGetLogsApplicationsQuery(
      {
        startTime: dayjs(dateRange[0]).toISOString(),
        endTime: dayjs(dateRange[1]).toISOString(),
      },
      { skip: dimension === Dimension.APPLICATION },
    );

  const dateRangeValue = useMemo(
    () =>
      [dayjs(dateRange[0]), dayjs(dateRange[1])] as [dayjs.Dayjs, dayjs.Dayjs],
    [dateRange],
  );

  const handleQ = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [setQuery],
  );

  const handlelevelChange = useCallback(
    (value: LogLevel[]) => {
      setLevels(value);
    },
    [setLevels],
  );

  const handleApplicationChange = useCallback(
    (value: string[]) => {
      setApplications(value);
    },
    [setApplications],
  );

  const handleDateRangeChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null] | null) => {
      if (dates && dates[0] && dates[1]) {
        setDateRange([dates[0], dates[1]]);
      }
    },
    [setDateRange],
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
              value={query}
              onChange={handleQ}
              style={{ width: 300 }}
            />
            <Select
              mode="multiple"
              value={levels}
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
            {dimension !== Dimension.APPLICATION && (
              <Select
                mode="multiple"
                value={applications}
                onChange={handleApplicationChange}
                style={{ width: 200 }}
                placeholder="Select applications"
                allowClear
                loading={isApplicationsLoading}
                maxTagCount={1}
              >
                {applicationsData?.applications.map((application) => (
                  <Select.Option key={application} value={application}>
                    {application}
                  </Select.Option>
                ))}
              </Select>
            )}
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
