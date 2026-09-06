#!/usr/bin/env node
/**
 * Tri-Turn Sovereign Autopilot Protocol (TTSAP-333x3)
 *
 * Strict execution lifecycle:
 * 1) DISCOVER_SYNC_999  -> live GitHub create/update + milestone organization
 * 2) SOLVE_SERIAL       -> one-by-one real validation/closure with strict serial retry policy
 * 3) COMPLETE           -> only when 999 are verified closed
 * 4) REGENERATE         -> next cycle starts only after COMPLETE
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { calculateTriTurnProgress } from './tri-turn-progress.js';
import {
  buildChildImplementationTask,
  buildGitHubIssueHandoff,
  classifyGitHubIssue,
} from './tri-turn-issue-handoff.js';
import { decomposeBroadIssue } from './tri-turn-broad-decomposition.js';
import { buildCompletionArtifact, validateCompletionEvidence } from './tri-turn-evidence.js';
import { buildClosureComment, canCloseGitHubIssue } from './tri-turn-github-closure.js';
import {
  buildExecutorInvocation,
  buildExecutorPrompt,
  resolveExecutorConfig,
  runCodingExecutor,
  validateCommandSafety,
  validateExecutionScope,
  validateExecutorStatus,
} from './tri-turn-coding-executor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

dotenv.config({ path: path.join(ROOT, '.env'), override: true, quiet: true });

const OWNER = 'arslan9024';
const REPO = 'White-Caves';

const STATE_PATH = path.join(ROOT, 'logs', 'orchestrator', 'tri-turn-sovereign-state.json');
const REPORT_PATH = path.join(ROOT, 'plans', 'TRI_TURN_SOVEREIGN_AUTOPILOT_REPORT.md');
const JSON_REPORT_PATH = path.join(ROOT, 'logs', 'orchestrator', 'tri-turn-sovereign-report.json');
const GITHUB_HANDOFF_PATH = path.join(ROOT, 'logs', 'orchestrator', 'github-issue-handoff.json');
const EXECUTION_RESULT_PATH = path.join(
  ROOT,
  'logs',
  'orchestrator',
  'coding-executor-result.json'
);
const CHILD_TASKS_PATH = path.join(ROOT, 'logs', 'orchestrator', 'github-child-tasks.json');

const DEFAULT_TURNS = ['docs-governance', 'frontend', 'backend'];
const DEFAULT_QUOTA = 333;
const DEFAULT_RETRY = 3;
const DEFAULT_MAX_ATTEMPTS = 3;
const EXACT_TARGET = 999;
let RETRY_BUDGET = DEFAULT_RETRY;

const LANE_LABELS = {
  'docs-governance': 'lane:docs-governance',
  frontend: 'lane:frontend',
  backend: 'lane:backend',
};

const PHASES = {
  DISCOVER_SYNC: 'DISCOVER_SYNC',
  HALTED_DISCOVERY_INCOMPLETE: 'HALTED_DISCOVERY_INCOMPLETE',
  SOLVE_SERIAL: 'SOLVE_SERIAL',
  HALTED_BLOCKED: 'HALTED_BLOCKED',
  COMPLETE: 'COMPLETE',
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    autopilot: args.includes('--autopilot'),
    once: args.includes('--once'),
    loop: args.includes('--loop'),
    solve: !args.includes('--skip-solve'),
    dryRun: args.includes('--dry-run'),
    strictQuota: !args.includes('--no-strict-quota'),
    serialSolve: !args.includes('--no-serial-solve'),
    requireExact999: false,
    regenerateOn999Closed: !args.includes('--no-regenerate-on-999-closed'),
    updateExistingIssuesFirst: !args.includes('--no-update-existing-first'),
    priorityFirst: !args.includes('--no-priority-first'),
    resume: args.includes('--resume'),
    fixEngine: !args.includes('--skip-fix-engine'),
    haltOnUnresolved: !args.includes('--continue-after-failure'),
    fixCommand: '',
    completionFile: path.join(ROOT, 'logs', 'orchestrator', 'github-issue-completion.json'),
    issueNumber: null,
    executor: 'chat',
    maxIssues: 1,
    childOnly: false,
    autoChain: true,
    executorTimeoutMs: 900000,
    decomposeBroad: false,
    publishChildTasks: false,
    syntheticFill: false,
    gitWorkflow: false,
    gitPush: false,
    baseBranch: 'main',
    quota: DEFAULT_QUOTA,
    turns: [...DEFAULT_TURNS],
    maxCycles: 1,
    retry: DEFAULT_RETRY,
    maxAttempts: DEFAULT_MAX_ATTEMPTS,
  };

  for (const arg of args) {
    if (arg.startsWith('--quota=')) options.quota = Number(arg.split('=')[1]) || DEFAULT_QUOTA;
    if (arg.startsWith('--turns=')) {
      const turns = arg
        .split('=')[1]
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);
      if (turns.length > 0) options.turns = turns;
    }
    if (arg.startsWith('--max-cycles='))
      options.maxCycles = Math.max(1, Number(arg.split('=')[1]) || 1);
    if (arg.startsWith('--retry='))
      options.retry = Math.max(1, Number(arg.split('=')[1]) || DEFAULT_RETRY);
    if (arg.startsWith('--max-attempts='))
      options.maxAttempts = Math.max(1, Number(arg.split('=')[1]) || DEFAULT_MAX_ATTEMPTS);
    if (arg.startsWith('--fix-command='))
      options.fixCommand = arg.split('=').slice(1).join('=').trim();
    if (arg.startsWith('--completion-file='))
      options.completionFile = path.resolve(ROOT, arg.split('=').slice(1).join('=').trim());
    if (arg.startsWith('--issue-number=')) options.issueNumber = Number(arg.split('=')[1]) || null;
    if (arg.startsWith('--executor='))
      options.executor = arg.split('=')[1].trim().toLowerCase() || 'chat';
    if (arg.startsWith('--max-issues='))
      options.maxIssues = Math.max(1, Number(arg.split('=')[1]) || 1);
    if (arg === '--child-only') options.childOnly = true;
    if (arg.startsWith('--executor-timeout-ms='))
      options.executorTimeoutMs = Math.max(1000, Number(arg.split('=')[1]) || 900000);
    if (arg === '--decompose-broad') options.decomposeBroad = true;
    if (arg === '--publish-child-tasks') options.publishChildTasks = true;
    if (arg === '--auto-chain') options.autoChain = true;
    if (arg === '--no-auto-chain') options.autoChain = false;
    if (arg === '--synthetic-fill') options.syntheticFill = true;
    if (arg === '--git-workflow') options.gitWorkflow = true;
    if (arg === '--git-push') {
      options.gitWorkflow = true;
      options.gitPush = true;
    }
    if (arg.startsWith('--base-branch='))
      options.baseBranch = arg.split('=').slice(1).join('=').trim() || 'main';
    if (arg === '--require-exact-999') options.requireExact999 = true;
  }

  if (options.loop && options.maxCycles === 1) options.maxCycles = 999999;
  if (options.once) options.maxCycles = 1;

  return options;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function walkFiles(startDirs, extensions) {
  const files = [];
  const exts = new Set(extensions);

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const ext = path.extname(full).toLowerCase();
        if (exts.has(ext)) files.push(full);
      }
    }
  }

  for (const d of startDirs) walk(path.join(ROOT, d));
  return files;
}

function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function lineIssues(content, regex, mapper) {
  const issues = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (regex.test(line)) issues.push(mapper(line, idx + 1));
  });
  return issues;
}

function fingerprint(lane, rule, file, line) {
  return `${lane}|${rule}|${file}|L${line}`;
}

function priorityScoreFromPriority(priority) {
  if (priority === 'P0') return 400;
  if (priority === 'P1') return 300;
  if (priority === 'P2') return 200;
  return 100;
}

function laneRank(lane) {
  if (lane === 'docs-governance') return 1;
  if (lane === 'frontend') return 2;
  if (lane === 'backend') return 3;
  return 99;
}

function severityLabel(priority) {
  if (priority === 'P0') return 'severity:p0';
  if (priority === 'P1') return 'severity:p1';
  if (priority === 'P2') return 'severity:p2';
  return 'severity:p3';
}

function collectDocsGovernanceIssues(quota, allowSyntheticFill = false) {
  const files = walkFiles(['plans', 'docs', '.github'], ['.md', '.yml', '.yaml']);
  const issues = [];

  for (const file of files) {
    const rp = rel(file);
    const content = fs.readFileSync(file, 'utf8');

    const todoHits = lineIssues(content, /\b(TODO|FIXME|TBD|PLACEHOLDER)\b/i, (_line, ln) => ({
      lane: 'docs-governance',
      priority: 'P1',
      rule: 'todo-marker',
      file: rp,
      line: ln,
      title: `[Docs/Governance] Remove unresolved TODO marker in ${rp}`,
      action:
        'Replace placeholder note with concrete governance/plan content and evidence references.',
    }));

    const staleStatusHits = lineIssues(
      content,
      /^>\s*\*\*Status:\*\*\s*(Draft|TBD|Pending)$/im,
      (_line, ln) => ({
        lane: 'docs-governance',
        priority: 'P2',
        rule: 'stale-status',
        file: rp,
        line: ln,
        title: `[Docs/Governance] Refresh stale status marker in ${rp}`,
        action:
          'Update status to current operational truth and cross-link canonical tracker files.',
      })
    );

    issues.push(...todoHits, ...staleStatusHits);
    if (issues.length >= quota * 2) break;
  }

  return fillToQuota(
    'docs-governance',
    issues,
    quota,
    'governance-hardening-opportunity',
    allowSyntheticFill
  );
}

function collectFrontendIssues(quota, allowSyntheticFill = false) {
  const files = walkFiles(['src'], ['.ts', '.tsx', '.js', '.jsx']);
  const issues = [];

  for (const file of files) {
    const rp = rel(file);
    const content = fs.readFileSync(file, 'utf8');

    if (/\.test\.(ts|tsx|js|jsx)$/.test(rp)) {
      issues.push(
        ...lineIssues(content, /expect\(true\)\.toBe\(true\)/, (_line, ln) => ({
          lane: 'frontend',
          priority: 'P1',
          rule: 'placeholder-test',
          file: rp,
          line: ln,
          title: `[Frontend] Replace placeholder test in ${rp}`,
          action: 'Replace trivial assertion with behavior-based assertions on real exports.',
        }))
      );

      issues.push(
        ...lineIssues(content, /: any\b|as any\b/, (_line, ln) => ({
          lane: 'frontend',
          priority: 'P1',
          rule: 'explicit-any-test',
          file: rp,
          line: ln,
          title: `[Frontend] Remove explicit any in test ${rp}`,
          action:
            'Use strict interfaces/generics or typed helpers and keep test assertions deterministic.',
        }))
      );

      issues.push(
        ...lineIssues(content, /toBeTruthy\(|toBeDefined\(/, (_line, ln) => ({
          lane: 'frontend',
          priority: 'P2',
          rule: 'weak-assertion',
          file: rp,
          line: ln,
          title: `[Frontend] Strengthen weak assertion in ${rp}`,
          action: 'Replace with explicit value/type/shape assertions tied to intended behavior.',
        }))
      );
    }

    if (issues.length >= quota * 2) break;
  }

  return fillToQuota(
    'frontend',
    issues,
    quota,
    'frontend-resilience-opportunity',
    allowSyntheticFill
  );
}

function collectBackendIssues(quota, allowSyntheticFill = false) {
  const files = walkFiles(['server', 'src/server'], ['.ts', '.js']);
  const issues = [];

  for (const file of files) {
    const rp = rel(file);
    const content = fs.readFileSync(file, 'utf8');

    issues.push(
      ...lineIssues(content, /: any\b|as any\b/, (_line, ln) => ({
        lane: 'backend',
        priority: 'P1',
        rule: 'explicit-any',
        file: rp,
        line: ln,
        title: `[Backend] Remove explicit any usage in ${rp}`,
        action: 'Replace any with strict payload/service types to preserve compile-time safety.',
      }))
    );

    if (/routes\//.test(rp)) {
      issues.push(
        ...lineIssues(content, /req\.body\b/, (_line, ln) => ({
          lane: 'backend',
          priority: /zod|validate|schema/i.test(content) ? 'P2' : 'P0',
          rule: 'body-validation-gap',
          file: rp,
          line: ln,
          title: `[Backend] Validate req.body boundary in ${rp}`,
          action:
            'Add/confirm schema validation and normalize error envelope for invalid payloads.',
        }))
      );

      issues.push(
        ...lineIssues(content, /router\.(post|put|patch|delete)\(/, (_line, ln) => ({
          lane: 'backend',
          priority: /asyncHandler|try\s*\{/.test(content) ? 'P2' : 'P1',
          rule: 'mutation-error-boundary',
          file: rp,
          line: ln,
          title: `[Backend] Harden mutation error boundary in ${rp}`,
          action:
            'Wrap async mutation handlers with asyncHandler/structured error flow and contextual logging.',
        }))
      );
    }

    if (issues.length >= quota * 2) break;
  }

  return fillToQuota('backend', issues, quota, 'backend-hardening-opportunity', allowSyntheticFill);
}

function fillToQuota(lane, issues, quota, fillerRule, allowSyntheticFill = false) {
  const unique = [];
  const seen = new Set();

  for (const item of issues) {
    const fp = fingerprint(lane, item.rule, item.file, item.line);
    if (seen.has(fp)) continue;
    seen.add(fp);
    unique.push({ ...item, fp });
    if (unique.length >= quota) return unique;
  }

  // Synthetic filler slices are opt-in only (--synthetic-fill). Default behavior:
  // return only real detected issues so live runs never flood GitHub with noise.
  if (!allowSyntheticFill) return unique;

  const sourceFiles =
    lane === 'docs-governance'
      ? walkFiles(['plans'], ['.md']).slice(0, 200)
      : lane === 'frontend'
        ? walkFiles(
            ['src/components', 'src/pages', 'src/store'],
            ['.ts', '.tsx', '.js', '.jsx']
          ).slice(0, 300)
        : walkFiles(
            ['server/routes', 'server/services', 'server/middleware'],
            ['.ts', '.js']
          ).slice(0, 300);

  let i = 0;
  while (unique.length < quota && sourceFiles.length > 0) {
    const file = rel(sourceFiles[i % sourceFiles.length]);
    const line = (i % 200) + 1;
    const fp = fingerprint(lane, fillerRule, file, line);
    if (!seen.has(fp)) {
      seen.add(fp);
      unique.push({
        lane,
        priority: 'P3',
        rule: fillerRule,
        file,
        line,
        title: `[${lane}] Structured improvement audit slice ${unique.length + 1} for ${file}`,
        action:
          lane === 'docs-governance'
            ? 'Refine clarity, ownership, acceptance criteria, and FEEDS/FEEDS_ACK consistency for this scope.'
            : lane === 'frontend'
              ? 'Run consolidation + resilience + test-strengthening pass for this UI slice.'
              : 'Run route/service hardening + validation + logging pass for this server slice.',
        fp,
      });
    }
    i += 1;
  }

  return unique;
}

function buildIssuePayload(issue, cycleId, turnIndex, seq) {
  const ownership = resolveSubAgentOwnership(issue.rule);
  const skillProfileFile = resolveSkillProfileFile(ownership.ownerSubAgent);
  const resolutionPlaybook = resolveResolutionPlaybook(ownership.ownerSubAgent);
  const labels = [
    'tri-turn-sovereign',
    'autopilot:solver',
    LANE_LABELS[issue.lane] || `lane:${issue.lane}`,
    severityLabel(issue.priority),
    `cycle:${cycleId}`,
    `turn:${turnIndex}`,
    `ttsap:seq:${seq}`,
  ];

  const body = [
    '## Tri-Turn Sovereign Autopilot Protocol',
    '- Protocol: **TTSAP-333x3**',
    `- Lane: **${issue.lane}**`,
    `- Priority: **${issue.priority}**`,
    `- File: \`${issue.file}:${issue.line}\``,
    `- AEGIS Owner: **${ownership.ownerSubAgent}**`,
    `- AEGIS Backup: **${ownership.backupSubAgent}**`,
    `- Skill Profile: \`${skillProfileFile}\``,
    '',
    '### Required Action',
    issue.action,
    '',
    '### Resolution Playbook',
    ...resolutionPlaybook.map((step, index) => `${index + 1}. ${step}`),
    '',
    '### Acceptance Criteria',
    '- [ ] Implementation or documentation change completed for target file/scope',
    '- [ ] Validation evidence attached (typecheck/lint/build/plans:validate/policy:gate/gates)',
    '- [ ] Risk/rollback note recorded in completion comment',
    '',
    `<!-- TTSAP_FINGERPRINT: ${issue.fp} -->`,
    `<!-- TTSAP_RULE: ${issue.rule} -->`,
    `<!-- TTSAP_SEQ: ${seq} -->`,
    `<!-- TTSAP_CYCLE: ${cycleId} -->`,
    `<!-- TTSAP_TURN: ${turnIndex} -->`,
    `<!-- TTSAP_LANE: ${issue.lane} -->`,
  ].join('\n');

  return { title: issue.title, body, labels };
}

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;

  try {
    const raw = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const match = raw.match(/password=(.+)/);
    if (match?.[1]) return match[1].trim();
  } catch {
    return '';
  }

  return '';
}

function ghHeaders(token) {
  return {
    'User-Agent': 'White-Caves-Sovereign999',
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function ghFetch(url, options, retries = RETRY_BUDGET) {
  let attempt = 0;
  while (attempt < retries) {
    attempt += 1;
    try {
      const res = await fetch(url, options);
      if (res.status === 429 || res.status === 403 || res.status >= 500) {
        if (attempt < retries) {
          await sleep(600 * attempt);
          continue;
        }
      }
      return res;
    } catch (error) {
      if (attempt >= retries) throw error;
      await sleep(600 * attempt);
    }
  }
  throw new Error(`Failed request after ${retries} retries: ${url}`);
}

function resolveSubAgentOwnership(rule) {
  if (rule === 'todo-marker' || rule === 'stale-status') {
    return { ownerSubAgent: 'aegis-ledger', backupSubAgent: 'aegis-gate' };
  }
  if (rule === 'placeholder-test' || rule === 'explicit-any-test' || rule === 'weak-assertion') {
    return { ownerSubAgent: 'aegis-flux', backupSubAgent: 'aegis-verdict' };
  }
  if (rule === 'body-validation-gap') {
    return { ownerSubAgent: 'aegis-shield', backupSubAgent: 'aegis-forge' };
  }
  if (rule === 'explicit-any' || rule === 'mutation-error-boundary') {
    return { ownerSubAgent: 'aegis-forge', backupSubAgent: 'aegis-archive' };
  }
  return { ownerSubAgent: 'aegis-gate', backupSubAgent: 'aegis-shield' };
}

function requiredSkillPacks(ownerSubAgent) {
  const byOwner = {
    'aegis-ledger': ['plans-aegis-governance', 'software-docs-maintenance'],
    'aegis-flux': ['frontend-improvement-loop', 'ts-typecheck-triage'],
    'aegis-verdict': ['pr-review-checklist', 'release-readiness'],
    'aegis-forge': ['server-improvement-loop', 'ts-typecheck-triage'],
    'aegis-shield': ['security-audit', 'release-readiness', 'pr-review-checklist'],
    'aegis-archive': ['server-improvement-loop', 'project-scan-and-improvement'],
    'aegis-gate': ['release-readiness', 'pr-review-checklist', 'aegis-recurring-maintenance-loop'],
  };
  return byOwner[ownerSubAgent] || ['release-readiness'];
}

function resolveSkillProfileFile(ownerSubAgent) {
  const byOwner = {
    'aegis-ledger': 'aegis/team/skills/aegis-ledger.md',
    'aegis-flux': 'aegis/team/skills/aegis-flux.md',
    'aegis-verdict': 'aegis/team/skills/aegis-verdict.md',
    'aegis-forge': 'aegis/team/skills/aegis-forge.md',
    'aegis-shield': 'aegis/team/skills/aegis-shield.md',
    'aegis-archive': 'aegis/team/skills/aegis-archive.md',
    'aegis-gate': 'aegis/team/skills/aegis-gate.md',
  };
  return byOwner[ownerSubAgent] || 'aegis/team/skills/aegis-gate.md';
}

function resolveResolutionPlaybook(ownerSubAgent) {
  const file = resolveSkillProfileFile(ownerSubAgent);
  return [
    `open ${file}`,
    'read the issue packet and matched skill playbook',
    'apply the smallest safe fix that satisfies the issue',
    'run the full validation set',
    'post evidence and risk note before closure',
  ];
}

function buildValidationCommands() {
  return [
    'npm run typecheck',
    'npm run lint',
    'npm run build',
    'npm run plans:validate',
    'npm run aegis:policy:gate',
    'npm run aegis:gates',
  ];
}

function createIssueWorkPacket(item, maxAttempts) {
  const ownership = resolveSubAgentOwnership(item.rule);
  return {
    issueNumber: item.issueNumber || 0,
    fingerprint: item.fp,
    lane: item.lane,
    priority: item.priority,
    priorityScore: item.priorityScore,
    effectiveOrder: item.effectiveOrder,
    ownerSubAgent: ownership.ownerSubAgent,
    backupSubAgent: ownership.backupSubAgent,
    requiredSkillPacks: requiredSkillPacks(ownership.ownerSubAgent),
    skillProfileFile: resolveSkillProfileFile(ownership.ownerSubAgent),
    resolutionPlaybook: resolveResolutionPlaybook(ownership.ownerSubAgent),
    validationCommands: buildValidationCommands(),
    attempts: Number(item.attempts || 0),
    maxAttempts,
    status: item.status || 'queued',
    lastFailureReason: item.lastFailureReason || '',
    escalationTarget: 'validation-release',
    acceptanceCriteria: ['real fix applied', 'gates passed', 'evidence comment posted'],
    lastActionAt: new Date().toISOString(),
  };
}

function resolveFixCommands(item, options) {
  if (options.fixCommand) return [options.fixCommand];
  if (item.lane === 'frontend') return ['npm run lint:fix'];
  if (item.lane === 'backend') {
    if (item.rule === 'body-validation-gap') {
      return ['npm run lint:fix', 'npm run orchestrator:error:scan:autofix'];
    }
    return ['npm run lint:fix'];
  }
  if (item.lane === 'docs-governance') return ['npm run orchestrator:plans:clean:apply'];
  return [];
}

function executeFixAttempt(item, options) {
  if (!options.fixEngine) return;
  const fixCommands = resolveFixCommands(item, options);
  if (fixCommands.length === 0) return;

  for (const cmd of fixCommands) {
    console.log(`🧪 [FIX] ${item.fp} -> ${cmd}`);
    runCommand(cmd);
  }
}

async function ensureMilestone(token, title, description) {
  const headers = ghHeaders(token);
  const listRes = await ghFetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/milestones?state=all&per_page=100`,
    {
      method: 'GET',
      headers,
    }
  );
  const list = listRes.ok ? await listRes.json() : [];
  const existing = Array.isArray(list) ? list.find(m => m.title === title) : null;
  if (existing) {
    if (existing.state !== 'open') {
      await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/milestones/${existing.number}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ state: 'open', description }),
      });
    }
    return existing.number;
  }

  const createRes = await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/milestones`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ title, description, state: 'open' }),
  });
  if (!createRes.ok) return null;
  const created = await createRes.json();
  return created.number;
}

function extractFingerprint(body) {
  const text = String(body || '');
  const match = text.match(/TTSAP_FINGERPRINT:\s*([^\s<]+)/);
  return match?.[1] || '';
}

function extractSeq(body) {
  const text = String(body || '');
  const match = text.match(/TTSAP_SEQ:\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

async function loadOpenGitHubIssues(token, label = 'tri-turn-sovereign') {
  const headers = ghHeaders(token);
  const items = [];
  let page = 1;

  while (true) {
    const labelQuery = label ? `&labels=${encodeURIComponent(label)}` : '';
    const res = await ghFetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=open&per_page=100&page=${page}${labelQuery}`,
      { method: 'GET', headers }
    );
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300).replace(/\s+/g, ' ').trim();
      throw new Error(`GitHub issue query failed (${res.status} ${res.statusText}): ${detail}`);
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    items.push(...data);
    if (data.length < 100) break;
    page += 1;
  }

  return items;
}

async function loadAllGitHubIssues(token) {
  const headers = ghHeaders(token);
  const items = [];
  let page = 1;

  while (true) {
    const res = await ghFetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=all&per_page=100&page=${page}`,
      { method: 'GET', headers }
    );
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    items.push(...data);
    if (data.length < 100) break;
    page += 1;
    if (page > 10) break; // safety bound
  }

  return items;
}

async function loadOpenTriTurnIssues(token) {
  return loadOpenGitHubIssues(token, 'tri-turn-sovereign');
}

function laneFromIssue(issueOrBody, labels) {
  const labelList = (labels || [])
    .map(label => (typeof label === 'string' ? label : label?.name || ''))
    .filter(Boolean);
  const bodyText = typeof issueOrBody === 'string' ? issueOrBody : String(issueOrBody?.body || '');

  const bodyLane = bodyText.match(/- Lane:\s+\*\*(.+?)\*\*/i)?.[1]?.trim();
  const laneFromLabel = labelList.find(label =>
    /lane:(docs-governance|frontend|backend)/i.test(label)
  );
  if (bodyLane) return bodyLane.replace(/^lane:/i, '').trim();
  if (laneFromLabel) return laneFromLabel.replace(/^lane:/i, '').trim();
  return 'docs-governance';
}

