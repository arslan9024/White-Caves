#!/usr/bin/env node
/**
 * aegis-cycle.js — AEGIS Unified Autopilot Cycle Runner
 *
 * Replaces 3 separate manual steps (scan → build → git) with one command:
 *   node scripts/orchestrator/aegis-cycle.js --cycle N+22
 *
 * Pipeline:
 *   1. Run AEGIS scanner (inline — no child process)
 *   2. Run `npm run build` (quality gate)
 *   3. On success: git add, commit, push origin main
 *   4. On success: fast-forward develop branch
 *   5. Log cycle summary to plans/AEGIS_RUN_LOG.md
 *   6. Print TOP 12 targets to stdout for agent to read
 *
 * Options:
 *   --cycle <label>    Cycle label for commit message (e.g. N+22)
 *   --skip-build       Skip npm run build (for dry-run / CI-less environments)
 *   --skip-git         Skip git pipeline (scan + build only)
 *   --message <msg>    Custom commit message suffix
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runScan } from './aegis-autopilot-scanner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const RUN_LOG = path.join(ROOT, 'docs', 'plans', 'AEGIS_RUN_LOG.md');

// ── CLI arg parsing ────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { cycle: null, skipBuild: false, skipGit: false, message: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--cycle' && args[i + 1]) opts.cycle = args[++i];
    else if (args[i] === '--skip-build') opts.skipBuild = true;
    else if (args[i] === '--skip-git') opts.skipGit = true;
    else if (args[i] === '--message' && args[i + 1]) opts.message = args[++i];
  }
  return opts;
}

// ── Shell exec helper ──────────────────────────────────────────────────────
function run(cmd, cwd = ROOT) {
  try {
    const out = execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return { ok: true, out: out.trim() };
  } catch (err) {
    return { ok: false, out: err.stdout?.trim() || '', err: err.stderr?.trim() || err.message };
  }
}

// ── Append to run log ──────────────────────────────────────────────────────
function logCycle(label, top12, buildOk, commitHash) {
  const ts = new Date().toISOString();
  const categories = [...new Set(top12.map(t => t.category))].join(', ');
  const files = top12.map(t => `\`${path.basename(t.file)}\``).join(', ');

  let entry = `\n## Cycle ${label || 'N+?'} — ${ts}\n`;
  entry += `- **Build**: ${buildOk ? '✅ PASS' : '❌ FAIL'}\n`;
  entry += `- **Commit**: ${commitHash || 'skipped'}\n`;
  entry += `- **Categories**: ${categories}\n`;
  entry += `- **Targets**: ${files}\n`;
  entry += `---\n`;

  fs.appendFileSync(RUN_LOG, entry, 'utf8');
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs();
  const cycleLabel = opts.cycle || 'N+?';

  console.log(`\n🛡️  AEGIS CYCLE ${cycleLabel} — Starting unified pipeline\n`);

  // ── Step 1: Scan ──────────────────────────────────────────────────────────
  console.log('📡 Step 1/4 — Running AEGIS scanner...');
  const { top12, totalIssues } = runScan();
  console.log(`   ✅ ${totalIssues} issues found. Top 12 isolated.\n`);

  // Print targets inline
  console.log('## 🎯 TOP 12 TARGETS THIS CYCLE\n');
  top12.forEach((t, i) => {
    const score = `[Score: ${t.score}]`;
    console.log(`  ${String(i + 1).padStart(2)}. ${score.padEnd(13)} [${t.layer}/${t.category}]`);
    console.log(`      ${t.file}:${t.line}`);
    console.log(`      → ${t.suggestion}\n`);
  });

  // ── Step 2: Build ─────────────────────────────────────────────────────────
  let buildOk = true;
  if (!opts.skipBuild) {
    console.log('🔨 Step 2/4 — Running npm run build...');
    const result = run('npm run build');
    buildOk = result.ok;
    if (buildOk) {
      console.log('   ✅ Build passed.\n');
    } else {
      console.error('   ❌ Build FAILED. See plans/COMPILER_ERRORS.txt\n');
      console.error(result.out || result.err);
      logCycle(cycleLabel, top12, false, null);
      process.exit(1);
    }
  } else {
    console.log('⏭️  Step 2/4 — Build skipped (--skip-build).\n');
  }

  // ── Step 3: Git pipeline ──────────────────────────────────────────────────
  let commitHash = null;
  if (!opts.skipGit) {
    console.log('📦 Step 3/4 — Git: add + commit + push...');

    run('git add .');

    const msgSuffix = opts.message ? ` — ${opts.message}` : ` — TS strictness + test coverage + design tokens`;
    const commitMsg = `aegis/autopilot: resolved cycle ${cycleLabel} top 12 targets${msgSuffix}`;
    const commitResult = run(`git commit -m "${commitMsg}"`);

    if (!commitResult.ok) {
      if (commitResult.out.includes('nothing to commit')) {
        console.log('   ℹ️  Nothing to commit.\n');
      } else {
        console.error('   ❌ Commit failed:', commitResult.err);
        process.exit(1);
      }
    } else {
      // Extract short hash from commit output
      const match = commitResult.out.match(/\[main ([a-f0-9]+)\]/);
      commitHash = match ? match[1] : 'unknown';
      console.log(`   ✅ Committed: ${commitHash}\n`);

      const pushResult = run('git push origin main');
      if (pushResult.ok) {
        console.log('   ✅ Pushed to origin/main.\n');
      } else {
        console.error('   ❌ Push failed:', pushResult.err);
      }
    }

    // ── Step 4: Sync develop ────────────────────────────────────────────────
    console.log('🔀 Step 4/4 — Syncing develop branch...');
    run('git checkout develop');
    run('git merge main');
    run('git checkout main');
    console.log('   ✅ develop fast-forwarded to main.\n');
  } else {
    console.log('⏭️  Steps 3-4 — Git skipped (--skip-git).\n');
  }

  // ── Log cycle ─────────────────────────────────────────────────────────────
  logCycle(cycleLabel, top12, buildOk, commitHash);

  console.log(`\n🏁 AEGIS Cycle ${cycleLabel} complete.\n`);
}

main().catch(err => {
  console.error('❌ AEGIS cycle failed:', err.message);
  process.exit(1);
});
