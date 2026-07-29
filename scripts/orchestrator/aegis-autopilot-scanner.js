#!/usr/bin/env node
/**
 * aegis-autopilot-scanner.js — AEGIS 12-Target Critical Upgrade Engine
 * 
 * Deeply scans the White Caves Real Estate codebase across Server, Frontend, Security, and Tests.
 * Follows the Rule of Continuous Perfection:
 *   - Each turn always selects the TOP 12 MOST CRITICAL TARGETS to upgrade.
 *   - Ensures continuous coverage across both Backend (server/) and Frontend (src/).
 * 
 * Outputs:
 * - logs/orchestrator/aegis-autopilot-issues.json
 * - logs/orchestrator/top-12-targets.json
 * - plans/AEGIS_AUTOPILOT_ISSUES_BACKLOG.md
 * - plans/AEGIS_TOP_12_TARGETS.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const LOGS_DIR = path.join(ROOT, 'logs', 'orchestrator');
const OUT_JSON = path.join(LOGS_DIR, 'aegis-autopilot-issues.json');
const OUT_TOP12_JSON = path.join(LOGS_DIR, 'top-12-targets.json');
const OUT_MD = path.join(ROOT, 'plans', 'AEGIS_AUTOPILOT_ISSUES_BACKLOG.md');
const OUT_TOP12_MD = path.join(ROOT, 'plans', 'AEGIS_TOP_12_TARGETS.md');

const SCAN_DIRS = ['src', 'server'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

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

function calculateScore(category, severity) {
  let score = 0;
  switch (category) {
    case 'Security & Compliance': score += 100; break;
    case 'Server Architecture': score += 85; break;
    case 'TypeScript Strictness': score += 70; break;
    case 'Accessibility & UX': score += 60; break;
    case 'Design System': score += 55; break;
    case 'Test Coverage Gap': score += 50; break;
    case 'Technical Debt': score += 40; break;
    case 'Code Cleanliness': score += 30; break;
    default: score += 20;
  }
  if (severity === 'CRITICAL') score += 50;
  else if (severity === 'HIGH') score += 30;
  else if (severity === 'MEDIUM') score += 15;
  return score;
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
    if (f.endsWith('.test.tsx') || f.endsWith('.test.ts') || f.endsWith('.test.jsx') || f.endsWith('.test.js') || f.endsWith('.spec.ts') || f.endsWith('.spec.js') || f.endsWith('.spec.jsx')) {
      const base = path.basename(f).replace(/\.(test|spec)\.(tsx?|jsx?)$/, '');
      testedComponents.add(base);
    }
  });

  for (const fp of allFiles) {
    const rel = relPath(fp);
    const filename = path.basename(fp);
    const isServer = rel.startsWith('server/');
    const isFrontend = rel.startsWith('src/');

    if (filename.includes('.test.') || filename.includes('.spec.')) continue;

    const content = fs.readFileSync(fp, 'utf8');
    const lines = content.split('\n');

    // 1. Missing test spec check
    const componentName = filename.replace(/\.(tsx?|jsx?)$/, '');
    if (
      (rel.startsWith('src/components/') || rel.startsWith('src/hooks/') || rel.startsWith('server/routes/')) &&
      !filename.endsWith('.d.ts') &&
      !filename.endsWith('.styles.ts') &&
      !filename.endsWith('.styles.tsx') &&
      !testedComponents.has(componentName) &&
      !filename.endsWith('index.ts') &&
      !filename.endsWith('index.tsx')
    ) {
      issues.push({
        id: `TEST-${componentName}`,
        category: 'Test Coverage Gap',
        severity: isServer ? 'HIGH' : 'MEDIUM',
        layer: isServer ? 'Server' : 'Frontend',
        file: rel,
        line: 1,
        title: `${isServer ? 'Server Route/Module' : 'Frontend Component/Hook'} '${componentName}' missing unit test file`,
        suggestion: `Create test file for ${rel} with Vitest/Supertest assertions.`
      });
    }

    // Line by line analysis
    lines.forEach((line, i) => {
      const ln = i + 1;
      const trimmed = line.trim();

      // 2. Server-Side Unhandled Async Catch / Missing Response
      if (isServer && !rel.includes('middleware/') && /router\.(post|put|delete|patch)\(/i.test(trimmed) && !content.includes('try {') && !content.includes('asyncHandler')) {
        issues.push({
          id: `SERVER-ERR-${path.basename(fp)}-${ln}`,
          category: 'Server Architecture',
          severity: 'HIGH',
          layer: 'Server',
          file: rel,
          line: ln,
          title: `Server route mutation lacking explicit error boundary or asyncHandler`,
          suggestion: 'Wrap route handler in try/catch block or asyncHandler middleware.'
        });
      }

      // 3. Security & Auth Gaps (Hardcoded tokens or missing auth check)
      if (isServer && !rel.includes('middleware/') && !rel.includes('controllers/') && /req\.body\b/i.test(trimmed) && !content.includes('zod') && !content.includes('validate') && !content.includes('schema') && !content.includes('Validation') && !content.toLowerCase().includes('validation') && !content.includes('body(')) {
        issues.push({
          id: `SEC-VAL-${path.basename(fp)}-${ln}`,
          category: 'Security & Compliance',
          severity: 'HIGH',
          layer: 'Server',
          file: rel,
          line: ln,
          title: `Server route reads req.body without schema validation`,
          suggestion: 'Enforce validation middleware or Zod schema on incoming payload.'
        });
      }

      // 4. Accessibility Gaps (Images missing alt, buttons missing aria-label)
      if (isFrontend && /<img\b/i.test(trimmed) && !content.slice(lines.slice(0, i).join('\n').length, lines.slice(0, i + 6).join('\n').length).includes('alt=')) {
        issues.push({
          id: `A11Y-IMG-${path.basename(fp)}-${ln}`,
          category: 'Accessibility & UX',
          severity: 'MEDIUM',
          layer: 'Frontend',
          file: rel,
          line: ln,
          title: `<img> element missing explicit alt attribute`,
          suggestion: 'Add descriptive alt prop or alt="" for decorative images.'
        });
      }

      // 5. TODO / STUB check
      if (/(?:\/\/|\/\*|\*|<!--|#)\s*(TODO|FIXME|STUB|PLACEHOLDER)\b/i.test(trimmed)) {
        issues.push({
          id: `TODO-${path.basename(fp)}-${ln}`,
          category: 'Technical Debt',
          severity: 'LOW',
          layer: isServer ? 'Server' : 'Frontend',
          file: rel,
          line: ln,
          title: `Unresolved TODO/STUB tag: "${trimmed.substring(0, 60)}"`,
          suggestion: 'Resolve placeholder code with concrete implementation.'
        });
      }

      // 6. Console.log check in production code
      if (/console\.log\(/i.test(trimmed) && !rel.includes('scripts/') && !rel.includes('test')) {
        issues.push({
          id: `LOG-${path.basename(fp)}-${ln}`,
          category: 'Code Cleanliness',
          severity: 'LOW',
          layer: isServer ? 'Server' : 'Frontend',
          file: rel,
          line: ln,
          title: `Debug console.log detected: "${trimmed.substring(0, 60)}"`,
          suggestion: 'Remove debug console logging or replace with structured logger.'
        });
      }

      // 7. Hardcoded non-token color check
      if (isFrontend && /style=\{\{.*#(?:[0-9a-fA-F]{3}){1,2}\b/i.test(trimmed) && !trimmed.includes('RED') && !trimmed.includes('WHITE') && !trimmed.includes('SLATE')) {
        issues.push({
          id: `COLOR-${path.basename(fp)}-${ln}`,
          category: 'Design System',
          severity: 'LOW',
          layer: 'Frontend',
          file: rel,
          line: ln,
          title: `Hardcoded hex color in style prop: "${trimmed.substring(0, 60)}"`,
          suggestion: 'Use tokens.css variables or established color constants.'
        });
      }

      // 8. Explicit 'any' type check
      if (/: \bany\b/i.test(trimmed) && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        issues.push({
          id: `TYPE-${path.basename(fp)}-${ln}`,
          category: 'TypeScript Strictness',
          severity: 'MEDIUM',
          layer: isServer ? 'Server' : 'Frontend',
          file: rel,
          line: ln,
          title: `Untyped 'any' usage detected`,
          suggestion: 'Replace explicit `any` with strict interface or generic constraint.'
        });
      }
    });
  }

  // Calculate criticality score for each issue
  issues.forEach(iss => {
    iss.score = calculateScore(iss.category, iss.severity);
  });

  // Sort descending by score
  issues.sort((a, b) => b.score - a.score);

  return issues;
}

function selectTop12Targets(issues) {
  // DIVERSITY RULE: Max 4 items per category to ensure cross-layer coverage
  const MAX_PER_CATEGORY = 4;
  const MAX_PER_LAYER = 8; // No more than 8 from Server or Frontend alone
  const top12 = [];
  const seenFiles = new Set();
  const categoryCount = {};
  const layerCount = { Server: 0, Frontend: 0 };

  for (const iss of issues) {
    if (top12.length >= 12) break;

    const catKey = iss.category;
    const layerKey = iss.layer || 'Frontend';

    // Skip if we already have this file
    if (seenFiles.has(iss.file)) continue;

    // Skip if this category already hit its cap
    if ((categoryCount[catKey] || 0) >= MAX_PER_CATEGORY) continue;

    // Skip if this layer already hit its cap
    if ((layerCount[layerKey] || 0) >= MAX_PER_LAYER) continue;

    top12.push(iss);
    seenFiles.add(iss.file);
    categoryCount[catKey] = (categoryCount[catKey] || 0) + 1;
    layerCount[layerKey] = (layerCount[layerKey] || 0) + 1;
  }

  // If diversity constraints left us under 12, fill remaining from highest-score uncapped items
  if (top12.length < 12) {
    for (const iss of issues) {
      if (top12.length >= 12) break;
      if (!seenFiles.has(iss.file)) {
        top12.push(iss);
        seenFiles.add(iss.file);
      }
    }
  }

  return top12;
}

function generateTop12MarkdownReport(top12) {
  let md = `# 🛡️ AEGIS Autopilot — Top 12 Critical Target Upgrades\n\n`;
  md += `> **Rule of Continuous Perfection**: Each turn dynamically isolates and resolves the 12 most critical system targets across Server, Frontend, Security, and Quality.\n`;
  md += `> **Timestamp**: ${new Date().toISOString()}\n`;
  md += `> **Total Active Targets**: ${top12.length} / 12\n\n`;
  md += `---\n\n`;

  md += `## 🎯 Active 12 Upgrade Targets\n\n`;
  md += `| # | Layer | Category | File | Criticality | Target Action |\n`;
  md += `|---|-------|----------|------|-------------|---------------|\n`;
  top12.forEach((target, index) => {
    md += `| **${index + 1}** | \`${target.layer}\` | ${target.category} | [\`${path.basename(target.file)}\`](file:///${path.resolve(ROOT, target.file)}) | **${target.severity}** (Score: ${target.score}) | ${target.suggestion} |\n`;
  });

  md += `\n---\n\n`;
  md += `## 🔍 Target Breakdown & Specs\n\n`;

  top12.forEach((target, index) => {
    md += `### ${index + 1}. [${target.layer}] ${target.title}\n`;
    md += `- **Target File**: [\`${target.file}:${target.line}\`](file:///${path.resolve(ROOT, target.file)}#L${target.line})\n`;
    md += `- **Layer**: ${target.layer} \| **Category**: ${target.category} \| **Score**: ${target.score}\n`;
    md += `- **Required Refactor**: ${target.suggestion}\n\n`;
  });

  return md;
}

function main() {
  console.log('🔍 Executing AEGIS 12-Target Autonomous Critical Discovery...');
  const issues = scanCodebase();
  const top12 = selectTop12Targets(issues);

  // Write issues JSON
  fs.writeFileSync(OUT_JSON, JSON.stringify({ timestamp: new Date().toISOString(), totalIssues: issues.length, issues }, null, 2), 'utf8');
  console.log(`✅ Saved all discovered issues to ${relPath(OUT_JSON)}`);

  // Write top 12 JSON
  fs.writeFileSync(OUT_TOP12_JSON, JSON.stringify({ timestamp: new Date().toISOString(), totalTargets: top12.length, targets: top12 }, null, 2), 'utf8');
  console.log(`✅ Saved Top 12 Targets JSON to ${relPath(OUT_TOP12_JSON)}`);

  // Write Markdown Backlog
  let mdBacklog = `# 🛡️ AEGIS Autopilot Backlog (${issues.length} Items)\n\n`;
  mdBacklog += `Total cataloged items across codebase: ${issues.length}.\nTop 12 items actively targeted for continuous upgrade.\n`;
  fs.writeFileSync(OUT_MD, mdBacklog, 'utf8');
  console.log(`✅ Saved Backlog to ${relPath(OUT_MD)}`);

  // Write Top 12 Markdown Report
  const mdTop12 = generateTop12MarkdownReport(top12);
  fs.writeFileSync(OUT_TOP12_MD, mdTop12, 'utf8');
  console.log(`✅ Saved Top 12 Target Report to ${relPath(OUT_TOP12_MD)}`);

  console.log(`\n🎯 Scan Complete: Top 12 Critical Targets Isolated & Ready for Upgrade Loop.`);
}

main();
