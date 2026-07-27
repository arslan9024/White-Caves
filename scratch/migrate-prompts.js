import fs from 'fs';
import path from 'path';

const promptsPath = path.join(process.cwd(), 'scripts/orchestrator/prompts.json');
const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

let migratedCount = 0;

for (const [key, value] of Object.entries(prompts)) {
  if (typeof value === 'string') {
    const promptStr = value;
    const agentMatch = promptStr.match(/(@\w+)/);
    const agent = agentMatch ? agentMatch[1] : "@Sofia";
    
    let action = "RESEARCH+PLAN";
    if (promptStr.includes("DRAFT")) {
      action = "DRAFT";
    } else if (promptStr.includes("EXPAND")) {
      action = "EXPAND";
    } else if (promptStr.includes("REVIEW")) {
      action = "REVIEW";
    }
    
    const targetMatch = promptStr.match(/:\s*([^.]+)\./);
    const target = targetMatch ? targetMatch[1].trim().toLowerCase().replace(/\s+/g, '-') + '.md' : "compliance.md";

    prompts[key] = {
      v: 1,
      agent: agent,
      action: action,
      target: target,
      prompt: promptStr,
      tags: ["backlog", "planning"],
      lastUsed: "2026-07-27",
      successCount: 1,
      history: []
    };
    migratedCount++;
  }
}

fs.writeFileSync(promptsPath, JSON.stringify(prompts, null, 2), 'utf8');
console.log(`Successfully migrated ${migratedCount} string prompts to objects.`);
