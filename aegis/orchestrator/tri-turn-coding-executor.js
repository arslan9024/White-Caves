import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import dotenv from 'dotenv';

const SUPPORTED_PROVIDERS = new Set(['copilot-cli', 'claude-code', 'aider']);
const FORBIDDEN_PATTERNS = [
  /\b(drop|truncate)\s+(database|table|collection)\b/i,
  /prisma\s+migrate\s+reset/i,
  /\brm\s+-rf\b/i,
  /\b(remove-item|del)\b.*(?:\.env|production)/i,
  /git\s+push\s+--force/i,
  /github.*(?:close|patch|delete).*(?:issues|pull)/i,
];

function env(name, fallback = '') {
  return String(process.env[name] || fallback).trim();
}

function resolveExecutorConfig(overrides = {}) {
  const provider = overrides.provider || env('AEGIS_CODING_EXECUTOR_PROVIDER', 'none');
  const command = overrides.command || env('AEGIS_CODING_EXECUTOR_COMMAND');
  const statusCommand = overrides.statusCommand || env('AEGIS_CODING_EXECUTOR_STATUS_COMMAND');
  const timeoutMs = Number(
    overrides.timeoutMs || env('AEGIS_CODING_EXECUTOR_TIMEOUT_MS', '900000')
  );

  return {
    provider,
    command,
    statusCommand,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 900000,
    enabled: provider !== 'none' && SUPPORTED_PROVIDERS.has(provider) && Boolean(command),
  };
}

function loadDotEnv() {
  try {
    dotenv.config({ path: path.join(process.cwd(), '.env'), override: true, quiet: true });
  } catch {
    // ignore env load failures; fallback to process env only
  }
}

function resolveCopilotToken() {
  loadDotEnv();
  return String(process.env.COPILOT_GITHUB_TOKEN || '').trim();
}

function resolveGitHubTokenForCopilot() {
  loadDotEnv();
  return String(process.env.COPILOT_GITHUB_TOKEN || '').trim();
}

function validateExecutorStatus(config) {
  if (!config.enabled) {
    return { available: false, reason: 'LOCAL_EXECUTOR_UNAVAILABLE', provider: config.provider };
  }
  if (!config.statusCommand) {
    return {
      available: false,
      reason: 'EXECUTOR_STATUS_COMMAND_MISSING',
      provider: config.provider,
    };
  }

  const result = spawnSync(config.statusCommand, {
    cwd: process.cwd(),
    shell: true,
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: Math.min(config.timeoutMs, 30000),
    windowsHide: true,
  });

  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  if (/cannot find github copilot cli|command not found|not recognized as the name/i.test(output)) {
    return { available: false, reason: 'EXECUTOR_BINARY_MISSING', provider: config.provider };
  }

  return result.status === 0
    ? { available: true, reason: 'EXECUTOR_READY', provider: config.provider }
    : { available: false, reason: 'EXECUTOR_STATUS_FAILED', provider: config.provider };
}

function validateCommandSafety(command) {
  const value = String(command || '').trim();
  const matched = FORBIDDEN_PATTERNS.find(pattern => pattern.test(value));
  return matched
    ? { safe: false, reason: `FORBIDDEN_COMMAND:${matched}` }
    : { safe: true, reason: '' };
}

function validateExecutionScope(candidateFiles = [], changedFiles = []) {
  const allowed = new Set(candidateFiles.map(file => path.normalize(file)));
  const outOfScope = changedFiles.filter(file => !allowed.has(path.normalize(file)));
  return { allowed: outOfScope.length === 0, outOfScope };
}

function buildExecutorPrompt(packet) {
  const allowResearch = packet.allowResearch === true;
  return [
    'You are an autonomous TypeScript code generator running inside an empty sandboxed staging directory.',
    'CRITICAL RULES (these override every other instruction):',
    '- Do NOT invoke skills, agents, workflows, or maintenance loops.',
    '- Do NOT read any markdown, plan, queue, or configuration files.',
    '- Do NOT run git, npm, or package-install shell commands.',
    allowResearch
      ? '- You MAY use online search/web tools ONLY to research a correct API contract, type shape, or design decision when the existing code and the test/acceptance contract conflict. Pick the contract the tests define, and cite the source you used in your reply.'
      : '- Do NOT use network or web tools; work only from the provided objective and acceptance criteria.',
    '- Your ONLY job: write the files listed below with production-quality code, then stop.',
    '- When a conflict exists between an existing implementation and the expected test/acceptance contract, treat the test contract as the source of truth and align the implementation to it.',
    '',
    `Issue: #${packet.issueNumber}`,
    `Objective: ${packet.objective}`,
    `Files to create (exact relative paths from your current working directory):\n${(packet.candidateFiles || []).map(item => `- ${item}`).join('\n') || 'none'}`,
    `Acceptance criteria:\n${(packet.acceptanceCriteria || []).map(item => `- ${item}`).join('\n')}`,
    `Excluded scope:\n${(packet.excludedScope || []).map(item => `- ${item}`).join('\n')}`,
    'Technical requirements:',
    '- Strict TypeScript; no `any` types.',
    "- Test files must use vitest (`import { describe, expect, it } from 'vitest'`) with real behavior assertions, never placeholder assertions.",
    '- Do not add dependencies, do not close GitHub issues, do not touch files outside the list.',
    'When done, reply with: changed files, what you implemented, any design decision you resolved (and why), and a rollback note.',
  ].join('\n\n');
}

