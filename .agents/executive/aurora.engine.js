#!/usr/bin/env node
/**
 * aurora.engine.js — Executive Engine for @AURORA (Principal Systems CTO & Canonical Architecture Sentinel)
 * Protocol: Level 0 Sovereign Executive Council
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

export function audit() {
  console.log('👑 [Executive Engine: @aurora] Auditing agent domain & operational authority...');
  const skills = [
  ".agents/skills/aegis-dept-04-backend-systems",
  ".agents/skills/aegis-dept-05-database-schemas",
  ".agents/skills/security-audit",
  ".agents/skills/strategic-planner"
];
  const missingSkills = skills.filter(s => !fs.existsSync(path.join(ROOT, s)));
  if (missingSkills.length > 0) {
    console.warn('⚠️ Missing attached skills:', missingSkills);
  } else {
    console.log('✅ All ' + skills.length + ' required sovereign skills verified.');
  }
  return { agent: 'aurora', title: 'Principal Systems CTO & Canonical Architecture Sentinel', status: 'OPERATIONAL' };
}

export function runChecks() {
  console.log('🚀 [Executive Engine: @aurora] Running standard verification gates...');
  const checks = [
  "npm run aegis:docs",
  "npx tsc --noEmit --skipLibCheck"
];
  console.log('📋 Registered verification checks:', checks.join(' | '));
  return { checks, status: 'READY' };
}

if (process.argv[1]?.includes('aurora.engine.js')) {
  audit();
  runChecks();
}
