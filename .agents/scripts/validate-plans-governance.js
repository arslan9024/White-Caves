/* eslint-disable security/detect-non-literal-fs-filename, no-console */
import fs from 'fs';
import path from 'path';
import { runGovernanceAudit } from '../orchestrator/governance-audit.js';

const repoRoot = process.cwd();
const plansDir = path.join(repoRoot, '.agents', 'plans');

const errors = [];
const warnings = [];

function readFileSafe(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function assertExists(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function assertNoPastedArtifacts() {
  if (!fs.existsSync(plansDir)) {
    errors.push('Missing canonical plans directory: .agents/plans');
    return;
  }
  const entries = fs.readdirSync(plansDir);
  const pasted = entries.filter(name => /^Pasted-/.test(name));
  if (pasted.length > 0) {
    errors.push(`Found ad-hoc Pasted artifacts in .agents/plans/: ${pasted.join(', ')}`);
  }
}

function assertIndexLinksExist(indexRelativePath) {
  const absolutePath = path.join(repoRoot, indexRelativePath);
  const content = readFileSafe(absolutePath);
  if (!content) return;
  const baseDir = path.dirname(absolutePath);
  const linkRegex = /\[[^\]]+\]\(\.\/([^)#]+)\)/g;
  const seen = new Set();
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const target = match[1];
    if (seen.has(target)) continue;
    seen.add(target);

    const targetAbsolute = path.join(baseDir, target);
    if (!fs.existsSync(targetAbsolute)) {
      errors.push(`${indexRelativePath} contains broken link: ./${target}`);
    }
  }
}

// Required canonical governance files (.agents/ encapsulation, TURING-ROOT-007)
[
  '.agents/plans/INDEX.md',
  '.agents/plans/MASTER_STRATEGIC_PLAN.md',
  '.agents/plans/planning-governance.md',
  '.agents/plans/daily-milestone-tracker.md',
  '.agents/plans/feature-coverage-matrix.md',
  // Hyper-Linked HTML Documentation Engines (Zoe AI 3.10 & Aurora AI 3.11)
  'src/data/zoeBusinessDocsRegistry.ts',
  'src/data/auroraSoftwareDocsRegistry.ts',
  'src/components/crm/ZoeBusinessHub/ZoeBusinessHub.tsx',
  'src/components/crm/AuroraSoftwareHub/AuroraSoftwareHub.tsx',
  'src/components/crm/EmployeeLeaderboardPanel.tsx',
].forEach(assertExists);

assertNoPastedArtifacts();
assertIndexLinksExist('.agents/plans/INDEX.md');

const governanceAudit = runGovernanceAudit();
errors.push(...governanceAudit.errors);
warnings.push(...governanceAudit.warnings);

if (warnings.length > 0) {
  console.warn('⚠️  Planning governance warnings:');
  for (const warning of warnings) {
    console.warn(` - ${warning}`);
  }
}

if (errors.length > 0) {
  console.error('❌ Planning governance validation failed:');
  for (const error of errors) {
    console.error(` - ${error}`);
  }
  process.exit(1);
}

console.log('✅ Planning governance validation passed.');
