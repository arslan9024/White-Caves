/**
 * margaretPlansDocsRegistry.ts
 * Master Hyper-Linked HTML Strategic Planning & Backlog Registry for Margaret AI (Item Code: 3.12)
 * 
 * Strategic Scope:
 * - Strategic Planner: @Margaret (Apollo Software Engineering Methodology)
 * - Scope: Master Roadmaps, Pending Backlogs, Wave Execution Roadmaps, and Governance Matrices
 * - Machine-Readable Disk Source: plans/ folder
 */

export interface PlanSubItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'ready';
}

export interface PlanDocItem {
  id: string;
  code: string;
  title: string;
  category: 'master' | 'backlog' | 'frontend' | 'finance' | 'governance' | 'autopilot';
  sprintMilestone: string;
  primaryPlanner: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  subItems: PlanSubItem[];
  htmlContent: string;
}

export const MARGARET_PLANS_CATEGORIES = [
  { id: 'all', label: 'All Project Plans', count: 8 },
  { id: 'master', label: '🗺️ Master Roadmap', count: 2 },
  { id: 'backlog', label: '📋 Sprint Backlog & Pending', count: 2 },
  { id: 'frontend', label: '🎨 Frontend 100 Design Goals', count: 1 },
  { id: 'finance', label: '💰 In-House Finance Roadmap', count: 1 },
  { id: 'governance', label: '🛡️ Governance & Traceability', count: 1 },
  { id: 'autopilot', label: '🤖 Autopilot Execution Queue', count: 1 },
] as const;

