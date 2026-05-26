#!/usr/bin/env node
/**
 * Aegis vNext — Workflow Graph Mode
 * Implements MAF-style sequential/parallel/handoff/group-review execution patterns.
 * Usage:
 *   node workflow-graph.js --status
 *   node workflow-graph.js --start <step>
 *   node workflow-graph.js --advance
 *   node workflow-graph.js --handoff <fromStep> <toStep>
 *   node workflow-graph.js --group-review
 *   node workflow-graph.js --parallel-fan-out <step>
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

function getStateDir(policy) {
  const dir = join(ROOT, policy.workflowGraph?.stateDir ?? 'logs/orchestrator/workflow-state');
  mkdirSync(dir, { recursive: true });
  return dir;
}

function getStateFile(stateDir) {
  return join(stateDir, 'current-state.json');
}

function readState(stateFile) {
  if (!existsSync(stateFile)) {
    return {
      currentStep: null,
      stepHistory: [],
      startedAt: null,
      lastUpdatedAt: null,
      parallelLanes: [],
      pendingHandoffs: [],
      groupReviewPending: false,
    };
  }
  return JSON.parse(readFileSync(stateFile, 'utf8'));
}

function writeState(stateFile, state) {
  state.lastUpdatedAt = new Date().toISOString();
  writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');
}

function timestamp() {
  return new Date().toISOString();
}

function printStatus(state, policy) {
  const graph = policy.workflowGraph;
  const steps = graph.steps;
  const currentIndex = state.currentStep ? steps.indexOf(state.currentStep) : -1;

  console.log('\n=== Aegis Workflow Graph Status ===');
  console.log(`Version: ${policy.version}`);
  console.log(`Graph mode: ${graph.enabled ? 'enabled' : 'disabled'}`);
  console.log(`Steps: ${steps.join(' → ')}`);
  console.log(`Current step: ${state.currentStep ?? '(not started)'}`);
  console.log(`Progress: ${currentIndex + 1}/${steps.length}`);
  console.log(`Last updated: ${state.lastUpdatedAt ?? 'never'}`);

  if (state.stepHistory.length > 0) {
    console.log('\nStep history:');
    state.stepHistory.forEach((h) => {
      console.log(`  [${h.completedAt}] ${h.step} → ${h.outcome}`);
    });
  }

  if (state.parallelLanes.length > 0) {
    console.log(`\nActive parallel lanes: ${state.parallelLanes.join(', ')}`);
  }

  if (state.pendingHandoffs.length > 0) {
    console.log('\nPending handoffs:');
    state.pendingHandoffs.forEach((h) => {
      console.log(`  ${h.from} → ${h.to} (${h.agent}) [queued: ${h.queuedAt}]`);
    });
  }

  if (state.groupReviewPending) {
    console.log('\n⚠ Group review is pending — requires human approvals before advancing');
  }
}

function startStep(step, state, stateFile, graph) {
  const steps = graph.steps;
  if (!steps.includes(step)) {
    console.error(`Unknown step '${step}'. Valid steps: ${steps.join(', ')}`);
    process.exit(1);
  }

  if (state.currentStep === step) {
    console.log(`Already on step '${step}'`);
    return;
  }

  if (state.currentStep) {
    state.stepHistory.push({
      step: state.currentStep,
      completedAt: timestamp(),
      outcome: 'advanced',
    });
  }

  state.currentStep = step;
  state.startedAt = state.startedAt ?? timestamp();
  writeState(stateFile, state);
  console.log(`Workflow step started: ${step}`);
  console.log(`Handoff rule: ${graph.stepPatterns?.handoff?.[step + '→' + steps[steps.indexOf(step) + 1]] ?? 'none'}`);
}

function advanceStep(state, stateFile, graph) {
  const steps = graph.steps;
  const currentIndex = state.currentStep ? steps.indexOf(state.currentStep) : -1;

  if (state.groupReviewPending) {
    console.error('Cannot advance: group review is pending. Resolve approvals first.');
    process.exit(1);
  }

  if (currentIndex === -1) {
    console.error('Workflow not started. Use --start <step> first.');
    process.exit(1);
  }

  if (currentIndex >= steps.length - 1) {
    console.log(`Workflow complete — all steps finished: ${steps.join(' → ')}`);
    state.stepHistory.push({ step: state.currentStep, completedAt: timestamp(), outcome: 'completed' });
    state.currentStep = null;
    writeState(stateFile, state);
    return;
  }

  const nextStep = steps[currentIndex + 1];
  state.stepHistory.push({ step: state.currentStep, completedAt: timestamp(), outcome: 'advanced' });
  state.currentStep = nextStep;
  writeState(stateFile, state);

  const handoffKey = `${steps[currentIndex]}→${nextStep}`;
  const handoffAgent = graph.stepPatterns?.handoff?.[handoffKey];
  console.log(`Workflow advanced: ${steps[currentIndex]} → ${nextStep}`);
  if (handoffAgent) {
    console.log(`Handoff: ${handoffAgent}`);
    state.pendingHandoffs.push({ from: steps[currentIndex], to: nextStep, agent: handoffAgent, queuedAt: timestamp() });
    writeState(stateFile, state);
  }
}

function triggerHandoff(fromStep, toStep, state, stateFile, graph) {
  const handoffKey = `${fromStep}→${toStep}`;
  const agent = graph.stepPatterns?.handoff?.[handoffKey] ?? `${fromStep}-owner→${toStep}-owner`;
  const handoff = { from: fromStep, to: toStep, agent, queuedAt: timestamp() };
  state.pendingHandoffs = state.pendingHandoffs.filter(
    (h) => !(h.from === fromStep && h.to === toStep),
  );
  state.pendingHandoffs.push(handoff);
  writeState(stateFile, state);
  console.log(`Handoff queued: ${fromStep} → ${toStep} via ${agent}`);
  return handoff;
}

function triggerGroupReview(state, stateFile, graph, riskScore) {
  const gr = graph.stepPatterns?.['group-review'];
  const minRisk = gr?.minRiskScore ?? 70;
  const effectiveRisk = riskScore ?? minRisk;

  if (effectiveRisk < minRisk) {
    console.log(`Risk score ${effectiveRisk} is below threshold ${minRisk} — group review not required`);
    return;
  }

  console.log(`Risk score ${effectiveRisk} ≥ ${minRisk} — triggering group review`);
  console.log(`Required reviewers: ${(gr?.reviewers ?? []).join(', ')} (min ${gr?.requiredApprovals ?? 2} approvals)`);
  state.groupReviewPending = true;
  state.groupReviewMeta = { triggeredAt: timestamp(), riskScore: effectiveRisk, reviewers: gr?.reviewers ?? [], requiredApprovals: gr?.requiredApprovals ?? 2, approvals: 0 };
  writeState(stateFile, state);
}

function parallelFanOut(step, state, stateFile, graph) {
  const lanes = graph.stepPatterns?.parallel?.[step];
  if (!lanes) {
    console.log(`No parallel lanes configured for step '${step}'`);
    return;
  }
  state.parallelLanes = lanes;
  writeState(stateFile, state);
  console.log(`Parallel fan-out for '${step}': [${lanes.join(', ')}]`);
  lanes.forEach((lane) => console.log(`  Dispatch lane: ${lane} (${step}:${lane})`));
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const policy = readPolicy();
const graph = policy.workflowGraph;

if (!graph?.enabled) {
  console.warn('Workflow graph mode is disabled in policy.json (workflowGraph.enabled=false)');
  process.exit(0);
}

const stateDir = getStateDir(policy);
const stateFile = getStateFile(stateDir);
const state = readState(stateFile);

if (args.includes('--status') || args.length === 0) {
  printStatus(state, policy);
} else if (args.includes('--start')) {
  const step = args[args.indexOf('--start') + 1];
  startStep(step, state, stateFile, graph);
} else if (args.includes('--advance')) {
  advanceStep(state, stateFile, graph);
} else if (args.includes('--handoff')) {
  const idx = args.indexOf('--handoff');
  const fromStep = args[idx + 1];
  const toStep = args[idx + 2];
  triggerHandoff(fromStep, toStep, state, stateFile, graph);
} else if (args.includes('--group-review')) {
  const riskArg = args.includes('--risk') ? parseInt(args[args.indexOf('--risk') + 1], 10) : undefined;
  triggerGroupReview(state, stateFile, graph, riskArg);
} else if (args.includes('--parallel-fan-out')) {
  const step = args[args.indexOf('--parallel-fan-out') + 1];
  parallelFanOut(step, state, stateFile, graph);
} else {
  console.log('Usage: node workflow-graph.js [--status|--start <step>|--advance|--handoff <from> <to>|--group-review [--risk N]|--parallel-fan-out <step>]');
}
