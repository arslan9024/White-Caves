#!/usr/bin/env node

/**
 * Dev runtime guard for White Caves.
 *
 * PDF.js 6 and the application toolchain require Node 22.13+ or Node 24+.
 * We fail fast with a clear message so users don't hit opaque runtime errors.
 */

const required = {
  major: 22,
  minor: 13,
};

const currentRaw = process.versions.node || '';
const [majorRaw = '0', minorRaw = '0'] = currentRaw.split('.');
const major = Number.parseInt(majorRaw, 10);
const minor = Number.parseInt(minorRaw, 10);

const isValidNumber = Number.isInteger(major) && Number.isInteger(minor);
const isSupported =
  isValidNumber && ((major === required.major && minor >= required.minor) || major >= 24);

if (isSupported) {
  process.exit(0);
}

console.error('');
console.error('[DEV PRECHECK FAILED] Unsupported Node.js version for this toolchain.');
console.error(`Current : v${currentRaw}`);
console.error('Required: >=22.13.x or >=24.x');
console.error('');
console.error(
  'Why this fails: PDF.js 6 and related dependencies require a supported Node.js runtime.'
);
console.error('Recommended fix: upgrade Node, then run npm install and npm run dev again.');
console.error('');
process.exit(1);
