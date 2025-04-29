import { NextResponse } from 'next/server';
import { logs } from '@/app/api/data';

export async function GET() {
  try {
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

    return NextResponse.json(eventFrequency);
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 },
    );
  }
}
