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

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..', '..');
const LOGS_DIR = path.join(ROOT, 'logs', 'orchestrator');
const SCAN_REPORT = path.join(LOGS_DIR, 'codebase-scan-report.json');
const QUEUE_FILE = path.join(LOGS_DIR, 'task-queue.json');
const PROMPTS_FILE = path.join(__dirname, 'prompts.json');
const OUT_FILE = path.join(LOGS_DIR, 'priority-order.json');
const PRIORITY_PINS_FILE = path.join(__dirname, 'priority-pins.json');

// Prefer the policy-defined Aegis 150 registry; fall back to the V3 legacy registry.
const REGISTRY_FILE = (() => {
  try {
    const pol = JSON.parse(fs.readFileSync(path.join(__dirname, 'policy.json'), 'utf8'));
    if (pol && pol.registryPath) {
      const candidate = path.join(ROOT, pol.registryPath);
      if (fs.existsSync(candidate)) return candidate;
    }
  } catch {
    /* fall through */
  }
  return path.join(__dirname, 'subagents-registry.json');
})();

const DRY_RUN = process.argv.includes('--dry');
const TOP_N = (() => {
  const i = process.argv.indexOf('--top');
  return i !== -1 ? parseInt(process.argv[i + 1], 10) || 10 : null;
})();
const EXCLUDE_TASK_ID = (() => {
  const i = process.argv.indexOf('--exclude-task-id');
  return i !== -1 ? String(process.argv[i + 1] || '').trim() : '';
})();
const PREFERRED_TASK_ID = (() => {
  const i = process.argv.indexOf('--preferred-task-id');
  return i !== -1 ? String(process.argv[i + 1] || '').trim() : '';
})();

// ─── Boost / Penalty Constants ─────────────────────────────────────────────
const BOOST = {
  WAVE_READY: 50,
  CODEBASE_P0: 40,
  CODEBASE_P1: 25,
  DOC_INCOMPLETE: 15,
  SECURITY_DOMAIN: 35,
  HAS_CONSUMES_MET: 10,
  PREFERRED_TASK: 1000,
};
const PENALTY = {
  DEPENDENCY_UNMET: -30,
  BLOCKED: -100,
};

const DEFAULT_CRITICAL_PINS = [
  {
    id: 'CRIT-HOMEPAGE',
    title: 'Homepage experience and quality',
    enabled: true,
    boost: 900,
    keywords: [
      'homepage',
      'landing page',
      'hero section',
      'public homepage',
      'home page',
      'main website',
    ],
  },
  {
    id: 'CRIT-MD-LOGIN-UX',
    title: 'MD login success + full company UI/UX',
    enabled: true,
    boost: 950,
    keywords: [
      'md login',
      'md dashboard',
      'admin login',
      'manager login',
      'executive login',
      'dashboard login',
      'successful login',
      'auth flow',
      'full ui/ux',
      'full ui',
      'company dashboard',
      'executive dashboard',
      'best design',
      'ux polish',
      'design system',
    ],
  },
];

