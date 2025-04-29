import { NextResponse } from 'next/server';
import { logs } from '@/app/api/data';
import { ComponentDataPoint } from '@/store/slices/chartCustomizationSlice';

export async function GET() {
  try {
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

    return NextResponse.json(componentAnalysisData);
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 },
    );
  }
}
