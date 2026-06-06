#!/usr/bin/env node

import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const argv = process.argv.slice(2);

const RUN_DAILY = argv.includes('--run-daily');
const STRICT = argv.includes('--strict');

function run(command, args, label) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });

  if ((result.status ?? 1) !== 0) {
    return { ok: false, code: result.status ?? 1, label };
  }

  return { ok: true, code: 0, label };
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
    encoding: 'utf8',
    shell: false,
  });

  return {
    ok: (result.status ?? 1) === 0,
    code: result.status ?? 1,
    stdout: String(result.stdout || ''),
    stderr: String(result.stderr || ''),
  };
}

function printHeader(title) {
  console.log(`\n=== ${title} ===`);
}

function printBlockedGuidance() {
  console.log('Bootstrap blocked because GitHub write access is not ready.');
  console.log('Next steps:');
  console.log('  1. Add a valid GITHUB_TOKEN to .env.local');
  console.log('  2. Or install/login gh CLI so safe sync can use gh auth');
  console.log('  3. Re-run: npm run aegis:github:bootstrap');
}

function main() {
  printHeader('Aegis GitHub Bootstrap');

  const selfCheck = runCapture('node', [
    'scripts/orchestrator/aegis-github-selfcheck.js',
    '--json',
  ]);
  if (!selfCheck.stdout.trim()) {
    console.error('Unable to read GitHub readiness status.');
    process.exit(selfCheck.code || 1);
  }

  let readiness;
  try {
    readiness = JSON.parse(selfCheck.stdout);
  } catch {
    console.error('GitHub readiness output was not valid JSON.');
    process.exit(1);
  }

  if (!readiness.canWriteGitHub) {
    console.log(`Repository : ${readiness.repository}`);
    console.log(`Auth state : ${readiness.effectiveAuth}`);
    printBlockedGuidance();
    process.exit(STRICT ? 1 : 0);
  }

  console.log(`Repository : ${readiness.repository}`);
  console.log(`Auth state : ${readiness.effectiveAuth}`);
  console.log('GitHub write access is ready. Seeding/syncing issues and milestones...');

  const sync = run(
    'node',
    [
      'scripts/orchestrator/aegis-roadmap-sync-safe.js',
      '--bootstrap-all',
      '--bootstrap-target-count',
      '50',
      '--bootstrap-per-run',
      '5',
    ],
    'GitHub roadmap sync'
  );
  if (!sync.ok) {
    console.error('Bootstrap failed during roadmap sync.');
    process.exit(sync.code);
  }

  console.log('GitHub roadmap bootstrap complete.');

  if (!RUN_DAILY) {
    console.log('Next: npm run aegis:daily');
    process.exit(0);
  }

  const daily = run('npm', ['run', 'aegis:daily'], 'daily autopilot run');
  if (!daily.ok) {
    console.error('Bootstrap completed, but daily autopilot launch failed.');
    process.exit(daily.code);
  }

  process.exit(0);
}

main();
