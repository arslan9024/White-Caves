#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const LOGS_DIR = path.join(ROOT, 'logs', 'orchestrator');
const QUEUE_FILE = path.join(LOGS_DIR, 'task-queue.json');
const PROMPTS_FILE = path.join(__dirname, 'prompts.json');
const SCAN_REPORT_FILE = path.join(LOGS_DIR, 'codebase-scan-report.json');
const REPORT_FILE = path.join(LOGS_DIR, 'discover-upgrade-report.json');
const DISCOVERY_GATE_FAIL_FILE = path.join(LOGS_DIR, 'DISCOVERY_GATE_FAIL.json');
const SKIP_DISCOVERY_FILE = path.join(LOGS_DIR, 'SKIP_DISCOVERY');
const QUEUE_ARCHIVE_DIR = path.join(LOGS_DIR, 'queue-archives');
const RECENT_WAVES_FILE = path.join(LOGS_DIR, 'recent-wave-features.json');
const MATRIX_FILE = path.join(__dirname, 'feature-gap-matrix.json');
const DISCOVERED_UPGRADES_FILE = path.join(ROOT, 'plans', 'waves', 'DISCOVERED_UPGRADES.md');
const PLAN_FILES = [
  path.join(ROOT, 'plans', 'PENDING_TASKS_ONLY.md'),
  path.join(ROOT, 'plans', 'IMPROVEMENTS_UX.md'),
  path.join(ROOT, 'plans', 'GITHUB_ISSUE_ROADMAP.md'),
];
const SCAN_DIRS = ['src', 'server', 'business_docs'];
const SCAN_MAX_AGE_MS = 6 * 60 * 60 * 1000;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry');
const JSON_OUT = args.includes('--json');
const REQUIRE_MIN_INJECT = args.includes('--require-min-inject');
const maxInjectIndex = args.indexOf('--max-inject');
const minInjectIndex = args.indexOf('--min-inject');
const MIN_INJECT =
  minInjectIndex !== -1
    ? Math.max(1, Number.parseInt(args[minInjectIndex + 1] || '10', 10) || 10)
    : 10;
const MAX_INJECT = (() => {
  const parsed =
    maxInjectIndex !== -1
      ? Math.max(1, Number.parseInt(args[maxInjectIndex + 1] || '12', 10) || 12)
      : 12;
  return Math.max(parsed, MIN_INJECT);
})();
const RECENT_WAVE_MEMORY = 2;

function readJSON(filePath, fallback = null) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function removeFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // non-fatal cleanup
  }
}

function readText(filePath, fallback = '') {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return fallback;
  }
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function relPath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function runNode(scriptPath, scriptArgs = []) {
  const result = spawnSync('node', [scriptPath, ...scriptArgs], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });

  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function walkDir(dirPath, collector) {
  if (!fs.existsSync(dirPath)) return;

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      entry.name !== 'node_modules' &&
      entry.name !== 'dist'
    ) {
      walkDir(fullPath, collector);
    } else if (entry.isFile()) {
      collector(fullPath);
    }
  }
}

function loadCodebaseIndex() {
  const records = [];
  const pathIndex = [];

  for (const dirName of SCAN_DIRS) {
    walkDir(path.join(ROOT, dirName), fullPath => {
      const relative = relPath(fullPath);
      const content = readText(fullPath, '').toLowerCase();
      records.push({
        path: relative,
        pathLower: relative.toLowerCase(),
        content,
      });
      pathIndex.push(relative.toLowerCase());
    });
  }

  return {
    files: records,
    pathCorpus: pathIndex.join('\n'),
  };
}

function loadPlanTexts() {
  const waveFiles = [];
  const wavesDir = path.join(ROOT, 'plans', 'waves');
  walkDir(wavesDir, fullPath => {
    if (/WAVE_.*\.md$/i.test(path.basename(fullPath))) {
      waveFiles.push(fullPath);
    }
  });

  const allPlanFiles = [...PLAN_FILES, ...waveFiles];
  const documents = allPlanFiles
    .filter(filePath => fs.existsSync(filePath))
    .map(filePath => ({ path: relPath(filePath), text: readText(filePath, '') }));

  return {
    documents,
    corpus: documents.map(doc => doc.text.toLowerCase()).join('\n\n'),
  };
}

function isScanStale(filePath) {
  if (!fs.existsSync(filePath)) return true;
  const ageMs = Date.now() - fs.statSync(filePath).mtimeMs;
  return ageMs > SCAN_MAX_AGE_MS;
}

