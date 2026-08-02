import fs from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const workspaceRootArg = process.argv.slice(2).find((arg) => arg.startsWith('--workspaceRoot='));
const workspaceRoot = workspaceRootArg
  ? path.resolve(workspaceRootArg.split('=')[1] || '.')
  : process.cwd();

const showDaily = args.has('--daily') || (!args.has('--daily') && !args.has('--weekly'));
const showWeekly = args.has('--weekly') || (!args.has('--daily') && !args.has('--weekly'));
const brief = args.has('--brief');
const noClear = args.has('--no-clear');

const trackerFile = path.join(workspaceRoot, 'DAILY_MILESTONE_TRACKER.md');
const queueFile = path.join(workspaceRoot, 'logs', 'orchestrator', 'task-queue.json');

const includedExtensions = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.css', '.scss', '.html', '.yml', '.yaml', '.ps1', '.sh'
]);
const excludedDirs = new Set([
  '.git', 'node_modules', 'dist', 'build', 'coverage', 'logs', 'archive', 'archives', 'backups', 'artifacts', '.vite', '.vercel'
]);

function clearConsole() {
  process.stdout.write('\x1Bc');
}

function safeReadText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function safeReadTextWithRetries(filePath, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const raw = safeReadText(filePath);
    if (raw && raw.trim()) {
      return raw;
    }
  }

  return null;
}

function parseQueueSnapshot(filePath) {
  let queue = null;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const raw = safeReadTextWithRetries(filePath);
    if (!raw || !raw.trim()) {
      continue;
    }

    try {
      queue = JSON.parse(raw);
      break;
    } catch {
      queue = null;
    }
  }

  if (!queue) {
    return null;
  }

  const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];
  const done = tasks.filter((task) => task?.status === 'done').length;
  const running = tasks.filter((task) => task?.status === 'running').length;
  const pendingStatuses = new Set(['queued', 'running', 'evidence_pending', 'waiting_ack', 'retrying', 'failed', 'escalated']);
  const pending = tasks.filter((task) => pendingStatuses.has(task?.status)).length;
  const total = tasks.length;
  const percent = total > 0 ? Number(((done / total) * 100).toFixed(1)) : 0;

  return {
    cycle: typeof queue.cycle === 'string' && queue.cycle.trim() ? queue.cycle.trim() : 'N/A',
    done,
    total,
    pending,
    running,
    percent,
  };
}

function parseFlexibleDate(rawValue) {
  if (!rawValue || !rawValue.trim()) {
    return null;
  }

  const value = rawValue.trim();

  const monthDayMatch = value.match(/^([A-Za-z]{3,9})\s+(\d{1,2})$/);
  if (monthDayMatch) {
    const [, monthName, dayStr] = monthDayMatch;
    const currentYear = new Date().getFullYear();
    const retry = new Date(`${monthName} ${dayStr}, ${currentYear}`);
    if (!Number.isNaN(retry.getTime())) {
      return retry;
    }
  }

  const match = value.match(/^([A-Za-z]{3,9})\s+(\d{1,2})(?:,)?\s+(\d{4})$/);
  if (match) {
    const [, monthName, dayStr, yearStr] = match;
    const retry = new Date(`${monthName} ${dayStr}, ${yearStr}`);
    if (!Number.isNaN(retry.getTime())) {
      return retry;
    }
  }

  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  return null;
}