// Domain keywords → codebase scan categories
const DOMAIN_MAP = {
  security: ['security', 'auth', 'csrf', 'cors', 'jwt', 'rbac', 'injection'],
  typescript: ['typescript', 'typecheck', 'tsc', 'strict', 'type'],
  build: ['build', 'vite', 'webpack', 'bundle'],
  testing: ['test', 'vitest', 'playwright', 'spec', 'e2e'],
  leasing: ['tenancy', 'ejari', 'lease', 'landlord', 'pdc', 'rent'],
  finance: ['financial', 'vat', 'invoice', 'payment', 'revenue', 'commission'],
  compliance: ['compliance', 'rera', 'dld', 'pdpl', 'aml', 'oqood'],
  analytics: ['analytics', 'dashboard', 'kpi', 'report', 'performance'],
  ai: ['ai', 'persona', 'chatbot', 'llm', 'recommendation', 'scoring'],
  api: ['route', 'endpoint', 'api', 'controller', 'service', 'handler'],
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function readJSON(fp) {
  try {
    const raw = fs.readFileSync(fp, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadCriticalPins() {
  const fromFile = readJSON(PRIORITY_PINS_FILE);
  if (fromFile && Array.isArray(fromFile.pins)) {
    return fromFile.pins
      .filter(pin => pin && pin.enabled !== false)
      .map(pin => ({
        id: String(pin.id || '').trim() || 'PIN',
        title: String(pin.title || '').trim() || 'Critical pin',
        boost: Number(pin.boost || 0) > 0 ? Number(pin.boost) : 500,
        keywords: Array.isArray(pin.keywords)
          ? pin.keywords
              .map(kw =>
                String(kw || '')
                  .toLowerCase()
                  .trim()
              )
              .filter(Boolean)
          : [],
      }))
      .filter(pin => pin.keywords.length > 0);
  }

  return DEFAULT_CRITICAL_PINS.map(pin => ({
    ...pin,
    keywords: pin.keywords.map(kw => String(kw).toLowerCase()),
  }));
}

function applyCriticalPinBoost(text, pins) {
  const hits = [];
  let boost = 0;

  for (const pin of pins) {
    if (!pin || !Array.isArray(pin.keywords) || pin.keywords.length === 0) {
      continue;
    }

    if (pin.keywords.some(kw => text.includes(kw))) {
      boost += Number(pin.boost || 0);
      hits.push({ id: pin.id, title: pin.title, boost: pin.boost });
    }
  }

  return { boost, hits };
}

function runNode(scriptPath, args = []) {
  const result = spawnSync('node', [scriptPath, ...args], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });

  return {
    ok: result.status === 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function ensureQueueHasTasks(queue) {
  const hasEligibleTasks =
    queue &&
    Array.isArray(queue.tasks) &&
    queue.tasks.some(t => !['done', 'complete', 'archived'].includes(t.status));

  if (hasEligibleTasks) {
    return queue;
  }

  console.warn('\n  ⚠  No task queue found, queue is empty, or all tasks are already completed.');
  console.warn('     Attempting automatic upgrade discovery before exiting.\n');

  const discoveryResult = runNode(path.join(__dirname, 'discover-upgrade.js'), [
    '--min-inject',
    '10',
    '--max-inject',
    '12',
    '--require-min-inject',
  ]);
  if (!discoveryResult.ok) {
    console.warn('  ⚠  Automatic upgrade discovery failed.');
    if (discoveryResult.stderr.trim()) {
      console.warn(`     ${discoveryResult.stderr.trim().split('\n')[0]}`);
    }
    return queue;
  }

  const refreshedQueue = readJSON(QUEUE_FILE);
  const refreshedHasEligibleTasks =
    refreshedQueue &&
    Array.isArray(refreshedQueue.tasks) &&
    refreshedQueue.tasks.some(t => !['done', 'complete', 'archived'].includes(t.status));

  if (refreshedHasEligibleTasks) {
    console.log('  ✓ Automatic upgrade discovery seeded new queue tasks.\n');
    return refreshedQueue;
  }

  return refreshedQueue;
}

function taskTextFor(task, prompts) {
  const promptEntry = prompts && task.id ? prompts[task.id] : null;
  const promptText =
    typeof promptEntry === 'string'
      ? promptEntry
      : promptEntry && typeof promptEntry === 'object' && typeof promptEntry.prompt === 'string'
        ? promptEntry.prompt
        : '';

  return [
    task.id || '',
    task.agent || '',
    task.objective || task.description || '',
    (task.files || []).join(' '),
    (task.tags || []).join(' '),
    promptText,
  ]
    .join(' ')
    .toLowerCase();
}

function matchDomain(text, domains) {
  for (const [domain, keywords] of Object.entries(domains)) {
    if (keywords.some(kw => text.includes(kw))) return domain;
  }
  return null;
}

function scoreTask(task, prompts, scanReport, completedTaskIds, criticalPins) {
  let score = task.baseScore || task.priority_score || 50;
  const text = taskTextFor(task, prompts);
  const pinBoost = applyCriticalPinBoost(text, criticalPins);
  score += pinBoost.boost;

  if (PREFERRED_TASK_ID && String(task.id || task.taskId || '') === PREFERRED_TASK_ID) {
    score += BOOST.PREFERRED_TASK;
  }

  // ── Wave unlock boost ──────────────────────────────────────────────────
  if (scanReport && scanReport.openWaves) {
    for (const wave of scanReport.openWaves) {
      if (wave.status && wave.status.includes('🟢')) {
        const waveNum = String(wave.wave);
        if (
          text.includes(`wave ${waveNum}`) ||
          text.includes(`wave-${waveNum}`) ||
          text.includes(`wave_0${waveNum}`)
        ) {
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

  return {
    score: Math.max(0, score),
    pinHits: pinBoost.hits,
  };
}

// ─── Agent lookup from registry ───────────────────────────────────────────
function lookupAgent(agentName, registry) {
  if (!registry || !registry.agents) return null;
  const name = agentName ? agentName.toLowerCase() : '';
  return registry.agents.find(a => a.name && a.name.toLowerCase() === name) || null;
}

// ─── Build dispatch packet for top task ───────────────────────────────────
function buildDispatchPacket(task, prompts, registry) {
  const agentInfo = lookupAgent(task.agent, registry);
  const promptEntry = prompts && task.id ? prompts[task.id] || '' : '';
  const promptText =
    typeof promptEntry === 'string'
      ? promptEntry
      : promptEntry && typeof promptEntry === 'object' && typeof promptEntry.prompt === 'string'
        ? promptEntry.prompt
        : '';

  return {
    taskId: task.id,
    agent: task.agent || 'unassigned',
    agentTitle: agentInfo ? agentInfo.title : 'Unknown',
    agentUnit: agentInfo ? agentInfo.unit : 'Unknown',
    agentModel: agentInfo ? agentInfo.model : 'Unknown',
    agentToolUrl: agentInfo ? agentInfo.toolUrl : null,
    objective: task.objective || task.description || promptText.slice(0, 200),
    fullPrompt: promptText || task.objective || '',
    inputArtifacts: task.consumesFrom || [],
    outputArtifact: task.producedRef || task.outputFile || '',
    acceptanceCriteria: task.acceptanceCriteria || [
      'Output file created or updated with at least 3 new sections',
      'CONSUMES + FEEDS tags present in output',
      'FEEDS_ACK received from downstream agent',
    ],
    validationCommand:
      task.validationCommand || 'node scripts/orchestrator/codebase-scan.js --brief',
    invocationPattern: agentInfo
      ? agentInfo.invocationPattern
      : `${task.agent} — ${task.objective}`,
    responsibilities: agentInfo ? (agentInfo.responsibilities || []).slice(0, 5) : [],
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
  let queue = readJSON(QUEUE_FILE);
  let prompts = readJSON(PROMPTS_FILE);
  const registry = readJSON(REGISTRY_FILE);
  const criticalPins = loadCriticalPins();

  if (!scanReport) {
    console.warn('\n  ⚠  No codebase scan report found. Run: npm run autopilot:scan first.');
    console.warn('     Falling back to baseline task ordering.\n');
  }
  queue = ensureQueueHasTasks(queue);
  prompts = readJSON(PROMPTS_FILE);
  if (!queue || !queue.tasks || queue.tasks.length === 0) {
    console.warn('\n  ⚠  No task queue found or queue is empty after discovery.');
    console.warn('     Run: npm run orchestrator:queue:init to initialise.\n');
    process.exit(0);
  }

  const tasks = queue.tasks;
  console.log(`\n  Tasks in queue: ${tasks.length}`);

  // Build set of already-completed task IDs for dependency checks
  const completedIds = new Set(
    tasks.filter(t => t.status === 'done' || t.status === 'complete').map(t => t.id)
  );

  // Compute scores
  let eligible = tasks.filter(
    t => t.status !== 'done' && t.status !== 'complete' && t.status !== 'archived'
  );
  if (EXCLUDE_TASK_ID) {
    const filtered = eligible.filter(t => String(t.id || '') !== EXCLUDE_TASK_ID);
    if (filtered.length > 0) {
      eligible = filtered;
      console.log(`\n  ↳ Excluding previous task for this turn: ${EXCLUDE_TASK_ID}`);
    } else {
      console.warn(
        `\n  ⚠  Exclusion id ${EXCLUDE_TASK_ID} removed every eligible task; continuing without exclusion.`
      );
    }
  }
  if (eligible.length === 0) {
    queue = ensureQueueHasTasks(queue);
    prompts = readJSON(PROMPTS_FILE);
    if (queue && queue.tasks) {
      const refreshedTasks = queue.tasks;
      eligible = refreshedTasks.filter(
        t => t.status !== 'done' && t.status !== 'complete' && t.status !== 'archived'
      );
      if (eligible.length > 0) {
        tasks.length = 0;
        tasks.push(...refreshedTasks);
      }
    }
  }
  const scored = eligible.map(task => {
    const scoredTask = scoreTask(task, prompts, scanReport, completedIds, criticalPins);
    return {
      ...task,
      computedScore: scoredTask.score,
      criticalPinHits: scoredTask.pinHits,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.computedScore - a.computedScore);

  if (PREFERRED_TASK_ID) {
    const preferredIndex = scored.findIndex(
      task => String(task.id || task.taskId || '') === PREFERRED_TASK_ID
    );
    if (preferredIndex > 0) {
      const [preferredTask] = scored.splice(preferredIndex, 1);
      scored.unshift(preferredTask);
      console.log(`\n  ↳ Preferred task promoted for this turn: ${PREFERRED_TASK_ID}`);
    }
  }

  const displayList = TOP_N ? scored.slice(0, TOP_N) : scored;

  // Print results
  console.log('\n  REPRIORITISED TASK ORDER:\n');
  displayList.forEach((task, i) => {
    const status = task.status || 'queued';
    const emoji = status === 'running' ? '▶' : status === 'blocked' ? '🚫' : '◆';
    console.log(
      `  ${String(i + 1).padStart(3)}. ${emoji} [Score: ${task.computedScore}] ${task.id} — ${task.agent || 'unassigned'}`
    );
    console.log(`       ${(task.objective || task.description || '').slice(0, 100)}`);
  });

  // Build priority-order.json
  const topTask = scored[0] || null;
  const dispatchPacket = topTask ? buildDispatchPacket(topTask, prompts, registry) : null;

  const output = {
    generatedAt: new Date().toISOString(),
    scanReportDate: scanReport ? scanReport.scanDate : null,
    totalEligible: eligible.length,
    totalCompleted: completedIds.size,
    criticalPins,
    orderedTasks: scored.map(t => ({
      id: t.id,
      agent: t.agent,
      status: t.status || 'queued',
      computedScore: t.computedScore,
      criticalPinHits: t.criticalPinHits || [],
      objective: (t.objective || t.description || '').slice(0, 120),
    })),
    nextTask: topTask
      ? {
          id: topTask.id,
          agent: topTask.agent,
          computedScore: topTask.computedScore,
          status: topTask.status,
          criticalPinHits: topTask.criticalPinHits || [],
        }
      : null,
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
