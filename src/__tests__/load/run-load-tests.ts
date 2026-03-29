/**
 * Load Test Script - Orchestrates load testing and report generation
 */

import { LoadTestRunner } from './load-test.runner';
import { PerformanceProfiler } from './performance-profiler';
import * as fs from 'fs';
import * as path from 'path';

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:5000';
const reportDir = path.join(process.cwd(), 'load-test-reports');

// Ensure reports directory exists
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

async function runLoadTests() {
  console.log('🚀 LOAD TEST EXECUTION STARTED');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Report Directory: ${reportDir}\n`);

  const runner = new LoadTestRunner(baseUrl);
  const profiler = new PerformanceProfiler('White Caves Load Test Suite');

  // Start performance profiling
  profiler.start(500); // Collect metrics every 500ms

  try {
    // Run all load test scenarios
    const results = await runner.runAll();

    // Stop profiling
    const perfReport = profiler.stop();
    profiler.printSummary(perfReport);

    // Generate report files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Load test results
    const loadTestReportPath = path.join(
      reportDir,
      `load-test-results-${timestamp}.json`
    );
    fs.writeFileSync(
      loadTestReportPath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          baseUrl,
          scenarios: results,
          summary: {
            totalScenarios: results.length,
            passedScenarios: results.filter(
              (r) => r.failedRequests === 0
            ).length,
            totalRequests: results.reduce((sum, r) => sum + r.totalRequests, 0),
            totalErrors: results.reduce((sum, r) => sum + r.failedRequests, 0),
            averageResponseTime: results.length > 0 ? Math.round(
              results.reduce((sum, r) => sum + r.avgResponseTime, 0) /
                results.length
            ) : 0,
            maxResponseTime: results.length > 0 ? Math.max(...results.map((r) => r.maxResponseTime)) : 0,
            overallSuccessRate: results.reduce((sum, r) => sum + r.totalRequests, 0) > 0
              ? (results.reduce((sum, r) => sum + r.successfulRequests, 0) /
                results.reduce((sum, r) => sum + r.totalRequests, 0)) *
                100
              : 0,
          },
        },
        null,
        2
      )
    );

    // Performance profiling results
    const perfReportPath = path.join(
      reportDir,
      `performance-profile-${timestamp}.json`
    );
    fs.writeFileSync(perfReportPath, JSON.stringify(perfReport, null, 2));

    // CSV export for analysis
    const csvPath = path.join(
      reportDir,
      `performance-metrics-${timestamp}.csv`
    );
    fs.writeFileSync(csvPath, profiler.exportAsCSV());

    console.log(`\n✅ Reports generated:`);
    console.log(`   - Load Test Results: ${loadTestReportPath}`);
    console.log(`   - Performance Profile: ${perfReportPath}`);
    console.log(`   - CSV Metrics: ${csvPath}`);

    // Check if all scenarios passed
    const allPassed = results.every((r) => r.failedRequests === 0);
    if (allPassed) {
      console.log('\n✅ ALL LOAD TEST SCENARIOS PASSED');
      process.exit(0);
    } else {
      console.log('\n⚠️  SOME LOAD TEST SCENARIOS FAILED');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Load test execution failed:', error);
    profiler.stop();
    process.exit(1);
  }
}

if (require.main === module) {
  runLoadTests();
}

export { runLoadTests };