function parseTrackerEntries(filePath) {
  const raw = safeReadText(filePath);
  if (!raw) {
    return [];
  }

  const lines = raw.split(/\r?\n/);
  const entries = [];
  const seen = new Set();

  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    if (/^\|\s*-/.test(line)) continue;
    if (/^\|\s*Date\s*\|/i.test(line)) continue;
    if (!line.includes('Orchestrator Sync')) continue;
    if (!line.includes('done=')) continue;

    const parts = line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((part) => part.trim());

    if (parts.length < 5) continue;

    const rawDate = parts[0];
    const notes = parts[parts.length - 1];
    const parsedDate = parseFlexibleDate(rawDate);
    if (!parsedDate) continue;

    const done = Number((notes.match(/done=(\d+)/)?.[1]) || 0);
    const running = Number((notes.match(/running=(\d+)/)?.[1]) || 0);
    const waitingAck = Number((notes.match(/waitAck=(\d+)/)?.[1]) || (notes.match(/waiting_ack=(\d+)/)?.[1]) || 0);
    const queued = Number((notes.match(/queued=(\d+)/)?.[1]) || 0);
    const retrying = Number((notes.match(/retrying=(\d+)/)?.[1]) || 0);
    const failed = Number((notes.match(/failed=(\d+)/)?.[1]) || 0);
    const total = done + running + waitingAck + queued + retrying + failed;
    const percent = total > 0 ? Number(((done / total) * 100).toFixed(1)) : 0;
    const dedupeKey = `${parsedDate.toISOString().slice(0, 10)}|${notes}`;
    if (seen.has(dedupeKey)) {
      continue;
    }
    seen.add(dedupeKey);

    entries.push({
      date: new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()),
      rawDate,
      done,
      running,
      waitingAck,
      queued,
      retrying,
      failed,
      total,
      percent,
      notes,
    });
  }

  return entries.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function getWindowSummary(entries, since, label) {
  const windowEntries = entries.filter((entry) => entry.date.getTime() >= since.getTime());
  const uniqueDays = new Set(windowEntries.map((entry) => entry.date.toISOString().slice(0, 10)));

  if (windowEntries.length === 0) {
    return {
      label,
      entryCount: 0,
      daysCovered: 0,
      avgPercent: 0,
      bestPercent: 0,
      avgDone: 0,
      bestDone: 0,
      latestEntry: null,
      signal: 'no data yet',
    };
  }

  const avgPercent = Number((windowEntries.reduce((sum, entry) => sum + entry.percent, 0) / windowEntries.length).toFixed(1));
  const bestPercent = Number(Math.max(...windowEntries.map((entry) => entry.percent)).toFixed(1));
  const avgDone = Number((windowEntries.reduce((sum, entry) => sum + entry.done, 0) / windowEntries.length).toFixed(1));
  const bestDone = Math.max(...windowEntries.map((entry) => entry.done));
  const first = windowEntries[0];
  const latest = windowEntries[windowEntries.length - 1];
  const delta = Number((latest.percent - first.percent).toFixed(1));

  let signal = 'regression / reset-heavy';
  if (delta >= 10) {
    signal = 'strong improvement';
  } else if (delta >= 3) {
    signal = 'positive improvement';
  } else if (delta > -3) {
    signal = 'mostly flat';
  }

  return {
    label,
    entryCount: windowEntries.length,
    daysCovered: uniqueDays.size,
    avgPercent,
    bestPercent,
    avgDone,
    bestDone,
    latestEntry: latest,
    signal,
  };
}

function walkChangedFiles(rootDir, thresholdMs) {
  let count = 0;

  function visit(currentDir) {
    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (excludedDirs.has(entry.name)) continue;
        visit(fullPath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (!includedExtensions.has(ext)) continue;

      try {
        const stats = fs.statSync(fullPath);
        if (stats.mtimeMs >= thresholdMs) {
          count += 1;
        }
      } catch {
        count += 0;
      }
    }
  }

  const preferredRoots = ['src', 'server', 'scripts', 'business_docs', 'plans', 'docs', 'public', 'api', 'backend', 'modules'];
  let visitedPreferred = false;

  for (const rel of preferredRoots) {
    const full = path.join(rootDir, rel);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
      visit(full);
      visitedPreferred = true;
    }
  }

  if (!visitedPreferred) {
    visit(rootDir);
  }

  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!includedExtensions.has(ext)) continue;
    const fullPath = path.join(rootDir, entry.name);
    try {
      const stats = fs.statSync(fullPath);
      if (stats.mtimeMs >= thresholdMs) {
        count += 1;
      }
    } catch {
      count += 0;
    }
  }

  return count;
}

function addLine(lines, text = '') {
  lines.push(text);
}

if (!noClear) {
  clearConsole();
}

const current = parseQueueSnapshot(queueFile);
const trackerEntries = parseTrackerEntries(trackerFile);
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const weekStart = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
const dailySummary = showDaily ? getWindowSummary(trackerEntries, today, 'Daily') : null;
const weeklySummary = showWeekly ? getWindowSummary(trackerEntries, weekStart, 'Weekly') : null;
const filesChanged24h = walkChangedFiles(workspaceRoot, now.getTime() - 24 * 60 * 60 * 1000);
const filesChanged7d = walkChangedFiles(workspaceRoot, now.getTime() - 7 * 24 * 60 * 60 * 1000);

