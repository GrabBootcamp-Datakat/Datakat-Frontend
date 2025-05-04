'use client';
import { NLVQueryResponse } from '@/types/query';

export default function ScalarVisualization(
  nlvQueryResponse: NLVQueryResponse,
): React.ReactNode {
  const { data } = nlvQueryResponse;
  if (!data || data.length === 0) return null;

  const value = data[0][0];
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-4xl font-bold text-gray-800">
        {typeof value === 'number' ? value.toLocaleString() : String(value)}
      </div>
    </div>
  );
}
