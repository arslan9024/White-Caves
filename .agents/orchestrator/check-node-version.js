#!/usr/bin/env node

/**
 * Dev runtime guard for White Caves.
 *
 * PDF.js 6 and Lighthouse CI require Node >=22.19.
 * We fail fast with a clear message so users don't hit opaque runtime errors.
 */

import { fileURLToPath } from 'node:url';

/** @param {string} version */
export function isSupportedNodeVersion(version) {
  const parsed = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!parsed) return false;
  const major = Number(parsed[1]);
  const minor = Number(parsed[2]);
  return major > 22 || (major === 22 && minor >= 19);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const currentRaw = process.versions.node || '';
  const isSupported = isSupportedNodeVersion(currentRaw);

  if (isSupported) {
    process.exit(0);
  }

  console.error('');
  console.error('[DEV PRECHECK FAILED] Unsupported Node.js version for this toolchain.');
  console.error(`Current : v${currentRaw}`);
  console.error('Required: >=22.19.0');
  console.error('');
  console.error(
    'Why this fails: PDF.js 6 and related dependencies require a supported Node.js runtime.'
  );
  console.error('Recommended fix: upgrade Node, then run npm install and npm run dev again.');
  console.error('');
  process.exit(1);
}
