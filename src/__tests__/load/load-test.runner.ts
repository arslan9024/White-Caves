/**
 * Load Test Runner - Executes load tests and collects metrics
 * Simulates user behavior and measures performance under various load conditions
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';
import {
  LoadTestScenario,
  LoadTestResults,
  LOAD_TEST_SCENARIOS,
  RESOURCE_LIMITS,
} from './load-test.config';

interface TestMetrics {
  requests: number;
  successful: number;
  failed: number;
  errors: Record<string, number>;
  responseTimes: number[];
  startTime: number;
  endTime: number;
}

export class LoadTestRunner {
  private baseUrl: string;
  private timeout: number = 30000;
  private results: LoadTestResults[] = [];

  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Execute a single HTTP request
   */
  private async makeRequest(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<{ statusCode: number; responseTime: number; error?: Error }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const url = new URL(path, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        timeout: this.timeout,
      };

      const request = client.request(requestOptions, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          const responseTime = Date.now() - startTime;
          resolve({
            statusCode: response.statusCode || 500,
            responseTime,
          });
        });
      });

      request.on('error', (error) => {
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: 500,
          responseTime,
          error: error as Error,
        });
      });

      request.on('timeout', () => {
        request.destroy();
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: 408,
          responseTime,
          error: new Error('Request timeout'),
        });
      });

      if (body) {
        request.write(JSON.stringify(body));
      }
      request.end();
    });
  }

  /**
   * Simulate a single virtual user
   */
  private async simulateVirtualUser(
    scenario: LoadTestScenario,
    metrics: TestMetrics
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < scenario.duration * 1000) {
      // Select random endpoint based on weight
      const random = Math.random() * 100;
      let weight = 0;
      const endpoint = scenario.endpoints.find((e) => {
        weight += e.weight;
        return random <= weight;
      });

      if (!endpoint) continue;

      // Make request
      const result = await this.makeRequest(
        endpoint.method,
        endpoint.path,
        endpoint.body,
        endpoint.headers
      );

      // Record metrics
      metrics.requests++;
      metrics.responseTimes.push(result.responseTime);

      if (result.error) {
        metrics.failed++;
        const errorKey = result.error.message;
        metrics.errors[errorKey] = (metrics.errors[errorKey] || 0) + 1;
      } else if (result.statusCode === endpoint.expectedStatus) {
        metrics.successful++;
      } else {
        metrics.failed++;
        const errorKey = `HTTP ${result.statusCode}`;
        metrics.errors[errorKey] = (metrics.errors[errorKey] || 0) + 1;
      }

      // Think time
      await new Promise((resolve) =>
        setTimeout(resolve, scenario.thinkTime)
      );
    }
  }

  /**
   * Calculate percentile from response times
   */
  private calculatePercentile(times: number[], percentile: number): number {
    const sorted = times.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)] || 0;
  }

  /**
   * Run a single load test scenario
   */
  async runScenario(scenario: LoadTestScenario): Promise<LoadTestResults> {
    console.log(`\n📊 Starting load test: ${scenario.name}`);
    console.log(`   Description: ${scenario.description}`);
    console.log(
      `   Virtual Users: ${scenario.virtualUsers} | Duration: ${scenario.duration}s`
    );

    const metrics: TestMetrics = {
      requests: 0,
      successful: 0,
      failed: 0,
      errors: {},
      responseTimes: [],
      startTime: Date.now(),
      endTime: 0,
    };

    // Ramp up virtual users
    const userPromises: Promise<void>[] = [];
    const usersPerSecond = Math.ceil(
      scenario.virtualUsers / scenario.rampUp
    );

    for (let i = 0; i < scenario.virtualUsers; i++) {
      if (i > 0 && i % usersPerSecond === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      userPromises.push(this.simulateVirtualUser(scenario, metrics));
    }

    // Wait for all users to complete
    await Promise.all(userPromises);
    metrics.endTime = Date.now();

    // Calculate results
    const successRate = (metrics.successful / metrics.requests) * 100;
    const actualDuration = (metrics.endTime - metrics.startTime) / 1000;
    const throughput = Math.round(metrics.requests / actualDuration);

    const result: LoadTestResults = {
      scenario: scenario.name,
      timestamp: new Date().toISOString(),
      duration: actualDuration,
      totalRequests: metrics.requests,
      successfulRequests: metrics.successful,
      failedRequests: metrics.failed,
      successRate: Math.round(successRate * 100) / 100,
      throughput,
      avgResponseTime: metrics.responseTimes.length > 0 ? Math.round(
        metrics.responseTimes.reduce((a, b) => a + b, 0) /
          metrics.responseTimes.length
      ) : 0,
      minResponseTime: metrics.responseTimes.length > 0 ? Math.min(...metrics.responseTimes) : 0,
      maxResponseTime: metrics.responseTimes.length > 0 ? Math.max(...metrics.responseTimes) : 0,
      p50ResponseTime: Math.round(this.calculatePercentile(metrics.responseTimes, 50)),
      p95ResponseTime: Math.round(this.calculatePercentile(metrics.responseTimes, 95)),
      p99ResponseTime: Math.round(this.calculatePercentile(metrics.responseTimes, 99)),
      errors: metrics.errors,
    };

    this.results.push(result);

    // Report results
    this.reportResults(result, scenario);

    return result;
  }

  /**
   * Report test results
   */
  private reportResults(
    result: LoadTestResults,
    scenario: LoadTestScenario
  ): void {
    console.log(`\n✅ Test Results: ${result.scenario}`);
    console.log(`   Total Requests: ${result.totalRequests}`);
    console.log(`   Successful: ${result.successfulRequests} (${result.successRate}%)`);
    console.log(`   Failed: ${result.failedRequests}`);
    console.log(`   Throughput: ${result.throughput} req/s`);
    console.log(`   Response Times:`);
    console.log(`     - Avg: ${result.avgResponseTime}ms`);
    console.log(`     - Min: ${result.minResponseTime}ms`);
    console.log(`     - Max: ${result.maxResponseTime}ms`);
    console.log(`     - p50: ${result.p50ResponseTime}ms`);
    console.log(`     - p95: ${result.p95ResponseTime}ms`);
    console.log(`     - p99: ${result.p99ResponseTime}ms`);

    // Check against success criteria
    const criteria = scenario.successCriteria;
    const passed =
      result.maxResponseTime <= criteria.maxResponseTime &&
      result.p95ResponseTime <= criteria.p95ResponseTime &&
      result.p99ResponseTime <= criteria.p99ResponseTime &&
      result.successRate >= 100 - criteria.errorRate;

    console.log(`   ${passed ? '✅ PASSED' : '❌ FAILED'} success criteria`);

    if (!passed) {
      console.log(`   Failures:`);
      if (result.maxResponseTime > criteria.maxResponseTime) {
        console.log(
          `     - Max response time: ${result.maxResponseTime}ms > ${criteria.maxResponseTime}ms`
        );
      }
      if (result.p95ResponseTime > criteria.p95ResponseTime) {
        console.log(
          `     - p95 response time: ${result.p95ResponseTime}ms > ${criteria.p95ResponseTime}ms`
        );
      }
      if (result.p99ResponseTime > criteria.p99ResponseTime) {
        console.log(
          `     - p99 response time: ${result.p99ResponseTime}ms > ${criteria.p99ResponseTime}ms`
        );
      }
      if (result.successRate < 100 - criteria.errorRate) {
        console.log(
          `     - Success rate: ${result.successRate}% < ${100 - criteria.errorRate}%`
        );
      }
    }
  }

  /**
   * Run all scenarios
   */
  async runAll(): Promise<LoadTestResults[]> {
    console.log('🚀 Starting Load Test Suite');
    console.log(`   Base URL: ${this.baseUrl}`);
    console.log(`   Total Scenarios: ${LOAD_TEST_SCENARIOS.length}\n`);

    for (const scenario of LOAD_TEST_SCENARIOS) {
      try {
        await this.runScenario(scenario);
      } catch (error) {
        console.error(`❌ Error running scenario ${scenario.name}:`, error);
      }
    }

    this.generateSummaryReport();
    return this.results;
  }

  /**
   * Generate summary report
   */
  private generateSummaryReport(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 LOAD TEST SUMMARY REPORT');
    console.log('='.repeat(60));

    const allResults = this.results;
    const passedTests = allResults.filter((r) => r.failedRequests === 0).length;
    const totalRequests = allResults.reduce((sum, r) => sum + r.totalRequests, 0);
    const totalErrors = allResults.reduce((sum, r) => sum + r.failedRequests, 0);

    console.log(`\n📈 Overall Metrics:`);
    console.log(`   Tests Passed: ${passedTests}/${allResults.length}`);
    console.log(`   Total Requests: ${totalRequests}`);
    console.log(`   Total Errors: ${totalErrors}`);
    console.log(`   Overall Success Rate: ${((totalRequests - totalErrors) / totalRequests * 100).toFixed(2)}%`);

    console.log(`\n🎯 Performance Summary:`);
    const allTimes = allResults.flatMap((r) => r);
    console.log(
      `   Average Response Time: ${(allResults.reduce((sum, r) => sum + r.avgResponseTime, 0) / allResults.length).toFixed(0)}ms`
    );
    console.log(
      `   Max Response Time: ${Math.max(...allResults.map((r) => r.maxResponseTime))}ms`
    );
    console.log(
      `   p95 Response Time: ${(allResults.reduce((sum, r) => sum + r.p95ResponseTime, 0) / allResults.length).toFixed(0)}ms`
    );

    console.log(`\n📊 Scenario Results:`);
    allResults.forEach((r) => {
      console.log(
        `   ${r.scenario}: ${r.successRate}% success | ${r.throughput} req/s`
      );
    });

    console.log('\n' + '='.repeat(60));
  }

  /**
   * Export results as JSON
   */
  getResults(): LoadTestResults[] {
    return this.results;
  }
}

/**
 * CLI entry point
 */
async function main() {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:5000';
  const runner = new LoadTestRunner(baseUrl);

  try {
    const results = await runner.runAll();
    process.exit(results.some((r) => r.failedRequests > 0) ? 1 : 0);
  } catch (error) {
    console.error('❌ Load test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
