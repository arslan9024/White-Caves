#!/usr/bin/env node
import { dirname, join } from 'path';
import { loadPolicy } from './policy-loader.js';
import {
  artifactPaths,
  ensureLogsDir,
  refreshGovernanceArtifacts,
  safeReadJson,
  writeJson,
} from './governance-utils.js';

const args = process.argv.slice(2);
const jsonOut = args.includes('--json');
const mode = args.includes('--handoff')
  ? 'handoff'
  : args.includes('--bootstrap')
    ? 'bootstrap'
    : args.includes('--status')
      ? 'status'
      : 'manifest';

function loadDispatchPacket() {
  const paths = artifactPaths();
  const priorityOrder = safeReadJson(paths.priorityOrder);
  return priorityOrder?.dispatchPacket ?? null;
}

function refresh() {
  const policy = loadPolicy();
  const paths = artifactPaths();
  ensureLogsDir();
  const snapshot = safeReadJson(paths.sessionSnapshot);
  const dispatchPacket = loadDispatchPacket();
  if (!dispatchPacket) {
    return { policy, paths, snapshot, dispatchPacket: null, routingDecision: null, planPacket: null, manifest: null, handoffSummary: null, bootstrapPacket: null };
  }
  const sessionId = snapshot?.sessionId ?? `aegis-context-${Date.now()}`;
  const artifacts = refreshGovernanceArtifacts({
    policy,
    sessionId,
    dispatchPacket,
    previousSnapshot: snapshot,
    hardStops: snapshot?.hardStops ?? [],
  });
  writeJson(paths.routingDecision, artifacts.routingDecision);
  writeJson(paths.contextManifest, artifacts.manifest);
  writeJson(paths.handoffSummary, artifacts.handoffSummary);
  writeJson(paths.bootstrapPacket, artifacts.bootstrapPacket);
  writeJson(join(dirname(paths.contextManifest), 'session-plan-packet.json'), artifacts.planPacket);
  return { policy, paths, snapshot, dispatchPacket, ...artifacts };
}

const result = refresh();

if (mode === 'status') {
  const status = {
    dispatchPacketAvailable: Boolean(result.dispatchPacket),
    sessionId: result.snapshot?.sessionId ?? null,
    objective: result.dispatchPacket?.objective ?? null,
    newChatNeeded: result.manifest?.newChatRecommendation?.needed ?? false,
    routingTier: result.routingDecision?.modelTier ?? null,
  };
  console.log(jsonOut ? JSON.stringify(status, null, 2) : `dispatch=${status.dispatchPacketAvailable} newChat=${status.newChatNeeded} tier=${status.routingTier ?? 'n/a'}`);
  process.exit(0);
}

if (!result.dispatchPacket) {
  console.log(jsonOut ? JSON.stringify({ error: 'no dispatch packet available' }, null, 2) : 'No dispatch packet available. Run npm run autopilot:session or reprioritize first.');
  process.exit(0);
}

if (mode === 'bootstrap') {
  console.log(JSON.stringify(result.bootstrapPacket, null, 2));
  process.exit(0);
}

if (mode === 'handoff') {
  console.log(JSON.stringify(result.handoffSummary, null, 2));
  process.exit(0);
}

console.log(JSON.stringify({
  routingDecision: result.routingDecision,
  planPacket: result.planPacket,
  contextManifest: result.manifest,
}, null, 2));
