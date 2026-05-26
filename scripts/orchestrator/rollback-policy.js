#!/usr/bin/env node
/**
 * Aegis vNext — Structured Rollback Policy (Phase B / #4)
 * Auto-creates a per-task rollback plan (files touched, revert command, fallback owner).
 * Triggers automatic rollback after maxRetriesBeforeRollback is exhausted.
 *
 * Usage:
 *   node rollback-policy.js --create <taskId>         # create rollback plan
 *   node rollback-policy.js --trigger <taskId>        # execute rollback
 *   node rollback-policy.js --status [<taskId>]       # show plan(s)
 *   node rollback-policy.js --check-retries <taskId>  # check retry count, auto-trigger if maxed
 *   node rollback-policy.js --increment <taskId>      # increment retry count
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..', '..');
const POLICY_PATH = join(__dirname, 'policy.json');

function readPolicy() {
  return JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
}

function getRollbackDir(policy) {
  const dir = join(ROOT, policy.rollback?.rollbackPlanDir ?? 'logs/orchestrator/rollback-plans');
  mkdirSync(dir, { recursive: true });
  return dir;
}

function getPlanFile(rollbackDir, taskId) {
  return join(rollbackDir, `rollback-${taskId.replace(/[^a-zA-Z0-9_-]/g, '-')}.json`);
}

function gitGetChangedFiles() {
  try {
    const output = execSync(`git -C "${ROOT}" diff --name-only HEAD 2>&1`, { encoding: 'utf8' });
    return output.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function gitGetStagedFiles() {
  try {
    const output = execSync(`git -C "${ROOT}" diff --cached --name-only 2>&1`, { encoding: 'utf8' });
    return output.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

function gitGetHead() {
  try {
    return execSync(`git -C "${ROOT}" rev-parse HEAD`, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function gitGetBranch() {
  try {
    return execSync(`git -C "${ROOT}" rev-parse --abbrev-ref HEAD`, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function createRollbackPlan(taskId, policy) {
  const rollbackDir = getRollbackDir(policy);
  const planFile = getPlanFile(rollbackDir, taskId);

  const touchedFiles = [...new Set([...gitGetChangedFiles(), ...gitGetStagedFiles()])];
  const headSha = gitGetHead();
  const branch = gitGetBranch();
  const fallbackOwner = policy.rollback?.fallbackOwner ?? '@Grace';

  const plan = {
    taskId,
    createdAt: new Date().toISOString(),
    gitHeadSha: headSha,
    gitBranch: branch,
    filesTouched: touchedFiles,
    revertCommand: `git -C "${ROOT}" checkout HEAD -- ${touchedFiles.map((f) => `"${f}"`).join(' ')}`,
    hardRevertCommand: headSha ? `git -C "${ROOT}" reset --hard ${headSha}` : null,
    fallbackOwner,
    retryCount: 0,
    maxRetries: policy.rollback?.maxRetriesBeforeRollback ?? 2,
    status: 'active',
    rollbackExecutedAt: null,
    rollbackReason: null,
  };

  writeFileSync(planFile, JSON.stringify(plan, null, 2), 'utf8');
  console.log(`Rollback plan created for task: ${taskId}`);
  console.log(`  Files touched: ${touchedFiles.length > 0 ? touchedFiles.join(', ') : '(none)'}`);
  console.log(`  Git SHA: ${headSha ?? '(unknown)'}`);
  console.log(`  Fallback owner: ${fallbackOwner}`);
  console.log(`  Plan file: ${planFile}`);
  return plan;
}

function executeRollback(taskId, reason, policy) {
  const rollbackDir = getRollbackDir(policy);
  const planFile = getPlanFile(rollbackDir, taskId);

  if (!existsSync(planFile)) {
    console.error(`No rollback plan found for task: ${taskId}`);
    process.exit(1);
  }

  const plan = JSON.parse(readFileSync(planFile, 'utf8'));

  if (plan.status === 'rolled-back') {
    console.log(`Task ${taskId} was already rolled back at ${plan.rollbackExecutedAt}`);
    return;
  }

  console.log(`\nExecuting rollback for task: ${taskId}`);
  console.log(`  Reason: ${reason ?? 'manual trigger'}`);
  console.log(`  Target SHA: ${plan.gitHeadSha}`);

  let success = false;
  if (plan.filesTouched.length > 0 && plan.gitHeadSha) {
    try {
      const fileList = plan.filesTouched.map((f) => `"${f}"`).join(' ');
      execSync(`git -C "${ROOT}" checkout "${plan.gitHeadSha}" -- ${fileList} 2>&1`, { stdio: 'inherit' });
      success = true;
      console.log('  File-level rollback successful.');
    } catch (err) {
      console.warn('  File-level rollback failed. Attempting hard reset...');
      try {
        execSync(`git -C "${ROOT}" reset --hard "${plan.gitHeadSha}" 2>&1`, { stdio: 'inherit' });
        success = true;
        console.log('  Hard reset successful.');
      } catch {
        console.error('  Hard reset also failed. Manual intervention required.');
      }
    }
  } else {
    console.log('  No files to rollback (clean state at checkpoint).');
    success = true;
  }

  plan.status = success ? 'rolled-back' : 'rollback-failed';
  plan.rollbackExecutedAt = new Date().toISOString();
  plan.rollbackReason = reason ?? 'manual trigger';
  writeFileSync(planFile, JSON.stringify(plan, null, 2), 'utf8');

  if (success) {
    console.log(`Rollback complete. Fallback owner: ${plan.fallbackOwner}`);
  } else {
    console.error(`Rollback failed. Escalate to: ${plan.fallbackOwner}`);
    process.exit(1);
  }
}

function incrementRetry(taskId, policy) {
  const rollbackDir = getRollbackDir(policy);
  const planFile = getPlanFile(rollbackDir, taskId);

  if (!existsSync(planFile)) {
    console.error(`No rollback plan found for task: ${taskId}`);
    process.exit(1);
  }

  const plan = JSON.parse(readFileSync(planFile, 'utf8'));
  plan.retryCount = (plan.retryCount ?? 0) + 1;
  writeFileSync(planFile, JSON.stringify(plan, null, 2), 'utf8');

  console.log(`Retry count for ${taskId}: ${plan.retryCount}/${plan.maxRetries}`);

  if (plan.retryCount >= plan.maxRetries && policy.rollback?.autoRollbackOnMaxRetries) {
    console.log(`Max retries reached (${plan.maxRetries}). Auto-triggering rollback.`);
    executeRollback(taskId, `auto-rollback after ${plan.retryCount} failed retries`, policy);
    process.exit(1);
  }
}

function checkRetries(taskId, policy) {
  const rollbackDir = getRollbackDir(policy);
  const planFile = getPlanFile(rollbackDir, taskId);

  if (!existsSync(planFile)) {
    console.log(`No rollback plan found for task: ${taskId}. Use --create first.`);
    return;
  }

  const plan = JSON.parse(readFileSync(planFile, 'utf8'));
  const remaining = plan.maxRetries - plan.retryCount;

  console.log(`Task: ${taskId}`);
  console.log(`Retries: ${plan.retryCount}/${plan.maxRetries} (${remaining} remaining)`);
  console.log(`Status: ${plan.status}`);

  if (remaining <= 0 && policy.rollback?.autoRollbackOnMaxRetries) {
    console.log('Max retries reached — triggering automatic rollback');
    executeRollback(taskId, 'auto-rollback: retries exhausted', policy);
    process.exit(1);
  }
}

function printStatus(taskId, policy) {
  const rollbackDir = getRollbackDir(policy);

  if (taskId) {
    const planFile = getPlanFile(rollbackDir, taskId);
    if (!existsSync(planFile)) {
      console.log(`No rollback plan for task: ${taskId}`);
      return;
    }
    const plan = JSON.parse(readFileSync(planFile, 'utf8'));
    console.log(JSON.stringify(plan, null, 2));
    return;
  }

  console.log(`\nRollback plans directory: ${rollbackDir}`);
  try {
    const files = execSync(`ls "${rollbackDir}"/*.json 2>/dev/null`, { encoding: 'utf8' }).split('\n').filter(Boolean);
    if (files.length === 0) {
      console.log('No rollback plans found.');
      return;
    }
    files.forEach((f) => {
      const plan = JSON.parse(readFileSync(f, 'utf8'));
      console.log(`  [${plan.status}] ${plan.taskId} — retries: ${plan.retryCount}/${plan.maxRetries} — created: ${plan.createdAt}`);
    });
  } catch {
    console.log('No rollback plans found.');
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const policy = readPolicy();

if (!policy.rollback?.enabled) {
  console.warn('Rollback policy is disabled in policy.json (rollback.enabled=false)');
  process.exit(0);
}

if (args.includes('--create')) {
  const taskId = args[args.indexOf('--create') + 1];
  createRollbackPlan(taskId, policy);
} else if (args.includes('--trigger')) {
  const taskId = args[args.indexOf('--trigger') + 1];
  const reason = args.includes('--reason') ? args[args.indexOf('--reason') + 1] : null;
  executeRollback(taskId, reason, policy);
} else if (args.includes('--increment')) {
  const taskId = args[args.indexOf('--increment') + 1];
  incrementRetry(taskId, policy);
} else if (args.includes('--check-retries')) {
  const taskId = args[args.indexOf('--check-retries') + 1];
  checkRetries(taskId, policy);
} else if (args.includes('--status') || args.length === 0) {
  const taskId = args.includes('--status') ? args[args.indexOf('--status') + 1] : null;
  printStatus(taskId && taskId.startsWith('--') ? null : taskId, policy);
} else {
  console.log('Usage: node rollback-policy.js [--create <taskId>|--trigger <taskId> [--reason <text>]|--increment <taskId>|--check-retries <taskId>|--status [<taskId>]]');
}
