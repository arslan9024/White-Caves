#!/usr/bin/env node

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const LOGS_DIR = path.join(ROOT, 'logs', 'orchestrator');
const ROADMAP_FILE = path.join(ROOT, 'plans', 'GITHUB_ISSUE_ROADMAP.md');
const ROADMAP_JSON_FILE = path.join(LOGS_DIR, 'github-issue-roadmap.json');

dotenv.config({ path: path.join(ROOT, '.env.local'), override: false });
dotenv.config({ path: path.join(ROOT, '.env'), override: false });

const argv = process.argv.slice(2);
const hasFlag = flag => argv.includes(flag);
const readArg = (name, fallback = '') => {
  const index = argv.indexOf(name);
  return index !== -1 ? String(argv[index + 1] || fallback) : fallback;
};

const APPLY = hasFlag('--apply');
const JSON_OUT = hasFlag('--json');
const DRY_RUN = hasFlag('--dry');
const BOOTSTRAP_FROM_DISCOVERY = hasFlag('--bootstrap-from-discovery');
const CHECK_TOKEN_ONLY = hasFlag('--check-token');
const CHECK_TOKEN_STRICT = hasFlag('--check-token-strict');
const OWNER = readArg('--owner', process.env.GITHUB_OWNER || 'arslan9024');
const REPO = readArg('--repo', process.env.GITHUB_REPO || 'White-Caves');
const EXPLICIT_TOKEN = hasFlag('--token') ? String(readArg('--token', '')).trim() : '';
const ENV_TOKEN = String(process.env.GITHUB_TOKEN || '').trim();
const BATCH_SIZE = Math.max(
  1,
  Number.parseInt(readArg('--batch-size', process.env.GITHUB_ISSUE_BATCH_SIZE || '10'), 10) || 10
);
const BOOTSTRAP_COUNT = Math.max(1, Number.parseInt(readArg('--bootstrap-count', '12'), 10) || 12);
const BOOTSTRAP_TARGET_COUNT = Math.max(
  1,
  Number.parseInt(
    readArg(
      '--bootstrap-target-count',
      process.env.GITHUB_ISSUE_BOOTSTRAP_TARGET || String(BOOTSTRAP_COUNT)
    ),
    10
  ) || BOOTSTRAP_COUNT
);
const BOOTSTRAP_PER_RUN = Math.max(
  1,
  Number.parseInt(
    readArg('--bootstrap-per-run', process.env.GITHUB_ISSUE_BOOTSTRAP_PER_RUN || '5'),
    10
  ) || 5
);
const BOOTSTRAP_ALL = hasFlag('--bootstrap-all');
const BOOTSTRAP_FROM_SCAN =
  hasFlag('--bootstrap-from-scan') ||
  (!hasFlag('--no-bootstrap-from-scan') &&
    String(process.env.GITHUB_ISSUE_BOOTSTRAP_FROM_SCAN || '1') !== '0');
const MILESTONE_PREFIX = readArg(
  '--milestone-prefix',
  process.env.GITHUB_ISSUE_MILESTONE_PREFIX || 'Aegis Issue Wave'
);
const STATE = readArg('--state', 'open');
const MATRIX_FILE = path.join(__dirname, 'feature-gap-matrix.json');
const SCAN_REPORT_FILE = path.join(ROOT, 'logs', 'orchestrator', 'codebase-scan-report.json');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeText(filePath, text) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, text, 'utf8');
}

