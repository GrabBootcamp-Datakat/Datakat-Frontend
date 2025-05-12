'use client';
import { useMemo, useCallback, memo } from 'react';
import { Tag, Card } from 'antd';
import { AnomalyGroupResponse } from '@/types/anomaly';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectFilters,
  selectSelectedGroupId,
  setSelectedGroupId,
  selectGroupedAnomalies,
} from '@/store/slices/anomalySlice';
import { useGetAnomaliesQuery } from '@/store/api/anomalyApi';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';
import Scrollbar from 'react-scrollbars-custom';

export default function ContentGroupList() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const selectedGroupId = useAppSelector(selectSelectedGroupId);
  const { groups } = useAppSelector(selectGroupedAnomalies);

  // Fetch anomalies with filters
  const { data: anomaliesData } = useGetAnomaliesQuery({
    limit: 50,
    offset: 0,
    group_by: 'event_id',
    search_query: filters.search || undefined,
    event_ids:
      filters.eventIdFilter !== 'all' ? [filters.eventIdFilter] : undefined,
    levels: filters.levelFilter !== 'all' ? [filters.levelFilter] : undefined,
    applications:
      filters.componentFilter !== 'all' ? [filters.componentFilter] : undefined,
  });

  const handleSetSelectedGroup = useCallback(
    (groupId: string | null) => {
      dispatch(setSelectedGroupId(groupId));
    },
    [dispatch],
  );

  const filteredGroups = useMemo(() => {
    if (!groups.length && anomaliesData && 'groups' in anomaliesData) {
      return anomaliesData.groups;
    }
    return groups;
  }, [groups, anomaliesData]);

  return (
    <Card
      title="Detected Anomalies"
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
        contentProps={{
          style: { padding: '12px', paddingRight: '16px' },
        }}
        style={{ height: '100%' }}
        trackYProps={{
          style: { display: 'none' },
        }}
      >
        {filteredGroups.map((group) => (
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
            <Paragraph ellipsis style={{ maxWidth: '100%', marginBottom: 8 }}>
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
              <Text type="secondary">
                First: {new Date(group.first_occurrence).toLocaleString()}
              </Text>
            </div>
          </div>
        </div>
      </Card>
    );
  },
);

ContentGroupItem.displayName = 'ContentGroupItem';
