# Phase 18 Week 3: Production Monitoring & Observability
## Enterprise-Grade Monitoring Infrastructure Setup

**Date:** March 23-31, 2026  
**Phase:** 18 (Production Hardening & Deployment)  
**Week:** 3 of 4  
**Status:** 🚀 IMPLEMENTATION READY

---

## 📋 Objective

Establish **comprehensive production monitoring, observability, and operational excellence** infrastructure for White Caves platform with real-time dashboards, intelligent alerting, and 24/7 ops support.

### Week 3 Strategic Objectives

**✅ Monitoring Infrastructure Setup** (Days 13-14)
- Application Performance Monitoring (APM)
- Real-time metrics collection
- Centralized dashboard creation
- Baseline metrics establishment

**✅ Log Aggregation & Analysis** (Days 15-16)
- Log pipeline setup (ELK/Cloud)
- Structured logging format
- Log indexing & retention
- Search & filtering capabilities

**✅ Alerting & Incident Response** (Days 17-18)
- Alert rule creation
- Escalation procedures
- On-call rotation setup
- Incident response automation

---

## 🏗️ Monitoring Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  WHITE CAVES MONITORING STACK               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  APPLICATION LAYER                                          │
│  ├─ API Server (Express)          [Instrumented]           │
│  ├─ Frontend (React)               [Web Vitals]            │
│  ├─ Database (MongoDB/PostgreSQL)  [Query metrics]         │
│  └─ Cache Layer (Redis)            [Cache stats]           │
│                                                             │
│  ↓↓↓ METRICS & LOGS COLLECTION ↓↓↓                         │
│                                                             │
│  AGENT/COLLECTOR LAYER                                      │
│  ├─ APM Agents (New Relic/Datadog) [Real-time metrics]    │
│  ├─ Log Collectors (Fluentd/Logstash) [Log streaming]     │
│  ├─ Prometheus Exporters            [Metric export]       │
│  └─ Custom Instrumentation          [Business metrics]    │
│                                                             │
│  ↓↓↓ DATA STORAGE & INDEXING ↓↓↓                           │
│                                                             │
│  BACKEND LAYER                                              │
│  ├─ Metrics Database (InfluxDB/Prometheus) [Time-series] │
│  ├─ Log Storage (Elasticsearch)     [Full-text search]    │
│  ├─ Event Store (Kafka/Pub-Sub)     [Event streaming]     │
│  └─ Trace Storage (Jaeger/Zipkin)   [Distributed tracing] │
│                                                             │
│  ↓↓↓ VISUALIZATION & ALERTING ↓↓↓                          │
│                                                             │
│  PRESENTATION LAYER                                         │
│  ├─ Dashboards (Grafana/Kibana)     [Visual metrics]      │
│  ├─ Alerting Engine (PagerDuty)     [On-call mgmt]        │
│  ├─ Incident Tracking (Jira/Incident.io) [Issues]         │
│  └─ Reporting (Datadog/New Relic)   [Trend analysis]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

```
RECOMMENDED TOOLS:

Option A: Cloud-Native (Recommended for scale)
├─ APM:             New Relic / Datadog
├─ Logs:            Google Cloud Logging / AWS CloudWatch
├─ Metrics:         Cloud Monitoring / Datadog
├─ Traces:          Cloud Trace / Datadog
├─ Dashboard:       GCP Console / Datadog UI
├─ Alerting:        Cloud Alerting / PagerDuty
└─ Cost:            $400-800/month

Option B: Open-Source Stack (Cost-effective)
├─ APM:             Grafana Loki + Tempo
├─ Logs:            Elasticsearch + Kibana (ELK)
├─ Metrics:         Prometheus + Grafana
├─ Traces:          Jaeger / Zipkin
├─ Dashboard:       Grafana
├─ Alerting:        AlertManager + PagerDuty
└─ Cost:            $100-200/month (self-hosted)

Option C: Hybrid (Balanced)
├─ APM:             Grafana Cloud (metrics + logs)
├─ Traces:          Open-source Jaeger
├─ Dashboard:       Grafana
├─ Alerting:        PagerDuty
└─ Cost:            $200-400/month
```