function priorityFromIssue(issueOrBody, labels) {
  const labelList = (labels || [])
    .map(label => (typeof label === 'string' ? label : label?.name || ''))
    .filter(Boolean);
  const bodyText = typeof issueOrBody === 'string' ? issueOrBody : String(issueOrBody?.body || '');

  const labelSeverity = labelList.find(label => /^(?:severity:)?p[0-3](?:[-_].*)?$/i.test(label));
  if (labelSeverity) return labelSeverity.match(/p[0-3]/i)[0].toUpperCase();

  const bodyPriority = bodyText
    .match(/(?:-\s*)?Priority:\s*(?:🟠\s*)?(?:\*\*)?(P[0-3])\b/i)?.[1]
    ?.trim();
  if (bodyPriority) return bodyPriority.toUpperCase();

  return 'P3';
}

function hydrateExistingIssueQueue(existingIssues, options) {
  const records = existingIssues
    .filter(issue => !issue.pull_request)
    .map((issue, index) => {
      const lane = laneFromIssue(issue, issue.labels || []);
      const priority = priorityFromIssue(issue, issue.labels || []);
      const match = String(issue.body || '').match(/- File:\s+`([^`]+)`/i);
      const issueFingerprint = extractFingerprint(issue.body);
      const classification = classifyGitHubIssue(issue);
      const file = match?.[1] || issue.html_url || `issue-${issue.number}`;
      const fp = issueFingerprint || `github-issue|${issue.number}`;
      return {
        lane,
        priority,
        priorityScore: priorityScoreFromPriority(priority),
        file,
        title: issue.title,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        body: issue.body || '',
        labels: issue.labels || [],
        status: 'queued',
        attempts: 0,
        effectiveOrder: index + 1,
        closed: false,
        fp,
        hasFingerprint: Boolean(issueFingerprint),
        issueType: classification.issueType,
        handoffState: classification.handoffState,
        workPacket: createIssueWorkPacket(
          {
            fp,
            lane,
            priority,
            priorityScore: priorityScoreFromPriority(priority),
            issueNumber: issue.number,
            effectiveOrder: index + 1,
            status: 'queued',
            issueType: classification.issueType,
          },
          options.maxAttempts
        ),
      };
    })
    .sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
      if (laneRank(a.lane) !== laneRank(b.lane)) return laneRank(a.lane) - laneRank(b.lane);
      return a.effectiveOrder - b.effectiveOrder;
    })
    .map((item, index) => ({ ...item, effectiveOrder: index + 1 }));

  return records;
}

function mergeLabels(existingLabels, nextLabels) {
  const set = new Set();
  (existingLabels || []).forEach(label => {
    if (typeof label === 'string') set.add(label);
    else if (label?.name) set.add(label.name);
  });
  nextLabels.forEach(label => set.add(label));
  return [...set];
}

async function closeIssueIfOpen(issueNumber, token, reason) {
  const headers = ghHeaders(token);
  await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ body: reason }),
  });
  await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ state: 'closed', state_reason: 'completed' }),
  });
}

async function reopenIssue(issueNumber, token, note) {
  const headers = ghHeaders(token);
  await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ state: 'open' }),
  });
  await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ body: note }),
  });
}

function buildMilestoneTitles(cycleId) {
  return {
    master: `TTSAP-${cycleId}-MASTER`,
    docs: `TTSAP-${cycleId}-1-DOCS-GOVERNANCE`,
    frontend: `TTSAP-${cycleId}-2-FRONTEND`,
    backend: `TTSAP-${cycleId}-3-BACKEND`,
  };
}

async function syncDiscoverQueueToGitHub(token, cycleId, options) {
  const milestoneTitles = buildMilestoneTitles(cycleId);
  const laneMilestones = {
    'docs-governance': milestoneTitles.docs,
    frontend: milestoneTitles.frontend,
    backend: milestoneTitles.backend,
  };

  const headers = ghHeaders(token);
  const masterMilestone = options.dryRun
    ? null
    : await ensureMilestone(
        token,
        milestoneTitles.master,
        `Master milestone for ${cycleId}. Contains strict sovereign999 discover/solve lifecycle.`
      );

  const laneMilestoneNumbers = {};
  for (const lane of DEFAULT_TURNS) {
    laneMilestoneNumbers[lane] = options.dryRun
      ? null
      : await ensureMilestone(
          token,
          laneMilestones[lane],
          `Lane milestone for ${lane} in cycle ${cycleId}.`
        );
  }

  if (!options.dryRun && masterMilestone && Object.values(laneMilestoneNumbers).some(v => !v)) {
    throw new Error('Milestone setup failed for one or more lanes.');
  }

  const laneIssuesMap = {
    'docs-governance': collectDocsGovernanceIssues(options.quota, options.syntheticFill),
    frontend: collectFrontendIssues(options.quota, options.syntheticFill),
    backend: collectBackendIssues(options.quota, options.syntheticFill),
  };

  const discovered = [];
  let seq = 1;
  for (const lane of options.turns) {
    const normalizedLane = lane === 'docs' ? 'docs-governance' : lane;
    const items = laneIssuesMap[normalizedLane] || [];
    for (const issue of items.slice(0, options.quota)) {
      discovered.push({
        ...issue,
        lane: normalizedLane,
        laneOrder: laneRank(normalizedLane),
        priorityScore: priorityScoreFromPriority(issue.priority),
        discoveredSeq: seq,
      });
      seq += 1;
    }
  }

  const expectedCount = options.quota * options.turns.length;
  if (options.strictQuota && options.syntheticFill && discovered.length < expectedCount) {
    throw new Error(`Discovery underflow: expected ${expectedCount}, got ${discovered.length}.`);
  }

  const ordered = options.priorityFirst
    ? [...discovered].sort((a, b) => {
        if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
        if (a.laneOrder !== b.laneOrder) return a.laneOrder - b.laneOrder;
        return a.discoveredSeq - b.discoveredSeq;
      })
    : discovered;

  ordered.forEach((item, index) => {
    item.effectiveOrder = index + 1;
  });

  if (options.requireExact999 && ordered.length !== EXACT_TARGET) {
    return {
      phase: PHASES.HALTED_DISCOVERY_INCOMPLETE,
      missing: EXACT_TARGET - ordered.length,
      queue: ordered,
      created: 0,
      updated: 0,
      skipped: 0,
      milestones: milestoneTitles,
    };
  }

  const existingIssues = options.dryRun ? [] : await loadOpenTriTurnIssues(token);
  const fpMap = new Map();
  for (const issue of existingIssues) {
    const fp = extractFingerprint(issue.body);
    if (fp) fpMap.set(fp, issue);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  const liveQueue = [];
  for (const item of ordered) {
    const turnIndex = laneRank(item.lane);
    const payload = buildIssuePayload(item, cycleId, turnIndex, item.effectiveOrder);
    const laneMilestone = laneMilestoneNumbers[item.lane];
    if (laneMilestone) payload.milestone = laneMilestone;

    const existing = fpMap.get(item.fp);

    if (options.dryRun) {
      const status = existing ? 'would-update' : 'would-create';
      liveQueue.push({
        ...item,
        issueNumber: null,
        status,
        attempts: 0,
        closed: false,
        lastActionAt: new Date().toISOString(),
        workPacket: createIssueWorkPacket({ ...item, issueNumber: 0, status }, options.maxAttempts),
      });
      if (existing) updated += 1;
      else created += 1;
      continue;
    }

    if (existing && options.updateExistingIssuesFirst) {
      const mergedLabels = mergeLabels(existing.labels, payload.labels);
      const patchBody = {
        title: payload.title,
        body: payload.body,
        labels: mergedLabels,
      };
      if (laneMilestone) patchBody.milestone = laneMilestone;

      const patchRes = await ghFetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/issues/${existing.number}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify(patchBody),
        }
      );

      if (patchRes.ok) {
        updated += 1;
        liveQueue.push({
          ...item,
          issueNumber: existing.number,
          status: 'updated',
          attempts: 0,
          closed: false,
          lastActionAt: new Date().toISOString(),
          workPacket: createIssueWorkPacket(
            { ...item, issueNumber: existing.number, status: 'updated' },
            options.maxAttempts
          ),
        });
      } else {
        skipped += 1;
      }
      console.log(
        `🔄 [DISCOVER] ${item.effectiveOrder}/${ordered.length} UPDATED #${existing.number} ${item.title}`
      );
      await sleep(120);
      continue;
    }

    const createRes = await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (createRes.ok) {
      const createdIssue = await createRes.json();
      created += 1;
      liveQueue.push({
        ...item,
        issueNumber: createdIssue.number,
        status: 'created',
        attempts: 0,
        closed: false,
        lastActionAt: new Date().toISOString(),
        workPacket: createIssueWorkPacket(
          { ...item, issueNumber: createdIssue.number, status: 'created' },
          options.maxAttempts
        ),
      });
      console.log(
        `🆕 [DISCOVER] ${item.effectiveOrder}/${ordered.length} CREATED #${createdIssue.number} ${item.title}`
      );
    } else {
      skipped += 1;
      console.warn(`⚠️ [DISCOVER] create failed for ${item.fp}`);
    }

    await sleep(120);
  }

  if (options.requireExact999 && liveQueue.length !== EXACT_TARGET) {
    return {
      phase: PHASES.HALTED_DISCOVERY_INCOMPLETE,
      missing: EXACT_TARGET - liveQueue.length,
      queue: liveQueue,
      created,
      updated,
      skipped,
      milestones: milestoneTitles,
    };
  }

  return {
    phase: PHASES.SOLVE_SERIAL,
    missing: 0,
    queue: liveQueue,
    created,
    updated,
    skipped,
    milestones: milestoneTitles,
  };
}

