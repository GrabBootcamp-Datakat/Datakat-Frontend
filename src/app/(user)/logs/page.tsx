'use client';
import { useMemo, useCallback } from 'react';
import { Card, Tabs, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { LayoutScroll, PageTitle } from '@/components/common';
import { TableSkeleton } from '@/components/common/Skeleton';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectLogsFilters,
  selectLogsSort,
  selectLogsPagination,
  setPagination,
  setSort,
} from '@/store/slices/logsSlice';
import dayjs from 'dayjs';
import { useGetLogsQuery } from '@/store/api/logsApi';
import { TablePaginationConfig } from 'antd/es/table';
import { SortBy } from '@/types/logs';
import type { SortOrder as AntSortOrder } from 'antd/es/table/interface';
import { LogSearchRequest } from '@/types/logs';
import { LogFilters, LogsTable } from '@/components/logs';
import Title from 'antd/es/typography/Title';
import Text from 'antd/es/typography/Text';

export default function LogsPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectLogsFilters);
  const pagination = useAppSelector(selectLogsPagination);
  const sort = useAppSelector(selectLogsSort);

  // Convert ISO strings to dayjs objects for the API query
  const dayjsDateRange = useMemo(
    () => [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])],
    [filters.dateRange],
  );

  const queryParams: LogSearchRequest = useMemo(
    () => ({
      startTime: dayjsDateRange[0].toISOString(),
      endTime: dayjsDateRange[1].toISOString(),
      query: filters.searchQuery,
      levels: filters.level,
      applications: filters.applicationFilter,
      sortBy: sort.sortField,
      sortOrder: (sort.sortOrder === 'ascend' ? 'asc' : 'desc') as
        | 'asc'
        | 'desc',
      page: pagination.currentPage,
      size: pagination.pageSize,
    }),
    [
      dayjsDateRange,
      filters.searchQuery,
      filters.level,
      filters.applicationFilter,
      sort.sortField,
      sort.sortOrder,
      pagination.currentPage,
      pagination.pageSize,
    ],
  );

  const { data, isLoading } = useGetLogsQuery(queryParams);

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      dispatch(
        setPagination({
          currentPage: pagination.current || 1,
          pageSize: pagination.pageSize || 10,
        }),
      );
    },
    [dispatch],
  );

  const handleSortChange = useCallback(
    (field: SortBy, order: AntSortOrder | undefined) => {
      dispatch(
        setSort({
          sortField: field,
          sortOrder: order,
        }),
      );
    },
    [dispatch],
  );

  // Memoize tab items
  const tabItems = useMemo(
    () => [
      {
        key: 'all',
        label: (
          <Space>
            <ClockCircleOutlined />
            <Text>All Logs</Text>
          </Space>
        ),
        children: (
          <Card>
            <Title level={4}>All Logs</Title>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <LogsTable
                data={data?.logs || []}
                pagination={{
                  current: pagination.currentPage,
                  pageSize: pagination.pageSize,
                  total: data?.totalCount || 0,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} items`,
                  pageSizeOptions: ['5', '10', '20', '50', '100'],
                }}
                onChange={handleTableChange}
                onSort={handleSortChange}
                currentSort={sort}
              />
            )}
          </Card>
        ),
      },
    ],
    [
      data?.logs,
      data?.totalCount,
      isLoading,
      pagination.currentPage,
      pagination.pageSize,
      handleTableChange,
      handleSortChange,
      sort,
    ],
  );

  return (
    <LayoutScroll>
      <PageTitle title="Logs" />
      <LogFilters />
      <Tabs defaultActiveKey="all" items={tabItems} />
    </LayoutScroll>
  );
}
