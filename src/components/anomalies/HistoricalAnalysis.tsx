'use client';
import { useAppSelector } from '@/hooks/hook';
import { selectChartData } from '@/store/slices/anomalySlice';
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
} from 'recharts';

// Shared Colors
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

// === COMPONENT: Pie Chart ===
function ComponentPieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <Card title="Anomalies by Component">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// === COMPONENT: Bar Chart by Level ===
function LevelBarChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <Card title="Anomalies by Level">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// === COMPONENT: Event Chart ===
interface EventData {
  id: string;
  count: number;
  component: string;
  level: string;
  firstOccurrence: string;
  lastOccurrence: string;
}

function EventBarChart({ data }: { data: EventData[] }) {
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
                      <strong>Count:</strong> {d.count}
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
function TimeLineChart({ data }: { data: { hour: string; count: number }[] }) {
  return (
    <Card title="Anomalies Over Time">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// === MAIN PAGE ===
export default function HistoricalAnalysis() {
  const chartData = useAppSelector(selectChartData);

  if (!chartData) return null;

  return (
    <Scrollbar noScrollX>
      <Row gutter={[16, 16]} style={{ height: '100%' }}>
        <Col span={12}>
          <ComponentPieChart data={chartData.componentData} />
        </Col>
        <Col span={12}>
          <LevelBarChart data={chartData.levelData} />
        </Col>
        <Col span={12}>
          <EventBarChart data={chartData.eventData} />
        </Col>
        <Col span={12}>
          <TimeLineChart data={chartData.timeData} />
        </Col>
      </Row>
    </Scrollbar>
  );
}
