import { NextResponse } from 'next/server';
import { stats } from '@/app/api/data';

export async function GET() {
  try {
    const componentData = Object.entries(stats.byComponent)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return NextResponse.json(componentData);
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 },
    );
  }
}