function ensureScanReport() {
  if (isScanStale(SCAN_REPORT_FILE)) {
    runNode(path.join(__dirname, 'codebase-scan.js'), ['--brief']);
  }

  return readJSON(SCAN_REPORT_FILE, {
    scanDate: new Date().toISOString(),
    summary: {
      buildOk: false,
      tsErrors: 0,
      incompleteDocs: 0,
      todoCount: 0,
      missingTests: 0,
    },
    priorityList: [],
    openWaves: [],
    incompleteDocs: [],
  });
}

function normalizeQueue(queue) {
  if (queue && Array.isArray(queue.tasks)) {
    return queue;
  }

  return {
    version: '3.0-discovery',
    generatedAt: new Date().toISOString(),
    tasks: [],
  };
}

function queueHasOnlyCompletedTasks(queue) {
  const tasks = Array.isArray(queue?.tasks) ? queue.tasks : [];
  if (tasks.length === 0) return false;

  return tasks.every(task =>
    ['done', 'complete', 'archived'].includes(String(task.status || '').toLowerCase())
  );
}

function getCompletedFeatureIds(queue) {
  const tasks = Array.isArray(queue?.tasks) ? queue.tasks : [];
  return new Set(tasks.map(task => String(task.featureId || '').trim()).filter(Boolean));
}

function readRecentWaveHistory() {
  if (fs.existsSync(RECENT_WAVES_FILE)) {
    const raw = readJSON(RECENT_WAVES_FILE, []);
    return Array.isArray(raw) ? raw : [];
  }

  if (!fs.existsSync(QUEUE_ARCHIVE_DIR)) {
    return [];
  }

  const archives = fs
    .readdirSync(QUEUE_ARCHIVE_DIR)
    .filter(name => /^task-queue-.*\.json$/i.test(name))
    .sort()
    .slice(-RECENT_WAVE_MEMORY);

  const bootstrapped = archives
    .map(name => {
      const archivedQueue = readJSON(path.join(QUEUE_ARCHIVE_DIR, name), null);
      const featureIds = archivedQueue ? [...getCompletedFeatureIds(archivedQueue)] : [];
      return {
        recordedAt: name.replace(/^task-queue-/, '').replace(/\.json$/i, ''),
        featureIds,
      };
    })
    .filter(entry => entry.featureIds.length > 0);

  if (bootstrapped.length > 0) {
    writeRecentWaveHistory(bootstrapped);
  }

  return bootstrapped;
}

function writeRecentWaveHistory(history) {
  const trimmed = Array.isArray(history) ? history.slice(-RECENT_WAVE_MEMORY) : [];
  writeJSON(RECENT_WAVES_FILE, trimmed);
}

function rememberCompletedWave(queue) {
  const featureIds = [...getCompletedFeatureIds(queue)];
  if (featureIds.length === 0) {
    return readRecentWaveHistory();
  }

  const history = readRecentWaveHistory();
  history.push({
    recordedAt: new Date().toISOString(),
    featureIds,
  });
  writeRecentWaveHistory(history);
  return readRecentWaveHistory();
}

function getRecentlyUsedFeatureIds() {
  const history = readRecentWaveHistory();
  return new Set(
    history.flatMap(entry => (Array.isArray(entry?.featureIds) ? entry.featureIds : []))
  );
}

function archiveCompletedQueue(queue, prompts) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.mkdirSync(QUEUE_ARCHIVE_DIR, { recursive: true });

  const queueArchiveFile = path.join(QUEUE_ARCHIVE_DIR, `task-queue-${timestamp}.json`);
  const promptsArchiveFile = path.join(QUEUE_ARCHIVE_DIR, `prompts-${timestamp}.json`);

  writeJSON(queueArchiveFile, queue);
  writeJSON(promptsArchiveFile, prompts);

  return {
    queueArchiveFile: relPath(queueArchiveFile),
    promptsArchiveFile: relPath(promptsArchiveFile),
  };
}

function normalizePrompts(prompts) {
  return prompts && typeof prompts === 'object' ? prompts : {};
}

function featureTaskStats(queue) {
  const stats = new Map();
  for (const task of queue.tasks || []) {
    if (!task || !task.featureId) continue;
    if (!stats.has(task.featureId)) {
      stats.set(task.featureId, {
        hasOpen: false,
        latestStatus: task.status || 'queued',
      });
    }
    const state = stats.get(task.featureId);
    const status = String(task.status || 'queued').toLowerCase();
    if (!['done', 'complete', 'archived'].includes(status)) {
      state.hasOpen = true;
    }
    state.latestStatus = task.status || state.latestStatus;
  }
  return stats;
}