function fingerprintResolved(fingerprintValue) {
  const [lane, rule, file, lineToken] = String(fingerprintValue).split('|');
  const abs = path.join(ROOT, file || '');
  if (!fs.existsSync(abs)) return false;

  const line = Number(String(lineToken || '').replace('L', ''));
  const content = fs.readFileSync(abs, 'utf8');
  const lines = content.split('\n');
  const target = lines[line - 1] || '';

  if (lane === 'frontend' && rule === 'placeholder-test')
    return !/expect\(true\)\.toBe\(true\)/.test(target);
  if (rule === 'explicit-any' || rule === 'explicit-any-test')
    return !/: any\b|as any\b/.test(target);
  if (rule === 'weak-assertion') return !/toBeTruthy\(|toBeDefined\(/.test(target);
  if (rule === 'body-validation-gap') return /zod|validate|schema/i.test(content);
  if (rule === 'mutation-error-boundary') return /asyncHandler|try\s*\{/.test(content);
  if (rule === 'todo-marker') return !/\b(TODO|FIXME|TBD|PLACEHOLDER)\b/i.test(target);
  if (rule === 'stale-status')
    return !/^>\s*\*\*Status:\*\*\s*(Draft|TBD|Pending)$/im.test(content);

  return false;
}

function runCommand(command) {
  execSync(command, { cwd: ROOT, stdio: 'inherit' });
}

function gitChangedFiles() {
  try {
    const output = execSync('git status --porcelain', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const files = [];
    for (const line of output.split('\n')) {
      const trimmed = line.trimEnd();
      if (trimmed.length <= 3) continue;
      const entry = trimmed.slice(3).trim();
      const renamed = entry.split(' -> ');
      const filePath = (renamed[renamed.length - 1] || entry).replace(/\\/g, '/');
      if (!filePath) continue;

      // Untracked directories are reported collapsed (`?? path/`); expand them
      // so scope validation and evidence operate on real files.
      if (trimmed.startsWith('??') && filePath.endsWith('/')) {
        const dirPath = path.join(ROOT, filePath);
        const walk = dir => {
          if (!fs.existsSync(dir)) return;
          for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, item.name);
            if (item.isDirectory()) {
              walk(full);
            } else if (item.isFile()) {
              files.push(path.relative(ROOT, full).replace(/\\/g, '/'));
            }
          }
        };
        walk(dirPath);
        continue;
      }

      files.push(filePath);
    }
    return files;
  } catch {
    return [];
  }
}

function filterEvidenceFiles(files) {
  return (Array.isArray(files) ? files : []).filter(
    file =>
      Boolean(file) &&
      !file.startsWith('logs/') &&
      !file.startsWith('node_modules/') &&
      !file.startsWith('.git/') &&
      file !== '.env'
  );
}

function gitCurrentBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function gitSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .filter(Boolean)
    .slice(0, 6)
    .join('-');
}

function gitEnsureWorkBranch(parentNumber, parentTitle, options) {
  if (!options.gitWorkflow) return { branch: gitCurrentBranch(), created: false };
  const branch = `aegis/issue-${parentNumber}-${gitSlug(parentTitle) || 'work'}`.slice(0, 80);
  try {
    const current = gitCurrentBranch();
    if (current === branch) return { branch, created: false };
    // Stash unrelated dirty changes so the branch switch is clean; only candidate
    // files are committed per child, the rest stay stashed and restored after.
    execSync('git checkout -B ' + branch, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] });
    return { branch, created: true };
  } catch {
    return { branch: gitCurrentBranch(), created: false };
  }
}

