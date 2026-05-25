#!/usr/bin/env node
/**
 * reprioritize.js — White Caves Task Queue Reprioritiser
 *
 * Reads:
 *   - logs/orchestrator/codebase-scan-report.json   (from codebase-scan.js)
 *   - logs/orchestrator/task-queue.json              (existing orchestrator queue)
 *
 * Produces:
 *   - logs/orchestrator/priority-order.json          (ordered task IDs + dispatch packets)
 *
 * Scoring factors (applied to each queued task):
 *   1. Task's own baseScore from task-queue.json
 *   2. Codebase signal boost — tasks whose domain matches a P0/P1 codebase finding
 *   3. Wave unlock boost — tasks in a 🟢 Ready wave get +50
 *   4. Documentation gap boost — tasks whose target doc is listed as incomplete
 *   5. Dependency penalty — tasks with unmet CONSUMES dependencies get -30
 *
 * Usage:
 *   node scripts/orchestrator/reprioritize.js
 *   node scripts/orchestrator/reprioritize.js --dry    (print only, no file write)
 *   node scripts/orchestrator/reprioritize.js --top 5  (show only top N)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Config ────────────────────────────────────────────────────────────────
const ROOT          = path.resolve(__dirname, '..', '..');
const LOGS_DIR      = path.join(ROOT, 'logs', 'orchestrator');
const SCAN_REPORT   = path.join(LOGS_DIR, 'codebase-scan-report.json');
const QUEUE_FILE    = path.join(LOGS_DIR, 'task-queue.json');
const PROMPTS_FILE  = path.join(__dirname, 'prompts.json');
const OUT_FILE      = path.join(LOGS_DIR, 'priority-order.json');

// Prefer the policy-defined Aegis 150 registry; fall back to the V3 legacy registry.
const REGISTRY_FILE = (() => {
  try {
    const pol = JSON.parse(fs.readFileSync(path.join(__dirname, 'policy.json'), 'utf8'));
    if (pol && pol.registryPath) {
      const candidate = path.join(ROOT, pol.registryPath);
      if (fs.existsSync(candidate)) return candidate;
    }
  } catch { /* fall through */ }
  return path.join(__dirname, 'subagents-registry.json');
})();

const DRY_RUN  = process.argv.includes('--dry');
const TOP_N    = (() => { const i = process.argv.indexOf('--top'); return i !== -1 ? parseInt(process.argv[i + 1], 10) || 10 : null; })();

// ─── Boost / Penalty Constants ─────────────────────────────────────────────
const BOOST = {
  WAVE_READY:        50,
  CODEBASE_P0:       40,
  CODEBASE_P1:       25,
  DOC_INCOMPLETE:    15,
  SECURITY_DOMAIN:   35,
  HAS_CONSUMES_MET:  10,
};
const PENALTY = {
  DEPENDENCY_UNMET: -30,
  BLOCKED:          -100,
};

// Domain keywords → codebase scan categories
const DOMAIN_MAP = {
  security:    ['security', 'auth', 'csrf', 'cors', 'jwt', 'rbac', 'injection'],
  typescript:  ['typescript', 'typecheck', 'tsc', 'strict', 'type'],
  build:       ['build', 'vite', 'webpack', 'bundle'],
  testing:     ['test', 'vitest', 'playwright', 'spec', 'e2e'],
  leasing:     ['tenancy', 'ejari', 'lease', 'landlord', 'pdc', 'rent'],
  finance:     ['financial', 'vat', 'invoice', 'payment', 'revenue', 'commission'],
  compliance:  ['compliance', 'rera', 'dld', 'pdpl', 'aml', 'oqood'],
  analytics:   ['analytics', 'dashboard', 'kpi', 'report', 'performance'],
  ai:          ['ai', 'persona', 'chatbot', 'llm', 'recommendation', 'scoring'],
  api:         ['route', 'endpoint', 'api', 'controller', 'service', 'handler'],
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function readJSON(fp) {
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return null; }
}

function taskTextFor(task, prompts) {
  return [
    task.id || '',
    task.agent || '',
    task.objective || task.description || '',
    (task.files || []).join(' '),
    (task.tags || []).join(' '),
    prompts && prompts[task.id] ? prompts[task.id] : '',
  ].join(' ').toLowerCase();
}

