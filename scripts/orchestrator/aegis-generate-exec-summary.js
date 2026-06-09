#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const argv = process.argv.slice(2);
const readArg = (name, fallback = '') => {
  const i = argv.indexOf(name);
  return i !== -1 ? String(argv[i + 1] || fallback) : fallback;
};

const requestedDate = readArg('--date', '').trim();
const targetDate = requestedDate || new Date().toISOString().slice(0, 10);

const autopilotLogPath = path.join(ROOT, 'logs', 'orchestrator', 'autopilot-session-log.json');
const outputPath = path.join(ROOT, 'plans', `DAILY_EXEC_SUMMARY_${targetDate}.md`);

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: false,
  });

  return {
    ok: (result.status ?? 1) === 0,
    stdout: String(result.stdout || '').trim(),
    stderr: String(result.stderr || '').trim(),
    code: result.status ?? 1,
  };
}

function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function readTextFileRobust(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.length >= 2) {
    const b0 = buf[0];
    const b1 = buf[1];
    // UTF-16 LE BOM
    if (b0 === 0xff && b1 === 0xfe) {
      return buf.toString('utf16le').replace(/^\uFEFF/, '');
    }
    // UTF-16 BE BOM
    if (b0 === 0xfe && b1 === 0xff) {
      // Convert BE bytes to LE for decoding
      const swapped = Buffer.from(buf);
      for (let i = 0; i + 1 < swapped.length; i += 2) {
        const t = swapped[i];
        swapped[i] = swapped[i + 1];
        swapped[i + 1] = t;
      }
      return swapped.toString('utf16le').replace(/^\uFEFF/, '');
    }
  }

  // Heuristic: UTF-16LE content without BOM often has many null bytes at odd offsets.
  if (buf.length >= 4) {
    const sampleSize = Math.min(buf.length, 256);
    let oddNulls = 0;
    let oddCount = 0;
    for (let i = 1; i < sampleSize; i += 2) {
      oddCount += 1;
      if (buf[i] === 0x00) {
        oddNulls += 1;
      }
    }

    if (oddCount > 0 && oddNulls / oddCount > 0.3) {
      return buf.toString('utf16le').replace(/^\uFEFF/, '');
    }
  }

  // Default UTF-8 (strip BOM if present)
  return buf.toString('utf8').replace(/^\uFEFF/, '');
}

function readAutopilotEntries(datePrefix) {
  if (!fs.existsSync(autopilotLogPath)) {
    return [];
  }

  const raw = readTextFileRobust(autopilotLogPath);
  const parsed = safeJsonParse(raw, []);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(entry => String(entry?.timestamp || '').startsWith(datePrefix));
}

function readAllAutopilotEntries() {
  if (!fs.existsSync(autopilotLogPath)) {
    return [];
  }

  const raw = readTextFileRobust(autopilotLogPath);
  const parsed = safeJsonParse(raw, []);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
}

function calcMetrics(entries) {
  const total = entries.length;
  const ok = entries.filter(e => String(e?.status || '') === 'ok').length;
  const nonOk = total - ok;
  const successRate = total > 0 ? ((ok / total) * 100).toFixed(1) : '0.0';

  const statusCounts = new Map();
  for (const entry of entries) {
    const key = String(entry?.status || 'unknown');
    statusCounts.set(key, (statusCounts.get(key) || 0) + 1);
  }

  const sortedStatuses = [...statusCounts.entries()].sort((a, b) => b[1] - a[1]);
  const recent = entries.slice(-8);

  return { total, ok, nonOk, successRate, sortedStatuses, recent };
}

function buildSummary() {
  const branch = runGit(['rev-parse', '--abbrev-ref', 'HEAD']).stdout || 'unknown';
  const tracking =
    runGit(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']).stdout || 'none';
  const statusShort = runGit(['status', '--short']).stdout;
  const diffStat = runGit(['diff', '--stat']).stdout;
  const commitsToday = runGit([
    'log',
    `--since=${targetDate} 00:00`,
    '--date=local',
    '--pretty=format:%h | %ad | %an | %s',
    '-n',
    '20',
  ]).stdout;

  const entries = readAutopilotEntries(targetDate);
  const m = calcMetrics(entries);
  const allEntries = readAllAutopilotEntries();
  const mAll = calcMetrics(allEntries);

  const lastEntry = allEntries.length > 0 ? allEntries[allEntries.length - 1] : null;
  const lastActivityDate = lastEntry?.timestamp ? String(lastEntry.timestamp).slice(0, 10) : 'n/a';

  const wipFiles = statusShort
    ? statusShort
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.replace(/^[AMDRCU?\s]+/, '').trim())
    : [];

  const recentLines = m.recent.map(entry => {
    return `- \`${entry.timestamp} | s${entry.session} | ${entry.status} | ${entry.task} | ${entry.agent}\``;
  });

  const statusLines = m.sortedStatuses.map(([name, count]) => `  - \`${name}: ${count}\``);

  const commitSection = commitsToday
    ? commitsToday
        .split('\n')
        .map(line => `- ${line}`)
        .join('\n')
    : '- No commits recorded for this date window on current branch.';

  const wipSection = wipFiles.length
    ? wipFiles.map(file => `- \`${file}\``).join('\n')
    : '- No local uncommitted files.';

  const diffSection = diffStat
    ? `\n\n\`\`\`\n${diffStat}\n\`\`\``
    : '\n\n_No current local diff stat._';

  const recentSection = recentLines.length
    ? recentLines.join('\n')
    : '- No entries logged for this date.';

  const statusSection = statusLines.length ? statusLines.join('\n') : '  - `none: 0`';

  return `# Executive Daily Summary — ${targetDate}

## 1) Overall Status
- Delivery branch: \`${branch}\`
- Tracking remote: \`${tracking}\`
- Runtime mode: Aegis autopilot log-driven execution tracking
- Net assessment: **${m.total > 0 ? 'Operational and measurable' : 'No autopilot entries recorded for date'}**
- Last autopilot activity date: **${lastActivityDate}**

## 2) Execution Performance (${targetDate})
- Total logged sessions: **${m.total}**
- Successful sessions: **${m.ok}**
- Non-success sessions: **${m.nonOk}**
- Approx success rate: **${m.successRate}%**
- Status breakdown:
${statusSection}

## 3) Current Work-in-Progress
${wipSection}

## 4) Local Diff Snapshot
${diffSection}

## 5) Recent Autopilot Entries
${recentSection}

## 6) Commit Activity (${targetDate})
${commitSection}

## 7) Immediate Next Actions
1. Continue autopilot monitoring and inspect non-OK status entries.
2. Commit/push WIP files when ready (if intentional).
3. Keep GitHub write auth healthy for full issue/milestone sync automation.

## 8) Cumulative Autopilot Progress (All Logged Sessions)
- Total logged sessions (all-time log): **${mAll.total}**
- Successful sessions: **${mAll.ok}**
- Non-success sessions: **${mAll.nonOk}**
- Approx success rate: **${mAll.successRate}%**

_Generated by: scripts/orchestrator/aegis-generate-exec-summary.js_\n`;
}

const content = buildSummary();
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content, 'utf8');

console.log(`Generated executive summary: ${path.relative(ROOT, outputPath).replace(/\\/g, '/')}`);
console.log(`Date: ${targetDate}`);
