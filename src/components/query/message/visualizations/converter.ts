'use client';
import { NLVQueryResponse, AggregationType } from '@/types/query';
import * as dfd from 'danfojs';

export const groupAndAggregateData = (nlvQueryResponse: NLVQueryResponse) => {
  const { data, columns, interpretedQuery } = nlvQueryResponse;

  if (!data || !columns || !interpretedQuery) return [];

  const { group_by = [], aggregation } = interpretedQuery;
  const df = new dfd.DataFrame(data, { columns });

  // Lấy các cột không phải là group_by và không phải là timestamp
  const nonGroupCols = columns.filter(
    (col) => !group_by.includes(col) && col !== 'timestamp',
  );

  // Tạo một object chứa các phép tính aggregation
  const aggOps: Record<string, string> = {};
  nonGroupCols.forEach((col) => {
    switch (aggregation) {
      case AggregationType.COUNT:
        aggOps[col] = 'sum';
        break;
      case AggregationType.SUM:
        aggOps[col] = 'sum';
        break;
      case AggregationType.AVG:
        aggOps[col] = 'mean';
        break;
      default:
        aggOps[col] = 'count';
    }
  });

  // Không có group_by: trả trực tiếp theo loại aggregation
  if (group_by.length === 0) {
    group_by.push('total');
  }
  // Group and aggregate
  const grouped = df.groupby(group_by).agg(aggOps);
  return dfd.toJSON(grouped);
};

export const toJSONDataFrame = (nlvQueryResponse: NLVQueryResponse) => {
  const { data, columns } = nlvQueryResponse;
  if (!data || !columns || data.length === 0) return [];
  const df = new dfd.DataFrame(data, { columns });
  return dfd.toJSON(df);
};
