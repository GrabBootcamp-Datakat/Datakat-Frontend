'use client';
import { Card, Divider } from 'antd';
import { memo, useMemo, useEffect } from 'react';
import { ChartSkeleton } from '../../common/Skeleton';
import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import {
  useGetAnomaliesQuery,
  useGetAnomalyOccurrencesQuery,
} from '@/store/api/anomalyApi';
import {
  selectSettings,
  setAnomalies,
  setChartData,
  selectAnomalies,
} from '@/store/slices/anomalySlice';
import AnomalyStats from './AnomalyStats';
import AnomalyList from './AnomalyList';
import type { AnomalyStatsProps } from './types';
import { AnomalyLogEntry } from '@/components/anomalies/types';

const AnomalyDetectionCard = memo(() => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const existingAnomalies = useAppSelector(selectAnomalies);

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
      let newAnomalies: AnomalyLogEntry[] = [];
      if ('groups' in anomaliesData) {
        // Handle grouped response
        newAnomalies = anomaliesData.groups.flatMap((group) => group.items);
      } else {
        // Handle paginated response
        newAnomalies = anomaliesData.items;
      }

      // Merge with existing anomalies, avoiding duplicates
      const mergedAnomalies = [...existingAnomalies];
      newAnomalies.forEach((anomaly) => {
        if (!mergedAnomalies.some((existing) => existing.id === anomaly.id)) {
          mergedAnomalies.push(anomaly);
        }
      });

      dispatch(setAnomalies(mergedAnomalies));

      // Update chart data with merged anomalies
      const componentCounts = new Map<string, number>();
      const levelCounts = new Map<string, number>();
      const eventCounts = new Map<
        string,
        { count: number; data: AnomalyLogEntry }
      >();
      const timeCounts = new Map<string, number>();

      mergedAnomalies.forEach((anomaly) => {
        // Component data
        componentCounts.set(
          anomaly.component,
          (componentCounts.get(anomaly.component) || 0) + 1,
        );

        // Level data
        levelCounts.set(
          anomaly.level,
          (levelCounts.get(anomaly.level) || 0) + 1,
        );

        // Event data
        const eventData = eventCounts.get(anomaly.event_id);
        if (eventData) {
          eventData.count++;
          // Update last occurrence if newer
          if (
            new Date(anomaly.timestamp) > new Date(eventData.data.timestamp)
          ) {
            eventData.data = anomaly;
          }
        } else {
          eventCounts.set(anomaly.event_id, { count: 1, data: anomaly });
        }

        // Time data
        const hour = new Date(anomaly.timestamp).toLocaleString();
        timeCounts.set(hour, (timeCounts.get(hour) || 0) + 1);
      });

      dispatch(
        setChartData({
          componentData: Array.from(componentCounts.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value),
          levelData: Array.from(levelCounts.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value),
          eventData: Array.from(eventCounts.entries())
            .map(([id, { count, data }]) => ({
              id,
              count,
              component: data.component,
              level: data.level,
              firstOccurrence: data.timestamp,
              lastOccurrence: data.timestamp,
            }))
            .sort((a, b) => b.count - a.count),
          timeData: Array.from(timeCounts.entries())
            .map(([hour, count]) => ({ hour, count }))
            .sort(
              (a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime(),
            ),
        }),
      );
    }
  }, [anomaliesData, dispatch, existingAnomalies]);

  const stats: AnomalyStatsProps = useMemo(() => {
    if (!anomaliesData) {
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

    // Calculate total from anomaliesData
    const total =
      'groups' in anomaliesData
        ? anomaliesData.groups.reduce((acc, group) => acc + group.count, 0)
        : anomaliesData.total;

    // Calculate number of anomalies
    const anomalies =
      'groups' in anomaliesData
        ? anomaliesData.groups.length
        : anomaliesData.items.filter((item) => item.is_anomaly).length;

    // Determine severity based on anomaly levels
    const allItems =
      'groups' in anomaliesData
        ? anomaliesData.groups.flatMap((group) => group.items)
        : anomaliesData.items;

    const severity = allItems.some((item) => item.level === 'ERROR')
      ? 'high'
      : allItems.some((item) => item.level === 'WARN')
        ? 'medium'
        : 'low';

    // Calculate rate
    const rate =
      total > 0 ? ((anomalies / total) * 100).toFixed(1) + '%' : '0%';

    // Determine trend from occurrences data
    const trend = occurrencesData?.series.length
      ? occurrencesData.series[occurrencesData.series.length - 1].count >
        occurrencesData.series[0].count
        ? 'up'
        : occurrencesData.series[occurrencesData.series.length - 1].count <
            occurrencesData.series[0].count
          ? 'down'
          : 'flat'
      : 'flat';

    // Get most frequent component and affected components
    const componentCounts = new Map<string, number>();
    allItems.forEach((item) => {
      componentCounts.set(
        item.component,
        (componentCounts.get(item.component) || 0) + 1,
      );
    });

    const sortedComponents = Array.from(componentCounts.entries()).sort(
      ([, a], [, b]) => b - a,
    );

    const mostFrequent = sortedComponents[0]?.[0] || '';
    const affectedApps = Array.from(componentCounts.keys());

    return {
      total,
      anomalies,
      severity,
      rate,
      trend,
      mostFrequent,
      affectedApps,
    } as const;
  }, [anomaliesData, occurrencesData]);

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