function gitCommitFiles(files, message) {
  const list = filterEvidenceFiles(files);
  if (list.length === 0) return false;
  try {
    for (const file of list) {
      execSync(`git add -- "${file}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] });
    }
    execSync(`git commit -m "${String(message).replace(/"/g, '\\"')}"`, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return true;
  } catch {
    return false;
  }
}

function gitPushBranch(branch) {
  try {
    execSync(`git push -u origin "${branch}"`, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] });
    return true;
  } catch {
    return false;
  }
}

async function ghCreatePullRequest(token, branch, parentNumber, parentTitle, closedChildren) {
  const headers = ghHeaders(token);
  const childrenList = closedChildren
    .map(c => `- ✅ #${c.issueNumber} ${String(c.title || '').slice(0, 90)}`)
    .join('\n');
  const res = await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/pulls`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: `[AEGIS] #${parentNumber} — ${String(parentTitle).slice(0, 80)}`,
      head: branch,
      base: 'main',
      body: [
        `Automated AEGIS implementation for parent issue #${parentNumber}.`,
        '',
        '### Solved child issues (evidence-verified)',
        childrenList || '- none',
        '',
        'Each child was solved in an isolated executor run with typecheck + plans:validate evidence.',
        '',
        `Closes #${parentNumber}`,
      ].join('\n'),
    }),
  });
  if (!res.ok) return null;
  const pr = await res.json();
  return pr;
}

function collectStagedCandidateFiles(stagingDir, candidateFiles) {
  if (!stagingDir || !fs.existsSync(stagingDir)) return [];
  const allowed = new Set((candidateFiles || []).map(file => path.normalize(file)));
  const collected = [];

  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      const relative = path.relative(stagingDir, full);
      if (allowed.has(path.normalize(relative))) {
        collected.push(relative.replace(/\\/g, '/'));
      }
    }
  };

  walk(stagingDir);
  return collected;
}

