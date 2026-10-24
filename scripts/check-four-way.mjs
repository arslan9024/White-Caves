#!/usr/bin/env node
/**
 * White Caves — Four-Way inventory (Dept 3 + Dept 8)
 * Reports component folders that look 4-way complete vs legacy flat files.
 * Exit 0 always (report mode) unless --strict and violations found.
 *
 * Usage: node scripts/check-four-way.mjs [--strict]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const COMPONENTS = path.join(ROOT, 'src', 'components');
const STRICT = process.argv.includes('--strict');

const VIEW_EXT = /\.(tsx|jsx)$/;
const LOGIC = /\.logic\.ts$/;
const STYLE = /\.(style\.ts|styles\.ts|css)$/;
const DATA = /\.data\.ts$/;

function walkDirs(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      acc.push(full);
      walkDirs(full, acc);
    }
  }
  return acc;
}

function scoreFolder(dir) {
  const files = fs.readdirSync(dir).filter((f) => fs.statSync(path.join(dir, f)).isFile());
  const hasView = files.some((f) => VIEW_EXT.test(f) && !f.includes('.test.'));
  const hasLogic = files.some((f) => LOGIC.test(f));
  const hasStyle = files.some((f) => STYLE.test(f));
  const hasData = files.some((f) => DATA.test(f));
  const complete = hasView && hasLogic && hasStyle && hasData;
  return { dir, files, hasView, hasLogic, hasStyle, hasData, complete };
}

function listLegacyFlat(componentsRoot) {
  if (!fs.existsSync(componentsRoot)) return [];
  return fs
    .readdirSync(componentsRoot, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(jsx|tsx|css)$/.test(e.name) && !e.name.includes('.test.'))
    .map((e) => path.join(componentsRoot, e.name));
}

const folders = walkDirs(COMPONENTS).map(scoreFolder).filter((s) => s.hasView);
const complete = folders.filter((s) => s.complete);
const partial = folders.filter((s) => !s.complete);
const legacy = listLegacyFlat(COMPONENTS);

console.log('=== White Caves Four-Way Inventory ===');
console.log(`Component folders with a view: ${folders.length}`);
console.log(`Four-way complete:             ${complete.length}`);
console.log(`Partial (need migration):      ${partial.length}`);
console.log(`Legacy flat files under src/components: ${legacy.length}`);
console.log('');

if (partial.length) {
  console.log('--- Partial folders (sample up to 30) ---');
  for (const p of partial.slice(0, 30)) {
    const rel = path.relative(ROOT, p.dir);
    const flags = [
      p.hasView ? 'V' : '-',
      p.hasLogic ? 'L' : '-',
      p.hasStyle ? 'S' : '-',
      p.hasData ? 'D' : '-',
    ].join('');
    console.log(`  [${flags}] ${rel}`);
  }
  if (partial.length > 30) console.log(`  … +${partial.length - 30} more`);
  console.log('');
}

if (legacy.length) {
  console.log('--- Legacy flat files (sample up to 40) ---');
  for (const f of legacy.slice(0, 40)) {
    console.log(`  ${path.relative(ROOT, f)}`);
  }
  if (legacy.length > 40) console.log(`  … +${legacy.length - 40} more`);
  console.log('');
}

console.log('Policy: new UI must be four-way complete. Legacy migrates on-touch or by wave.');
console.log('See docs/governance/FOUR_WAY_RULE.md');

if (STRICT && (partial.length > 0 || legacy.length > 0)) {
  process.exit(1);
}
process.exit(0);
