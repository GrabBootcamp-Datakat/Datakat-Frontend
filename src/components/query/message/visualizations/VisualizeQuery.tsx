'use client';
import { memo } from 'react';
import { ResultType, NLVQueryResponse } from '@/types/query';
import {
  ChartVisualization,
  TableVisualization,
  LogListVisualization,
  ScalarVisualization,
  ErrorVisualization,
} from './';

export interface VisualizeQueryProps {
  nlvQueryResponse: NLVQueryResponse | undefined;
}

const VisualizeQuery = memo(
  ({ nlvQueryResponse }: VisualizeQueryProps): React.ReactNode => {
    if (!nlvQueryResponse) return null;

    const { resultType } = nlvQueryResponse;

    switch (resultType) {
      case ResultType.TIMESERIES:
        return ChartVisualization(nlvQueryResponse);
      case ResultType.TABLE:
        return TableVisualization(nlvQueryResponse);
      case ResultType.SCALAR:
        return ScalarVisualization(nlvQueryResponse);
      case ResultType.LOG_LIST:
        return LogListVisualization(nlvQueryResponse);
      case ResultType.ERROR:
        return ErrorVisualization(nlvQueryResponse);
      default:
        return null;
    }
  },
);

VisualizeQuery.displayName = 'VisualizeQuery';

export default VisualizeQuery;
