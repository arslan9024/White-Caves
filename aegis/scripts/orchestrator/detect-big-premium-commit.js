#!/usr/bin/env node
import { execSync } from 'node:child_process';

function run(command) {
  return execSync(command, { stdio: ['ignore', 'pipe', 'pipe'] })
    .toString()
    .trim();
}

function safeRun(command) {
  try {
    return run(command);
  } catch {
    return '';
  }
}

function parseNumstat(output) {
  const lines = output.split(/\r?\n/).filter(Boolean);
  let filesChanged = 0;
  let insertions = 0;
  let deletions = 0;
  const files = [];

  for (const line of lines) {
    const [insRaw, delRaw, filePath] = line.split(/\t/);
    if (!filePath) continue;

    filesChanged += 1;
    files.push(filePath);

    const ins = Number.isNaN(Number(insRaw)) ? 0 : Number(insRaw);
    const del = Number.isNaN(Number(delRaw)) ? 0 : Number(delRaw);
    insertions += ins;
    deletions += del;
  }

  return { filesChanged, insertions, deletions, totalChangedLines: insertions + deletions, files };
}

function matchesCriticalPaths(file) {
  const normalized = file.replace(/\\/g, '/');

  if (
    normalized.startsWith('src/store/') ||
    normalized.startsWith('src/services/') ||
    normalized.startsWith('server/') ||
    normalized.startsWith('prisma/')
  ) {
    return true;
  }

  if (normalized === 'package.json') {
    return true;
  }

  if (normalized.startsWith('vite.config.')) {
    return true;
  }

  return (
    normalized === 'tsconfig.json' ||
    (normalized.startsWith('tsconfig.') && normalized.endsWith('.json'))
  );
}

function detect() {
  const commitMessage = safeRun('git log -1 --pretty=%B');
  const numstat = safeRun('git show --numstat --format="" HEAD');
  const parsed = parseNumstat(numstat);

  const hasPremiumTag = /\[premium-wave\]/i.test(commitMessage);
  const hitsCriticalPath = parsed.files.some(matchesCriticalPaths);

  const isBigByThreshold =
    parsed.filesChanged >= 20 || parsed.totalChangedLines >= 800 || hitsCriticalPath;

  const shouldRun = hasPremiumTag && isBigByThreshold;

  return {
    commitMessage,
    hasPremiumTag,
    ...parsed,
    hitsCriticalPath,
    isBigByThreshold,
    shouldRun,
    reason: shouldRun
      ? 'Premium-wave commit qualifies for runtime guard checks.'
      : 'Skipped: requires [premium-wave] tag and big-commit threshold.',
  };
}

const result = detect();
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exit(0);
