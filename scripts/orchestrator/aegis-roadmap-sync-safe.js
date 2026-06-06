#!/usr/bin/env node

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const argv = process.argv.slice(2);

const ENV_FILES = [path.join(ROOT, '.env.local'), path.join(ROOT, '.env')];

for (const filePath of ENV_FILES) {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath, override: false });
  }
}

const hasFlag = flag => argv.includes(flag);
const readArg = (name, fallback = '') => {
  const index = argv.indexOf(name);
  return index !== -1 ? String(argv[index + 1] || fallback) : fallback;
};

const OWNER = readArg('--owner', process.env.GITHUB_OWNER || 'arslan9024');
const REPO = readArg('--repo', process.env.GITHUB_REPO || 'White-Caves');
const STATE = readArg('--state', 'open');
const BATCH_SIZE = readArg('--batch-size', process.env.GITHUB_ISSUE_BATCH_SIZE || '3');
const BOOTSTRAP_TARGET_COUNT = readArg(
  '--bootstrap-target-count',
  process.env.GITHUB_ISSUE_BOOTSTRAP_TARGET || '50'
);
const BOOTSTRAP_PER_RUN = readArg(
  '--bootstrap-per-run',
  process.env.GITHUB_ISSUE_BOOTSTRAP_PER_RUN || '5'
);
const BOOTSTRAP_ALL = hasFlag('--bootstrap-all');

function buildSharedArgs() {
  return ['--owner', OWNER, '--repo', REPO, '--state', STATE, '--batch-size', String(BATCH_SIZE)];
}

function buildApplyArgs() {
  const args = [
    ...buildSharedArgs(),
    '--bootstrap-from-discovery',
    '--bootstrap-target-count',
    String(BOOTSTRAP_TARGET_COUNT),
    '--bootstrap-per-run',
    String(BOOTSTRAP_PER_RUN),
    '--apply',
  ];
  if (BOOTSTRAP_ALL) {
    args.push('--bootstrap-all');
  }
  return args;
}

function buildApplyArgsWithToken(token) {
  const args = [...buildApplyArgs()];
  if (token) {
    args.push('--token', token);
  }
  return args;
}

function buildDryArgs() {
  return [...buildSharedArgs(), '--dry'];
}

function runNode(args) {
  const result = spawnSync('node', args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });
  return result.status ?? 1;
}

function resolveToken() {
  const token = String(process.env.GITHUB_TOKEN || '').trim();
  if (!token) {
    return '';
  }
  if (/newtokenhere|your-token|changeme|example|placeholder/i.test(token)) {
    return '';
  }
  return token;
}

function resolveGhToken() {
  const whereResult = spawnSync('where', ['gh'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: false,
  });

  const isWhereUsable = whereResult.status === 0;
  const cmdWhereResult = isWhereUsable
    ? whereResult
    : spawnSync('cmd', ['/c', 'where gh'], {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        encoding: 'utf8',
        shell: false,
      });

  const whereOk = isWhereUsable || cmdWhereResult.status === 0;
  if (!whereOk) {
    return '';
  }

  let result;
  try {
    result = spawnSync('gh', ['auth', 'token'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
      shell: false,
    });
  } catch {
    return '';
  }

  if (result.status !== 0) {
    return '';
  }

  return String(result.stdout || '').trim();
}

async function isGitHubTokenValid(token) {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'white-caves-aegis-sync-safe',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

const main = async () => {
  const envToken = resolveToken();
  const envTokenValid = await isGitHubTokenValid(envToken);

  const ghToken = resolveGhToken();
  const ghTokenValid = await isGitHubTokenValid(ghToken);

  const token = envTokenValid ? envToken : ghTokenValid ? ghToken : '';
  const tokenSource = envTokenValid ? 'project env token' : ghTokenValid ? 'gh auth token' : 'none';

  if (tokenSource !== 'none') {
    console.log(`aegis-roadmap-sync-safe: using ${tokenSource} for apply sync.`);
  }

  if (token) {
    const applyCode = runNode([
      'scripts/orchestrator/github-issue-roadmap.js',
      ...buildApplyArgsWithToken(token),
    ]);
    if (applyCode === 0) {
      process.exit(0);
    }

    console.log('aegis-roadmap-sync-safe: apply sync failed; falling back to dry roadmap sync.');
  } else {
    console.log(
      'aegis-roadmap-sync-safe: no valid GitHub token from env or gh auth; running dry roadmap sync.'
    );
  }

  const dryCode = runNode(['scripts/orchestrator/github-issue-roadmap.js', ...buildDryArgs()]);
  process.exit(dryCode);
};

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`aegis-roadmap-sync-safe: unexpected error (${message}); running dry roadmap sync.`);
  const dryCode = runNode(['scripts/orchestrator/github-issue-roadmap.js', ...buildDryArgs()]);
  process.exit(dryCode);
});
