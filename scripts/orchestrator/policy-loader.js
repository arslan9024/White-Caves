#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..', '..');
const POLICY_PATH = join(__dirname, 'policy.json');
const BASELINE_PATH = join(ROOT, 'logs', 'orchestrator', 'policy-baseline.json');
const ACK_PATH = join(ROOT, 'logs', 'orchestrator', 'POLICY_DIFF_ACK');

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultRolloutEnvironment() {
  const env = (process.env.AEGIS_ENV || process.env.NODE_ENV || 'development').toLowerCase();
  if (env === 'production' || env === 'staging') return env;
  return 'development';
}

function normalizePolicy(rawPolicy) {
  const policy = deepClone(rawPolicy ?? {});
  policy.schemaVersion = String(policy.schemaVersion ?? '2.0.0');
  policy.version = String(policy.version ?? 'unknown');

  policy.compatibility = policy.compatibility ?? {};
  policy.compatibility.legacyPolicyVersions = policy.compatibility.legacyPolicyVersions ?? [
    '2026.05.26-aegis-170-v3',
    '2026.05.25-aegis-150-v2',
  ];
  policy.compatibility.acceptLegacyLabels = policy.compatibility.acceptLegacyLabels ?? true;

  policy.rollout = policy.rollout ?? {};
  policy.rollout.environment = policy.rollout.environment ?? defaultRolloutEnvironment();
  policy.rollout.policyModeByEnv = policy.rollout.policyModeByEnv ?? {
    development: 'shadow',
    staging: 'canary',
    production: 'stable',
  };
  policy.rollout.canaryPercentByEnv = policy.rollout.canaryPercentByEnv ?? {
    development: 100,
    staging: 20,
    production: 5,
  };
  policy.rollout.shadowPolicyEvaluation = policy.rollout.shadowPolicyEvaluation ?? true;
  policy.rollout.autoRollbackOnRegression = policy.rollout.autoRollbackOnRegression ?? true;
  policy.rollout.regressionThresholdPct = policy.rollout.regressionThresholdPct ?? 10;

  policy.features = policy.features ?? {};
  policy.features.killSwitchAll = policy.features.killSwitchAll ?? false;
  policy.features.graph = policy.features.graph ?? Boolean(policy.workflowGraph?.enabled ?? true);
  policy.features.checkpoints = policy.features.checkpoints ?? Boolean(policy.checkpoints?.enabled ?? true);
  policy.features.gates = policy.features.gates ?? true;
  policy.features.rollback = policy.features.rollback ?? Boolean(policy.rollback?.enabled ?? true);
  policy.features.tracing = policy.features.tracing ?? Boolean(policy.observability?.tracing?.enabled ?? true);
  policy.features.budget = policy.features.budget ?? Boolean(policy.observability?.budgetLimits?.enabled ?? true);
  policy.features.routing = policy.features.routing ?? Boolean(policy.confidenceRouting?.enabled ?? true);
  policy.features.benchmark = policy.features.benchmark ?? Boolean(policy.benchmark?.enabled ?? true);

  policy.verification = policy.verification ?? {};
  policy.verification.diffRiskWeights = policy.verification.diffRiskWeights ?? {
    linesChangedScale: 500,
    highRiskPathWeight: 10,
  };
  policy.verification.tiers = policy.verification.tiers ?? {
    security: { blockSeverities: ['critical'] },
    auth: { blockSeverities: ['critical', 'high'] },
    database: { blockSeverities: ['critical', 'high'] },
    payment: { blockSeverities: ['critical', 'high'] },
    general: { blockSeverities: ['critical'] },
  };
  policy.verification.exceptions = policy.verification.exceptions ?? [];

  policy.confidenceRouting = policy.confidenceRouting ?? {};
  policy.confidenceRouting.fallbackDecision = policy.confidenceRouting.fallbackDecision ?? 'human-approval';
  policy.confidenceRouting.fallbackChain = policy.confidenceRouting.fallbackChain ?? ['human-approval', 'approval', 'escalate'];
  policy.confidenceRouting.requireReviewMetadataOnUncertain = policy.confidenceRouting.requireReviewMetadataOnUncertain ?? true;
  policy.confidenceRouting.canaryPercentOverride = policy.confidenceRouting.canaryPercentOverride ?? null;

  policy.observability = policy.observability ?? {};
  policy.observability.telemetry = policy.observability.telemetry ?? {};
  policy.observability.telemetry.includePolicyVersion = policy.observability.telemetry.includePolicyVersion ?? true;
  policy.observability.telemetry.includeRouteDecision = policy.observability.telemetry.includeRouteDecision ?? true;
  policy.observability.telemetry.includeGateOutcomes = policy.observability.telemetry.includeGateOutcomes ?? true;
  policy.observability.telemetry.includeRollbackCause = policy.observability.telemetry.includeRollbackCause ?? true;

  return policy;
}