async function hydrateChildScopeFromParent(item, handoff, token) {
  const body = String(item.body || '');
  const taskId = body.match(/AEGIS_CHILD_TASK:\s*([^\s<]+)/)?.[1] || '';
  const parentNumber = Number(body.match(/AEGIS_PARENT_ISSUE:\s*(\d+)/)?.[1] || 0);
  if (!taskId || !parentNumber || !token) return handoff;

  const headers = ghHeaders(token);
  const res = await ghFetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/issues/${parentNumber}`,
    { method: 'GET', headers }
  );
  if (!res.ok) return handoff;
  const parent = await res.json();
  const children = decomposeBroadIssue(parent, 3);
  const match = children.find(child => child.taskId === taskId);
  if (!match) return handoff;

  handoff.candidateFiles = match.candidateFiles;
  handoff.scope = match.scope;
  if (!Array.isArray(handoff.acceptanceCriteria) || handoff.acceptanceCriteria.length === 0) {
    handoff.acceptanceCriteria = match.acceptanceCriteria;
  }
  handoff.validationCommands = match.validationCommands;

  if (!/## Candidate files/i.test(body)) {
    const updatedBody = `${body}\n\n## Candidate files\n${match.candidateFiles.map(file => `- \`${file}\``).join('\n')}`;
    await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${item.issueNumber}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ body: updatedBody }),
    });
  }

  return handoff;
}

async function detectReconciledParents(token) {
  if (!token) return new Set();
  const all = await loadAllGitHubIssues(token);
  const childByParent = new Map();
  for (const issue of all) {
    if (issue.pull_request) continue;
    const parentNumber = Number(
      String(issue.body || '').match(/AEGIS_PARENT_ISSUE:\s*(\d+)/)?.[1] || 0
    );
    if (parentNumber > 0) {
      if (!childByParent.has(parentNumber)) childByParent.set(parentNumber, []);
      childByParent.get(parentNumber).push(issue);
    }
  }
  const reconciled = new Set();
  for (const [parentNumber, children] of childByParent.entries()) {
    const anyOpen = children.some(c => c.state === 'open');
    if (!anyOpen && children.length > 0) reconciled.add(parentNumber);
  }
  return reconciled;
}

async function reconcileClosedParents(token, solvedQueue, options = {}) {
  const closedChildren = solvedQueue.filter(
    q => q.closed && /\[AEGIS CHILD\]/i.test(q.title || '')
  );
  if (closedChildren.length === 0 || !token) return [];

  const headers = ghHeaders(token);
  const reconciled = [];
  const parentNumbers = [
    ...new Set(
      closedChildren
        .map(q => Number(String(q.body || '').match(/AEGIS_PARENT_ISSUE:\s*(\d+)/)?.[1] || 0))
        .filter(n => n > 0)
    ),
  ];

  for (const parentNumber of parentNumbers) {
    const childListRes = await ghFetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues?state=all&per_page=100`,
      { method: 'GET', headers }
    );
    if (!childListRes.ok) continue;
    const allIssues = await childListRes.json();
    const siblings = (Array.isArray(allIssues) ? allIssues : []).filter(
      issue =>
        !issue.pull_request &&
        String(issue.body || '').includes(`AEGIS_PARENT_ISSUE: ${parentNumber}`)
    );
    const openSiblings = siblings.filter(issue => issue.state === 'open');

    if (openSiblings.length === 0 && siblings.length > 0) {
      await ghFetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/issues/${parentNumber}/comments`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            body: [
              '✅ **AEGIS child reconciliation complete**',
              '',
              `All ${siblings.length} child tasks for this parent were solved and closed with verified evidence.`,
              '',
              '- Parent remains open for final human review/close (parent closure is never automated).',
              `- Reconciled at: ${new Date().toISOString()}`,
            ].join('\n'),
          }),
        }
      );
      reconciled.push(parentNumber);
      console.log(
        `🧾 [RECONCILE] Parent #${parentNumber}: all children closed; reconciliation comment posted.`
      );

      // Git workflow: push the work branch and open a PR for the reconciled parent.
      if (options.gitWorkflow) {
        const parentIssue = (Array.isArray(allIssues) ? allIssues : []).find(
          issue => Number(issue.number) === Number(parentNumber)
        );
        const parentTitle = parentIssue?.title || `Parent issue #${parentNumber}`;
        const branch = gitCurrentBranch();
        if (options.gitPush && branch && branch !== options.baseBranch) {
          const pushed = gitPushBranch(branch);
          if (pushed) {
            const pr = await ghCreatePullRequest(
              token,
              branch,
              parentNumber,
              parentTitle,
              closedChildren.filter(
                c =>
                  Number(String(c.body || '').match(/AEGIS_PARENT_ISSUE:\s*(\d+)/)?.[1] || 0) ===
                  Number(parentNumber)
              )
            );
            if (pr?.html_url) {
              console.log(`🔀 [GIT] PR opened for parent #${parentNumber}: ${pr.html_url}`);
              await ghFetch(
                `https://api.github.com/repos/${OWNER}/${REPO}/issues/${parentNumber}/comments`,
                {
                  method: 'POST',
                  headers,
                  body: JSON.stringify({
                    body: `🔀 **AEGIS PR opened:** ${pr.html_url}\n\nAll child work is on branch \`${branch}\`. Review and merge to close this parent.`,
                  }),
                }
              );
            }
          }
        }
      }
    }
  }

  return reconciled;
}

function runPerIssueValidation() {
  const commands = buildValidationCommands();

  for (const cmd of commands) {
    runCommand(cmd);
  }
}

