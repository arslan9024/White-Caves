/**
 * Prometheus Metrics Middleware
 * Exposes application metrics for Prometheus scraping
 */

import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';

// Metric types
interface Counter {
  name: string;
  help: string;
  value: number;
}

interface Gauge {
  name: string;
  help: string;
  value: number;
}

interface Histogram {
  name: string;
  help: string;
  buckets: number[];
  values: Record<string, number>;
}

// Metrics storage
class MetricsCollector {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private requestDurations: Record<string, number[]> = {};

  constructor() {
    // Initialize default metrics
    this.counter('http_requests_total', 0);
    this.counter('http_errors_total', 0);
    this.gauge('http_request_duration_seconds', 0);
    this.gauge('process_uptime_seconds', process.uptime());

    // Update uptime every 10 seconds
    setInterval(() => {
      this.gauge('process_uptime_seconds', process.uptime());
    }, 10000);
  }

  /**
   * Increment counter
   */
  counter(name: string, increment: number = 1): void {
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + increment);
  }

  /**
   * Set gauge value
   */
  gauge(name: string, value: number): void {
    this.gauges.set(name, value);
  }

  /**
   * Record histogram value
   */
  histogram(name: string, value: number): void {
    const values = this.histograms.get(name) || [];
    values.push(value);

    // Keep only last 1000 values to prevent memory bloat
    if (values.length > 1000) {
      values.shift();
    }

    this.histograms.set(name, values);
  }

  /**
   * Get all metrics in Prometheus text format
   */
  getMetrics(): string {
    let output = '';

    // Export counters
    this.counters.forEach((value, name) => {
      output += `# HELP ${name} Application counter metric\n`;
      output += `# TYPE ${name} counter\n`;
      output += `${name} ${value}\n\n`;
    });

    // Export gauges
    this.gauges.forEach((value, name) => {
      output += `# HELP ${name} Application gauge metric\n`;
      output += `# TYPE ${name} gauge\n`;
      output += `${name} ${value}\n\n`;
    });

    // Export histograms
    this.histograms.forEach((values, name) => {
      if (values.length === 0) return;

      output += `# HELP ${name} Application histogram metric\n`;
      output += `# TYPE ${name} histogram\n`;

      // Calculate buckets
      const sorted = values.sort((a, b) => a - b);
      const buckets = [0.001, 0.01, 0.05, 0.1, 0.5, 1.0, 2.5, 5.0, 10.0];
      let bucketIndex = 0;

      for (const bucket of buckets) {
        const count = sorted.filter((v) => v <= bucket).length;
        output += `${name}_bucket{le="${bucket}"} ${count}\n`;
      }

      output += `${name}_bucket{le="+Inf"} ${values.length}\n`;
      output += `${name}_sum ${values.reduce((a, b) => a + b, 0)}\n`;
      output += `${name}_count ${values.length}\n\n`;
    });

    return output;
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }
}

// Global metrics instance
export const metrics = new MetricsCollector();

/**
 * Middleware to collect HTTP metrics
 */
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = performance.now();

  // Hook response finish
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const duration = (performance.now() - startTime) / 1000; // Convert to seconds

    // Record metrics
    metrics.counter('http_requests_total', 1);
    metrics.histogram('http_request_duration_seconds', duration);

    if (res.statusCode >= 400) {
      metrics.counter('http_errors_total', 1);
    }

    // Call original end
    return originalEnd.call(this, chunk, encoding);
  };

  next();
}

/**
 * Metrics endpoint handler
 */
export function metricsHandler(req: Request, res: Response): void {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(metrics.getMetrics());
}

/**
 * Health check endpoint
 */
export function healthCheckHandler(req: Request, res: Response): void {
  const memoryUsage = process.memoryUsage();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
    },
    checks: {
      database: 'connected', // TODO: Implement actual check
      redis: 'connected', // TODO: Implement actual check
      filesystem: 'ok',
    },
    version: '1.0.0',
  });
}

export { MetricsCollector };