---

## 🎯 Days 13-14: Monitoring Infrastructure Setup

### Day 13: APM & Metrics Collection

#### Step 13.1: Choose & Setup APM Tool

**Option 1: New Relic (Recommended)**

```typescript
// Install New Relic agent
npm install newrelic

// Create newrelic.js configuration
const newrelic = require('newrelic');

export const initNewRelic = () => {
  // Configuration loaded from environment
  // APM dashboards automatically created
  // Distributed tracing enabled
  return newrelic;
};

// In server.ts - must be first require
import 'newrelic';
import express from 'express';
const app = express();
// Rest of setup...
```

**Option 2: Datadog**

```typescript
// Install Datadog agent
npm install dd-trace

// Initialize in entry file
const tracer = require('dd-trace').init({
  hostname: process.env.DD_AGENT_HOST || 'localhost',
  port: parseInt(process.env.DD_TRACE_AGENT_PORT || '8126'),
  env: process.env.NODE_ENV,
  service: 'white-caves-api',
  version: '1.0.0',
  ingestion: {
    enabled: true,
  },
});

export const traceApi = tracer;
```

**Option 3: Open-Source with Grafana Cloud**

```typescript
// Install OpenTelemetry-compatible packages
npm install @opentelemetry/api
npm install @opentelemetry/sdk-node
npm install @opentelemetry/auto-instrumentations-node
npm install @opentelemetry/exporter-prometheus
npm install @opentelemetry/exporter-jaeger

// Initialize OpenTelemetry
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'white-caves-api',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

console.log('OpenTelemetry initialized');
```

#### Step 13.2: Setup Custom Metrics

```typescript
// src/monitoring/metrics.ts
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('white-caves');

// Custom metrics
export const commissionProcessedCounter = meter.createCounter('commissions.processed', {
  description: 'Number of commissions processed',
});

export const commissionDurationHistogram = meter.createHistogram('commission.duration_ms', {
  description: 'Commission processing duration (ms)',
});

export const activeUsersGauge = meter.createObservableGauge(
  'users.active_count',
  {
    description: 'Number of currently active users',
  }
);

export const commissionTypeCounter = meter.createCounter('commissions.by_type', {
  description: 'Commissions by type',
});

// Usage in controllers
export function recordCommissionCreated(type: string, durationMs: number) {
  commissionProcessedCounter.add(1, { type });
  commissionDurationHistogram.record(durationMs, { type });
  commissionTypeCounter.add(1, { commission_type: type });
}
```

#### Step 13.3: Wire Up APM to Express

```typescript
// src/api/middleware/apm.ts
import express from 'express';
import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('white-caves');

const httpRequestDuration = meter.createHistogram('http.request.duration_ms', {
  description: 'HTTP request duration',
});

const httpRequestTotal = meter.createCounter('http.requests.total', {
  description: 'Total HTTP requests',
});

export function apmMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function (data) {
    const duration = Date.now() - startTime;
    
    // Record metrics
    httpRequestTotal.add(1, {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    httpRequestDuration.record(duration, {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });

    // Add timing headers
    res.set('X-Response-Time', `${duration}ms`);

    return originalSend.call(this, data);
  };

  next();
}
```

#### Step 13.4: Setup Prometheus Exporter (for open-source)

```typescript
// src/monitoring/prometheus.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Create metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP request latency',
  labelNames: ['method', 'route', 'status'],
  buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

export const databaseQueryDuration = new Histogram({
  name: 'db_query_duration_ms',
  help: 'Database query duration',
  labelNames: ['query_type', 'table'],
  buckets: [1, 5, 10, 25, 50, 100, 250, 500],
});

export const cacheHitRate = new Gauge({
  name: 'cache_hit_ratio',
  help: 'Cache hit rate (0-1)',
  labelNames: ['cache_name'],
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active database connections',
  labelNames: ['pool'],
});

// Export metrics endpoint
export function setupPrometheus(app: any) {
  app.get('/metrics', (req: any, res: any) => {
    res.set('Content-Type', register.contentType);
    res.end(register.metrics());
  });
}
```

#### Step 13.5: Environment Configuration

