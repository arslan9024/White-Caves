# Monitoring & Alerting Setup Guide

**Status**: Production Ready  
**Version**: 1.0.0  
**Date**: March 22, 2026

---

## Overview

Complete monitoring and alerting infrastructure for White Caves platform:

- **Prometheus**: Time-series metrics database
- **Grafana**: Visualization and dashboards
- **AlertManager**: Alert routing and notifications
- **Custom Metrics**: Application-specific metrics
- **Logging**: Centralized log aggregation
- **Tracing**: Distributed request tracing

---

## Quick Start

### 1. Install Prometheus

```bash
# Docker
docker run -d \
  --name prometheus \
  -p 9090:9090 \
  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus

# Kubernetes
kubectl apply -f monitoring/prometheus-deployment.yaml
```

### 2. Install Grafana

```bash
# Docker
docker run -d \
  --name grafana \
  -p 3000:3000 \
  -e GF_SECURITY_ADMIN_PASSWORD=admin \
  grafana/grafana

# Kubernetes
kubectl apply -f monitoring/grafana-deployment.yaml
```

### 3. Configure Alert Manager

```bash
# Docker
docker run -d \
  --name alertmanager \
  -p 9093:9093 \
  -v $(pwd)/alertmanager.yml:/etc/alertmanager/alertmanager.yml \
  prom/alertmanager

# Kubernetes
kubectl apply -f monitoring/alertmanager-deployment.yaml
```

---

## Metrics Exposed

### Application Metrics (PORT 5000/metrics)

```
http_requests_total              # Total HTTP requests
http_request_duration_seconds    # Request duration histogram
http_errors_total                # Total HTTP errors
process_uptime_seconds           # Application uptime
nodejs_memory_heap_used_bytes    # Heap memory usage
nodejs_memory_external_bytes     # External memory
```

### Infrastructure Metrics (Node Exporter)

```
node_cpu_seconds_total           # CPU time
node_memory_MemAvailable_bytes   # Available memory
node_filesystem_avail_bytes      # Disk space
node_network_receive_bytes_total # Network in
node_network_transmit_bytes_total # Network out
```

### Database Metrics (MongoDB Exporter)

```
mongodb_up                       # MongoDB availability
mongodb_connections_current      # Active connections
mongodb_memory_resident          # Memory usage
mongodb_op_counters_total        # Operation counts
```

### Cache Metrics (Redis Exporter)

```
redis_up                         # Redis availability
redis_memory_used_bytes          # Memory usage
redis_keyspace_hits_total        # Cache hits
redis_keyspace_misses_total      # Cache misses
redis_evicted_keys_total         # Evicted keys
```

---

## Alert Rules

### Critical Alerts

| Alert               | Condition                           | Action         |
| ------------------- | ----------------------------------- | -------------- |
| **ApplicationDown** | `up{job="white-caves"} == 0` for 1m | Immediate page |
| **DatabaseDown**    | `mongodb_up == 0` for 2m            | Immediate page |
| **RedisDown**       | `redis_up == 0` for 2m              | Immediate page |
| **HighErrorRate**   | Error rate > 5% for 5m              | Immediate page |
| **CertExpiring**    | Days until expiry < 30              | Daily email    |

### Warning Alerts

| Alert            | Condition           | Action             |
| ---------------- | ------------------- | ------------------ |
| **HighLatency**  | p95 > 1000ms for 5m | Slack notification |
| **HighMemory**   | Usage > 80% for 5m  | Slack + Email      |
| **HighCPU**      | Usage > 80% for 10m | Slack notification |
| **LowDiskSpace** | Free space < 15%    | Slack + Email      |

---

## Grafana Dashboards

### 1. Application Dashboard

Monitors:

- Request rate
- Response times (p50, p95, p99)
- Error rate
- Request distribution by endpoint

### 2. Infrastructure Dashboard

Monitors:

- CPU usage
- Memory usage
- Disk usage
- Network I/O
- Process metrics

### 3. Database Dashboard

Monitors:

- Connection count
- Operation rates
- Query latency
- Cache statistics

### 4. Business Dashboard

Monitors:

- Active users
- Transactions
- Revenue metrics
- User engagement

---

## Notification Channels

### Slack Integration

