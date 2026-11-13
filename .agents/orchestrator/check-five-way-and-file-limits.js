/**
 * AEGIS Governance Validator: 7-Category Architecture & Single Purpose File Limits (< 350 lines)
 *
 * Scope:
 * 1. Single Purpose File Law: Source files must not exceed 350 lines.
 * 2. Filename inventory only: does not prove single responsibility or test coverage.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const MAX_LINES = 350;

// Directories to ignore during line length scan
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  '.agents',
  'coverage',
  'playwright-report',
  'package-lock.json',
  'prisma/schema.prisma',
];

function getLinesCount(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content) return 0;
  return content.split('\n').length - (content.endsWith('\n') ? 1 : 0);
}

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (IGNORE_PATTERNS.includes(file)) continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (
      file.endsWith('.ts') ||
      file.endsWith('.tsx') ||
      file.endsWith('.js') ||
      file.endsWith('.jsx')
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function auditFileLimits() {
  console.log(
    '🔍 [AEGIS Governance] Auditing 350-line Single Purpose File Law in src/ & server/...\n'
  );
  const files = walkDir(SRC_DIR).concat(walkDir(path.join(ROOT, 'server')));
  const oversized = [];

  for (const file of files) {
    // Skip test files, mock fixtures, and auto-generated data fixtures
    if (file.includes('.test.') || file.includes('.spec.') || file.includes('__mocks__')) continue;
    const lines = getLinesCount(file);
    if (lines > MAX_LINES) {
      oversized.push({ file: path.relative(ROOT, file), lines });
    }
  }

  oversized.sort((a, b) => b.lines - a.lines);

  console.log(`Audited ${files.length} source files.`);
  if (oversized.length === 0) {
    console.log('✅ 100% of non-test source files adhere to the 350-line Single Purpose File Law!');
  } else {
    console.log(`❌ Found ${oversized.length} non-test source files exceeding the 350-line limit:`);
    oversized.slice(0, 10).forEach(o => {
      console.log(
        `   - ${o.file} (${o.lines} lines) -> Target: Split into View/Logic/Styles/Data/Config/Test/Workflow`
      );
    });
  }

  return { total: files.length, oversizedCount: oversized.length, oversized };
}

export function auditSevenCategoryArchitecture() {
  console.log(
    '\n🔍 [AEGIS Governance] Inventorying co-located filenames in src/components/ (not semantic compliance)...\n'
  );
  const compDir = path.join(SRC_DIR, 'components');
  let complianceScore = 0;
  let auditedComponents = 0;
  let testedComponents = 0;
  let workflowComponents = 0;

  function scanComponentDir(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const subFiles = entries.filter(e => !e.isDirectory()).map(e => e.name);
    const hasView = subFiles.some(
      f =>
        !/\.(test|spec)\./.test(f) &&
        (f.includes('.view.') || f.endsWith('.tsx') || f.endsWith('.jsx'))
    );
    const hasTest = subFiles.some(f => f.includes('.test.') || f.includes('.spec.'));
    const hasWorkflow = subFiles.some(
      f => f.includes('.workflow.') || f.includes('.dnd.') || f.includes('.pipeline.')
    );

    if (hasView) {
      auditedComponents++;
      const hasLogic = subFiles.some(f => f.includes('.logic.') || /^use.*\.ts$/.test(f));
      const hasStyles = subFiles.some(f => f.includes('.styles.'));
      const hasData = subFiles.some(f => f.includes('.data.') || f.includes('.registries.'));
      const hasConfig = subFiles.some(f => f.includes('.config.') || f.includes('.types.'));
      if (hasLogic && hasStyles && hasData && hasConfig && hasTest && hasWorkflow)
        complianceScore++;
      if (hasTest) testedComponents++;
      if (hasWorkflow) workflowComponents++;
    }

    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith('_') &&
        !entry.name.startsWith('.') &&
        entry.name !== 'node_modules'
      ) {
        scanComponentDir(path.join(dirPath, entry.name));
      }
    }
  }

  if (fs.existsSync(compDir)) scanComponentDir(compDir);

  console.log(`Audited ${auditedComponents} component directories.`);
  console.log(`   - All seven filename categories present: ${complianceScore} directories.`);
  console.log(
    '   - File presence does not establish architecture compliance or executed test coverage.'
  );
  console.log(`   - Test filenames present: ${testedComponents} component directories.`);
  console.log(`   - Workflow filenames present: ${workflowComponents} component directories.`);
  return { auditedComponents, complianceScore, testedComponents, workflowComponents };
}

// Backwards compatibility aliases
export const auditSixCategoryArchitecture = auditSevenCategoryArchitecture;
export const auditFiveWayCategories = auditSevenCategoryArchitecture;

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = auditFileLimits();
    auditSevenCategoryArchitecture();
    if (result.oversizedCount > 0) process.exitCode = 1;
  } catch (error) {
    console.error(`[AEGIS Governance] Audit failed: ${error.message}`);
    process.exitCode = 1;
  }
}
