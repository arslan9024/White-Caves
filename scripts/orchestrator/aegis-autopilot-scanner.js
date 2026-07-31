#!/usr/bin/env node
/**
 * aegis-autopilot-scanner.js — AEGIS 12-Target Critical Upgrade Engine (v2)
 *
 * Efficiency upgrades (v2):
 *  - Excludes .d.ts files from 'any' checks (declaration files are not fixable)
 *  - Hex color regex now excludes var(--token, #hex) fallback patterns (already canonical)
 *  - TypeScript Strictness base score raised to 85 (was 70) — matches actual priority
 *  - Design System capped at 2 targets per cycle (was 4) — prevents crowding out TS/Security
 *  - Eliminated AEGIS_AUTOPILOT_ISSUES_BACKLOG.md write (never read, zero value)
 *  - Eliminated full aegis-autopilot-issues.json write (never consumed by agent)
 *  - Kept only: top-12-targets.json + AEGIS_TOP_12_TARGETS.md
 *
 * Outputs (lean):
 * - logs/orchestrator/top-12-targets.json
 * - plans/AEGIS_TOP_12_TARGETS.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const LOGS_DIR = path.join(ROOT, 'logs', 'orchestrator');
const OUT_TOP12_JSON = path.join(LOGS_DIR, 'top-12-targets.json');
const OUT_TOP12_MD = path.join(ROOT, 'plans', 'AEGIS_TOP_12_TARGETS.md');

const SCAN_DIRS = ['src', 'server'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

// Regex: bare hex ONLY — not inside var(--token, #hex) wrapper
// Matches: style={{ color: '#fff' }} but NOT: style={{ color: 'var(--x, #fff)' }}
const BARE_HEX_REGEX = /style=\{\{[^}]*(?<!'var\([^)]*)'#(?:[0-9a-fA-F]{3,6})'(?![^)]*\))/i;
const HAS_VAR_FALLBACK_REGEX = /var\(--[^,)]+,\s*#[0-9a-fA-F]{3,6}\)/;

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
    case 'Security & Compliance':   score += 100; break;
    case 'Server Architecture':     score += 90;  break;
    case 'TypeScript Strictness':   score += 85;  break; // raised from 70
    case 'Accessibility & UX':      score += 65;  break;
    case 'Test Coverage Gap':       score += 60;  break; // raised from 50
    case 'Design System':           score += 40;  break; // lowered from 55
    case 'Technical Debt':          score += 35;  break;
    case 'Code Cleanliness':        score += 20;  break;
    default: score += 15;
  }
  if (severity === 'CRITICAL') score += 50;
  else if (severity === 'HIGH')   score += 30;
  else if (severity === 'MEDIUM') score += 15;
  return score;
}

function isHardcodedHex(trimmed) {
  // Only flag if there's a bare hex literal NOT already inside a var(--x, #hex) fallback
  if (!/#[0-9a-fA-F]{3,6}\b/i.test(trimmed)) return false;
  if (HAS_VAR_FALLBACK_REGEX.test(trimmed)) return false; // already using token with fallback
  if (/style=\{\{/.test(trimmed) && /#[0-9a-fA-F]{3,6}\b/.test(trimmed)) return true;
  return false;
}

function scanCodebase() {
  const issues = [];
  const allFiles = [];

  for (const d of SCAN_DIRS) {
    walkDir(path.join(ROOT, d), f => {
      if (EXTS.has(path.extname(f))) allFiles.push(f);
    });
  }

  // Build tested-component set
  const testedComponents = new Set();
  allFiles.forEach(f => {
    if (/\.(test|spec)\.(tsx?|jsx?)$/.test(f)) {
      const base = path.basename(f).replace(/\.(test|spec)\.(tsx?|jsx?)$/, '');
      testedComponents.add(base);
    }
  });

  for (const fp of allFiles) {
    const rel = relPath(fp);
    const filename = path.basename(fp);
    const isServer = rel.startsWith('server/');
    const isFrontend = rel.startsWith('src/');

    // Skip test/spec files themselves
    if (/\.(test|spec)\.(tsx?|jsx?)$/.test(filename)) continue;

    // Skip declaration files entirely — they are not implementation targets
    if (filename.endsWith('.d.ts')) continue;

    const content = fs.readFileSync(fp, 'utf8');
    const lines = content.split('\n');

    // ── Rule 1: Missing test coverage ────────────────────────────────────────
    const componentName = filename.replace(/\.(tsx?|jsx?)$/, '');
    if (
      (rel.startsWith('src/components/') || rel.startsWith('src/hooks/') || rel.startsWith('server/routes/')) &&
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

    // Line-by-line analysis
    lines.forEach((line, i) => {
      const ln = i + 1;
      const trimmed = line.trim();

      // ── Rule 2: Server route missing error boundary ───────────────────────
      if (
        isServer &&
        !rel.includes('middleware/') &&
        /router\.(post|put|delete|patch)\(/i.test(trimmed) &&
        !content.includes('try {') &&
        !content.includes('asyncHandler')
      ) {
        issues.push({
          id: `SERVER-ERR-${filename}-${ln}`,
          category: 'Server Architecture',
          severity: 'HIGH',
          layer: 'Server',
          file: rel, line: ln,
          title: `Server route mutation lacking explicit error boundary or asyncHandler`,
          suggestion: 'Wrap route handler in try/catch block or asyncHandler middleware.'
        });
      }

      // ── Rule 3: Unvalidated req.body ──────────────────────────────────────
      if (
        isServer &&
        !rel.includes('middleware/') &&
        !rel.includes('controllers/') &&
        /req\.body\b/i.test(trimmed) &&
        !content.includes('zod') &&
        !content.includes('validate') &&
        !content.includes('schema') &&
        !content.includes('Validation') &&
        !content.toLowerCase().includes('validation') &&
        !content.includes('body(')
      ) {
        issues.push({
          id: `SEC-VAL-${filename}-${ln}`,
          category: 'Security & Compliance',
          severity: 'HIGH',
          layer: 'Server',
          file: rel, line: ln,
          title: `Server route reads req.body without schema validation`,
          suggestion: 'Enforce validation middleware or Zod schema on incoming payload.'
        });
      }

      // ── Rule 4: Image missing alt attr ────────────────────────────────────
      if (isFrontend && /\<img\b/i.test(trimmed)) {
        const window = lines.slice(Math.max(0, i - 1), i + 6).join('\n');
        if (!window.includes('alt=')) {
          issues.push({
            id: `A11Y-IMG-${filename}-${ln}`,
            category: 'Accessibility & UX',
            severity: 'MEDIUM',
            layer: 'Frontend',
            file: rel, line: ln,
            title: `<img> element missing explicit alt attribute`,
            suggestion: 'Add descriptive alt prop or alt="" for decorative images.'
          });
        }
      }

      // ── Rule 5: TODO / STUB markers ───────────────────────────────────────
      if (/(?:\/\/|\/\*|\*|<!--|#)\s*(TODO|FIXME|STUB|PLACEHOLDER)\b/i.test(trimmed)) {
        issues.push({
          id: `TODO-${filename}-${ln}`,
          category: 'Technical Debt',
          severity: 'LOW',
          layer: isServer ? 'Server' : 'Frontend',
          file: rel, line: ln,
          title: `Unresolved TODO/STUB tag: "${trimmed.substring(0, 60)}"`,
          suggestion: 'Resolve placeholder code with concrete implementation.'
        });
      }

      // ── Rule 6: Explicit `any` type (skip .d.ts — already excluded above) ─
      if (/: \bany\b/i.test(trimmed) && !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        issues.push({
          id: `TYPE-${filename}-${ln}`,
          category: 'TypeScript Strictness',
          severity: 'MEDIUM',
          layer: isServer ? 'Server' : 'Frontend',
          file: rel, line: ln,
          title: `Untyped 'any' usage detected`,
          suggestion: 'Replace explicit `any` with strict interface or generic constraint.'
        });
      }

      // ── Rule 7: Bare hardcoded hex (not var fallback, not .d.ts) ─────────
      if (
        isFrontend &&
        !trimmed.includes('RED') && !trimmed.includes('WHITE') && !trimmed.includes('SLATE') &&
        isHardcodedHex(trimmed)
      ) {
        issues.push({
          id: `COLOR-${filename}-${ln}`,
          category: 'Design System',
          severity: 'LOW',
          layer: 'Frontend',
          file: rel, line: ln,
          title: `Hardcoded hex color in style prop: "${trimmed.substring(0, 60)}"`,
          suggestion: 'Use tokens.css variables or established color constants.'
        });
      }
    });
  }

  // Score all issues
  issues.forEach(iss => { iss.score = calculateScore(iss.category, iss.severity); });

  // Sort descending by score
  issues.sort((a, b) => b.score - a.score);

  return issues;
}

function selectTop12Targets(issues) {
  // DIVERSITY CAPS: Security/TypeScript get more room; Design System capped at 2
  const CATEGORY_CAPS = {
    'Security & Compliance':   4,
    'Server Architecture':     4,
    'TypeScript Strictness':   4,
    'Test Coverage Gap':       4,
    'Accessibility & UX':      3,
    'Design System':           2, // was 4 — reduced to prevent crowding
    'Technical Debt':          2,
    'Code Cleanliness':        1,
  };
  const MAX_PER_LAYER = 8;

  const top12 = [];
  const seenFiles = new Set();
  const categoryCount = {};
  const layerCount = { Server: 0, Frontend: 0 };

  for (const iss of issues) {
    if (top12.length >= 12) break;

    const catKey = iss.category;
    const layerKey = iss.layer || 'Frontend';
    const cap = CATEGORY_CAPS[catKey] ?? 2;

    if (seenFiles.has(iss.file)) continue;
    if ((categoryCount[catKey] || 0) >= cap) continue;
    if ((layerCount[layerKey] || 0) >= MAX_PER_LAYER) continue;

    top12.push(iss);
    seenFiles.add(iss.file);
    categoryCount[catKey] = (categoryCount[catKey] || 0) + 1;
    layerCount[layerKey] = (layerCount[layerKey] || 0) + 1;
  }

  // Fill remaining slots from highest-score unseen items (no category/layer caps)
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
  top12.forEach((target, i) => {
    md += `| **${i + 1}** | \`${target.layer}\` | ${target.category} | [\`${path.basename(target.file)}\`](file:///${path.resolve(ROOT, target.file)}) | **${target.severity}** (Score: ${target.score}) | ${target.suggestion} |\n`;
  });

  md += `\n---\n\n`;
  md += `## 🔍 Target Breakdown & Specs\n\n`;

  top12.forEach((target, i) => {
    md += `### ${i + 1}. [${target.layer}] ${target.title}\n`;
    md += `- **Target File**: [\`${target.file}:${target.line}\`](file:///${path.resolve(ROOT, target.file)}#L${target.line})\n`;
    md += `- **Layer**: ${target.layer} | **Category**: ${target.category} | **Score**: ${target.score}\n`;
    md += `- **Required Refactor**: ${target.suggestion}\n\n`;
  });

  return md;
}

export function runScan() {
  const issues = scanCodebase();
  const top12 = selectTop12Targets(issues);

  // Write top-12 JSON (lean output)
  fs.writeFileSync(OUT_TOP12_JSON, JSON.stringify({ timestamp: new Date().toISOString(), totalTargets: top12.length, targets: top12 }, null, 2), 'utf8');

  // Write top-12 Markdown (what the agent reads)
  const mdTop12 = generateTop12MarkdownReport(top12);
  fs.writeFileSync(OUT_TOP12_MD, mdTop12, 'utf8');

  return { top12, totalIssues: issues.length };
}

// Allow standalone invocation
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  console.log('🔍 Executing AEGIS 12-Target Autonomous Critical Discovery...');
  const { top12, totalIssues } = runScan();
  console.log(`✅ Saved Top 12 Targets JSON to ${relPath(OUT_TOP12_JSON)}`);
  console.log(`✅ Saved Top 12 Target Report to ${relPath(OUT_TOP12_MD)}`);
  console.log(`\n🎯 Scan Complete — ${totalIssues} issues found. Top 12 isolated & ready.\n`);

  // Print top 12 summary to stdout so agent can read inline
  console.log('## TOP 12 THIS CYCLE\n');
  top12.forEach((t, i) => {
    console.log(`  ${i + 1}. [${t.layer}/${t.category}] ${t.file}:${t.line} — ${t.suggestion}`);
  });
}
