/**
 * Monitoring & Alerting Configuration
 * Sets up Prometheus, Grafana, and alerting rules for production
 */

// Prometheus configuration
export const PROMETHEUS_CONFIG = {
  global: {
    scrape_interval: '15s',
    evaluation_interval: '15s',
    external_labels: {
      cluster: 'white-caves-prod',
      environment: 'production',
    },
  },

  // Alert managers
  alerting: {
    alertmanagers: [
      {
        static_configs: [
          {
            targets: ['localhost:9093'],
          },
        ],
      },
    ],
  },

  // Rule files
  rule_files: ['alerts.yml', 'recording_rules.yml'],

  // Scrape configurations
  scrape_configs: [
    {
      job_name: 'white-caves-app',
      static_configs: [
        {
          targets: ['localhost:5000'],
        },
      ],
      scrape_interval: '10s',
      scrape_timeout: '5s',
      metrics_path: '/metrics',
    },
    {
      job_name: 'mongodb',
      static_configs: [
        {
          targets: ['localhost:27017'],
        },
      ],
      scrape_interval: '30s',
    },
    {
      job_name: 'redis',
      static_configs: [
        {
          targets: ['localhost:6379'],
        },
      ],
      scrape_interval: '30s',
    },
    {
      job_name: 'node',
      static_configs: [
        {
          targets: ['localhost:9100'],
        },
      ],
      scrape_interval: '15s',
    },
  ],
};

// Alert rules
export const ALERT_RULES = {
  groups: [
    {
      name: 'white-caves-alerts',
      interval: '30s',
      rules: [
        {
          alert: 'ApplicationDown',
          expr: 'up{job="white-caves-app"} == 0',
          for: '1m',
          labels: {
            severity: 'critical',
          },
          annotations: {
            summary: 'White Caves application is down',
            description: 'White Caves app has been unavailable for more than 1 minute',
          },
        },
        {
          alert: 'HighErrorRate',
          expr: 'rate(http_requests_total{status=~"5.."}[5m]) > 0.05',
          for: '5m',
          labels: {
            severity: 'critical',
          },
          annotations: {
            summary: 'High error rate detected',
            description: 'Error rate is {{ $value | humanizePercentage }} for the last 5 minutes',
          },
        },
        {
          alert: 'HighLatency',
          expr: 'histogram_quantile(0.95, http_request_duration_seconds) > 1',
          for: '5m',
          labels: {
            severity: 'warning',
          },
          annotations: {
            summary: 'High latency detected',
            description: 'p95 response time is {{ $value }}s',
          },
        },
        {
          alert: 'DatabaseConnectionLoss',
          expr: 'mongodb_up == 0',
          for: '2m',
          labels: {
            severity: 'critical',
          },
          annotations: {
            summary: 'MongoDB connection lost',
            description: 'Cannot connect to MongoDB for more than 2 minutes',
          },
        },
        {
          alert: 'RedisDown',
          expr: 'redis_up == 0',
          for: '2m',
          labels: {
            severity: 'critical',
          },
          annotations: {
            summary: 'Redis is down',
            description: 'Redis cache is unavailable for more than 2 minutes',
          },
        },
        {
          alert: 'HighMemoryUsage',
          expr: 'node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes < 0.2',
          for: '5m',
          labels: {
            severity: 'warning',
          },
          annotations: {
            summary: 'High memory usage',
            description: 'Available memory is {{ $value | humanizePercentage }}',
          },
        },
        {
          alert: 'HighCPUUsage',
          expr: 'avg(rate(node_cpu_seconds_total{mode!="idle"}[5m])) > 0.8',
          for: '10m',
          labels: {
            severity: 'warning',
          },
          annotations: {
            summary: 'High CPU usage',
            description: 'CPU usage is {{ $value | humanizePercentage }}',
          },
        },
        {
          alert: 'DiskSpaceLow',
          expr: 'node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.15',
          for: '5m',
          labels: {
            severity: 'warning',
          },
          annotations: {
            summary: 'Low disk space',
            description: 'Available disk space is {{ $value | humanizePercentage }}',
          },
        },
        {
          alert: 'CertificateExpirationWarning',
          expr: 'days_until_ssl_certificate_expiration < 30',
          for: '1h',
          labels: {
            severity: 'warning',
          },
          annotations: {
            summary: 'SSL certificate expiring soon',
            description: 'SSL certificate expires in {{ $value }} days',
          },
        },
      ],
    },
  ],
};

