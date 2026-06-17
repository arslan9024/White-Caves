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

  policy.artifactSchemasDir = policy.artifactSchemasDir ?? 'scripts/orchestrator/schemas';
  policy.changeLog = policy.changeLog ?? [];

  policy.controlPlane = policy.controlPlane ?? {};
  policy.controlPlane.authoritativeFiles = policy.controlPlane.authoritativeFiles ?? [
    '.github/copilot-instructions.md',
    'AGENTS.md',
    '.github/instructions/agentic-workflow.instructions.md',
    'scripts/orchestrator/policy.json',
  ];
  policy.controlPlane.ownership = policy.controlPlane.ownership ?? {};
  policy.controlPlane.changeControl = policy.controlPlane.changeControl ?? {};
  policy.controlPlane.changeControl.validationCommands = policy.controlPlane.changeControl.validationCommands ?? [
    'npm run plans:validate',
    'npm run aegis:health',
    'npm run aegis:context:validate',
  ];
  policy.controlPlane.changeControl.forbidSilentDrift = policy.controlPlane.changeControl.forbidSilentDrift ?? true;

  policy.planFirst = policy.planFirst ?? {};
  policy.planFirst.enabled = policy.planFirst.enabled ?? true;
  policy.planFirst.defaultMode = policy.planFirst.defaultMode ?? 'plan-before-agent';
  policy.planFirst.trivialExemptions = policy.planFirst.trivialExemptions ?? ['formatting-only', 'comment-only', 'small-doc-fix'];
  policy.planFirst.requiredPlanPacketFields = policy.planFirst.requiredPlanPacketFields ?? [
    'goal',
    'filesInScope',
    'validationPath',
    'recommendedModelTier',
    'contextSizeExpectation',
  ];
  policy.planFirst.enforceBeforePremiumExecution = policy.planFirst.enforceBeforePremiumExecution ?? true;

  policy.contextBudget = policy.contextBudget ?? {};
  policy.contextBudget.enabled = policy.contextBudget.enabled ?? true;
  policy.contextBudget.defaultMaxFiles = policy.contextBudget.defaultMaxFiles ?? 12;
  policy.contextBudget.defaultMaxInstructionFiles = policy.contextBudget.defaultMaxInstructionFiles ?? 4;
  policy.contextBudget.defaultMaxWaveBundles = policy.contextBudget.defaultMaxWaveBundles ?? 1;
  policy.contextBudget.defaultMaxBusinessDocSections = policy.contextBudget.defaultMaxBusinessDocSections ?? 6;
  policy.contextBudget.warnAfterTurns = policy.contextBudget.warnAfterTurns ?? 16;
  policy.contextBudget.hardStopAfterTurns = policy.contextBudget.hardStopAfterTurns ?? 28;
  policy.contextBudget.warnAfterApproxTokens = policy.contextBudget.warnAfterApproxTokens ?? 120000;
  policy.contextBudget.hardStopAfterApproxTokens = policy.contextBudget.hardStopAfterApproxTokens ?? 220000;
  policy.contextBudget.preferStructuredSummaries = policy.contextBudget.preferStructuredSummaries ?? true;

  policy.sessionManagement = policy.sessionManagement ?? {};
  policy.sessionManagement.oneObjectivePerSession = policy.sessionManagement.oneObjectivePerSession ?? true;
  policy.sessionManagement.oneWaveOrBugFamilyPerSession = policy.sessionManagement.oneWaveOrBugFamilyPerSession ?? true;
  policy.sessionManagement.mandatoryEndOfSessionSummary = policy.sessionManagement.mandatoryEndOfSessionSummary ?? true;
  policy.sessionManagement.requireCarryForwardList = policy.sessionManagement.requireCarryForwardList ?? true;
  policy.sessionManagement.newChatTriggers = policy.sessionManagement.newChatTriggers ?? [
    'objective-changed',
    'file-scope-widened',
    'turn-threshold-exceeded',
    'handoff-no-longer-compact',
  ];

  policy.historyManagement = policy.historyManagement ?? {};
  policy.historyManagement.enabled = policy.historyManagement.enabled ?? true;
  policy.historyManagement.layers = policy.historyManagement.layers ?? ['raw-logs', 'session-snapshot', 'handoff-summary'];
  policy.historyManagement.reuseLayer = policy.historyManagement.reuseLayer ?? 'handoff-summary';
  policy.historyManagement.markStaleAsNonCanonical = policy.historyManagement.markStaleAsNonCanonical ?? true;
  policy.historyManagement.bootstrapFromMinimalPacket = policy.historyManagement.bootstrapFromMinimalPacket ?? true;

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

  policy.modelRouting = policy.modelRouting ?? {};
  policy.modelRouting.policyMode = policy.modelRouting.policyMode ?? 'free-first-premium-by-exception';
  policy.modelRouting.premiumUsage = policy.modelRouting.premiumUsage ?? {};
  policy.modelRouting.premiumUsage.assumeExternalCredits = policy.modelRouting.premiumUsage.assumeExternalCredits ?? false;
  policy.modelRouting.premiumUsage.defaultCapMode = policy.modelRouting.premiumUsage.defaultCapMode ?? 'soft-warning';
  policy.modelRouting.premiumUsage.maxPremiumTurnsPerTask = policy.modelRouting.premiumUsage.maxPremiumTurnsPerTask ?? 4;
  policy.modelRouting.premiumUsage.maxPremiumTurnsPerSession = policy.modelRouting.premiumUsage.maxPremiumTurnsPerSession ?? 12;
  policy.modelRouting.premiumUsage.maxPremiumTurnsPerDay = policy.modelRouting.premiumUsage.maxPremiumTurnsPerDay ?? 40;
  policy.modelRouting.taskClassRouting = policy.modelRouting.taskClassRouting ?? {};
  const defaultTaskClassRouting = {
    exploration: { modelTier: 'free', modelRecommendation: 'Gemini 2.0 Flash', fallbackModel: 'Llama 3.1 70B', maxPremiumTurnsPerTask: 0 },
    planning: { modelTier: 'free', modelRecommendation: 'Gemini 2.0 Flash', fallbackModel: 'DeepSeek V3', maxPremiumTurnsPerTask: 0 },
    documentation: { modelTier: 'free', modelRecommendation: 'Llama 3.1 70B', fallbackModel: 'Gemini 2.0 Flash', maxPremiumTurnsPerTask: 0 },
    triage: { modelTier: 'free', modelRecommendation: 'DeepSeek V3', fallbackModel: 'Gemini 2.0 Flash', maxPremiumTurnsPerTask: 0 },
    research: { modelTier: 'free', modelRecommendation: 'DeepSeek V3', fallbackModel: 'Gemini 2.0 Flash', maxPremiumTurnsPerTask: 0 },
    'architecture-arbitration': { modelTier: 'premium', modelRecommendation: 'GPT-4o', fallbackModel: 'claude-3.5-sonnet', maxPremiumTurnsPerTask: 2 },
    'high-risk-implementation': { modelTier: 'premium', modelRecommendation: 'GPT-4o', fallbackModel: 'claude-3.5-sonnet', maxPremiumTurnsPerTask: 4 },
    'ambiguous-debugging': { modelTier: 'premium', modelRecommendation: 'GPT-4o', fallbackModel: 'claude-3.5-sonnet', maxPremiumTurnsPerTask: 3 },
    'security-sensitive': { modelTier: 'premium', modelRecommendation: 'GPT-4o', fallbackModel: 'claude-3.5-sonnet', maxPremiumTurnsPerTask: 4 },
    'final-synthesis': { modelTier: 'premium', modelRecommendation: 'GPT-4o', fallbackModel: 'Gemini 2.0 Flash', maxPremiumTurnsPerTask: 2 },
  };
  policy.modelRouting.taskClassRouting = { ...defaultTaskClassRouting, ...policy.modelRouting.taskClassRouting };

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
  if (!policy.controlPlane?.authoritativeFiles?.length) issues.push('controlPlane.authoritativeFiles is required');
  if (!policy.planFirst?.requiredPlanPacketFields?.length) issues.push('planFirst.requiredPlanPacketFields is required');
  if (!policy.contextBudget?.defaultMaxFiles) issues.push('contextBudget.defaultMaxFiles is required');
  if (!policy.historyManagement?.layers?.length) issues.push('historyManagement.layers is required');
  if (!policy.modelRouting?.taskClassRouting?.planning) issues.push('modelRouting.taskClassRouting.planning is required');
  return issues;
}

