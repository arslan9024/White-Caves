#!/usr/bin/env node
import { execSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DEFAULT_APP_URL = process.env.APP_URL || 'http://localhost:5000';
const DEFAULT_RUNTIME_URL = process.env.RUNTIME_VERIFY_URL || 'http://localhost:3001';
const STARTUP_TIMEOUT_MS = Number(process.env.STARTUP_TIMEOUT_MS || 90000);
const POLL_MS = Number(process.env.STARTUP_POLL_MS || 2000);

function runStep(command, label) {
  process.stdout.write(`\n[STEP] ${label}\n`);
  execSync(command, { stdio: 'inherit' });
}

async function waitForHttp(url, timeoutMs = STARTUP_TIMEOUT_MS) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status < 500) {
        return true;
      }
    } catch {
      // keep polling
    }
    await new Promise(resolve => setTimeout(resolve, POLL_MS));
  }

  return false;
}

function getNpmBin() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function spawnDevProcess() {
  const npmBin = getNpmBin();

  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/c', npmBin, 'run', 'dev:all'], {
      stdio: 'inherit',
      shell: false,
      windowsHide: true,
    });
  }

  return spawn(npmBin, ['run', 'dev:all'], {
    stdio: 'inherit',
    shell: false,
    detached: true,
  });
}

async function runDevStartupProbe() {
  process.stdout.write('\n[STEP] Dev startup probe (npm run dev:all)\n');

  const devProcess = spawnDevProcess();

  const stopDevProcess = () => {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(devProcess.pid), '/f', '/t'], {
        stdio: 'ignore',
        shell: false,
      });
      return;
    }

    process.kill(-devProcess.pid, 'SIGTERM');
  };

  const appReady = await waitForHttp(DEFAULT_APP_URL);
  const apiReady = await waitForHttp(`${DEFAULT_RUNTIME_URL}/api/health`);

  if (!appReady) {
    throw new Error(`Frontend did not become ready at ${DEFAULT_APP_URL} within timeout.`);
  }

  if (!apiReady) {
    throw new Error(
      `Backend API did not become ready at ${DEFAULT_RUNTIME_URL}/api/health within timeout.`
    );
  }

  process.stdout.write('Dev probe passed (frontend + backend reachable).\n');

  return stopDevProcess;
}

function writeReport(status, details) {
  const sha = execSync('git rev-parse --short HEAD').toString().trim();
  const dir = join(process.cwd(), 'logs', 'premium-commit-checks');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${sha}.md`);

  const report = `# Premium Commit Runtime Check\n\n- Commit: ${sha}\n- Status: ${status}\n- Timestamp: ${new Date().toISOString()}\n\n## Details\n\n\`\`\`\n${details}\n\`\`\`\n`;

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  writeFileSync(file, report, 'utf8');
  process.stdout.write(`\nReport written: ${file}\n`);
}

(async () => {
  let stopDevProcess = null;

  try {
    runStep('npm run build', 'Build check');
    runStep('npm run quality:quick', 'Quick quality gate');
    stopDevProcess = await runDevStartupProbe();
    runStep(
      `npm run verify:runtime -- --url=${DEFAULT_APP_URL} --timeout=15000 --retries=2`,
      'Runtime endpoint verification'
    );

    writeReport('PASS', 'All premium post-commit runtime checks passed.');
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    writeReport('FAIL', message);
    console.error('\n❌ Premium post-commit runtime checks failed.');
    process.exit(1);
  } finally {
    stopDevProcess?.();
  }
})();
