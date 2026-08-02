#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { loadPolicy, validatePolicy } from './policy-loader.js';
import { artifactPaths, ROOT, safeReadJson } from './governance-utils.js';
import { loadSchema, validateAgainstSchema } from './schema-validator.js';
const strict = process.argv.includes('--strict');
const jsonOut = process.argv.includes('--json');

function readText(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

function parsePersonaCount(text) {
  const patterns = [/AI Assistants[^\n]*?(\d+) personas/i, /(\d+) documented personas/i, /(\d+)-persona/i];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}

export function runGovernanceAudit() {
  const errors = [];
  const warnings = [];
  const info = [];
  const policy = loadPolicy();
  const schemaDir = join(ROOT, policy.artifactSchemasDir || 'scripts/orchestrator/schemas');
  const schemaFiles = [
    'dispatch-packet.schema.json',
    'model-routing-decision.schema.json',
    'session-context-manifest.schema.json',
    'conversation-summary-handoff.schema.json',
    'prompt-history-entry.schema.json',
    'business-doc-readiness-packet.schema.json',
  ];

  for (const issue of validatePolicy(policy)) {
    errors.push(`policy: ${issue}`);
  }

  if (!existsSync(schemaDir)) {
    errors.push(`missing schema directory: ${schemaDir}`);
  } else {
    for (const file of schemaFiles) {
      if (!existsSync(join(schemaDir, file))) {
        errors.push(`missing schema file: ${file}`);
      }
    }
  }

  const prompts = safeReadJson(join(ROOT, 'scripts/orchestrator/prompts.json')) || {};
  const promptSchemaPath = join(schemaDir, 'prompt-history-entry.schema.json');
  if (existsSync(promptSchemaPath)) {
    const promptSchema = loadSchema(promptSchemaPath);
    for (const [key, value] of Object.entries(prompts)) {
      const result = validateAgainstSchema(promptSchema, value, `prompts.${key}`);
      errors.push(...result);
    }
  }

  const paths = artifactPaths();
  const dispatchSchemaPath = join(schemaDir, 'dispatch-packet.schema.json');
  const routingSchemaPath = join(schemaDir, 'model-routing-decision.schema.json');
  const manifestSchemaPath = join(schemaDir, 'session-context-manifest.schema.json');
  const handoffSchemaPath = join(schemaDir, 'conversation-summary-handoff.schema.json');
  const priorityOrder = safeReadJson(paths.priorityOrder);
  if (priorityOrder?.dispatchPacket && existsSync(dispatchSchemaPath)) {
    errors.push(...validateAgainstSchema(loadSchema(dispatchSchemaPath), priorityOrder.dispatchPacket, 'dispatchPacket'));
  }

  const routingDecision = safeReadJson(paths.routingDecision);
  if (routingDecision && existsSync(routingSchemaPath)) {
    errors.push(...validateAgainstSchema(loadSchema(routingSchemaPath), routingDecision, 'routingDecision'));
  } else if (strict) {
    warnings.push('routingDecision artifact not generated yet');
  }

  const manifest = safeReadJson(paths.contextManifest);
  if (manifest && existsSync(manifestSchemaPath)) {
    errors.push(...validateAgainstSchema(loadSchema(manifestSchemaPath), manifest, 'contextManifest'));
  } else if (strict) {
    warnings.push('session context manifest not generated yet');
  }

  const handoff = safeReadJson(paths.handoffSummary);
  if (handoff && existsSync(handoffSchemaPath)) {
    errors.push(...validateAgainstSchema(loadSchema(handoffSchemaPath), handoff, 'handoffSummary'));
  } else if (strict) {
    warnings.push('handoff summary not generated yet');
  }

  if (routingDecision?.modelTier === 'premium' && policy.planFirst?.enforceBeforePremiumExecution) {
    if (!manifest?.planPacket?.goal || !(manifest?.planPacket?.filesInScope || []).length) {
      errors.push('premium-routing compliance: plan-first evidence missing for premium task');
    }
  }

  const highestWaveFiles = readdirSync(join(ROOT, 'plans/waves'))
    .map((name) => {
      const match = name.match(/^WAVE_(\d+)_/);
      return match ? Number(match[1]) : null;
    })
    .filter((value) => Number.isFinite(value));
  const highestWave = highestWaveFiles.length ? Math.max(...highestWaveFiles) : null;
  if (highestWave) {
    const master = readText(join(ROOT, 'plans/MASTER_PLAN.md'));
    const pending = readText(join(ROOT, 'plans/PENDING_TASKS_ONLY.md'));
    const waveIndex = readText(join(ROOT, 'plans/waves/README.md'));
    for (const [label, text] of [['MASTER_PLAN.md', master], ['PENDING_TASKS_ONLY.md', pending], ['plans/waves/README.md', waveIndex]]) {
      if (!text.includes(`Wave ${highestWave}`) && !text.includes(`WAVE_${highestWave}_`)) {
        errors.push(`${label} does not reference highest wave bundle (Wave ${highestWave})`);
      }
    }
  }

  const businessDocs = readText(join(ROOT, 'business_docs/README.md'));
  const assistantDocs = readText(join(ROOT, 'business_docs/03_ai_assistants/README.md'));
  const businessCount = parsePersonaCount(businessDocs);
  const assistantCount = parsePersonaCount(assistantDocs);
  if (businessCount && assistantCount && businessCount !== assistantCount) {
    errors.push(`AI persona count drift: business_docs/README=${businessCount}, assistants README=${assistantCount}`);
  }

  const coverageMatrixPath = join(ROOT, 'plans/FEATURE_COVERAGE_MATRIX.md');
  if (!existsSync(coverageMatrixPath)) {
    errors.push('missing plans/FEATURE_COVERAGE_MATRIX.md');
  } else {
    const coverageMatrix = readText(coverageMatrixPath);
    const requiredColumns = ['Feature', 'Business Rule Doc', 'Workflow Doc', 'Wave Backlog', 'Code Module', 'Test Surface'];
    for (const column of requiredColumns) {
      if (!coverageMatrix.includes(column)) {
        errors.push(`plans/FEATURE_COVERAGE_MATRIX.md missing column: ${column}`);
      }
    }
  }

  if (manifest?.newChatRecommendation?.needed) {
    info.push(`new-chat recommended: ${manifest.newChatRecommendation.reasons.join(', ')}`);
  }

  return { errors, warnings, info };
}

const result = runGovernanceAudit();
if (jsonOut) {
  console.log(JSON.stringify(result, null, 2));
} else {
  if (result.info.length) {
    console.log('ℹ️  Governance audit info:');
    for (const item of result.info) console.log(` - ${item}`);
  }
  if (result.warnings.length) {
    console.warn('⚠️  Governance audit warnings:');
    for (const item of result.warnings) console.warn(` - ${item}`);
  }
  if (result.errors.length) {
    console.error('❌ Governance audit failed:');
    for (const item of result.errors) console.error(` - ${item}`);
  } else {
    console.log('✅ Governance audit passed.');
  }
}
if (result.errors.length || (strict && result.warnings.length)) {
  process.exit(1);
}
