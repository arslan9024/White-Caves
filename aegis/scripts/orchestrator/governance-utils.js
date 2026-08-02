#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const ROOT = process.cwd();
export const LOGS_DIR = join(ROOT, 'aegis', 'logs');

export function safeReadJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

export function safeReadText(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

export function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function normalizeFiles(files = []) {
  return [...new Set((files || []).filter(Boolean).map((item) => String(item).trim()).filter(Boolean))];
}

function inferTaskClassFromText(text) {
  const value = text.toLowerCase();
  if (/architecture|arbitrat|conflict/.test(value)) return 'architecture-arbitration';
  if (/security|csrf|xss|jwt|auth hardening|vulnerability/.test(value)) return 'security-sensitive';
  if (/debug|failure|regression|fix|triage|investigat/.test(value)) return 'ambiguous-debugging';
  if (/summary|synthes|closeout|final/.test(value)) return 'final-synthesis';
  if (/research|benchmark|survey/.test(value)) return 'research';
  if (/audit|gap|queue|coverage matrix/.test(value)) return 'triage';
  if (/plan|readiness|roadmap|backlog|governance|sdd|packet/.test(value)) return 'planning';
  if (/draft|expand|document|readme|md\b/.test(value)) return 'documentation';
  if (/implement|build|ship|route|controller|service|component|migration/.test(value)) return 'high-risk-implementation';
  return 'exploration';
}

export function inferTaskClass(input = {}) {
  const text = [input.objective, input.fullPrompt, ...(input.filesInScope || [])].filter(Boolean).join(' ');
  return inferTaskClassFromText(text);
}

export function inferRiskLevel(taskClass, files = []) {
  if (['security-sensitive', 'architecture-arbitration', 'high-risk-implementation', 'ambiguous-debugging'].includes(taskClass)) {
    return 'high';
  }
  if (['planning', 'triage', 'final-synthesis'].includes(taskClass) || files.some((file) => String(file).includes('policy.json'))) {
    return 'medium';
  }
  return 'low';
}

export function inferContextSize(files = [], objective = '') {
  if (files.length > 12 || objective.length > 500) return 'large';
  if (files.length > 5 || objective.length > 160) return 'medium';
  return 'small';
}

export function buildRoutingDecision(policy, input = {}) {
  const filesInScope = normalizeFiles(input.filesInScope || input.inputArtifacts || []);
  const taskClass = input.taskClass || inferTaskClass({ ...input, filesInScope });
  const riskLevel = input.riskLevel || inferRiskLevel(taskClass, filesInScope);
  const contextSize = input.contextSize || inferContextSize(filesInScope, input.objective || input.fullPrompt || '');
  const taskClassRouting = policy.modelRouting?.taskClassRouting?.[taskClass] || policy.modelRouting?.taskClassRouting?.exploration || {};
  const recommendedModel = taskClassRouting.modelRecommendation || policy.modelRouting?.freeModels?.[0] || 'Gemini 2.0 Flash';
  const fallbackModel = taskClassRouting.fallbackModel || policy.modelRouting?.freeModels?.[0] || recommendedModel;
  const modelTier = taskClassRouting.modelTier
    ?? ((policy.modelRouting?.premiumModels || []).includes(recommendedModel) ? 'premium' : 'free');
  const premiumUsage = policy.modelRouting?.premiumUsage || {};

  return {
    taskClass,
    riskLevel,
    contextSize,
    recommendedModel,
    fallbackModel,
    modelTier,
    premiumAllowed: modelTier === 'premium',
    premiumTurns: taskClassRouting.maxPremiumTurnsPerTask ?? premiumUsage.maxPremiumTurnsPerTask ?? 0,
    sessionCapMode: premiumUsage.defaultCapMode ?? 'soft-warning',
    requiresPlanPacket: Boolean(policy.planFirst?.enabled),
    reasonCodes: [
      `task-class:${taskClass}`,
      `risk:${riskLevel}`,
      `context:${contextSize}`,
      `tier:${modelTier}`,
    ],
  };
}

export function buildPlanPacket({ policy, dispatchPacket, routingDecision }) {
  const filesInScope = normalizeFiles(dispatchPacket?.inputArtifacts || []);
  return {
    goal: dispatchPacket?.objective || 'No objective available',
    filesInScope,
    validationPath: normalizeFiles([
      dispatchPacket?.validationCommand,
      'npm run plans:validate',
      routingDecision?.modelTier === 'premium' ? 'npm run aegis:policy:gate' : '',
    ]),
    recommendedModelTier: routingDecision?.modelTier || 'free',
    contextSizeExpectation: routingDecision?.contextSize || 'small',
    taskClass: routingDecision?.taskClass || 'exploration',
    riskLevel: routingDecision?.riskLevel || 'low',
    requireReadinessGate: routingDecision?.modelTier === 'premium',
    approvalPhrase: policy.approvalPhrase,
  };
}

export function buildContextManifest({ policy, sessionId, dispatchPacket, previousSnapshot, routingDecision, planPacket }) {
  const filesInScope = normalizeFiles(dispatchPacket?.inputArtifacts || []);
  const instructionFiles = normalizeFiles([
    '.github/copilot-instructions.md',
    'AGENTS.md',
    '.github/instructions/agentic-workflow.instructions.md',
  ]);
  const canonicalSources = normalizeFiles([
    'docs/plans/MASTER_PLAN.md',
    'docs/plans/PENDING_TASKS_ONLY.md',
    'docs/plans/waves/README.md',
    'aegis/orchestrator/policy.json',
  ]);
  const waveBundles = filesInScope.filter((file) => /docs\/plans\/waves\/WAVE_/i.test(file));
  const businessDocSections = filesInScope.filter((file) => /docs\/business_docs\//i.test(file));
  const budget = policy.contextBudget || {};
  const reasons = [];
  if (filesInScope.length > (budget.defaultMaxFiles ?? 12)) reasons.push('file-scope-widened');
  if (waveBundles.length > (budget.defaultMaxWaveBundles ?? 1)) reasons.push('multiple-wave-bundles');
  if ((previousSnapshot?.loopIteration || 0) >= (budget.warnAfterTurns ?? 16)) reasons.push('turn-threshold-exceeded');
  if ((previousSnapshot?.currentTask?.id || '') && dispatchPacket?.taskId && previousSnapshot.currentTask.id !== dispatchPacket.taskId) {
    reasons.push('objective-changed');
  }

  return {
    schemaVersion: '1.0.0',
    sessionId,
    objective: dispatchPacket?.objective || 'No objective available',
    canonicalSources,
    filesInScope,
    instructionFiles,
    waveBundles,
    businessDocSections,
    contextBudget: {
      maxFiles: budget.defaultMaxFiles ?? 12,
      maxInstructionFiles: budget.defaultMaxInstructionFiles ?? 4,
      maxWaveBundles: budget.defaultMaxWaveBundles ?? 1,
      maxBusinessDocSections: budget.defaultMaxBusinessDocSections ?? 6,
      warnAfterTurns: budget.warnAfterTurns ?? 16,
      hardStopAfterTurns: budget.hardStopAfterTurns ?? 28,
      warnAfterApproxTokens: budget.warnAfterApproxTokens ?? 120000,
      hardStopAfterApproxTokens: budget.hardStopAfterApproxTokens ?? 220000,
    },
    planPacket,
    historyLayers: {
      rawLogs: 'logs/orchestrator',
      sessionSnapshot: 'logs/orchestrator/session-snapshot.json',
      handoffSummary: 'logs/orchestrator/handoff-summary.json',
    },
    routingDecision,
    newChatRecommendation: {
      needed: reasons.length > 0,
      reasons,
    },
  };
}

export function createHandoffSummary({ policy, sessionId, dispatchPacket, routingDecision, manifest, hardStops = [] }) {
  const blockers = hardStops.map((stop) => stop.message || String(stop));
  const carryForward = normalizeFiles([
    ...(manifest?.filesInScope || []),
    ...(manifest?.canonicalSources || []),
  ]).slice(0, 12);
  return {
    schemaVersion: '1.0.0',
    sessionId,
    objective: dispatchPacket?.objective || 'No objective available',
    status: blockers.length > 0 ? 'blocked' : 'ready',
    summary: [
      `Use ${routingDecision?.modelTier || 'free'} routing for ${routingDecision?.taskClass || 'exploration'} work.`,
      `Plan-first packet prepared with ${manifest?.planPacket?.filesInScope?.length || 0} scoped file(s).`,
      manifest?.newChatRecommendation?.needed
        ? `Start a new chat if compact handoff degrades: ${manifest.newChatRecommendation.reasons.join(', ')}.`
        : 'Current session remains within compact context budget.',
    ],
    blockers,
    carryForward,
    bootstrapFiles: normalizeFiles([
      'docs/plans/MASTER_PLAN.md',
      'docs/plans/PENDING_TASKS_ONLY.md',
      'docs/plans/waves/README.md',
      'aegis/orchestrator/policy.json',
      ...(manifest?.filesInScope || []).slice(0, 6),
    ]),
    historyPolicy: {
      reuseLayer: policy.historyManagement?.reuseLayer ?? 'handoff-summary',
      staleHistoryIsCanonical: false,
    },
    stale: false,
  };
}

export function artifactPaths() {
  return {
    priorityOrder: join(LOGS_DIR, 'priority-order.json'),
    sessionSnapshot: join(LOGS_DIR, 'session-snapshot.json'),
    routingDecision: join(LOGS_DIR, 'model-routing-decision.json'),
    contextManifest: join(LOGS_DIR, 'session-context-manifest.json'),
    handoffSummary: join(LOGS_DIR, 'handoff-summary.json'),
    bootstrapPacket: join(LOGS_DIR, 'bootstrap-packet.json'),
  };
}

export function bootstrapPacketFromSummary(summary, manifest) {
  return {
    objective: summary.objective,
    summary: summary.summary,
    blockers: summary.blockers,
    carryForward: summary.carryForward,
    minimalContextFiles: summary.bootstrapFiles,
    newChatRecommendation: manifest?.newChatRecommendation || { needed: false, reasons: [] },
  };
}

export function refreshGovernanceArtifacts({ policy, sessionId, dispatchPacket, previousSnapshot, hardStops = [] }) {
  const routingDecision = buildRoutingDecision(policy, {
    taskId: dispatchPacket?.taskId,
    objective: dispatchPacket?.objective,
    fullPrompt: dispatchPacket?.fullPrompt,
    inputArtifacts: dispatchPacket?.inputArtifacts,
  });
  const planPacket = buildPlanPacket({ policy, dispatchPacket, routingDecision });
  const manifest = buildContextManifest({
    policy,
    sessionId,
    dispatchPacket,
    previousSnapshot,
    routingDecision,
    planPacket,
  });
  const handoffSummary = createHandoffSummary({ policy, sessionId, dispatchPacket, routingDecision, manifest, hardStops });
  const bootstrapPacket = bootstrapPacketFromSummary(handoffSummary, manifest);
  return { routingDecision, planPacket, manifest, handoffSummary, bootstrapPacket };
}

export function ensureLogsDir() {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true });
  }
}
