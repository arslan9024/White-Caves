#!/usr/bin/env node
/**
 * Aegis vNext — Confidence-Based Approval Router (Phase C / #7)
 * Computes a risk + confidence score for each task and routes it to:
 *   - 'autopilot'       → proceed without human approval
 *   - 'human-approval'  → pause and request human sign-off
 * Thresholds are driven by policy.confidenceRouting.
 *
 * Usage:
 *   node confidence-router.js --evaluate <taskId>    # score task, print result
 *   node confidence-router.js --route <taskId>       # score + output routing decision
 *   node confidence-router.js --batch                # evaluate all queued tasks
 *   node confidence-router.js --status               # show routing config
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..', '..');
const POLICY_PATH = join(__dirname, 'policy.json');
const TASK_QUEUE_PATH = join(ROOT, 'scripts', 'orchestrator', 'task-queue.json');
const PRIORITY_ORDER_PATH = join(ROOT, 'logs', 'orchestrator', 'priority-order.json');
const SCAN_REPORT_PATH = join(ROOT, 'logs', 'orchestrator', 'codebase-scan-report.json');
const GATES_REPORT_PATH = join(ROOT, 'logs', 'orchestrator', 'verification-gates-report.json');

function readPolicy() {
  return JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
}

function getRoutingDir(policy) {
  const dir = join(ROOT, policy.confidenceRouting?.routingStateDir ?? 'logs/orchestrator/confidence');
  mkdirSync(dir, { recursive: true });
  return dir;
}

function safeRead(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

// ── Risk Scoring ──────────────────────────────────────────────────────────────

/**
 * Compute a 0–100 risk score and 0.0–1.0 confidence score for a task.
 * Risk is higher when:
 *   - task touches high-risk domains (security, auth, payment, db-migration)
 *   - task has many failing checks in scan report
 *   - diff-risk gate score is high
 * Confidence is higher when:
 *   - scan report has low overall issue count
 *   - task is well-documented (has business_docs reference)
 *   - no hard-fails in verification gates
 */
function scoreTask(task, policy, scanReport, gatesReport) {
  const cfg = policy.confidenceRouting ?? {};
  const highRiskDomains = cfg.highRiskDomains ?? ['security', 'auth', 'payment', 'database-migration'];

  let riskScore = 0;
  let confidenceScore = 1.0;
  const factors = [];

  // Domain-based risk
  const taskText = JSON.stringify(task).toLowerCase();
  const domainHits = highRiskDomains.filter((d) => taskText.includes(d.toLowerCase()));
  if (domainHits.length > 0) {
    riskScore += domainHits.length * 15;
    factors.push({ type: 'risk', reason: `touches high-risk domain(s): ${domainHits.join(', ')}`, delta: domainHits.length * 15 });
  }

  // Task priority / effort weight
  const effort = task.effort ?? task.priority ?? 0;
  if (effort >= 8) {
    riskScore += 20;
    factors.push({ type: 'risk', reason: `high effort/priority: ${effort}`, delta: 20 });
  } else if (effort >= 5) {
    riskScore += 10;
    factors.push({ type: 'risk', reason: `medium effort/priority: ${effort}`, delta: 10 });
  }

  // Scan report issues
  if (scanReport) {
    const issueCount = (scanReport.securityIssues?.length ?? 0) + (scanReport.todoCount ?? 0);
    if (issueCount > 20) {
      riskScore += 15;
      confidenceScore -= 0.15;
      factors.push({ type: 'risk+confidence', reason: `scan has ${issueCount} issues`, delta: 15 });
    } else if (issueCount > 5) {
      riskScore += 5;
      confidenceScore -= 0.05;
      factors.push({ type: 'risk', reason: `scan has ${issueCount} issues`, delta: 5 });
    }
  }

  // Verification gates
  if (gatesReport) {
    if (!gatesReport.overallPassed) {
      riskScore += 25;
      confidenceScore -= 0.25;
      factors.push({ type: 'risk+confidence', reason: `verification gates failed: ${gatesReport.hardFails?.join(', ')}`, delta: 25 });
    }
    const diffRiskGate = gatesReport.gates?.find((g) => g.gate === 'diff-risk');
    if (diffRiskGate?.riskScore > 50) {
      riskScore += Math.round((diffRiskGate.riskScore - 50) / 5);
      factors.push({ type: 'risk', reason: `diff-risk score: ${diffRiskGate.riskScore}`, delta: Math.round((diffRiskGate.riskScore - 50) / 5) });
    }
  }

  // Docs coverage (business docs reference)
  if (task.businessDocRef || task.planRef) {
    confidenceScore += 0.1;
    factors.push({ type: 'confidence', reason: 'has business doc / plan reference', delta: 0.1 });
  }

  riskScore = Math.min(100, Math.max(0, riskScore));
  confidenceScore = Math.min(1.0, Math.max(0, confidenceScore));

  return { riskScore, confidenceScore, factors };
}

