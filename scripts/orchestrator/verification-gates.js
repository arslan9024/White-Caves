#!/usr/bin/env node
/**
 * Aegis vNext — Stronger Verification Gates (Phase B / #3)
 * Extends base hard-stops with: security scan, diff-risk score, flaky-test detection,
 * and second-pass reviewer trigger for high-risk changes.
 *
 * Usage:
 *   node verification-gates.js                   # run all gates
 *   node verification-gates.js --security        # security scan only
 *   node verification-gates.js --diff-risk        # diff-risk score only
 *   node verification-gates.js --flaky-detect     # flaky-test detection only
 *   node verification-gates.js --report           # show last results
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createTraceContext, isFeatureEnabled, loadPolicy } from './policy-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..', '..');
const LOGS_DIR = join(ROOT, 'logs', 'orchestrator');
const REPORT_FILE = join(LOGS_DIR, 'verification-gates-report.json');

function ensureLogs() {
  mkdirSync(LOGS_DIR, { recursive: true });
}

// ── Security Scan ─────────────────────────────────────────────────────────────

const SECURITY_PATTERNS = [
  { pattern: /eval\s*\(/, label: 'eval() usage', severity: 'high' },
  { pattern: /new\s+Function\s*\(/, label: 'new Function() usage', severity: 'high' },
  { pattern: /process\.env\.[A-Z_]+\s*=/, label: 'env var mutation', severity: 'medium' },
  // Only flag hardcoded secrets in non-test source files; require lowercase key name + no spaces in value
  { pattern: /(?:password|secret|token|apiKey|api_key|auth_token)\s*[:=]\s*["'][a-zA-Z0-9_\-./+]{12,}["']/, label: 'potential hardcoded secret', severity: 'critical', skipTestFiles: true },
  { pattern: /innerHTML\s*=/, label: 'direct innerHTML assignment (XSS risk)', severity: 'medium' },
  { pattern: /dangerouslySetInnerHTML/, label: 'dangerouslySetInnerHTML usage', severity: 'low' },
];

const SCAN_DIRS = ['src', 'server'];

function classifyDomain(file, label) {
  const text = `${file} ${label}`.toLowerCase();
  if (text.includes('auth')) return 'auth';
  if (text.includes('payment') || text.includes('stripe')) return 'payment';
  if (text.includes('prisma') || text.includes('database') || text.includes('mongo')) return 'database';
  if (text.includes('xss') || text.includes('secret') || text.includes('token') || text.includes('security')) return 'security';
  return 'general';
}

function getExceptionForFinding(finding, policy) {
  const now = Date.now();
  return (policy.verification?.exceptions ?? []).find((ex) => {
    if (!ex || !ex.expiresAt) return false;
    if (Date.parse(ex.expiresAt) < now) return false;
    if (ex.domain && ex.domain !== finding.domain) return false;
    if (ex.label && ex.label !== finding.label) return false;
    if (ex.fileContains && !finding.file.includes(ex.fileContains)) return false;
    return true;
  }) ?? null;
}

function runSecurityScan(policy) {
  const findings = [];

  for (const dir of SCAN_DIRS) {
    const fullDir = join(ROOT, dir);
    if (!existsSync(fullDir)) continue;

    let files = [];
    try {
      files = execSync(`find "${fullDir}" -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null`, { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);
    } catch {
      continue;
    }

    for (const file of files) {
      let content = '';
      try {
        content = readFileSync(file, 'utf8');
      } catch {
        continue;
      }
      const lines = content.split('\n');
      const isTestFile = /\.test\.[jt]sx?$|\.spec\.[jt]sx?$|__tests__/.test(file);
      lines.forEach((line, i) => {
        for (const rule of SECURITY_PATTERNS) {
          if (rule.skipTestFiles && isTestFile) continue;
          if (rule.pattern.test(line)) {
            findings.push({
              file: file.replace(ROOT + '/', ''),
              line: i + 1,
              label: rule.label,
              severity: rule.severity,
              domain: classifyDomain(file, rule.label),
              excerpt: line.trim().slice(0, 120),
            });
          }
        }
      });
    }
  }

  const enriched = findings.map((finding) => {
    const exception = getExceptionForFinding(finding, policy);
    const domainTier = policy.verification?.tiers?.[finding.domain] ?? policy.verification?.tiers?.general ?? { blockSeverities: ['critical'] };
    const isBlockedByTier = (domainTier.blockSeverities ?? ['critical']).includes(finding.severity);
    return {
      ...finding,
      enforcementTier: isBlockedByTier ? 'block' : 'warn',
      waived: Boolean(exception),
      waiver: exception ? { reason: exception.reason ?? 'temporary waiver', expiresAt: exception.expiresAt } : null,
    };
  });
  const blocked = enriched.filter((f) => f.enforcementTier === 'block' && !f.waived);
  const critical = enriched.filter((f) => f.severity === 'critical');
  const high = enriched.filter((f) => f.severity === 'high');

  return {
    gate: 'security',
    passed: blocked.length === 0,
    hardFail: blocked.length > 0 && (policy.hardStops?.stopOnSecurityScanFailure ?? true),
    summary: `${enriched.length} findings (${critical.length} critical, ${high.length} high, ${blocked.length} blocking, ${enriched.filter(f => f.waived).length} waived)`,
    findings: enriched,
  };
}

// ── Diff-Risk Score ───────────────────────────────────────────────────────────

const HIGH_RISK_PATHS = [
  'server/routes/auth',
  'server/database',
  'server/middleware',
  'src/utils/superUserAccess',
  'src/App.tsx',
  'prisma/',
  'scripts/orchestrator/policy.json',
];

function runDiffRiskScore(policy) {
  const threshold = policy.hardStops?.diffRiskScoreThreshold ?? 80;

  let diffOutput = '';
  try {
    diffOutput = execSync(`git -C "${ROOT}" diff --stat HEAD 2>&1`, { encoding: 'utf8' });
  } catch {
    diffOutput = '';
  }

  const changedFiles = diffOutput
    .split('\n')
    .filter((l) => l.includes('|'))
    .map((l) => l.trim().split(/\s+/)[0]);

  const linesChanged = diffOutput.match(/(\d+) insertions?/)?.[1] ?? '0';
  const linesDel = diffOutput.match(/(\d+) deletions?/)?.[1] ?? '0';
  const totalLines = parseInt(linesChanged, 10) + parseInt(linesDel, 10);

  const diffWeights = policy.verification?.diffRiskWeights ?? {};
  const scale = diffWeights.linesChangedScale ?? 500;
  const highRiskWeight = diffWeights.highRiskPathWeight ?? 10;

  let riskScore = Math.min(100, Math.round((totalLines / scale) * 50));

  const highRiskHits = changedFiles.filter((f) =>
    HIGH_RISK_PATHS.some((p) => f.includes(p)),
  );
  riskScore += highRiskHits.length * highRiskWeight;
  riskScore = Math.min(100, riskScore);

  const requiresGroupReview = riskScore >= (policy.workflowGraph?.stepPatterns?.['group-review']?.minRiskScore ?? 70);

  return {
    gate: 'diff-risk',
    passed: riskScore < threshold,
    hardFail: riskScore >= threshold && (policy.hardStops?.stopOnHighDiffRisk ?? true),
    riskScore,
    threshold,
    totalLinesChanged: totalLines,
    changedFiles: changedFiles.length,
    highRiskFilesHit: highRiskHits,
    requiresGroupReview,
    summary: `Diff-risk score: ${riskScore}/${threshold} (${totalLines} lines, ${highRiskHits.length} high-risk paths)`,
  };
}

// ── Flaky-Test Detection ──────────────────────────────────────────────────────

function runFlakyTestDetection(policy) {
  const flakyConfig = policy.hardStops?.flakyTestDetection ?? {};
  const warnThreshold = flakyConfig.warnThreshold ?? 2;

  // Check last test run logs for repeated failures
  const testLogPath = join(LOGS_DIR, 'test-run-history.json');
  let history = [];
  if (existsSync(testLogPath)) {
    try {
      history = JSON.parse(readFileSync(testLogPath, 'utf8'));
    } catch {
      history = [];
    }
  }

  // Count tests that have failed more than once in recent history
  const failCounts = {};
  history.forEach((run) => {
    (run.failures ?? []).forEach((f) => {
      failCounts[f] = (failCounts[f] ?? 0) + 1;
    });
  });

  const flakyTests = Object.entries(failCounts)
    .filter(([, count]) => count >= warnThreshold)
    .map(([test, count]) => ({ test, failCount: count }));

  const hardFail = flakyConfig.failOnFlaky && flakyTests.length > 0;

  return {
    gate: 'flaky-tests',
    passed: flakyTests.length === 0,
    hardFail,
    flakyTests,
    summary: flakyTests.length === 0
      ? 'No flaky tests detected'
      : `${flakyTests.length} potentially flaky test(s) detected`,
  };
}

// ── Aggregate + Report ────────────────────────────────────────────────────────

function runAllGates(policy) {
  ensureLogs();

  const results = {
    trace: createTraceContext(policy, { component: 'verification-gates' }),
    version: policy.version,
    schemaVersion: policy.schemaVersion,
    runAt: new Date().toISOString(),
    gates: [],
    overallPassed: true,
    hardFails: [],
  };

  const gates = [
    runSecurityScan(policy),
    runDiffRiskScore(policy),
    runFlakyTestDetection(policy),
  ];

  for (const gate of gates) {
    results.gates.push(gate);
    if (gate.hardFail) {
      results.hardFails.push(gate.gate);
      results.overallPassed = false;
    }
  }

  writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2), 'utf8');

  console.log('\n=== Aegis Verification Gates ===');
  results.gates.forEach((g) => {
    const icon = g.hardFail ? '✗ HARD FAIL' : g.passed ? '✓ PASS' : '⚠ WARN';
    console.log(`  [${icon}] ${g.gate}: ${g.summary}`);
  });

  if (results.requiresGroupReview) {
    console.log('\n⚠ High-risk diff detected — group review required before merge');
  }

  if (results.overallPassed) {
    console.log('\n✓ All verification gates passed');
  } else {
    console.log(`\n✗ Hard fails: ${results.hardFails.join(', ')}`);
    console.log(`  Report: ${REPORT_FILE}`);
    process.exit(1);
  }

  return results;
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const policy = loadPolicy();

if (!isFeatureEnabled(policy, 'gates')) {
  console.warn('Verification gates are disabled by policy feature toggle.');
  process.exit(0);
}

if (args.includes('--security')) {
  ensureLogs();
  const r = runSecurityScan(policy);
  console.log(JSON.stringify(r, null, 2));
  if (r.hardFail) process.exit(1);
} else if (args.includes('--diff-risk')) {
  ensureLogs();
  const r = runDiffRiskScore(policy);
  console.log(JSON.stringify(r, null, 2));
  if (r.hardFail) process.exit(1);
} else if (args.includes('--flaky-detect')) {
  ensureLogs();
  const r = runFlakyTestDetection(policy);
  console.log(JSON.stringify(r, null, 2));
  if (r.hardFail) process.exit(1);
} else if (args.includes('--report')) {
  if (existsSync(REPORT_FILE)) {
    const report = JSON.parse(readFileSync(REPORT_FILE, 'utf8'));
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('No report found. Run verification gates first.');
  }
} else {
  runAllGates(policy);
}
