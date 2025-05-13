'use client';
import { useMemo, useCallback, memo, useState, useEffect } from 'react';
import { Tag, Card, Button } from 'antd';
import { AnomalyGroupResponse } from '@/types/anomaly';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectFilters,
  selectSelectedGroupId,
  setSelectedGroupId,
  selectPagination,
  loadMore,
  selectDateRange,
} from '@/store/slices/anomalySlice';
import { useGetAnomaliesQuery } from '@/store/api/anomalyApi';
import { PlusOutlined } from '@ant-design/icons';
import Paragraph from 'antd/es/typography/Paragraph';
import Scrollbar from 'react-scrollbars-custom';

export default function ContentGroupList() {
  const dispatch = useAppDispatch();
  const { limit, offset } = useAppSelector(selectPagination);
  const dateRange = useAppSelector(selectDateRange);
  const { search, eventId, level } = useAppSelector(selectFilters);
  const selectedGroupId = useAppSelector(selectSelectedGroupId);
  const [anomaliesData, setAnomaliesData] = useState<AnomalyGroupResponse[]>(
    [],
  );

  const { data, isFetching } = useGetAnomaliesQuery({
    limit,
    offset,
    start_time: dateRange[0],
    end_time: dateRange[1],
    group_by: 'event_id',
    search_query: search,
    event_ids: eventId !== 'all' ? [eventId] : undefined,
    levels: level !== 'all' ? [level] : undefined,
    // applications: component !== 'all' ? [component] : undefined,
  });

  useEffect(() => {
    if (data && 'groups' in data && offset > 0) {
      setAnomaliesData((prev) => [...prev, ...data.groups]);
    }
  }, [data, offset]);

  useEffect(() => {
    if (data && 'groups' in data && offset === 0) {
      setAnomaliesData(data.groups);
      dispatch(setSelectedGroupId(data.groups[0]?.event_id || null));
    }
  }, [data, dispatch, offset]);

  const handleSetSelectedGroup = useCallback(
    (groupId: string | null) => {
      dispatch(setSelectedGroupId(groupId));
    },
    [dispatch],
  );

  const handleLoadMore = useCallback(() => {
    dispatch(loadMore());
  }, [dispatch]);

  return (
    <Card
      title="Detected Anomalies"
      extra={
        <>
          <Button
            type="link"
            icon={<PlusOutlined />}
            loading={isFetching}
            disabled={
              offset >= (data?.total || 0) ||
              anomaliesData.length >= (data?.total || 0)
            }
            onClick={handleLoadMore}
          >
            More
          </Button>
        </>
      }
      style={{ maxWidth: '100%', height: '100%' }}
      styles={{
        body: {
          height: 'calc(100% - 60px)',
          overflowY: 'auto',
          padding: 0,
          paddingRight: '4px',
        },
      }}
    >
      <Scrollbar
        disableTracksWidthCompensation
        noScrollX
        style={{ height: '100%' }}
        contentProps={{
          style: { padding: '12px', paddingRight: '16px' },
        }}
        trackYProps={{
          style: { display: 'none' },
        }}
      >
        {anomaliesData.map((group) => (
          <ContentGroupItem
            key={group.event_id}
            group={group}
            isSelected={selectedGroupId === group.event_id}
            onSelect={handleSetSelectedGroup}
          />
        ))}
      </Scrollbar>
    </Card>
  );
}

const ContentGroupItem = memo(
  ({
    group,
    isSelected,
    onSelect,
  }: {
    group: AnomalyGroupResponse;
    isSelected: boolean;
    onSelect: (groupId: string | null) => void;
  }) => {
    // Get unique levels and components from anomalies
    const uniqueLevels = useMemo(() => {
      const levels = new Set(group.items.map((a) => a.level));
      return Array.from(levels);
    }, [group.items]);

    const uniqueComponents = useMemo(() => {
      const components = new Set(group.items.map((a) => a.component));
      return Array.from(components);
    }, [group.items]);

    return (
      <Card
        hoverable
        style={{
          marginBottom: 8,
          width: '100%',
          maxWidth: '100%',
          backgroundColor: isSelected ? '#f0f5ff' : undefined,
        }}
        onClick={() => onSelect(group.event_id)}
      >
        <div className="flex items-center justify-between">
          <div className="w-full flex-[1]">
            <Paragraph
              ellipsis
              style={{
                maxWidth: '100%',
                marginBottom: 8,
                fontWeight: 500,
                color: '#000',
              }}
            >
              {group.items[0]?.content || 'Unknown Content'}
            </Paragraph>
            <div className="flex flex-wrap gap-2">
              <Tag color="blue">{group.count} occurrences</Tag>
              {uniqueLevels.map((level) => (
                <Tag key={level} color={level === 'ERROR' ? 'red' : 'orange'}>
                  {level}
                </Tag>
              ))}
              {uniqueComponents.map((component) => (
                <Tag key={component} color="green">
                  {component}
                </Tag>
              ))}
              <ContentGroupTimeRange
                first_occurrence={group.first_occurrence}
                last_occurrence={group.last_occurrence}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  },
);

interface ContentGroupTimeRangeProps {
  first_occurrence: string;
  last_occurrence: string;
}

const ContentGroupTimeRange = memo((props: ContentGroupTimeRangeProps) => {
  const { first_occurrence, last_occurrence } = props;
  return (
    <>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        <span style={{ fontWeight: 500, color: '#000' }}>Last:</span>{' '}
        {new Date(last_occurrence).toLocaleString()}
      </Paragraph>
      <Paragraph type="secondary" style={{ margin: 0 }}>
        <span style={{ fontWeight: 500, color: '#000' }}>First:</span>{' '}
        {new Date(first_occurrence).toLocaleString()}
      </Paragraph>
    </>
  );
});

ContentGroupTimeRange.displayName = 'ContentGroupTimeRange';
ContentGroupItem.displayName = 'ContentGroupItem';