function writeJSON(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function relPath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function getTokenPreflightMessage() {
  return [
    'GitHub auth required for issue bootstrap/apply.',
    'Use GitHub CLI auth if available, or pass an explicit token, then rerun the command:',
    '',
    '  gh auth login',
    '  gh auth status',
    '',
    '  npm run orchestrator:github-issues:bootstrap -- --token "<your-token>"',
    '  npm run orchestrator:github-issues:bootstrap',
    '',
    'Or run the read-only preview instead:',
    '',
    '  npm run orchestrator:github-issues:roadmap:dry',
  ].join('\n');
}

function isPlaceholderToken(token) {
  const value = String(token || '').trim();
  if (!value) {
    return false;
  }

  return /newtokenhere|your-token|changeme|example|placeholder/i.test(value);
}

function readGitHubCliToken() {
  const result = spawnSync('gh', ['auth', 'token'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    return '';
  }

  return String(result.stdout || '').trim();
}

function resolveGitHubTokenInfo() {
  if (EXPLICIT_TOKEN) {
    if (!isPlaceholderToken(EXPLICIT_TOKEN)) {
      return { value: EXPLICIT_TOKEN, source: 'command-line token' };
    }

    return { value: EXPLICIT_TOKEN, source: 'placeholder/example token' };
  }

  if (ENV_TOKEN && !isPlaceholderToken(ENV_TOKEN)) {
    return { value: ENV_TOKEN, source: 'project environment token' };
  }

  if (ENV_TOKEN && isPlaceholderToken(ENV_TOKEN)) {
    return { value: ENV_TOKEN, source: 'placeholder/example project environment token' };
  }

  const cliToken = readGitHubCliToken();
  if (cliToken) {
    return { value: cliToken, source: 'GitHub CLI auth' };
  }

  return { value: '', source: 'missing' };
}

const TOKEN_INFO = resolveGitHubTokenInfo();
const TOKEN = TOKEN_INFO.value;

function requireTokenOrThrow() {
  if (TOKEN && !isPlaceholderToken(TOKEN)) {
    return;
  }

  if (TOKEN && isPlaceholderToken(TOKEN)) {
    throw new Error(
      [
        'GitHub token appears to be a placeholder/example value, not a real PAT.',
        getTokenPreflightMessage(),
      ].join('\n')
    );
  }

  if (ENV_TOKEN && isPlaceholderToken(ENV_TOKEN)) {
    throw new Error(
      [
        'GitHub token detected in the project environment, but it appears to be a placeholder/example value.',
        getTokenPreflightMessage(),
      ].join('\n')
    );
  }

  throw new Error(getTokenPreflightMessage());
}

function printTokenCheck() {
  if (TOKEN && !isPlaceholderToken(TOKEN)) {
    console.log('GitHub token present: yes');
    console.log(`Token source: ${TOKEN_INFO.source}`);
    console.log(`Repository: ${OWNER}/${REPO}`);
    console.log('Bootstrap/apply path is ready.');
    return true;
  }

  if (TOKEN && isPlaceholderToken(TOKEN)) {
    console.log('GitHub token present: placeholder/example value detected');
    console.log('GitHub token appears to be a placeholder/example value, not a real PAT.');
    console.log(getTokenPreflightMessage());
    return false;
  }

  if (!TOKEN && ENV_TOKEN) {
    console.log('GitHub token present: environment variable detected, but ignored by default');
    console.log('This flow now prefers GitHub CLI auth or an explicit --token value.');
    console.log('Run `gh auth login` / `gh auth status`, or pass `--token` explicitly.');
    return false;
  }

  console.log('GitHub token present: no');
  console.log('Token source: none');
  console.log(getTokenPreflightMessage());
  return false;
}

function issuePriorityScore(issue) {
  const labels = new Set(
    (issue.labels || []).map(label => String(label.name || label).toLowerCase())
  );
  const title = String(issue.title || '').toLowerCase();

  if (
    labels.has('priority:p0') ||
    labels.has('p0') ||
    labels.has('critical') ||
    /critical|security|blocker/.test(title)
  ) {
    return 100;
  }
  if (labels.has('priority:p1') || labels.has('high') || /urgent|high-risk|hotfix/.test(title)) {
    return 80;
  }
  if (labels.has('priority:p2') || labels.has('medium') || /bug|issue|audit/.test(title)) {
    return 60;
  }
  return 40;
}

function featurePriorityScore(feature) {
  const priority = String(feature.priority || '').toLowerCase();
  const text =
    `${feature.name || ''} ${feature.suggestedAction || ''} ${feature.featureId || ''}`.toLowerCase();

  if (
    priority.includes('p0') ||
    priority.includes('critical') ||
    /security|blocker|critical/.test(text)
  ) {
    return 100;
  }
  if (priority.includes('p1') || priority.includes('high') || /urgent|high-risk/.test(text)) {
    return 80;
  }
  if (priority.includes('p2') || priority.includes('medium') || /bug|audit|coverage/.test(text)) {
    return 60;
  }
  return 40;
}

function normalizeIssue(issue) {
  const labels = (issue.labels || []).map(label => ({
    name: String(label.name || label),
    color: String(label.color || '000000'),
  }));

  return {
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
    state: issue.state,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    labels,
    assignees: Array.isArray(issue.assignees)
      ? issue.assignees.map(assignee => assignee.login)
      : [],
    priorityScore: issuePriorityScore(issue),
    milestone: issue.milestone
      ? {
          number: issue.milestone.number,
          title: issue.milestone.title,
        }
      : null,
  };
}

function sortIssues(issues) {
  return [...issues].sort((left, right) => {
    if (right.priorityScore !== left.priorityScore) return right.priorityScore - left.priorityScore;
    const leftDate = Date.parse(left.createdAt || '') || 0;
    const rightDate = Date.parse(right.createdAt || '') || 0;
    if (leftDate !== rightDate) return leftDate - rightDate;
    return Number(left.number) - Number(right.number);
  });
}

function sortFeatures(features) {
  return [...features].sort((left, right) => {
    const leftScore = featurePriorityScore(left);
    const rightScore = featurePriorityScore(right);
    if (rightScore !== leftScore) return rightScore - leftScore;
    return String(left.featureId || left.name || '').localeCompare(
      String(right.featureId || right.name || '')
    );
  });
}

function chunkIssues(issues, batchSize) {
  const waves = [];
  for (let index = 0; index < issues.length; index += batchSize) {
    waves.push(issues.slice(index, index + batchSize));
  }
  return waves;
}

function waveTitle(index) {
  return `${MILESTONE_PREFIX} ${String(index + 1).padStart(2, '0')}`;
}

function waveDescription(index, waveIssues) {
  const issueNumbers = waveIssues.map(issue => `#${issue.number}`).join(', ');
  return [
    `Auto-generated by Aegis issue roadmap sync for wave ${index + 1}.`,
    `Covers issues: ${issueNumbers}.`,
    'Aegis will use this milestone as the ordered planning bucket for implementation tasks.',
  ].join(' ');
}

function buildRoadmapMarkdown({ owner, repo, sourceState, batchSize, issues, waves, generatedAt }) {
  const lines = [
    '# GitHub Issue Roadmap',
    '',
    `- Repository: \`${owner}/${repo}\``,
    `- Issue state: \`${sourceState}\``,
    `- Batch size: \`${batchSize}\``,
    `- Generated: \`${generatedAt}\``,
    `- Source: auto-synced GitHub issues`,
    '',
    '## Sequencing Rules',
    '',
    '1. Sort open issues by priority signal, then creation time, then issue number.',
    '2. Group the sorted list into sequential milestone waves.',
    '3. Each wave becomes a GitHub milestone title and an Aegis planning batch.',
    '4. Aegis should execute the waves in order and keep the roadmap aligned with the queue.',
    '',
    '## Issue Registry',
    '',
    `Total open issues: **${issues.length}**`,
    '',
  ];

  if (issues.length === 0) {
    lines.push('> No GitHub issues are currently open in this repository.');
    lines.push(
      '> Use `--bootstrap-from-discovery --apply` to seed the tracker from the Aegis discovery matrix.'
    );
    lines.push('');
  }

  for (let waveIndex = 0; waveIndex < waves.length; waveIndex += 1) {
    const wave = waves[waveIndex];
    const title = waveTitle(waveIndex);
    lines.push(`### ${title}`);
    lines.push('');
    lines.push(`- Planned issue count: ${wave.length}`);
    lines.push(`- Wave priority: ${wave[0] ? wave[0].priorityScore : 0}`);
    lines.push(`- Milestone description: ${waveDescription(waveIndex, wave)}`);
    lines.push('');
    lines.push('| Issue | Title | Priority | Labels |');
    lines.push('| ----- | ----- | -------- | ------ |');
    for (const issue of wave) {
      const labels = issue.labels.map(label => label.name).join(', ') || 'none';
      lines.push(
        `| #${issue.number} | ${issue.title.replace(/\|/g, '\\|')} | ${issue.priorityScore} | ${labels.replace(/\|/g, '\\|')} |`
      );
    }
    lines.push('');
  }

  lines.push('## Aegis Execution Notes');
  lines.push('');
  lines.push('- Use each milestone wave as the next implementation batch.');
  lines.push('- Generate one planning task per issue, in wave order.');
  lines.push(
    '- When a wave is complete, advance to the next milestone wave without reordering earlier issues.'
  );
  lines.push('');

  return `${lines.join('\n').trimEnd()}\n`;
}

async function fetchJson(url, { method = 'GET', token = '', body = null } = {}) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'White-Caves-Aegis/1.0',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const json = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      })()
    : null;

  if (!response.ok) {
    const message =
      json && typeof json === 'object' && json.message ? json.message : response.statusText;
    throw new Error(`GitHub API ${response.status} ${response.statusText}: ${message}`);
  }

  return json;
}

