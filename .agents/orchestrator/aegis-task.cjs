#!/usr/bin/env node
/**
 * AEGIS Sovereign Task Preflight & Execution Trigger
 * Usage: npm run aegis:task -- "your feature description"
 * or:    node .agents/orchestrator/aegis-task.cjs "your feature description"
 */

const { execSync } = require('child_process');

const userTask = process.argv.slice(2).join(' ').trim();

console.log('='.repeat(70));
console.log('🛡️  AEGIS V5.0 SOVEREIGN TASK ACTIVATOR');
console.log('='.repeat(70));

if (userTask) {
  console.log(`\n📌 Task: "${userTask}"\n`);
} else {
  console.log('\n💡 Tip: You can pass your task prompt directly:');
  console.log('   npm run aegis:task -- "Update deal card VIP badge in Luxury UI"\n');
}

console.log('▶ [1/2] Running Pre-flight Health Check...');
try {
  execSync('node .agents/orchestrator/aegis-engine.js health', { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Health check failed. Please resolve above issues.');
  process.exit(1);
}

console.log('\n▶ [2/2] Running Deduplication Sweep...');
try {
  execSync('node .agents/orchestrator/aegis-engine.js dedup', { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Dedup check failed.');
  process.exit(1);
}

console.log('\n' + '='.repeat(70));
console.log('✅ PRE-FLIGHT VERIFIED — Ready for Sovereign Execution');
console.log('='.repeat(70));
console.log(`
In chat, simply invoke:
  /aegis-task ${userTask || '<your feature description>'}
`);
