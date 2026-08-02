#!/usr/bin/env node
import { execSync } from 'node:child_process';

function run(command) {
  return execSync(command, { stdio: ['ignore', 'pipe', 'pipe'] })
    .toString()
    .trim();
}

function runInherit(command) {
  execSync(command, { stdio: 'inherit' });
}

function log(message) {
  process.stdout.write(`${message}\n`);
}

function main() {
  const detectRaw = run('node scripts/orchestrator/detect-big-premium-commit.js');
  const detect = JSON.parse(detectRaw);

  log(`Premium commit detection: ${detect.reason}`);
  log(
    `  tag=${detect.hasPremiumTag} big=${detect.isBigByThreshold} files=${detect.filesChanged} lines=${detect.totalChangedLines} critical=${detect.hitsCriticalPath}`
  );

  if (!detect.shouldRun) {
    log('Skipping post-commit runtime guard.');
    process.exit(0);
  }

  log('Running premium post-commit runtime guard checks...');
  runInherit('node scripts/orchestrator/post-premium-runtime-check.js');
}

try {
  main();
} catch (error) {
  console.error('❌ Post-commit premium guard failed.');
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
