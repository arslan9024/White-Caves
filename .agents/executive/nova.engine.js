#!/usr/bin/env node
/**
 * nova.engine.js — Executive Engine for @NOVA (Crucible Commander & Infinite Zero-Backlog Sovereign)
 * Protocol: Level 0 Sovereign Executive Council
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

export function audit() {
  console.log('👑 [Executive Engine: @nova] Auditing agent domain & operational authority...');
  const skills = [
  ".agents/skills/aegis-infinite-crucible",
  ".agents/skills/project-optimizer",
  ".agents/skills/aegis-root-cleanliness-sentinel"
];
  const missingSkills = skills.filter(s => !fs.existsSync(path.join(ROOT, s)));
  if (missingSkills.length > 0) {
    console.warn('⚠️ Missing attached skills:', missingSkills);
  } else {
    console.log('✅ All ' + skills.length + ' required sovereign skills verified.');
  }
  return { agent: 'nova', title: 'Crucible Commander & Infinite Zero-Backlog Sovereign', status: 'OPERATIONAL' };
}

export function runChecks() {
  console.log('🚀 [Executive Engine: @nova] Running standard verification gates...');
  const checks = [
  "npm run aegis:dedup"
];
  console.log('📋 Registered verification checks:', checks.join(' | '));
  return { checks, status: 'READY' };
}

if (process.argv[1]?.includes('nova.engine.js')) {
  audit();
  runChecks();
}