```env
# .env.monitoring
# Choose one:
# 1. New Relic
NEW_RELIC_APP_NAME=white-caves-production
NEW_RELIC_LICENSE_KEY=your-license-key
NEW_RELIC_LOG=stdout

# 2. Datadog
DD_TRACE_ENABLED=true
DD_SERVICE=white-caves-api
DD_ENV=production
DD_VERSION=1.0.0
DD_AGENT_HOST=localhost
DD_TRACE_AGENT_PORT=8126

# 3. Grafana Cloud
GRAFANA_CLOUD_PROM_URL=https://prometheus-blocks.grafana.net/api/prom/push
GRAFANA_CLOUD_API_TOKEN=your-token
OTEL_EXPORTER_JAEGER_ENDPOINT=https://tempo-blocks.grafana.net:443/api/traces

# Common
MONITORING_ENABLED=true
METRICS_INTERVAL_SECONDS=60
```

---

### Day 14: Dashboard & Alerting Setup

#### Step 14.1: Create Grafana Dashboard (if open-source)

```json
{
  "dashboard": {
    "title": "White Caves Production Dashboard",
    "tags": ["production", "white-caves"],
    "timezone": "utc",
    "panels": [
      {
        "title": "Request Rate (RPS)",
        "targets": [
          {
            "expr": "rate(http_requests_total[1m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[1m]) / rate(http_requests_total[1m])"
          }
        ],
        "type": "gauge",
        "thresholds": [0.001, 0.01], // 0.1%, 1%
        "colors": ["green", "yellow", "red"]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_ms)"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Database Query Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, db_query_duration_ms)"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Cache Hit Rate",
        "targets": [
          {
            "expr": "cache_hit_ratio"
          }
        ],
        "type": "gauge"
      },
      {
        "title": "Active Connections",
        "targets": [
          {
            "expr": "active_connections"
          }
        ],
        "type": "stat"
      }
    ]
  }
}
```

#### Step 14.2: Create Alert Rules

```yaml
# prometheus-alerts.yml or alerting engine config
groups:
  - name: white-caves
    interval: 1m
    rules:
      # Application alerts
      - alert: HighErrorRate
        expr: |
          (rate(http_requests_total{status=~"5.."}[5m]) / 
           rate(http_requests_total[5m])) > 0.01
        for: 2m
        annotations:
          summary: "Error rate is above 1%"
          description: "Error rate: {{ $value | humanizePercentage }}"
          severity: critical
          runbook: "/runbooks/high-error-rate.md"

      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_ms) > 2000
        for: 3m
        annotations:
          summary: "Response time p95 exceeds 2 seconds"
          description: "p95 latency: {{ $value }}ms"
          severity: warning

      - alert: HighDatabaseLatency
        expr: histogram_quantile(0.95, db_query_duration_ms) > 100
        for: 2m
        annotations:
          summary: "Database query time exceeds 100ms"
          description: "DB p95 latency: {{ $value }}ms"
          severity: warning

      # Infrastructure alerts
      - alert: LowCacheHitRate
        expr: cache_hit_ratio < 0.80
        for: 5m
        annotations:
          summary: "Cache hit rate below 80%"
          description: "Hit rate: {{ $value | humanizePercentage }}"
          severity: warning

      - alert: HighDatabaseConnections
        expr: active_connections > 15
        for: 2m
        annotations:
          summary: "Database connection pool usage high"
          description: "Active: {{ $value }} / 20 connections"
          severity: warning

      - alert: DatabaseConnectionPoolExhausted
        expr: active_connections > 19
        for: 1m
        annotations:
          summary: "Database connection pool nearly exhausted"
          description: "Active: {{ $value }} / 20 connections"
          severity: critical

      # Business alerts
      - alert: CommissionProcessingFailure
        expr: rate(commissions.failed[5m]) > 0.05
        for: 2m
        annotations:
          summary: "Commission processing failure rate high"
          description: "Failure rate: {{ $value | humanizePercentage }}"
          severity: critical

      - alert: PaymentGatewayDown
        expr: payment_service_available == 0
        for: 1m
        annotations:
          summary: "Payment gateway is unavailable"
          severity: critical
          runbook: "/runbooks/payment-gateway-down.md"
```