export const MARGARET_PLANS_DOCS: PlanDocItem[] = [
  {
    id: 'doc-plan-01',
    code: 'PLAN-MST-01',
    title: 'Master Recovery & Execution Plan (Waves 01–65)',
    category: 'master',
    sprintMilestone: 'Wave 65 Construction Milestone',
    primaryPlanner: '3.12 Margaret AI (Strategic Lead)',
    lastUpdated: '2026-08-26',
    summary: 'Sovereign Master Execution Plan outlining the 120-agent free planning and 50-agent implementation mesh.',
    tags: ['Master Plan', 'Wave 01-65', 'AEGIS 170', 'Executive Milestones'],
    subItems: [
      { id: 'sec-mst-1', title: '1. Executive Vision & Objectives', description: 'Ultra-prime brokerage automation across all 12 corporate floors.', status: 'completed' },
      { id: 'sec-mst-2', title: '2. Multi-Wave Execution Roadmap', description: 'Dependency-safe milestone sequencing from Foundation to Sovereign Release.', status: 'completed' },
      { id: 'sec-mst-3', title: '3. Dual-Threshold Context Gate (60% / 90%)', description: 'Context readiness verification before premium token dispatch.', status: 'completed' },
      { id: 'sec-mst-4', title: '4. Autonomous Autopilot Governance', description: 'Zero-token local verification and deterministic progress reporting.', status: 'completed' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">MASTER STRATEGIC PLAN · MARGARET AI APOLLO ROADMAP</div>
  <h1 class="doc-title">🗺️ Master Recovery & Execution Plan (Waves 01–65)</h1>
  <p class="doc-lead">
    Canonical roadmap governing the end-to-end transformation of White Caves Real Estate LLC into a high-density, AI-orchestrated luxury brokerage platform.
  </p>

  <h2 class="doc-section-heading" id="sec-mst-1">1. Strategic Objectives & Core Pillars</h2>
  <div class="doc-card-grid">
    <div class="doc-card">
      <div class="doc-card-label">Core Pillar 1</div>
      <div class="doc-card-value">100% Zero-Error SLA</div>
      <div class="doc-card-sub">Automated Vitest assertion matrices and SQA gating</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Core Pillar 2</div>
      <div class="doc-card-value">AEGIS Autopilot 170</div>
      <div class="doc-card-sub">120 Free Planning Specialists + 50 Implementation Units</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Core Pillar 3</div>
      <div class="doc-card-value">Sovereign Compliance</div>
      <div class="doc-card-sub">DET 1388443, RERA ORN 44483, and UAE PDPL alignment</div>
    </div>
  </div>

  <h2 class="doc-section-heading" id="sec-mst-2">2. Wave Roadmap Progression</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Wave Phase</th>
          <th>Domain Focus</th>
          <th>Lead Planner</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Waves 01–15</strong></td>
          <td>Core Design System & Property Catalog</td>
          <td>@Una & @Lea</td>
          <td><span class="status-pill green">✓ 100% COMPLETED</span></td>
        </tr>
        <tr>
          <td><strong>Waves 16–30</strong></td>
          <td>Theodora Finance CRM, 67 Reports & VAT</td>
          <td>@Theodora & @Invoice</td>
          <td><span class="status-pill green">✓ 100% COMPLETED</span></td>
        </tr>
        <tr>
          <td><strong>Waves 31–45</strong></td>
          <td>Henry Document Studio & OCR Pipeline</td>
          <td>@Henry & @Puppeteer</td>
          <td><span class="status-pill green">✓ 100% COMPLETED</span></td>
        </tr>
        <tr>
          <td><strong>Waves 46–65</strong></td>
          <td>Zoe, Aurora, Margaret & Ada Sovereign Hubs</td>
          <td>@Margaret & @Ada</td>
          <td><span class="status-pill blue">⚡ ACTIVE EXECUTION</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`
  },
  {
    id: 'doc-plan-02',
    code: 'PLAN-MST-02',
    title: 'Feature Coverage & Traceability Matrix (Live Policy)',
    category: 'governance',
    sprintMilestone: 'Continuous Audit Gate',
    primaryPlanner: '3.12 Margaret AI & Ada Architect',
    lastUpdated: '2026-08-26',
    summary: 'End-to-end traceability matrix linking Features, Business Rules, Workflows, Wave Backlogs, Code Modules, and Test Surfaces.',
    tags: ['Feature Matrix', 'Traceability', 'Governance', 'Test Surfaces'],
    subItems: [
      { id: 'sec-cov-1', title: '1. Core Transaction Modules', description: 'Properties, Leasing, Theodora Finance, and RERA Compliance.', status: 'completed' },
      { id: 'sec-cov-2', title: '2. High-Tech Concierge & Media', description: 'VIP Private Vault, PWA Offline, and Henry Document Hub.', status: 'completed' },
      { id: 'sec-cov-3', title: '3. Autonomous Portals & Routing', description: 'Zoe Executive, Aurora CTO, and Lead Pipeline Velocity.', status: 'completed' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">GOVERNANCE AUDIT · AEGIS POLICY TRACEABILITY</div>
  <h1 class="doc-title">🛡️ Feature Coverage & Traceability Matrix</h1>
  <p class="doc-lead">
    Deterministic mapping linking high-level business specifications to active code repositories and test surfaces.
  </p>

  <div class="doc-table-wrap" id="sec-cov-1">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Business Rule Doc</th>
          <th>Workflow Doc</th>
          <th>Code Module</th>
          <th>Test Surface</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Properties & Off-Plan</strong></td>
          <td><code>company-profile.md</code></td>
          <td><code>deal-pipeline.md</code></td>
          <td><code>src/components/properties/</code></td>
          <td><code>100% Vitest Green</code></td>
        </tr>
        <tr>
          <td><strong>Theodora Finance</strong></td>
          <td><code>financial-reporting.md</code></td>
          <td><code>financial-reporting.md</code></td>
          <td><code>TheodoraFinanceCRM_NEW/</code></td>
          <td><code>useReporting.test.ts</code></td>
        </tr>
        <tr>
          <td><strong>Henry Document Hub</strong></td>
          <td><code>document-generation.md</code></td>
          <td><code>document-workflow.md</code></td>
          <td><code>HenryDocumentHub/</code></td>
          <td><code>HenryDocumentHub.test.tsx</code></td>
        </tr>
        <tr>
          <td><strong>Zoe & Aurora Hubs</strong></td>
          <td><code>ai_assistants/README.md</code></td>
          <td><code>ai-orchestration.md</code></td>
          <td><code>ZoeBusinessHub/ & AuroraSoftwareHub/</code></td>
          <td><code>100% Logic & Style Green</code></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`
  },
  {
    id: 'doc-plan-03',
    code: 'PLAN-TSK-01',
    title: 'Pending Tasks & Autonomous Execution Queue',
    category: 'backlog',
    sprintMilestone: 'Daily Autopilot Sprints',
    primaryPlanner: '3.12 Margaret AI (Sprint Planner)',
    lastUpdated: '2026-08-26',
    summary: 'Active queue of engineering targets, pending wave milestones, and zero-defect maintenance sprints.',
    tags: ['Pending Tasks', 'Autopilot Queue', 'Sprint Milestones', 'Zero Issues'],
    subItems: [
      { id: 'sec-tsk-1', title: '1. Scanner Discovery & Issue Resolution', description: '0 Issues remaining across all 3,868 source files.', status: 'completed' },
      { id: 'sec-tsk-2', title: '2. Executive Hub Integration', description: 'Margaret Plans Hub and Ada Architecture Hub rollout.', status: 'in_progress' },
      { id: 'sec-tsk-3', title: '3. Production Build & Gate Signoff', description: 'npm run sqa:audit and zero-token local compilation check.', status: 'ready' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SPRINT DASHBOARD · PENDING TASKS & AUTOPILOT QUEUE</div>
  <h1 class="doc-title">📋 Pending Tasks & Autonomous Execution Queue</h1>
  <p class="doc-lead">
    Continuous backlog managed by @Margaret and executed by the AEGIS Autopilot Engine.
  </p>

  <h2 class="doc-section-heading" id="sec-tsk-1">1. Active Sprint Targets</h2>
  <ul class="doc-list">
    <li><strong>Margaret Plans Hub:</strong> Convert markdown plans to hyper-linked HTML registry with sub-items and category filters. <span class="status-pill blue">IN PROGRESS</span></li>
    <li><strong>Ada Architecture Hub:</strong> Interactive CTO SDLC and architectural governance surface. <span class="status-pill blue">IN PROGRESS</span></li>
    <li><strong>Lead Scoring Bot (Archer):</strong> AI pipeline prioritization integration. <span class="status-pill gray">QUEUED</span></li>
  </ul>
</div>
`
  },
  {
    id: 'doc-plan-04',
    code: 'PLAN-DES-01',
    title: 'Frontend 100 Luxury Design Goals & Touch Optimization',
    category: 'frontend',
    sprintMilestone: 'Wave 50 UI/UX Milestone',
    primaryPlanner: '3.12 Margaret AI & Una CSS Lead',
    lastUpdated: '2026-08-26',
    summary: 'Visual excellence master plan detailing 100 design goals, brand token adherence, glassmorphic styling, and haptic mobile interactions.',
    tags: ['Frontend 100', 'Design System', 'Tokens CSS', 'Mobile Touch', 'Glassmorphism'],
    subItems: [
      { id: 'sec-des-1', title: '1. Brand Color Harmony', description: 'White Caves Red #EF4444, Brilliant White #FFFFFF, Deep Slate #1E293B.', status: 'completed' },
      { id: 'sec-des-2', title: '2. Micro-Interactions & Haptics', description: 'Subtle spring physics, card hover depths, and tactile feedback.', status: 'completed' },
      { id: 'sec-des-3', title: '3. Ultra-Dense Tablet & Mobile Responsive', description: 'Adaptive layouts from 360px mobile viewports to 4K displays.', status: 'completed' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">DESIGN EXCELLENCE · FRONTEND 100 LUXURY SPECIFICATION</div>
  <h1 class="doc-title">🎨 Frontend 100 Luxury Design Goals</h1>
  <p class="doc-lead">
    Design rules governing aesthetic perfection, responsive layouts, and luxury Dubai brand positioning.
  </p>

  <h2 class="doc-section-heading" id="sec-des-1">1. Design System Tokens</h2>
  <p class="doc-body">
    Hardcoded raw color literals are permanently banned. Every component must reference tokenized CSS variables:
  </p>
  <div class="code-block">
var(--bg-primary, #0f172a)
var(--accent-red, #ef4444)
var(--text-primary, #ffffff)
var(--text-secondary, #94a3b8)
  </div>
</div>
`
  },
  {
    id: 'doc-plan-05',
    code: 'PLAN-FIN-01',
    title: 'In-House Finance & Accounting System Architecture Roadmap',
    category: 'finance',
    sprintMilestone: 'Theodora CFO Milestone',
    primaryPlanner: '3.12 Margaret AI & Theodora CFO',
    lastUpdated: '2026-08-26',
    summary: 'Financial engineering plan detailing double-entry general ledger, 67 enterprise reports, FTA VAT 5%, and UAE Corporate Tax 9%.',
    tags: ['Finance Roadmap', 'Theodora CFO', 'Double-Entry Ledger', 'FTA VAT', 'Corporate Tax'],
    subItems: [
      { id: 'sec-fin-1', title: '1. Chart of Accounts (COA)', description: '5-Level structured account taxonomy from Assets to Equity.', status: 'completed' },
      { id: 'sec-fin-2', title: '2. 67 Financial Reports Suite', description: 'Real-time calculation of Balance Sheets, P&L, and Cashflow.', status: 'completed' },
      { id: 'sec-fin-3', title: '3. Statutory Tax Filing Engines', description: 'FTA Form 201 VAT return and Corporate Tax 9% provisions.', status: 'completed' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">FINANCIAL ROADMAP · THEODORA AI ENTERPRISE SUITE</div>
  <h1 class="doc-title">💰 In-House Finance & Accounting System Roadmap</h1>
  <p class="doc-lead">
    Enterprise financial software roadmap replacing third-party accounting software with an in-house double-entry ledger.
  </p>

  <h2 class="doc-section-heading" id="sec-fin-1">1. Double-Entry Accounting Core</h2>
  <p class="doc-body">
    Every financial transaction executes balanced debits and credits across the 5 primary account classes with automated audit logging.
  </p>
</div>
`
  },
];
