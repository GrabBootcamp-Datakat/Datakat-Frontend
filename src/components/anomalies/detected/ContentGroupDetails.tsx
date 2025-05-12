'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Card, Button, Empty, notification } from 'antd';
import {
  useAnalyzeAnomalyMutation,
  useGetAnomaliesQuery,
} from '@/store/api/anomalyApi';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectAnalysisResult,
  selectSelectedGroupId,
  setAnalysisResult,
} from '@/store/slices/anomalySlice';
import {
  AnalysisResult,
  ContentGroupTimeline,
  ContentGroupHeader,
  ContentGroupTable,
} from './content';
import { Scrollbar } from 'react-scrollbars-custom';
import {
  AnomalyLogEntry,
  GroupedAnomalyResponse,
  PaginatedAnomalyResponse,
} from '@/types/anomaly';

export default function ContentGroupDetails() {
  const dispatch = useAppDispatch();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  const analysisResultEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    analysisResultEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedGroupId = useAppSelector(selectSelectedGroupId);
  const analysisResult = useAppSelector(selectAnalysisResult);
  const [analyzeAnomaly, { isLoading: isAnalyzing }] =
    useAnalyzeAnomalyMutation();

  // Fetch the selected group data
  const { data: anomaliesData } = useGetAnomaliesQuery({
    limit: 1,
    offset: 0,
    event_ids: selectedGroupId ? [selectedGroupId] : undefined,
    group_by: 'event_id',
  });

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

  const timestamps = selectedGroup.items.map(
    (item: AnomalyLogEntry) => item.timestamp,
  );

  return (
    <>
      {notificationContextHolder}
      <Card
        title="Content Group Details"
        extra={
          <Button
            size="small"
            onClick={handleAnalyze}
            loading={isAnalyzing}
            style={{
              backgroundColor: 'white',
              color: 'black',
              borderColor: 'black',
              borderWidth: '0.25px',
              borderStyle: 'solid',
            }}
          >
            <Image src="/brain.png" alt="Analyze" width={14} height={14} />
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
          <ContentGroupTimeline timestamps={timestamps} />
          <ContentGroupTable anomalies={selectedGroup.items} />
          <div ref={analysisResultEndRef} />
          {analysisResult && <AnalysisResult analysis={analysisResult} />}
        </Scrollbar>
      </Card>
    </>
  );
}
