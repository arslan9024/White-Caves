// runLogPlansSimple.cjs
// -------------------------------------------------
// Load and display all plan files in .agents/plans.
// Uses only built‑in Node APIs (no ts-node).
// -------------------------------------------------
const fs = require('fs');
const path = require('path');

const plansDir = path.resolve(__dirname, '..', 'plans');

fs.readdir(plansDir, (err, files) => {
  if (err) {
    console.error('[runLogPlansSimple] Error reading plans folder:', err);
    process.exit(1);
  }
  const mdFiles = files.filter(f => f.endsWith('.md'));
  if (mdFiles.length === 0) {
    console.log('[runLogPlansSimple] No plan files found in .agents/plans');
    return;
  }
  console.log('[runLogPlansSimple] Loaded plan files:');
  mdFiles.forEach(f => console.log(`  - ${f}`));
});

