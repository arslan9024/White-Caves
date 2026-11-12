#!/usr/bin/env node
/**
 * validate-structure.mjs — Mechanical enforcement for TURING-RULE-005..009.
 * =========================================================================
 * Checks (all zero-dependency, run via `npm run validate:structure`):
 *   1. Twin files        — same-basename .jsx/.tsx or .js/.ts in one folder (RULE-007)
 *   2. Zombie suffixes   — _NEW/_OLD/_backup/_copy/.backup./.old. names   (RULE-007)
 *   3. Banned imports    — axios/joi/react-query/react-spring/next/UI kits (RULE-006)
 *   4. Banned deps       — overlapping libraries in package.json           (RULE-006)
 *   5. JS ratchet        — .js/.jsx source count must never increase       (RULE-009)
 *   6. 350-line ratchet  — oversized-file count must never increase        (Single Purpose File Law)
 *   7. Frozen dirs       — components/common + molecules accept no files   (RULE-008)
 *   8. Prisma freeze     — files importing @prisma/client must not grow    (RULE-005)
 *
 * Twin/zombie/banned-import findings present in the baseline are grandfathered
 * legacy debt: only NEW entries fail the build, and the lists shrink as debt
 * is paid down. Ratchets compare counts against scripts/structure-baseline.json.
 * Refresh after legitimate reductions: node scripts/validate-structure.mjs --update-baseline
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_PATH = join(ROOT, 'scripts', 'structure-baseline.json');
const SOURCE_ROOTS = ['src', 'server', 'api'];
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', '.next']);
const SOURCE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

const BANNED_IMPORTS = [
  { pattern: /from\s+['"]axios['"]/, lib: 'axios', use: 'native fetch / fetchWithRetry' },
  { pattern: /from\s+['"]joi['"]/, lib: 'joi', use: 'zod' },
  { pattern: /from\s+['"]@?tanstack\/react-query['"]|from\s+['"]react-query['"]/, lib: 'react-query', use: 'Redux Toolkit' },
  { pattern: /from\s+['"]@?react-spring(\/|['"])|from\s+['"]react-spring['"]/, lib: 'react-spring', use: 'framer-motion' },
  { pattern: /from\s+['"]next(\/|['"])/, lib: 'next', use: 'Vite + react-router' },
  { pattern: /from\s+['"]@chakra-ui\//, lib: '@chakra-ui', use: 'in-house design system (src/components/ui)' },
  { pattern: /from\s+['"]@mui\//, lib: '@mui', use: 'in-house design system (src/components/ui)' },
  { pattern: /from\s+['"]antd['"]/, lib: 'antd', use: 'in-house design system (src/components/ui)' },
  { pattern: /from\s+['"]moment['"]/, lib: 'moment', use: 'date-fns' },
  { pattern: /from\s+['"]zustand['"]/, lib: 'zustand', use: 'Redux Toolkit' },
  { pattern: /from\s+['"]swr['"]/, lib: 'swr', use: 'Redux Toolkit thunks' },
];

const BANNED_DEPS = [
  'joi', 'yup', 'react-query', '@tanstack/react-query', 'react-spring',
  'next', 'moment', 'zustand', 'swr', '@chakra-ui/react', '@mui/material', 'antd', 'bootstrap',
];
// axios is NOT in BANNED_DEPS: server/services/whatsapp/metaAPI.ts legitimately
// depends on it until its fetch migration; all other importers are grandfathered
// in the baseline and new axios imports still fail via BANNED_IMPORTS.

const ZOMBIE_PATTERN = /(_NEW|_OLD|_backup|_copy|\.backup\.|\.old\.)/i;
const FROZEN_DIRS = ['src/components/common', 'src/components/molecules'];
const MAX_LINES = 350;

const updateBaseline = process.argv.includes('--update-baseline');
const violations = [];
const twins = [];
const zombies = [];
const bannedImportHits = [];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name), files);
    } else {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

const allFiles = SOURCE_ROOTS.flatMap((root) => {
  const abs = join(ROOT, root);
  return existsSync(abs) ? walk(abs) : [];
}).map((f) => relative(ROOT, f).replace(/\\/g, '/'));

const sourceFiles = allFiles.filter((f) => SOURCE_EXTS.has(extname(f)));
const isTest = (f) => /\.(test|spec)\.[jt]sx?$/.test(f) || f.includes('__tests__');

// ── 1. Twin files ────────────────────────────────────────────────────────────
const byBase = new Map();
for (const f of sourceFiles) {
  const key = join(dirname(f), basename(f, extname(f))).replace(/\\/g, '/');
  (byBase.get(key) ?? byBase.set(key, []).get(key)).push(extname(f));
}
for (const [key, exts] of byBase) {
  const hasTwin = (exts.includes('.jsx') && exts.includes('.tsx')) || (exts.includes('.js') && exts.includes('.ts'));
  if (hasTwin) twins.push(`${key}{${exts.sort().join(',')}}`);
}

// ── 2. Zombie suffixes ───────────────────────────────────────────────────────
for (const f of allFiles) {
  if (ZOMBIE_PATTERN.test(f)) zombies.push(f);
}

// ── 3. Banned imports ────────────────────────────────────────────────────────
for (const f of sourceFiles) {
  const content = readFileSync(join(ROOT, f), 'utf8');
  for (const { pattern, lib, use } of BANNED_IMPORTS) {
    if (pattern.test(content)) bannedImportHits.push(`${f}::${lib}::${use}`);
  }
}

// ── 4. Banned dependencies ───────────────────────────────────────────────────
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const declared = { ...pkg.dependencies, ...pkg.devDependencies };
for (const dep of BANNED_DEPS) {
  if (declared[dep]) violations.push(`[RULE-006 dep] package.json declares "${dep}" — remove (duplicates a designated library)`);
}

// ── 5–8. Ratchet metrics ─────────────────────────────────────────────────────
const jsSourceCount = sourceFiles.filter((f) => /\.(js|jsx)$/.test(f) && !isTest(f)).length;
const oversized = sourceFiles.filter((f) => readFileSync(join(ROOT, f), 'utf8').split('\n').length > MAX_LINES);
const frozenCounts = Object.fromEntries(
  FROZEN_DIRS.map((d) => [d, allFiles.filter((f) => f.startsWith(`${d}/`)).length])
);
const prismaImporters = sourceFiles.filter((f) => /@prisma\/client/.test(readFileSync(join(ROOT, f), 'utf8'))).length;

const metrics = {
  jsSourceCount,
  oversizedCount: oversized.length,
  frozenCounts,
  prismaImporters,
  twins: twins.sort(),
  zombies: zombies.sort(),
  bannedImportHits: bannedImportHits.sort(),
};

if (updateBaseline) {
  writeFileSync(BASELINE_PATH, `${JSON.stringify(metrics, null, 2)}\n`);
  console.log(
    `Baseline updated (js=${jsSourceCount}, oversized=${oversized.length}, twins=${twins.length}, zombies=${zombies.length}, bannedImports=${bannedImportHits.length}, prismaImporters=${prismaImporters})`
  );
} else if (existsSync(BASELINE_PATH)) {
  const base = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
  const baseTwins = new Set(base.twins ?? []);
  const baseZombies = new Set(base.zombies ?? []);
  const baseImports = new Set(base.bannedImportHits ?? []);

  for (const t of twins) {
    if (!baseTwins.has(t)) violations.push(`[RULE-007 twin] ${t} — delete the superseded variant`);
  }
  for (const z of zombies) {
    if (!baseZombies.has(z)) violations.push(`[RULE-007 zombie] ${z} — rename or delete`);
  }
  for (const hit of bannedImportHits) {
    if (!baseImports.has(hit)) {
      const [file, lib, use] = hit.split('::');
      violations.push(`[RULE-006 import] ${file} imports "${lib}" — use ${use}`);
    }
  }
  if (jsSourceCount > base.jsSourceCount)
    violations.push(`[RULE-009 ratchet] JS source files grew ${base.jsSourceCount} → ${jsSourceCount} — new code must be TypeScript`);
  if (oversized.length > base.oversizedCount)
    violations.push(`[350-line ratchet] oversized files grew ${base.oversizedCount} → ${oversized.length}`);
  for (const [dir, count] of Object.entries(frozenCounts)) {
    if (count > (base.frozenCounts?.[dir] ?? 0))
      violations.push(`[RULE-008 frozen] ${dir} gained files (${base.frozenCounts?.[dir] ?? 0} → ${count}) — folder is frozen`);
  }
  if (prismaImporters > base.prismaImporters)
    violations.push(`[RULE-005 freeze] @prisma/client importers grew ${base.prismaImporters} → ${prismaImporters} — Prisma is frozen pending Wave H`);
} else {
  violations.push('[config] scripts/structure-baseline.json missing — run with --update-baseline once');
}

// ── Report ───────────────────────────────────────────────────────────────────
if (violations.length > 0 && !updateBaseline) {
  console.error(`validate-structure: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}
console.log(
  `validate-structure: OK (js=${jsSourceCount}, oversized=${oversized.length}, prismaImporters=${prismaImporters})`
);
