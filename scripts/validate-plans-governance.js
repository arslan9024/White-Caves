/* eslint-disable security/detect-non-literal-fs-filename, no-console */
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const plansDir = path.join(repoRoot, 'plans');

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
  const entries = fs.readdirSync(plansDir);
  const pasted = entries.filter(name => /^Pasted-/.test(name));
  if (pasted.length > 0) {
    errors.push(`Found ad-hoc Pasted artifacts in plans/: ${pasted.join(', ')}`);
  }
}

function assertStatusPointers(fileRelativePath, requiredPointers) {
  const absolutePath = path.join(repoRoot, fileRelativePath);
  const content = readFileSafe(absolutePath);
  for (const pointer of requiredPointers) {
    if (!content.includes(pointer)) {
      errors.push(`${fileRelativePath} missing status pointer: ${pointer}`);
    }
  }
}

function assertMetadata(fileRelativePath) {
  const absolutePath = path.join(repoRoot, fileRelativePath);
  const content = readFileSafe(absolutePath);
  const requiredPatterns = [
    /\*\*Date:\*\*|Last Updated:|\*\*Last Updated\*\*:/,
    /\*\*Status:\*\*|> \*\*Status\*\*:/,
  ];

  for (const pattern of requiredPatterns) {
    if (!pattern.test(content)) {
      errors.push(`${fileRelativePath} missing required metadata (${pattern})`);
    }
  }
}

function assertRecentUpdatedDate(fileRelativePath, maxAgeDays = 45) {
  const absolutePath = path.join(repoRoot, fileRelativePath);
  const content = readFileSafe(absolutePath);
  const match = content.match(
    /(?:Last Updated:|\*\*Last Updated:\*\*)\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i
  );

  if (!match) {
    warnings.push(`${fileRelativePath} has no ISO Last Updated date for stale-check`);
    return;
  }

  const updatedAt = new Date(match[1]);
  const now = new Date();
  const ageDays = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
  if (ageDays > maxAgeDays) {
    errors.push(`${fileRelativePath} is stale (${ageDays} days old)`);
  }
}

function assertIndexLinksExist(indexRelativePath) {
  const absolutePath = path.join(repoRoot, indexRelativePath);
  const content = readFileSafe(absolutePath);
  const baseDir = path.dirname(absolutePath);
  const linkRegex = /\[[^\]]+\]\(\.\/([^)]+)\)/g;
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

function assertCrossTrackerConsistency() {
  const projectProgress = readFileSafe(path.join(repoRoot, 'PROJECT_PROGRESS.md'));
  const daily = readFileSafe(path.join(repoRoot, 'DAILY_MILESTONE_TRACKER.md'));
  const pending = readFileSafe(path.join(plansDir, 'PENDING_TASKS_ONLY.md'));

  // All tracker/queue files must reference the canonical roadmap
  const requiredInAll = ['MASTER_PLAN.md'];

  // Dashboard and daily log must also reference the pending queue
  const requiredInDashboards = ['PENDING_TASKS_ONLY.md'];

  const allFiles = [
    ['PROJECT_PROGRESS.md', projectProgress],
    ['DAILY_MILESTONE_TRACKER.md', daily],
    ['plans/PENDING_TASKS_ONLY.md', pending],
  ];

  const dashboardFiles = [
    ['PROJECT_PROGRESS.md', projectProgress],
    ['DAILY_MILESTONE_TRACKER.md', daily],
  ];

  for (const [name, content] of allFiles) {
    for (const token of requiredInAll) {
      if (!content.includes(token)) {
        errors.push(`${name} missing required active stream reference: ${token}`);
      }
    }
  }

  for (const [name, content] of dashboardFiles) {
    for (const token of requiredInDashboards) {
      if (!content.includes(token)) {
        errors.push(`${name} missing required active stream reference: ${token}`);
      }
    }
  }
}

function getLinkedPlanFilesFromPending(pattern) {
  const pendingPath = path.join(plansDir, 'PENDING_TASKS_ONLY.md');
  const content = readFileSafe(pendingPath);
  const links = new Set();
  let match;

  while ((match = pattern.exec(content)) !== null) {
    links.add(`plans/${match[1]}`);
  }

  return [...links];
}

// Required governance files
[
  'plans/MASTER_PLAN.md',
  'plans/PENDING_TASKS_ONLY.md',
  'plans/INDEX.md',
  'plans/PLANNING_GOVERNANCE.md',
  'plans/PHASE_PLAN_TEMPLATE.md',
  'plans/PLANNING_DOC_DEFINITION_OF_DONE.md',
  'plans/README.md',
  'plans/waves/README.md',
  'PROJECT_PROGRESS.md',
  'DAILY_MILESTONE_TRACKER.md',
].forEach(assertExists);

assertNoPastedArtifacts();
assertIndexLinksExist('plans/INDEX.md');
assertIndexLinksExist('plans/README.md');
assertIndexLinksExist('plans/waves/README.md');
assertCrossTrackerConsistency();

const requiredPointers = ['plans/MASTER_PLAN.md', 'plans/PENDING_TASKS_ONLY.md'];
assertStatusPointers('PROJECT_PROGRESS.md', requiredPointers);
assertStatusPointers('DAILY_MILESTONE_TRACKER.md', requiredPointers);

const activePhasePlans = getLinkedPlanFilesFromPending(/\[[^\]]+\]\(\.\/(PHASE_[^)]+\.md)\)/g);
for (const phasePlan of activePhasePlans) {
  assertExists(phasePlan);
  assertMetadata(phasePlan);
  assertStatusPointers(phasePlan, ['MASTER_PLAN.md', 'PENDING_TASKS_ONLY.md']);
}

const linkedWavePlans = getLinkedPlanFilesFromPending(/\[[^\]]+\]\(\.\/(waves\/[^)]+\.md)\)/g);
for (const wavePlan of linkedWavePlans) {
  assertExists(wavePlan);
}

[
  'PROJECT_PROGRESS.md',
  'DAILY_MILESTONE_TRACKER.md',
  'plans/README.md',
  'plans/INDEX.md',
  'plans/PENDING_TASKS_ONLY.md',
  'plans/PLANNING_GOVERNANCE.md',
  'plans/waves/README.md',
].forEach(file => assertRecentUpdatedDate(file, 45));

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
