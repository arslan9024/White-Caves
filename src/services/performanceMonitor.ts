/**
 * API Performance Monitor
 * Tracks and reports on API performance metrics and optimization benefits
 */

export interface PerformanceMetric {
  name: string;
  duration: number; // milliseconds
  timestamp: number;
  cached: boolean;
  deduped: boolean;
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  size?: number; // bytes
}

export interface PerformanceStats {
  totalRequests: number;
  cachedRequests: number;
  dedupedRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  cacheHitRate: number; // percentage
  dedupSavings: number; // number of avoided requests
  dataSaved: number; // bytes
  endpoints: Map<string, EndpointStats>;
}

export interface EndpointStats {
  endpoint: string;
  requests: number;
  avgTime: number;
  cacheHits: number;
  dedupHits: number;
  errors: number;
}

/**
 * Performance Monitor Class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics: number = 1000; // Keep last 1000 metrics
  private enabled: boolean = true;
  private startTime: number = Date.now();

  /**
   * Record a performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    if (!this.enabled) {
      return;
    }

    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
    };

    this.metrics.push(fullMetric);

    // Keep only the last N metrics to avoid memory bloat
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log if verbose
    console.log(
      `[Performance] ${metric.name} - ${metric.duration}ms ${
        metric.cached ? '(cached)' : ''
      } ${metric.deduped ? '(deduped)' : ''}`
    );
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get performance statistics
   */
  getStats(): PerformanceStats {
    const stats: PerformanceStats = {
      totalRequests: this.metrics.length,
      cachedRequests: 0,
      dedupedRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      cacheHitRate: 0,
      dedupSavings: 0,
      dataSaved: 0,
      endpoints: new Map(),
    };

    let totalDuration = 0;

    // Process metrics
    this.metrics.forEach((metric) => {
      totalDuration += metric.duration;

      if (metric.cached) {
        stats.cachedRequests++;
      }

      if (metric.deduped) {
        stats.dedupedRequests++;
        stats.dedupSavings++;
      }

      if (metric.status === 'error') {
        stats.failedRequests++;
      }

      if (metric.size) {
        stats.dataSaved += metric.size;
      }

      // Track per-endpoint stats
      if (!stats.endpoints.has(metric.endpoint)) {
        stats.endpoints.set(metric.endpoint, {
          endpoint: metric.endpoint,
          requests: 0,
          avgTime: 0,
          cacheHits: 0,
          dedupHits: 0,
          errors: 0,
        });
      }

      const endpointStats = stats.endpoints.get(metric.endpoint)!;
      endpointStats.requests++;
      endpointStats.avgTime += metric.duration;

      if (metric.cached) {
        endpointStats.cacheHits++;
      }

      if (metric.deduped) {
        endpointStats.dedupHits++;
      }

      if (metric.status === 'error') {
        endpointStats.errors++;
      }
    });

    // Calculate averages
    if (stats.totalRequests > 0) {
      stats.averageResponseTime = totalDuration / stats.totalRequests;
      stats.cacheHitRate = (stats.cachedRequests / stats.totalRequests) * 100;
    }

    // Calculate per-endpoint averages
    stats.endpoints.forEach((endpointStats) => {
      endpointStats.avgTime = endpointStats.avgTime / endpointStats.requests;
    });

    return stats;
  }

  /**
   * Get summary report
   */
  getSummaryReport(): string {
    const stats = this.getStats();
    const uptime = Date.now() - this.startTime;

    const lines = [
      '═════════════════════════════════════════',
      'API Performance Monitor Report',
      '═════════════════════════════════════════',
      '',
      `Uptime: ${(uptime / 1000 / 60).toFixed(2)} minutes`,
      `Total Requests: ${stats.totalRequests}`,
      `Average Response Time: ${stats.averageResponseTime.toFixed(2)}ms`,
      '',
      '📊 Optimization Stats:',
      `  Cached Requests: ${stats.cachedRequests} (${stats.cacheHitRate.toFixed(2)}%)`,
      `  Deduped Requests: ${stats.dedupedRequests}`,
      `  Avoided Requests: ${stats.dedupSavings}`,
      `  Data Saved: ${this.formatBytes(stats.dataSaved)}`,
      '',
      '❌ Errors:',
      `  Failed Requests: ${stats.failedRequests}`,
      `  Error Rate: ${((stats.failedRequests / stats.totalRequests) * 100).toFixed(2)}%`,
      '',
      '🔝 Top Endpoints:',
    ];

    // Sort endpoints by request count
    const sortedEndpoints = Array.from(stats.endpoints.values()).sort(
      (a, b) => b.requests - a.requests
    );

    sortedEndpoints.slice(0, 5).forEach((endpoint) => {
      lines.push(
        `  ${endpoint.endpoint} - ${endpoint.requests} requests, avg ${endpoint.avgTime.toFixed(
          2
        )}ms (${endpoint.cacheHits} cached, ${endpoint.dedupHits} deduped)`
      );
    });

    lines.push('═════════════════════════════════════════');

    return lines.join('\n');
  }

  /**
   * Get detailed endpoint report
   */
  getEndpointReport(endpoint: string): string {
    const stats = this.getStats();
    const endpointStats = stats.endpoints.get(endpoint);

    if (!endpointStats) {
      return `No metrics found for endpoint: ${endpoint}`;
    }

    const lines = [
      `═════════════════════════════════════════`,
      `Endpoint: ${endpoint}`,
      `═════════════════════════════════════════`,
      `Total Requests: ${endpointStats.requests}`,
      `Average Response Time: ${endpointStats.avgTime.toFixed(2)}ms`,
      `Cache Hits: ${endpointStats.cacheHits} (${(
        (endpointStats.cacheHits / endpointStats.requests) *
        100
      ).toFixed(2)}%)`,
      `Dedup Hits: ${endpointStats.dedupHits}`,
      `Errors: ${endpointStats.errors} (${(
        (endpointStats.errors / endpointStats.requests) *
        100
      ).toFixed(2)}%)`,
      `═════════════════════════════════════════`,
    ];

    return lines.join('\n');
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.startTime = Date.now();
    console.log('[Performance] Metrics cleared');
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    console.log(`[Performance] Monitoring ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Export stats as JSON
   */
  exportStats(): string {
    const stats = this.getStats();
    const convertedStats = {
      ...stats,
      endpoints: Array.from(stats.endpoints.values()),
    };
    return JSON.stringify(convertedStats, null, 2);
  }

  /**
   * Get optimization savings summary
   */
  getOptimizationSavings(): {
    requestsSaved: number;
    estimatedTimeSaved: number;
    estimatedBandwidthSaved: string;
  } {
    const stats = this.getStats();

    // Estimate: average response time per request * deduped requests
    const estimatedTimeSaved = stats.dedupedRequests * stats.averageResponseTime;

    // Estimate: average data size * cached requests
    const avgDataSize = stats.dataSaved / Math.max(stats.cachedRequests, 1);
    const estimatedBandwidthSaved =
      (stats.cachedRequests + stats.dedupedRequests) * avgDataSize;

    return {
      requestsSaved: stats.dedupedRequests,
      estimatedTimeSaved: estimatedTimeSaved,
      estimatedBandwidthSaved: this.formatBytes(estimatedBandwidthSaved),
    };
  }

  /**
   * Format bytes to human readable
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();
