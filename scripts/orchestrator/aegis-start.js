#!/usr/bin/env node

import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const argv = process.argv.slice(2);
const hasFlag = flag => argv.includes(flag);
const readArg = (name, fallback = '') => {
  const index = argv.indexOf(name);
  return index !== -1 ? String(argv[index + 1] || fallback) : fallback;
};

const DRY_RUN = hasFlag('--dry');
const SKIP_BUILD = hasFlag('--skip-build');
const SKIP_SCAN = hasFlag('--skip-scan');
const NO_COMMIT = hasFlag('--no-commit');
const MAX_SESSIONS = readArg('--max-sessions', '0');
const SESSION_DELAY = readArg('--session-delay', '5');
const CHECKPOINT_EVERY = readArg('--checkpoint-every', '5');
const CHECKPOINT_STOP_ON_FAILURE = hasFlag('--checkpoint-stop-on-failure');
const GITHUB_ISSUE_TARGET = readArg(
  '--github-issue-target',
  process.env.AEGIS_GITHUB_ISSUE_TARGET || '50'
);
const GITHUB_ISSUE_BOOTSTRAP_PER_RUN = readArg(
  '--github-issue-bootstrap-per-run',
  process.env.AEGIS_GITHUB_ISSUE_BOOTSTRAP_PER_RUN || '3'
);
const GITHUB_WAVE_BATCH_SIZE = readArg(
  '--github-wave-batch-size',
  process.env.AEGIS_GITHUB_WAVE_BATCH_SIZE || '3'
);
const GITHUB_SYNC_EVERY_SESSIONS = readArg(
  '--github-sync-every-sessions',
  process.env.AEGIS_GITHUB_SYNC_EVERY_SESSIONS || '1'
);
const GITHUB_SYNC_ONLY_WHEN_IDLE = hasFlag('--github-sync-only-when-idle');

function run(command, args, label) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });

  if (result.status !== 0) {
    console.error(`Aegis start failed during ${label}.`);
    process.exit(result.status ?? 1);
  }
}

console.log('=== Aegis Start ===');
run('node', ['scripts/orchestrator/aegis-auth-setup.js', '--check'], 'auth check');

const psArgs = [
  '-ExecutionPolicy',
  'Bypass',
  '-File',
  'scripts/orchestrator/autopilot-unlimited.ps1',
  '-WorkspaceRoot',
  '.',
  '-MaxSessions',
  String(MAX_SESSIONS),
  '-SessionDelaySec',
  String(SESSION_DELAY),
  '-CheckpointEverySessions',
  String(CHECKPOINT_EVERY),
  '-GitHubIssueTarget',
  String(GITHUB_ISSUE_TARGET),
  '-GitHubIssueBootstrapPerRun',
  String(GITHUB_ISSUE_BOOTSTRAP_PER_RUN),
  '-GitHubWaveBatchSize',
  String(GITHUB_WAVE_BATCH_SIZE),
  '-GitHubSyncEverySessions',
  String(GITHUB_SYNC_EVERY_SESSIONS),
];

if (DRY_RUN) psArgs.push('-DryRun');
if (SKIP_BUILD) psArgs.push('-SkipBuild');
if (SKIP_SCAN) psArgs.push('-SkipScan');
if (NO_COMMIT) psArgs.push('-NoCommit');
if (CHECKPOINT_STOP_ON_FAILURE) psArgs.push('-CheckpointStopOnFailure');
if (GITHUB_SYNC_ONLY_WHEN_IDLE) psArgs.push('-GitHubSyncOnlyWhenIdle', 'true');

run('powershell', psArgs, 'autopilot launch');
