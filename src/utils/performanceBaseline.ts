/**
 * Performance Testing & Baseline Configuration
 * Defines performance targets and monitoring utilities
 */

export interface PerformanceBaseline {
  name: string;
  metric: string;
  target: number;
  unit: string;
  threshold: 'hard' | 'soft'; // hard = must meet, soft = warning
  description: string;
}

export interface PerformanceMetrics {
  initialLoadTime: number;
  filterApplyTime: number;
  exportGenerationTime: number;
  cacheHitRate: number;
  deduplicationRate: number;
  memoryUsage: number;
  errorRate: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
}

/**
 * Performance baselines for the dashboard
 * All targets are based on real-world testing and user expectations
 */
export const PERFORMANCE_BASELINES: PerformanceBaseline[] = [
  {
    name: 'Initial Data Load',
    metric: 'initialLoadTime',
    target: 2000,
    unit: 'ms',
    threshold: 'hard',
    description: 'Time to load and display first set of KPI cards',
  },
  {
    name: 'Filter Application',
    metric: 'filterApplyTime',
    target: 1000,
    unit: 'ms',
    threshold: 'hard',
    description: 'Time to apply filter and reload data',
  },
  {
    name: 'Data Export',
    metric: 'exportGenerationTime',
    target: 1000,
    unit: 'ms',
    threshold: 'hard',
    description: 'Time to generate and download exported file',
  },
  {
    name: 'Cache Hit Rate',
    metric: 'cacheHitRate',
    target: 70,
    unit: '%',
    threshold: 'soft',
    description: 'Percentage of requests served from cache',
  },
  {
    name: 'Request Deduplication',
    metric: 'deduplicationRate',
    target: 80,
    unit: '%',
    threshold: 'soft',
    description: 'Percentage of duplicate requests eliminated',
  },
  {
    name: 'Memory Usage',
    metric: 'memoryUsage',
    target: 50,
    unit: 'MB',
    threshold: 'soft',
    description: 'Peak memory usage during normal operations',
  },
  {
    name: 'API Error Rate',
    metric: 'errorRate',
    target: 1,
    unit: '%',
    threshold: 'hard',
    description: 'Percentage of API requests that fail',
  },
  {
    name: 'Average Response Time',
    metric: 'averageResponseTime',
    target: 500,
    unit: 'ms',
    threshold: 'hard',
    description: 'Average API response time',
  },
  {
    name: 'P95 Response Time',
    metric: 'p95ResponseTime',
    target: 1500,
    unit: 'ms',
    threshold: 'soft',
    description: '95th percentile of API response times',
  },
  {
    name: 'P99 Response Time',
    metric: 'p99ResponseTime',
    target: 3000,
    unit: 'ms',
    threshold: 'soft',
    description: '99th percentile of API response times',
  },
];

