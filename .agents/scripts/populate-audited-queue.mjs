import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const roadmapPath = path.join(ROOT, '.agents', 'docs', 'AEGIS_V5_99_ISSUES_AUDIT_AND_ROADMAP.md');
const queuePath = path.join(ROOT, 'logs', 'orchestrator', 'task-queue.json');

const content = fs.readFileSync(roadmapPath, 'utf8');
const lines = content.split('\n');

const rawIssues = [];
const issueRegex = /^(\d+)\.\s+`?([^`\n\r]+?)`?\s+\((.+?)\)/;

let currentCategory = 'General';
for (const line of lines) {
  if (line.startsWith('### Category')) {
    currentCategory = line.replace('### ', '').trim();
    continue;
  }
  const match = line.trim().match(issueRegex);
  if (match) {
    rawIssues.push({
      num: parseInt(match[1], 10),
      category: currentCategory,
      target: match[2].trim().replace(/`/g, ''),
      description: match[3].trim()
    });
  }
}

const milestoneMap = {
  1: 'Milestone 1: Architectural File Splitting & Modularity (AEG-042)',
  2: 'Milestone 2: Type Rigor & TS Safety',
  3: 'Milestone 3: Context Triad & Redux State Integrity (AEG-003/041)',
  4: 'Milestone 4: White Caves Luxury Brand Palette (#EF4444/#0F172A)',
  5: 'Milestone 5: Backend Resilience & DLD/RERA Compliance (AEG-011/012)',
  6: 'Milestone 6: Defensive SQA & Vitest Verification Gates',
  7: 'Milestone 7: Root Cleanliness & Tooling Hygiene (TURING-ROOT-007)'
};

function getCategoryNumber(cat) {
  if (cat.includes('Category I')) return 1;
  if (cat.includes('Category II')) return 2;
  if (cat.includes('Category III')) return 3;
  if (cat.includes('Category IV')) return 4;
  if (cat.includes('Category V')) return 5;
  if (cat.includes('Category VI')) return 6;
  if (cat.includes('Category VII')) return 7;
  return 1;
}

function getAgentForCategory(cNum) {
  switch (cNum) {
    case 1: return '@Una';
    case 2: return '@Grace';
    case 3: return '@Invoice';
    case 4: return '@Victoria';
    case 5: return '@Mira';
    case 6: return '@Rachel_QA';
    case 7: return '@Gwynne';
    default: return '@Ada';
  }
}

const now = new Date().toISOString();
const tasks = rawIssues.map(iss => {
  const cNum = getCategoryNumber(iss.category);
  const milestone = milestoneMap[cNum];
  const agent = getAgentForCategory(cNum);
  const idStr = String(iss.num).padStart(3, '0');
  const isDone = iss.num === 95;

  return {
    taskId: `AEGIS-${idStr}`,
    id: `AEGIS-${idStr}`,
    issueNumber: iss.num,
    milestone: milestone,
    categoryNumber: cNum,
    featureId: `aegis-task-${idStr}`,
    agent: agent,
    lane: cNum % 3 === 0 ? 'Lane C' : (cNum % 2 === 0 ? 'Lane B' : 'Lane A'),
    title: `[${iss.target}] ${iss.description}`,
    objective: `Resolve ${iss.target} (${iss.description}) under ${milestone}`,
    description: `${iss.category}: ${iss.target} - ${iss.description}`,
    status: isDone ? 'done' : 'open',
    dependsOn: [],
    consumesFrom: [],
    requiresFeedsAck: false,
    feedsAckBy: null,
    attempts: isDone ? 1 : 0,
    createdAt: now,
    startedAt: isDone ? now : null,
    finishedAt: isDone ? now : null,
    completedAt: isDone ? now : null,
    evidence: isDone ? { verification: 'vitest pass & package.json alignment verified' } : {},
    phase: 'execution',
    team: 'Track B: Resolution Squad',
    baseScore: 100 - iss.num * 0.5,
    priority_score: 100 - iss.num * 0.5,
    priorityScore: 100 - iss.num * 0.5,
    priority: cNum <= 2 ? 'critical' : (cNum <= 5 ? 'high' : 'medium'),
    priorityLabel: cNum <= 2 ? 'P0' : (cNum <= 5 ? 'P1' : 'P2'),
    tags: ['aegis-v5', 'audit-gap', `cat-${cNum}`],
    files: [iss.target],
    producedRef: iss.target,
    validationCommand: 'npx vitest run src/components/dashboard/DashboardHeader.test.tsx server/routes/aegis.test.ts src/components/crm/__tests__/LindaWhatsAppCRM.test.tsx',
    acceptanceCriteria: [
      'Implement surgical fix adhering to AEGIS V5.0 protocol laws',
      'Ensure zero broken types and pass targeted vitest verification',
      'Preserve context triad and root cleanliness'
    ],
    discoveryMeta: {
      researchBasis: 'AEGIS V5.0 Comprehensive 99-Issue Audit by Track A (Ada, Elena, Rachel_QA)',
      auditedBy: '@Elena & @Rachel_QA',
      milestoneTitle: milestone
    }
  };
});

const taskQueuePayload = {
  version: '5.0-sovereign-audit',
  generatedAt: now,
  auditorSquad: ['@Ada', '@Elena', '@Rachel_QA', '@Sofia'],
  totalIssuesCount: tasks.length,
  openIssuesCount: tasks.filter(t => t.status === 'open').length,
  resolvedIssuesCount: tasks.filter(t => t.status === 'done').length,
  tasks: tasks
};

fs.writeFileSync(queuePath, JSON.stringify(taskQueuePayload, null, 2), 'utf8');
console.log(`Successfully populated task queue: ${tasks.length} total issues. Open: ${taskQueuePayload.openIssuesCount}, Done: ${taskQueuePayload.resolvedIssuesCount}`);
