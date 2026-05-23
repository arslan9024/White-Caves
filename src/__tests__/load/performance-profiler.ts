/**
 * Performance Profiler - Monitors system resources during load tests
 * Tracks CPU, memory, disk, and network metrics
 */

import os from 'os';
import { performance, PerformanceObserver } from 'perf_hooks';

export interface SystemMetrics {
  timestamp: string;
  cpu: {
    usage: number; // percentage
    cores: number;
    model: string;
  };
  memory: {
    total: number; // bytes
    used: number; // bytes
    free: number; // bytes
    usagePercent: number; // percentage
  };
  nodejs: {
    heapUsed: number; // bytes
    heapTotal: number; // bytes
    external: number; // bytes
    rss: number; // bytes
  };
  uptime: number; // seconds
}

export interface PerformanceReport {
  testName: string;
  startTime: string;
  endTime: string;
  duration: number; // seconds
  metrics: SystemMetrics[];
  averages: {
    cpuUsage: number;
    memoryUsage: number;
    heapUsage: number;
  };
  peaks: {
    cpuUsage: number;
    memoryUsage: number;
    heapUsage: number;
  };
}

export class PerformanceProfiler {
  private metrics: SystemMetrics[] = [];
  private startTime: Date;
  private testName: string;
  private collectionInterval: ReturnType<typeof setInterval> | null = null;
  private cpuUsageBuffer: number[] = [];
  private lastCpuTime: number | null = null;

  constructor(testName: string = 'Load Test') {
    this.testName = testName;
    this.startTime = new Date();
  }

  /**
   * Calculate CPU usage
   */
  private calculateCpuUsage(): number {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);

    return Math.max(0, Math.min(100, usage));
  }

  /**
   * Collect current metrics
   */
  private collectMetrics(): SystemMetrics {
    const memUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    return {
      timestamp: new Date().toISOString(),
      cpu: {
        usage: this.calculateCpuUsage(),
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || 'Unknown',
      },
      memory: {
        total: totalMemory,
        used: usedMemory,
        free: freeMemory,
        usagePercent: (usedMemory / totalMemory) * 100,
      },
      nodejs: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        external: memUsage.external,
        rss: memUsage.rss,
      },
      uptime: process.uptime(),
    };
  }

  /**
   * Start collecting metrics
   */
  start(intervalMs: number = 1000): void {
    console.log(`📊 Starting performance profiler for: ${this.testName}`);
    this.startTime = new Date();
    this.metrics = [];

    this.collectionInterval = setInterval(() => {
      const metrics = this.collectMetrics();
      this.metrics.push(metrics);
    }, intervalMs);
  }

  /**
   * Stop collecting metrics
   */
  stop(): PerformanceReport {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }

    return this.generateReport();
  }

  /**
   * Generate performance report
   */
  private generateReport(): PerformanceReport {
    const endTime = new Date();
    const duration = (endTime.getTime() - this.startTime.getTime()) / 1000;

    if (this.metrics.length === 0) {
      return {
        testName: this.testName,
        startTime: this.startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        metrics: [],
        averages: {
          cpuUsage: 0,
          memoryUsage: 0,
          heapUsage: 0,
        },
        peaks: {
          cpuUsage: 0,
          memoryUsage: 0,
          heapUsage: 0,
        },
      };
    }

    const cpuUsages = this.metrics.map((m) => m.cpu.usage);
    const memoryUsages = this.metrics.map((m) => m.memory.usagePercent);
    const heapUsages = this.metrics.map((m) =>
      (m.nodejs.heapUsed / m.nodejs.heapTotal) * 100
    );

    const avgCpu = cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length;
    const avgMemory = memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length;
    const avgHeap = heapUsages.reduce((a, b) => a + b, 0) / heapUsages.length;

    const peakCpu = Math.max(...cpuUsages);
    const peakMemory = Math.max(...memoryUsages);
    const peakHeap = Math.max(...heapUsages);

    return {
      testName: this.testName,
      startTime: this.startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      metrics: this.metrics,
      averages: {
        cpuUsage: Math.round(avgCpu * 100) / 100,
        memoryUsage: Math.round(avgMemory * 100) / 100,
        heapUsage: Math.round(avgHeap * 100) / 100,
      },
      peaks: {
        cpuUsage: Math.round(peakCpu * 100) / 100,
        memoryUsage: Math.round(peakMemory * 100) / 100,
        heapUsage: Math.round(peakHeap * 100) / 100,
      },
    };
  }

  /**
   * Print performance summary
   */
  printSummary(report: PerformanceReport): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PERFORMANCE PROFILE REPORT');
    console.log('='.repeat(60));

    console.log(`\n📌 Test: ${report.testName}`);
    console.log(`   Started: ${report.startTime}`);
    console.log(`   Duration: ${report.duration.toFixed(2)}s`);

    console.log(`\n💻 CPU Usage:`);
    console.log(
      `   Average: ${report.averages.cpuUsage.toFixed(2)}% | Peak: ${report.peaks.cpuUsage.toFixed(2)}%`
    );

    console.log(`\n🧠 Memory Usage:`);
    console.log(
      `   Average: ${report.averages.memoryUsage.toFixed(2)}% | Peak: ${report.peaks.memoryUsage.toFixed(2)}%`
    );

    console.log(`\n📦 Heap Usage:`);
    console.log(
      `   Average: ${report.averages.heapUsage.toFixed(2)}% | Peak: ${report.peaks.heapUsage.toFixed(2)}%`
    );

    console.log('\n' + '='.repeat(60));
  }

  /**
   * Export metrics as JSON
   */
  exportAsJson(): string {
    const report = this.generateReport();
    return JSON.stringify(report, null, 2);
  }

  /**
   * Export metrics as CSV
   */
  exportAsCSV(): string {
    const report = this.generateReport();
    const headers = [
      'timestamp',
      'cpu_usage',
      'memory_usage',
      'heap_used',
      'heap_total',
      'rss',
    ];

    const rows = [headers.join(',')];

    report.metrics.forEach((m) => {
      rows.push(
        [
          m.timestamp,
          m.cpu.usage.toFixed(2),
          m.memory.usagePercent.toFixed(2),
          m.nodejs.heapUsed,
          m.nodejs.heapTotal,
          m.nodejs.rss,
        ].join(',')
      );
    });

    return rows.join('\n');
  }
}