/**
 * Performance monitoring system
 * Tracks metrics and compares against baselines
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private startTimes: Map<string, number> = new Map();
  private cacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
  };
  private deduplicationStats = {
    deduplicated: 0,
    total: 0,
  };
  private errorStats = {
    errors: 0,
    total: 0,
  };

  /**
   * Start timing a metric
   */
  startTimer(label: string): void {
    this.startTimes.set(label, performance.now());
  }

  /**
   * End timing and record metric
   */
  endTimer(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`No start time found for label: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.recordMetric(label, duration);
    this.startTimes.delete(label);

    return duration;
  }

  /**
   * Record a metric value
   */
  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);
  }

  /**
   * Record cache hit
   */
  recordCacheHit(): void {
    this.cacheStats.hits++;
    this.cacheStats.totalRequests++;
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(): void {
    this.cacheStats.misses++;
    this.cacheStats.totalRequests++;
  }

  /**
   * Record request deduplication
   */
  recordDeduplication(count: number = 1): void {
    this.deduplicationStats.deduplicated += count;
    this.deduplicationStats.total++;
  }

  /**
   * Record error
   */
  recordError(): void {
    this.errorStats.errors++;
    this.errorStats.total++;
  }

  /**
   * Record successful request
   */
  recordSuccess(): void {
    this.errorStats.total++;
  }

  /**
   * Get average for a metric
   */
  getAverage(label: string): number {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Get percentile for a metric
   */
  getPercentile(label: string, percentile: number): number {
    const values = (this.metrics.get(label) || []).sort((a, b) => a - b);
    if (values.length === 0) return 0;

    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[Math.max(0, index)];
  }

  /**
   * Get min value for a metric
   */
  getMin(label: string): number {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return 0;
    return Math.min(...values);
  }

  /**
   * Get max value for a metric
   */
  getMax(label: string): number {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return 0;
    return Math.max(...values);
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): PerformanceMetrics {
    return {
      initialLoadTime: this.getAverage('initialLoadTime'),
      filterApplyTime: this.getAverage('filterApplyTime'),
      exportGenerationTime: this.getAverage('exportGenerationTime'),
      cacheHitRate: this.getCacheHitRate(),
      deduplicationRate: this.getDeduplicationRate(),
      memoryUsage: this.getMemoryUsage(),
      errorRate: this.getErrorRate(),
      averageResponseTime: this.getAverage('responseTime'),
      p95ResponseTime: this.getPercentile('responseTime', 95),
      p99ResponseTime: this.getPercentile('responseTime', 99),
    };
  }

  /**
   * Get cache hit rate percentage
   */
  getCacheHitRate(): number {
    if (this.cacheStats.totalRequests === 0) return 0;
    return (
      (this.cacheStats.hits / this.cacheStats.totalRequests) * 100
    );
  }

  /**
   * Get deduplication rate percentage
   */
  getDeduplicationRate(): number {
    if (this.deduplicationStats.total === 0) return 0;
    return (
      (this.deduplicationStats.deduplicated /
        this.deduplicationStats.total) *
      100
    );
  }

  /**
   * Get error rate percentage
   */
  getErrorRate(): number {
    if (this.errorStats.total === 0) return 0;
    return (this.errorStats.errors / this.errorStats.total) * 100;
  }

  /**
   * Get memory usage in MB
   */
  getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && performance.memory) {
      return performance.memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  /**
   * Compare metrics against baselines
   */
  compareWithBaselines(): Array<{
    baseline: PerformanceBaseline;
    actual: number;
    passed: boolean;
    difference: number;
    percentDifference: number;
  }> {
    const metrics = this.getAllMetrics();

    return PERFORMANCE_BASELINES.map((baseline) => {
      const actual = metrics[baseline.metric as keyof PerformanceMetrics] || 0;
      const difference = actual - baseline.target;
      const percentDifference = (difference / baseline.target) * 100;

      let passed = false;
      if (baseline.metric.includes('Rate')) {
        // For rates, actual should be >= target
        passed = actual >= baseline.target;
      } else {
        // For times and usage, actual should be <= target
        passed = actual <= baseline.target;
      }

      return {
        baseline,
        actual,
        passed,
        difference,
        percentDifference,
      };
    });
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const metrics = this.getAllMetrics();
    const comparisons = this.compareWithBaselines();

    let report = '# Performance Report\n\n';
    report += '## Metrics\n\n';

    report += `- Initial Load Time: ${metrics.initialLoadTime.toFixed(2)}ms\n`;
    report += `- Filter Apply Time: ${metrics.filterApplyTime.toFixed(2)}ms\n`;
    report += `- Export Generation Time: ${metrics.exportGenerationTime.toFixed(2)}ms\n`;
    report += `- Cache Hit Rate: ${metrics.cacheHitRate.toFixed(2)}%\n`;
    report += `- Deduplication Rate: ${metrics.deduplicationRate.toFixed(2)}%\n`;
    report += `- Memory Usage: ${metrics.memoryUsage.toFixed(2)}MB\n`;
    report += `- Error Rate: ${metrics.errorRate.toFixed(2)}%\n`;
    report += `- Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms\n`;
    report += `- P95 Response Time: ${metrics.p95ResponseTime.toFixed(2)}ms\n`;
    report += `- P99 Response Time: ${metrics.p99ResponseTime.toFixed(2)}ms\n`;

    report += '\n## Baseline Comparison\n\n';

    const hardFailures = comparisons.filter(
      (c) => c.baseline.threshold === 'hard' && !c.passed
    );
    const softFailures = comparisons.filter(
      (c) => c.baseline.threshold === 'soft' && !c.passed
    );
    const passes = comparisons.filter((c) => c.passed);

    if (hardFailures.length > 0) {
      report += '### ❌ Hard Failures (Must Fix)\n\n';
      hardFailures.forEach((c) => {
        report += `- **${c.baseline.name}**: ${c.actual.toFixed(2)}${c.baseline.unit} (target: ${c.baseline.target}${c.baseline.unit}, ${c.percentDifference.toFixed(1)}% over)\n`;
      });
      report += '\n';
    }

    if (softFailures.length > 0) {
      report += '### ⚠️  Soft Failures (Warnings)\n\n';
      softFailures.forEach((c) => {
        report += `- **${c.baseline.name}**: ${c.actual.toFixed(2)}${c.baseline.unit} (target: ${c.baseline.target}${c.baseline.unit}, ${c.percentDifference.toFixed(1)}% ${c.difference > 0 ? 'over' : 'under'})\n`;
      });
      report += '\n';
    }

    if (passes.length > 0) {
      report += `### ✅ Passed (${passes.length} metrics)\n\n`;
    }

    return report;
  }

  /**
   * Clear all metrics
   */
  reset(): void {
    this.metrics.clear();
    this.startTimes.clear();
    this.cacheStats = { hits: 0, misses: 0, totalRequests: 0 };
    this.deduplicationStats = { deduplicated: 0, total: 0 };
    this.errorStats = { errors: 0, total: 0 };
  }
}

// Global instance
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * Helper function to measure async operation
 */
export async function measureAsync<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  globalPerformanceMonitor.startTimer(label);
  try {
    const result = await fn();
    globalPerformanceMonitor.endTimer(label);
    globalPerformanceMonitor.recordSuccess();
    return result;
  } catch (error) {
    globalPerformanceMonitor.endTimer(label);
    globalPerformanceMonitor.recordError();
    throw error;
  }
}

/**
 * Helper function to measure sync operation
 */
export function measureSync<T>(label: string, fn: () => T): T {
  globalPerformanceMonitor.startTimer(label);
  try {
    const result = fn();
    globalPerformanceMonitor.endTimer(label);
    globalPerformanceMonitor.recordSuccess();
    return result;
  } catch (error) {
    globalPerformanceMonitor.endTimer(label);
    globalPerformanceMonitor.recordError();
    throw error;
  }
}