function scoreFromPriority(priority) {
  switch ((priority || '').toUpperCase()) {
    case 'P0':
      return 100;
    case 'P1':
      return 70;
    default:
      return 40;
  }
}

function featureKeywords(feature) {
  const base = [
    feature.name,
    feature.category,
    ...(feature.planKeywords || []),
    ...(feature.tags || []),
  ];

  return [
    ...new Set(
      base
        .join(' ')
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(token => token.length >= 4)
    ),
  ];
}

function countPlanMentions(feature, planCorpus) {
  const keywords = featureKeywords(feature);
  return keywords.reduce((count, keyword) => count + (planCorpus.includes(keyword) ? 1 : 0), 0);
}

function countScanMentions(feature, scanReport) {
  const haystack = [
    ...(scanReport.priorityList || []).map(item =>
      `${item.category || ''} ${item.title || ''}`.toLowerCase()
    ),
    ...(scanReport.openWaves || []).map(wave =>
      `${wave.objective || ''} ${wave.status || ''}`.toLowerCase()
    ),
  ].join('\n');

  return featureKeywords(feature).reduce(
    (count, keyword) => count + (haystack.includes(keyword) ? 1 : 0),
    0
  );
}

function countSignatureMatches(feature, codebaseIndex) {
  const signatures = Array.isArray(feature.codebaseSignatures) ? feature.codebaseSignatures : [];
  let matches = 0;

  for (const signature of signatures) {
    const type = signature.type || 'content';
    const value = String(signature.value || '').toLowerCase();
    if (!value) continue;

    let matched = false;
    if (type === 'path') {
      matched = codebaseIndex.pathCorpus.includes(value);
    } else if (type === 'content') {
      matched = codebaseIndex.files.some(file => file.content.includes(value));
    } else if (type === 'pathOrContent') {
      matched =
        codebaseIndex.pathCorpus.includes(value) ||
        codebaseIndex.files.some(file => file.content.includes(value));
    }

    if (matched) matches += 1;
  }

  return {
    matched: matches,
    total: signatures.length,
  };
}

function buildPrompt(feature) {
  if (feature.suggestedPrompt) {
    return feature.suggestedPrompt;
  }

  return `${feature.suggestedAgent} -- ${feature.suggestedAction}: ${path.basename(feature.targetFile)} -> ${feature.name}; align with ${feature.researchBasis}`;
}

function nextDiscoveryNumber(queue) {
  const numbers = (queue.tasks || [])
    .map(task => String(task.taskId || task.id || ''))
    .map(id => /^DU(\d{3})$/i.exec(id))
    .filter(Boolean)
    .map(match => Number.parseInt(match[1], 10));

  return (numbers.length ? Math.max(...numbers) : 0) + 1;
}

function toTaskId(number) {
  return `DU${String(number).padStart(3, '0')}`;
}

function createTask(taskId, feature, score, planMentions, scanMentions, signatureSummary) {
  const now = new Date().toISOString();
  const objective = `${feature.name} — auto-discovered upgrade opportunity`;
  const acceptanceCriteria =
    feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0
      ? feature.acceptanceCriteria
      : [
          `Document a concrete plan for ${feature.name}`,
          'Reference the repo gap and research basis explicitly',
          'Define measurable acceptance criteria and validation steps',
        ];

  return {
    taskId,
    id: taskId,
    featureId: feature.featureId,
    agent: feature.suggestedAgent,
    lane: 'AUTO',
    title: feature.name,
    objective,
    description: objective,
    status: 'queued',
    dependsOn: [],
    consumesFrom: feature.consumesFrom || [],
    requiresFeedsAck: false,
    feedsAckBy: null,
    attempts: 0,
    createdAt: now,
    startedAt: null,
    finishedAt: null,
    evidence: {},
    baseScore: score,
    priority_score: score,
    priority: feature.priority,
    tags: feature.tags || [feature.category.toLowerCase()],
    files: [feature.targetFile],
    producedRef: feature.targetFile,
    validationCommand: 'npm run plans:validate',
    acceptanceCriteria,
    discoveryMeta: {
      researchBasis: feature.researchBasis,
      planMentions,
      scanMentions,
      signatureMatches: signatureSummary.matched,
      signatureTotal: signatureSummary.total,
    },
  };
}

