/**
 * Application Monitoring Service — White Caves CRM
 *
 * Collects runtime metrics, health indicators, and performance data:
 *   - Request latency (p50, p95, p99)
 *   - Error rates by endpoint
 *   - Database query timing
 *   - Cache hit/miss ratios
 *   - Memory & CPU usage
 *   - Active connections
 *   - WhatsApp session status
 *
 * Exposes:
 *   GET /api/health         → quick liveness check
 *   GET /api/health/ready   → full readiness probe (DB, cache, WhatsApp)
 *   GET /api/metrics        → Prometheus-compatible text format
 *
 * No external dependencies — upgrade path to Prometheus/Datadog/NewRelic
 * by replacing the export format.
 */

import { createLogger } from '../utils/logger.js';
import type { Request, Response, NextFunction } from 'express';

const log = createLogger('Monitor');

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  version: string;
  checks: {
    database: ComponentHealth;
    cache: ComponentHealth;
    whatsapp: ComponentHealth;
    memory: ComponentHealth;
  };
}

export interface ComponentHealth {
  status: 'up' | 'down' | 'degraded';
  latencyMs?: number;
  details?: Record<string, unknown>;
}

export interface RequestMetrics {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  timestamp: number;
}

interface LatencyBucket {
  count: number;
  totalMs: number;
  minMs: number;
  maxMs: number;
  values: number[]; // Last N for percentile calculation
}

export interface MetricsSummary {
  uptime: number;
  requests: {
    total: number;
    perMinute: number;
    byStatus: Record<string, number>;
    byMethod: Record<string, number>;
    topEndpoints: Array<{ path: string; count: number; avgMs: number }>;
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    avg: number;
  };
  errors: {
    total: number;
    rate: string;
    recent: Array<{ path: string; statusCode: number; timestamp: string }>;
  };
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
    externalMB: number;
  };
  system: {
    nodeVersion: string;
    platform: string;
    cpuUsage: NodeJS.CpuUsage;
  };
}

// ─────────────────────────────────────────────────────────────
// Monitor Service
// ─────────────────────────────────────────────────────────────

const PERCENTILE_WINDOW = 1000; // Keep last N request durations
const RECENT_ERRORS_MAX = 50;

export class MonitorService {
  private startTime = Date.now();
  private requestCount = 0;
  private requestsByStatus: Record<string, number> = {};
  private requestsByMethod: Record<string, number> = {};
  private endpointMetrics = new Map<string, LatencyBucket>();
  private latencyWindow: number[] = [];
  private recentErrors: Array<{ path: string; statusCode: number; timestamp: string }> = [];

  // External health check callbacks
  private healthChecks = new Map<string, () => Promise<ComponentHealth>>();

  constructor() {
    log.info('Monitor service initialized');
  }

  // ─── Request Tracking Middleware ───────────────────────

  /**
   * Express middleware — tracks request latency and status codes.
   * Should be applied early in the middleware chain.
   */
  public middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const start = process.hrtime.bigint();

      res.on('finish', () => {
        const durationNs = Number(process.hrtime.bigint() - start);
        const durationMs = Math.round(durationNs / 1_000_000);

        this.recordRequest({
          method: req.method,
          path: this.normalizePath(req.route?.path || req.path),
          statusCode: res.statusCode,
          durationMs,
          timestamp: Date.now(),
        });
      });

