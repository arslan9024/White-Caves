#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadPolicy, createTraceContext, runPolicyDiffGate } from './policy-loader.js';
import { runGovernanceAudit } from './governance-audit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');
const LOGS_DIR = join(ROOT, 'logs', 'orchestrator');

function safeReadJSON(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

const policy = loadPolicy();
const trace = createTraceContext(policy);
const diffGate = runPolicyDiffGate(policy);
const gates = safeReadJSON(join(LOGS_DIR, 'verification-gates-report.json'));
const budget = safeReadJSON(join(LOGS_DIR, 'budget', 'session-budget.json'));
const snapshot = safeReadJSON(join(LOGS_DIR, 'session-snapshot.json'));
const workflowState = safeReadJSON(join(LOGS_DIR, 'workflow-state', 'current-state.json'));
const routingDecision = safeReadJSON(join(LOGS_DIR, 'model-routing-decision.json'));
const contextManifest = safeReadJSON(join(LOGS_DIR, 'session-context-manifest.json'));
const handoffSummary = safeReadJSON(join(LOGS_DIR, 'handoff-summary.json'));
const governanceAudit = runGovernanceAudit();

const summary = {
  generatedAt: new Date().toISOString(),
  trace,
  policy: {
    version: policy.version,
    schemaVersion: policy.schemaVersion,
    rolloutEnv: policy.rollout?.environment,
    rolloutMode: policy.rollout?.policyModeByEnv?.[policy.rollout?.environment ?? 'development'],
  },
  gates: {
    policyDiffPassed: diffGate.passed,
    policyDiffCriticalChanges: diffGate.criticalDiffs.length,
    verificationPassed: gates?.overallPassed ?? null,
    verificationHardFails: gates?.hardFails ?? [],
    governanceAuditPassed: governanceAudit.errors.length === 0,
    governanceAuditWarnings: governanceAudit.warnings.length,
  },
  runtime: {
    workflowStep: workflowState?.currentStep ?? null,
    budgetHardCapHit: budget?.hardCapHit ?? false,
    budgetRetriesUsed: budget?.retriesUsed ?? null,
    sessionLoopIteration: snapshot?.loopIteration ?? null,
    routingTier: routingDecision?.modelTier ?? null,
    newChatRecommended: contextManifest?.newChatRecommendation?.needed ?? false,
  },
  context: {
    filesInScope: contextManifest?.filesInScope?.length ?? 0,
    bootstrapFiles: handoffSummary?.bootstrapFiles?.length ?? 0,
  },
  files: {
    policyBaselineExists: existsSync(join(LOGS_DIR, 'policy-baseline.json')),
    traceDirExists: existsSync(join(LOGS_DIR, 'traces')),
    rollbackPlansDirExists: existsSync(join(LOGS_DIR, 'rollback-plans')),
  },
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log('\n=== Aegis Health Summary ===');
  console.log(`Policy: ${summary.policy.version} (schema ${summary.policy.schemaVersion})`);
  console.log(`Rollout: ${summary.policy.rolloutEnv} / ${summary.policy.rolloutMode}`);
  console.log(`Policy diff gate: ${summary.gates.policyDiffPassed ? 'PASS' : 'FAIL'} (critical changes: ${summary.gates.policyDiffCriticalChanges})`);
  console.log(`Verification gates: ${summary.gates.verificationPassed === null ? 'N/A' : (summary.gates.verificationPassed ? 'PASS' : 'FAIL')}`);
  console.log(`Governance audit: ${summary.gates.governanceAuditPassed ? 'PASS' : 'FAIL'} (warnings: ${summary.gates.governanceAuditWarnings})`);
  console.log(`Workflow step: ${summary.runtime.workflowStep ?? 'n/a'}`);
  console.log(`Routing tier: ${summary.runtime.routingTier ?? 'n/a'}`);
  console.log(`New chat recommended: ${summary.runtime.newChatRecommended ? 'yes' : 'no'}`);
  console.log(`Budget hard cap hit: ${summary.runtime.budgetHardCapHit ? 'yes' : 'no'}`);
  console.log(`Session loop iteration: ${summary.runtime.sessionLoopIteration ?? 'n/a'}`);
  console.log(`Trace ID: ${summary.trace.traceId}`);
}
