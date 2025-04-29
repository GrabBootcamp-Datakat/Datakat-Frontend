export interface ChartData {
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: Array<{
    time?: string;
    value?: number;
    server?: string;
    service?: string;
    errors?: number;
    level?: string;
    count?: number;
  }>;
  config?: {
    xField?: string;
    yField?: string;
    seriesField?: string;
    smooth?: boolean;
    angleField?: string;
    colorField?: string;
  };
}

export interface ChatResponse {
  content: string;
  data?: ChartData | null;
}
