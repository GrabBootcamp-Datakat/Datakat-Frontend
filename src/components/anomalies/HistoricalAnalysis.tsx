'use client';
import { useAppSelector } from '@/hooks/hook';
import {
  useGetAnomalyOccurrencesQuery,
  useGetAnomaliesQuery,
} from '@/store/api/anomalyApi';
import { selectDateRange } from '@/store/slices/anomalySlice';
import { Card, Col, Row } from 'antd';
import Scrollbar from 'react-scrollbars-custom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatChartValue } from '../dashboard/charts/components/utils';
import { TimeRangeCard } from '../dashboard/charts';

// Shared Colors
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

// === MAIN PAGE ===
export default function HistoricalAnalysis() {
  const dateRange = useAppSelector(selectDateRange);
  return (
    <Scrollbar noScrollX>
      <TimeRangeCard startTime={dateRange[0]} endTime={dateRange[1]} />
      <Row gutter={[16, 16]} style={{ height: '100%', marginTop: '16px' }}>
        <Col span={12}>
          <EventIdPieChart />
        </Col>
        <Col span={12}>
          <LevelBarChart />
        </Col>
        <Col span={12}>
          <EventBarChart />
        </Col>
        <Col span={12}>
          <TimeLineChart />
        </Col>
      </Row>
    </Scrollbar>
  );
}

// === COMPONENT: Pie Chart ===
function EventIdPieChart() {
  const dateRange = useAppSelector(selectDateRange);
  const { data: anomaliesData } = useGetAnomaliesQuery({
    start_time: dateRange[0],
    end_time: dateRange[1],
    group_by: 'event_id',
  });

  if (!anomaliesData || !('groups' in anomaliesData)) return null;

  return (
    <Card title="Anomalies by Event ID">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={anomaliesData.groups}
            dataKey="count"
            nameKey="event_id"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name.length > 10 ? name.slice(0, 10) + '…' : name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {anomaliesData.groups.map((entry, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip
            labelFormatter={(label) => `Event ID: ${label}`}
            formatter={(value: string | number) => [
              formatChartValue({ value: Number(value), chartType: 'pie' }),
              'Value',
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// === COMPONENT: Bar Chart by Level ===
function LevelBarChart() {
  const dateRange = useAppSelector(selectDateRange);
  const { data: anomaliesData } = useGetAnomaliesQuery({
    start_time: dateRange[0],
    end_time: dateRange[1],
    group_by: 'event_id',
  });

  if (!anomaliesData || !('groups' in anomaliesData)) return null;

  // Aggregate data by level
  const levelCounts: Record<string, number> = {};
  anomaliesData.groups.forEach((group) => {
    group.items.forEach((item) => {
      levelCounts[item.level] = (levelCounts[item.level] || 0) + 1;
    });
  });

  const data = Object.entries(levelCounts).map(([level, count]) => ({
    name: level,
    value: count,
  }));

  return (
    <Card title="Anomalies by Level">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, value, percent }) =>
              `${name} (${formatChartValue({ value, chartType: 'pie' })} - ${(percent * 100).toFixed(1)}%)`
            }
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip
            formatter={(value: string | number) => [
              formatChartValue({ value: Number(value), chartType: 'pie' }),
              'Count',
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// === COMPONENT: Event Chart ===
function EventBarChart() {
  const dateRange = useAppSelector(selectDateRange);
  const { data: anomaliesData } = useGetAnomaliesQuery({
    start_time: dateRange[0],
    end_time: dateRange[1],
    group_by: 'event_id',
  });

  if (!anomaliesData || !('groups' in anomaliesData)) return null;

  const data = anomaliesData.groups.map((group) => ({
    id: group.event_id,
    count: group.count,
    component: group.items[0]?.component || 'Unknown',
    level: group.items[0]?.level || 'Unknown',
    firstOccurrence: group.first_occurrence,
    lastOccurrence: group.items[0]?.timestamp || group.first_occurrence,
  }));

  return (
    <Card title="Event Patterns">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                const d = payload[0].payload;
                return (
                  <div
                    style={{
                      background: '#fff',
                      padding: '10px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <p>
                      <strong>Event ID:</strong> {d.id}
                    </p>
                    <p>
                      <strong>Count:</strong>{' '}
                      {formatChartValue({ value: d.count, chartType: 'bar' })}
                    </p>
                    <p>
                      <strong>Component:</strong> {d.component}
                    </p>
                    <p>
                      <strong>Level:</strong> {d.level}
                    </p>
                    <p>
                      <strong>First Occurrence:</strong> {d.firstOccurrence}
                    </p>
                    <p>
                      <strong>Last Occurrence:</strong> {d.lastOccurrence}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" fill="#52c41a" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// === COMPONENT: Time Series Chart ===
function TimeLineChart() {
  const dateRange = useAppSelector(selectDateRange);
  const { data: occurrencesData } = useGetAnomalyOccurrencesQuery({
    start_time: dateRange[0],
    end_time: dateRange[1],
    interval: '1h',
  });

  if (!occurrencesData) return null;

  // Process the time series data
  interface TimeDataPoint {
    hour: number;
    count: number;
  }

  const timeSeriesData = occurrencesData.series
    .reduce((acc: TimeDataPoint[], curr) => {
      const hour = new Date(curr.timestamp).getTime();
      const existingPoint = acc.find((point) => point.hour === hour);

      if (existingPoint) {
        existingPoint.count += curr.count;
      } else {
        acc.push({
          hour,
          count: curr.count,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.hour - b.hour);

  return (
    <Card title="Anomalies Over Time">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeSeriesData}>
          <XAxis
            dataKey="hour"
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={(timestamp) => {
              return new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
            }}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
            formatter={(value: string | number) =>
              formatChartValue({ value: Number(value), chartType: 'line' })
            }
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