#### Step 14.3: Setup PagerDuty Integration

```typescript
// src/monitoring/pagerduty.ts
import axios from 'axios';

interface PagerDutyEvent {
  routing_key: string; // Integration key for White Caves service
  event_action: 'trigger' | 'acknowledge' | 'resolve';
  payload: {
    summary: string;
    severity: 'critical' | 'error' | 'warning' | 'info';
    source: string;
    custom_details?: Record<string, any>;
  };
}

export class PagerDutyClient {
  private baseUrl = 'https://events.pagerduty.com/v2/enqueue';
  private integrationKey = process.env.PAGERDUTY_INTEGRATION_KEY;

  async triggerIncident(
    summary: string,
    severity: 'critical' | 'error' | 'warning' | 'info',
    details?: Record<string, any>
  ): Promise<string> {
    const event: PagerDutyEvent = {
      routing_key: this.integrationKey!,
      event_action: 'trigger',
      payload: {
        summary,
        severity,
        source: 'White Caves Monitoring',
        custom_details: {
          ...details,
          timestamp: new Date().toISOString(),
        },
      },
    };

    const response = await axios.post(this.baseUrl, event);
    return response.data.id;
  }

  async acknowledgeIncident(deduplicationKey: string): Promise<void> {
    const event: PagerDutyEvent = {
      routing_key: this.integrationKey!,
      event_action: 'acknowledge',
      payload: {
        summary: 'Acknowledged',
        severity: 'info',
        source: 'White Caves Monitoring',
      },
    };

    await axios.post(this.baseUrl, event);
  }

  async resolveIncident(deduplicationKey: string): Promise<void> {
    const event: PagerDutyEvent = {
      routing_key: this.integrationKey!,
      event_action: 'resolve',
      payload: {
        summary: 'Resolved',
        severity: 'info',
        source: 'White Caves Monitoring',
      },
    };

    await axios.post(this.baseUrl, event);
  }
}

export const pagerDuty = new PagerDutyClient();
```

---

## 🔍 Days 15-16: Log Aggregation & Analysis

### Day 15: ELK Stack Setup (or Cloud Logging)

#### Step 15.1: Install Log Collection

```typescript
// src/services/logging.ts
import winston from 'winston';
import WinstonCloudLogging from '@google-cloud/logging-winston';

const isProduction = process.env.NODE_ENV === 'production';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const transports: winston.transport[] = [
  // Console output (development)
  !isProduction
    ? new winston.transports.Console({
        format: winston.format.colorize(),
      })
    : null,

  // File output
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({
    filename: 'logs/combined.log',
  }),

  // Cloud logging (production)
  isProduction && process.env.GCP_PROJECT_ID
    ? new WinstonCloudLogging({
        projectId: process.env.GCP_PROJECT_ID,
      })
    : null,

  // Elasticsearch transport (if using ELK)
  process.env.ELASTICSEARCH_HOST
    ? new ElasticsearchTransport({
        clientOpts: {
          host: process.env.ELASTICSEARCH_HOST,
          port: parseInt(process.env.ELASTICSEARCH_PORT || '9200'),
        },
        index: 'white-caves-logs',
      })
    : null,
].filter((t): t is winston.transport => t !== null);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
});
```

#### Step 15.2: Structured Logging Format

```typescript
// src/utils/structuredLogging.ts
export interface LogContext {
  userId?: string;
  requestId?: string;
  sessionId?: string;
  action: string;
  resource?: string;
  metadata?: Record<string, any>;
  severity: 'debug' | 'info' | 'warning' | 'error' | 'critical';
}

export function logStructured(context: LogContext, message: string) {
  logger.log({
    level: context.severity,
    message,
    timestamp: new Date().toISOString(),
    ...context,
    environment: process.env.NODE_ENV,
  });
}

// Usage examples
logStructured(
  {
    action: 'commission.created',
    resource: 'commission',
    userId: commissionData.freelancerId,
    severity: 'info',
    metadata: {
      commissionId: commission.id,
      amount: commission.amount,
      status: commission.status,
    },
  },
  `Commission created: ${commission.id}`
);
```