function buildExecutorInvocation(command, provider, promptText) {
  const cmd = String(command || '').trim();
  // Multi-line arguments are mangled by the copilot.cmd batch shim, so the prompt
  // is flattened to a single line; the full pretty prompt is kept on disk for audit.
  const inline = String(promptText || '')
    .replace(/\s+/g, ' ')
    .replace(/'/g, "''")
    .trim();
  if (provider === 'copilot-cli') {
    return `powershell -NoProfile -ExecutionPolicy Bypass -Command "& '${cmd}' -p '${inline}' --allow-all --no-ask-user --no-custom-instructions"`;
  }
  return `${cmd} -p "${inline.replace(/"/g, '\\"')}"`;
}

function runCodingExecutor(packet, config, options = {}) {
  const status = validateExecutorStatus(config);
  if (!status.available) {
    return {
      started: false,
      completed: false,
      status: status.reason,
      provider: status.provider,
      exitCode: null,
      stagingDir: '',
      stdout: '',
      stderr: '',
    };
  }

  const commandSafety = validateCommandSafety(config.command);
  if (!commandSafety.safe) {
    return {
      started: false,
      completed: false,
      status: commandSafety.reason,
      provider: status.provider,
      exitCode: null,
      stagingDir: '',
      stdout: '',
      stderr: '',
    };
  }

  const prompt = options.prompt || buildExecutorPrompt(packet);
  const envOverrides = (() => {
    const childEnv = { ...process.env };
    if (config.provider === 'copilot-cli') {
      const copilotToken = resolveCopilotToken();
      if (copilotToken) {
        childEnv.COPILOT_GITHUB_TOKEN = copilotToken;
      }
      // Strip legacy vars so the child sees only the fine-grained token if present.
      delete childEnv.GITHUB_TOKEN;
      delete childEnv.GH_TOKEN;
    } else {
      delete childEnv.GITHUB_TOKEN;
      delete childEnv.GH_TOKEN;
    }
    return childEnv;
  })();

  const promptFile =
    options.promptFile ||
    path.join(
      os.tmpdir(),
      `aegis-coding-executor-${packet.issueNumber || 'task'}-${Date.now()}.md`
    );
  fs.writeFileSync(promptFile, prompt, 'utf8');
  const invocation =
    options.invocation || buildExecutorInvocation(config.command, config.provider, prompt);

  const stagingDir = String(options.stagingDir || '').trim();
  if (stagingDir) fs.mkdirSync(stagingDir, { recursive: true });
  const workingDir = stagingDir || options.cwd || process.cwd();

  const result = spawnSync(invocation, {
    cwd: workingDir,
    shell: true,
    encoding: 'utf8',
    timeout: config.timeoutMs,
    windowsHide: true,
    maxBuffer: 10 * 1024 * 1024,
    env: envOverrides,
  });

  const combinedOutput = `${result.stdout || ''}\n${result.stderr || ''}`;
  if (
    /cannot find github copilot cli|command not found|not recognized as the name/i.test(
      combinedOutput
    )
  ) {
    return {
      started: true,
      completed: false,
      status: 'EXECUTOR_BINARY_MISSING',
      provider: status.provider,
      exitCode: result.status,
      stdout: String(result.stdout || '').slice(-10000),
      stderr: String(result.stderr || '').slice(-10000),
    };
  }

  return {
    started: true,
    completed: result.status === 0,
    status:
      result.status === 0
        ? 'EXECUTOR_COMPLETED'
        : result.error?.code === 'ETIMEDOUT'
          ? 'EXECUTOR_TIMEOUT'
          : 'EXECUTOR_FAILED',
    provider: status.provider,
    exitCode: result.status,
    stagingDir,
    stdout: String(result.stdout || '').slice(-10000),
    stderr: String(result.stderr || '').slice(-10000),
  };
}

export {
  FORBIDDEN_PATTERNS,
  SUPPORTED_PROVIDERS,
  buildExecutorInvocation,
  buildExecutorPrompt,
  resolveExecutorConfig,
  resolveCopilotToken,
  resolveGitHubTokenForCopilot,
  runCodingExecutor,
  validateCommandSafety,
  validateExecutionScope,
  validateExecutorStatus,
};
