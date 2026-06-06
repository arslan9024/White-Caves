#!/usr/bin/env node

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const argv = process.argv.slice(2);
const CHECK_ONLY = argv.includes('--check');
const STRICT = argv.includes('--strict');
const FIX_MODE = argv.includes('--fix');

const envFiles = [path.join(ROOT, '.env.local'), path.join(ROOT, '.env')];
for (const envFile of envFiles) {
  dotenv.config({ path: envFile, override: false, quiet: true });
}

function isPlaceholderToken(token) {
  const value = String(token || '').trim();
  if (!value) return false;
  return /newtokenhere|your-token|changeme|example|placeholder/i.test(value);
}

function readTokenFromFile(filePath) {
  if (!fs.existsSync(filePath)) return '';
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^\s*GITHUB_TOKEN\s*=\s*(.+)\s*$/m);
    if (!match) return '';
    return String(match[1] || '')
      .trim()
      .replace(/^['"]|['"]$/g, '');
  } catch {
    return '';
  }
}

function resolveTokenInfo() {
  const envToken = String(process.env.GITHUB_TOKEN || '').trim();
  if (envToken && !isPlaceholderToken(envToken)) {
    return { token: envToken, source: '.env.local / environment', status: 'ready' };
  }
  if (envToken && isPlaceholderToken(envToken)) {
    return { token: envToken, source: '.env.local / environment', status: 'placeholder' };
  }

  const fallbackToken =
    readTokenFromFile(path.join(ROOT, '.env.local')) || readTokenFromFile(path.join(ROOT, '.env'));
  if (fallbackToken && !isPlaceholderToken(fallbackToken)) {
    return { token: fallbackToken, source: 'project env file', status: 'ready' };
  }
  if (fallbackToken && isPlaceholderToken(fallbackToken)) {
    return { token: fallbackToken, source: 'project env file', status: 'placeholder' };
  }

  return { token: '', source: 'missing', status: 'missing' };
}

async function isGitHubTokenValid(token) {
  const value = String(token || '').trim();
  if (!value) {
    return false;
  }

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${value}`,
        'User-Agent': 'white-caves-aegis-auth-setup',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const tokenInfo = resolveTokenInfo();
  const localEnvPath = path.join(ROOT, '.env.local');
  const sharedEnvPath = path.join(ROOT, '.env');

  console.log('=== Aegis GitHub Auth Setup ===');
  console.log(`Repo root : ${ROOT}`);
  console.log(`.env.local: ${fs.existsSync(localEnvPath) ? 'present' : 'missing'}`);
  console.log(`.env      : ${fs.existsSync(sharedEnvPath) ? 'present' : 'missing'}`);

  if (tokenInfo.status === 'placeholder') {
    console.log('GitHub token present: placeholder/example value detected');
    console.log('Replace the placeholder token in .env.local with a real GitHub PAT.');
    console.log('Do not commit .env.local. It is already gitignored.');
    if (FIX_MODE) {
      console.log('Fix steps:');
      console.log('  1. Open .env.local');
      console.log('  2. Replace GITHUB_TOKEN with your real PAT');
      console.log('  3. Run: npm run aegis:auth:check');
    }
    return STRICT ? 1 : 0;
  }

  if (tokenInfo.status === 'ready') {
    const envTokenValid = await isGitHubTokenValid(tokenInfo.token);
    if (envTokenValid) {
      console.log('GitHub write auth: ready');
      console.log(`Token source: ${tokenInfo.source} (validated)`);
      console.log('Aegis is ready to use GitHub issue roadmap and bootstrap commands.');
      if (FIX_MODE) {
        console.log('No fix needed.');
      }
      return 0;
    }

    console.log('GitHub token configured: yes');
    console.log(
      'GitHub write auth: not ready (configured token is invalid or expired for GitHub API writes)'
    );
  }

  if (tokenInfo.status === 'missing') {
    console.log('GitHub token configured: no');
    console.log('GitHub write auth: not ready');
  }

  console.log(
    'Optional secondary path: install/login gh CLI and let aegis:roadmap:sync:safe consume gh auth token.'
  );
  console.log('Add a real GitHub PAT to .env.local as:');
  console.log('  GITHUB_TOKEN=ghp_...');
  console.log(`File to edit: ${localEnvPath}`);
  console.log('Then run: npm run aegis:auth:check');

  if (FIX_MODE) {
    console.log('Fix steps:');
    console.log('  1. Open .env.local');
    console.log('  2. Add or replace GITHUB_TOKEN');
    console.log('  3. Run: npm run aegis:auth:check');
  }

  if (STRICT) {
    return 1;
  }
  return 0;
}

main()
  .then(code => {
    process.exitCode = code;
  })
  .catch(error => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`aegis-auth-setup failed: ${message}`);
    process.exitCode = 1;
  });
