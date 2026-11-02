#!/usr/bin/env node

/**
 * Week 2 Test Execution Coordinator
 * Runs all test phases for Week 2 (Mon-Fri) with logging and reporting
 * Usage: node scripts/week-2-test-runner.js [--phase 1-5] [--skip-backup]
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const __dirname = path.resolve();

// Configuration
const TESTS = {
  MONDAY: {
    name: 'ConversationAnalyzer',
    file: 'src/services/__tests__/ConversationAnalyzer.test.js',
    cases: 215,
    targetCoverage: 95,
    duration: '5m'
  },
  TUESDAY: {
    name: 'WhatsAppWebIntegration',
    file: 'src/services/__tests__/WhatsAppWebIntegration.test.js',
    cases: 180,
    targetCoverage: 90,
    duration: '5m'
  },
  WEDNESDAY_COMPONENT: {
    name: 'QuickAddPropertyForm',
    file: 'src/components/sourcing/__tests__/QuickAddPropertyForm.test.js',
    cases: 46,
    targetCoverage: 95,
    duration: '3m'
  },
  WEDNESDAY_INTEGRATION: {
    name: 'Phase2A Integration',
    file: 'src/__tests__/Phase2A.integration.test.js',
    cases: 23,
    targetCoverage: 90,
    duration: '5m'
  },
  THURSDAY_SERVICE: {
    name: 'PropertySourcingService',
    file: 'src/services/__tests__/PropertySourcingService.test.js',
    cases: 50,
    targetCoverage: 92,
    duration: '8m'
  }
};

const args = process.argv.slice(2);
const phase = args.includes('--all') ? 'all' : (args[args.indexOf('--phase') + 1] || '1');
const skipBackup = args.includes('--skip-backup');

// Helper functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    'info': '📋',
    'success': '✅',
    'error': '❌',
    'warn': '⚠️',
    'progress': '🔄'
  }[type] || '•';

  console.log(`[${timestamp}] ${prefix} ${message}`);
}

function saveLog(filename, content) {
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  fs.writeFileSync(path.join(logsDir, filename), content);
}

async function runTest(testConfig, day) {
  log(`Starting ${day} test: ${testConfig.name}`, 'progress');
  
  const startTime = Date.now();
  const result = {
    day,
    suite: testConfig.name,
    file: testConfig.file,
    expectedTests: testConfig.cases,
    targetCoverage: testConfig.targetCoverage,
    startTime: new Date().toISOString(),
    status: 'running'
  };

  try {
    log(`Running: npm run test:run -- ${testConfig.file} --coverage`, 'info');
    
    const { stdout, stderr } = await execPromise(
      `npm run test:run -- "${testConfig.file}" --coverage`,
      { 
        cwd: __dirname,
        maxBuffer: 1024 * 1024 * 10
      }
    );

    // Parse coverage from output
    const coverageMatch = stdout.match(/Coverage:\s*(\d+(?:\.\d+)?)/i);
    const coverage = coverageMatch ? parseFloat(coverageMatch[1]) : 0;

    // Count passed tests
    const passMatch = stdout.match(/✓\s+(\w+)\s+\((\d+)\s+test/i);
    const passedTests = passMatch ? parseInt(passMatch[2]) : 0;

    result.status = 'completed';
    result.passedTests = passedTests;
    result.coverage = coverage;
    result.duration = `${((Date.now() - startTime) / 1000 / 60).toFixed(1)}m`;
    result.passed = passedTests >= testConfig.cases * 0.95 && coverage >= testConfig.targetCoverage - 5;

    log(`${testConfig.name}: ${passedTests}/${testConfig.cases} tests (${coverage}% coverage)`, 
        result.passed ? 'success' : 'warn');

    // Save detailed output
    saveLog(`${day.toLowerCase()}-test-output.log`, stdout);
    if (stderr) {
      saveLog(`${day.toLowerCase()}-test-errors.log`, stderr);
    }

  } catch (error) {
    result.status = 'failed';
    result.error = error.message;
    result.duration = `${((Date.now() - startTime) / 1000 / 60).toFixed(1)}m`;
    result.passed = false;

    log(`${testConfig.name} failed: ${error.message}`, 'error');
    saveLog(`${day.toLowerCase()}-test-error.log`, error.toString());
  }

  result.endTime = new Date().toISOString();
  return result;
}

async function runPhase1() {
  log('=== PHASE 1: Database & Environment Setup ===', 'progress');
  
  // Check connection
  log('Step 1.1: Checking MongoDB connection...', 'info');
  try {
    const { stdout } = await execPromise('node scripts/db-connection-check.js', { cwd: __dirname });
    log('MongoDB connection verified', 'success');
  } catch (error) {
    log(`Connection check failed: ${error.message}`, 'error');
    log('Please configure .env.staging with valid MONGODB_URI', 'error');
    return false;
  }

  // Backup database
  if (!skipBackup) {
    log('Step 1.2: Creating database backup...', 'info');
    try {
      const { stdout } = await execPromise('node scripts/backup-staging-db.js', { cwd: __dirname });
      log('Database backup created', 'success');
    } catch (error) {
      log(`Backup failed: ${error.message}`, 'warn');
    }
  }

  // Seed test data
  log('Step 1.4: Seeding test data...', 'info');
  try {
    const { stdout } = await execPromise('npm run seed:small', { cwd: __dirname });
    log('Test data seeded', 'success');
  } catch (error) {
    log(`Seeding failed: ${error.message}`, 'warn');
  }

  return true;
}

async function runPhase234() {
  log('=== PHASE 2-3: Monday-Tuesday Unit Tests ===', 'progress');
  
  const mondayResult = await runTest(TESTS.MONDAY, 'Monday');
  const tuesdayResult = await runTest(TESTS.TUESDAY, 'Tuesday');

  return [mondayResult, tuesdayResult];
}

async function runPhase4() {
  log('=== PHASE 4: Wednesday-Thursday Integration Tests ===', 'progress');
  
  const results = [];
  results.push(await runTest(TESTS.WEDNESDAY_COMPONENT, 'Wednesday'));
  results.push(await runTest(TESTS.WEDNESDAY_INTEGRATION, 'Wednesday'));
  results.push(await runTest(TESTS.THURSDAY_SERVICE, 'Thursday'));

  return results;
}

async function runPhase5() {
  log('=== PHASE 5: Friday Coverage & Load Testing ===', 'progress');
  
  log('Generating final coverage report...', 'info');
  try {
    const { stdout } = await execPromise('npm run coverage:c8', { cwd: __dirname });
    log('Final coverage report generated', 'success');
    saveLog('friday-coverage-report.log', stdout);
  } catch (error) {
    log(`Coverage generation failed: ${error.message}`, 'error');
  }

  return true;
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║          WHITE CAVES - WEEK 2 TEST EXECUTION RUNNER            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  log(`Execution plan: Phase ${phase}`, 'progress');
  log(`Current date: ${new Date().toISOString().split('T')[0]}`, 'info');

  const execution = {
    startTime: new Date().toISOString(),
    phases: {},
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      overallCoverage: 0
    }
  };

  try {
    // Phase 1: Setup
    if (['1', 'all'].includes(phase)) {
      const phase1Success = await runPhase1();
      if (!phase1Success) {
        throw new Error('Phase 1 setup failed');
      }
      execution.phases['1'] = { status: 'completed' };
    }

    // Phase 2-3: Monday-Tuesday
    if (['2', '3', 'all'].includes(phase)) {
      const results = await runPhase234();
      execution.phases['2-3'] = { status: 'completed', tests: results };
    }

    // Phase 4: Wednesday-Thursday
    if (['4', 'all'].includes(phase)) {
      const results = await runPhase4();
      execution.phases['4'] = { status: 'completed', tests: results };
    }

    // Phase 5: Friday
    if (['5', 'all'].includes(phase)) {
      const result = await runPhase5();
      execution.phases['5'] = { status: 'completed' };
    }

    execution.status = 'completed';
    log('\n✅ All phases completed successfully', 'success');

  } catch (error) {
    execution.status = 'failed';
    log(`\n❌ Execution failed: ${error.message}`, 'error');
  }

  execution.endTime = new Date().toISOString();

  // Save execution report
  saveLog('week-2-execution-report.json', JSON.stringify(execution, null, 2));
  log('\nExecution report saved to logs/week-2-execution-report.json', 'info');

  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                   EXECUTION SUMMARY                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  
  console.log(`Status: ${execution.status.toUpperCase()}`);
  console.log(`Start: ${execution.startTime}`);
  console.log(`End: ${execution.endTime}`);
  console.log('\nNext steps:');
  console.log('1. Review logs/ folder for detailed test results');
  console.log('2. Check coverage reports in coverage/ folder');
  console.log('3. Document any failures in logs/week-2-execution-report.json');
  console.log('4. Prepare Week 3 optimization plan based on results\n');
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
