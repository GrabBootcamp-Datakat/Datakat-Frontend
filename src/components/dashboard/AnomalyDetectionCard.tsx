'use client';
import { Card, Divider } from 'antd';
import { memo, useMemo, useEffect } from 'react';
import { ChartSkeleton } from '../common/Skeleton';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  useGetAnomaliesQuery,
  useGetAnomalyOccurrencesQuery,
} from '@/store/api/anomalyApi';
import {
  selectChartData,
  selectSettings,
  setAnomalies,
} from '@/store/slices/anomalySlice';
import AnomalyStats from './anomaly/AnomalyStats';
import AnomalyList from './anomaly/AnomalyList';
import type { AnomalyStatsProps } from './anomaly';

const AnomalyDetectionCard = memo(() => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const chartData = useAppSelector(selectChartData);

  // Fetch anomalies with polling if autoDetect is enabled
  const { data: anomaliesData, isLoading } = useGetAnomaliesQuery(
    {
      limit: 10,
      offset: 0,
      start_time: 'now-24h',
      end_time: 'now',
    },
    {
      pollingInterval: settings.autoDetect ? 5000 : 0,
    },
  );

  // Fetch anomaly occurrences for trend analysis
  const { data: occurrencesData } = useGetAnomalyOccurrencesQuery({
    start_time: 'now-24h',
    end_time: 'now',
    interval: '1h',
  });

  // Update Redux state when new data arrives
  useEffect(() => {
    if (anomaliesData) {
      if ('groups' in anomaliesData) {
        // Handle grouped response
        const allAnomalies = anomaliesData.groups.flatMap(
          (group) => group.items,
        );
        dispatch(setAnomalies(allAnomalies));
      } else {
        // Handle paginated response
        dispatch(setAnomalies(anomaliesData.items));
      }
    }
  }, [anomaliesData, dispatch]);

  const stats: AnomalyStatsProps = useMemo(() => {
    if (!anomaliesData || !chartData) {
      return {
        total: 0,
        anomalies: 0,
        severity: 'low',
        rate: '0%',
        trend: 'flat',
        mostFrequent: '',
        affectedApps: [],
      };
    }

    const total =
      'groups' in anomaliesData
        ? anomaliesData.total
        : anomaliesData.items.length;
    const anomalies = chartData.eventData.length;

    // Determine severity based on error levels
    const severity = chartData.levelData.some((level) => level.name === 'ERROR')
      ? 'high'
      : chartData.levelData.some((level) => level.name === 'WARN')
        ? 'medium'
        : 'low';

    // Calculate rate
    const rate = ((anomalies / total) * 100).toFixed(1) + '%';

    // Determine trend from occurrences data
    const trend = occurrencesData?.series.length
      ? occurrencesData.series[occurrencesData.series.length - 1].count >
        occurrencesData.series[0].count
        ? 'up'
        : 'down'
      : 'flat';

    // Get most frequent event and affected components
    const mostFrequent = chartData.eventData[0]?.component || '';
    const affectedApps = [
      ...new Set(chartData.eventData.map((e) => e.component)),
    ];

    return {
      total,
      anomalies,
      severity,
      rate,
      trend,
      mostFrequent,
      affectedApps,
    } as const;
  }, [anomaliesData, chartData, occurrencesData]);

  if (isLoading || !anomaliesData) {
    return <ChartSkeleton title="Anomaly Detection" />;
  }

  const anomalies =
    'groups' in anomaliesData
      ? anomaliesData.groups.slice(0, 3).flatMap((group) => group.items)
      : anomaliesData.items.slice(0, 3);

  return (
    <Card title="Anomaly Detection" hoverable style={{ height: '100%' }}>
      <AnomalyStats stats={stats} />
      <Divider style={{ margin: '12px 0' }} />
      <AnomalyList anomalies={anomalies} />
    </Card>
  );
});

AnomalyDetectionCard.displayName = 'AnomalyDetection';
export default AnomalyDetectionCard;
