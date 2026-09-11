#!/usr/bin/env node
/**
 * aegis-issue-reopener.js
 *
 * Re-opens the issues that were erroneously closed by the administrative dry run.
 * Fetches closed issues, filters them (e.g. recently closed), and patches their state back to 'open'.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = process.cwd();

const REPO_OWNER = 'arslan9024';
const REPO_NAME = 'White-Caves';

function getGitHubAuthToken() {
  try {
    const gitCreds = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    const passMatch = gitCreds.match(/password=(.+)/);
    if (passMatch && passMatch[1].trim()) return passMatch[1].trim();
  } catch (e) {}
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
}

async function reopenIssuesAndMilestones() {
  const token = getGitHubAuthToken();
  if (!token) {
    console.error('❌ Could not retrieve Git credentials.');
    return;
  }

  const headers = {
    'User-Agent': 'White-Caves-AEGIS-Engine',
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github+json'
  };

  console.log('🔍 [AEGIS Re-Opener] Fetching recently closed issues...');
  
  let allIssues = [];
  let page = 1;

  // Let's grab the last few pages of closed issues. 13 pages = ~1300 issues
  while (page <= 15) {
    try {
      const iRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=closed&per_page=100&page=${page}&sort=updated&direction=desc`, { headers });
      const issues = await iRes.json();
      if (!Array.isArray(issues) || issues.length === 0) break;
      allIssues = allIssues.concat(issues);
      page++;
      if (issues.length < 100) break;
    } catch (e) {
      console.error('⚠️ Error fetching issues page:', page, e.message);
      break;
    }
  }

  console.log(`📊 Discovered ${allIssues.length} recently closed issues/pull requests.`);
  
  // Filter out PRs and only target those closed recently (in the last 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const targetIssues = allIssues.filter(i => {
    if (i.pull_request) return false;
    const updatedDate = new Date(i.updated_at);
    return updatedDate > twentyFourHoursAgo;
  });

  console.log(`🚀 Found ${targetIssues.length} issues to re-open.`);

  let reopenedCount = 0;
  for (const iss of targetIssues) {
    console.log(`⚡ Re-opening Issue #${iss.number}: ${iss.title}...`);
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${iss.number}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ state: 'open' })
      });
      if (res.ok) {
        reopenedCount++;
        console.log(`   ✅ [${reopenedCount}/${targetIssues.length}] Successfully re-opened #${iss.number}`);
      } else {
         console.log(`   ❌ Failed to re-open #${iss.number}`);
      }
    } catch (e) {
      console.error(`❌ Error re-opening issue #${iss.number}:`, e.message);
    }
    // Rate limiting precaution
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('🔍 [AEGIS Re-Opener] Fetching closed milestones...');
  let milestones = [];
  try {
    const mRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/milestones?state=closed&per_page=100`, { headers });
    milestones = await mRes.json();
  } catch (e) {
    console.error('⚠️ Error fetching milestones:', e.message);
  }

  if (Array.isArray(milestones)) {
    for (const m of milestones) {
       const updatedDate = new Date(m.updated_at);
       if (updatedDate > twentyFourHoursAgo) {
          console.log(`⚡ Re-opening Milestone #${m.number}: ${m.title}...`);
          try {
            const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/milestones/${m.number}`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({ state: 'open' })
            });
            if (res.ok) {
              console.log(`   ✅ Successfully re-opened milestone #${m.number}`);
            }
          } catch(e) {}
       }
    }
  }

  console.log(`\n======================================================`);
  console.log(`🏆 [AEGIS Re-Opener] Re-opened ${reopenedCount} issues and associated milestones.`);
  console.log(`======================================================\n`);
}

reopenIssuesAndMilestones();
