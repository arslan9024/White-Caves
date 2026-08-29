#!/usr/bin/env node
/**
 * aegis-github-milestone-bootstrapper.js — AEGIS 240-Issue Deep Enterprise GitHub Bootstrap Engine
 *
 * Automatically generates 12 Department Milestones and 240 concrete, supervisor-assigned
 * issues (20 per Department) based on the 1-12-108 Sovereign Command Protocol.
 *
 * Saves to docs/plans/AEGIS_240_ENTERPRISE_GITHUB_BACKLOG.md and syncs with GitHub API.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CORPORATE_DEPARTMENTS_12, SUPERVISORS_108 } from '../../src/data/assistants108Registry.data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = process.cwd();

const REPO_OWNER = 'arslan9024';
const REPO_NAME = 'White-Caves';
const BACKLOG_MD_PATH = path.join(ROOT, 'docs', 'plans', 'AEGIS_240_ENTERPRISE_GITHUB_BACKLOG.md');
const BACKLOG_JSON_PATH = path.join(ROOT, 'aegis', 'logs', 'aegis-240-backlog.json');

export function generate240EnterpriseBacklog() {
  console.log('🌟 [AEGIS Bootstrapper] Synthesizing 1-12-108 Deep Enterprise Backlog (240 Issues across 12 Milestones)...');

  const milestones = [];
  const allIssues = [];
  let issueCounter = 1;

  CORPORATE_DEPARTMENTS_12.forEach((dept, index) => {
    const waveNumber = 24 + index;
    const milestoneTitle = `Milestone ${String(index + 1).padStart(2, '0')} (Wave ${waveNumber}): ${dept.name}`;
    const milestoneDesc = `Sovereign 1-12-108 Implementation Sprint for ${dept.name}. Supervised by ${dept.managerAi.name} (${dept.managerAi.title}). Enforces 15-minute response SLA.`;

    const milestoneObj = {
      number: index + 1,
      wave: waveNumber,
      departmentId: dept.id,
      departmentName: dept.name,
      title: milestoneTitle,
      description: milestoneDesc,
      manager: dept.managerAi.name,
      issuesCount: 20
    };
    milestones.push(milestoneObj);

    // Get 9 supervisors for this department
    const deptSupervisors = SUPERVISORS_108.filter(s => s.departmentId === dept.id);

    // Part A: 10 Core Supervisor & Manager Issues (1 to 10)
    // Issue 1: Department Manager Strategy & Orchestration
    allIssues.push({
      issueIndex: issueCounter++,
      milestoneTitle,
      deptName: dept.name,
      supervisorName: dept.managerAi.name,
      supervisorRole: dept.managerAi.title,
      title: `[${dept.code}-MGR] ${dept.name} — Command Orchestration & SLA Dashboard`,
      type: 'Manager Core',
      priority: 'CRITICAL',
      sla: '15 Minutes',
      description: `Establish centralized command orchestration for ${dept.name} under ${dept.managerAi.name}. Enforce real-time telemetry, 15m SLA monitoring, and cross-department handoffs.`,
      tasks: [
        `Configure ${dept.managerAi.name} state machine in AI Command Center`,
        `Bind live KPI metrics to Founder Executive Dashboard`,
        `Implement automated SLA escalation to Executive AI Zoe`
      ]
    });

    // Issues 2 to 10: The 9 Dedicated Supervisors
    deptSupervisors.forEach((sup, supIdx) => {
      allIssues.push({
        issueIndex: issueCounter++,
        milestoneTitle,
        deptName: dept.name,
        supervisorName: sup.name,
        supervisorRole: sup.title,
        title: `[${sup.code}] ${sup.name} — ${sup.title} Task Pipeline`,
        type: 'Supervisor Implementation',
        priority: supIdx === 0 ? 'CRITICAL' : 'HIGH',
        sla: sup.slaResponseTime,
        description: `Implement dedicated operational pipeline for ${sup.name} (${sup.title}) specializing in ${sup.specialty}.`,
        tasks: sup.assignedTasks.map(t => `Execute: ${t}`)
      });
    });

    // Part B: 10 Advanced Enterprise Workflows & Regulatory Shielding (11 to 20)
    const ADVANCED_TOPICS = [
      { name: 'Statutory Compliance & DLD Integration', prio: 'CRITICAL', task: 'Verify legal alignment with DLD, RERA, and UAE federal decree-laws.' },
      { name: 'In-Memory MapIndexHash Fast-Path Querying', prio: 'HIGH', task: 'Optimize in-memory data structures to guarantee < 10ms query execution.' },
      { name: 'Audit Logging & Cryptographic Traceability', prio: 'HIGH', task: 'Record tamper-evident audit logs with timestamped signature seals.' },
      { name: 'Collaborative Kanban Queue Binding', prio: 'MEDIUM', task: 'Wire tasks into the 4-stage department Kanban board.' },
      { name: 'Multi-Stage Executive Signoff Binding', prio: 'HIGH', task: 'Connect approval thresholds to Founder Sovereign Seal signoff.' },
      { name: 'PWA Offline Sync & Local Cache Strategy', prio: 'MEDIUM', task: 'Configure Workbox background sync for offline field operations.' },
      { name: 'Multi-Currency Real-Time Price Normalization', prio: 'MEDIUM', task: 'Support statutory AED, SAR, CNY, USD, EUR, and GBP FX calculations.' },
      { name: 'Automated Vitest & Playwright E2E Regression Gate', prio: 'CRITICAL', task: 'Enforce 100% green automated test gates before production release.' },
      { name: 'Mobile Bottom Drawer & Touch UX Hardening', prio: 'HIGH', task: 'Guarantee 44px+ touch targets and fluid gestures on 375px+ screens.' },
      { name: 'Executive Report Generation (PDF/Excel Stream)', prio: 'HIGH', task: 'Stream formatted compliance and financial reports with 15-digit TRNs.' }
    ];

    ADVANCED_TOPICS.forEach((adv, advIdx) => {
      allIssues.push({
        issueIndex: issueCounter++,
        milestoneTitle,
        deptName: dept.name,
        supervisorName: `${dept.managerAi.name} & Engineering Squad`,
        supervisorRole: 'Enterprise Architecture Specialist',
        title: `[${dept.code}-ADV-${String(advIdx + 1).padStart(2, '0')}] ${dept.name} — ${adv.name}`,
        type: 'Advanced Enterprise Pipeline',
        priority: adv.prio,
        sla: '15 Minutes',
        description: `Implement enterprise-grade capability for ${dept.name}: ${adv.name}. ${adv.task}`,
        tasks: [
          `Architect and document ${adv.name} specifications`,
          `Implement pure view (.tsx) and logic (.logic.ts) component separation`,
          `Validate with automated Vitest test suite`
        ]
      });
    });
  });

  console.log(`✅ Generated ${milestones.length} Milestones and ${allIssues.length} Enterprise Issues.`);

  // Write Markdown Report
  let md = `# White Caves Real Estate LLC — 240 Enterprise GitHub Backlog (1-12-108 Protocol)

> **Document ID:** WC-GH-BACKLOG-240  
> **Version:** 2.26.0 (Enterprise Sovereign Release)  
> **Total Milestones:** ${milestones.length} (Waves 24–35)  
> **Total Actionable Issues:** ${allIssues.length} (20 per Department Milestone)  
> **Authority:** Arslan Malik Bashir Ahmad (Managing Director & Founder)  
> **Multi-Agent Grid:** 121 Autonomous AI Mesh (@Zoe, 12 Managers, 108 Supervisors)  

---

## 🏛️ 12 Strategic Department Milestones

| Milestone # | Department | Manager AI | Target Wave | Total Issues |
|---|---|---|---|---|
`;

  milestones.forEach(m => {
    md += `| **${m.title}** | ${m.departmentName} | **${m.manager}** | Wave ${m.wave} | **${m.issuesCount} Issues** |\n`;
  });

  md += `\n---\n\n## 📋 Detailed 240-Issue Backlog Matrix\n\n`;

  let currentMilestone = '';
  allIssues.forEach(issue => {
    if (issue.milestoneTitle !== currentMilestone) {
      currentMilestone = issue.milestoneTitle;
      md += `\n### 🌟 ${currentMilestone}\n\n`;
      md += `| Issue # | Title | Lead / Supervisor | Priority | SLA | Scope & Assigned Tasks |\n`;
      md += `|---|---|---|---|---|---|\n`;
    }

    const tasksList = issue.tasks.map(t => `• ${t}`).join('<br>');
    md += `| **#${issue.issueIndex}** | **${issue.title}** | ${issue.supervisorName}<br>_${issue.supervisorRole}_ | \`${issue.priority}\` | ${issue.sla} | ${issue.description}<br><br><strong>Assigned Tasks:</strong><br>${tasksList} |\n`;
  });

  fs.mkdirSync(path.dirname(BACKLOG_MD_PATH), { recursive: true });
  fs.writeFileSync(BACKLOG_MD_PATH, md, 'utf8');

  fs.mkdirSync(path.dirname(BACKLOG_JSON_PATH), { recursive: true });
  fs.writeFileSync(BACKLOG_JSON_PATH, JSON.stringify({ milestones, issues: allIssues }, null, 2), 'utf8');

  console.log(`📑 Backlog Markdown written to: ${BACKLOG_MD_PATH}`);
  console.log(`📦 Backlog JSON written to: ${BACKLOG_JSON_PATH}`);

  return { milestones, issues: allIssues };
}

import { execSync } from 'child_process';

function getGitHubAuthToken() {
  // Query Git Credential Manager (System Store) first
  try {
    const gitCreds = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });
    const passMatch = gitCreds.match(/password=(.+)/);
    if (passMatch && passMatch[1].trim()) {
      return passMatch[1].trim();
    }
  } catch (e) {
    // ignore
  }

  let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  if (token) return token;

  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/(?:GITHUB_TOKEN|GH_TOKEN)\s*=\s*(["']?)([^"'\r\n]+)\1/);
    if (match && match[2].trim()) return match[2].trim();
  }

  return '';
}

export async function sync240IssuesToGitHub() {
  const { milestones, issues } = generate240EnterpriseBacklog();

  const token = getGitHubAuthToken();
  if (!token) {
    console.error('❌ Could not retrieve Git credentials automatically.');
    return;
  }

  const headers = {
    'User-Agent': 'White-Caves-AEGIS-Engine',
    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github+json'
  };

  console.log('🚀 [AEGIS] Fetching existing GitHub milestones...');
  let existingMilestones = [];
  try {
    const mRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/milestones?state=all&per_page=100`, { headers });
    existingMilestones = await mRes.json();
    if (!Array.isArray(existingMilestones)) existingMilestones = [];
  } catch (e) {
    existingMilestones = [];
  }

  const milestoneMap = new Map();
  existingMilestones.forEach(m => milestoneMap.set(m.title, m.number));

  console.log('🏛️ [AEGIS] Creating / Verifying 12 Department Milestones on GitHub...');
  for (const m of milestones) {
    if (!milestoneMap.has(m.title)) {
      try {
        const createRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/milestones`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: m.title,
            description: m.description,
            state: 'open'
          })
        });
        const created = await createRes.json();
        if (created.number) {
          milestoneMap.set(m.title, created.number);
          console.log(`✅ Created GitHub Milestone: ${m.title} (#${created.number})`);
        }
      } catch (err) {
        console.error(`⚠️ Error creating milestone ${m.title}:`, err.message);
      }
    } else {
      console.log(`ℹ️ Milestone already exists: ${m.title} (#${milestoneMap.get(m.title)})`);
    }
  }

  console.log(`📋 [AEGIS] Syncing 240 Enterprise Issues to GitHub live...`);
  let createdCount = 0;

  for (const issue of issues) {
    const milestoneNumber = milestoneMap.get(issue.milestoneTitle);

    const bodyMarkdown = `## 🔱 1-12-108 Sovereign Command Protocol\n\n` +
      `- **Department:** ${issue.deptName}\n` +
      `- **Assigned Lead / Supervisor:** ${issue.supervisorName} (${issue.supervisorRole})\n` +
      `- **Priority:** \`${issue.priority}\`\n` +
      `- **SLA Target:** ${issue.sla}\n` +
      `- **Scope:** ${issue.description}\n\n` +
      `### 🎯 Assigned Operational Tasks\n` +
      issue.tasks.map(t => `- [ ] ${t}`).join('\n') + `\n\n` +
      `---\n*Auto-generated by AEGIS V5 Omni-Orchestrator for Founder & MD Arslan Malik Bashir Ahmad*`;

    try {
      const issueRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: issue.title,
          body: bodyMarkdown,
          milestone: milestoneNumber,
          labels: ['1-12-108', issue.type.toLowerCase().replace(/\s+/g, '-'), issue.priority.toLowerCase()]
        })
      });

      const issueData = await issueRes.json();
      if (issueData.number) {
        createdCount++;
        console.log(`✅ [${createdCount}/240] Created Issue #${issueData.number}: ${issue.title}`);
      } else {
        console.warn(`⚠️ Issue creation note:`, issueData.message || issueData);
      }
    } catch (err) {
      console.error(`❌ Failed to create issue ${issue.title}:`, err.message);
    }

    // Small throttling pause to respect GitHub rate limiter smoothly
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\n🎉 [AEGIS] Published ${createdCount} issues live to https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  sync240IssuesToGitHub();
}
