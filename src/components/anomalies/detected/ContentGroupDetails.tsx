'use client';
import { useEffect, useRef } from 'react';
import { Card, Button, Empty, notification, Divider } from 'antd';
import {
  useAnalyzeAnomalyMutation,
  useGetAnomaliesQuery,
} from '@/store/api/anomalyApi';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectAnalysisResult,
  selectSelectedGroupId,
  selectDateRange,
  setAnalysisResult,
} from '@/store/slices/anomalySlice';
import {
  AnalysisResult,
  ContentGroupHeader,
  ContentGroupTable,
} from './content';
import { Scrollbar } from 'react-scrollbars-custom';
import {
  GroupedAnomalyResponse,
  PaginatedAnomalyResponse,
} from '@/types/anomaly';
import Title from 'antd/es/typography/Title';

export default function ContentGroupDetails() {
  const dispatch = useAppDispatch();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  const analysisResultEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    analysisResultEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const dateRange = useAppSelector(selectDateRange);
  const selectedGroupId = useAppSelector(selectSelectedGroupId);
  const analysisResult = useAppSelector(selectAnalysisResult);
  const [analyzeAnomaly, { isLoading: isAnalyzing }] =
    useAnalyzeAnomalyMutation();

  // Fetch the selected group data
  const { data: anomaliesData } = useGetAnomaliesQuery(
    {
      limit: 1,
      offset: 0,
      start_time: dateRange[0],
      end_time: dateRange[1],
      event_ids: selectedGroupId ? [selectedGroupId] : undefined,
      group_by: 'event_id',
    },
    {
      skip: selectedGroupId === null,
      selectFromResult: ({ data, ...rest }) => ({
        data: selectedGroupId === null ? undefined : data,
        ...rest,
      }),
    },
  );

  // Type guard to check if response is GroupedAnomalyResponse
  const isGroupedResponse = (
    data: GroupedAnomalyResponse | PaginatedAnomalyResponse | undefined,
  ): data is GroupedAnomalyResponse => {
    return data !== undefined && 'groups' in data && Array.isArray(data.groups);
  };

  // Get the selected group with proper type checking
  const selectedGroup = isGroupedResponse(anomaliesData)
    ? anomaliesData.groups[0]
    : undefined;

  useEffect(() => {
    scrollToBottom();
  }, [analysisResult]);

  if (!selectedGroup) {
    return <Empty description="Select a content group to view details" />;
  }

  const handleAnalyze = async () => {
    if (!selectedGroup?.items?.[0]?.id) return;

    try {
      const response = await analyzeAnomaly({
        log_id: selectedGroup.items[0].id,
      }).unwrap();
      dispatch(
        setAnalysisResult({
          groupId: selectedGroup.event_id,
          result: response,
        }),
      );
      notificationApi.open({
        message: 'Analysis completed',
        description: 'Analysis completed successfully',
        duration: 3,
        type: 'success',
      });
    } catch (error) {
      notificationApi.open({
        message: 'Analysis failed',
        description:
          error instanceof Error ? error.message : 'Failed to analyze anomaly',
        duration: 3,
        type: 'error',
      });
    }
  };

  return (
    <>
      {notificationContextHolder}
      <Card
        title="Content Group Details"
        extra={
          <Button
            size="small"
            type="link"
            icon={<BrainIcon />}
            onClick={handleAnalyze}
            loading={isAnalyzing}
          >
            Analyze
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
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
          style={{ padding: 16 }}
          contentProps={{
            style: { padding: '12px', paddingRight: '16px' },
          }}
          trackYProps={{
            style: { display: 'none' },
          }}
        >
          <ContentGroupHeader group={selectedGroup} />
          <Divider />

          {/* <Title level={5}>Occurrence Timeline</Title>
          <ContentGroupTimeline applications={applications} levels={levels} />
          <Divider /> */}

          <Title level={5}>Last 5 occurrences</Title>
          <ContentGroupTable anomalies={selectedGroup.items} />
          <Divider />

          <div ref={analysisResultEndRef} />
          {analysisResult && <AnalysisResult analysis={analysisResult} />}
        </Scrollbar>
      </Card>
    </>
  );
}

const BrainIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-brain-icon lucide-brain"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  );
};