// Grafana dashboard configuration
export const GRAFANA_DASHBOARD = {
  dashboard: {
    title: 'White Caves CRM Platform',
    description: 'Production monitoring dashboard for White Caves',
    tags: ['white-caves', 'production', 'monitoring'],
    timezone: 'browser',
    panels: [
      {
        title: 'Application Health',
        targets: [
          {
            expr: 'up{job="white-caves-app"}',
            legendFormat: '{{ instance }}',
          },
        ],
      },
      {
        title: 'Request Rate',
        targets: [
          {
            expr: 'rate(http_requests_total[5m])',
            legendFormat: '{{ method }} {{ path }}',
          },
        ],
      },
      {
        title: 'Response Time (p95)',
        targets: [
          {
            expr: 'histogram_quantile(0.95, http_request_duration_seconds)',
            legendFormat: '{{ path }}',
          },
        ],
      },
      {
        title: 'Error Rate',
        targets: [
          {
            expr: 'rate(http_requests_total{status=~"5.."}[5m])',
            legendFormat: '{{ status }} errors',
          },
        ],
      },
      {
        title: 'CPU Usage',
        targets: [
          {
            expr: 'avg(rate(node_cpu_seconds_total{mode!="idle"}[5m]))',
            legendFormat: 'CPU',
          },
        ],
      },
      {
        title: 'Memory Usage',
        targets: [
          {
            expr: '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100',
            legendFormat: 'Memory %',
          },
        ],
      },
      {
        title: 'Database Connections',
        targets: [
          {
            expr: 'mongodb_connections_current',
            legendFormat: 'MongoDB',
          },
        ],
      },
      {
        title: 'Redis Memory',
        targets: [
          {
            expr: 'redis_memory_used_bytes',
            legendFormat: 'Used',
          },
          {
            expr: 'redis_memory_max_memory_bytes',
            legendFormat: 'Max',
          },
        ],
      },
    ],
  },
};

// Alert severity levels
export const ALERT_SEVERITIES = {
  CRITICAL: {
    level: 0,
    color: '#d63031',
    escalation: 'immediate',
    oncallDelay: 0, // seconds
  },
  WARNING: {
    level: 1,
    color: '#f39c12',
    escalation: '15min',
    oncallDelay: 900, // 15 minutes
  },
  INFO: {
    level: 2,
    color: '#3498db',
    escalation: '1hour',
    oncallDelay: 3600, // 1 hour
  },
};

// Notification channels
export const NOTIFICATION_CHANNELS = {
  slack: {
    enabled: true,
    webhook: process.env.SLACK_WEBHOOK_URL,
    channel: '#white-caves-alerts',
    mentionOnCritical: '@devops-oncall',
  },
  email: {
    enabled: true,
    recipients: ['devops@white-caves.com', 'platform@white-caves.com'],
    criticalRecipients: ['cto@white-caves.com'],
  },
  pagerduty: {
    enabled: true,
    apiKey: process.env.PAGERDUTY_API_KEY,
    escalationPolicy: 'P1234567',
  },
  webhook: {
    enabled: true,
    url: 'https://white-caves.com/alerts/webhook',
  },
};

// SLO targets
export const SERVICE_LEVEL_OBJECTIVES = {
  availability: {
    target: 0.999, // 99.9%
    window: '30d',
    errorBudget: 43.2, // minutes in 30 days
  },
  latency: {
    p95: 500, // ms
    p99: 1000, // ms
  },
  errorRate: {
    target: 0.001, // < 0.1%
  },
};

// Monitoring queries
export const MONITORING_QUERIES = {
  // Application metrics
  applicationMetrics: {
    requestsPerSecond: 'rate(http_requests_total[5m])',
    errorRate: 'rate(http_requests_total{status=~"5.."}[5m])',
    avgResponseTime: 'avg(http_request_duration_seconds)',
    p95ResponseTime:
      'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))',
    p99ResponseTime:
      'histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))',
  },

  // Infrastructure metrics
  infrastructureMetrics: {
    cpuUsage: 'avg(rate(node_cpu_seconds_total{mode!="idle"}[5m]))',
    memoryUsage: '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100',
    diskUsage: '(1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100',
    networkIn: 'rate(node_network_receive_bytes_total[5m])',
    networkOut: 'rate(node_network_transmit_bytes_total[5m])',
  },

  // Database metrics
  databaseMetrics: {
    mongodbConnections: 'mongodb_connections_current',
    mongodbMemory: 'mongodb_memory_resident',
    mongodbQueriesPerSecond: 'rate(mongodb_op_counters_total[5m])',
    mongodbLatency: 'avg(mongodb_command_latencies)',
  },

  // Cache metrics
  cacheMetrics: {
    redisMemory: 'redis_memory_used_bytes',
    redisKeys: 'redis_db_keys',
    redisHitRate:
      'rate(redis_keyspace_hits_total[5m]) / (rate(redis_keyspace_hits_total[5m]) + rate(redis_keyspace_misses_total[5m]))',
    redisEvictions: 'rate(redis_evicted_keys_total[5m])',
  },
};

// Retention policies
export const RETENTION_POLICIES = {
  prometheus: {
    localStorage: '30d',
    remoteStorage: '1y',
  },
  logs: {
    application: '90d',
    database: '30d',
    all: '7d',
  },
  metrics: {
    detailed: '7d',
    hourly: '30d',
    daily: '1y',
  },
};
