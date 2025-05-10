'use client';
import { useMemo, useCallback, memo } from 'react';
import { Tag, Card } from 'antd';
import { ContentGroup } from '@/types/anomaly';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectContentGroups,
  setSelectedGroup,
  selectSelectedGroup,
  selectFilters,
} from '@/store/slices/anomalySlice';
import Paragraph from 'antd/es/typography/Paragraph';
import Text from 'antd/es/typography/Text';
import Scrollbar from 'react-scrollbars-custom';

export default function ContentGroupList() {
  const dispatch = useAppDispatch();
  const contentGroups = useAppSelector(selectContentGroups);
  const selectedGroup = useAppSelector(selectSelectedGroup);
  const filters = useAppSelector(selectFilters);

  const handleSetSelectedGroup = useCallback(
    (group: ContentGroup | null) => {
      dispatch(setSelectedGroup(group));
    },
    [dispatch],
  );

  const filteredContentGroups = useMemo(() => {
    const lowerCaseSearch = filters.search.toLowerCase();
    return contentGroups.filter((group) => {
      const matchesSearch =
        !filters.search ||
        group.content.toLowerCase().includes(lowerCaseSearch) ||
        group.count.toString().includes(lowerCaseSearch);

      return matchesSearch;
    });
  }, [contentGroups, filters]);

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
        {filteredContentGroups.map((group, index) => (
          <ContentGroupItem
            key={index}
            group={group}
            selectedGroup={selectedGroup}
            setSelectedGroup={handleSetSelectedGroup}
          />
        ))}
      </Scrollbar>
    </Card>
  );
}

const ContentGroupItem = memo(
  ({
    group,
    selectedGroup,
    setSelectedGroup,
  }: {
    group: ContentGroup;
    selectedGroup: ContentGroup | null;
    setSelectedGroup: (group: ContentGroup | null) => void;
  }) => {
    const isSelected = selectedGroup?.content === group.content;

    return (
      <Card
        hoverable
        style={{
          marginBottom: 8,
          width: '100%',
          maxWidth: '100%',
          backgroundColor: isSelected ? '#f0f5ff' : undefined,
        }}
        onClick={() => setSelectedGroup(group)}
      >
        <div className="flex items-center justify-between">
          <div className="w-full flex-[1]">
            <Paragraph ellipsis style={{ maxWidth: '100%', marginBottom: 8 }}>
              {group.content || 'Unknown Content'}
            </Paragraph>
            <div>
              <Tag color="blue">{group.count} occurrences</Tag>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                First: {new Date(group.timestamps[0]).toLocaleString()}
              </Text>
            </div>
          </div>
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Re-render nếu:
    // - nội dung group thay đổi (dữ liệu mới)
    // - selectedGroup thay đổi liên quan đến chính item này

    const isSameGroup = prevProps.group === nextProps.group;
    const wasSelected =
      prevProps.selectedGroup?.content === prevProps.group.content;
    const isSelected =
      nextProps.selectedGroup?.content === nextProps.group.content;

    return isSameGroup && wasSelected === isSelected;
  },
);

ContentGroupItem.displayName = 'ContentGroupItem';