function getRoutingDecision(riskScore, confidenceScore, policy) {
  const cfg = policy.confidenceRouting ?? {};
  const autoApproveMinConf = cfg.autoApproveMinConfidence ?? 0.8;
  const requireHumanMaxConf = cfg.requireHumanApprovalMaxConfidence ?? 0.5;
  const riskHighMin = cfg.riskScoreHighMin ?? 70;
  const riskLowMax = cfg.riskScoreLowMax ?? 30;

  if (riskScore >= riskHighMin || confidenceScore <= requireHumanMaxConf) {
    return { decision: 'human-approval', reason: `High risk (${riskScore}) or low confidence (${confidenceScore.toFixed(2)})` };
  }
  if (riskScore <= riskLowMax && confidenceScore >= autoApproveMinConf) {
    return { decision: 'autopilot', reason: `Low risk (${riskScore}) and high confidence (${confidenceScore.toFixed(2)})` };
  }
  return { decision: 'human-approval', reason: `Borderline: risk=${riskScore}, confidence=${confidenceScore.toFixed(2)} — defaulting to human-approval for safety` };
}

function evaluateTask(taskId, policy) {
  const routingDir = getRoutingDir(policy);
  const scanReport = safeRead(SCAN_REPORT_PATH);
  const gatesReport = safeRead(GATES_REPORT_PATH);

  // Find task in queue
  const queue = safeRead(TASK_QUEUE_PATH);
  const priorityOrder = safeRead(PRIORITY_ORDER_PATH);

  let task = null;
  if (queue?.tasks) {
    task = queue.tasks.find((t) => String(t.id) === String(taskId) || t.name === taskId);
  }
  if (!task && priorityOrder?.tasks) {
    task = priorityOrder.tasks.find((t) => String(t.id) === String(taskId));
  }
  if (!task) {
    task = { id: taskId, name: taskId };
  }

  const { riskScore, confidenceScore, factors } = scoreTask(task, policy, scanReport, gatesReport);
  const routing = getRoutingDecision(riskScore, confidenceScore, policy);

  const result = {
    taskId,
    evaluatedAt: new Date().toISOString(),
    riskScore,
    confidenceScore: Math.round(confidenceScore * 100) / 100,
    decision: routing.decision,
    decisionReason: routing.reason,
    scoringFactors: factors,
  };

  // Persist result
  const resultFile = join(routingDir, `routing-${taskId.toString().replace(/[^a-zA-Z0-9_-]/g, '-')}.json`);
  writeFileSync(resultFile, JSON.stringify(result, null, 2), 'utf8');

  return result;
}

function printEvaluation(result) {
  const icon = result.decision === 'autopilot' ? '✓ AUTOPILOT' : '⚠ HUMAN-APPROVAL REQUIRED';
  console.log(`\n[${icon}] Task: ${result.taskId}`);
  console.log(`  Risk score:       ${result.riskScore}/100`);
  console.log(`  Confidence score: ${(result.confidenceScore * 100).toFixed(0)}%`);
  console.log(`  Decision:         ${result.decision}`);
  console.log(`  Reason:           ${result.decisionReason}`);
  if (result.scoringFactors.length > 0) {
    console.log('  Factors:');
    result.scoringFactors.forEach((f) => console.log(`    - ${f.reason} (${f.type}, delta ${f.delta})`));
  }
}

function batchEvaluate(policy) {
  const queue = safeRead(TASK_QUEUE_PATH);
  if (!queue?.tasks?.length) {
    console.log('No tasks found in task-queue.json');
    return;
  }

  console.log(`\n=== Confidence Routing — Batch Evaluation (${queue.tasks.length} tasks) ===\n`);
  const results = queue.tasks.map((t) => evaluateTask(String(t.id ?? t.name), policy));
  const autopilot = results.filter((r) => r.decision === 'autopilot');
  const needsApproval = results.filter((r) => r.decision === 'human-approval');

  results.forEach(printEvaluation);

  console.log(`\nSummary: ${autopilot.length} autopilot / ${needsApproval.length} human-approval`);
  if (needsApproval.length > 0) {
    console.log('Tasks requiring human approval:');
    needsApproval.forEach((r) => console.log(`  ${r.taskId} — risk ${r.riskScore}, conf ${(r.confidenceScore * 100).toFixed(0)}%`));
  }
}

function printStatus(policy) {
  const cfg = policy.confidenceRouting ?? {};
  console.log('\n=== Confidence Router Config ===');
  console.log(`Enabled: ${cfg.enabled ?? false}`);
  console.log(`Auto-approve min confidence: ${cfg.autoApproveMinConfidence ?? 0.8} (${((cfg.autoApproveMinConfidence ?? 0.8) * 100).toFixed(0)}%)`);
  console.log(`Human-approval max confidence: ${cfg.requireHumanApprovalMaxConfidence ?? 0.5}`);
  console.log(`Risk: low ≤${cfg.riskScoreLowMax ?? 30}, high ≥${cfg.riskScoreHighMin ?? 70}`);
  console.log(`High-risk domains: ${(cfg.highRiskDomains ?? []).join(', ')}`);
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const policy = readPolicy();

if (!policy.confidenceRouting?.enabled) {
  console.warn('Confidence routing is disabled in policy.json (confidenceRouting.enabled=false)');
  process.exit(0);
}

if (args.includes('--evaluate')) {
  const taskId = args[args.indexOf('--evaluate') + 1];
  const result = evaluateTask(taskId, policy);
  printEvaluation(result);
} else if (args.includes('--route')) {
  const taskId = args[args.indexOf('--route') + 1];
  const result = evaluateTask(taskId, policy);
  printEvaluation(result);
  process.exit(result.decision === 'human-approval' ? 2 : 0);
} else if (args.includes('--batch')) {
  batchEvaluate(policy);
} else if (args.includes('--status') || args.length === 0) {
  printStatus(policy);
} else {
  console.log('Usage: node confidence-router.js [--evaluate <taskId>|--route <taskId>|--batch|--status]');
}