function flattenObject(obj, prefix = '') {
  const out = {};
  for (const [key, value] of Object.entries(obj ?? {})) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flattenObject(value, full));
    } else {
      out[full] = Array.isArray(value) ? JSON.stringify(value) : value;
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

/**
 * Returns the context budget in KB for the given agent tier.
 * Falls back to policy-defined defaults when no tier-specific override is set.
 *
 * @param {object} policy - Loaded policy object (from loadPolicy()).
 * @param {'free'|'premium'} agentTier - The tier of the requesting agent.
 * @returns {{ limitKB: number, enabled: boolean }} Budget limit and enabled flag.
 */
export function getContextBudget(policy, agentTier) {
  const budgetEnabled = policy.contextBudget?.enabled ?? true;
  const tierBudgets = policy.contextBudget?.agentTierBudgetKB ?? {};
  const tier = (agentTier ?? 'free').toLowerCase();

  // Canonical defaults: free=32 KB, premium=128 KB
  const defaults = { free: 32, premium: 128 };
  const limitKB = typeof tierBudgets[tier] === 'number' ? tierBudgets[tier] : (defaults[tier] ?? 32);

  return { limitKB, enabled: budgetEnabled };
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
    'modelRouting.taskClassRouting',
    'planFirst',
    'contextBudget',
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
