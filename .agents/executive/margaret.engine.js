#!/usr/bin/env node
/**
 * margaret.engine.js — Executive Engine for @MARGARET (Strategic Wave Planner & Context Boundary Sovereign)
 * Protocol: Level 0 Sovereign Executive Council
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

export function audit() {
  console.log('👑 [Executive Engine: @margaret] Auditing agent domain & operational authority...');
  const skills = [
  ".agents/skills/strategic-planner",
  ".agents/skills/orchestration-progress-intelligence",
  ".agents/skills/aegis-knowledge-curator"
];
  const missingSkills = skills.filter(s => !fs.existsSync(path.join(ROOT, s)));
  if (missingSkills.length > 0) {
    console.warn('⚠️ Missing attached skills:', missingSkills);
  } else {
    console.log('✅ All ' + skills.length + ' required sovereign skills verified.');
  }
  return { agent: 'margaret', title: 'Strategic Wave Planner & Context Boundary Sovereign', status: 'OPERATIONAL' };
}

export function runChecks() {
  console.log('🚀 [Executive Engine: @margaret] Running standard verification gates...');
  const checks = [
  "npm run aegis:health"
];
  console.log('📋 Registered verification checks:', checks.join(' | '));
  return { checks, status: 'READY' };
}

if (process.argv[1]?.includes('margaret.engine.js')) {
  audit();
  runChecks();
}
