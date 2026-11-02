#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadPolicy } from './policy-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');
const LOGS_DIR = join(ROOT, 'logs', 'orchestrator');

function safeReadJSON(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function safeReadJSONL(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function toPct(value) {
  return Math.round(value * 1000) / 10;
}

function pickByKeywords(tasks, keywords) {
  return tasks.filter((task) => {
    const text = `${task.title ?? ''} ${task.taskId ?? ''}`.toLowerCase();
    return keywords.some((keyword) => text.includes(keyword));
  });
}

function classifyWorkflowStep(task) {
  const text = `${task.title ?? ''} ${task.taskId ?? ''}`.toLowerCase();
  if (/(plan|readiness|spec|design|architecture|backlog|flowchart|sdd)/.test(text)) return 'plan';
  if (/(verify|test|gate|check|audit|quality|scan)/.test(text)) return 'verify';
  if (/(merge|release|deploy|push|pr|signoff)/.test(text)) return 'merge-ready';
  return 'code';
}

function depsSatisfied(task, doneTaskIds) {
  const deps = Array.isArray(task?.dependsOn) ? task.dependsOn : [];
  if (deps.length === 0) return true;
  return deps.every((dep) => doneTaskIds.has(dep));
}

function computeLearningActions({ blockerRate, waitingAckRate, rollbackRate, passRate, completionRate, planCount, featureCount }) {
  const actions = [];

  if (blockerRate >= 0.25) {
    actions.push({
      priority: 'P0',
      action: 'Reduce blockers by validating dependency readiness before dispatch.',
      expectedImprovement: 'Lower blocked queue share and faster cycle completion.',
    });
  }
  if (waitingAckRate >= 0.1) {
    actions.push({
      priority: 'P1',
      action: 'Add auto-reminders/escalation for waiting_ack tasks older than SLA.',
      expectedImprovement: 'Fewer stalled tasks and more predictable daily throughput.',
    });
  }
  if (rollbackRate >= 0.08) {
    actions.push({
      priority: 'P0',
      action: 'Tighten pre-merge verification for high-risk changes and rollback-prone areas.',
      expectedImprovement: 'Reduced regressions and rollback frequency.',
    });
  }
  if (passRate < 0.8) {
    actions.push({
      priority: 'P1',
      action: 'Increase targeted verification coverage before marking tasks done.',
      expectedImprovement: 'Higher pass rate and lower rework.',
    });
  }
  if (planCount > 0 && featureCount > 0 && planCount < Math.ceil(featureCount * 0.5)) {
    actions.push({
      priority: 'P2',
      action: 'Increase planning packet depth per feature wave.',
      expectedImprovement: 'Better implementation alignment and reduced rework.',
    });
  }
  if (completionRate < 0.6) {
    actions.push({
      priority: 'P1',
      action: 'Prioritize smallest unblockable tasks first to increase done momentum.',
      expectedImprovement: 'Higher completion rate in near-term iterations.',
    });
  }

  if (actions.length === 0) {
    actions.push({
      priority: 'P3',
      action: 'Maintain current routing; continue benchmarking and observe weekly deltas.',
      expectedImprovement: 'Sustained stability with measurable trend tracking.',
    });
  }

  return actions;
}

function main() {
  const policy = loadPolicy();
  const queue = safeReadJSON(join(LOGS_DIR, 'task-queue.json'));
  const workflowState = safeReadJSON(join(LOGS_DIR, 'workflow-state', 'current-state.json'));
  const snapshot = safeReadJSON(join(LOGS_DIR, 'session-snapshot.json'));
  const benchmarkHistory = safeReadJSONL(join(LOGS_DIR, 'benchmarks', 'task-history.jsonl'));
  const traces = safeReadJSONL(join(LOGS_DIR, 'traces', `trace-${new Date().toISOString().slice(0, 10)}.jsonl`));

  const tasks = Array.isArray(queue?.tasks) ? queue.tasks : [];
  const total = tasks.length;
  const countByStatus = {
    done: tasks.filter((task) => task.status === 'done').length,
    running: tasks.filter((task) => task.status === 'running').length,
    waiting_ack: tasks.filter((task) => task.status === 'waiting_ack').length,
    queued: tasks.filter((task) => task.status === 'queued').length,
    retrying: tasks.filter((task) => task.status === 'retrying').length,
    failed: tasks.filter((task) => task.status === 'failed').length,
    escalated: tasks.filter((task) => task.status === 'escalated').length,
  };

  const doneTasks = tasks.filter((task) => task.status === 'done');
  const doneTaskIds = new Set(doneTasks.map((task) => task.taskId));
  const blockedQueuedTasks = tasks.filter((task) => task.status === 'queued' && !depsSatisfied(task, doneTaskIds));
  const planTasks = pickByKeywords(doneTasks, ['plan', 'readiness', 'spec', 'design', 'architecture', 'flowchart', 'backlog', 'sdd']);
  const featureTasks = pickByKeywords(doneTasks, ['feature', 'implement', 'endpoint', 'component', 'module', 'integration', 'build', 'fix', 'ui', 'api']);

  const outcomes = {
    pass: benchmarkHistory.filter((entry) => entry.outcome === 'pass').length,
    fail: benchmarkHistory.filter((entry) => entry.outcome === 'fail').length,
    rework: benchmarkHistory.filter((entry) => entry.outcome === 'rework').length,
    rollback: benchmarkHistory.filter((entry) => entry.outcome === 'rollback').length,
  };
  const outcomeTotal = benchmarkHistory.length;
  const passRate = outcomeTotal > 0 ? (outcomes.pass + outcomes.rework) / outcomeTotal : 1;
  const rollbackRate = outcomeTotal > 0 ? outcomes.rollback / outcomeTotal : 0;

  const completionRate = total > 0 ? countByStatus.done / total : 0;
  const blockerRate = total > 0 ? blockedQueuedTasks.length / total : 0;
  const waitingAckRate = total > 0 ? countByStatus.waiting_ack / total : 0;
  const traceSpans = traces.filter((record) => record.type === 'span').length;
  const traceEvents = traces.filter((record) => record.type === 'event').length;

  const stepNames = policy.workflowGraph?.steps ?? ['plan', 'code', 'verify', 'merge-ready'];
  const history = Array.isArray(workflowState?.stepHistory) ? workflowState.stepHistory : [];
  const currentStep = workflowState?.currentStep ?? null;

  const stepCounters = Object.fromEntries(
    stepNames.map((stepName) => [
      stepName,
      {
        completedTransitions: history.filter((entry) => entry.step === stepName).length,
        taskCount: 0,
        sampleTasks: [],
        state: currentStep === stepName ? 'current' : (history.some((entry) => entry.step === stepName) ? 'completed' : 'pending'),
      },
    ]),
  );

  doneTasks.forEach((task) => {
    const step = classifyWorkflowStep(task);
    if (!stepCounters[step]) return;
    stepCounters[step].taskCount += 1;
    if (stepCounters[step].sampleTasks.length < 5) {
      stepCounters[step].sampleTasks.push({
        taskId: task.taskId,
        title: task.title,
        agent: task.agent,
      });
    }
  });

  const improvementImpactScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        (completionRate * 40)
        + (passRate * 35)
        + ((1 - rollbackRate) * 15)
        + ((1 - waitingAckRate) * 10),
      ),
    ),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    policyVersion: policy.version,
    session: {
      sessionId: snapshot?.sessionId ?? null,
      loopIteration: snapshot?.loopIteration ?? null,
      currentWorkflowStep: currentStep,
    },
    counters: {
      tasksTotal: total,
      ...countByStatus,
      completedTasks: doneTasks.length,
      generatedPlans: planTasks.length,
      implementedFeatures: featureTasks.length,
      benchmarkRecords: outcomeTotal,
      blockedQueuedTasks: blockedQueuedTasks.length,
      traceSpansToday: traceSpans,
      traceEventsToday: traceEvents,
    },
    workflow: {
      steps: stepCounters,
      stepHistoryCount: history.length,
    },
    outputs: {
      completedTasks: doneTasks.slice(0, 20).map((task) => ({
        taskId: task.taskId,
        title: task.title,
        agent: task.agent,
      })),
      generatedPlans: planTasks.slice(0, 20).map((task) => ({
        taskId: task.taskId,
        title: task.title,
        agent: task.agent,
      })),
      implementedFeatures: featureTasks.slice(0, 20).map((task) => ({
        taskId: task.taskId,
        title: task.title,
        agent: task.agent,
      })),
    },
    learning: {
      rates: {
        completionRatePct: toPct(completionRate),
        passRatePct: toPct(passRate),
        rollbackRatePct: toPct(rollbackRate),
        waitingAckRatePct: toPct(waitingAckRate),
      },
      improvementImpactScore,
      improvementEstimate: `${improvementImpactScore}% overall operational effectiveness`,
      recommendations: computeLearningActions({
        blockerRate: Math.max(0, blockerRate),
        waitingAckRate,
        rollbackRate,
        passRate,
        completionRate,
        planCount: planTasks.length,
        featureCount: featureTasks.length,
      }),
    },
  };

  const outputDir = join(LOGS_DIR, 'learning');
  const outputFile = join(outputDir, 'aegis-learning-report.json');
  if (!process.argv.includes('--no-save')) {
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputFile, JSON.stringify(report, null, 2), 'utf8');
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('\n=== Aegis Learning & Reporting Summary ===');
  console.log(`Policy: ${report.policyVersion}`);
  console.log(`Session: ${report.session.sessionId ?? 'n/a'} (loop ${report.session.loopIteration ?? 'n/a'})`);
  console.log(`Workflow Step: ${report.session.currentWorkflowStep ?? 'n/a'}`);
  console.log('\nCounters:');
  console.log(`- Tasks: ${report.counters.completedTasks}/${report.counters.tasksTotal} done`);
  console.log(`- Plans generated: ${report.counters.generatedPlans}`);
  console.log(`- Features implemented: ${report.counters.implementedFeatures}`);
  console.log(`- Waiting ACK: ${report.counters.waiting_ack}`);
  console.log(`- Blocked queued tasks: ${report.counters.blockedQueuedTasks}`);
  console.log(`- Failed/Escalated: ${report.counters.failed + report.counters.escalated}`);
  console.log(`- Trace spans/events today: ${report.counters.traceSpansToday}/${report.counters.traceEventsToday}`);
  console.log('\nStep Outputs:');
  stepNames.forEach((stepName) => {
    const step = report.workflow.steps[stepName];
    console.log(`- ${stepName}: ${step.state}, tasks=${step.taskCount}, transitions=${step.completedTransitions}`);
  });
  console.log('\nImprovement:');
  console.log(`- Estimated impact: ${report.learning.improvementEstimate}`);
  console.log(`- Completion rate: ${report.learning.rates.completionRatePct}%`);
  console.log(`- Pass rate: ${report.learning.rates.passRatePct}%`);
  console.log(`- Rollback rate: ${report.learning.rates.rollbackRatePct}%`);
  console.log('\nSelf-Improvement Actions:');
  report.learning.recommendations.forEach((item) => {
    console.log(`- [${item.priority}] ${item.action}`);
  });

  if (!process.argv.includes('--no-save')) {
    console.log(`\nSaved: ${outputFile}`);
  }
}

main();
