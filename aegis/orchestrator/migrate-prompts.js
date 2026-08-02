import fs from 'fs';
import path from 'path';

const file = './scripts/orchestrator/prompts.json';

if (!fs.existsSync(file)) {
  console.error('prompts.json not found');
  process.exit(1);
}

const prompts = JSON.parse(fs.readFileSync(file, 'utf8'));

function parsePromptMeta(promptText) {
  const meta = { agent: '', action: '', target: '', tags: [] };

  const agentMatch = promptText.match(/(@[A-Za-z0-9\-]+)/);
  if (agentMatch) {
    meta.agent = agentMatch[1];
  }

  const actionMatch = promptText.match(/--\s*([A-Za-z0-9_+\-]+):/);
  if (actionMatch) {
    meta.action = actionMatch[1];
  } else {
    if (promptText.includes('RESEARCH+PLAN')) meta.action = 'RESEARCH+PLAN';
    else if (promptText.includes('EXPAND')) meta.action = 'EXPAND';
    else if (promptText.includes('REVIEW')) meta.action = 'REVIEW';
  }

  const targetMatch = promptText.match(/([\w\-./]+\.md)/);
  if (targetMatch) {
    meta.target = targetMatch[1];
  }

  const tags = [];
  if (/RERA/i.test(promptText)) tags.push('RERA');
  if (/DLD/i.test(promptText)) tags.push('DLD');
  if (/VAT/i.test(promptText)) tags.push('VAT');
  const waveMatch = promptText.match(/wave[-\s_]?\d+/i);
  if (waveMatch) {
    tags.push(waveMatch[0].toLowerCase().replace(' ', '-'));
  }
  meta.tags = tags;

  return meta;
}

let migratedCount = 0;
const newPrompts = {};

for (const [key, value] of Object.entries(prompts)) {
  if (typeof value === 'string') {
    const meta = parsePromptMeta(value);
    newPrompts[key] = {
      v: 1,
      agent: meta.agent,
      action: meta.action,
      target: meta.target,
      prompt: value,
      tags: meta.tags,
      lastUsed: '2026-07-15',
      successCount: 0,
      history: [],
    };
    migratedCount++;
  } else {
    // If it's already an object, preserve it
    newPrompts[key] = value;
  }
}

fs.writeFileSync(file, JSON.stringify(newPrompts, null, 2), 'utf8');
console.log(`Successfully migrated ${migratedCount} prompts to structured objects.`);
