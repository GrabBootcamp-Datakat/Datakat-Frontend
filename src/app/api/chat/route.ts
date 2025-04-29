import { NextResponse } from 'next/server';
import { ChartData, ChatResponse } from '@/types/chart';

const generateMockData = (type: string): ChartData | null => {
  switch (type) {
    case 'line':
      return {
        type: 'line',
        title: 'CPU Usage Over Time',
        data: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          value: Math.random() * 100,
          server: `server-${Math.floor(Math.random() * 3) + 1}`,
        })),
        config: {
          xField: 'time',
          yField: 'value',
          seriesField: 'server',
          smooth: true,
        },
      };
    case 'bar':
      return {
        type: 'bar',
        title: 'Error Distribution by Service',
        data: [
          { service: 'api-gateway', errors: 15 },
          { service: 'user-service', errors: 8 },
          { service: 'payment-service', errors: 12 },
          { service: 'auth-service', errors: 5 },
        ],
        config: {
          xField: 'service',
          yField: 'errors',
        },
      };
    case 'pie':
      return {
        type: 'pie',
        title: 'Log Level Distribution',
        data: [
          { level: 'ERROR', count: 25 },
          { level: 'WARN', count: 40 },
          { level: 'INFO', count: 120 },
          { level: 'DEBUG', count: 35 },
        ],
        config: {
          angleField: 'count',
          colorField: 'level',
        },
      };
    default:
      return null;
  }
};

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Determine chart type based on query
    const queryLower = query.toLowerCase();
    let chartType: 'line' | 'bar' | 'pie' | null = null;

    if (queryLower.includes('usage') || queryLower.includes('over time')) {
      chartType = 'line';
    } else if (
      queryLower.includes('distribution') ||
      queryLower.includes('by service')
    ) {
      chartType = 'bar';
    } else if (queryLower.includes('level') || queryLower.includes('type')) {
      chartType = 'pie';
    }

    const mockData = chartType ? generateMockData(chartType) : null;

    const response: ChatResponse = {
      content:
        "I've analyzed your query and prepared a visualization of the data.",
      data: mockData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 },
    );
  }
}