#### Step 15.3: Log Retention Policy

```typescript
// Environment configuration
export const LOG_CONFIG = {
  retention: {
    debug: 7,      // 7 days
    info: 30,      // 30 days
    warning: 90,   // 90 days
    error: 365,    // 1 year
    critical: -1,  // Forever
  },
  
  fileSize: {
    maxSize: '100m', // 100 MB per file
    maxFiles: 14,     // Keep 14 files (max 1.4 GB)
    compress: true,   // Gzip old files
  },

  elasticsearch: {
    indexPattern: 'white-caves-logs-{YYYY.MM.DD}',
    lifecycle: {
      hotPhase: 1,        // 1 day
      warmPhase: 7,       // 7 days
      deletePhase: 90,    // Delete after 90 days
    },
  },
};
```

#### Step 15.4: Kibana Dashboard Setup (ELK only)

```json
{
  "dashboard": {
    "title": "White Caves Log Analysis",
    "panels": [
      {
        "title": "Error Rate Over Time",
        "visualization": {
          "type": "histogram",
          "query": "level: error",
          "timeField": "@timestamp"
        }
      },
      {
        "title": "Top Errors",
        "visualization": {
          "type": "table",
          "query": "level: error",
          "aggregation": {
            "terms": "error_type",
            "size": 10
          }
        }
      },
      {
        "title": "User Actions",
        "visualization": {
          "type": "table",
          "query": "action: *",
          "fields": ["@timestamp", "userId", "action", "resource"]
        }
      },
      {
        "title": "API Request Trace",
        "visualization": {
          "type": "table",
          "query": "requestId: *",
          "fields": ["@timestamp", "requestId", "method", "path", "responseTime"]
        }
      }
    ]
  }
}
```

### Day 16: Distributed Tracing Setup

#### Step 16.1: Jaeger Tracing Integration

```typescript
// src/monitoring/tracing.ts
import { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

export function initTracing() {
  const jaegerExporter = new JaegerExporter({
    endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
  });

  const tracerProvider = new BasicTracerProvider();
  tracerProvider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));

  // For development: also log to console
  if (process.env.NODE_ENV === 'development') {
    tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  }

  registerInstrumentations({
    tracerProvider,
    instrumentations: [
      new HttpInstrumentation(),
      new DatabaseInstrumentation(),
      new RedisInstrumentation(),
    ],
  });

  return tracerProvider;
}
```

#### Step 16.2: Custom Trace Spans

```typescript
// src/api/middleware/tracing.ts
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('white-caves');

export async function traceCommissionProcessing(
  commissionId: string,
  fn: () => Promise<any>
) {
  const span = tracer.startSpan('commission.processing', {
    attributes: {
      'commission.id': commissionId,
      'service.name': 'white-caves',
    },
  });

  try {
    const result = await fn();
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error as Exception);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}
```

---

## 📊 Days 17-18: Alerting & Incident Response

### Day 17: Alert Rules & Escalation

#### Step 17.1: Alert Severity Mapping

```typescript
// src/monitoring/alerts.ts
export enum AlertSeverity {
  CRITICAL = 'critical',    // Page on-call immediately
  HIGH = 'high',            // Urgently notify team
  MEDIUM = 'medium',        // Email + Slack notification
  LOW = 'low',              // Log only
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: string;        // Prometheus/metric query
  threshold: number;
  duration: string;         // "5m", "10m", etc.
  severity: AlertSeverity;
  escalationPolicy: string; // PagerDuty escalation policy ID
  actions: AlertAction[];
}

export interface AlertAction {
  type: 'pagerduty' | 'slack' | 'email' | 'webhook';
  target: string;           // Integration key, channel, email, URL
  template?: string;        // Message template
}

export const ALERT_RULES: AlertRule[] = [
  {
    id: 'error-rate-high',
    name: 'Error Rate High',
    description: 'Application error rate exceeds 1%',
    condition: '(rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])) > 0.01',
    threshold: 0.01,
    duration: '2m',
    severity: AlertSeverity.CRITICAL,
    escalationPolicy: 'P1234567890', // PagerDuty policy ID
    actions: [
      { type: 'pagerduty', target: 'white-caves-production' },
      { type: 'slack', target: '#incidents' },
    ],
  },
  {
    id: 'response-time-high',
    name: 'Response Time Too High',
    description: 'API response time (p95) exceeds 2 seconds',
    condition: 'histogram_quantile(0.95, http_request_duration_ms) > 2000',
    threshold: 2000,
    duration: '3m',
    severity: AlertSeverity.HIGH,
    escalationPolicy: 'P0987654321',
    actions: [
      { type: 'slack', target: '#performance' },
      { type: 'email', target: 'devops-team@whitecaves.com' },
    ],
  },
  {
    id: 'database-connection-pool-exhausted',
    name: 'Database Connection Pool Exhausted',
    description: 'Connection pool usage exceeds 95%',
    condition: 'active_connections > 19',  // 19/20
    threshold: 19,
    duration: '1m',
    severity: AlertSeverity.CRITICAL,
    escalationPolicy: 'P1234567890',
    actions: [
      { type: 'pagerduty', target: 'white-caves-production' },
      { type: 'slack', target: '#database' },
    ],
  },
];
```

