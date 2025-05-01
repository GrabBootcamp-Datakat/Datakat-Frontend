import { NextResponse } from 'next/server';
import { LogCountDto } from '@/types/logs';
import { logs } from '@/app/api/data';

export async function GET() {
  try {
    const counts: LogCountDto = {
      total: logs.length,
      INFO: 0,
      WARN: 0,
      ERROR: 0,
      DEBUG: 0,
    };

    logs.forEach((log) => {
      const level = log.Level as keyof Omit<LogCountDto, 'defaultDateRange'>;
      counts[level] = (counts[level] || 0) + 1;
    });

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 },
    );
  }
}
