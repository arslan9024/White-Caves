// Backend engineering data for Willow Backend CRM

export interface APIEndpoint {
  path: string;
  method: string;
  avgTime: number;
  successRate: number;
  calls: number;
  cached: boolean;
}

export interface DatabaseMetrics {
  connections: { current: number; max: number; available: number };
  queryPerformance: { avgTime: number; slowQueries: number; indexHits: number };
  storage: { used: number; total: number; percentage: number };
  operations: { reads: number; writes: number; updates: number; deletes: number };
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  memoryUsed: number;
  memoryTotal: number;
  ttlAvg: number;
}

export interface SecurityCheck {
  name: string;
  status: string;
  lastCheck: string;
}

export interface RealtimeConnection {
  type: string;
  active: number;
  peak: number;
  status: string;
}

export const API_ENDPOINTS: APIEndpoint[] = [
  { path: '/api/properties', method: 'GET', avgTime: 125, successRate: 99.8, calls: 15420, cached: true },
  { path: '/api/leads', method: 'POST', avgTime: 89, successRate: 99.9, calls: 8934, cached: false },
  { path: '/api/whatsapp/send', method: 'POST', avgTime: 245, successRate: 98.5, calls: 12567, cached: false },
  { path: '/api/payments/process', method: 'POST', avgTime: 312, successRate: 99.7, calls: 3421, cached: false },
  { path: '/api/users/auth', method: 'POST', avgTime: 156, successRate: 99.95, calls: 28934, cached: true },
  { path: '/api/inventory', method: 'GET', avgTime: 178, successRate: 99.6, calls: 9823, cached: true },
  { path: '/api/analytics', method: 'GET', avgTime: 234, successRate: 99.4, calls: 4521, cached: true }
];

export const DATABASE_METRICS: DatabaseMetrics = {
  connections: { current: 12, max: 100, available: 88 },
  queryPerformance: { avgTime: 45, slowQueries: 3, indexHits: 98.2 },
  storage: { used: 2.4, total: 10, percentage: 24 },
  operations: { reads: 45230, writes: 12450, updates: 8920, deletes: 1230 }
};

export const CACHE_STATS: CacheStats = {
  hitRate: 94.5,
  missRate: 5.5,
  totalHits: 234567,
  totalMisses: 13245,
  memoryUsed: 512,
  memoryTotal: 1024,
  ttlAvg: 3600
};

export const SECURITY_CHECKS: SecurityCheck[] = [
  { name: 'SSL/TLS Configuration', status: 'pass', lastCheck: '2 hours ago' },
  { name: 'JWT Token Validation', status: 'pass', lastCheck: '1 hour ago' },
  { name: 'Rate Limiting', status: 'pass', lastCheck: '30 mins ago' },
  { name: 'Input Sanitization', status: 'pass', lastCheck: '1 hour ago' },
  { name: 'CORS Policy', status: 'warning', lastCheck: '2 hours ago' },
  { name: 'SQL Injection Prevention', status: 'pass', lastCheck: '1 hour ago' }
];

export const REALTIME_CONNECTIONS: RealtimeConnection[] = [
  { type: 'WebSocket', active: 45, peak: 120, status: 'healthy' },
  { type: 'Server-Sent Events', active: 23, peak: 56, status: 'healthy' },
  { type: 'Long Polling', active: 12, peak: 34, status: 'degraded' }
];