```yaml
receivers:
  - name: 'slack'
    slack_configs:
      - api_url: '<your-webhook-url>'
        channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ .CommonAnnotations.description }}'
```

### Email Integration

```yaml
receivers:
  - name: 'email'
    email_configs:
      - to: 'devops@white-caves.com'
        from: 'alerts@white-caves.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'your-email@gmail.com'
        auth_password: 'app-password'
```

### PagerDuty Integration

```yaml
receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: '<your-service-key>'
        description: '{{ .GroupLabels.alertname }}'
```

---

## Custom Dashboards

### Create Custom Dashboard

```bash
# Using Grafana UI
1. Click "+" → Dashboard
2. Add panels with queries
3. Save dashboard
4. Export as JSON

# Using API
curl -X POST http://localhost:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @dashboard.json
```

### Example Prometheus Query

```promql
# Request rate
rate(http_requests_total[5m])

# p95 response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Memory usage
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes
```

---

## Adding Metrics to Application

### In Express App

```typescript
import { metricsMiddleware, metricsHandler } from './metrics';

// Add metrics middleware
app.use(metricsMiddleware);

// Expose metrics endpoint
app.get('/metrics', metricsHandler);
```

### Custom Metrics

```typescript
import { metrics } from './metrics';

// Increment counter
metrics.counter('custom_events_total');

// Set gauge
metrics.gauge('active_users', 42);

// Record histogram (for timing)
metrics.histogram('operation_duration_seconds', timeInSeconds);
```

---

## SLO & Alerting

### Service Level Objectives

```
Availability: 99.9% (43.2 minutes downtime per month)
Latency p95:  < 500ms
Error Rate:   < 0.1%
```

### Error Budget Tracking

```promql
# Error budget remaining
(1 - (requests_errors / requests_total)) * 100
```

---

## Logging Integration

### Structured Logging

```typescript
logger.info('User login', {
  userId: user.id,
  timestamp: Date.now(),
  duration: responseTime,
});
```

### Log Levels

- **ERROR**: Critical failures
- **WARN**: Potential issues
- **INFO**: Important events
- **DEBUG**: Detailed diagnostics

### Centralized Logging

```bash
# ELK Stack
docker-compose up -d elasticsearch logstash kibana

# Or use managed service
# - AWS CloudWatch
# - GCP Cloud Logging
# - DataDog
# - New Relic
```

---

## Performance Monitoring

### Key Metrics

- **Throughput**: Requests per second
- **Latency**: Response time distribution
- **Errors**: Error rate and types
- **Saturation**: Resource utilization

### Capacity Planning

```
Current: 100 req/s at 70% CPU
Growth:  20% per month
Forecast: Need 2x capacity by Q3 2026
```

---

## Incident Response

### Alert Workflow

```
Alert Triggered
    ↓
Notification Sent (Slack, Email, PagerDuty)
    ↓
On-call Engineer Notified
    ↓
Incident Investigation
    ↓
Mitigation & Fix
    ↓
Post-Incident Review
```

### Runbooks

**Application Down**

1. Check health endpoint: `curl /health`
2. Check logs:

`docker logs white-caves` 3. Restart if needed: `docker restart white-caves` 4. If still down, escalate to on-call lead

**High Error Rate**

1. Check error types: `grep "ERROR" logs`
2. Check recent deployments
3. Review database connections
4. Check external service dependencies

---

## Testing Alerts

```bash
# Trigger test alert
curl -X POST http://localhost:9093/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "alerts": [{
      "status": "firing",
      "labels": {
        "alertname": "TestAlert",
        "severity": "critical"
      },
      "annotations": {
        "summary": "This is a test alert"
      }
    }]
  }'
```

---

## Maintenance

### Daily

- [ ] Check alert queue
- [ ] Review error logs
- [ ] Monitor key metrics

### Weekly

- [ ] Review alert rules_accuracy
- [ ] Check dashboard freshness
- [ ] Audit logs

### Monthly

- [ ] Capacity planning review
- [ ] Optimize queries
- [ ] Update documentation
- [ ] Test disaster recovery

---

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
- [AlertManager Guide](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [PromQL Queries](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

**Status**: ✅ Ready for Production Deployment
