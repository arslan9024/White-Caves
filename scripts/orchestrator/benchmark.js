#!/usr/bin/env node
/**
 * Aegis vNext — Benchmark / Eval Loop (Phase C / #6)
 * Records task success/fail, pass rate, rework count, cycle time, rollback rate.
 * Compares weekly runs against a stored baseline. Emits a weekly benchmark report.
 * Inspired by OpenHands SWE-bench evaluation culture.
 *
 * Usage:
 *   node benchmark.js --record --task <id> --outcome <pass|fail|rework|rollback> [--cycleTimeSec <n>]
 *   node benchmark.js --run              # compute weekly metrics + compare baseline
 *   node benchmark.js --compare          # compare latest snapshot to baseline only
 *   node benchmark.js --baseline         # set current snapshot as new baseline
 *   node benchmark.js --report           # print latest report
 *   node benchmark.js --status           # show benchmark config
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..', '..');
const POLICY_PATH = join(__dirname, 'policy.json');

function readPolicy() {
  return JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
}

function getBenchDir(policy) {
  const dir = join(ROOT, policy.benchmark?.metricsDir ?? 'logs/orchestrator/benchmarks');
  mkdirSync(dir, { recursive: true });
  return dir;
}

function getHistoryFile(benchDir) {
  return join(benchDir, 'task-history.jsonl');
}

function getBaselineFile(policy) {
  return join(ROOT, policy.benchmark?.baselineFile ?? 'logs/orchestrator/benchmarks/baseline.json');
}

function getWeekKey() {
  const d = new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function appendHistory(historyFile, entry) {
  writeFileSync(historyFile, JSON.stringify(entry) + '\n', { flag: 'a', encoding: 'utf8' });
}

function readHistory(historyFile) {
  if (!existsSync(historyFile)) return [];
  return readFileSync(historyFile, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

function computeMetrics(entries) {
  if (entries.length === 0) {
    return { tasks: 0, taskSuccessRate: null, passRate: null, reworkRate: null, avgCycleTimeSec: null, rollbackRate: null };
  }

  const total = entries.length;
  const passed = entries.filter((e) => e.outcome === 'pass').length;
  const failed = entries.filter((e) => e.outcome === 'fail').length;
  const rework = entries.filter((e) => e.outcome === 'rework').length;
  const rollback = entries.filter((e) => e.outcome === 'rollback').length;
  const successful = entries.filter((e) => e.outcome === 'pass' || e.outcome === 'rework').length;
  const cycleTimes = entries.filter((e) => e.cycleTimeSec != null).map((e) => e.cycleTimeSec);

  return {
    tasks: total,
    taskSuccessRate: Math.round((successful / total) * 100) / 100,
    passRate: Math.round((passed / total) * 100) / 100,
    reworkRate: Math.round((rework / total) * 100) / 100,
    rollbackRate: Math.round((rollback / total) * 100) / 100,
    failRate: Math.round((failed / total) * 100) / 100,
    avgCycleTimeSec: cycleTimes.length > 0
      ? Math.round(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length)
      : null,
  };
}

function compareToBaseline(current, baseline, threshold) {
  const regressionThreshold = threshold ?? 0.1;
  const regressions = [];
  const improvements = [];

  const metricKeys = ['taskSuccessRate', 'passRate', 'reworkRate', 'rollbackRate', 'avgCycleTimeSec'];
  for (const key of metricKeys) {
    if (current[key] == null || baseline[key] == null) continue;
    const delta = current[key] - baseline[key];
    const deltaAbs = Math.abs(delta);

    // For success/pass rate: higher is better. For rework/rollback/cycleTime: lower is better.
    const higherIsBetter = ['taskSuccessRate', 'passRate'].includes(key);
    const isRegression = higherIsBetter ? delta < -regressionThreshold : delta > regressionThreshold;
    const isImprovement = higherIsBetter ? delta > regressionThreshold : delta < -regressionThreshold;

    if (isRegression) {
      regressions.push({ metric: key, baseline: baseline[key], current: current[key], delta: Math.round(delta * 1000) / 1000 });
    } else if (isImprovement && deltaAbs > regressionThreshold) {
      improvements.push({ metric: key, baseline: baseline[key], current: current[key], delta: Math.round(delta * 1000) / 1000 });
    }
  }

  return { regressions, improvements, clean: regressions.length === 0 };
}

function recordTask(taskId, outcome, cycleTimeSec, policy) {
  const benchDir = getBenchDir(policy);
  const historyFile = getHistoryFile(benchDir);
  const entry = {
    taskId,
    outcome,
    cycleTimeSec: cycleTimeSec != null ? parseInt(cycleTimeSec, 10) : null,
    recordedAt: new Date().toISOString(),
    week: getWeekKey(),
  };
  appendHistory(historyFile, entry);
  console.log(`Benchmark recorded: [${outcome}] ${taskId} (week ${entry.week})`);
}

function runBenchmark(policy) {
  const benchDir = getBenchDir(policy);
  const historyFile = getHistoryFile(benchDir);
  const baselineFile = getBaselineFile(policy);
  const weekKey = getWeekKey();

  const history = readHistory(historyFile);
  const weekEntries = history.filter((e) => e.week === weekKey);
  const allMetrics = computeMetrics(history);
  const weekMetrics = computeMetrics(weekEntries);

  const report = {
    generatedAt: new Date().toISOString(),
    week: weekKey,
    allTime: allMetrics,
    weekly: weekMetrics,
    comparison: null,
  };

  if (existsSync(baselineFile)) {
    const baseline = JSON.parse(readFileSync(baselineFile, 'utf8'));
    report.comparison = compareToBaseline(allMetrics, baseline.metrics, policy.benchmark?.regressionAlertThreshold);
  }

  const reportFile = join(benchDir, `bench-${weekKey}.json`);
  writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');

  console.log(`\n=== Aegis Benchmark Report — ${weekKey} ===`);
  console.log(`\nAll-time metrics (${allMetrics.tasks} tasks):`);
  console.log(`  Task success rate: ${(allMetrics.taskSuccessRate * 100).toFixed(1)}%`);
  console.log(`  Pass rate:         ${(allMetrics.passRate * 100).toFixed(1)}%`);
  console.log(`  Rework rate:       ${(allMetrics.reworkRate * 100).toFixed(1)}%`);
  console.log(`  Rollback rate:     ${(allMetrics.rollbackRate * 100).toFixed(1)}%`);
  console.log(`  Avg cycle time:    ${allMetrics.avgCycleTimeSec ?? 'n/a'}s`);

  if (weekMetrics.tasks > 0) {
    console.log(`\nThis week (${weekMetrics.tasks} tasks):`);
    console.log(`  Task success rate: ${(weekMetrics.taskSuccessRate * 100).toFixed(1)}%`);
    console.log(`  Pass rate:         ${(weekMetrics.passRate * 100).toFixed(1)}%`);
  }

  if (report.comparison) {
    if (report.comparison.clean) {
      console.log('\n✓ No regressions vs baseline');
    } else {
      console.log(`\n⚠ Regressions vs baseline (${report.comparison.regressions.length}):`);
      report.comparison.regressions.forEach((r) => {
        console.log(`  ${r.metric}: ${r.baseline} → ${r.current} (Δ ${r.delta})`);
      });
    }
    if (report.comparison.improvements.length > 0) {
      console.log(`\n✓ Improvements (${report.comparison.improvements.length}):`);
      report.comparison.improvements.forEach((i) => {
        console.log(`  ${i.metric}: ${i.baseline} → ${i.current} (Δ ${i.delta})`);
      });
    }
  }

  console.log(`\nReport saved: ${reportFile}`);
  return report;
}

function setBaseline(policy) {
  const benchDir = getBenchDir(policy);
  const historyFile = getHistoryFile(benchDir);
  const baselineFile = getBaselineFile(policy);

  const history = readHistory(historyFile);
  const metrics = computeMetrics(history);

  const baseline = {
    setAt: new Date().toISOString(),
    totalTasks: history.length,
    metrics,
  };
  mkdirSync(getParentDir(baselineFile), { recursive: true });
  writeFileSync(baselineFile, JSON.stringify(baseline, null, 2), 'utf8');
  console.log(`Baseline set: ${baselineFile}`);
  console.log(JSON.stringify(metrics, null, 2));
}

function getParentDir(p) {
  return p.split('/').slice(0, -1).join('/') || '.';
}

function printStatus(policy) {
  const benchDir = getBenchDir(policy);
  const historyFile = getHistoryFile(benchDir);
  const baselineFile = getBaselineFile(policy);
  const cfg = policy.benchmark ?? {};

  console.log('\n=== Aegis Benchmark Status ===');
  console.log(`Enabled: ${cfg.enabled ?? false}`);
  console.log(`Cadence: ${cfg.cadence ?? 'weekly'}`);
  console.log(`Metrics dir: ${benchDir}`);
  console.log(`History file: ${historyFile} (${existsSync(historyFile) ? 'exists' : 'empty'})`);
  console.log(`Baseline file: ${baselineFile} (${existsSync(baselineFile) ? 'exists' : 'not set'})`);
  console.log(`Regression alert threshold: ${cfg.regressionAlertThreshold ?? 0.1}`);
  console.log(`Metrics: ${(cfg.metrics ?? []).join(', ')}`);
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const policy = readPolicy();

if (!policy.benchmark?.enabled) {
  console.warn('Benchmark suite is disabled in policy.json (benchmark.enabled=false)');
  process.exit(0);
}

if (args.includes('--record')) {
  const taskId = args.includes('--task') ? args[args.indexOf('--task') + 1] : `task-${Date.now()}`;
  const outcome = args.includes('--outcome') ? args[args.indexOf('--outcome') + 1] : 'pass';
  const cycleTimeSec = args.includes('--cycleTimeSec') ? args[args.indexOf('--cycleTimeSec') + 1] : null;
  recordTask(taskId, outcome, cycleTimeSec, policy);
} else if (args.includes('--run')) {
  runBenchmark(policy);
} else if (args.includes('--compare')) {
  runBenchmark(policy);
} else if (args.includes('--baseline')) {
  setBaseline(policy);
} else if (args.includes('--report')) {
  const benchDir = getBenchDir(policy);
  const weekKey = getWeekKey();
  const reportFile = join(benchDir, `bench-${weekKey}.json`);
  if (existsSync(reportFile)) {
    console.log(readFileSync(reportFile, 'utf8'));
  } else {
    console.log(`No report for ${weekKey}. Run --run first.`);
  }
} else if (args.includes('--status') || args.length === 0) {
  printStatus(policy);
} else {
  console.log('Usage: node benchmark.js [--record --task <id> --outcome <pass|fail|rework|rollback>|--run|--compare|--baseline|--report|--status]');
}
