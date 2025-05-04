'use client';
import { NLVQueryResponse } from '@/types/query';
import { Alert } from 'antd';

export default function ErrorVisualization(
  nlvQueryResponse: NLVQueryResponse,
): React.ReactNode {
  const { data } = nlvQueryResponse;
  const errorMessage = data?.[0]?.[0] || 'An error occurred';

  return <Alert message={errorMessage} type="error" showIcon />;
}