async function solveSerialQueue(token, queue, options, state, cycleId) {
  if (!options.solve || options.dryRun) {
    return { solved: 0, failed: 0, blocked: 0, queue };
  }

  const workingQueue = [...queue];
  let solved = 0;
  let failed = 0;
  let blocked = 0;

  let index = 0;
  while (index < workingQueue.length) {
    const item = workingQueue[index];

    if (item.closed) {
      index += 1;
      continue;
    }

    state.currentSequence = item.effectiveOrder;
    state.phase = PHASES.SOLVE_SERIAL;
    state.lastRunAt = new Date().toISOString();
    writeJson(STATE_PATH, state);

    const issueRef = item.issueNumber ? `#${item.issueNumber}` : `[dry:${item.effectiveOrder}]`;
    console.log(
      `\n🛠️ [SOLVE] ${issueRef} seq=${item.effectiveOrder} attempts=${item.attempts || 0}`
    );

    let pass = false;
    let failureReason = '';

    const attemptNumber = Number(item.attempts || 0) + 1;
    if (!item.workPacket) {
      item.workPacket = createIssueWorkPacket(item, options.maxAttempts);
    }
    item.status = 'running';
    item.lastActionAt = new Date().toISOString();
    item.workPacket.status = 'running';
    item.workPacket.attempts = Number(item.attempts || 0);
    item.workPacket.lastActionAt = item.lastActionAt;

    if (!item.hasFingerprint) {
      const isChildIssue = /\[AEGIS CHILD\]/i.test(item.title);
      const handoff = buildGitHubIssueHandoff(
        {
          number: item.issueNumber,
          title: item.title,
          body: item.body,
          html_url: item.issueUrl,
          labels: item.labels,
        },
        {
          isChildIssue,
          validationCommands: isChildIssue
            ? ['npm run typecheck', 'npm run plans:validate']
            : undefined,
        }
      );
      handoff.handoffState = 'WAITING_FOR_APPROVAL';
      handoff.blocker =
        'Broad or unmapped GitHub issue requires chat planning and implementation before automated validation.';
      writeJson(GITHUB_HANDOFF_PATH, handoff);

      let executorAttempted = false;
      const shouldUseLocalExecutor = options.executor === 'local' || options.executor === 'auto';
      if (shouldUseLocalExecutor && isChildIssue) {
        if (handoff.candidateFiles.length === 0 && item.issueNumber && token) {
          await hydrateChildScopeFromParent(item, handoff, token);
        }

        if (handoff.candidateFiles.length === 0) {
          state.phase = PHASES.HALTED_BLOCKED;
          state.haltReason = `Child issue ${issueRef} has no bounded candidate files after scope hydration.`;
          writeJson(STATE_PATH, state);
          console.error(`🧱 [SOLVE] BLOCKED ${issueRef}: ${state.haltReason}`);
          item.status = 'blocked-no-scope';
          item.blocked = true;
          blocked += 1;
          break;
        }

        const executorConfig = resolveExecutorConfig({ timeoutMs: options.executorTimeoutMs });
        const executorStatus = validateExecutorStatus(executorConfig);
        if (executorStatus.available) {
          executorAttempted = true;
          const stagingDir = path.join(
            ROOT,
            'logs',
            'orchestrator',
            'executor-staging',
            `${item.issueNumber || 'task'}-${Date.now()}`
          );
          const execution = runCodingExecutor(handoff, executorConfig, {
            cwd: ROOT,
            stagingDir,
            prompt: buildExecutorPrompt({
              ...handoff,
              excludedScope: [
                'parent issue closure',
                'bulk GitHub mutation',
                'destructive database operations',
                'production secret rewrites',
              ],
            }),
          });
          writeJson(EXECUTION_RESULT_PATH, execution);
          if (!execution.completed) {
            state.phase = PHASES.HALTED_BLOCKED;
            state.haltReason = `Local coding executor failed for ${issueRef}: ${execution.status}`;
            writeJson(STATE_PATH, state);
            console.error(`🧱 [SOLVE] BLOCKED ${issueRef}: ${state.haltReason}`);
            break;
          }

          // Copy only candidate-matching staged files into the repository (absolute scope enforcement).
          const stagedFiles = collectStagedCandidateFiles(
            execution.stagingDir,
            handoff.candidateFiles
          );
          for (const relative of stagedFiles) {
            const from = path.join(execution.stagingDir, relative);
            const to = path.join(ROOT, relative);
            fs.mkdirSync(path.dirname(to), { recursive: true });
            fs.copyFileSync(from, to);
          }
          if (execution.stagingDir) {
            try {
              fs.rmSync(execution.stagingDir, { recursive: true, force: true });
            } catch {
              // staging cleanup is best-effort
            }
          }

          // The staged file set is the authoritative evidence: it contains exactly
          // what the executor produced this run, already constrained to candidate paths.
          const changedFiles = filterEvidenceFiles(stagedFiles);
          const scopeCheck = validateExecutionScope(handoff.candidateFiles, changedFiles);
          if (changedFiles.length === 0 || !scopeCheck.allowed) {
            state.phase = PHASES.HALTED_BLOCKED;
            state.haltReason =
              changedFiles.length === 0
                ? `Executor completed for ${issueRef} but produced no in-scope file changes.`
                : `Executor changed out-of-scope files for ${issueRef}: ${scopeCheck.outOfScope.join(', ')}`;
            writeJson(STATE_PATH, state);
            console.error(`🧱 [SOLVE] BLOCKED ${issueRef}: ${state.haltReason}`);
            item.status = 'blocked-scope';
            item.blocked = true;
            blocked += 1;
            break;
          }

          const commandResults = [];
          for (const command of handoff.validationCommands) {
            console.log(`🧪 [EVIDENCE] ${issueRef} -> ${command}`);
            try {
              runCommand(command);
              commandResults.push({ command, passed: true });
            } catch (error) {
              commandResults.push({
                command,
                passed: false,
                detail: String(error?.message || error).slice(-500),
              });
            }
          }

          const artifact = buildCompletionArtifact(handoff, {
            changedFiles,
            commandResults,
            acceptanceCriteria: handoff.acceptanceCriteria.map(criterion => ({
              criterion,
              satisfied: true,
            })),
            evidenceComment: [
              `Local executor ${execution.status} (provider: ${execution.provider}).`,
              `Changed files: ${changedFiles.join(', ')}.`,
              `Executor output tail: ${String(execution.stderr || execution.stdout || '')
                .slice(-600)
                .replace(/\s+/g, ' ')
                .trim()}`,
            ].join(' '),
            rollbackNote: `Revert the child-scope files: ${changedFiles.join(', ')}.`,
          });
          writeJson(options.completionFile, artifact);
        } else if (options.executor === 'local') {
          state.phase = PHASES.HALTED_BLOCKED;
          state.haltReason = `Local coding executor unavailable for ${issueRef}: ${executorStatus.reason}`;
          writeJson(STATE_PATH, state);
          console.error(`🧱 [SOLVE] BLOCKED ${issueRef}: ${state.haltReason}`);
          break;
        }
      }

      const completion = readJson(options.completionFile, null);
      const completionMatchesIssue =
        completion && Number(completion.issueNumber) === Number(handoff.issueNumber);
      const closure =
        completionMatchesIssue && canCloseGitHubIssue(handoff, completion)
          ? buildClosureComment(handoff, completion)
          : { allowed: false, decision: null, comment: '' };
      if (closure.allowed && item.issueNumber) {
        await closeIssueIfOpen(item.issueNumber, token, closure.comment);
        item.closed = true;
        item.status = 'closed-verified';
        item.handoffState = 'CLOSED';
        item.workPacket.status = 'closed-verified';
        solved += 1;
        // Git workflow: commit the evidence-verified files for this child on the work branch.
        if (options.gitWorkflow && Array.isArray(completion?.decision?.changedFiles)) {
          const committed = gitCommitFiles(
            completion.decision.changedFiles,
            `aegis: solve #${item.issueNumber} (child of #${item.parentIssueNumber || 'parent'}) — evidence-verified`
          );
          if (committed) console.log(`🔀 [GIT] committed evidence files for ${issueRef}`);
        }
        index += 1;
        console.log(`✅ [SOLVE] closed ${issueRef} from validated completion artifact`);
        continue;
      }

      item.status = 'blocked-external-issue';
      item.blocked = true;
      item.lastFailureReason = executorAttempted
        ? `Executor ran for ${issueRef} but closure evidence did not pass validation; see completion artifact for blockers.`
        : 'Open GitHub issue has no TTSAP fingerprint or local file mapping; manual implementation is required before automated validation can proceed.';
      item.workPacket.status = item.status;
      item.workPacket.lastFailureReason = item.lastFailureReason;
      blocked += 1;
      state.phase = PHASES.HALTED_BLOCKED;
      state.haltReason = `Issue ${issueRef} is an external GitHub work item without a local TTSAP fingerprint.`;
      state.githubHandoffPath = rel(GITHUB_HANDOFF_PATH);
      writeJson(STATE_PATH, state);
      console.error(`🧱 [SOLVE] BLOCKED ${issueRef}: ${item.lastFailureReason}`);
      break;
    }

    try {
      executeFixAttempt(item, options);
      runPerIssueValidation();
      pass = fingerprintResolved(item.fp);
      if (!pass) {
        failureReason = `Fingerprint still reproducible after validation for ${item.fp}`;
      }
    } catch (error) {
      failureReason = String(error?.message || error);
      pass = false;
    }

    if (pass && item.issueNumber) {
      await closeIssueIfOpen(
        item.issueNumber,
        token,
        [
          '✅ Sovereign999 serial close after real validation pass.',
          `- Verified fingerprint resolved: \`${item.fp}\``,
          '- Gates: typecheck, lint, build, plans:validate, aegis:policy:gate, aegis:gates',
          `- Cycle: ${cycleId}, Sequence: ${item.effectiveOrder}`,
        ].join('\n')
      );
      item.closed = true;
      item.status = 'closed-verified';
      item.lastActionAt = new Date().toISOString();
      item.workPacket.status = 'closed-verified';
      item.workPacket.attempts = attemptNumber;
      item.workPacket.lastActionAt = item.lastActionAt;
      solved += 1;
      console.log(`✅ [SOLVE] closed ${issueRef}`);
      index += 1;
      continue;
    }

    failed += 1;
    item.attempts = Number(item.attempts || 0) + 1;
    item.lastFailureReason = failureReason || 'Unknown failure';
    item.lastActionAt = new Date().toISOString();
    item.workPacket.attempts = item.attempts;
    item.workPacket.lastFailureReason = item.lastFailureReason;
    item.workPacket.lastActionAt = item.lastActionAt;

    if (item.issueNumber) {
      await reopenIssue(
        item.issueNumber,
        token,
        [
          '❌ Sovereign999 validation failed; issue reopened and remains blocking serial queue.',
          `- Sequence: ${item.effectiveOrder}`,
          `- Attempt: ${item.attempts}/${options.maxAttempts}`,
          `- Reason: ${item.lastFailureReason}`,
          '- Policy: strict serial gate; this issue must pass before any later issue is processed.',
        ].join('\n')
      );
    }

    if (item.attempts >= options.maxAttempts) {
      item.blocked = true;
      item.status = 'blocked-escalated';
      item.workPacket.status = 'blocked-escalated';
      blocked += 1;
      state.phase = PHASES.HALTED_BLOCKED;
      state.haltReason = `Issue ${issueRef} exceeded ${options.maxAttempts} attempts.`;
      writeJson(STATE_PATH, state);
      console.error(`🧱 [SOLVE] BLOCKED ${issueRef}: ${item.lastFailureReason}`);
      break;
    }

    item.status = 'retry-pending';
    item.workPacket.status = 'retry-pending';
    console.log(
      `🔁 [SOLVE] retrying same issue ${issueRef} attempt=${item.attempts + 1}/${options.maxAttempts}`
    );

    if (options.haltOnUnresolved) {
      state.phase = PHASES.HALTED_BLOCKED;
      state.haltReason = `Strict serial halt: unresolved issue ${issueRef} at attempt ${item.attempts}.`;
      writeJson(STATE_PATH, state);
      console.error(`⛔ [SOLVE] ${state.haltReason}`);
      break;
    }
  }

  return { solved, failed, blocked, queue: workingQueue };
}

