import { NextResponse } from 'next/server';
import { TimeUnit } from '@/types/log';
import { TimeDataPoint } from '@/store/slices/chartCustomizationSlice';
import { logs } from '@/app/api/data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeUnit = searchParams.get('timeUnit') as TimeUnit;
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

    return NextResponse.json(timeAnalysisData);
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 },
    );
  }
}