function matchDomain(text, domains) {
  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(kw => text.includes(kw))) return domain;
  }
  return null;
}

function scoreTask(task, prompts, scanReport, completedTaskIds) {
  let score = task.baseScore || task.priority_score || 50;
  const text = taskTextFor(task, prompts);

  // ── Wave unlock boost ──────────────────────────────────────────────────
  if (scanReport && scanReport.openWaves) {
    for (const wave of scanReport.openWaves) {
      if (wave.status && wave.status.includes('🟢')) {
        const waveNum = String(wave.wave);
        if (text.includes(`wave ${waveNum}`) || text.includes(`wave-${waveNum}`) || text.includes(`wave_0${waveNum}`)) {
          score += BOOST.WAVE_READY;
        }
      }
    }
  }

  // ── Codebase signal boost ──────────────────────────────────────────────
  if (scanReport && scanReport.priorityList) {
    const domain = matchDomain(text, DOMAIN_MAP);
    for (const item of scanReport.priorityList) {
      if (domain && item.category && item.category.includes(domain)) {
        if (item.priority === 'P0') score += BOOST.CODEBASE_P0;
        else if (item.priority === 'P1') score += BOOST.CODEBASE_P1;
      }
    }
    // Security domain always gets extra boost
    if (domain === 'security') score += BOOST.SECURITY_DOMAIN;
  }

  // ── Doc completeness boost ─────────────────────────────────────────────
  if (scanReport && scanReport.incompleteDocs) {
    for (const doc of scanReport.incompleteDocs) {
      if (text.includes(path.basename(doc.file, '.md').toLowerCase())) {
        score += BOOST.DOC_INCOMPLETE;
        break;
      }
    }
  }

  // ── Dependency (CONSUMES) check ────────────────────────────────────────
  if (task.consumesFrom && Array.isArray(task.consumesFrom)) {
    const unmet = task.consumesFrom.filter(dep => !completedTaskIds.has(dep));
    if (unmet.length > 0) {
      score += PENALTY.DEPENDENCY_UNMET * unmet.length;
    } else {
      score += BOOST.HAS_CONSUMES_MET;
    }
  }

  // ── Blocked penalty ────────────────────────────────────────────────────
  if (task.status === 'blocked') score += PENALTY.BLOCKED;

  return Math.max(0, score);
}

// ─── Agent lookup from registry ───────────────────────────────────────────
function lookupAgent(agentName, registry) {
  if (!registry || !registry.agents) return null;
  const name = agentName ? agentName.toLowerCase() : '';
  return registry.agents.find(a => a.name && a.name.toLowerCase() === name) || null;
}

