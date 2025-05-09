'use client';
import { NLVQueryResponse, AggregationType } from '@/types/query';
import * as dfd from 'danfojs';

export const groupAndAggregateData = (nlvQueryResponse: NLVQueryResponse) => {
  const { data, columns, interpretedQuery } = nlvQueryResponse;

  if (!data || !columns || !interpretedQuery) return [];

  const { group_by = [], aggregation, sort } = interpretedQuery;
  const df = new dfd.DataFrame(data, { columns });
  const processedGroupBy = group_by.map((col) => {
    if (col.includes('tags.')) {
      return col.replace('tags.', '');
    }
    return col;
  });
  // Lấy các cột không phải là group_by và không phải là timestamp
  const nonGroupCols = columns.filter(
    (col) => !processedGroupBy.includes(col) && col !== 'timestamp',
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
  if (processedGroupBy.length === 0) {
    processedGroupBy.push('total');
  }

  // Sort
  const { field, order } = sort || {};
  let sortField = field;
  if (field === 'value') {
    sortField = `value_${(interpretedQuery.aggregation === 'COUNT'
      ? 'SUM'
      : interpretedQuery.aggregation
    ).toLowerCase()}`;
    // Group and aggregate
    const grouped = df.groupby(processedGroupBy).agg(aggOps);
    const sorted = grouped.sortValues(sortField, {
      ascending: order === 'asc',
    });
    return dfd.toJSON(sorted);
  } else if (field === 'time') {
    sortField = 'timestamp';
    const sorted = df
      .sortValues(sortField, {
        ascending: order === 'asc',
      })
      .groupby(processedGroupBy)
      .agg(aggOps);
    return dfd.toJSON(sorted);
  }

  const grouped = df.groupby(processedGroupBy).agg(aggOps);
  return dfd.toJSON(grouped);
};

export const toJSONDataFrame = (nlvQueryResponse: NLVQueryResponse) => {
  const { data, columns } = nlvQueryResponse;
  if (!data || !columns || data.length === 0) return [];
  const df = new dfd.DataFrame(data, { columns });
  return dfd.toJSON(df);
};
