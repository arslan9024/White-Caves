import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { classifyTaskTokenTier, compressPromptContext, TOKEN_TIERS } from './aegis-token-guard.js';

const cwd = process.cwd();
const policyPath = path.join(cwd, 'aegis', 'orchestrator', 'policy.json');
const regenerateScriptPath = path.join(cwd, 'aegis', 'orchestrator', 'aegis-regenerate.ps1');

function parseArgs(argv) {
  const args = {
    prompt: '',
    title: '',
    lane: 'A',
    planningAgent: '@Sofia',
    implementationAgent: '@Mira',
    dryRun: false,
    noRegenerate: false,
  };

  const positionals = [];

  function consumeFlagValue(startIndex) {
    const chunks = [];
    let index = startIndex;

    while (index < argv.length && !argv[index].startsWith('--')) {
      chunks.push(argv[index]);
      index += 1;
    }

    return {
      value: chunks.join(' ').trim(),
      nextIndex: index - 1,
    };
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (token === '--no-regenerate') {
      args.noRegenerate = true;
      continue;
    }

    if (token.startsWith('--prompt=')) {
      args.prompt = token.slice('--prompt='.length).trim();
      continue;
    }

    if (token === '--prompt' && argv[i + 1]) {
      const consumed = consumeFlagValue(i + 1);
      args.prompt = consumed.value;
      i = consumed.nextIndex;
      continue;
    }

    if (token.startsWith('--title=')) {
      args.title = token.slice('--title='.length).trim();
      continue;
    }

    if (token === '--title' && argv[i + 1]) {
      const consumed = consumeFlagValue(i + 1);
      args.title = consumed.value;
      i = consumed.nextIndex;
      continue;
    }

    if (token.startsWith('--lane=')) {
      args.lane = token.slice('--lane='.length).trim().toUpperCase();
      continue;
    }

    if (token === '--lane' && argv[i + 1]) {
      args.lane = argv[i + 1].trim().toUpperCase();
      i += 1;
      continue;
    }

    if (token.startsWith('--planning-agent=')) {
      args.planningAgent = token.slice('--planning-agent='.length).trim();
      continue;
    }

    if (token === '--planning-agent' && argv[i + 1]) {
      args.planningAgent = argv[i + 1].trim();
      i += 1;
      continue;
    }

    if (token.startsWith('--implementation-agent=')) {
      args.implementationAgent = token.slice('--implementation-agent='.length).trim();
      continue;
    }

    if (token === '--implementation-agent' && argv[i + 1]) {
      args.implementationAgent = argv[i + 1].trim();
      i += 1;
      continue;
    }

    if (token === '--help' || token === '-h') {
      printHelp();
      process.exit(0);
    }

    positionals.push(token);
  }

  if (!args.prompt && positionals.length > 0) {
    args.prompt = positionals.join(' ').trim();
  }

  return args;
}

function printHelp() {
  // eslint-disable-next-line no-console
  console.log(`Usage:
  npm run orchestrator:aegis:one-prompt -- "<your prompt>"

Options:
  --prompt "text"                   Prompt text (optional if passed as positional)
  --title "short title"             Optional explicit title
  --lane A|B|C|D                     Target lane (default: A)
  --planning-agent @Sofia            Planning override agent (default: @Sofia)
  --implementation-agent @Mira       Implementation override agent (default: @Mira)
  --dry-run                          Print planned changes only, do not write files
  --no-regenerate                    Write policy override but skip queue regeneration
  --help                             Show this help
`);
}

function deriveTitle(prompt, explicitTitle) {
  if (explicitTitle && explicitTitle.trim()) {
    return explicitTitle.trim();
  }

  const compact = prompt.replace(/\s+/g, ' ').trim();
  if (compact.length <= 80) return compact;
  return `${compact.slice(0, 77)}...`;
}

function normalizeLane(lane) {
  const normalized = (lane || 'A').toUpperCase();
  if (['A', 'B', 'C', 'D'].includes(normalized)) {
    return normalized;
  }
  return 'A';
}