function createPromptEntry(taskId, feature) {
  return {
    v: 1,
    agent: feature.suggestedAgent,
    action: feature.suggestedAction,
    target: path.basename(feature.targetFile),
    prompt: buildPrompt(feature),
    tags: feature.tags || [feature.category.toLowerCase()],
    lastUsed: new Date().toISOString().slice(0, 10),
    successCount: 0,
    history: [],
  };
}

function ensureDiscoveredUpgradesLog() {
  if (fs.existsSync(DISCOVERED_UPGRADES_FILE)) {
    return;
  }

  const initial = [
    '# Discovered Upgrades',
    '',
    'Auto-discovered Aegis queue-empty upgrades are appended here when the orchestrator finds a planning gap and seeds a new task.',
    '',
  ].join('\n');
  writeText(DISCOVERED_UPGRADES_FILE, initial);
}

function appendDiscoveryLog(selected) {
  ensureDiscoveredUpgradesLog();
  const lines = [`## ${new Date().toISOString()} — Queue-empty discovery run`, ''];

  for (const item of selected) {
    lines.push(`### ${item.task.taskId} — ${item.feature.name}`);
    lines.push(`- Feature ID: ${item.feature.featureId}`);
    lines.push(`- Agent: ${item.feature.suggestedAgent}`);
    lines.push(`- Target file: ${item.feature.targetFile}`);
    lines.push(`- Research basis: ${item.feature.researchBasis}`);
    lines.push(`- Score: ${item.score}`);
    lines.push(
      `- Gap evidence: ${item.signatureSummary.matched}/${item.signatureSummary.total} signatures matched`
    );
    lines.push(`- Plan evidence: ${item.planMentions} keyword hits in planning docs`);
    lines.push(`- Scan evidence: ${item.scanMentions} keyword hits in codebase scan signals`);
    lines.push(`- Prompt: ${item.prompt.prompt}`);
    lines.push('');
  }

  fs.appendFileSync(DISCOVERED_UPGRADES_FILE, `${lines.join('\n')}\n`);
}

