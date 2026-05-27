#!/usr/bin/env node
/**
 * Aegis vNext — Session Budget Guard (Phase C / #5)
 * Enforces per-session hard caps: estimated tokens, runtime seconds, retries.
 * Designed to be called at each agent turn and before/after each major step.
 *
 * Usage:
 *   node budget-guard.js --check                         # check if within budget
 *   node budget-guard.js --record --tokens <n> [--retries <n>]  # record usage
 *   node budget-guard.js --status                        # show current budget state
 *   node budget-guard.js --reset                         # reset session budget (new session start)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createTraceContext, isFeatureEnabled, loadPolicy } from './policy-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..', '..');
function getBudgetDir(policy) {
  const dir = join(ROOT, policy.observability?.budgetLimits?.budgetDir ?? 'logs/orchestrator/budget');
  mkdirSync(dir, { recursive: true });
  return dir;
}

function getBudgetFile(budgetDir) {
  return join(budgetDir, 'session-budget.json');
}

function readBudget(budgetFile) {
  if (!existsSync(budgetFile)) {
    return {
      trace: null,
      sessionStartedAt: new Date().toISOString(),
      estimatedTokensUsed: 0,
      retriesUsed: 0,
      runtimeStartMs: Date.now(),
      hardCapHit: false,
    };
  }
  return JSON.parse(readFileSync(budgetFile, 'utf8'));
}

function writeBudget(budgetFile, budget) {
  writeFileSync(budgetFile, JSON.stringify(budget, null, 2), 'utf8');
}

function checkBudget(policy) {
  const limits = policy.observability?.budgetLimits ?? {};
  if (!limits.enabled) {
    console.log('Budget guard is disabled (observability.budgetLimits.enabled=false)');
    return true;
  }

  const budgetDir = getBudgetDir(policy);
  const budgetFile = getBudgetFile(budgetDir);
  const budget = readBudget(budgetFile);

  const runtimeMs = Date.now() - (budget.runtimeStartMs ?? Date.now());
  const runtimeSec = Math.floor(runtimeMs / 1000);

  const violations = [];

  const maxTokens = limits.maxEstimatedTokensPerSession ?? 500000;
  const maxRuntime = limits.maxRuntimeSeconds ?? 3600;
  const maxRetries = limits.maxRetriesPerSession ?? 10;

  if (budget.estimatedTokensUsed >= maxTokens) {
    violations.push(`Token budget exceeded: ${budget.estimatedTokensUsed}/${maxTokens}`);
  }
  if (runtimeSec >= maxRuntime) {
    violations.push(`Runtime budget exceeded: ${runtimeSec}s/${maxRuntime}s`);
  }
  if (budget.retriesUsed >= maxRetries) {
    violations.push(`Retry budget exceeded: ${budget.retriesUsed}/${maxRetries}`);
  }

  if (violations.length > 0) {
    budget.hardCapHit = true;
    budget.hardCapReason = violations.join('; ');
    budget.hardCapAt = new Date().toISOString();
    writeBudget(budgetFile, budget);

    if (limits.hardCap) {
      console.error('✗ Budget hard cap hit:');
      violations.forEach((v) => console.error(`  - ${v}`));
      console.error('Session terminated by budget guard.');
      process.exit(1);
    } else {
      console.warn('⚠ Budget limits exceeded (soft cap — continuing):');
      violations.forEach((v) => console.warn(`  - ${v}`));
    }
    return false;
  }

  console.log('✓ Budget check passed');
  console.log(`  Tokens: ${budget.estimatedTokensUsed}/${maxTokens}`);
  console.log(`  Runtime: ${runtimeSec}s/${maxRuntime}s`);
  console.log(`  Retries: ${budget.retriesUsed}/${maxRetries}`);
  return true;
}

function recordUsage(tokens, retries, policy) {
  const budgetDir = getBudgetDir(policy);
  const budgetFile = getBudgetFile(budgetDir);
  const budget = readBudget(budgetFile);

  budget.estimatedTokensUsed += parseInt(tokens ?? '0', 10);
  budget.retriesUsed += parseInt(retries ?? '0', 10);
  budget.lastRecordedAt = new Date().toISOString();
  writeBudget(budgetFile, budget);

  console.log(`Budget recorded — tokens: +${tokens ?? 0} (total: ${budget.estimatedTokensUsed}), retries: +${retries ?? 0} (total: ${budget.retriesUsed})`);
}

function resetBudget(policy) {
  const budgetDir = getBudgetDir(policy);
  const budgetFile = getBudgetFile(budgetDir);
  const budget = {
    trace: createTraceContext(policy, { component: 'budget-guard' }),
    sessionStartedAt: new Date().toISOString(),
    estimatedTokensUsed: 0,
    retriesUsed: 0,
    runtimeStartMs: Date.now(),
    hardCapHit: false,
  };
  writeBudget(budgetFile, budget);
  console.log('Session budget reset.');
}

function printStatus(policy) {
  const limits = policy.observability?.budgetLimits ?? {};
  const budgetDir = getBudgetDir(policy);
  const budgetFile = getBudgetFile(budgetDir);
  const budget = readBudget(budgetFile);

  const runtimeMs = Date.now() - (budget.runtimeStartMs ?? Date.now());
  const runtimeSec = Math.floor(runtimeMs / 1000);

  console.log('\n=== Aegis Budget Guard Status ===');
  console.log(`Enabled: ${limits.enabled ?? false}`);
  console.log(`Hard cap: ${limits.hardCap ?? true}`);
  console.log(`Session started: ${budget.sessionStartedAt}`);
  console.log(`Estimated tokens used: ${budget.estimatedTokensUsed} / ${limits.maxEstimatedTokensPerSession ?? 500000}`);
  console.log(`Runtime: ${runtimeSec}s / ${limits.maxRuntimeSeconds ?? 3600}s`);
  console.log(`Retries: ${budget.retriesUsed} / ${limits.maxRetriesPerSession ?? 10}`);
  if (budget.hardCapHit) {
    console.log(`Hard cap hit at: ${budget.hardCapAt}`);
    console.log(`Reason: ${budget.hardCapReason}`);
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const policy = loadPolicy();

if (!isFeatureEnabled(policy, 'budget')) {
  console.warn('Budget guard is disabled by policy feature toggle.');
  process.exit(0);
}

if (args.includes('--check')) {
  checkBudget(policy);
} else if (args.includes('--record')) {
  const tokens = args.includes('--tokens') ? args[args.indexOf('--tokens') + 1] : '0';
  const retries = args.includes('--retries') ? args[args.indexOf('--retries') + 1] : '0';
  recordUsage(tokens, retries, policy);
} else if (args.includes('--reset')) {
  resetBudget(policy);
} else if (args.includes('--status') || args.length === 0) {
  printStatus(policy);
} else {
  console.log('Usage: node budget-guard.js [--check|--record --tokens <n> [--retries <n>]|--reset|--status]');
}