#### Step 17.2: Slack Integration for Alerts

```typescript
// src/integrations/slack.ts
import { WebClient, WebAPICallError } from '@slack/web-api';

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function notifySlack(
  channel: string,
  title: string,
  description: string,
  severity: AlertSeverity,
  details: Record<string, string> = {}
) {
  const colors = {
    [AlertSeverity.CRITICAL]: 'danger',      // Red
    [AlertSeverity.HIGH]: 'warning',          // Orange
    [AlertSeverity.MEDIUM]: '#0099ff',        // Blue
    [AlertSeverity.LOW]: 'good',              // Green
  };

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `🚨 ${severity.toUpperCase()}: ${title}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: description,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      fields: Object.entries(details).map(([key, value]) => ({
        type: 'mrkdwn',
        text: `*${key}:*\n${value}`,
      })),
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View Dashboard',
          },
          url: `${process.env.GRAFANA_URL}/d/white-caves-prod`,
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View Logs',
          },
          url: `${process.env.KIBANA_URL}/app/discover#?query=severity:error`,
        },
      ],
    },
  ];

  try {
    await slackClient.chat.postMessage({
      channel,
      blocks,
    });
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
  }
}
```

### Day 18: On-Call & Incident Response Setup

#### Step 18.1: On-Call Rotation Setup (PagerDuty)

```json
{
  "escalation_policy": {
    "id": "P1234567890",
    "name": "White Caves Critical",
    "escalation_rules": [
      {
        "id": 1,
        "escalation_delay_in_minutes": 0,
        "targets": [
          {
            "id": "PQWXYZ1",
            "type": "schedule_reference",
            "summary": "Platform On-Call (Tier 1)"
          }
        ]
      },
      {
        "id": 2,
        "escalation_delay_in_minutes": 15,
        "targets": [
          {
            "id": "PQWXYZ2",
            "type": "schedule_reference",
            "summary": "Engineering Manager (Tier 2)"
          }
        ]
      },
      {
        "id": 3,
        "escalation_delay_in_minutes": 30,
        "targets": [
          {
            "id": "PQWXYZ3",
            "type": "schedule_reference",
            "summary": "Director of Engineering (Tier 3)"
          }
        ]
      }
    ]
  },
  "schedules": [
    {
      "id": "PQWXYZ1",
      "name": "Platform On-Call (Tier 1)",
      "time_zone": "UTC",
      "layers": [
        {
          "name": "Monday-Friday 09:00-17:00",
          "rotation_virtual_start": "2026-03-01T09:00:00Z",
          "rotation_turn_length_seconds": 86400,
          "users": [
            "P12345ABC",
            "P12345DEF",
            "P12345GHI"
          ]
        },
        {
          "name": "After-hours",
          "rotation_virtual_start": "2026-03-01T17:00:00Z",
          "rotation_turn_length_seconds": 604800,
          "users": [
            "P12345JKL",
            "P12345MNO"
          ]
        }
      ]
    }
  ]
}
```

#### Step 18.2: Incident Response Runbook

```markdown
# Incident Response Runbook

