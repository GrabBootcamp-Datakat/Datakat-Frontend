import { NextResponse } from 'next/server';
import { parseLogsFromCsv } from '@/utils/parser';
import { LogCountDto } from '@/types/logsType';
import fs from 'fs/promises';
import path from 'path';
import dayjs from 'dayjs';

export async function GET(request: Request) {
  try {
    console.log('GET request received');
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('startDate', startDate);

    const filePath = path.join(
      process.cwd(),
      'public',
      'data',
      'Spark_2k.log_structured.csv',
    );

    // Read file asynchronously
    const csvText = await fs.readFile(filePath, 'utf-8');
    const logs = parseLogsFromCsv(csvText);

    // Filter logs based on date range if provided
    const filteredLogs =
      startDate && endDate
        ? logs.filter((log) => {
            const logDate = dayjs(
              `${log.Date} ${log.Time}`,
              'YYYY-MM-DD HH:mm:ss',
            );
            return (
              logDate.isValid() &&
              logDate.isAfter(dayjs(startDate)) &&
              logDate.isBefore(dayjs(endDate).add(1, 'day'))
            );
          })
        : logs;

    const counts: LogCountDto = {
      total: filteredLogs.length,
      INFO: 0,
      WARN: 0,
      ERROR: 0,
      DEBUG: 0,
    };

    filteredLogs.forEach((log) => {
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
