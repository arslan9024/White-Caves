const fs = require('fs');

const promptsFile = 'scripts/orchestrator/prompts.json';
const queueFile = 'logs/orchestrator/task-queue.json';

const prompts = JSON.parse(fs.readFileSync(promptsFile, 'utf8'));
const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));

// Wave 24 Tasks
const wave24Tasks = [
  { id: 'W24-001', agent: '@Una', action: 'REFACTOR', target: 'src/components/layout/AppShell.jsx', desc: 'Overhaul global navigation for seamless to-and-fro glassmorphism' },
  { id: 'W24-002', agent: '@Daniela', action: 'REFACTOR', target: 'src/components/auth/AuthModal.tsx', desc: 'Perfect the Login/Signup flow with smooth transitions and Zod validation' },
  { id: 'W24-003', agent: '@Invoice', action: 'EXPAND', target: 'src/pages/admin/CompanyDashboard.tsx', desc: 'Aggregate Finance and VAT metrics for the executive dashboard' },
  { id: 'W24-004', agent: '@Cassie', action: 'EXPAND', target: 'src/pages/admin/CompanyDashboard.tsx', desc: 'Aggregate CRM Lead metrics and analytics for the executive dashboard' },
  { id: 'W24-005', agent: '@Rania', action: 'EXPAND', target: 'src/pages/admin/CompanyDashboard.tsx', desc: 'Aggregate Maintenance and Operations metrics for the executive dashboard' },
  { id: 'W24-006', agent: '@Victoria', action: 'EXPAND', target: 'src/pages/admin/CompanyDashboard.tsx', desc: 'Aggregate Leasing and Ejari metrics for the executive dashboard' },
];

wave24Tasks.forEach(t => {
  // Add to prompts
  prompts[t.id] = {
    v: 1,
    agent: t.agent,
    action: t.action,
    target: t.target,
    prompt: `${t.agent} -- ${t.action}: ${t.target} -> ${t.desc}`,
    tags: ['wave-24'],
    lastUsed: new Date().toISOString().split('T')[0],
    successCount: 0,
    history: []
  };

  // Add to queue
  queue.tasks.push({
    taskId: t.id,
    title: `Wave 24: ${t.desc}`,
    objective: `Wave 24: ${t.desc}`,
    description: `Aegis orchestrated Wave 24 task for 20% platform upgrade.`,
    agent: t.agent,
    lane: 'A',
    priority: 'HIGH',
    status: 'queued',
    createdAt: new Date().toISOString()
  });
});

fs.writeFileSync(promptsFile, JSON.stringify(prompts, null, 2), 'utf8');
fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2), 'utf8');

console.log(`Injected ${wave24Tasks.length} Wave 24 tasks into Aegis Queue and Prompts.`);