## High Error Rate (>1%)

### Detection
- Alert: `error-rate-high`
- Page will be sent to on-call engineer

### Immediate Actions (First 5 minutes)
1. [ ] Acknowledge incident in PagerDuty
2. [ ] Join incident war room Slack channel
3. [ ] Check recent deployments (any changes in last 30m?)
4. [ ] Check application logs for errors
5. [ ] Check database performance metrics

### Investigation (Minutes 5-15)
1. [ ] Identify error type distribution
   ```
   Query in Kibana:
   level: error | top 5 error_type
   ```

2. [ ] Check if errors are user-facing or internal
3. [ ] Isolate affected endpoints
   ```
   Grafana metric:
   rate(http_requests_total{status=~"5.."}[1m])
   ```

4. [ ] Check system resources
   - CPU utilization
   - Memory usage
   - Database connections

### Remediation Options

**Option A: Rollback (if recent deployment)**
```bash
# Contact DevOps engineer to execute rollback
# Typical time: 5-10 minutes
```

**Option B: Scaling (if resource issue)**
```bash
# If CPU/Memory high, scale horizontally
kubectl scale deployment white-caves-api --replicas=5
```

**Option C: Traffic Diversion (if specific endpoint)**
```bash
# If one endpoint is failing, divert traffic
# Update load balancer rules (DevOps)
```

### Escalation
- At 10 min with no solution → escalate to manager
- At 20 min with no solution → escalate to director

### Resolution Checklist
- [ ] Error rate returned to <0.1%
- [ ] No spike in user complaints
- [ ] Root cause identified
- [ ] Fix committed or hotfix deployed
- [ ] Postmortem scheduled (within 24h)

### Postmortem Template
- Timeline of events
- Root cause analysis
- Immediate fix applied
- Long-term prevention measures
- Action items assigned
```

#### Step 18.3: Automated Remediation Actions

```typescript
// src/monitoring/automated-remediation.ts
export class AutomatedRemediationEngine {
  async handleHighErrorRate(metrics: Metrics) {
    // 1. Check if it's a known pattern
    if (this.isKnownIssue(metrics)) {
      return await this.executeAutoFix(metrics.issueId);
    }

    // 2. Try auto-scaling
    if (this.isResourceIssue(metrics)) {
      await this.scaleUp();
      return;
    }

    // 3. Isolate affected endpoints
    if (this.isEndpointSpecific(metrics)) {
      await this.divertTraffic(metrics.affectedEndpoint);
      return;
    }

    // 4. Clear caches if stale data detected
    if (this.isDataIssue(metrics)) {
      await this.clearCaches();
      return;
    }

    // 5. If none of above, escalate to on-call
    await this.escalateToOnCall('High error rate - needs investigation');
  }

  private async executeAutoFix(issueId: string) {
    // Execute known fix for this issue
    const fix = this.knownFixes.get(issueId);
    if (fix) {
      await fix.execute();
      return true;
    }
    return false;
  }

  private async scaleUp() {
    // Increase replica count
    // Typically takes 1-2 minutes for pods to become ready
    await this.kubernetesClient.scale('white-caves-api', 5);
  }

  private async divertTraffic(endpoint: string) {
    // Temporarily disable endpoint in load balancer
    // Users will get 503 error but won't affect other endpoints
    await this.loadBalancer.removeBackend(endpoint);
  }

