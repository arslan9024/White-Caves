#!/usr/bin/env node
/**
 * codebase-scan.js — White Caves Autopilot Codebase Analyser
 *
 * Scans src/, server/, plans/, and business_docs/ to produce a prioritised
 * work report that feeds the autopilot-unlimited loop.
 *
 * Output: logs/orchestrator/codebase-scan-report.json
 *
 * Usage:
 *   node scripts/orchestrator/codebase-scan.js
 *   node scripts/orchestrator/codebase-scan.js --brief
 *   node scripts/orchestrator/codebase-scan.js --json   (stdout only, no file write)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ────────────────────────────────────────────────────────────────
const ROOT        = path.resolve(__dirname, '..', '..');
const LOGS_DIR    = path.join(ROOT, 'logs', 'orchestrator');
const OUT_FILE    = path.join(LOGS_DIR, 'codebase-scan-report.json');
const BRIEF_MODE  = process.argv.includes('--brief');
const JSON_STDOUT = process.argv.includes('--json');

const SCAN_DIRS   = ['src', 'server'];
const PLAN_DIRS   = ['plans', 'business_docs'];
const EXTS        = new Set(['.ts', '.tsx', '.js', '.jsx']);

// Priority weights — higher = more urgent
const PRIORITY = {
  TODO_STUB:        10,  // TODO / FIXME / STUB comment in code
  TS_ERROR:         25,  // TypeScript compile error
  FAILING_BUILD:    50,  // build exit code non-zero
  OPEN_WAVE:        15,  // wave listed as 🟢 Ready or 📋 Planned in PENDING_TASKS_ONLY
  MISSING_TEST:      8,  // route/hook with no accompanying *.test.ts
  EMPTY_HANDLER:    12,  // Express route handler with only a TODO or res.json stub
  SECURITY_FLAG:    30,  // hardcoded secret or insecure pattern detected
  DOC_INCOMPLETE:    5,  // business_doc below section threshold
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function walkDir(dir, collect) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
      walkDir(full, collect);
    } else if (entry.isFile()) {
      collect(full);
    }
  }
}

function readFileSafe(fp) {
  try { return fs.readFileSync(fp, 'utf8'); }
  catch { return ''; }
}

function relPath(fp) {
  return path.relative(ROOT, fp).replace(/\\/g, '/');
}

// ─── 1. Source Code Scan ───────────────────────────────────────────────────
function scanSourceCode() {
  const findings = [];
  const allFiles = [];

  for (const d of SCAN_DIRS) {
    walkDir(path.join(ROOT, d), f => { if (EXTS.has(path.extname(f))) allFiles.push(f); });
  }

  for (const fp of allFiles) {
    const rel     = relPath(fp);
    const content = readFileSafe(fp);
    const lines   = content.split('\n');

    lines.forEach((line, i) => {
      const ln = i + 1;
      const trimmed = line.trim();

      // TODO / FIXME / STUB
      if (/\b(TODO|FIXME|STUB|PLACEHOLDER|NOT IMPLEMENTED)\b/i.test(trimmed)) {
        findings.push({ type: 'TODO_STUB', file: rel, line: ln, snippet: trimmed.slice(0, 120), score: PRIORITY.TODO_STUB });
      }

      // Hardcoded secret patterns (basic)
      if (/(?:password|secret|api_key|apikey|jwt_secret)\s*[:=]\s*['"][^'"]{4,}/i.test(trimmed) &&
          !trimmed.startsWith('//') && !trimmed.startsWith('*')) {
        findings.push({ type: 'SECURITY_FLAG', file: rel, line: ln, snippet: '[REDACTED — possible hardcoded secret]', score: PRIORITY.SECURITY_FLAG });
      }

      // Empty/stub Express route handlers
      if (/res\.(json|send)\(\s*\{?\s*\}?\s*\)/.test(trimmed) &&
          !rel.includes('.test.') && !rel.includes('__tests__')) {
        findings.push({ type: 'EMPTY_HANDLER', file: rel, line: ln, snippet: trimmed.slice(0, 120), score: PRIORITY.EMPTY_HANDLER });
      }
    });
  }

  // Missing test files — routes without matching *.test.ts
  const routeFiles = allFiles.filter(f => /server[\\/]routes[\\/].+(?<!test)\.(ts|js)$/.test(f));
  for (const rf of routeFiles) {
    const base     = path.basename(rf, path.extname(rf));
    const testFile = path.join(path.dirname(rf), `${base}.test.ts`);
    const altTest  = path.join(path.dirname(rf), `${base}.routes.test.ts`);
    if (!fs.existsSync(testFile) && !fs.existsSync(altTest)) {
      findings.push({ type: 'MISSING_TEST', file: relPath(rf), line: 0, snippet: `No test file found for ${base}`, score: PRIORITY.MISSING_TEST });
    }
  }

  return { totalFiles: allFiles.length, findings };
}

// ─── 2. TypeScript Check ───────────────────────────────────────────────────
function checkTypeScript() {
  const result = { clientErrors: 0, serverErrors: 0, total: 0, details: [] };
  const configs = [
    { label: 'client', config: 'tsconfig.json' },
    { label: 'server', config: 'tsconfig.server.json' },
  ];

  for (const { label, config } of configs) {
    const cfgPath = path.join(ROOT, config);
    if (!fs.existsSync(cfgPath)) continue;
    try {
      execSync(`node_modules/.bin/tsc --noEmit -p ${config}`, { cwd: ROOT, stdio: 'pipe' });
    } catch (err) {
      const output = (err.stdout || '') + (err.stderr || '');
      const lines  = output.toString().split('\n').filter(l => /error TS\d+/.test(l));
      const count  = lines.length;
      result[`${label}Errors`] = count;
      result.total += count;
      lines.slice(0, 20).forEach(l => result.details.push({ label, message: l.trim() }));
    }
  }

  return result;
}

// ─── 3. Build Check ────────────────────────────────────────────────────────
function checkBuild() {
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'pipe', timeout: 120_000 });
    return { ok: true, exitCode: 0 };
  } catch (err) {
    return { ok: false, exitCode: err.status || 1, stderr: (err.stderr || '').toString().slice(0, 500) };
  }
}

// ─── 4. Open Waves Scan ────────────────────────────────────────────────────
function scanOpenWaves() {
  const pendingFile = path.join(ROOT, 'plans', 'PENDING_TASKS_ONLY.md');
  if (!fs.existsSync(pendingFile)) return [];

  const content = readFileSafe(pendingFile);
  const waves   = [];

  // Match table rows with 🟢 Ready or 📋 Planned status
  const rowRe = /\|\s*(S\d+)\s*\|\s*(\d+)\s*\|([^|]+)\|\s*(🟢 Ready|📋 Planned)/g;
  let m;
  while ((m = rowRe.exec(content)) !== null) {
    const [, stream, wave, objective, status] = m;
    waves.push({
      stream: stream.trim(),
      wave:   parseInt(wave, 10),
      objective: objective.trim(),
      status: status.trim(),
      score: status.includes('🟢') ? PRIORITY.OPEN_WAVE * 2 : PRIORITY.OPEN_WAVE,
    });
  }

  return waves;
}

// ─── 5. Business Doc Completeness ─────────────────────────────────────────
function scanDocCompleteness() {
  const incomplete = [];
  const docDir = path.join(ROOT, 'business_docs');
  if (!fs.existsSync(docDir)) return incomplete;

  const mdFiles = [];
  walkDir(docDir, f => { if (f.endsWith('.md')) mdFiles.push(f); });

  for (const fp of mdFiles) {
    const content = readFileSafe(fp);
    const headings = (content.match(/^#{2,3} /gm) || []).length;
    const hasTODO  = /\bTODO\b|\bTBD\b|\bPENDING\b/i.test(content);
    const wordCount = content.split(/\s+/).length;

    if (headings < 4 || hasTODO || wordCount < 200) {
      incomplete.push({
        file:       relPath(fp),
        headings,
        wordCount,
        hasTODO,
        score:      PRIORITY.DOC_INCOMPLETE,
      });
    }
  }

  return incomplete;
}

// ─── 6. Priority Score Summary ─────────────────────────────────────────────
function buildPriorityList(sourceFindings, tsCheck, buildCheck, openWaves, incompleteDocs) {
  const items = [];

  // TypeScript errors — highest code-level priority
  if (tsCheck.total > 0) {
    items.push({
      category: 'typescript',
      priority: 'P0',
      score: tsCheck.total * PRIORITY.TS_ERROR,
      title: `Fix ${tsCheck.total} TypeScript error(s)`,
      detail: tsCheck.details.slice(0, 5).map(d => d.message),
      recommendedAgents: ['@Grace', '@Mira', '@Katherine'],
      action: 'Run: node_modules/.bin/tsc --noEmit -p tsconfig.json && node_modules/.bin/tsc --noEmit -p tsconfig.server.json',
    });
  }

  // Build failure
  if (!buildCheck.ok) {
    items.push({
      category: 'build',
      priority: 'P0',
      score: PRIORITY.FAILING_BUILD,
      title: 'Fix failing build',
      detail: [buildCheck.stderr || 'npm run build returned non-zero exit code'],
      recommendedAgents: ['@Gwynne', '@Grace', '@Mira'],
      action: 'Run: npm run build',
    });
  }

  // Security flags
  const secFlags = sourceFindings.findings.filter(f => f.type === 'SECURITY_FLAG');
  if (secFlags.length > 0) {
    items.push({
      category: 'security',
      priority: 'P0',
      score: secFlags.reduce((s, f) => s + f.score, 0),
      title: `Review ${secFlags.length} potential security issue(s)`,
      detail: secFlags.slice(0, 5).map(f => `${f.file}:${f.line}`),
      recommendedAgents: ['@Radia', '@Ecem', '@Daniela'],
      action: 'Audit files listed in detail array for hardcoded credentials',
    });
  }

  // Ready waves (immediate coding priority)
  const readyWaves = openWaves.filter(w => w.status.includes('🟢'));
  if (readyWaves.length > 0) {
    readyWaves.forEach(w => {
      items.push({
        category: 'wave-ready',
        priority: 'P1',
        score: w.score,
        title: `Execute ${w.stream} Wave ${w.wave}: ${w.objective}`,
        detail: [`Status: ${w.status}`, `Gate: @Ada — Context Ready (60% Readiness) — Coding Phase Approved`],
        recommendedAgents: ['@Ada', '@Mira', '@Una', '@Katherine'],
        action: `Review plans/waves/WAVE_0${w.wave}_IMPLEMENTATION_BACKLOG.md and begin execution`,
      });
    });
  }

  // Empty/stub handlers
  const stubs = sourceFindings.findings.filter(f => f.type === 'EMPTY_HANDLER');
  if (stubs.length > 0) {
    // Group by file
    const byFile = {};
    stubs.forEach(s => { byFile[s.file] = (byFile[s.file] || 0) + 1; });
    const topFiles = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 5);
    items.push({
      category: 'stub-handlers',
      priority: 'P1',
      score: stubs.length * PRIORITY.EMPTY_HANDLER,
      title: `Implement ${stubs.length} stub/empty API handler(s)`,
      detail: topFiles.map(([f, n]) => `${f} (${n} stubs)`),
      recommendedAgents: ['@Mira', '@Ruchi', '@Joelle'],
      action: 'Implement stubs starting with the highest-count files',
    });
  }

  // TODO/FIXME in source
  const todos = sourceFindings.findings.filter(f => f.type === 'TODO_STUB');
  if (todos.length > 0) {
    const byFile = {};
    todos.forEach(t => { byFile[t.file] = (byFile[t.file] || 0) + 1; });
    const topFiles = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 5);
    items.push({
      category: 'todos',
      priority: 'P2',
      score: todos.length * PRIORITY.TODO_STUB,
      title: `Resolve ${todos.length} TODO/FIXME/STUB comment(s) in source code`,
      detail: topFiles.map(([f, n]) => `${f} (${n} TODOs)`),
      recommendedAgents: ['@Mira', '@Una', '@Barbara'],
      action: 'Address TODOs starting with highest-density files',
    });
  }

  // Missing tests
  const missingTests = sourceFindings.findings.filter(f => f.type === 'MISSING_TEST');
  if (missingTests.length > 0) {
    items.push({
      category: 'missing-tests',
      priority: 'P2',
      score: missingTests.length * PRIORITY.MISSING_TEST,
      title: `Add tests for ${missingTests.length} untested route(s)`,
      detail: missingTests.slice(0, 5).map(f => f.file),
      recommendedAgents: ['@Katherine', '@Salma'],
      action: 'Add .test.ts files for each listed route',
    });
  }

  // Planned waves (not yet ready)
  const plannedWaves = openWaves.filter(w => w.status.includes('📋'));
  if (plannedWaves.length > 0) {
    plannedWaves.forEach(w => {
      items.push({
        category: 'wave-planned',
        priority: 'P3',
        score: w.score,
        title: `Prepare ${w.stream} Wave ${w.wave}: ${w.objective}`,
        detail: [`Status: ${w.status}`, 'Prerequisite: previous wave must be green'],
        recommendedAgents: ['@Margaret', '@Ada'],
        action: `Review plans/waves/WAVE_${String(w.wave).padStart(2,'0')}_READINESS_PACKET.md`,
      });
    });
  }

  // Incomplete docs
  if (incompleteDocs.length > 0) {
    items.push({
      category: 'incomplete-docs',
      priority: 'P3',
      score: incompleteDocs.length * PRIORITY.DOC_INCOMPLETE,
      title: `Complete ${incompleteDocs.length} under-specified business doc(s)`,
      detail: incompleteDocs.slice(0, 8).map(d => `${d.file} (${d.headings} sections, ${d.wordCount} words${d.hasTODO ? ', has TODO' : ''})`),
      recommendedAgents: ['@Victoria', '@Invoice', '@Sofia', '@Cassie', '@Joelle'],
      action: 'Assign each doc to its owning free agent via prompts.json task entries',
    });
  }

  // Sort descending by score
  items.sort((a, b) => b.score - a.score);
  return items;
}

// ─── 7. Main ───────────────────────────────────────────────────────────────
function main() {
  const startTime = Date.now();
  const scanDate  = new Date().toISOString();

  if (!BRIEF_MODE) console.log('\n⟳  White Caves — Codebase Scan starting…\n');

  if (!BRIEF_MODE) process.stdout.write('  [1/5] Scanning source code…');
  const sourceFindings = scanSourceCode();
  if (!BRIEF_MODE) console.log(` ${sourceFindings.findings.length} findings in ${sourceFindings.totalFiles} files`);

  if (!BRIEF_MODE) process.stdout.write('  [2/5] Running TypeScript check…');
  const tsCheck = checkTypeScript();
  if (!BRIEF_MODE) console.log(` ${tsCheck.total} error(s)`);

  if (!BRIEF_MODE) process.stdout.write('  [3/5] Running build check…');
  const buildCheck = checkBuild();
  if (!BRIEF_MODE) console.log(` ${buildCheck.ok ? '✓ pass' : '✗ FAIL'}`);

  if (!BRIEF_MODE) process.stdout.write('  [4/5] Scanning open waves…');
  const openWaves = scanOpenWaves();
  if (!BRIEF_MODE) console.log(` ${openWaves.length} wave(s) found`);

  if (!BRIEF_MODE) process.stdout.write('  [5/5] Checking doc completeness…');
  const incompleteDocs = scanDocCompleteness();
  if (!BRIEF_MODE) console.log(` ${incompleteDocs.length} incomplete doc(s)`);

  const priorityList = buildPriorityList(sourceFindings, tsCheck, buildCheck, openWaves, incompleteDocs);

  const report = {
    scanDate,
    durationMs:       Date.now() - startTime,
    summary: {
      totalSourceFiles: sourceFindings.totalFiles,
      totalFindings:    sourceFindings.findings.length,
      tsErrors:         tsCheck.total,
      buildOk:          buildCheck.ok,
      openWaves:        openWaves.length,
      readyWaves:       openWaves.filter(w => w.status.includes('🟢')).length,
      incompleteDocs:   incompleteDocs.length,
      priorityItems:    priorityList.length,
    },
    topPriority:     priorityList[0] || null,
    priorityList,
    openWaves,
    incompleteDocs:  incompleteDocs.slice(0, 20),
    securityFlags:   sourceFindings.findings.filter(f => f.type === 'SECURITY_FLAG'),
    stubHandlers:    sourceFindings.findings.filter(f => f.type === 'EMPTY_HANDLER').slice(0, 30),
    todos:           sourceFindings.findings.filter(f => f.type === 'TODO_STUB').slice(0, 30),
    missingTests:    sourceFindings.findings.filter(f => f.type === 'MISSING_TEST'),
    tsDetails:       tsCheck.details,
  };

  if (!JSON_STDOUT) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, JSON.stringify(report, null, 2));
  }

  if (JSON_STDOUT) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // ── Human-readable summary ──────────────────────────────────────────────
  const sep = '─'.repeat(70);
  console.log(`\n${sep}`);
  console.log('  WHITE CAVES — CODEBASE SCAN REPORT');
  console.log(`  ${scanDate}`);
  console.log(sep);
  console.log(`  Source files scanned : ${report.summary.totalSourceFiles}`);
  console.log(`  Total findings       : ${report.summary.totalFindings}`);
  console.log(`  TypeScript errors    : ${report.summary.tsErrors}`);
  console.log(`  Build                : ${report.summary.buildOk ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`  Open waves           : ${report.summary.openWaves} (${report.summary.readyWaves} ready)`);
  console.log(`  Incomplete docs      : ${report.summary.incompleteDocs}`);
  console.log(sep);

  console.log('\n  TOP PRIORITY ITEMS:\n');
  priorityList.slice(0, 8).forEach((item, i) => {
    const badge = item.priority === 'P0' ? '🔴' : item.priority === 'P1' ? '🟠' : item.priority === 'P2' ? '🟡' : '🔵';
    console.log(`  ${i + 1}. ${badge} [${item.priority}] ${item.title}`);
    console.log(`     Score: ${item.score} | Category: ${item.category}`);
    console.log(`     Agents: ${item.recommendedAgents.join(', ')}`);
    if (!BRIEF_MODE && item.detail.length > 0) {
      item.detail.slice(0, 3).forEach(d => console.log(`     • ${d}`));
    }
    console.log();
  });

  console.log(`${sep}`);
  console.log(`  Report saved → ${OUT_FILE}`);
  console.log(`  Duration: ${report.durationMs}ms`);
  console.log(sep + '\n');
}

main();
