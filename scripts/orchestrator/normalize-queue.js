#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const LOGS_DIR = path.join(ROOT, 'logs', 'orchestrator');
const QUEUE_FILE = path.join(LOGS_DIR, 'task-queue.json');
const PROMPTS_FILE = path.join(__dirname, 'prompts.json');

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const JSON_OUT = args.includes('--json');

function readJSON(filePath, fallback = null) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function statusRank(status) {
  switch (String(status || '').toLowerCase()) {
    case 'running':
      return 6;
    case 'waiting_ack':
      return 5;
    case 'retrying':
      return 4;
    case 'queued':
      return 3;
    case 'blocked':
      return 2;
    case 'done':
    case 'complete':
      return 1;
    case 'archived':
      return 0;
    default:
      return 0;
  }
}

function dateValue(task) {
  const candidate = task.finishedAt || task.completedAt || task.startedAt || task.createdAt || '';
  const millis = Date.parse(candidate);
  return Number.isNaN(millis) ? 0 : millis;
}

function compareTasks(a, b) {
  const rankDiff = statusRank(b.status) - statusRank(a.status);
  if (rankDiff !== 0) return rankDiff;

  const dateDiff = dateValue(b) - dateValue(a);
  if (dateDiff !== 0) return dateDiff;

  return String(a.taskId || a.id || '').localeCompare(String(b.taskId || b.id || ''));
}

function summarizeStatus(tasks) {
  const summary = {};
  for (const task of tasks) {
    const status = String(task.status || 'unknown').toLowerCase();
    summary[status] = (summary[status] || 0) + 1;
  }
  return summary;
}

function normalizeQueue(queue) {
  const tasks = Array.isArray(queue?.tasks) ? queue.tasks : [];
  const byFeature = new Map();
  const duplicateGroups = [];

  for (const task of tasks) {
    const featureId = String(task.featureId || '').trim();
    const key = featureId || `task:${String(task.taskId || task.id || '').trim()}`;
    if (!byFeature.has(key)) {
      byFeature.set(key, []);
    }
    byFeature.get(key).push(task);
  }

  const normalizedTasks = [];
  const keptTaskIds = new Set();
  const removedTaskIds = new Set();

  for (const [key, group] of byFeature.entries()) {
    const ordered = [...group].sort(compareTasks);
    const keep = ordered[0];
    normalizedTasks.push(keep);
    keptTaskIds.add(String(keep.taskId || keep.id || ''));

    if (group.length > 1) {
      ordered.slice(1).forEach(task => removedTaskIds.add(String(task.taskId || task.id || '')));
      duplicateGroups.push({
        key,
        keptTaskId: String(keep.taskId || keep.id || ''),
        removedTaskIds: ordered.slice(1).map(task => String(task.taskId || task.id || '')),
        statuses: ordered.map(task => String(task.status || 'unknown')),
      });
    }
  }

  normalizedTasks.sort((a, b) => compareTasks(a, b));

  return {
    normalizedQueue: {
      ...queue,
      generatedAt: new Date().toISOString(),
      normalizedAt: new Date().toISOString(),
      tasks: normalizedTasks,
    },
    keptTaskIds,
    removedTaskIds,
    duplicateGroups,
    beforeCount: tasks.length,
    afterCount: normalizedTasks.length,
    beforeStatusSummary: summarizeStatus(tasks),
    afterStatusSummary: summarizeStatus(normalizedTasks),
  };
}

function normalizePrompts(prompts, removedTaskIds) {
  if (!prompts || typeof prompts !== 'object') {
    return { prompts: {}, removedPromptIds: [] };
  }

  const nextPrompts = { ...prompts };
  const removedPromptIds = [];
  for (const taskId of removedTaskIds) {
    if (Object.prototype.hasOwnProperty.call(nextPrompts, taskId)) {
      removedPromptIds.push(taskId);
      delete nextPrompts[taskId];
    }
  }

  return { prompts: nextPrompts, removedPromptIds };
}

function main() {
  const queue = readJSON(QUEUE_FILE);
  if (!queue || !Array.isArray(queue.tasks)) {
    console.error('normalize-queue: task queue not found or invalid.');
    process.exit(1);
  }

  const prompts = readJSON(PROMPTS_FILE, {});
  const result = normalizeQueue(queue);
  const promptResult = normalizePrompts(prompts, result.removedTaskIds);

  const report = {
    generatedAt: new Date().toISOString(),
    apply: APPLY,
    beforeCount: result.beforeCount,
    afterCount: result.afterCount,
    removedTasks: result.beforeCount - result.afterCount,
    duplicateGroups: result.duplicateGroups,
    removedPromptIds: promptResult.removedPromptIds,
    beforeStatusSummary: result.beforeStatusSummary,
    afterStatusSummary: result.afterStatusSummary,
  };

  if (APPLY) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const queueBackup = path.join(LOGS_DIR, `task-queue.backup-${stamp}.json`);
    const promptsBackup = path.join(LOGS_DIR, `prompts.backup-${stamp}.json`);
    writeJSON(queueBackup, queue);
    writeJSON(promptsBackup, prompts);
    writeJSON(QUEUE_FILE, result.normalizedQueue);
    writeJSON(PROMPTS_FILE, promptResult.prompts);
    report.queueBackup = path.relative(ROOT, queueBackup).replace(/\\/g, '/');
    report.promptsBackup = path.relative(ROOT, promptsBackup).replace(/\\/g, '/');
  }

  if (JSON_OUT) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('WHITE CAVES - QUEUE NORMALIZATION REPORT');
  console.log(
    `Tasks: ${report.beforeCount} -> ${report.afterCount} (removed ${report.removedTasks})`
  );
  console.log(`Prompts removed: ${report.removedPromptIds.length}`);
  console.log(`Duplicate groups: ${report.duplicateGroups.length}`);
  if (report.duplicateGroups.length > 0) {
    for (const group of report.duplicateGroups.slice(0, 10)) {
      console.log(
        `- ${group.key}: kept ${group.keptTaskId}; removed ${group.removedTaskIds.join(', ')}`
      );
    }
    if (report.duplicateGroups.length > 10) {
      console.log(`- ... ${report.duplicateGroups.length - 10} more duplicate groups`);
    }
  }
  if (APPLY) {
    console.log(`Backups: ${report.queueBackup}, ${report.promptsBackup}`);
  }
}

main();
