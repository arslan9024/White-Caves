/* eslint-disable security/detect-non-literal-fs-filename, no-console */
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const errors = [];
const warnings = [];

function readFileSafe(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) return '';
  return fs.readFileSync(absolutePath, 'utf8');
}

function assertExists(relativePath) {
  if (!fs.existsSync(path.join(repoRoot, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function assertContains(relativePath, token, message) {
  const content = readFileSafe(relativePath);
  if (!content.includes(token)) {
    errors.push(`${relativePath} ${message}`);
  }
}

function assertNotContains(relativePath, token, message) {
  const content = readFileSafe(relativePath);
  if (content.includes(token)) {
    errors.push(`${relativePath} ${message}`);
  }
}

function assertReferenceBanner(relativePath) {
  const content = readFileSafe(relativePath);
  if (!content.includes('REFERENCE COPY')) {
    errors.push(`${relativePath} missing \"REFERENCE COPY\" banner`);
  }
}

function run() {
  // Required W46 anti-dup governance artifacts
  assertExists('plans/WAVE_46_SAFE_DELETE_REPORT_2026-09-03.md');
  assertExists('plans/WAVE_46_DOCS_PLANS_DEDUP_MATRIX_2026-09-03.md');
  assertExists('plans/WAVE_46_BUSINESS_DOCS_CANONICAL_DECISION_2026-09-03.md');

  // Mirror policy checks
  assertReferenceBanner('docs/plans/MASTER_PLAN.md');
  assertReferenceBanner('docs/plans/PENDING_TASKS_ONLY.md');

  // Canonical business-doc path checks in active trackers
  assertNotContains(
    'plans/MASTER_PLAN.md',
    'business_docs/',
    'contains legacy business_docs/ alias (use docs/business_docs/)'
  );

  // In PENDING_TASKS_ONLY, allow docs/business_docs but disallow legacy root alias
  const pendingContent = readFileSafe('plans/PENDING_TASKS_ONLY.md');
  if (pendingContent.includes('business_docs/') && !pendingContent.includes('docs/business_docs/')) {
    errors.push(
      'plans/PENDING_TASKS_ONLY.md contains legacy business_docs/ alias without canonical docs/business_docs/ path'
    );
  }

  // Safe-delete regression check (file removed in W46-008)
  if (fs.existsSync(path.join(repoRoot, 'docs/plans/PHASE1_COMPLETE.md'))) {
    errors.push('docs/plans/PHASE1_COMPLETE.md reintroduced after W46-008 safe-delete');
  }

  // Ensure Wave 46 backlog points to active W46-009 stage
  assertContains(
    'docs/plans/waves/WAVE_46_IMPLEMENTATION_BACKLOG.md',
    'W46-009',
    'must include W46-009 anti-dup governance task'
  );

  // Non-blocking advisory: docs/plans mirror for daily tracker banner
  const dailyMirror = readFileSafe('docs/plans/DAILY_MILESTONE_TRACKER.md');
  if (!dailyMirror.includes('REFERENCE COPY')) {
    warnings.push('docs/plans/DAILY_MILESTONE_TRACKER.md has no REFERENCE COPY banner (advisory)');
  }

  if (warnings.length > 0) {
    console.warn('⚠️ Dedup governance warnings:');
    for (const warning of warnings) {
      console.warn(` - ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error('❌ Dedup governance validation failed:');
    for (const error of errors) {
      console.error(` - ${error}`);
    }
    process.exit(1);
  }

  console.log('✅ Dedup governance validation passed.');
}

run();