  private async clearCaches() {
    // Clear Redis cache for potentially stale data
    await this.redis.flushAll();
  }
}
```

---

## 🎯 Monitoring & Observability Checklist (Days 13-18)

### APM & Metrics
- [ ] APM tool installed (New Relic, Datadog, or OpenTelemetry)
- [ ] Service instrumented for metrics collection
- [ ] Custom metrics defined for business logic
- [ ] Metrics exporter configured
- [ ] Prometheus scrape jobs configured (if open-source)
- [ ] Grafana dashboards created
- [ ] All 4 golden signals monitored

### Logging & Analysis
- [ ] Logging library configured (Winston)
- [ ] Structured logging format implemented
- [ ] Log collectors sending to storage (ELK/Cloud)
- [ ] Kibana/Cloud Log dashboards created
- [ ] Log retention policies configured
- [ ] Log search & filtering tested
- [ ] Audit logs being captured

### Tracing & Debugging
- [ ] Distributed tracing enabled (Jaeger/Cloud Trace)
- [ ] Request IDs flowing through services
- [ ] Database query tracing enabled
- [ ] Cache hits/misses tracked
- [ ] Full request traces queryable

### Alerting & Escalation
- [ ] Alert rules defined (8+ critical rules)
- [ ] PagerDuty integration configured
- [ ] Slack integration configured
- [ ] Email notifications setup
- [ ] Escalation policies defined
- [ ] On-call rotation activated
- [ ] Alert testing completed

### Incident Response
- [ ] Runbooks created (5+ major scenarios)
- [ ] Automated remediation rules configured
- [ ] Incident war room procedures documented
- [ ] Communication templates ready
- [ ] Post-incident review process defined
- [ ] Team trained on response procedures

### Dashboard Setup
- [ ] Production dashboard created
- [ ] Service health dashboard
- [ ] Business metrics dashboard
- [ ] Performance trends dashboard
- [ ] Error analysis dashboard
- [ ] Infrastructure dashboard
- [ ] On-call dashboard (PagerDuty)

---

## 🚀 Success Criteria (Week 3 End)

### Monitoring Operational
```
✅ All 4 golden signals monitored (latency, traffic, errors, saturation)
✅ 99%+ of requests instrumented for observability
✅ Real-time dashboards live and accessible
✅ Alerting system functional (tested)
✅ Logs centralized and searchable
✅ Distributed traces captured for all requests
✅ On-call team confident in procedures
```

### Team Ready
```
✅ Operations team trained on dashboards
✅ Engineering team knows how to debug issues
✅ On-call engineer equipped with runbooks
✅ Escalation procedures practiced
✅ Team can respond to critical incident in <5 minutes
```

### Performance Baseline
```
✅ Normal performance metrics captured
✅ Historical trends established
✅ Alert thresholds set appropriately
✅ Performance budget defined
✅ Capacity planning metrics ready
```

---

## 📊 Monitoring Architecture Summary

```
WHITE CAVES PRODUCTION MONITORING (Week 3 Complete)

Metrics Collection:
├─ APM Agent (New Relic/Datadog/OpenTelemetry)
├─ Prometheus Metrics Export
├─ Custom Business Metrics
└─ Infrastructure Metrics (CPU, Memory, Disk)

Log Aggregation:
├─ Winston Logger (structured logging)
├─ Elasticsearch/Cloud Logging Storage
├─ Kibana/Cloud Interface
└─ 90-day retention

Tracing:
├─ Distributed Trace IDs
├─ Request-level tracing
├─ Jaeger/Cloud Trace Storage
└─ Service dependency mapping

Alerting:
├─ Prometheus AlertManager / Grafana Alerts
├─ PagerDuty Integration
├─ Slack/Email Notifications
└─ 8+ Critical Rules Active

Dashboards:
├─ Grafana/Cloud Console
├─ Service Health Dashboard
├─ Business Metrics Dashboard
├─ On-Call Dashboard
└─ Auto-refresh (30-second intervals)

Incident Response:
├─ PagerDuty On-Call
├─ Runbooks Created
├─ War Room Procedures
├─ Automated Remediation
└─ Post-Incident Reviews

Team Enablement:
├─ Training Completed
├─ Runbooks Documented
├─ Playbooks Created
└─ 24/7 Coverage Established
```

---

**Status:** 🚀 MONITORING INFRASTRUCTURE READY FOR WEEK 3-4 IMPLEMENTATION

**Timeline:** March 23-31, 2026 (Days 13-18)

**Next Steps:**
1. Choose monitoring tool (New Relic/Datadog/OpenSource)
2. Set up APM agent on application
3. Create initial dashboards
4. Define alert rules
5. Test escalation procedures
6. Train team on monitoring

---

**Phase 18, Week 3 - Production Monitoring & Observability**  
**Enterprise-Grade Monitoring Infrastructure**  
**Generated:** March 8, 2026
