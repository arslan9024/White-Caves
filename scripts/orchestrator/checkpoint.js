#!/usr/bin/env node
/**
 * Aegis vNext — Durable Checkpoints + Resume
 * LangGraph/MAF-inspired: save state after each task-phase transition, resume from
 * last valid checkpoint, or time-travel to checkpoint N.
 *
 * Usage:
 *   node checkpoint.js --save <label> [--meta <json>]
 *   node checkpoint.js --list
 *   node checkpoint.js --resume <label>
 *   node checkpoint.js --travel <n>          (0-based index, latest = last)
 *   node checkpoint.js --status
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createTraceContext, isFeatureEnabled, loadPolicy } from './policy-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..', '..');
function getCheckpointDir(policy) {
  const dir = join(ROOT, policy.checkpoints?.checkpointDir ?? 'logs/orchestrator/checkpoints');
  mkdirSync(dir, { recursive: true });
  return dir;
}

function getIndexFile(dir) {
  return join(dir, 'index.json');
}

function readIndex(indexFile) {
  if (!existsSync(indexFile)) return { checkpoints: [] };
  return JSON.parse(readFileSync(indexFile, 'utf8'));
}

function writeIndex(indexFile, index) {
  writeFileSync(indexFile, JSON.stringify(index, null, 2), 'utf8');
}

function sanitizeLabel(label) {
  return label.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase().slice(0, 64);
}

function gitStashSave(label) {
  try {
    const result = execSync(`git -C "${ROOT}" stash push -m "aegis-checkpoint-${sanitizeLabel(label)}" 2>&1`, { encoding: 'utf8' });
    // stash create returns blank if nothing to stash
    if (result.includes('No local changes')) {
      return null; // nothing to stash, clean state
    }
    // Get the stash ref
    const stashList = execSync(`git -C "${ROOT}" stash list --format="%gd %s" 2>&1`, { encoding: 'utf8' });
    const line = stashList.split('\n').find((l) => l.includes(`aegis-checkpoint-${sanitizeLabel(label)}`));
    return line ? line.split(' ')[0] : 'stash@{0}';
  } catch (err) {
    return null;
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

function saveCheckpoint(label, metaArg, policy) {
  const dir = getCheckpointDir(policy);
  const indexFile = getIndexFile(dir);
  const index = readIndex(indexFile);

  const maxCheckpoints = policy.checkpoints?.maxCheckpoints ?? 20;
  const safeLabel = sanitizeLabel(label);
  const ts = new Date().toISOString();

  const stashRef = gitStashSave(safeLabel);
  const headSha = gitGetHead();
  const branch = gitGetBranch();

  let extra = {};
  if (metaArg) {
    try {
      extra = JSON.parse(metaArg);
    } catch {
      extra = { note: metaArg };
    }
  }

  // Load session snapshot if available
  let sessionMeta = {};
  const snapshotPath = join(ROOT, 'logs', 'orchestrator', 'session-snapshot.json');
  if (existsSync(snapshotPath)) {
    try {
      sessionMeta = JSON.parse(readFileSync(snapshotPath, 'utf8'));
    } catch {
      // ignore
    }
  }

  const checkpoint = {
    id: index.checkpoints.length,
    label: safeLabel,
    createdAt: ts,
    gitHeadSha: headSha,
    gitBranch: branch,
    stashRef,
    compatibility: {
      policyVersion: policy.version,
      policySchemaVersion: policy.schemaVersion,
      workflowStepsSignature: JSON.stringify(policy.workflowGraph?.steps ?? []),
    },
    meta: { ...extra, session: sessionMeta },
  };

  // Write per-checkpoint file
  const cpFile = join(dir, `${safeLabel}-${index.checkpoints.length}.json`);
  writeFileSync(cpFile, JSON.stringify(checkpoint, null, 2), 'utf8');

  // Append to index, prune if over max
  index.checkpoints.push({ id: checkpoint.id, label: safeLabel, createdAt: ts, file: cpFile });
  if (index.checkpoints.length > maxCheckpoints) {
    index.checkpoints = index.checkpoints.slice(index.checkpoints.length - maxCheckpoints);
  }
  writeIndex(indexFile, index);

  console.log(`Checkpoint saved: [${checkpoint.id}] ${safeLabel}`);
  console.log(`  Git SHA: ${headSha ?? '(unknown)'}`);
  console.log(`  Stash ref: ${stashRef ?? '(clean — no stash needed)'}`);
  console.log(`  File: ${cpFile}`);
  return checkpoint;
}

function listCheckpoints(policy) {
  const dir = getCheckpointDir(policy);
  const indexFile = getIndexFile(dir);
  const index = readIndex(indexFile);

  if (index.checkpoints.length === 0) {
    console.log('No checkpoints found.');
    return;
  }

  console.log(`\n=== Aegis Checkpoints (${index.checkpoints.length}) ===`);
  index.checkpoints.forEach((cp, i) => {
    const marker = i === index.checkpoints.length - 1 ? ' ← latest' : '';
    console.log(`  [${cp.id}] ${cp.label} — ${cp.createdAt}${marker}`);
  });
}

function getWorkflowState(policy) {
  const stateFile = join(ROOT, policy.workflowGraph?.stateDir ?? 'logs/orchestrator/workflow-state', 'current-state.json');
  if (!existsSync(stateFile)) return null;
  try {
    return JSON.parse(readFileSync(stateFile, 'utf8'));
  } catch {
    return null;
  }
}

function validateCheckpointCompatibility(cp, policy, allowIncompatible) {
  const saved = cp.compatibility ?? {};
  const currentStepsSig = JSON.stringify(policy.workflowGraph?.steps ?? []);
  const mismatch = saved.workflowStepsSignature && saved.workflowStepsSignature !== currentStepsSig;
  if (mismatch && !allowIncompatible) {
    console.error('Checkpoint/workflow incompatibility detected.');
    console.error(`Saved steps: ${saved.workflowStepsSignature}`);
    console.error(`Current steps: ${currentStepsSig}`);
    console.error('Use --allow-incompatible to force restore or --force-clean-restart for safe recovery.');
    process.exit(2);
  }
}

function forceCleanRestart() {
  console.warn('Executing force clean restart...');
  execSync(`git -C "${ROOT}" reset --hard HEAD 2>&1`, { stdio: 'inherit' });
  execSync(`git -C "${ROOT}" clean -fd 2>&1`, { stdio: 'inherit' });
  console.log('Clean restart complete.');
}

function resumeCheckpoint(label, policy, options) {
  const dir = getCheckpointDir(policy);
  const indexFile = getIndexFile(dir);
  const index = readIndex(indexFile);

  const entry = [...index.checkpoints].reverse().find((cp) => cp.label === sanitizeLabel(label));
  if (!entry) {
    console.error(`Checkpoint not found: ${label}`);
    process.exit(1);
  }

  let cp = null;
  try {
    cp = JSON.parse(readFileSync(entry.file, 'utf8'));
  } catch {
    console.error(`Checkpoint file is corrupted: ${entry.file}`);
    if (options.forceCleanRestart) {
      forceCleanRestart();
      return;
    }
    process.exit(2);
  }
  validateCheckpointCompatibility(cp, policy, options.allowIncompatible);
  _applyCheckpoint(cp);
}

function timeTravelToCheckpoint(n, policy, options) {
  const dir = getCheckpointDir(policy);
  const indexFile = getIndexFile(dir);
  const index = readIndex(indexFile);

  const entry = index.checkpoints[parseInt(n, 10)];
  if (!entry) {
    console.error(`Checkpoint index ${n} not found. Valid range: 0–${index.checkpoints.length - 1}`);
    process.exit(1);
  }

  let cp = null;
  try {
    cp = JSON.parse(readFileSync(entry.file, 'utf8'));
  } catch {
    console.error(`Checkpoint file is corrupted: ${entry.file}`);
    if (options.forceCleanRestart) {
      forceCleanRestart();
      return;
    }
    process.exit(2);
  }
  validateCheckpointCompatibility(cp, policy, options.allowIncompatible);
  _applyCheckpoint(cp);
}

function _applyCheckpoint(cp) {
  console.log(`\nRestoring checkpoint: [${cp.id}] ${cp.label} (created ${cp.createdAt})`);
  console.log(`  Target SHA: ${cp.gitHeadSha ?? '(unknown)'}`);

  if (cp.stashRef) {
    console.log(`  Applying stash: ${cp.stashRef}`);
    try {
      execSync(`git -C "${ROOT}" stash apply "${cp.stashRef}" 2>&1`, { stdio: 'inherit' });
      console.log('  Stash applied.');
    } catch {
      console.warn('  Stash apply failed (may have conflicts or already applied).');
    }
  } else {
    console.log('  No stash ref — checkpoint was a clean state; nothing to restore.');
  }

  console.log(`Checkpoint [${cp.id}] ${cp.label} restored.`);
}

function printStatus(policy) {
  const dir = getCheckpointDir(policy);
  const indexFile = getIndexFile(dir);
  const index = readIndex(indexFile);
  const latest = index.checkpoints[index.checkpoints.length - 1];

  console.log('\n=== Aegis Checkpoint Status ===');
  console.log(`Enabled: ${policy.checkpoints?.enabled ?? false}`);
  console.log(`Max checkpoints: ${policy.checkpoints?.maxCheckpoints ?? 20}`);
  console.log(`Checkpoint dir: ${dir}`);
  console.log(`Total checkpoints: ${index.checkpoints.length}`);
  console.log(`Latest: ${latest ? `[${latest.id}] ${latest.label} (${latest.createdAt})` : 'none'}`);
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const policy = loadPolicy();
const trace = createTraceContext(policy, { component: 'checkpoint' });
process.env.AEGIS_TRACE_ID = trace.traceId;
const allowIncompatible = args.includes('--allow-incompatible');
const forceCleanRestartFlag = args.includes('--force-clean-restart');

if (!policy.checkpoints?.enabled || !isFeatureEnabled(policy, 'checkpoints')) {
  console.warn('Checkpoints are disabled in policy.json (checkpoints.enabled=false)');
  process.exit(0);
}

if (forceCleanRestartFlag && !args.includes('--resume') && !args.includes('--travel')) {
  forceCleanRestart();
  process.exit(0);
}

if (args.includes('--save')) {
  const label = args[args.indexOf('--save') + 1];
  const metaArg = args.includes('--meta') ? args[args.indexOf('--meta') + 1] : null;
  saveCheckpoint(label, metaArg, policy);
} else if (args.includes('--list')) {
  listCheckpoints(policy);
} else if (args.includes('--resume')) {
  const label = args[args.indexOf('--resume') + 1];
  resumeCheckpoint(label, policy, { allowIncompatible, forceCleanRestart: forceCleanRestartFlag });
} else if (args.includes('--travel')) {
  const n = args[args.indexOf('--travel') + 1];
  timeTravelToCheckpoint(n, policy, { allowIncompatible, forceCleanRestart: forceCleanRestartFlag });
} else if (args.includes('--status') || args.length === 0) {
  printStatus(policy);
} else {
  const workflowState = getWorkflowState(policy);
  console.log(`Workflow step: ${workflowState?.currentStep ?? 'n/a'}`);
  console.log('Usage: node checkpoint.js [--save <label> [--meta <json>] | --list | --resume <label> [--allow-incompatible|--force-clean-restart] | --travel <n> [--allow-incompatible|--force-clean-restart] | --status | --force-clean-restart]');
}
