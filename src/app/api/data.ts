import path from 'path';
import fs from 'fs/promises';
import { getLogStats, parseLogsFromCsv } from '@/utils/parser';

const filePath = path.join(
  process.cwd(),
  'public',
  'data',
  'Spark_2k.log_structured.csv',
);

const csvText = await fs.readFile(filePath, 'utf-8');
export const logs = parseLogsFromCsv(csvText);
export const stats = getLogStats(logs);
