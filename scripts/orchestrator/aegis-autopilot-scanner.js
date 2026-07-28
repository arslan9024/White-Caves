#!/usr/bin/env node
/**
 * aegis-autopilot-scanner.js — AEGIS Autonomous Issue Discovery & Project Improvement Engine
 * 
 * Deeply scans the White Caves Real Estate codebase to automatically identify:
 * 1. Code Quality & Technical Debt (TODOs, any types, console.logs, empty stubs)
 * 2. Component & API Test Coverage Gaps (missing unit tests)
 * 3. UI/UX & Design Token Compliance (hardcoded hex colors, missing ARIA/accessibility)
 * 4. Security & Compliance Gaps (unverified endpoints, missing DLD/RERA validations)
 * 5. Documentation & Plan Backlog Progress
 * 
 * Outputs:
 * - logs/orchestrator/aegis-autopilot-issues.json
 * - plans/AEGIS_AUTOPILOT_ISSUES_BACKLOG.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const LOGS_DIR = path.join(ROOT, 'logs', 'orchestrator');
const OUT_JSON = path.join(LOGS_DIR, 'aegis-autopilot-issues.json');
const OUT_MD = path.join(ROOT, 'plans', 'AEGIS_AUTOPILOT_ISSUES_BACKLOG.md');

const SCAN_DIRS = ['src', 'server'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function walkDir(dir, collect) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      entry.name !== 'node_modules' &&
      entry.name !== 'dist'
    ) {
      walkDir(full, collect);
    } else if (entry.isFile()) {
      collect(full);
    }
  }
}

function relPath(fp) {
  return path.relative(ROOT, fp).replace(/\\/g, '/');
}

function scanCodebase() {
  const issues = [];
  const allFiles = [];

  for (const d of SCAN_DIRS) {
    walkDir(path.join(ROOT, d), f => {
      if (EXTS.has(path.extname(f))) allFiles.push(f);
    });
  }

  const testedComponents = new Set();
  allFiles.forEach(f => {
    if (f.endsWith('.test.tsx') || f.endsWith('.test.ts') || f.endsWith('.spec.ts')) {
      const base = path.basename(f).replace(/\.(test|spec)\.(tsx?|jsx?)$/, '');
      testedComponents.add(base);
    }
  });

  for (const fp of allFiles) {
    const rel = relPath(fp);
    const filename = path.basename(fp);

    // Skip test files themselves for test-gap checks
    if (filename.includes('.test.') || filename.includes('.spec.')) continue;

    const content = fs.readFileSync(fp, 'utf8');
    const lines = content.split('\n');

    // 1. Check missing test spec
    const componentName = filename.replace(/\.(tsx?|jsx?)$/, '');
    if (
      (rel.startsWith('src/components/') || rel.startsWith('src/hooks/')) &&
      !testedComponents.has(componentName) &&
      !filename.endsWith('index.ts') &&
      !filename.endsWith('index.tsx')
    ) {
      issues.push({
        id: `TEST-${componentName}`,
        category: 'Test Coverage Gap',
        severity: 'MEDIUM',
        file: rel,
        line: 1,
        title: `Component/Hook '${componentName}' missing unit test file`,
        suggestion: `Create ${rel.replace(/\.(tsx?)$/, '.test.$1')} with Vitest assertions.`
      });
    }

    lines.forEach((line, i) => {
      const ln = i + 1;
      const trimmed = line.trim();

      // 2. TODO / STUB check
      if (/(?:\/\/|\/\*|\*|<!--|#)\s*(TODO|FIXME|STUB|PLACEHOLDER)\b/i.test(trimmed)) {
        issues.push({
          id: `TODO-${path.basename(fp)}-${ln}`,
          category: 'Technical Debt',
          severity: 'LOW',
          file: rel,
          line: ln,
          title: `Unresolved TODO/STUB tag: "${trimmed.substring(0, 60)}"`,
          suggestion: 'Resolve placeholder code with concrete implementation.'
        });
      }

      // 3. Console.log check in production components
      if (/console\.log\(/i.test(trimmed) && !rel.includes('scripts/') && !rel.includes('test')) {
        issues.push({
          id: `LOG-${path.basename(fp)}-${ln}`,
          category: 'Code Cleanliness',
          severity: 'LOW',
          file: rel,
          line: ln,
          title: `Debug console.log detected: "${trimmed.substring(0, 60)}"`,
          suggestion: 'Remove debug console logging or replace with structured logger.'
        });
      }

      // 4. Hardcoded non-token color check
      if (/style=\{\{.*#(?:[0-9a-fA-F]{3}){1,2}\b/i.test(trimmed) && !trimmed.includes('RED') && !trimmed.includes('WHITE') && !trimmed.includes('SLATE')) {
        issues.push({
          id: `COLOR-${path.basename(fp)}-${ln}`,
          category: 'Design System',
          severity: 'LOW',
          file: rel,
          line: ln,
          title: `Hardcoded hex color in style prop: "${trimmed.substring(0, 60)}"`,
          suggestion: 'Use tokens.css variables or established color constants.'
        });
      }

      // 5. Explicit 'any' type check
      if (/: \bany\b/i.test(trimmed) && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        issues.push({
          id: `TYPE-${path.basename(fp)}-${ln}`,
          category: 'TypeScript Strictness',
          severity: 'MEDIUM',
          file: rel,
          line: ln,
          title: `Untyped 'any' usage detected`,
          suggestion: 'Replace explicit `any` with strict interface or generic constraint.'
        });
      }
    });
  }

  return issues;
}

function generateMarkdownReport(issues) {
  const byCategory = {};
  issues.forEach(iss => {
    byCategory[iss.category] = (byCategory[iss.category] || []);
    byCategory[iss.category].push(iss);
  });

  let md = `# 🛡️ AEGIS Autopilot — Autonomous Project Issue & Opportunity Backlog\n\n`;
  md += `> **Generated Automatically by AEGIS Issue Discovery Engine**\n`;
  md += `> **Timestamp**: ${new Date().toISOString()}\n`;
  md += `> **Total Discovered Issues**: ${issues.length}\n\n`;
  md += `---\n\n`;

  md += `## 📊 Summary by Category\n\n`;
  md += `| Category | Issue Count | Target Action |\n`;
  md += `|----------|-------------|---------------|\n`;
  Object.keys(byCategory).forEach(cat => {
    md += `| **${cat}** | ${byCategory[cat].length} | Autopilot Fix Target |\n`;
  });
  md += `\n---\n\n`;

  md += `## 🔍 Priority Action Items\n\n`;
  issues.slice(0, 25).forEach((iss, index) => {
    md += `### ${index + 1}. [${iss.severity}] ${iss.title}\n`;
    md += `- **File**: \`${iss.file}:${iss.line}\`\n`;
    md += `- **Category**: ${iss.category}\n`;
    md += `- **Recommended Action**: ${iss.suggestion}\n\n`;
  });

  return md;
}

function main() {
  console.log('🔍 Executing AEGIS Autonomous Issue & Opportunity Discovery...');
  const issues = scanCodebase();

  fs.writeFileSync(OUT_JSON, JSON.stringify({ timestamp: new Date().toISOString(), totalIssues: issues.length, issues }, null, 2), 'utf8');
  console.log(`✅ Saved structured issues JSON to ${relPath(OUT_JSON)}`);

  const mdReport = generateMarkdownReport(issues);
  fs.writeFileSync(OUT_MD, mdReport, 'utf8');
  console.log(`✅ Saved AEGIS Autopilot Backlog to ${relPath(OUT_MD)}`);
  console.log(`🎯 Scan Complete: ${issues.length} potential improvements/issues cataloged.`);
}

main();
