'use client';
import { useState } from 'react';
import { Card, Button, message, Empty } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { useAnalyzeAnomalyMutation } from '@/store/api/anomalyApi';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  selectAnalysisResult,
  selectSelectedGroup,
  setAnalysisResult,
} from '@/store/slices/anomalySlice';
import {
  AnalysisResult,
  ContentGroupTimeline,
  ContentGroupHeader,
  ContentGroupTable,
} from './content';
import { Scrollbar } from 'react-scrollbars-custom';

export default function ContentGroupDetails() {
  const dispatch = useAppDispatch();
  const selectedGroup = useAppSelector(selectSelectedGroup);
  const analysisResult = useAppSelector(selectAnalysisResult);
  const [expanded, setExpanded] = useState(false);
  const [analyzeAnomaly, { isLoading: isAnalyzing }] =
    useAnalyzeAnomalyMutation();

  if (!selectedGroup) {
    return <Empty description="Select a content group to view details" />;
  }

  const handleAnalyze = async () => {
    try {
      const response = await analyzeAnomaly({
        log_id: selectedGroup.anomalies[0].id,
      }).unwrap();
      dispatch(setAnalysisResult(response));
      message.success('Analysis completed');
    } catch {
      message.error('Failed to analyze anomaly');
    }
  };

  return (
    <Card
      title="Content Group Details"
      extra={
        <Button
          type="primary"
          size="small"
          onClick={handleAnalyze}
          loading={isAnalyzing}
          icon={<BarChartOutlined />}
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
        <ContentGroupHeader
          group={selectedGroup}
          expanded={expanded}
          setExpanded={setExpanded}
        />
        <ContentGroupTimeline timestamps={selectedGroup.timestamps} />
        <ContentGroupTable anomalies={selectedGroup.anomalies} />
        {analysisResult && <AnalysisResult analysis={analysisResult} />}
      </Scrollbar>
    </Card>
  );
}