export function loadPolicy() {
  return normalizePolicy(JSON.parse(readFileSync(POLICY_PATH, 'utf8')));
}

export function validatePolicy(policy) {
  const issues = [];
  if (!policy.version) issues.push('policy.version is required');
  if (!policy.schemaVersion) issues.push('policy.schemaVersion is required');
  if (!policy.workflowGraph?.steps || policy.workflowGraph.steps.length < 2) issues.push('workflowGraph.steps must include at least 2 steps');
  if (!policy.executionMode?.default) issues.push('executionMode.default is required');
  if (!policy.rollout?.environment) issues.push('rollout.environment is required');
  return issues;
}

function flattenObject(obj, prefix = '') {
  const out = {};
  for (const [key, value] of Object.entries(obj ?? {})) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flattenObject(value, full));
    } else {
      out[full] = value;
    }
  }
  return out;
}

function policyMode(policy) {
  const env = policy.rollout?.environment ?? defaultRolloutEnvironment();
  return policy.rollout?.policyModeByEnv?.[env] ?? 'stable';
}

export function getCanaryPercent(policy) {
  if (typeof policy.confidenceRouting?.canaryPercentOverride === 'number') {
    return Math.max(0, Math.min(100, policy.confidenceRouting.canaryPercentOverride));
  }
  const env = policy.rollout?.environment ?? defaultRolloutEnvironment();
  const pct = policy.rollout?.canaryPercentByEnv?.[env];
  return Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 100;
}

export function isFeatureEnabled(policy, feature) {
  if (policy.features?.killSwitchAll) return false;
  const mode = policyMode(policy);
  if (feature === 'routing' && mode === 'stable' && policy.rollout?.shadowPolicyEvaluation) return true;
  return policy.features?.[feature] !== false;
}

export function createTraceContext(policy, extra = {}) {
  const traceId = process.env.AEGIS_TRACE_ID || randomUUID();
  return {
    traceId,
    sessionId: process.env.AEGIS_SESSION_ID ?? `aegis-${Date.now()}`,
    policyVersion: policy.version,
    policySchemaVersion: policy.schemaVersion,
    environment: policy.rollout?.environment ?? defaultRolloutEnvironment(),
    ...extra,
  };
}

export function ensurePolicyBaseline(policy) {
  if (existsSync(BASELINE_PATH)) return JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
  mkdirSync(join(ROOT, 'logs', 'orchestrator'), { recursive: true });
  writeFileSync(BASELINE_PATH, JSON.stringify(policy, null, 2), 'utf8');
  return policy;
}

export function runPolicyDiffGate(policy) {
  const baseline = ensurePolicyBaseline(policy);
  const currentFlat = flattenObject(policy);
  const baselineFlat = flattenObject(baseline);
  const changed = [];

  for (const [key, value] of Object.entries(currentFlat)) {
    if (baselineFlat[key] !== value) {
      changed.push({ key, previous: baselineFlat[key], current: value });
    }
  }

  const criticalPrefixes = [
    'approvalPhrase',
    'workflowGraph.steps',
    'executionMode.default',
    'hardStops.diffRiskScoreThreshold',
    'modelRouting.planningAgents',
  ];
  const criticalDiffs = changed.filter(d => criticalPrefixes.some(prefix => d.key.startsWith(prefix)));
  const requiresAck = criticalDiffs.length > 0;
  const hasAck = existsSync(ACK_PATH);
  const stopOnPolicyMismatch = policy.hardStops?.stopOnPolicyMismatch ?? true;
  const passed = !requiresAck || hasAck || !stopOnPolicyMismatch;

  return {
    passed,
    changed,
    criticalDiffs,
    requiresAck,
    hasAck,
    ackPath: ACK_PATH,
    baselinePath: BASELINE_PATH,
    mode: policyMode(policy),
  };
}
