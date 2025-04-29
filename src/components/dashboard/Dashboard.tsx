'use client';

import { Col, Row, Space } from 'antd';
import { useMemo, useEffect, useState } from 'react';
import { parseLogsFromCsv, getLogStats } from '@/utils/parser';
import {
  ComponentDataPoint,
  TimeDataPoint,
} from '@/store/slices/chartCustomizationSlice';
import { LogLevelOverview } from './LogLevelOverview';
import { AnomalyDetection } from './AnomalyDetection';
import { TimeAnalysis } from './TimeAnalysis';
import { ErrorStatus, LoadingStatus, NoDataStatus } from '../common/Status';
import { ComponentAnalysis } from './ComponentAnalysis';
import { Log, LogLevel, TimeUnit } from '@/types/logsType';
import { PageTitle } from '../common/PageTitle';

export default function Dashboard() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.HOUR);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo(null);

        const response = await fetch('/data/Spark_2k.log_structured.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        if (!csvText) {
          throw new Error('No data received');
        }

        setDebugInfo(`Raw CSV length: ${csvText.length} characters`);
        const parsedLogs = parseLogsFromCsv(csvText);

        if (!parsedLogs.length) {
          throw new Error('No logs parsed from CSV');
        }

        setDebugInfo((prev) => `${prev}\nParsed ${parsedLogs.length} logs`);
        setLogs(parsedLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load logs',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const {
    componentData,
    componentAnalysisData,
    timeAnalysisData,
    hourlyDistribution,
    eventFrequency,
  } = useMemo(() => {
    if (!logs.length)
      return {
        levelCount: { INFO: 0, WARN: 0, ERROR: 0 },
        componentData: [],
        componentAnalysisData: [],
        timeAnalysisData: [],
        errorLogs: [],
        hourlyDistribution: [],
        eventFrequency: [],
        commonMessages: [],
      };

    const stats = getLogStats(logs);
    const errorLogs = logs.filter((log) => log.Level !== LogLevel.INFO);

    // Get event frequency
    const eventMap = logs.reduce(
      (acc, log) => {
        acc[log.EventId] = (acc[log.EventId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const eventFrequency = Object.entries(eventMap)
      .map(([eventId, count]) => ({
        eventId,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get common messages
    const messageMap = logs.reduce(
      (acc, log) => {
        acc[log.Content] = (acc[log.Content] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const commonMessages = Object.entries(messageMap)
      .map(([content, count]) => ({
        content,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const componentData = Object.entries(stats.byComponent)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const hourlyDistribution = Object.entries(stats.byHour)
      .map(([hour, counts]) => ({
        hour,
        ...counts,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // Process time analysis data
    const timeAnalysisData = Object.values(
      logs.reduce(
        (acc, log) => {
          let timeKey: string;

          switch (timeUnit) {
            case TimeUnit.SECOND:
              timeKey = `${log.Date} ${log.Time}`;
              break;
            case TimeUnit.MINUTE:
              timeKey = `${log.Date} ${log.Time.substring(0, 5)}`;
              break;
            case TimeUnit.HOUR:
              timeKey = `${log.Date} ${log.Time.substring(0, 2)}:00`;
              break;
            case TimeUnit.DAY:
              timeKey = log.Date;
              break;
            case TimeUnit.MONTH:
              timeKey = log.Date.substring(0, 7);
              break;
            case TimeUnit.YEAR:
              timeKey = log.Date.substring(0, 4);
              break;
            default:
              timeKey = `${log.Date} ${log.Time.substring(0, 2)}:00`;
          }

          if (!acc[timeKey]) {
            acc[timeKey] = {
              time: timeKey,
              count: 0,
              INFO: 0,
              WARN: 0,
              ERROR: 0,
              DEBUG: 0,
            };
          }
          acc[timeKey].count++;
          acc[timeKey][log.Level]++;
          return acc;
        },
        {} as Record<string, TimeDataPoint & { count: number }>,
      ),
    ).sort((a, b) => a.time.localeCompare(b.time));

    const componentAnalysisData = Object.values(
      logs.reduce(
        (acc, log) => {
          if (!acc[log.Component]) {
            acc[log.Component] = {
              component: log.Component,
              count: 0,
              INFO: 0,
              WARN: 0,
              ERROR: 0,
              DEBUG: 0,
            };
          }
          acc[log.Component].count++;
          acc[log.Component][log.Level]++;
          return acc;
        },
        {} as Record<string, ComponentDataPoint & { count: number }>,
      ),
    )
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      componentData,
      componentAnalysisData,
      timeAnalysisData,
      errorLogs,
      hourlyDistribution,
      eventFrequency,
      commonMessages,
    };
  }, [logs, timeUnit]);

  if (loading) {
    return <LoadingStatus />;
  }

  if (error) {
    return <ErrorStatus error={error} debugInfo={debugInfo} />;
  }

  if (!logs.length) {
    return <NoDataStatus />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <PageTitle title="Log Analytics Dashboard" />

      <div className="flex gap-4">
        <LogLevelOverview />
        <AnomalyDetection />
      </div>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <TimeAnalysis
            timeAnalysisData={timeAnalysisData}
            timeUnit={timeUnit}
            setTimeUnit={setTimeUnit}
            hourlyDistribution={hourlyDistribution}
          />
        </Col>

        {/* Component Analysis */}
        <Col span={8}>
          <ComponentAnalysis
            componentAnalysisData={componentAnalysisData || []}
            componentData={componentData}
            eventFrequency={eventFrequency}
          />
        </Col>
      </Row>

      {/* Log Details */}
      {/* <LogDetails errorLogs={errorLogs} commonMessages={commonMessages} /> */}
    </Space>
  );
}