async function fetchAllIssues(owner, repo, state, token) {
  const issues = [];
  for (let page = 1; page < 20; page += 1) {
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/issues`);
    url.searchParams.set('state', state);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('sort', 'created');
    url.searchParams.set('direction', 'asc');
    const batch = await fetchJson(url, { token });
    if (!Array.isArray(batch) || batch.length === 0) break;
    issues.push(...batch.filter(issue => !issue.pull_request));
    if (batch.length < 100) break;
  }
  return issues;
}

async function fetchMilestones(owner, repo, token) {
  const milestones = [];
  for (let page = 1; page < 20; page += 1) {
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/milestones`);
    url.searchParams.set('state', 'all');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    const batch = await fetchJson(url, { token });
    if (!Array.isArray(batch) || batch.length === 0) break;
    milestones.push(...batch);
    if (batch.length < 100) break;
  }
  return milestones;
}

async function createMilestone(owner, repo, token, title, description) {
  return fetchJson(`https://api.github.com/repos/${owner}/${repo}/milestones`, {
    method: 'POST',
    token,
    body: {
      title,
      description,
      state: 'open',
    },
  });
}

async function createIssue(owner, repo, token, title, body, labels = []) {
  return fetchJson(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    token,
    body: {
      title,
      body,
      labels,
    },
  });
}

