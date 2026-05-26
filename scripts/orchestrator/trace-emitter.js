#!/usr/bin/env node
/**
 * Aegis vNext — OpenTelemetry-style Trace Emitter (Phase C / #5)
 * Emits structured span/event records to JSONL trace logs for each agent turn, handoff,
 * and hard-stop. Provides simple observability without an external OTEL collector.
 *
 * Usage:
 *   node trace-emitter.js --span <name> [--attrs <json>]          # emit a complete instant span
 *   node trace-emitter.js --start-span <name> [--attrs <json>]    # start a span, print spanId
 *   node trace-emitter.js --end-span <spanId> [--status ok|error] # end an open span
 *   node trace-emitter.js --event <type> [--data <json>]          # emit a standalone event
 *   node trace-emitter.js --tail [--n <lines>]                    # tail the current trace file
 *   node trace-emitter.js --status                                 # show trace config + file info
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, '..', '..');
const POLICY_PATH = join(__dirname, 'policy.json');

function readPolicy() {
  return JSON.parse(readFileSync(POLICY_PATH, 'utf8'));
}

function getTraceDir(policy) {
  const dir = join(ROOT, policy.observability?.tracing?.traceDir ?? 'logs/orchestrator/traces');
  mkdirSync(dir, { recursive: true });
  return dir;
}

function getCurrentTraceFile(traceDir) {
  const date = new Date().toISOString().slice(0, 10);
  return join(traceDir, `trace-${date}.jsonl`);
}

function getOpenSpansFile(traceDir) {
  return join(traceDir, '.open-spans.json');
}

function readOpenSpans(spansFile) {
  if (!existsSync(spansFile)) return {};
  try {
    return JSON.parse(readFileSync(spansFile, 'utf8'));
  } catch {
    return {};
  }
}

function writeOpenSpans(spansFile, spans) {
  writeFileSync(spansFile, JSON.stringify(spans, null, 2), 'utf8');
}

function appendRecord(traceFile, record) {
  appendFileSync(traceFile, JSON.stringify(record) + '\n', 'utf8');
}

function makeSpanRecord(spanId, name, startTime, endTime, status, attrs) {
  return {
    type: 'span',
    traceId: process.env.AEGIS_TRACE_ID ?? 'aegis-session',
    spanId,
    name,
    startTime,
    endTime,
    durationMs: endTime ? new Date(endTime) - new Date(startTime) : null,
    status: status ?? 'ok',
    attributes: attrs ?? {},
    service: 'aegis-orchestrator',
  };
}

function makeEventRecord(type, data) {
  return {
    type: 'event',
    traceId: process.env.AEGIS_TRACE_ID ?? 'aegis-session',
    eventType: type,
    timestamp: new Date().toISOString(),
    data: data ?? {},
    service: 'aegis-orchestrator',
  };
}

// ── Emit Functions ────────────────────────────────────────────────────────────

function emitInstantSpan(name, attrsArg, policy) {
  const traceDir = getTraceDir(policy);
  const traceFile = getCurrentTraceFile(traceDir);
  const now = new Date().toISOString();
  const spanId = randomUUID().slice(0, 8);
  let attrs = {};
  if (attrsArg) {
    try { attrs = JSON.parse(attrsArg); } catch { attrs = { note: attrsArg }; }
  }
  const record = makeSpanRecord(spanId, name, now, now, 'ok', attrs);
  appendRecord(traceFile, record);
  console.log(`Span emitted: ${name} [${spanId}] → ${traceFile}`);
  return spanId;
}

function startSpan(name, attrsArg, policy) {
  const traceDir = getTraceDir(policy);
  const spansFile = getOpenSpansFile(traceDir);
  const spans = readOpenSpans(spansFile);

  const spanId = randomUUID().slice(0, 8);
  const now = new Date().toISOString();
  let attrs = {};
  if (attrsArg) {
    try { attrs = JSON.parse(attrsArg); } catch { attrs = { note: attrsArg }; }
  }
  spans[spanId] = { name, startTime: now, attributes: attrs };
  writeOpenSpans(spansFile, spans);
  console.log(`Span started: ${name} [${spanId}]`);
  return spanId;
}

function endSpan(spanId, status, policy) {
  const traceDir = getTraceDir(policy);
  const traceFile = getCurrentTraceFile(traceDir);
  const spansFile = getOpenSpansFile(traceDir);
  const spans = readOpenSpans(spansFile);

  const span = spans[spanId];
  if (!span) {
    console.error(`Open span not found: ${spanId}`);
    process.exit(1);
  }

  const now = new Date().toISOString();
  const record = makeSpanRecord(spanId, span.name, span.startTime, now, status ?? 'ok', span.attributes);
  appendRecord(traceFile, record);

  delete spans[spanId];
  writeOpenSpans(spansFile, spans);
  console.log(`Span ended: ${span.name} [${spanId}] — ${record.durationMs}ms — ${record.status}`);
}

function emitEvent(type, dataArg, policy) {
  const traceDir = getTraceDir(policy);
  const traceFile = getCurrentTraceFile(traceDir);
  let data = {};
  if (dataArg) {
    try { data = JSON.parse(dataArg); } catch { data = { note: dataArg }; }
  }
  const record = makeEventRecord(type, data);
  appendRecord(traceFile, record);
  console.log(`Event emitted: ${type} → ${traceFile}`);
}

function tailTraceFile(n, policy) {
  const traceDir = getTraceDir(policy);
  const traceFile = getCurrentTraceFile(traceDir);

  if (!existsSync(traceFile)) {
    console.log('No trace file for today yet.');
    return;
  }

  const lines = readFileSync(traceFile, 'utf8').split('\n').filter(Boolean);
  const tail = lines.slice(-Math.min(parseInt(n ?? '20', 10), lines.length));
  console.log(`\nTrace file: ${traceFile} (last ${tail.length} records)\n`);
  tail.forEach((line) => {
    try {
      const rec = JSON.parse(line);
      if (rec.type === 'span') {
        console.log(`  [span] ${rec.name} [${rec.spanId}] ${rec.durationMs ?? 0}ms — ${rec.status}`);
      } else {
        console.log(`  [event] ${rec.eventType} @ ${rec.timestamp}`);
      }
    } catch {
      console.log(`  ${line}`);
    }
  });
}

function printStatus(policy) {
  const traceDir = getTraceDir(policy);
  const traceFile = getCurrentTraceFile(traceDir);
  const cfg = policy.observability?.tracing ?? {};

  console.log('\n=== Aegis Trace Emitter Status ===');
  console.log(`Enabled: ${cfg.enabled ?? false}`);
  console.log(`Trace dir: ${traceDir}`);
  console.log(`Today's trace file: ${traceFile} (${existsSync(traceFile) ? 'exists' : 'not yet created'})`);
  console.log(`Retain days: ${cfg.retainDays ?? 30}`);
  console.log(`Emit on: agent-turn=${cfg.emitOnAgentTurn}, handoff=${cfg.emitOnHandoff}, hard-stop=${cfg.emitOnHardStop}`);

  if (existsSync(traceDir)) {
    const files = readdirSync(traceDir).filter((f) => f.endsWith('.jsonl'));
    console.log(`Trace files: ${files.length}`);
  }
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const policy = readPolicy();

if (!policy.observability?.tracing?.enabled) {
  console.warn('Tracing is disabled in policy.json (observability.tracing.enabled=false)');
  process.exit(0);
}

if (args.includes('--span')) {
  const name = args[args.indexOf('--span') + 1];
  const attrsArg = args.includes('--attrs') ? args[args.indexOf('--attrs') + 1] : null;
  emitInstantSpan(name, attrsArg, policy);
} else if (args.includes('--start-span')) {
  const name = args[args.indexOf('--start-span') + 1];
  const attrsArg = args.includes('--attrs') ? args[args.indexOf('--attrs') + 1] : null;
  startSpan(name, attrsArg, policy);
} else if (args.includes('--end-span')) {
  const spanId = args[args.indexOf('--end-span') + 1];
  const status = args.includes('--status') ? args[args.indexOf('--status') + 1] : 'ok';
  endSpan(spanId, status, policy);
} else if (args.includes('--event')) {
  const type = args[args.indexOf('--event') + 1];
  const dataArg = args.includes('--data') ? args[args.indexOf('--data') + 1] : null;
  emitEvent(type, dataArg, policy);
} else if (args.includes('--tail')) {
  const n = args.includes('--n') ? args[args.indexOf('--n') + 1] : '20';
  tailTraceFile(n, policy);
} else if (args.includes('--status') || args.length === 0) {
  printStatus(policy);
} else {
  console.log('Usage: node trace-emitter.js [--span <name>|--start-span <name>|--end-span <id>|--event <type>|--tail|--status]');
}
