import { NextResponse } from 'next/server';
import { stats } from '@/app/api/data';

export async function GET() {
  try {
    const hourlyDistribution = Object.entries(stats.byHour)
      .map(([hour, counts]) => ({
        hour,
        ...counts,
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    return NextResponse.json(hourlyDistribution);
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 },
    );
  }
}
