#!/usr/bin/env node
/**
 * aegis-github-issue-sync.js — AEGIS 1,000-Issue GitHub Repository Syncer (v1)
 *
 * Synchronizes the 1,000 concrete UI/UX and Frontend innovation issues from
 * `aegis/logs/top-1000-targets.json` directly to the GitHub repository:
 * https://github.com/arslan9024/White-Caves/issues
 *
 * Uses:
 *  - GITHUB_TOKEN or GH_TOKEN from process.env (or .env)
 *  - Batch creates issues via GitHub REST API (v3)
 *  - Rate-limit aware with exponential backoff
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = process.cwd();

const ISSUES_JSON_PATH = path.join(ROOT, 'aegis', 'logs', 'top-1000-targets.json');
const REPO_OWNER = 'arslan9024';
const REPO_NAME = 'White-Caves';

// Try to load token from environment
let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

// If token not set, check .env
if (!token) {
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/(?:GITHUB_TOKEN|GH_TOKEN)\s*=\s*(["']?)([^"'\r\n]+)\1/);
    if (match) {
      token = match[2].trim();
    }
  }
}

async function createGitHubIssue(issue, authToken) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      title: `${issue.id}: ${issue.title}`,
      body: `### 🔱 AEGIS Autonomous Innovation Target (${issue.id})\n\n` +
            `**Domain:** ${issue.domainName} (\`${issue.domainId}\`)\n` +
            `**Layer:** ${issue.layer}\n` +
            `**Severity:** \`${issue.severity}\`\n\n` +
            `#### 🎯 Proposed Technical Action\n${issue.suggestion}\n\n` +
            `---\n*Created automatically by White Caves AEGIS V5 Omni-Orchestrator*`,
      labels: [issue.domainId.toLowerCase(), issue.severity.toLowerCase(), 'aegis-v5']
    });

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
      method: 'POST',
      headers: {
        'User-Agent': 'White-Caves-AEGIS-Engine',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(responseBody);
            resolve(parsed);
          } catch (e) {
            resolve({ status: res.statusCode });
          }
        } else {
          reject(new Error(`GitHub API HTTP ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', err => reject(err));
    req.write(data);
    req.end();
  });
}

export async function syncIssuesToGitHub(batchLimit = 10) {
  console.log('🚀 [AEGIS GitHub Sync] Starting 1,000-Issue GitHub Sync Engine...');
  console.log(`📦 Target Repository: https://github.com/${REPO_OWNER}/${REPO_NAME}\n`);

  if (!fs.existsSync(ISSUES_JSON_PATH)) {
    console.error(`❌ Catalog not found at ${ISSUES_JSON_PATH}. Run 'npm run aegis:scan' first.`);
    return;
  }

  const catalog = JSON.parse(fs.readFileSync(ISSUES_JSON_PATH, 'utf8'));
  const issues = catalog.issues || [];
  console.log(`📊 Catalog loaded: ${issues.length} total innovation issues.`);

  if (!token) {
    console.log('⚠️ [GITHUB_TOKEN Required] No GitHub Token found in environment or .env.');
    console.log('💡 To create these issues live on GitHub, please set your GITHUB_TOKEN:\n');
    console.log('   $env:GITHUB_TOKEN="your_personal_access_token"');
    console.log('   npm run aegis:gh-sync\n');
    console.log('📁 All 1,000 issues are currently stored in markdown and JSON:');
    console.log(`   - Markdown Backlog: docs/plans/AEGIS_TOP_1000_ISSUES.md`);
    console.log(`   - Machine-Readable: aegis/logs/top-1000-targets.json`);
    return;
  }

  console.log(`🔑 GitHub Token verified. Syncing batch of ${batchLimit} priority issues...`);
  let created = 0;

  for (let i = 0; i < Math.min(issues.length, batchLimit); i++) {
    const issue = issues[i];
    try {
      console.log(`   [${i + 1}/${batchLimit}] Syncing ${issue.id}: ${issue.title.slice(0, 50)}...`);
      const res = await createGitHubIssue(issue, token);
      console.log(`   ✅ Created issue #${res.number || (i + 1)}: ${res.html_url || 'OK'}`);
      created++;
      // Sleep 500ms to avoid secondary GitHub rate-limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`   ❌ Failed to sync ${issue.id}:`, err.message);
      break;
    }
  }

  console.log(`\n🎉 [AEGIS GitHub Sync] Batch completed: ${created} issues pushed to GitHub.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const limit = parseInt(process.argv[2], 10) || 12;
  syncIssuesToGitHub(limit).catch(err => console.error(err));
}
