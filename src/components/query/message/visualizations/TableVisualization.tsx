'use client';
import { NLVQueryResponse } from '@/types/query';
import { groupAndAggregateData } from './converter';

export default function TableVisualization(
  nlvQueryResponse: NLVQueryResponse,
): React.ReactNode {
  const tableData = convertNLVResponseToTableData(nlvQueryResponse);
  if (!tableData) return null;

  const { columns, data } = tableData;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm whitespace-nowrap text-gray-900"
                >
                  {typeof cell === 'number'
                    ? cell.toLocaleString()
                    : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface TableData {
  columns: string[];
  data: (string | number)[][];
}

const convertNLVResponseToTableData = (
  nlvQueryResponse: NLVQueryResponse,
): TableData | undefined => {
  const grouped = groupAndAggregateData(nlvQueryResponse);
  if (!grouped) return;

  const columns = Object.keys(grouped);
  const data = Object.values(grouped);

  return { columns, data };
};