if (brief) {
  const lines = [];
  addLine(lines, 'Aegis Progress Check');
  if (dailySummary) {
    addLine(lines, `  Daily  -> entries=${dailySummary.entryCount}, avg=${dailySummary.avgPercent}%, best=${dailySummary.bestPercent}%, signal=${dailySummary.signal}`);
  }
  if (weeklySummary) {
    addLine(lines, `  Weekly -> entries=${weeklySummary.entryCount}, avg=${weeklySummary.avgPercent}%, best=${weeklySummary.bestPercent}%, signal=${weeklySummary.signal}`);
  }
  if (current) {
    addLine(lines, `  Live   -> cycle=${current.cycle}, progress=${current.done}/${current.total} (${current.percent}%), pending=${current.pending}, running=${current.running}`);
  }
  addLine(lines, `  Files  -> changed last 24h=${filesChanged24h}, last 7d=${filesChanged7d}`);
  process.stdout.write(`${lines.join('\n')}\n`);
  process.exit(0);
}

const lines = [];
const width = 76;
addLine(lines, '='.repeat(width));
addLine(lines, '  AEGIS DAILY / WEEKLY PROGRESS REPORT');
addLine(lines, `  ${now.toISOString().slice(0, 16).replace('T', ' ')}`);
addLine(lines, '='.repeat(width));
addLine(lines);

if (current) {
  addLine(lines, '  LIVE AEGIS SNAPSHOT');
  addLine(lines, `    Cycle     : ${current.cycle}`);
  addLine(lines, `    Progress  : ${current.done}/${current.total} done (${current.percent}%)`);
  addLine(lines, `    In flight : pending=${current.pending}, running=${current.running}`);
  addLine(lines);
}

function appendSummary(summary) {
  addLine(lines, `  ${summary.label.toUpperCase()} WINDOW`);
  if (summary.entryCount === 0) {
    addLine(lines, '    No historical Aegis sync data found for this window yet.');
    addLine(lines);
    return;
  }

  addLine(lines, `    Tracker entries     : ${summary.entryCount}`);
  addLine(lines, `    Days represented    : ${summary.daysCovered}`);
  addLine(lines, `    Average completion  : ${summary.avgPercent}%`);
  addLine(lines, `    Best completion     : ${summary.bestPercent}%`);
  addLine(lines, `    Average done count  : ${summary.avgDone}`);
  addLine(lines, `    Best done count     : ${summary.bestDone}`);
  addLine(lines, `    Latest tracker snap : ${summary.latestEntry.date.toISOString().slice(0, 10)} -> ${summary.latestEntry.done}/${summary.latestEntry.total} (${summary.latestEntry.percent}%)`);
  addLine(lines, `    Improvement signal  : ${summary.signal}`);
  addLine(lines);
}

if (dailySummary) appendSummary(dailySummary);
if (weeklySummary) appendSummary(weeklySummary);

addLine(lines, '  FILE CHANGE COUNTERS');
addLine(lines, `    Files changed last 24h : ${filesChanged24h}`);
addLine(lines, `    Files changed last 7d  : ${filesChanged7d}`);
addLine(lines);

addLine(lines, '  CAN AEGIS IMPROVE THE PROJECT?');
const positiveTrend = (weeklySummary && /strong improvement|positive improvement/.test(weeklySummary.signal))
  || (dailySummary && /strong improvement|positive improvement/.test(dailySummary.signal));
const verdict = positiveTrend || (current && current.percent >= 50) || filesChanged7d >= 10
  ? 'Yes — Aegis is showing measurable progress in queue completion and/or file churn.'
  : 'Partially — Aegis is active, but the measurable improvement trend is still weak or early-stage.';
addLine(lines, `    ${verdict}`);
addLine(lines, '    Tip: watch both completion % and changed-file counts to judge real project movement.');
addLine(lines);
addLine(lines, '  COMMANDS');
addLine(lines, '    npm run orchestrator:aegis:progress');
addLine(lines, '    npm run orchestrator:aegis:progress:daily');
addLine(lines, '    npm run orchestrator:aegis:progress:weekly');
addLine(lines, '    npm run orchestrator:aegis:progress:brief');
addLine(lines, '='.repeat(width));
addLine(lines);

process.stdout.write(`${lines.join('\n')}\n`);
