import { NextResponse } from 'next/server';

export type LogEntry = {
  id: string;
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  message: string;
};

const logData: LogEntry[] = [
  {
    id: '1',
    timestamp: '2023-04-29T14:35:42Z',
    level: 'ERROR',
    service: 'api-gateway',
    message: 'Connection refused to authentication service',
  },
  {
    id: '2',
    timestamp: '2023-04-29T14:34:21Z',
    level: 'WARN',
    service: 'user-service',
    message: 'Rate limit exceeded for user id: 12345',
  },
  {
    id: '3',
    timestamp: '2023-04-29T14:33:10Z',
    level: 'INFO',
    service: 'payment-service',
    message: 'Payment processed successfully for order #98765',
  },
  {
    id: '4',
    timestamp: '2023-04-29T14:32:45Z',
    level: 'DEBUG',
    service: 'inventory-service',
    message: 'Stock check completed for SKU: ABC123',
  },
  {
    id: '5',
    timestamp: '2023-04-29T14:31:22Z',
    level: 'ERROR',
    service: 'notification-service',
    message: 'Failed to send email to user@example.com',
  },
  {
    id: '6',
    timestamp: '2023-04-29T14:30:15Z',
    level: 'INFO',
    service: 'auth-service',
    message: 'User logged in: user_id=54321',
  },
  {
    id: '7',
    timestamp: '2023-04-29T14:29:30Z',
    level: 'WARN',
    service: 'database-service',
    message: 'Slow query detected: SELECT * FROM users WHERE...',
  },
  {
    id: '8',
    timestamp: '2023-04-29T14:28:12Z',
    level: 'INFO',
    service: 'api-gateway',
    message: 'Request processed in 235ms: GET /api/users',
  },
  {
    id: '9',
    timestamp: '2023-04-29T14:27:45Z',
    level: 'DEBUG',
    service: 'cache-service',
    message: 'Cache hit for key: user:12345:profile',
  },
  {
    id: '10',
    timestamp: '2023-04-29T14:26:33Z',
    level: 'ERROR',
    service: 'payment-service',
    message: 'Payment gateway timeout for transaction id: tx_789012',
  },
];

export async function GET() {
  return NextResponse.json(logData);
}
