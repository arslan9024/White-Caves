#!/usr/bin/env node
/**
 * autopilot-session.js — White Caves Copilot Autopilot Session Entry Point
 *
 * This script is the FIRST thing run at the start of every Copilot agent
 * session in the unlimited autopilot loop. It:
 *
 *   1. Reads the last session snapshot to understand what was completed
 *   2. Triggers a fresh codebase scan (unless --skip-scan)
 *   3. Runs task reprioritisation based on the scan
 *   4. Outputs a structured SESSION DISPATCH PACKET that tells the Copilot
 *      agent exactly what task to work on next and how to verify completion
 *   5. Records the session start state in logs/orchestrator/session-snapshot.json
 *
 * The packet is also printed to stdout in a Copilot-agent-readable format
 * so the agent can immediately begin execution.
 *
 * Loop continuation: after the agent completes the task, it calls:
 *   npm run autopilot:session:end  (or session-end.ps1)
 * which records completion and triggers the next loop iteration.
 *
 * Usage:
 *   node scripts/orchestrator/autopilot-session.js
 *   node scripts/orchestrator/autopilot-session.js --skip-scan
 *   node scripts/orchestrator/autopilot-session.js --skip-scan --json
 *
 * Flags:
 *   --skip-scan   Skip the codebase-scan step (use cached report)
 *   --json        Output dispatch packet as JSON to stdout only
 *   --dry         Do not update session snapshot
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createTraceContext, loadPolicy, runPolicyDiffGate } from './policy-loader.js';
import { artifactPaths, refreshGovernanceArtifacts, writeJson } from './governance-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ────────────────────────────────────────────────────────────────
const ROOT          = path.resolve(__dirname, '..', '..');
const LOGS_DIR      = path.join(ROOT, 'logs', 'orchestrator');
const SCAN_REPORT   = path.join(LOGS_DIR, 'codebase-scan-report.json');
const PRIORITY_FILE = path.join(LOGS_DIR, 'priority-order.json');
const SNAPSHOT_FILE = path.join(LOGS_DIR, 'session-snapshot.json');
const GOVERNANCE_PATHS = artifactPaths();

const SKIP_SCAN  = process.argv.includes('--skip-scan');
const JSON_OUT   = process.argv.includes('--json');
const DRY_RUN    = process.argv.includes('--dry');

const SESSION_ID = `session-${Date.now()}`;
const SESSION_START = new Date().toISOString();

// ─── Helpers ───────────────────────────────────────────────────────────────
function readJSON(fp) {
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return null; }
}

function writeJSON(fp, data) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

function runNode(scriptPath, args = []) {
  const result = spawnSync('node', [scriptPath, ...args], {
    cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8',
  });
  return { ok: result.status === 0, stdout: result.stdout || '', stderr: result.stderr || '' };
}

function rerunReprioritize() {
  return runNode(path.join(__dirname, 'reprioritize.js'));
}

function attemptAutomaticDiscovery() {
  return runNode(path.join(__dirname, 'discover-upgrade.js'));
}

// ─── Stop condition checks ─────────────────────────────────────────────────
function checkHardStops(scanReport, policy, policyDiffGate) {
  const stops = [];
  if (policyDiffGate && !policyDiffGate.passed) {
    stops.push({
      code: 'POLICY_DIFF',
      message: `Critical policy diff detected. Add ACK file at ${policyDiffGate.ackPath} or revert critical policy changes.`,
      priority: 'P0',
    });
  }
  if (!scanReport) return stops;

  if (!scanReport.summary.buildOk) {
    stops.push({ code: 'BUILD_FAIL', message: 'Build is failing — must fix before any other work', priority: 'P0' });
  }
  if (scanReport.summary.tsErrors > 0) {
    stops.push({ code: 'TS_ERRORS', message: `TypeScript has ${scanReport.summary.tsErrors} error(s)`, priority: 'P0' });
  }
  if (scanReport.securityFlags && scanReport.securityFlags.length > 0) {
    stops.push({ code: 'SECURITY', message: `${scanReport.securityFlags.length} potential security issue(s) detected`, priority: 'P0' });
  }

  if (policy?.hardStops?.stopOnPolicyMismatch && policyDiffGate && policyDiffGate.requiresAck && !policyDiffGate.hasAck) {
    stops.push({ code: 'POLICY_ACK_REQUIRED', message: 'Policy diff ack file is required for critical policy changes', priority: 'P0' });
  }

  return stops;
}

// ─── Session snapshot ──────────────────────────────────────────────────────
function loadLastSnapshot() {
  return readJSON(SNAPSHOT_FILE) || { date: null, sessionId: null, completedTaskIds: [], passCount: 0, failCount: 0, doneCount: 0 };
}

function buildSnapshot(sessionId, dispatchPacket, scanReport, previousSnapshot, hardStops) {
  return {
    date:             SESSION_START,
    sessionId,
    previousSessionId: previousSnapshot.sessionId,
    loopIteration:    (previousSnapshot.loopIteration || 0) + 1,
    scanReportDate:   scanReport ? scanReport.scanDate : null,
    currentTask:      dispatchPacket ? { id: dispatchPacket.taskId, agent: dispatchPacket.agent } : null,
    hardStops:        scanReport ? hardStops : [],
    // These are updated by session-end.ps1
    completedTaskIds: previousSnapshot.completedTaskIds || [],
    passCount:        previousSnapshot.passCount  || 0,
    failCount:        previousSnapshot.failCount  || 0,
    doneCount:        previousSnapshot.doneCount  || 0,
    status:           'in_progress',
  };
}

// ─── Research Phase Summary ────────────────────────────────────────────────
function buildResearchSummary(scanReport, hardStops) {
  if (!scanReport) return { available: false };

  const { summary, priorityList, openWaves } = scanReport;
  const topIssues = (priorityList || []).slice(0, 5).map(item => ({
    priority: item.priority,
    category: item.category,
    title:    item.title,
    agents:   item.recommendedAgents,
  }));

  return {
    available:        true,
    scanDate:         scanReport.scanDate,
    buildHealth:      summary.buildOk ? '✓ GREEN' : '✗ FAILING',
    tsErrors:         summary.tsErrors,
    readyWaves:       (openWaves || []).filter(w => w.status && w.status.includes('🟢')).map(w => `Wave ${w.wave}: ${w.objective}`),
    incompleteDocs:   summary.incompleteDocs,
    topCodeIssues:    topIssues,
    hardStops,
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const sep   = '═'.repeat(72);
  const sep2  = '─'.repeat(72);
  const policy = loadPolicy();
  const trace = createTraceContext(policy, { component: 'autopilot-session' });
  process.env.AEGIS_TRACE_ID = trace.traceId;
  process.env.AEGIS_SESSION_ID = trace.sessionId;
  const policyDiffGate = runPolicyDiffGate(policy);
  const previousSnapshot = loadLastSnapshot();

  if (policy.hardStops?.stopOnPolicyMismatch && !policyDiffGate.passed) {
    console.error('Policy diff gate failed before session start.');
    console.error(`Acknowledge critical policy diffs by creating: ${policyDiffGate.ackPath}`);
    process.exit(2);
  }

  if (!JSON_OUT) {
    console.log(`\n${sep}`);
    console.log('  WHITE CAVES — AUTOPILOT SESSION START');
    console.log(`  Session  : ${SESSION_ID}`);
    console.log(`  Loop     : #${(previousSnapshot.loopIteration || 0) + 1}`);
    console.log(`  Started  : ${SESSION_START}`);
    console.log(`  Trace ID : ${trace.traceId}`);
    if (previousSnapshot.sessionId) {
      console.log(`  Previous : ${previousSnapshot.sessionId}`);
    }
    console.log(sep);
  }

  // ── PHASE 1: Research — Codebase Scan ─────────────────────────────────
  if (!JSON_OUT) console.log('\n  📡  PHASE 1 — RESEARCH: Scanning codebase…\n');

  let scanReport = null;
  if (!SKIP_SCAN) {
    const scanResult = runNode(path.join(__dirname, 'codebase-scan.js'), ['--brief']);
    if (!JSON_OUT) {
      if (scanResult.ok) console.log('  ✓ Codebase scan completed');
      else console.log('  ⚠ Codebase scan encountered issues (continuing with partial data)');
    }
  } else {
    if (!JSON_OUT) console.log('  ⟳ Using cached scan report (--skip-scan)');
  }
  scanReport = readJSON(SCAN_REPORT);

  // ── PHASE 2: Reprioritise ─────────────────────────────────────────────
  if (!JSON_OUT) console.log('\n  🔢  PHASE 2 — REPRIORITISE: Computing task order…\n');

  const repriResult = rerunReprioritize();
  if (!JSON_OUT) {
    if (repriResult.ok) console.log('  ✓ Task reprioritisation completed');
    else console.log('  ⚠ Reprioritisation encountered issues');
  }

  let priorityOrder = readJSON(PRIORITY_FILE);

  // ── PHASE 3: Hard Stop Check ──────────────────────────────────────────
  const hardStops = checkHardStops(scanReport, policy, policyDiffGate);
  if (hardStops.length > 0) {
    if (!JSON_OUT) {
      console.log(`\n  🚨  HARD STOP CONDITIONS DETECTED:\n`);
      hardStops.forEach(s => console.log(`     [${s.priority}] ${s.code}: ${s.message}`));
      console.log('\n  Autopilot will target these P0 issues in this session.\n');
    }
  }

  // ── PHASE 4: Build Dispatch Packet ───────────────────────────────────
  let dispatchPacket = priorityOrder ? priorityOrder.dispatchPacket : null;
  const researchSummary = buildResearchSummary(scanReport, hardStops);

  // ── Record session snapshot ───────────────────────────────────────────
  if (!dispatchPacket) {
    if (!JSON_OUT) {
      console.log('\n  🧭  No eligible task found. Attempting automatic upgrade discovery…\n');
    }

    const discoveryResult = attemptAutomaticDiscovery();
    if (!JSON_OUT) {
      if (discoveryResult.ok) console.log('  ✓ Automatic upgrade discovery completed');
      else console.log('  ⚠ Automatic upgrade discovery did not produce usable tasks');
    }

    if (discoveryResult.ok) {
      const redispatchResult = rerunReprioritize();
      if (!JSON_OUT) {
        if (redispatchResult.ok) console.log('  ✓ Reprioritisation rerun after discovery');
        else console.log('  ⚠ Reprioritisation rerun failed after discovery');
      }
      priorityOrder = readJSON(PRIORITY_FILE);
      dispatchPacket = priorityOrder ? priorityOrder.dispatchPacket : null;
    }
  }

  const snapshot = buildSnapshot(SESSION_ID, dispatchPacket, scanReport, previousSnapshot, hardStops);
  let governanceArtifacts = null;
  if (dispatchPacket) {
    governanceArtifacts = refreshGovernanceArtifacts({
      policy,
      sessionId: SESSION_ID,
      dispatchPacket,
      previousSnapshot,
      hardStops,
    });
  }
  if (!DRY_RUN) {
    writeJSON(SNAPSHOT_FILE, snapshot);
    if (governanceArtifacts) {
      writeJson(GOVERNANCE_PATHS.routingDecision, governanceArtifacts.routingDecision);
      writeJson(GOVERNANCE_PATHS.contextManifest, governanceArtifacts.manifest);
      writeJson(path.join(LOGS_DIR, 'session-plan-packet.json'), governanceArtifacts.planPacket);
      writeJson(GOVERNANCE_PATHS.handoffSummary, governanceArtifacts.handoffSummary);
      writeJson(GOVERNANCE_PATHS.bootstrapPacket, governanceArtifacts.bootstrapPacket);
    }
  }

  // ── Build full session brief ──────────────────────────────────────────
  const sessionBrief = {
    sessionId:       SESSION_ID,
    sessionStart:    SESSION_START,
    loopIteration:   snapshot.loopIteration,
    trace,
    policy: {
      minReadiness:  policy.readinessThresholdPct ?? policy.minReadinessPercent ?? 60,
      approvalPhrase: policy.approvalPhrase,
      version: policy.version,
      schemaVersion: policy.schemaVersion,
      rolloutEnvironment: policy.rollout?.environment,
      policyDiffGate,
    },
    research:        researchSummary,
    hardStops,
    nextTask:        priorityOrder ? priorityOrder.nextTask : null,
    dispatchPacket,
    routingDecision: governanceArtifacts ? governanceArtifacts.routingDecision : null,
    planPacket: governanceArtifacts ? governanceArtifacts.planPacket : null,
    contextManifest: governanceArtifacts ? governanceArtifacts.manifest : null,
    handoffSummary: governanceArtifacts ? governanceArtifacts.handoffSummary : null,
    automationInstructions: {
      step1: 'Review the dispatchPacket below — this is your task for this session',
      step2: 'Read the inputArtifacts listed and understand current state',
      step3: 'Execute the task described in fullPrompt using the appropriate agent or tool',
      step4: 'Validate using the validationCommand after completion',
      step5: 'Ensure CONSUMES + FEEDS + FEEDS_ACK tags are present in output',
      step6: 'Run: npm run autopilot:session:end to close this session and queue the next',
      step7: 'The next loop iteration will automatically start on the next agent invocation',
    },
    loopContinuationNote: [
      'This autopilot loop is UNLIMITED. Each Copilot session:',
      '  1. Starts with this script (autopilot-session.js)',
      '  2. Implements the dispatched task',
      '  3. Ends with session-end.ps1',
      '  4. The next session starts fresh with a new codebase scan',
      'Stop conditions: manual PAUSE, build failure, TypeScript errors, security violation',
    ],
  };

  if (JSON_OUT) {
    console.log(JSON.stringify(sessionBrief, null, 2));
    return;
  }

  // ── Human-readable output ─────────────────────────────────────────────
  console.log(`\n${sep2}`);
  console.log('  📊  RESEARCH PHASE SUMMARY');
  console.log(sep2);
  console.log(`  Build health   : ${researchSummary.buildHealth || 'N/A'}`);
  console.log(`  TS errors      : ${researchSummary.tsErrors ?? 'N/A'}`);
  console.log(`  Ready waves    : ${(researchSummary.readyWaves || []).length > 0 ? researchSummary.readyWaves.join(', ') : 'none'}`);
  console.log(`  Incomplete docs: ${researchSummary.incompleteDocs ?? 'N/A'}`);
  if (researchSummary.topCodeIssues && researchSummary.topCodeIssues.length > 0) {
    console.log('\n  Top Code Issues:');
    researchSummary.topCodeIssues.forEach((issue, i) => {
      console.log(`    ${i + 1}. [${issue.priority}] ${issue.title}`);
    });
  }

  if (governanceArtifacts?.routingDecision) {
    console.log(`  Routing tier  : ${governanceArtifacts.routingDecision.modelTier}`);
    console.log(`  Task class    : ${governanceArtifacts.routingDecision.taskClass}`);
    console.log(`  Context size  : ${governanceArtifacts.routingDecision.contextSize}`);
    console.log(`  New chat hint : ${governanceArtifacts.manifest.newChatRecommendation.needed ? governanceArtifacts.manifest.newChatRecommendation.reasons.join(', ') : 'not needed'}`);
  }

  if (hardStops.length > 0) {
    console.log(`\n${sep2}`);
    console.log('  🚨  HARD STOPS (must fix first):');
    hardStops.forEach(s => console.log(`    • [${s.priority}] ${s.message}`));
  }

  console.log(`\n${sep2}`);
  console.log('  🎯  THIS SESSION\'S TASK (DISPATCH PACKET)');
  console.log(sep2);

  if (!dispatchPacket) {
    console.log('  ⚠  No eligible tasks found in queue.');
    console.log('     Run: npm run orchestrator:queue:init to initialise the queue,');
    console.log('     or check logs/orchestrator/task-queue.json for blocked tasks.\n');
    process.exit(0);
  }

  console.log(`  Task ID    : ${dispatchPacket.taskId}`);
  console.log(`  Agent      : ${dispatchPacket.agent} — ${dispatchPacket.agentTitle}`);
  console.log(`  Unit       : ${dispatchPacket.agentUnit}`);
  console.log(`  Model      : ${dispatchPacket.agentModel}`);
  if (dispatchPacket.agentToolUrl) console.log(`  Tool URL   : ${dispatchPacket.agentToolUrl}`);
  console.log(`\n  Objective  :`);
  console.log(`    ${dispatchPacket.objective}`);
  if (dispatchPacket.fullPrompt && dispatchPacket.fullPrompt !== dispatchPacket.objective) {
    console.log(`\n  Full Prompt (copy to free agent tool):`);
    console.log(`    ${dispatchPacket.fullPrompt.slice(0, 500)}`);
  }

  if (dispatchPacket.inputArtifacts && dispatchPacket.inputArtifacts.length > 0) {
    console.log(`\n  Input Artifacts (CONSUMES):`);
    dispatchPacket.inputArtifacts.forEach(a => console.log(`    • ${a}`));
  }

  if (dispatchPacket.outputArtifact) {
    console.log(`\n  Output Artifact (FEEDS): ${dispatchPacket.outputArtifact}`);
  }

  console.log(`\n  Acceptance Criteria:`);
  (dispatchPacket.acceptanceCriteria || []).forEach((c, i) => console.log(`    ${i + 1}. ${c}`));

  console.log(`\n  Validation : ${dispatchPacket.validationCommand}`);
  console.log(`\n  Invocation :`);
  console.log(`    ${dispatchPacket.invocationPattern}`);

  console.log(`\n${sep2}`);
  console.log('  ⚙  AUTOMATION INSTRUCTIONS');
  console.log(sep2);
  Object.values(sessionBrief.automationInstructions).forEach(step => console.log(`  ${step}`));

  console.log(`\n${sep}`);
  console.log(`  Session snapshot saved → ${SNAPSHOT_FILE}`);
  console.log(`  Loop iteration: #${snapshot.loopIteration}`);
  console.log(`  Ready for task execution. Good luck, ${dispatchPacket.agent}!`);
  console.log(sep + '\n');
}

main().catch(err => {
  console.error('autopilot-session.js error:', err.message);
  process.exit(1);
});