function main() {
  const queue = normalizeQueue(readJSON(QUEUE_FILE));
  const prompts = normalizePrompts(readJSON(PROMPTS_FILE));
  const scanReport = ensureScanReport();
  const matrix = readJSON(MATRIX_FILE, { features: [] });
  const codebaseIndex = loadCodebaseIndex();
  const planIndex = loadPlanTexts();

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    requireMinInject: REQUIRE_MIN_INJECT,
    minInject: MIN_INJECT,
    maxInject: MAX_INJECT,
    skipped: false,
    skipReason: null,
    scanDate: scanReport.scanDate || null,
    summary: scanReport.summary || {},
    featuresAnalyzed: Array.isArray(matrix.features) ? matrix.features.length : 0,
    gapsDetected: 0,
    selectedFeatures: [],
    tasksGenerated: [],
    requirementFailed: false,
    archivedPreviousWave: null,
  };

  if (fs.existsSync(SKIP_DISCOVERY_FILE)) {
    report.skipped = true;
    report.skipReason = `Discovery skipped because ${relPath(SKIP_DISCOVERY_FILE)} exists.`;
    writeJSON(REPORT_FILE, report);
    if (JSON_OUT) {
      console.log(JSON.stringify(report, null, 2));
    }
    return;
  }

  const candidates = [];
  const featureStats = featureTaskStats(queue);
  const recentCompletedFeatureIds = queueHasOnlyCompletedTasks(queue)
    ? getCompletedFeatureIds(queue)
    : new Set();
  const recentlyUsedFeatureIds = getRecentlyUsedFeatureIds();

  for (const feature of matrix.features || []) {
    if (!feature || !feature.featureId || !feature.suggestedAgent || !feature.targetFile) continue;

    const state = featureStats.get(feature.featureId);
    if (state && state.hasOpen) continue;
    if (
      state &&
      ['done', 'complete', 'archived'].includes(String(state.latestStatus || '').toLowerCase())
    )
      continue;

    const signatureSummary = countSignatureMatches(feature, codebaseIndex);
    if (signatureSummary.total === 0) continue;
    if (signatureSummary.matched === signatureSummary.total) continue;

    const planMentions = countPlanMentions(feature, planIndex.corpus);
    const scanMentions = countScanMentions(feature, scanReport);
    const score =
      scoreFromPriority(feature.priority) +
      (planMentions > 0 ? 30 : 0) +
      (scanMentions > 0 ? 25 : 0) -
      (signatureSummary.matched > 0 ? 20 : 0) +
      (state ? 10 : 0);

    candidates.push({
      feature,
      isRefresh: Boolean(state),
      previousStatus: state ? state.latestStatus : null,
      wasInPreviousWave: recentCompletedFeatureIds.has(feature.featureId),
      wasInRecentHistory: recentlyUsedFeatureIds.has(feature.featureId),
      signatureSummary,
      planMentions,
      scanMentions,
      score,
    });
  }

  candidates.sort((a, b) => b.score - a.score || a.feature.name.localeCompare(b.feature.name));
  report.gapsDetected = candidates.length;

  const selected = [];
  if (candidates.length > 0) {
    const targetCount = Math.min(candidates.length, MAX_INJECT);
    const freshCandidates = candidates.filter(candidate => !candidate.wasInRecentHistory);
    const recentCandidates = candidates.filter(
      candidate => candidate.wasInRecentHistory && !candidate.wasInPreviousWave
    );
    const recycledCandidates = candidates.filter(candidate => candidate.wasInPreviousWave);
    const prioritizedCandidates = [...freshCandidates, ...recentCandidates, ...recycledCandidates];

    for (const candidate of prioritizedCandidates) {
      if (selected.length >= targetCount) {
        break;
      }
      selected.push(candidate);
    }
  }

  let discoveryNumber = nextDiscoveryNumber(queue);
  for (const candidate of selected) {
    const taskId = toTaskId(discoveryNumber++);
    const task = createTask(
      taskId,
      candidate.feature,
      candidate.score,
      candidate.planMentions,
      candidate.scanMentions,
      candidate.signatureSummary
    );
    const prompt = createPromptEntry(taskId, candidate.feature);
    report.selectedFeatures.push({
      featureId: candidate.feature.featureId,
      name: candidate.feature.name,
      score: candidate.score,
      isRefresh: candidate.isRefresh,
      previousStatus: candidate.previousStatus,
      agent: candidate.feature.suggestedAgent,
      targetFile: candidate.feature.targetFile,
      signatureMatches: candidate.signatureSummary,
      planMentions: candidate.planMentions,
      scanMentions: candidate.scanMentions,
    });
    report.tasksGenerated.push({
      taskId,
      featureId: candidate.feature.featureId,
      agent: candidate.feature.suggestedAgent,
      targetFile: candidate.feature.targetFile,
      prompt: prompt.prompt,
    });
    candidate.task = task;
    candidate.prompt = prompt;
  }

  if (REQUIRE_MIN_INJECT && selected.length < MIN_INJECT) {
    report.requirementFailed = true;
    report.skipReason = `Discovery generated ${selected.length} task(s), below required minimum ${MIN_INJECT}.`;
    writeJSON(DISCOVERY_GATE_FAIL_FILE, {
      timestamp: new Date().toISOString(),
      requiredMinimum: MIN_INJECT,
      generatedTasks: selected.length,
      maxInject: MAX_INJECT,
      reason: report.skipReason,
    });
    writeJSON(REPORT_FILE, report);

    if (!JSON_OUT) {
      console.error(
        `discover-upgrade: requirement failed -- generated ${selected.length}, required ${MIN_INJECT}.`
      );
    } else {
      console.log(JSON.stringify(report, null, 2));
    }
    process.exit(2);
  }

  removeFileIfExists(DISCOVERY_GATE_FAIL_FILE);

  if (!DRY_RUN && selected.length > 0) {
    if (queueHasOnlyCompletedTasks(queue)) {
      rememberCompletedWave(queue);
      report.archivedPreviousWave = archiveCompletedQueue(queue, prompts);
      queue.tasks = [];
    }

    queue.generatedAt = new Date().toISOString();
    queue.version = queue.version || '3.0-discovery';
    queue.tasks = [...queue.tasks, ...selected.map(item => item.task)];
    prompts &&
      Object.assign(
        prompts,
        Object.fromEntries(selected.map(item => [item.task.taskId, item.prompt]))
      );
    writeJSON(QUEUE_FILE, queue);
    writeJSON(PROMPTS_FILE, prompts);
    appendDiscoveryLog(selected);
  }

  writeJSON(REPORT_FILE, report);

  if (!JSON_OUT) {
    console.log(
      `discover-upgrade: analyzed ${report.featuresAnalyzed} features, detected ${report.gapsDetected} gaps, generated ${report.tasksGenerated.length} task(s).`
    );
    if (report.skipReason) {
      console.log(report.skipReason);
    }
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
}

main();
