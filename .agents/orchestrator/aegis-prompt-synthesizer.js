#!/usr/bin/env node
/**
 * aegis-prompt-synthesizer.js — Dynamic Autopilot Prompt Synthesizer
 *
 * AEGIS V6.0 Sovereign Multi-Agent Workengine
 *
 * Automatically generates specialized, context-aware prompt payloads for
 * subagents and Ouroboros cycles. Ingests chosen target issues/features,
 * applies TURING-LAW-000 and TURING-ROOT-007 constraints, and saves structured
 * execution prompts to .agents/orchestrator/prompts.json and .agents/plans/.
 *
 * Usage:
 *   node .agents/orchestrator/aegis-prompt-synthesizer.js --issue "DOM-01" --action "IMPLEMENT"
 *   node .agents/orchestrator/aegis-prompt-synthesizer.js --generate-cycle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const AGENTS_DIR = path.join(ROOT, '.agents');
const PLANS_DIR = path.join(AGENTS_DIR, 'plans');
const PROMPTS_FILE = path.join(AGENTS_DIR, 'orchestrator', 'prompts.json');

export function generateSovereignAutopilotPrompt(config = {}) {
  const {
    targetIssue = 'CORE-ARCHITECTURE-HARDENING',
    assignedTeam = '@Grace (CTO) & Dept 04 (Backend Systems)',
    domain = 'High-Throughput Performance & Zero-Error Stability',
    targetGain = '>= 5.0% Codebase Optimization',
    cycleId = `CYCLE-${Date.now()}`
  } = config;

  const promptText = `@Ada @Nova @Aurora @Gwynne @Grace

Execute AEGIS PROTOCOL: PERPETUAL OUROBOROS in 100% Autonomous Mode under TURING-LAW-000 and TURING-ROOT-007.

🎯 Active Milestone Target:
- Target Item: ${targetIssue}
- Assigned Workforce: ${assignedTeam}
- Operational Domain: ${domain}
- Required Quality Invariant: ${targetGain}
- Cycle Tracking ID: ${cycleId}

Strict Operating Rules for this Execution Wave:
1. Zero Human-in-the-Loop Pauses: Do not stop to ask questions or wait for approval in chat. Resolve all decisions autonomously using high-confidence architectural defaults.
2. Complete Software Engineering Journey (Phase 1 to Phase 7):
   - Run the Deep Diagnostic Radar Scan to find top critical issues (TypeScript, APIs, Vitest, UI/UX, or DLD/Ejari compliance).
   - Formulate the SRS & Architecture plan for this wave.
   - Dispatch tasks across the 12 Engineering Departments (sub-350 lines per file, atomic component structure).
   - Execute self-healing fixes and run targeted Vitest checks to verify zero broken builds.
   - Enforce strict root cleanliness: ensure all plans, docs, and strategies stay encapsulated under .agents/.
   - Update The Book of White Caves and progress telemetry with >= 5% project improvement.
   - Cleanly commit and push all verified work directly to main.
3. Continuous Loop: Once a cycle completes, immediately re-ignite the next wave without stopping.

Begin autonomous execution immediately.`;

  return {
    cycleId,
    targetIssue,
    assignedTeam,
    domain,
    promptText,
    generatedAt: new Date().toISOString()
  };
}

export function savePromptToRegistry(promptPayload) {
  try {
    let registry = {};
    if (fs.existsSync(PROMPTS_FILE)) {
      registry = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf8'));
    }

    const key = `OUROBOROS_${promptPayload.cycleId}`;
    registry[key] = {
      v: 2,
      agent: promptPayload.assignedTeam,
      action: 'OUROBOROS_AUTONOMOUS_CYCLE',
      target: promptPayload.targetIssue,
      domain: promptPayload.domain,
      prompt: promptPayload.promptText,
      generatedAt: promptPayload.generatedAt,
      tags: ['autopilot', 'perpetual-ouroboros', 'turing-law-000']
    };

    fs.writeFileSync(PROMPTS_FILE, JSON.stringify(registry, null, 2), 'utf8');
    
    // Also save current active prompt for direct subagent ingestion
    const activePromptPath = path.join(PLANS_DIR, 'ACTIVE_OUROBOROS_PROMPT.md');
    fs.writeFileSync(activePromptPath, `# Active Ouroboros Execution Prompt\n\n\`\`\`text\n${promptPayload.promptText}\n\`\`\`\n`, 'utf8');
    
    return true;
  } catch (err) {
    console.error('Failed to save prompt to registry:', err.message);
    return false;
  }
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let issue = 'DOM-01: Dubai Luxury Discovery & TruCheck™ Verification';
  let team = '@Una (UI/UX) & @Elena (Research Lead)';
  let domain = 'Luxury Immersion & Frontend Velocity';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--issue' && args[i + 1]) issue = args[++i];
    if (args[i] === '--team' && args[i + 1]) team = args[++i];
    if (args[i] === '--domain' && args[i + 1]) domain = args[++i];
  }

  const payload = generateSovereignAutopilotPrompt({ targetIssue: issue, assignedTeam: team, domain });
  savePromptToRegistry(payload);
  console.log(`\n✅ Sovereign Ouroboros Prompt Synthesized & Saved:`);
  console.log(`   Registry: .agents/orchestrator/prompts.json (Key: OUROBOROS_${payload.cycleId})`);
  console.log(`   Active Dispatch: .agents/plans/ACTIVE_OUROBOROS_PROMPT.md\n`);
  console.log(payload.promptText);
}
