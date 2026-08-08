/* eslint-disable security/detect-non-literal-fs-filename, no-console */
import fs from 'fs';
import path from 'path';
import { runGovernanceAudit } from './orchestrator/governance-audit.js';

const repoRoot = process.cwd();
const plansDir = path.join(repoRoot, 'docs', 'plans');

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
function assertContains(fileRelativePath, needle) {
  const absolutePath = path.join(repoRoot, fileRelativePath);
  const content = readFileSafe(absolutePath);
  if (!content.includes(needle)) {
    errors.push(`${fileRelativePath} is missing required reference: ${needle}`);
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
    links.add(`docs/plans/${match[1]}`);
  }

  return [...links];
}

// Required governance files
[
  'docs/plans/MASTER_PLAN.md',
  'docs/plans/PENDING_TASKS_ONLY.md',
  'docs/plans/INDEX.md',
  'docs/plans/PLANNING_GOVERNANCE.md',
  'docs/plans/PHASE_PLAN_TEMPLATE.md',
  'docs/plans/PLANNING_DOC_DEFINITION_OF_DONE.md',
  'docs/plans/README.md',
  'docs/plans/waves/README.md',
  'PROJECT_PROGRESS.md',
  'DAILY_MILESTONE_TRACKER.md',
  // AEGIS infrastructure files (Vector 6.6)
  'docs/plans/AEGIS_RUN_LOG.md',
  'docs/plans/AUTOPILOT_QUEUE.md',
  'docs/plans/AEGIS_WORKFORCE.md',
  // Architecture Decision Records (Vector 5.1)
  'docs/software_docs/adr/README.md',
  'docs/software_docs/adr/ADR-001-auth-dual-provider.md',
  'docs/software_docs/adr/ADR-002-mongodb-prisma.md',
  'docs/software_docs/adr/ADR-003-crm-module-registry.md',
  'docs/software_docs/adr/ADR-004-wave-gate-model.md',
  'docs/software_docs/adr/ADR-005-superuser-lion-pattern.md',
  // Wave 25 syndication services (V6.6)
  'server/services/syndication/propertyFinderService.ts',
  'server/services/syndication/bayutService.ts',
  // Wave 25/26 backlogs (V6.6)
  'docs/plans/waves/WAVE_25_IMPLEMENTATION_BACKLOG.md',
  'docs/plans/waves/WAVE_26_IMPLEMENTATION_BACKLOG.md',
  'docs/plans/waves/WAVE_28_IMPLEMENTATION_BACKLOG.md',
  'docs/plans/waves/WAVE_29_IMPLEMENTATION_BACKLOG.md',
  'docs/plans/waves/WAVE_30_IMPLEMENTATION_BACKLOG.md',
  // DLD/Ejari mock services (V1.3)
  'server/services/mock/dldMockService.ts',
  'server/services/mock/ejariMockService.ts',
  // 3-Folder Strategy Architecture (Turn 6 Autopilot)
  'docs/business_docs/04_workflows/md-operations-workflows.md',
  'docs/business_docs/02_services/dubai-agency-services.md',
  'docs/business_docs/01_company_structure/department-handbook.md',
  'docs/business_docs/01_company_structure/employee-payroll-handbook.md',
  'docs/software_docs/sdd-md-operations.md',
  'docs/software_docs/property-inventory-schema.md',
  'src/components/crm/EmployeeLeaderboardPanel.tsx',
].forEach(assertExists);

assertNoPastedArtifacts();
assertIndexLinksExist('docs/plans/INDEX.md');
assertIndexLinksExist('docs/plans/README.md');
assertIndexLinksExist('docs/plans/waves/README.md');
assertContains('docs/plans/README.md', 'AUTHORITATIVE_DOC_MAP_2026-08-06.md');
assertContains('docs/business_docs/README.md', 'AUTHORITATIVE_DOC_MAP_2026-08-06.md');
assertContains('docs/software_docs/INDEX.md', 'AUTHORITATIVE_DOC_MAP_2026-08-06.md');
assertContains('docs/plans/README.md', 'RELEASE_AND_ROLLOUT_NOTES_TEMPLATE_2026-08-06.md');
assertCrossTrackerConsistency();

const requiredPointers = ['MASTER_PLAN.md', 'PENDING_TASKS_ONLY.md'];
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
  'docs/plans/README.md',
  'docs/plans/INDEX.md',
  'docs/plans/PENDING_TASKS_ONLY.md',
  'docs/plans/PLANNING_GOVERNANCE.md',
  'docs/AUTHORITATIVE_DOC_MAP_2026-08-06.md',
  'docs/RELEASE_AND_ROLLOUT_NOTES_TEMPLATE_2026-08-06.md',
  'docs/plans/waves/README.md',
].forEach(file => assertRecentUpdatedDate(file, 45));

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
