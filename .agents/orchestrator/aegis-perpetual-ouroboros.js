#!/usr/bin/env node
// Compatibility entrypoint: bounded local verification, not an AI implementation engine.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LOGS_DIR = path.join(ROOT, '.agents', 'orchestrator', 'logs');
const LOCK = path.join(LOGS_DIR, 'ouroboros.lock');
const LIVE_LOG = path.join(LOGS_DIR, 'ouroboros-live.log');

export function enforceRootHygiene() {
  const blockers = ['docs', 'plans', 'strategies', 'business_docs'].filter(folder =>
    fs.existsSync(path.join(ROOT, folder))
  );
  if (blockers.length) {
    throw new Error(
      `Root hygiene requires manual review: ${blockers.join(', ')}. No files moved or deleted.`
    );
  }
  return 0;
}

function run(command, timeout = 120000) {
  // Inherit output so a failing tool's actual diagnostics remain visible.
  execSync(command, { cwd: ROOT, stdio: 'inherit', timeout });
}

export async function runPerpetualLoop(options = {}) {
  const maxCycles = options.maxCycles ?? 1;
  if (!Number.isSafeInteger(maxCycles) || maxCycles < 1) {
    throw new Error('maxCycles must be a positive finite safe integer.');
  }
  if (options.git === true) {
    throw new Error('Automatic Git writes are disabled. Review and commit changes separately.');
  }
  fs.mkdirSync(LOGS_DIR, { recursive: true });
  // Never remove another runner's lock, including a stale lock requiring owner review.
  const lock = fs.openSync(LOCK, 'wx');
  try {
    fs.writeFileSync(lock, `${process.pid}\n`);
    for (let cycle = 1; cycle <= maxCycles; cycle++) {
      const started = new Date().toISOString();
      fs.writeFileSync(LIVE_LOG, `${started} Cycle ${cycle}/${maxCycles}: RUNNING\n`);
      try {
        enforceRootHygiene();
        run('node .agents/orchestrator/check-five-way-and-file-limits.js');
        if (options.vitest !== false) {
          run(
            'npx --no-install vitest run server/routes/oqood.test.ts server/routes/pdc.test.ts server/routes/aegis.test.ts server/routes/v1Routes.test.ts src/components/dashboard/DashboardHeader.test.tsx',
            45000
          );
        }
        const result =
          options.vitest === false ? 'FILE LIMITS PASSED; TESTS SKIPPED' : 'SELECTED CHECKS PASSED';
        fs.appendFileSync(
          LIVE_LOG,
          `${result}\nNo implementation, deployment, Git synchronization, or billing verification performed.\n`
        );
        console.log(`Cycle ${cycle}/${maxCycles}: ${result}`);
      } catch (error) {
        fs.appendFileSync(LIVE_LOG, `FAILED: ${error.message}\n`);
        throw error;
      }
      if (cycle < maxCycles) await new Promise(resolve => setTimeout(resolve, 1500));
    }
  } finally {
    fs.closeSync(lock);
    fs.unlinkSync(LOCK);
  }
}

export function parseOptions(args) {
  let maxCycles = 1;
  let vitest = true;
  let cycleOptionSeen = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--skip-git') continue; // Legacy flag; Git writes are always disabled.
    if (args[i] === '--skip-test') {
      vitest = false;
    } else if (args[i] === '--once' || args[i] === '--cycles') {
      if (cycleOptionSeen) throw new Error('Specify only one of --once or --cycles.');
      cycleOptionSeen = true;
      if (args[i] === '--cycles') {
        const value = args[++i];
        if (!/^[1-9]\d*$/.test(value ?? '') || !Number.isSafeInteger(Number(value))) {
          throw new Error('--cycles requires a positive finite safe integer.');
        }
        maxCycles = Number(value);
      }
    } else {
      throw new Error(`Unknown option: ${args[i]}`);
    }
  }
  return { maxCycles, vitest };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  Promise.resolve()
    .then(() => runPerpetualLoop(parseOptions(process.argv.slice(2))))
    .catch(error => {
      console.error(`[Ouroboros] Stopped: ${error.message}`);
      process.exitCode = 1;
    });
}