function buildOverrides({ prompt, title, lane, planningAgent, implementationAgent }) {
  const stamp = new Date().toISOString();
  const triage = classifyTaskTokenTier({ title, prompt });
  const compressedPrompt = compressPromptContext(prompt, 1800);

  // Assign agent based on token tier:
  let effectivePlanAgent = planningAgent;
  let effectiveImpAgent = implementationAgent;
  let planTeam = 'free-planning';
  let impTeam = 'premium-implementation';

  if (triage.tier.name === TOKEN_TIERS.ZERO_TOKEN_DETERMINISTIC.name) {
    effectivePlanAgent = '@Sofia';
    effectiveImpAgent = '@Katherine';
    impTeam = 'deterministic-validation';
  } else if (triage.tier.name === TOKEN_TIERS.FREE_TIER_SPECIALIST.name) {
    effectivePlanAgent = '@Sofia';
    effectiveImpAgent = '@Victoria';
    impTeam = 'free-specialist';
  }

  const planningTitle = `[OnePrompt][Plan][${triage.tier.name}] ${title}`;
  const implementationTitle = `[OnePrompt][Implement][${triage.tier.name}] ${title}`;

  return [
    {
      agent: effectivePlanAgent,
      lane,
      phase: 'planning',
      team: planTeam,
      priority: triage.tier.name === TOKEN_TIERS.CRITICAL_AI_CREDIT.name ? 'critical' : 'normal',
      priorityScore: triage.tier.name === TOKEN_TIERS.CRITICAL_AI_CREDIT.name ? 1000 : 750,
      tokenTier: triage.tier.name,
      tokenBudget: triage.tier.maxTokenBudget,
      aiCreditsAllowed: triage.tier.name === TOKEN_TIERS.CRITICAL_AI_CREDIT.name,
      title: planningTitle,
      prompt: `${effectivePlanAgent} -- [TOKEN-CONSERVATION PROTOCOL ACTIVE] PRIORITY RESEARCH+PLAN: ${title}. Prompt: "${compressedPrompt}". Produce an ultra-compact plan: acceptance criteria, risk level, and validation path. OMIT all conversational fluff to preserve token budget.`,
      createdBy: 'aegis-one-prompt',
      createdAt: stamp,
    },
    {
      agent: effectiveImpAgent,
      lane,
      phase: 'implementation',
      team: impTeam,
      priority: triage.tier.name === TOKEN_TIERS.CRITICAL_AI_CREDIT.name ? 'critical' : 'normal',
      priorityScore: triage.tier.name === TOKEN_TIERS.CRITICAL_AI_CREDIT.name ? 999 : 740,
      tokenTier: triage.tier.name,
      tokenBudget: triage.tier.maxTokenBudget,
      aiCreditsAllowed: triage.tier.name === TOKEN_TIERS.CRITICAL_AI_CREDIT.name,
      title: implementationTitle,
      prompt: `${effectiveImpAgent} -- [TOKEN-CONSERVATION PROTOCOL ACTIVE: Tier ${triage.tier.name}] PRIORITY IMPLEMENT: ${title}. Prompt: "${compressedPrompt}". ${
        triage.tier.name === TOKEN_TIERS.ZERO_TOKEN_DETERMINISTIC.name
          ? 'Resolve deterministically using local templates. ZERO AI CREDITS ALLOWED.'
          : 'Execute targeted slice. MUST update docs/SRS/SDD/code/tests.'
      } Output ONLY concise code diffs and strict JSON manifest: {"status":"complete","modified":["..."]}. OMIT all conversational greetings, full-file echoes, or reasoning monologues to protect user token quota.`,
      createdBy: 'aegis-one-prompt',
      createdAt: stamp,
    },
  ];
}

function loadPolicy() {
  if (!fs.existsSync(policyPath)) {
    throw new Error(`Policy file not found: ${policyPath}`);
  }

  const raw = fs.readFileSync(policyPath, 'utf8');
  if (!raw.trim()) {
    throw new Error(`Policy file is empty: ${policyPath}`);
  }

  return JSON.parse(raw);
}

function savePolicy(policy) {
  const serialized = `${JSON.stringify(policy, null, 2)}\n`;
  fs.writeFileSync(policyPath, serialized, 'utf8');
}

function applyOnePromptOverride(policy, overrides) {
  if (!policy.aegis) policy.aegis = {};
  if (!policy.aegis.priorityOverride) {
    policy.aegis.priorityOverride = { enabled: true, tasks: [] };
  }

  policy.aegis.priorityOverride.enabled = true;

  const existingTasks = Array.isArray(policy.aegis.priorityOverride.tasks)
    ? policy.aegis.priorityOverride.tasks
    : [];

  policy.aegis.priorityOverride.tasks = [...overrides, ...existingTasks];

  return policy;
}

function resolvePowerShellPath() {
  const winRoot = process.env.SystemRoot || 'C:\\Windows';
  return path.join(winRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
}

function regenerateQueue(title) {
  const psPath = resolvePowerShellPath();

  if (!fs.existsSync(psPath)) {
    throw new Error(`PowerShell executable not found at ${psPath}`);
  }

  const result = spawnSync(
    psPath,
    ['-ExecutionPolicy', 'Bypass', '-File', regenerateScriptPath, '-Force', '-Reason', `One-prompt intake: ${title}`],
    {
      cwd,
      encoding: 'utf8',
    }
  );

  if (result.stdout) {
    // eslint-disable-next-line no-console
    console.log(result.stdout.trim());
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    throw new Error(`Queue regeneration failed${stderr ? `: ${stderr}` : ''}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt) {
    printHelp();
    throw new Error('Missing prompt text. Pass it after -- or with --prompt.');
  }

  const lane = normalizeLane(args.lane);
  const title = deriveTitle(args.prompt, args.title);

  const overrides = buildOverrides({
    prompt: args.prompt,
    title,
    lane,
    planningAgent: args.planningAgent,
    implementationAgent: args.implementationAgent,
  });

  if (args.dryRun) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({ action: 'dry-run', lane, title, overrides }, null, 2));
    return;
  }

  const policy = loadPolicy();
  const updatedPolicy = applyOnePromptOverride(policy, overrides);
  savePolicy(updatedPolicy);

  // eslint-disable-next-line no-console
  console.log(`[Aegis One-Prompt] Added ${overrides.length} overrides to policy.`);
  // eslint-disable-next-line no-console
  console.log(`[Aegis One-Prompt] Planning: ${overrides[0]?.agent} | Implementation: ${overrides[1]?.agent} | Tier: ${overrides[1]?.tokenTier} | Budget: ${overrides[1]?.tokenBudget} tokens | AI Credits: ${overrides[1]?.aiCreditsAllowed}`);

  if (args.noRegenerate) {
    // eslint-disable-next-line no-console
    console.log('[Aegis One-Prompt] Queue regeneration skipped (--no-regenerate).');
    return;
  }

  regenerateQueue(title);

  // eslint-disable-next-line no-console
  console.log('[Aegis One-Prompt] Queue regenerated. Autopilot can pick this override immediately.');
}

try {
  main();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(`[Aegis One-Prompt] ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
