// turingPlan.ts – plan processing utilities for the Turing Orchestrator

import path from 'path';
import { writeFileSync } from 'fs';
import { readPlans } from './readPlans';

/** Process all markdown plan files */
export async function processPlans(): Promise<void> {
  try {
    const plans = await readPlans();
    const planNames = Object.keys(plans);
    if (planNames.length === 0) {
      console.log('[TuringOrchestrator] No plans to process');
      return;
    }
    for (const name of planNames) {
      const content = plans[name];
      const lines = content.split('\n');
      const pending: string[] = [];
      const completed: string[] = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- [ ]')) pending.push(trimmed.replace('- [ ]', '').trim());
        else if (trimmed.startsWith('- [x]')) completed.push(trimmed.replace('- [x]', '').trim());
      }
      console.log(`[TuringOrchestrator] Plan ${name}: ${pending.length} pending, ${completed.length} completed`);
      if (pending.length) {
        console.log('  Pending tasks:');
        pending.forEach(t => console.log(`    • ${t}`));
      }
      if (completed.length) {
        console.log('  Completed tasks:');
        completed.forEach(t => console.log(`    ✓ ${t}`));
      }
      if (pending.length === 0) {
        const flagPath = path.resolve(__dirname, '..', '..', 'plans', 'NEED_NEW_PLAN');
        try {
          writeFileSync(flagPath, 'true');
        } catch (e) {
          console.error('Failed to write flag file', e);
        }
      }
      // Placeholder: invoke sub‑agents based on pending items.
    }
  } catch (e) {
    console.error('[TuringOrchestrator] Error processing plans:', e);
  }
}

/** Log available plan files */
export async function logPlans(): Promise<void> {
  try {
    const plans = await readPlans();
    const planNames = Object.keys(plans);
    if (planNames.length === 0) {
      console.log('[TuringOrchestrator] No plan files found in .agents/plans');
      return;
    }
    console.log('[TuringOrchestrator] Loaded plan files:');
    for (const name of planNames) {
      console.log(`  - ${name}`);
    }
  } catch (e) {
    console.error('[TuringOrchestrator] Failed to load plans:', e);
  }
}

