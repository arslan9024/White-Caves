// Feature catalog for Willow Backend CRM

export interface BackendFeature {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const WILLOW_BACKEND_FEATURES: BackendFeature[] = [
  {
    id: 'api_management',
    name: 'API Management',
    description: 'RESTful API endpoints monitoring and optimization',
    category: 'core'
  },
  {
    id: 'database_optimization',
    name: 'Database Optimization',
    description: 'MongoDB optimization and performance tuning',
    category: 'performance'
  },
  {
    id: 'caching_strategy',
    name: 'Caching Strategy',
    description: 'Redis caching and cache invalidation',
    category: 'performance'
  },
  {
    id: 'security_monitoring',
    name: 'Security Monitoring',
    description: 'Security checks and vulnerability scanning',
    category: 'security'
  },
  {
    id: 'realtime_connections',
    name: 'Real-time Connections',
    description: 'WebSocket and SSE management',
    category: 'infrastructure'
  }
];