      next();
    };
  }

  /**
   * Record a request metric
   */
  public recordRequest(metric: RequestMetrics): void {
    this.requestCount++;

    // By status
    const statusBucket = `${Math.floor(metric.statusCode / 100)}xx`;
    this.requestsByStatus[statusBucket] = (this.requestsByStatus[statusBucket] || 0) + 1;

    // By method
    this.requestsByMethod[metric.method] = (this.requestsByMethod[metric.method] || 0) + 1;

    // Latency window
    this.latencyWindow.push(metric.durationMs);
    if (this.latencyWindow.length > PERCENTILE_WINDOW) {
      this.latencyWindow.shift();
    }

    // Per-endpoint tracking
    const key = `${metric.method} ${metric.path}`;
    let bucket = this.endpointMetrics.get(key);
    if (!bucket) {
      bucket = { count: 0, totalMs: 0, minMs: Infinity, maxMs: 0, values: [] };
      this.endpointMetrics.set(key, bucket);
    }
    bucket.count++;
    bucket.totalMs += metric.durationMs;
    bucket.minMs = Math.min(bucket.minMs, metric.durationMs);
    bucket.maxMs = Math.max(bucket.maxMs, metric.durationMs);
    bucket.values.push(metric.durationMs);
    if (bucket.values.length > 100) bucket.values.shift();

    // Track errors
    if (metric.statusCode >= 400) {
      this.recentErrors.push({
        path: `${metric.method} ${metric.path}`,
        statusCode: metric.statusCode,
        timestamp: new Date(metric.timestamp).toISOString(),
      });
      if (this.recentErrors.length > RECENT_ERRORS_MAX) {
        this.recentErrors.shift();
      }
    }
  }

  // ─── Health Checks ─────────────────────────────────────

  /**
   * Register a named health check callback
   */
  public registerHealthCheck(name: string, check: () => Promise<ComponentHealth>): void {
    this.healthChecks.set(name, check);
    log.debug(`Health check registered: ${name}`);
  }

  /**
   * Run all health checks and return aggregate status
   */
  public async getHealth(): Promise<HealthCheck> {
    const checks: Record<string, ComponentHealth> = {};

    // Run registered checks in parallel
    const entries = [...this.healthChecks.entries()];
    const results = await Promise.allSettled(
      entries.map(async ([name, check]) => {
        const start = Date.now();
        try {
          const result = await check();
          return { name, result };
        } catch (err) {
          return {
            name,
            result: {
              status: 'down' as const,
              latencyMs: Date.now() - start,
              details: { error: err instanceof Error ? err.message : String(err) },
            },
          };
        }
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        checks[result.value.name] = result.value.result;
      }
    }

    // Memory check (always included)
    const mem = process.memoryUsage();
    const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
    checks.memory = {
      status: heapUsedMB > 512 ? 'degraded' : 'up',
      details: {
        heapUsedMB,
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
        rssMB: Math.round(mem.rss / 1024 / 1024),
      },
    };

    // Determine overall status
    const statuses = Object.values(checks).map(c => c.status);
    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (statuses.some(s => s === 'down')) overall = 'unhealthy';
    else if (statuses.some(s => s === 'degraded')) overall = 'degraded';

    return {
      status: overall,
      uptime: Date.now() - this.startTime,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      checks: checks as HealthCheck['checks'],
    };
  }

  // ─── Metrics ───────────────────────────────────────────

  /**
   * Get comprehensive metrics summary
   */
  public getMetrics(): MetricsSummary {
    const uptimeMs = Date.now() - this.startTime;
    const uptimeMinutes = uptimeMs / 60_000;
    const mem = process.memoryUsage();

    // Top endpoints by request count
    const topEndpoints = [...this.endpointMetrics.entries()]
      .map(([path, bucket]) => ({
        path,
        count: bucket.count,
        avgMs: Math.round(bucket.totalMs / bucket.count),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Error count
    const errorCount = (this.requestsByStatus['4xx'] || 0) + (this.requestsByStatus['5xx'] || 0);

    return {
      uptime: uptimeMs,
      requests: {
        total: this.requestCount,
        perMinute: uptimeMinutes > 0 ? Math.round(this.requestCount / uptimeMinutes) : 0,
        byStatus: { ...this.requestsByStatus },
        byMethod: { ...this.requestsByMethod },
        topEndpoints,
      },
      latency: {
        p50: this.percentile(50),
        p95: this.percentile(95),
        p99: this.percentile(99),
        avg: this.latencyWindow.length > 0
          ? Math.round(this.latencyWindow.reduce((a, b) => a + b, 0) / this.latencyWindow.length)
          : 0,
      },
      errors: {
        total: errorCount,
        rate: this.requestCount > 0 ? `${((errorCount / this.requestCount) * 100).toFixed(2)}%` : '0%',
        recent: this.recentErrors.slice(-10),
      },
      memory: {
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024 * 100) / 100,
        heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024 * 100) / 100,
        rssMB: Math.round(mem.rss / 1024 / 1024 * 100) / 100,
        externalMB: Math.round(mem.external / 1024 / 1024 * 100) / 100,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        cpuUsage: process.cpuUsage(),
      },
    };
  }

  /**
   * Export metrics in Prometheus text exposition format
   */
  public getPrometheusMetrics(): string {
    const m = this.getMetrics();
    const lines: string[] = [];

    lines.push('# HELP whitecaves_uptime_seconds Application uptime in seconds');
    lines.push('# TYPE whitecaves_uptime_seconds gauge');
    lines.push(`whitecaves_uptime_seconds ${Math.round(m.uptime / 1000)}`);

    lines.push('# HELP whitecaves_requests_total Total HTTP requests');
    lines.push('# TYPE whitecaves_requests_total counter');
    lines.push(`whitecaves_requests_total ${m.requests.total}`);

    for (const [status, count] of Object.entries(m.requests.byStatus)) {
      lines.push(`whitecaves_requests_total{status="${status}"} ${count}`);
    }

    lines.push('# HELP whitecaves_request_duration_ms Request latency');
    lines.push('# TYPE whitecaves_request_duration_ms summary');
    lines.push(`whitecaves_request_duration_ms{quantile="0.5"} ${m.latency.p50}`);
    lines.push(`whitecaves_request_duration_ms{quantile="0.95"} ${m.latency.p95}`);
    lines.push(`whitecaves_request_duration_ms{quantile="0.99"} ${m.latency.p99}`);

    lines.push('# HELP whitecaves_memory_heap_used_bytes Heap memory used');
    lines.push('# TYPE whitecaves_memory_heap_used_bytes gauge');
    lines.push(`whitecaves_memory_heap_used_bytes ${Math.round(m.memory.heapUsedMB * 1024 * 1024)}`);

    lines.push('# HELP whitecaves_errors_total Total error responses');
    lines.push('# TYPE whitecaves_errors_total counter');
    lines.push(`whitecaves_errors_total ${m.errors.total}`);

    return lines.join('\n') + '\n';
  }

  // ─── Express Route Handlers ────────────────────────────

  /**
   * GET /api/health — Liveness probe (fast, no dependencies)
   */
  public livenessHandler() {
    return (_req: Request, res: Response): void => {
      res.status(200).json({
        status: 'ok',
        uptime: Date.now() - this.startTime,
        timestamp: new Date().toISOString(),
      });
    };
  }

  /**
   * GET /api/health/ready — Readiness probe (checks dependencies)
   */
  public readinessHandler() {
    return async (_req: Request, res: Response): Promise<void> => {
      const health = await this.getHealth();
      const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
      res.status(statusCode).json(health);
    };
  }

  /**
   * GET /api/metrics — Prometheus-compatible metrics
   */
  public metricsHandler() {
    return (_req: Request, res: Response): void => {
      res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
      res.send(this.getPrometheusMetrics());
    };
  }

  /**
   * GET /api/metrics/json — JSON metrics (for dashboards)
   */
  public metricsJsonHandler() {
    return (_req: Request, res: Response): void => {
      res.json(this.getMetrics());
    };
  }

  // ─── Helpers ───────────────────────────────────────────

  private percentile(p: number): number {
    if (this.latencyWindow.length === 0) return 0;
    const sorted = [...this.latencyWindow].sort((a, b) => a - b);
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)];
  }

  /**
   * Normalize route paths to collapse IDs:
   *   /api/leads/abc123 → /api/leads/:id
   */
  private normalizePath(path: string): string {
    return path
      .replace(/\/[0-9a-f]{24}\b/g, '/:id')         // MongoDB ObjectIds
      .replace(/\/\d+\b/g, '/:id')                    // Numeric IDs
      .replace(/\/[0-9a-f]{8}-[0-9a-f-]{27}\b/g, '/:id'); // UUIDs
  }

  /**
   * Reset all metrics (for testing or periodic reset)
   */
  public reset(): void {
    this.requestCount = 0;
    this.requestsByStatus = {};
    this.requestsByMethod = {};
    this.endpointMetrics.clear();
    this.latencyWindow = [];
    this.recentErrors = [];
    log.info('Metrics reset');
  }
}

// ─────────────────────────────────────────────────────────────
// Singleton
// ─────────────────────────────────────────────────────────────

let instance: MonitorService | null = null;

export function getMonitor(): MonitorService {
  if (!instance) {
    instance = new MonitorService();
  }
  return instance;
}

export const monitor = getMonitor();
