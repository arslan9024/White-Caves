#!/usr/bin/env node

/**
 * Dev runtime guard for White Caves.
 *
 * Vite 7+ in this repository requires Node >=20.19 (or >=22.12).
 * We fail fast with a clear message so users don't hit opaque runtime errors.
 */

const required = {
  major: 20,
  minor: 19,
};

const currentRaw = process.versions.node || '';
const [majorRaw = '0', minorRaw = '0'] = currentRaw.split('.');
const major = Number.parseInt(majorRaw, 10);
const minor = Number.parseInt(minorRaw, 10);

const isValidNumber = Number.isInteger(major) && Number.isInteger(minor);
const isSupported =
  isValidNumber && (major > required.major || (major === required.major && minor >= required.minor) || major >= 22);

if (isSupported) {
  process.exit(0);
}

console.error('');
console.error('[DEV PRECHECK FAILED] Unsupported Node.js version for this toolchain.');
console.error(`Current : v${currentRaw}`);
console.error('Required: >=20.19.x or >=22.12.x');
console.error('');
console.error('Why this fails: Vite 7+ and related deps require newer Node APIs.');
console.error('Recommended fix: upgrade Node, then run npm install and npm run dev again.');
console.error('');
process.exit(1);