function loadDiscoveryFeatures() {
  const matrix = readJSON(MATRIX_FILE, { features: [] });
  if (!matrix || !Array.isArray(matrix.features)) {
    return [];
  }
  return sortFeatures(
    matrix.features.filter(feature => feature && (feature.name || feature.featureId))
  );
}

function readJSON(filePath, fallback = null) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function buildBootstrapBody(feature) {
  const acceptance =
    Array.isArray(feature.acceptanceCriteria) && feature.acceptanceCriteria.length > 0
      ? feature.acceptanceCriteria
      : [
          `Document a concrete plan for ${feature.name || feature.featureId}`,
          'Reference the repo gap and research basis explicitly',
          'Define measurable acceptance criteria and validation steps',
        ];

  return [
    '## Aegis Discovery Bootstrap',
    '',
    `- Feature ID: ${feature.featureId || 'n/a'}`,
    `- Suggested agent: ${feature.suggestedAgent || 'n/a'}`,
    `- Target file: ${feature.targetFile || 'n/a'}`,
    `- Research basis: ${feature.researchBasis || 'n/a'}`,
    '',
    '### Acceptance Criteria',
    ...acceptance.map(item => `- [ ] ${item}`),
    '',
    '### Aegis Notes',
    '- This issue was bootstrapped from the discovery matrix because the GitHub issue tracker was empty.',
    '- Once milestones are created, Aegis can sequence these issues into execution waves.',
  ].join('\n');
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSafeTags(tags) {
  return toArray(tags)
    .map(tag =>
      String(tag || '')
        .trim()
        .toLowerCase()
    )
    .filter(Boolean)
    .slice(0, 10);
}

function buildScanFeature({
  featureId,
  name,
  suggestedAgent,
  targetFile,
  researchBasis,
  tags,
  acceptanceCriteria,
}) {
  return {
    featureId,
    name,
    suggestedAgent,
    targetFile,
    researchBasis,
    tags: toSafeTags(tags),
    acceptanceCriteria: toArray(acceptanceCriteria).slice(0, 8),
  };
}

function loadScanFallbackFeatures(limit, existingTitles = new Set()) {
  if (limit <= 0) {
    return [];
  }

  const scan = readJSON(SCAN_REPORT_FILE, null);
  if (!scan || typeof scan !== 'object') {
    return [];
  }

  const features = [];
  const seen = new Set(existingTitles);

  const pushFeature = feature => {
    if (!feature || !feature.name) {
      return;
    }
    const key = String(feature.name).trim().toLowerCase();
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    features.push(feature);
  };

  const priorityList = toArray(scan.priorityList);
  for (let index = 0; index < priorityList.length && features.length < limit; index += 1) {
    const item = priorityList[index];
    const title = String(item?.title || '').trim();
    if (!title) {
      continue;
    }

    pushFeature(
      buildScanFeature({
        featureId: `SCAN-PRIORITY-${index + 1}`,
        name: title,
        suggestedAgent: toArray(item?.recommendedAgents)[0] || '@Mira',
        targetFile: toArray(item?.detail)[0] || String(item?.category || 'codebase'),
        researchBasis: `codebase-scan priority ${String(item?.priority || 'P2')}`,
        tags: [String(item?.category || 'analysis'), String(item?.priority || 'p2')],
        acceptanceCriteria: [
          'Create a concrete implementation plan for the reported hotspot',
          'Resolve the top high-impact occurrences first and record file-level evidence',
          'Run relevant validation command(s) for the touched scope',
        ],
      })
    );
  }

  const aggregateCollections = [
    { key: 'securityFlags', label: 'Security findings hardening', tag: 'security' },
    { key: 'missingTests', label: 'Missing tests coverage uplift', tag: 'tests' },
    { key: 'stubHandlers', label: 'Empty handler implementation', tag: 'quality' },
    { key: 'todos', label: 'TODO/FIXME debt reduction', tag: 'tech-debt' },
  ];

  for (const collection of aggregateCollections) {
    if (features.length >= limit) {
      break;
    }
    const items = toArray(scan[collection.key]);
    if (items.length === 0) {
      continue;
    }

    const sorted = items.slice().sort((a, b) => Number(b?.score || 0) - Number(a?.score || 0));
    const top = sorted.slice(0, Math.min(20, sorted.length));
    const primary = top[0] || {};
    const hotspot = String(primary.file || 'mixed-files');
    const name = `${collection.label}: ${top.length} high-impact items (hotspot ${hotspot})`;

    pushFeature(
      buildScanFeature({
        featureId: `SCAN-${String(collection.key).toUpperCase()}`,
        name,
        suggestedAgent: collection.tag === 'security' ? '@Radia' : '@Mira',
        targetFile: hotspot,
        researchBasis: `codebase-scan ${collection.key} (${items.length} total findings)`,
        tags: [collection.tag, 'scan-bootstrap'],
        acceptanceCriteria: [
          `Address top ${Math.min(10, top.length)} ${collection.key} findings in priority order`,
          'Document before/after status with affected file list',
          'Validate via lint/typecheck/tests for changed scope',
        ],
      })
    );
  }

  return features.slice(0, limit);
}

async function assignIssueMilestone(owner, repo, token, issueNumber, milestoneNumber) {
  return fetchJson(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
    method: 'PATCH',
    token,
    body: {
      milestone: milestoneNumber,
    },
  });
}