// ─── Build dispatch packet for top task ───────────────────────────────────
function buildDispatchPacket(task, prompts, registry) {
  const agentInfo  = lookupAgent(task.agent, registry);
  const promptText = prompts && task.id ? (prompts[task.id] || '') : '';

  return {
    taskId:            task.id,
    agent:             task.agent || 'unassigned',
    agentTitle:        agentInfo ? agentInfo.title : 'Unknown',
    agentUnit:         agentInfo ? agentInfo.unit  : 'Unknown',
    agentModel:        agentInfo ? agentInfo.model : 'Unknown',
    agentToolUrl:      agentInfo ? agentInfo.toolUrl : null,
    objective:         task.objective || task.description || promptText.slice(0, 200),
    fullPrompt:        promptText || task.objective || '',
    inputArtifacts:    task.consumesFrom || [],
    outputArtifact:    task.producedRef  || task.outputFile || '',
    acceptanceCriteria: task.acceptanceCriteria || [
      'Output file created or updated with at least 3 new sections',
      'CONSUMES + FEEDS tags present in output',
      'FEEDS_ACK received from downstream agent',
    ],
    validationCommand: task.validationCommand || 'node scripts/orchestrator/codebase-scan.js --brief',
    invocationPattern: agentInfo ? agentInfo.invocationPattern : `@${task.agent} — ${task.objective}`,
    responsibilities:  agentInfo ? (agentInfo.responsibilities || []).slice(0, 5) : [],
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  const sep = '─'.repeat(70);
  console.log(`\n${sep}`);
  console.log('  WHITE CAVES — TASK REPRIORITISER');
  console.log(`  ${new Date().toISOString()}`);
  console.log(sep);

  // Load inputs
  const scanReport = readJSON(SCAN_REPORT);
  const queue      = readJSON(QUEUE_FILE);
  const prompts    = readJSON(PROMPTS_FILE);
  const registry   = readJSON(REGISTRY_FILE);

  if (!scanReport) {
    console.warn('\n  ⚠  No codebase scan report found. Run: npm run autopilot:scan first.');
    console.warn('     Falling back to baseline task ordering.\n');
  }
  if (!queue || !queue.tasks || queue.tasks.length === 0) {
    console.warn('\n  ⚠  No task queue found or queue is empty.');
    console.warn('     Run: npm run orchestrator:queue:init to initialise.\n');
    process.exit(0);
  }

  const tasks = queue.tasks;
  console.log(`\n  Tasks in queue: ${tasks.length}`);

  // Build set of already-completed task IDs for dependency checks
  const completedIds = new Set(tasks.filter(t => t.status === 'done' || t.status === 'complete').map(t => t.id));

  // Compute scores
  const eligible = tasks.filter(t => t.status !== 'done' && t.status !== 'complete' && t.status !== 'archived');
  const scored   = eligible.map(task => ({
    ...task,
    computedScore: scoreTask(task, prompts, scanReport, completedIds),
  }));

  // Sort descending by score
  scored.sort((a, b) => b.computedScore - a.computedScore);

  const displayList = TOP_N ? scored.slice(0, TOP_N) : scored;

  // Print results
  console.log('\n  REPRIORITISED TASK ORDER:\n');
  displayList.forEach((task, i) => {
    const status = task.status || 'queued';
    const emoji  = status === 'running' ? '▶' : status === 'blocked' ? '🚫' : '◆';
    console.log(`  ${String(i + 1).padStart(3)}. ${emoji} [Score: ${task.computedScore}] ${task.id} — ${task.agent || 'unassigned'}`);
    console.log(`       ${(task.objective || task.description || '').slice(0, 100)}`);
  });

  // Build priority-order.json
  const topTask       = scored[0] || null;
  const dispatchPacket = topTask ? buildDispatchPacket(topTask, prompts, registry) : null;

  const output = {
    generatedAt:     new Date().toISOString(),
    scanReportDate:  scanReport ? scanReport.scanDate : null,
    totalEligible:   eligible.length,
    totalCompleted:  completedIds.size,
    orderedTasks:    scored.map(t => ({
      id:            t.id,
      agent:         t.agent,
      status:        t.status || 'queued',
      computedScore: t.computedScore,
      objective:     (t.objective || t.description || '').slice(0, 120),
    })),
    nextTask:        topTask ? {
      id:            topTask.id,
      agent:         topTask.agent,
      computedScore: topTask.computedScore,
      status:        topTask.status,
    } : null,
    dispatchPacket,
    codeScanSummary: scanReport ? scanReport.summary : null,
  };

  if (!DRY_RUN) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n  ✓ Priority order saved → ${OUT_FILE}`);
  } else {
    console.log('\n  [DRY RUN] No file written.');
  }

  if (dispatchPacket) {
    console.log(`\n${sep}`);
    console.log('  NEXT DISPATCH PACKET');
    console.log(sep);
    console.log(`  Task ID     : ${dispatchPacket.taskId}`);
    console.log(`  Agent       : ${dispatchPacket.agent} (${dispatchPacket.agentTitle})`);
    console.log(`  Unit        : ${dispatchPacket.agentUnit}`);
    console.log(`  Model       : ${dispatchPacket.agentModel}`);
    console.log(`  Tool URL    : ${dispatchPacket.agentToolUrl || 'N/A (premium)'}`);
    console.log(`  Objective   : ${dispatchPacket.objective.slice(0, 120)}`);
    console.log(`  Validation  : ${dispatchPacket.validationCommand}`);
    console.log(`\n  Invocation:`);
    console.log(`    ${dispatchPacket.invocationPattern}`);
    console.log(sep + '\n');
  }
}

main();
