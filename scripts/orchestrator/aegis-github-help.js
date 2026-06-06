#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

function printSection(title) {
  console.log(`\n=== ${title} ===`);
}

console.log('Aegis GitHub Setup Helper');
console.log(`Workspace: ${ROOT}`);

printSection('Recommended Auth Options');
console.log('Option 1: Project PAT in .env.local (fastest/recommended)');
console.log('  GITHUB_TOKEN=ghp_...');
console.log('');
console.log('Option 2: GitHub CLI auth (gh)');
console.log('  gh auth login');
console.log('  gh auth status');

printSection('PAT Scope Guidance');
console.log('For classic PATs, ensure at minimum:');
console.log('  - repo');
console.log('This covers issue and milestone management for private/public repo work.');
console.log('');
console.log('For fine-grained PATs, ensure repository access includes:');
console.log('  - Issues: Read and write');
console.log('  - Metadata: Read');
console.log(
  'Administration is not normally required for milestones in standard repo issue workflows when repository issue access is granted, but GitHub permissions may vary by org policy.'
);

printSection('Windows gh CLI Install Options');
console.log('If winget works:');
console.log('  winget install --id GitHub.cli -e');
console.log('');
console.log('If winget is blocked on this machine:');
console.log('  1. Download installer manually from: https://cli.github.com/');
console.log('  2. Install GitHub CLI');
console.log('  3. Open a new terminal');
console.log('  4. Run: gh auth login');

printSection('Useful Aegis Commands');
console.log('Readiness check:');
console.log('  npm run aegis:github:selfcheck');
console.log('');
console.log('Prepare GitHub sync:');
console.log('  npm run aegis:github:prepare');
console.log('');
console.log('Strict prepare (fail if not writable):');
console.log('  npm run aegis:github:prepare:strict');
console.log('');
console.log('Bootstrap issues + milestones once auth is valid:');
console.log('  npm run aegis:github:bootstrap');
console.log('');
console.log('Bootstrap + immediately start daily automation:');
console.log('  npm run aegis:github:bootstrap:daily');

printSection('Suggested Next Steps For This Machine');
console.log('1. Fix .env.local with a valid GITHUB_TOKEN');
console.log('2. Run: npm run aegis:github:selfcheck');
console.log('3. Run: npm run aegis:github:bootstrap:daily');