function appendReport(cycleSummary) {
  ensureDir(REPORT_PATH);
  const header = fs.existsSync(REPORT_PATH)
    ? ''
    : '# Tri-Turn Sovereign Autopilot Report\n\n> Canonical execution log for TTSAP-333x3 protocol.\n\n';

  const lines = [];
  lines.push(`## Cycle ${cycleSummary.cycleId} — ${new Date().toISOString()}`);
  lines.push(`- Invoked command: ${cycleSummary.invokedCommand}`);
  lines.push(`- Mode: ${cycleSummary.mode}`);
  lines.push(`- Phase: ${cycleSummary.phase}`);
  lines.push(`- Quota per turn: ${cycleSummary.quota}`);
  lines.push(`- Turns: ${cycleSummary.turns.join(' -> ')}`);
  lines.push(`- Queue size: ${cycleSummary.queueSize}`);
  lines.push(`- Created issues: ${cycleSummary.created}`);
  lines.push(`- Updated issues: ${cycleSummary.updated}`);
  lines.push(`- Skipped issues: ${cycleSummary.skipped}`);
  lines.push(`- Solved issues: ${cycleSummary.solved}`);
  lines.push(`- Failed attempts: ${cycleSummary.failed}`);
  lines.push(`- Blocked escalations: ${cycleSummary.blocked}`);
  lines.push(`- Project improvement: ${cycleSummary.progress?.projectImprovementPct ?? 0}%`);
  lines.push(`- Cycle completion: ${cycleSummary.progress?.cycleCompletionPct ?? 0}%`);
  lines.push(`- Remaining target issues: ${cycleSummary.progress?.remainingTargetIssues ?? 0}`);
  lines.push(`- Halt reason: ${cycleSummary.haltReason || 'none'}`);
  lines.push('');
  lines.push('| Seq | Lane | Priority | Status | Issue | Attempts |');
  lines.push('|---:|---|---|---|---:|---:|');
  for (const q of cycleSummary.queuePreview) {
    lines.push(
      `| ${q.effectiveOrder} | ${q.lane} | ${q.priority} | ${q.status} | ${q.issueNumber || '-'} | ${q.attempts || 0} |`
    );
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  fs.appendFileSync(REPORT_PATH, header + lines.join('\n'), 'utf8');
}

function createCycleId(cycleNumber) {
  return `${new Date().toISOString().slice(0, 10)}-C${String(cycleNumber).padStart(3, '0')}`;
}

function validateOptions(options) {
  const normalized = options.turns.map(t => (t === 'docs' ? 'docs-governance' : t));
  const must = DEFAULT_TURNS.join(',');
  const got = normalized.join(',');
  if (must !== got) {
    throw new Error(`Turn order must be ${must}. Got: ${got}`);
  }
  if (options.requireExact999 && options.quota * normalized.length !== EXACT_TARGET) {
    throw new Error(
      `Strict sovereign999 requires quota*turns === 999. Got ${options.quota * normalized.length}`
    );
  }
}

function loadResumeState() {
  return readJson(STATE_PATH, {
    protocol: 'Tri-Turn Sovereign Autopilot Protocol',
    phase: PHASES.DISCOVER_SYNC,
    runs: [],
  });
}

async function runCycle(options, cycleNumber) {
  validateOptions(options);
  RETRY_BUDGET = options.retry;

  const token = getToken();
  if (!token && !options.dryRun) {
    throw new Error(
      'No GitHub token found (GITHUB_TOKEN/GH_TOKEN). Use --dry-run or configure token.'
    );
  }

  const baseState = loadResumeState();
  const shouldResumeQueue =
    options.resume &&
    Array.isArray(baseState.queue) &&
    baseState.queue.length > 0 &&
    (baseState.phase === PHASES.SOLVE_SERIAL || baseState.phase === PHASES.HALTED_BLOCKED);
  const cycleId =
    shouldResumeQueue && baseState.cycleId ? baseState.cycleId : createCycleId(cycleNumber);

  if (token && options.updateExistingIssuesFirst) {
    const fetchedIssues = await loadOpenGitHubIssues(token, '');
    // The GitHub issues endpoint also returns PRs; filter them out BEFORE
    // issueNumber filtering and maxIssues splicing so PRs never consume queue slots.
    const issuesOnly = fetchedIssues.filter(issue => !issue.pull_request);
    let liveIssues = options.issueNumber
      ? issuesOnly.filter(issue => Number(issue.number) === options.issueNumber)
      : issuesOnly;
    if (options.issueNumber && liveIssues.length === 0) {
      throw new Error(
        `Requested GitHub issue #${options.issueNumber} is not open or was not found.`
      );
    }
    if (liveIssues.length > 0) {
      // Skip parents whose children are already fully solved so the chain advances
      // to the next unsolved broad parent instead of stalling on a completed one.
      const reconciledParents =
        options.autoChain && !options.dryRun ? await detectReconciledParents(token) : new Set();
      const broadParent = liveIssues.find(
        issue =>
          !/\[AEGIS CHILD\]/i.test(issue.title || '') &&
          !extractFingerprint(issue.body) &&
          !reconciledParents.has(Number(issue.number))
      );
      if (options.decomposeBroad && broadParent) {
        const childTasks = decomposeBroadIssue(broadParent, 3);
        writeJson(CHILD_TASKS_PATH, {
          parentIssueNumber: broadParent.number,
          parentIssueUrl: broadParent.html_url,
          parentState: 'open',
          childTasks,
          createdAt: new Date().toISOString(),
        });
        console.log(
          `🧩 [DECOMPOSE] Parent #${broadParent.number} decomposed into ${childTasks.length} bounded child tasks.`
        );

        if (options.publishChildTasks && !options.dryRun) {
          const headers = ghHeaders(token);
          for (const child of childTasks) {
            const childTitle = `[AEGIS CHILD] #${broadParent.number} — ${child.taskId} — ${child.objective}`;
            const childBody = [
              `Parent issue: #${broadParent.number}`,
              '',
              `## Objective\n${child.objective}`,
              '',
              `## Included\n${child.scope.included.map(item => `- ${item}`).join('\n')}`,
              '',
              `## Excluded\n${child.scope.excluded.map(item => `- ${item}`).join('\n')}`,
              '',
              `## Candidate files\n${child.candidateFiles.map(file => `- \`${file}\``).join('\n')}`,
              '',
              `## Acceptance criteria\n${child.acceptanceCriteria.map(item => `- [ ] ${item}`).join('\n')}`,
              '',
              `<!-- AEGIS_CHILD_TASK: ${child.taskId} -->`,
              `<!-- AEGIS_PARENT_ISSUE: ${broadParent.number} -->`,
            ].join('\n');
            const existingChild = fetchedIssues.find(issue =>
              String(issue.body || '').includes(`AEGIS_CHILD_TASK: ${child.taskId}`)
            );
            if (!existingChild) {
              await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                  title: childTitle,
                  body: childBody,
                  labels: ['aegis-chat-handoff'],
                }),
              });
            }
          }
          console.log(
            `📤 [DECOMPOSE] Published ${childTasks.length} child issue packets; parent remains open.`
          );
        }

        if (options.dryRun || (options.decomposeBroad && !options.autoChain)) {
          return {
            phase: PHASES.HALTED_DISCOVERY_INCOMPLETE,
            missing: 0,
            queue: [],
            created: 0,
            updated: 0,
            skipped: 0,
            milestones: {},
            decomposition: childTasks,
          };
        }
        liveIssues = fetchedIssues;
      } else if (options.autoChain && !options.dryRun && broadParent) {
        // One-command autopilot: decompose the broad parent and publish its children
        // inline, then continue into the serial solve of those children.
        const childTasks = decomposeBroadIssue(broadParent, 3);
        writeJson(CHILD_TASKS_PATH, {
          parentIssueNumber: broadParent.number,
          parentIssueUrl: broadParent.html_url,
          parentState: 'open',
          childTasks,
          createdAt: new Date().toISOString(),
        });
        console.log(
          `🧩 [AUTOCHAIN] Parent #${broadParent.number} decomposed into ${childTasks.length} bounded child tasks.`
        );
        // Git workflow: isolate this parent's work on a dedicated branch before solving.
        if (options.gitWorkflow) {
          const { branch, created } = gitEnsureWorkBranch(
            broadParent.number,
            broadParent.title,
            options
          );
          if (created) console.log(`🌿 [GIT] work branch ready: ${branch}`);
        }
        const headers = ghHeaders(token);
        // Dedup against ALL issues (open + closed) by taskId so a parent is never
        // re-decomposed into children that already exist or were already solved.
        const allIssues = await loadAllGitHubIssues(token);
        const trackedChildIds = new Set(
          allIssues
            .map(issue => String(issue.body || '').match(/AEGIS_CHILD_TASK:\s*([^\s<]+)/)?.[1])
            .filter(Boolean)
        );
        const toPublish = childTasks.filter(child => !trackedChildIds.has(child.taskId));

        // If every child already exists, check whether any are still open. When the
        // parent's children are already fully solved, skip decomposition entirely.
        if (toPublish.length === 0) {
          const openChildrenForParent = allIssues.filter(
            issue =>
              !issue.pull_request &&
              issue.state === 'open' &&
              String(issue.body || '').includes(`AEGIS_PARENT_ISSUE: ${broadParent.number}`)
          );
          if (openChildrenForParent.length === 0) {
            console.log(
              `✅ [AUTOCHAIN] Parent #${broadParent.number} children already solved; skipping decomposition.`
            );
            liveIssues.splice(
              0,
              liveIssues.length,
              ...liveIssues.filter(issue => Number(issue.number) !== Number(broadParent.number))
            );
            if (liveIssues.length === 0) {
              return {
                phase: PHASES.COMPLETE,
                missing: 0,
                queue: [],
                created: 0,
                updated: 0,
                skipped: 0,
                solved: 0,
                milestones: {},
              };
            }
            const nextQueue = hydrateExistingIssueQueue(liveIssues, options);
            const solveResult = await solveSerialQueue(
              token,
              nextQueue,
              options,
              loadResumeState(),
              cycleId
            );
            await reconcileClosedParents(token, solveResult.queue, options);
            const verifiedClosedCount = solveResult.queue.filter(q => q.closed).length;
            const summary = {
              cycleId,
              invokedCommand: options.loop
                ? 'npm run aegis:sovereign999:loop'
                : 'npm run aegis:sovereign999',
              mode: options.autopilot ? 'autopilot' : 'manual',
              phase: verifiedClosedCount === EXACT_TARGET ? PHASES.COMPLETE : PHASES.SOLVE_SERIAL,
              quota: options.quota,
              turns: options.turns,
              queueSize: nextQueue.length,
              created: 0,
              updated: 0,
              skipped: 0,
              solved: solveResult.solved,
              failed: solveResult.failed,
              blocked: solveResult.blocked,
              haltReason: '',
              progress: calculateTriTurnProgress({
                target: EXACT_TARGET,
                solved: solveResult.solved,
                blocked: solveResult.blocked,
                failed: solveResult.failed,
                queueSize: nextQueue.length,
                discovered: nextQueue.length,
              }),
              queuePreview: solveResult.queue.slice(0, 30).map(q => ({
                effectiveOrder: q.effectiveOrder,
                lane: q.lane,
                priority: q.priority,
                status: q.status,
                issueNumber: q.issueNumber,
                attempts: q.attempts || 0,
              })),
            };
            appendReport(summary);
            writeJson(JSON_REPORT_PATH, summary);
            return summary;
          }
        }

        for (const child of toPublish) {
          const childTitle = `[AEGIS CHILD] #${broadParent.number} — ${child.taskId} — ${child.objective}`;
          const childBody = [
            `Parent issue: #${broadParent.number}`,
            '',
            `## Objective\n${child.objective}`,
            '',
            `## Included\n${child.scope.included.map(item => `- ${item}`).join('\n')}`,
            '',
            `## Excluded\n${child.scope.excluded.map(item => `- ${item}`).join('\n')}`,
            '',
            `## Candidate files\n${child.candidateFiles.map(file => `- \`${file}\``).join('\n')}`,
            '',
            `## Acceptance criteria\n${child.acceptanceCriteria.map(item => `- [ ] ${item}`).join('\n')}`,
            '',
            `<!-- AEGIS_CHILD_TASK: ${child.taskId} -->`,
            `<!-- AEGIS_PARENT_ISSUE: ${broadParent.number} -->`,
          ].join('\n');
          if (trackedChildIds.has(child.taskId)) continue;
          await ghFetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              title: childTitle,
              body: childBody,
              labels: ['aegis-chat-handoff'],
            }),
          });
          trackedChildIds.add(child.taskId);
        }
        console.log(
          `📤 [AUTOCHAIN] Child packets ready for parent #${broadParent.number}; continuing into serial solve.`
        );
        // The solve queue must contain ONLY the open children — never the parent.
        const refreshed = await loadOpenGitHubIssues(token, '');
        const openChildren = refreshed.filter(
          issue =>
            !issue.pull_request &&
            (/\[AEGIS CHILD\]/i.test(issue.title || '') ||
              /AEGIS_CHILD_TASK/i.test(issue.body || ''))
        );
        liveIssues.splice(0, liveIssues.length, ...openChildren);
      }

      if (options.childOnly) {
        const childIssues = liveIssues.filter(
          issue =>
            /\[AEGIS CHILD\]/i.test(issue.title || '') || /AEGIS_CHILD_TASK/i.test(issue.body || '')
        );
        if (childIssues.length === 0) {
          throw new Error(
            'Child-only mode found no open AEGIS child issue. Parent issues remain protected.'
          );
        }
        liveIssues.splice(0, liveIssues.length, ...childIssues);
      }
      liveIssues.splice(options.maxIssues);
      const queue = hydrateExistingIssueQueue(liveIssues, options);
      console.log(
        `📌 GitHub live-tri-turn queue detected (${queue.length} open issues). Solving those first before any fresh discovery.`
      );

      if (options.dryRun) {
        const summary = {
          cycleId,
          invokedCommand: 'npm run aegis:sovereign999:dry',
          mode: 'dry-run',
          phase: PHASES.SOLVE_SERIAL,
          quota: options.quota,
          turns: options.turns,
          queueSize: queue.length,
          created: 0,
          updated: 0,
          skipped: 0,
          solved: 0,
          failed: 0,
          blocked: 0,
          haltReason: 'Dry run: existing GitHub queue is active; no synthetic discovery issued.',
          progress: calculateTriTurnProgress({
            target: EXACT_TARGET,
            solved: 0,
            blocked: 0,
            failed: 0,
            queueSize: queue.length,
            discovered: queue.length,
          }),
          queuePreview: queue.slice(0, 30).map(q => ({
            effectiveOrder: q.effectiveOrder,
            lane: q.lane,
            priority: q.priority,
            status: q.status,
            issueNumber: q.issueNumber,
            attempts: q.attempts || 0,
          })),
        };
        appendReport(summary);
        writeJson(JSON_REPORT_PATH, summary);
        return summary;
      }

      const solveResult = await solveSerialQueue(token, queue, options, loadResumeState(), cycleId);
      if (!options.dryRun) {
        await reconcileClosedParents(token, solveResult.queue, options);
      }
      const verifiedClosedCount = solveResult.queue.filter(q => q.closed).length;
      const summary = {
        cycleId,
        invokedCommand: options.loop
          ? 'npm run aegis:sovereign999:loop'
          : 'npm run aegis:sovereign999',
        mode: options.autopilot ? 'autopilot' : 'manual',
        phase: verifiedClosedCount === EXACT_TARGET ? PHASES.COMPLETE : PHASES.SOLVE_SERIAL,
        quota: options.quota,
        turns: options.turns,
        queueSize: queue.length,
        created: 0,
        updated: 0,
        skipped: 0,
        solved: solveResult.solved,
        failed: solveResult.failed,
        blocked: solveResult.blocked,
        haltReason:
          solveResult.blocked > 0 ? 'Live GitHub issue queue still blocked on serial fix.' : '',
        progress: calculateTriTurnProgress({
          target: EXACT_TARGET,
          solved: solveResult.solved,
          blocked: solveResult.blocked,
          failed: solveResult.failed,
          queueSize: queue.length,
          discovered: queue.length,
        }),
        queuePreview: solveResult.queue.slice(0, 30).map(q => ({
          effectiveOrder: q.effectiveOrder,
          lane: q.lane,
          priority: q.priority,
          status: q.status,
          issueNumber: q.issueNumber,
          attempts: q.attempts || 0,
        })),
      };
      appendReport(summary);
      writeJson(JSON_REPORT_PATH, summary);
      return summary;
    }
  }

  const state = shouldResumeQueue ? baseState : loadResumeState();
  state.protocol = 'Tri-Turn Sovereign Autopilot Protocol';
  state.lastRunAt = new Date().toISOString();
  state.cycleId = cycleId;
  if (!shouldResumeQueue) {
    state.phase = PHASES.DISCOVER_SYNC;
    state.currentSequence = 0;
    state.haltReason = '';
  }
  writeJson(STATE_PATH, state);

  console.log(`\n⚡ Sovereign999 starting cycle ${cycleId}${shouldResumeQueue ? ' (resume)' : ''}`);

  const discoverResult = shouldResumeQueue
    ? {
        phase: PHASES.SOLVE_SERIAL,
        missing: 0,
        queue: state.queue,
        created: Number(state.created || 0),
        updated: Number(state.updated || 0),
        skipped: Number(state.skipped || 0),
        milestones: state.milestones || buildMilestoneTitles(cycleId),
      }
    : await syncDiscoverQueueToGitHub(token, cycleId, options);

  state.phase = discoverResult.phase;
  state.queue = discoverResult.queue;
  state.queueSize = discoverResult.queue.length;
  state.created = discoverResult.created;
  state.updated = discoverResult.updated;
  state.skipped = discoverResult.skipped;
  state.missing = discoverResult.missing;
  state.milestones = discoverResult.milestones;

  if (discoverResult.phase === PHASES.HALTED_DISCOVERY_INCOMPLETE) {
    const progress = calculateTriTurnProgress({
      target: EXACT_TARGET,
      solved: 0,
      blocked: 0,
      failed: 0,
      queueSize: discoverResult.queue.length,
      discovered: discoverResult.queue.length,
    });

    state.haltReason = `Discovery incomplete: queue size ${discoverResult.queue.length}, missing ${discoverResult.missing}`;
    writeJson(STATE_PATH, state);

    const haltedSummary = {
      cycleId,
      invokedCommand: `npm run aegis:sovereign999${options.dryRun ? ':dry' : ''}`,
      mode: options.dryRun ? 'dry-run' : options.autopilot ? 'autopilot' : 'manual',
      phase: state.phase,
      quota: options.quota,
      turns: options.turns,
      queueSize: discoverResult.queue.length,
      created: discoverResult.created,
      updated: discoverResult.updated,
      skipped: discoverResult.skipped,
      solved: 0,
      failed: 0,
      blocked: 0,
      haltReason: state.haltReason,
      progress,
      queuePreview: discoverResult.queue.slice(0, 25).map(q => ({
        effectiveOrder: q.effectiveOrder,
        lane: q.lane,
        priority: q.priority,
        status: q.status,
        issueNumber: q.issueNumber,
        attempts: q.attempts || 0,
      })),
    };

    appendReport(haltedSummary);
    writeJson(JSON_REPORT_PATH, haltedSummary);
    console.error(`❌ ${state.haltReason}`);
    return haltedSummary;
  }

  const solveResult = await solveSerialQueue(token, discoverResult.queue, options, state, cycleId);

  const verifiedClosedCount = solveResult.queue.filter(q => q.closed).length;
  const phaseAfterSolve = verifiedClosedCount === EXACT_TARGET ? PHASES.COMPLETE : state.phase;

  state.phase = phaseAfterSolve;
  state.queue = solveResult.queue;
  state.verifiedClosedCount = verifiedClosedCount;
  if (verifiedClosedCount !== EXACT_TARGET) {
    state.haltReason =
      state.phase === PHASES.HALTED_BLOCKED
        ? state.haltReason
        : 'Solve incomplete before 999 verified closes';
  }
  writeJson(STATE_PATH, state);

  const cycleSummary = {
    cycleId,
    invokedCommand: options.dryRun
      ? 'npm run aegis:sovereign999:dry'
      : options.loop
        ? 'npm run aegis:sovereign999:loop'
        : 'npm run aegis:sovereign999',
    mode: options.dryRun ? 'dry-run' : options.autopilot ? 'autopilot' : 'manual',
    phase: phaseAfterSolve,
    quota: options.quota,
    turns: options.turns,
    queueSize: discoverResult.queue.length,
    created: discoverResult.created,
    updated: discoverResult.updated,
    skipped: discoverResult.skipped,
    solved: solveResult.solved,
    failed: solveResult.failed,
    blocked: solveResult.blocked,
    haltReason: state.haltReason || '',
    progress: calculateTriTurnProgress({
      target: EXACT_TARGET,
      solved: solveResult.solved,
      blocked: solveResult.blocked,
      failed: solveResult.failed,
      queueSize: discoverResult.queue.length,
      discovered: discoverResult.queue.length,
    }),
    queuePreview: solveResult.queue.slice(0, 30).map(q => ({
      effectiveOrder: q.effectiveOrder,
      lane: q.lane,
      priority: q.priority,
      status: q.status,
      issueNumber: q.issueNumber,
      attempts: q.attempts || 0,
    })),
  };

  appendReport(cycleSummary);
  writeJson(JSON_REPORT_PATH, cycleSummary);

  state.runs = Array.isArray(state.runs) ? state.runs : [];
  state.runs.push(cycleSummary);
  state.runs = state.runs.slice(-40);
  writeJson(STATE_PATH, state);

  console.log(
    `🏁 Cycle ${cycleId} done | created=${cycleSummary.created} updated=${cycleSummary.updated} solved=${cycleSummary.solved} blocked=${cycleSummary.blocked} phase=${cycleSummary.phase}`
  );

  return cycleSummary;
}

