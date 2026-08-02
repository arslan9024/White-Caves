#!/usr/bin/env node

import { loadPolicy, runPolicyDiffGate, validatePolicy } from './policy-loader.js';

const policy = loadPolicy();
const issues = validatePolicy(policy);
const diff = runPolicyDiffGate(policy);

if (issues.length > 0) {
  console.error('Policy schema validation failed:');
  issues.forEach((issue) => console.error(`  - ${issue}`));
  process.exit(1);
}

if (!diff.passed) {
  console.error('Policy diff gate failed: critical policy changes require acknowledgement.');
  console.error(`Ack file: ${diff.ackPath}`);
  diff.criticalDiffs.forEach((item) => {
    console.error(`  - ${item.key}: ${JSON.stringify(item.previous)} -> ${JSON.stringify(item.current)}`);
  });
  process.exit(2);
}

console.log('Policy gate passed');
console.log(`Policy version: ${policy.version}`);
console.log(`Schema version: ${policy.schemaVersion}`);
console.log(`Mode: ${diff.mode}`);
console.log(`Changed keys: ${diff.changed.length}`);