async function main() {
  if (!OWNER || !REPO) {
    throw new Error(
      'Missing GitHub repository coordinates. Provide --owner and --repo or set GITHUB_OWNER/GITHUB_REPO.'
    );
  }

  if (CHECK_TOKEN_ONLY) {
    const ok = printTokenCheck();
    if (!ok && CHECK_TOKEN_STRICT) {
      process.exitCode = 1;
    }
    return;
  }

  if (APPLY || BOOTSTRAP_FROM_DISCOVERY) {
    requireTokenOrThrow();
  }

  const generatedAt = new Date().toISOString();
  const canQueryGitHub = Boolean(TOKEN) && !isPlaceholderToken(TOKEN);
  let rawIssues = [];

  if (canQueryGitHub) {
    try {
      rawIssues = await fetchAllIssues(OWNER, REPO, STATE, TOKEN);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (DRY_RUN && /401|403|Bad credentials|Unauthorized/i.test(message)) {
        rawIssues = [];
        console.log(
          'github-issue-roadmap: GitHub query skipped in dry-run mode because auth was not usable; using empty preview.'
        );
      } else {
        throw error;
      }
    }
  } else if (DRY_RUN) {
    console.log(
      'github-issue-roadmap: no usable GitHub auth detected; using empty dry-run preview.'
    );
  }

  let issues = sortIssues(rawIssues.map(normalizeIssue));
  let waves = chunkIssues(issues, BATCH_SIZE);
  const roadmap = {
    generatedAt,
    owner: OWNER,
    repo: REPO,
    state: STATE,
    batchSize: BATCH_SIZE,
    issueCount: issues.length,
    milestoneCount: waves.length,
    bootstrapTargetCount: BOOTSTRAP_TARGET_COUNT,
    bootstrapPerRun: BOOTSTRAP_PER_RUN,
    bootstrapAll: BOOTSTRAP_ALL,
    bootstrapFromScan: BOOTSTRAP_FROM_SCAN,
    apply: APPLY,
    dryRun: DRY_RUN,
    issues,
    waves: waves.map((wave, index) => ({
      index: index + 1,
      title: waveTitle(index),
      description: waveDescription(index, wave),
      issueNumbers: wave.map(issue => issue.number),
      issueTitles: wave.map(issue => issue.title),
    })),
  };

  if (BOOTSTRAP_FROM_DISCOVERY) {
    if (!TOKEN) {
      throw new Error('Bootstrapping issues from discovery requires GITHUB_TOKEN or --token.');
    }

    const currentIssueCount = issues.length;
    const neededCount = Math.max(0, BOOTSTRAP_TARGET_COUNT - currentIssueCount);
    const createCount = BOOTSTRAP_ALL ? neededCount : Math.min(neededCount, BOOTSTRAP_PER_RUN);
    const existingTitles = new Set(
      issues.map(issue =>
        String(issue.title || '')
          .trim()
          .toLowerCase()
      )
    );

    const discoveryFeatures = loadDiscoveryFeatures()
      .filter(feature => {
        const title = String(feature.name || feature.featureId || '')
          .trim()
          .toLowerCase();
        return title && !existingTitles.has(title);
      })
      .slice(0, createCount);

    const selectedFeatures = [...discoveryFeatures];
    if (BOOTSTRAP_FROM_SCAN && selectedFeatures.length < createCount) {
      const neededFromScan = createCount - selectedFeatures.length;
      const scanFeatures = loadScanFallbackFeatures(neededFromScan, existingTitles).filter(
        feature => {
          const title = String(feature.name || feature.featureId || '')
            .trim()
            .toLowerCase();
          return title && !existingTitles.has(title);
        }
      );
      selectedFeatures.push(...scanFeatures);
    }

    const bootstrapIssues = [];

    for (const feature of selectedFeatures) {
      const created = await createIssue(
        OWNER,
        REPO,
        TOKEN,
        feature.name || feature.featureId,
        buildBootstrapBody(feature),
        Array.isArray(feature.tags) && feature.tags.length > 0 ? feature.tags : ['aegis-bootstrap']
      );

      const normalized = normalizeIssue(created);
      bootstrapIssues.push(normalized);
      existingTitles.add(
        String(normalized.title || '')
          .trim()
          .toLowerCase()
      );
    }

    roadmap.bootstrapCount = bootstrapIssues.length;
    roadmap.bootstrapNeeded = neededCount;
    roadmap.bootstrapCreatedThisRun = bootstrapIssues.length;
    roadmap.bootstrapFeatures = selectedFeatures.map(feature => ({
      featureId: feature.featureId,
      name: feature.name,
      targetFile: feature.targetFile,
      suggestedAgent: feature.suggestedAgent,
      source: String(feature.featureId || '').startsWith('SCAN-')
        ? 'scan-report'
        : 'discovery-matrix',
    }));
    issues = sortIssues([...issues, ...bootstrapIssues]);
    waves = chunkIssues(issues, BATCH_SIZE);
    roadmap.issues = issues;
    roadmap.issueCount = issues.length;
    roadmap.waves = waves.map((wave, index) => ({
      index: index + 1,
      title: waveTitle(index),
      description: waveDescription(index, wave),
      issueNumbers: wave.map(issue => issue.number),
      issueTitles: wave.map(issue => issue.title),
    }));
    roadmap.milestoneCount = waves.length;
  }

  const markdown = buildRoadmapMarkdown({
    owner: OWNER,
    repo: REPO,
    sourceState: STATE,
    batchSize: BATCH_SIZE,
    issues: roadmap.issues,
    waves,
    generatedAt,
  });

  if (!DRY_RUN) {
    writeJSON(ROADMAP_JSON_FILE, roadmap);
    writeText(ROADMAP_FILE, markdown);
  }

  if (APPLY) {
    if (!TOKEN) {
      throw new Error('Milestone application requires GITHUB_TOKEN or --token.');
    }

    const existingMilestones = await fetchMilestones(OWNER, REPO, TOKEN);
    const milestoneByTitle = new Map(
      existingMilestones.map(milestone => [String(milestone.title), milestone])
    );

    for (let index = 0; index < waves.length; index += 1) {
      const wave = waves[index];
      const title = waveTitle(index);
      const description = waveDescription(index, wave);
      let milestone = milestoneByTitle.get(title);

      if (!milestone) {
        milestone = await createMilestone(OWNER, REPO, TOKEN, title, description);
        milestoneByTitle.set(title, milestone);
      }

      for (const issue of wave) {
        await assignIssueMilestone(OWNER, REPO, TOKEN, issue.number, milestone.number);
      }
    }
  }

  if (JSON_OUT) {
    console.log(JSON.stringify(roadmap, null, 2));
    return;
  }

  if (DRY_RUN) {
    console.log(markdown);
    return;
  }

  const mode = APPLY ? 'apply' : DRY_RUN ? 'dry-run' : 'plan';
  console.log(`github-issue-roadmap: ${mode} for ${OWNER}/${REPO}`);
  console.log(`  issues=${issues.length} waves=${waves.length} batchSize=${BATCH_SIZE}`);
  if (BOOTSTRAP_FROM_DISCOVERY) {
    console.log(
      `  bootstrap: target=${BOOTSTRAP_TARGET_COUNT} perRun=${BOOTSTRAP_PER_RUN} all=${BOOTSTRAP_ALL}`
    );
  }
  console.log(`  roadmap: ${relPath(ROADMAP_FILE)}`);
  console.log(`  registry: ${relPath(ROADMAP_JSON_FILE)}`);
  if (!TOKEN && APPLY) {
    console.log('  note: apply mode requires a GitHub token.');
  }
}

main().catch(error => {
  console.error(
    `github-issue-roadmap failed: ${error instanceof Error ? error.message : String(error)}`
  );
  process.exitCode = 1;
});
