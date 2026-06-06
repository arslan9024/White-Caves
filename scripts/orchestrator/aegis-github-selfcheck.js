#!/usr/bin/env node

import { spawnSync } from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const argv = process.argv.slice(2);
const JSON_OUTPUT = argv.includes('--json');

const envFiles = [path.join(ROOT, '.env.local'), path.join(ROOT, '.env')];
for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile, override: false, quiet: true });
  }
}

function isPlaceholderToken(token) {
  const value = String(token || '').trim();
  if (!value) {
    return false;
  }
  return /newtokenhere|your-token|changeme|example|placeholder/i.test(value);
}

function readTokenFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return '';
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^\s*GITHUB_TOKEN\s*=\s*(.+)\s*$/m);
    if (!match) {
      return '';
    }
    return String(match[1] || '')
      .trim()
      .replace(/^['"]|['"]$/g, '');
  } catch {
    return '';
  }
}

function resolveEnvTokenInfo() {
  const envToken = String(process.env.GITHUB_TOKEN || '').trim();
  if (envToken && !isPlaceholderToken(envToken)) {
    return {
      token: envToken,
      configured: true,
      source: '.env.local / environment',
      placeholder: false,
    };
  }
  if (envToken && isPlaceholderToken(envToken)) {
    return { token: '', configured: true, source: '.env.local / environment', placeholder: true };
  }

  const fallbackToken =
    readTokenFromFile(path.join(ROOT, '.env.local')) || readTokenFromFile(path.join(ROOT, '.env'));
  if (fallbackToken && !isPlaceholderToken(fallbackToken)) {
    return {
      token: fallbackToken,
      configured: true,
      source: 'project env file',
      placeholder: false,
    };
  }
  if (fallbackToken && isPlaceholderToken(fallbackToken)) {
    return { token: '', configured: true, source: 'project env file', placeholder: true };
  }

  return { token: '', configured: false, source: 'missing', placeholder: false };
}

function resolveGhAvailability() {
  const whereResult = spawnSync('where', ['gh'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: false,
  });

  if (whereResult.status === 0) {
    return true;
  }

  const cmdWhereResult = spawnSync('cmd', ['/c', 'where gh'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: false,
  });

  return cmdWhereResult.status === 0;
}

function resolveGhToken() {
  if (!resolveGhAvailability()) {
    return '';
  }

  try {
    const result = spawnSync('gh', ['auth', 'token'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
      shell: false,
    });

    if (result.status !== 0) {
      return '';
    }

    return String(result.stdout || '').trim();
  } catch {
    return '';
  }
}

async function isGitHubTokenValid(token, userAgent) {
  const value = String(token || '').trim();
  if (!value) {
    return false;
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${value}`,
        'User-Agent': userAgent,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const envTokenInfo = resolveEnvTokenInfo();
  const ghAvailable = resolveGhAvailability();
  const ghToken = resolveGhToken();

  const envTokenValid = await isGitHubTokenValid(
    envTokenInfo.token,
    'white-caves-aegis-github-selfcheck-env'
  );
  const ghTokenValid = await isGitHubTokenValid(ghToken, 'white-caves-aegis-github-selfcheck-gh');

  const effectiveAuth = envTokenValid ? 'env-token' : ghTokenValid ? 'gh-auth' : 'none';
  const canWriteGitHub = effectiveAuth !== 'none';

  const result = {
    repository: 'arslan9024/White-Caves',
    envTokenConfigured: envTokenInfo.configured,
    envTokenPlaceholder: envTokenInfo.placeholder,
    envTokenSource: envTokenInfo.source,
    envTokenValid,
    ghAvailable,
    ghTokenValid,
    effectiveAuth,
    canWriteGitHub,
    recommendedCommand: canWriteGitHub
      ? 'npm run aegis:roadmap:sync:safe:all'
      : 'npm run aegis:auth:fix',
  };

  if (JSON_OUTPUT) {
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = canWriteGitHub ? 0 : 1;
    return;
  }

  console.log('=== Aegis GitHub Self-Check ===');
  console.log(`Repository           : ${result.repository}`);
  console.log(`Env token configured : ${result.envTokenConfigured ? 'yes' : 'no'}`);
  console.log(`Env token valid      : ${result.envTokenValid ? 'yes' : 'no'}`);
  console.log(`gh available         : ${result.ghAvailable ? 'yes' : 'no'}`);
  console.log(`gh token valid       : ${result.ghTokenValid ? 'yes' : 'no'}`);
  console.log(`Effective auth       : ${result.effectiveAuth}`);
  console.log(`GitHub writes ready  : ${result.canWriteGitHub ? 'yes' : 'no'}`);

  if (result.canWriteGitHub) {
    console.log('Status               : READY for issue + milestone sync');
    console.log(`Next                 : ${result.recommendedCommand}`);
    process.exitCode = 0;
    return;
  }

  if (result.envTokenPlaceholder) {
    console.log('Status               : BLOCKED by placeholder token');
  } else if (result.envTokenConfigured) {
    console.log('Status               : BLOCKED by invalid or expired PAT');
  } else if (!result.ghAvailable) {
    console.log('Status               : BLOCKED by missing PAT and missing gh CLI');
  } else {
    console.log('Status               : BLOCKED by missing gh auth or invalid token');
  }

  console.log('Fix options          :');
  console.log('  1. Put a valid GITHUB_TOKEN in .env.local');
  console.log('  2. Or install/login gh CLI so safe sync can use gh auth');
  console.log(`Next                 : ${result.recommendedCommand}`);
  process.exitCode = 1;
}

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`aegis-github-selfcheck failed: ${message}`);
  process.exitCode = 1;
});