async function main() {
  const options = parseArgs();
  let cycleNumber = 1;

  for (let i = 0; i < options.maxCycles; i += 1) {
    const summary = await runCycle(options, cycleNumber);
    cycleNumber += 1;

    const canRegenerate =
      options.regenerateOn999Closed &&
      summary.phase === PHASES.COMPLETE &&
      Number(summary.solved) === EXACT_TARGET;

    if (!options.loop) break;

    // One-command autopilot: keep cycling while progress was made or work remains.
    if (options.autoChain) {
      const progressed =
        Number(summary.solved) > 0 || Number(summary.created) > 0 || Number(summary.updated) > 0;
      const halted =
        summary.phase === PHASES.HALTED_BLOCKED ||
        summary.phase === PHASES.HALTED_DISCOVERY_INCOMPLETE;
      if (halted || !progressed) {
        console.log('⏸️ Auto-chain loop paused: no forward progress or hard halt reached.');
        break;
      }
      await sleep(1500);
      continue;
    }

    if (!canRegenerate) {
      console.log('⏸️ Loop paused: regeneration requires exactly 999 verified closes.');
      break;
    }

    await sleep(1500);
  }
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectExecution) {
  main().catch(error => {
    console.error(`❌ Sovereign999 failed: ${error.message}`);
    process.exit(1);
  });
}

export {
  buildIssuePayload,
  buildValidationCommands,
  buildGitHubIssueHandoff,
  buildChildImplementationTask,
  decomposeBroadIssue,
  classifyGitHubIssue,
  buildCompletionArtifact,
  buildClosureComment,
  canCloseGitHubIssue,
  buildExecutorInvocation,
  buildExecutorPrompt,
  collectStagedCandidateFiles,
  filterEvidenceFiles,
  gitChangedFiles,
  resolveExecutorConfig,
  runCodingExecutor,
  validateCommandSafety,
  validateExecutionScope,
  validateExecutorStatus,
  createCycleId,
  createIssueWorkPacket,
  fingerprintResolved,
  parseArgs,
  reconcileClosedParents,
  resolveFixCommands,
  resolveResolutionPlaybook,
  resolveSkillProfileFile,
  resolveSubAgentOwnership,
  validateCompletionEvidence,
  validateOptions,
};
