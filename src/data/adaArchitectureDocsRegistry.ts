/**
 * adaArchitectureDocsRegistry.ts
 * Master Hyper-Linked HTML Architecture & Governance Registry for Ada AI (Item Code: 3.13)
 * 
 * Technical Governance Scope:
 * - Chief Architect: @Ada (Ada Lovelace Methodology)
 * - Scope: SDLC Architecture, Zero-Token Gating, Deduplication Law, Multi-Tier RBAC, and SQA Quality Standard
 */

export interface AdaSubItem {
  id: string;
  title: string;
  description: string;
}

export interface AdaDocItem {
  id: string;
  code: string;
  title: string;
  category: 'architecture' | 'sdlc' | 'quality' | 'dedup' | 'security' | 'protocols';
  governanceTier: string;
  primaryArchitect: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  subItems: AdaSubItem[];
  htmlContent: string;
}

export const ADA_ARCHITECTURE_CATEGORIES = [
  { id: 'all', label: 'All Architecture Docs', count: 6 },
  { id: 'architecture', label: '🏛️ System Architecture', count: 1 },
  { id: 'sdlc', label: '📐 SDLC & Zero-Token Gate', count: 1 },
  { id: 'quality', label: '🧪 SQA Quality Gates', count: 1 },
  { id: 'dedup', label: '⚡ Deduplication Engine', count: 1 },
  { id: 'security', label: '🛡️ Sovereign Security & RBAC', count: 1 },
  { id: 'protocols', label: '🔌 Sovereign Protocols', count: 1 },
] as const;

export const ADA_ARCHITECTURE_DOCS: AdaDocItem[] = [
  {
    id: 'doc-ada-01',
    code: 'ADA-ARCH-01',
    title: 'Sovereign Architecture Topology & Microservice Mesh',
    category: 'architecture',
    governanceTier: 'Level 5 (Executive Council)',
    primaryArchitect: '3.13 Ada AI (Chief Architect)',
    lastUpdated: '2026-08-26',
    summary: 'Master topology mapping React 18, Vite, Express cluster, Prisma ORM, Redis caching pool, and AI Command Center.',
    tags: ['Architecture', 'Topology', 'Prisma', 'Redis', 'WebSockets'],
    subItems: [
      { id: 'sec-ada-1', title: '1. Microservice Separation', description: 'Stateless API routing and distributed Redis cache.' },
      { id: 'sec-ada-2', title: '2. High-Performance Front-End Bus', description: 'Co-located 4-way folder layout and Redux store slices.' },
      { id: 'sec-ada-3', title: '3. Real-Time Telemetry & Health', description: 'Continuous system health monitoring and event listeners.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SOVEREIGN ARCHITECTURE · ADA AI GOVERNANCE</div>
  <h1 class="doc-title">🏛️ Sovereign Architecture Topology & Microservice Mesh</h1>
  <p class="doc-lead">
    High-density technical blueprint defining data boundaries, distributed caching, and autonomous AI assistant interconnects.
  </p>

  <h2 class="doc-section-heading" id="sec-ada-1">1. High-Density Microservice Architecture</h2>
  <div class="doc-card-grid">
    <div class="doc-card">
      <div class="doc-card-label">Presentation Tier</div>
      <div class="doc-card-value">React 18 + Vite</div>
      <div class="doc-card-sub">4-Way Folder Segregation Standard</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Application Tier</div>
      <div class="doc-card-value">Node.js + Express</div>
      <div class="doc-card-sub">REST APIs & WebSocket Event Bus</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Data Tier</div>
      <div class="doc-card-value">PostgreSQL / MongoDB</div>
      <div class="doc-card-sub">Prisma Relational Models + Redis Pools</div>
    </div>
  </div>
</div>
`
  },
  {
    id: 'doc-ada-02',
    code: 'ADA-SDLC-01',
    title: 'Zero-Token Local Gate & Autonomous SDLC Policy',
    category: 'sdlc',
    governanceTier: 'Level 5 (Continuous Gate)',
    primaryArchitect: '3.13 Ada AI (Chief Architect)',
    lastUpdated: '2026-08-26',
    summary: 'Mandatory zero-token gate rules requiring full local compilation (npm run build) and vitest verification before committing.',
    tags: ['Zero Token Gate', 'SDLC Policy', 'Local Compilation', 'Git Verification'],
    subItems: [
      { id: 'sec-sdlc-1', title: '1. Pre-Commit Gate Enforcement', description: 'Zero-token local verification rules before pushing code.' },
      { id: 'sec-sdlc-2', title: '2. Branch Synchronization Protocol', description: 'Synchronous fast-forward of develop and main branches.' },
      { id: 'sec-sdlc-3', title: '3. Adversarial Code Review', description: 'Automated complexity detection and architectural drift checks.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SDLC GOVERNANCE · ZERO-TOKEN LOCAL GATE</div>
  <h1 class="doc-title">📐 Zero-Token Local Gate & Autonomous SDLC Policy</h1>
  <p class="doc-lead">
    Enforcing absolute code quality and zero token wastage through deterministic local verification pipelines.
  </p>

  <h2 class="doc-section-heading" id="sec-sdlc-1">1. Quality Standard Verification Pipeline</h2>
  <ol class="doc-list">
    <li><strong>Local Scanner Discovery:</strong> <code>node aegis/orchestrator/aegis-autopilot-scanner.js</code> (Must return 0 issues).</li>
    <li><strong>Vitest Suite Execution:</strong> <code>npx vitest run</code> (100% Green pass rate).</li>
    <li><strong>Production Compilation:</strong> <code>npm run build</code> (Zero compilation errors).</li>
    <li><strong>Synchronous Branch Push:</strong> Fast-forward merge across main and develop.</li>
  </ol>
</div>
`
  },
  {
    id: 'doc-ada-03',
    code: 'ADA-DEDUP-01',
    title: 'Deduplication Law & Algorithmic Optimization Matrix',
    category: 'dedup',
    governanceTier: 'Level 4 (Engineering Law)',
    primaryArchitect: '3.13 Ada AI & Grace CTO',
    lastUpdated: '2026-08-26',
    summary: 'Enforcement of time-complexity minimization from O(n²) to O(n) via Map/Set indexing and automated dead code purging.',
    tags: ['Deduplication', 'Time Complexity', 'Map/Set Indexing', 'Dead Code Purge'],
    subItems: [
      { id: 'sec-ded-1', title: '1. O(n²) to O(n) Time Complexity Rule', description: 'Replacement of nested array filters with hash lookups.' },
      { id: 'sec-ded-2', title: '2. Dead Code Pruning Automation', description: 'Automated purging of unused exports and leftover debug logs.' },
      { id: 'sec-ded-3', title: '3. Component Consolidation', description: 'Elimination of redundant parallel component implementations.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">ALGORITHMIC EXCELLENCE · AEGIS V3 DEDUPLICATION</div>
  <h1 class="doc-title">⚡ Deduplication Law & Algorithmic Optimization Matrix</h1>
  <p class="doc-lead">
    Continuous codebase scanning eliminating duplicated component logic, legacy style overlays, and inefficient loops.
  </p>
</div>
`
  },
  {
    id: 'doc-ada-04',
    code: 'ADA-SEC-01',
    title: 'Sovereign Security Architecture & RBAC Matrix (1-12-108)',
    category: 'security',
    governanceTier: 'Level 5 (Sovereign Security)',
    primaryArchitect: '3.13 Ada AI & Ecem Security',
    lastUpdated: '2026-08-26',
    summary: '14 User roles across 3 tiers, JWT claims, Level 5 Founder Wildcard bypass, and UAE PDPL data protection.',
    tags: ['Security', 'RBAC Matrix', 'Founder Bypass', 'UAE PDPL', 'Data Isolation'],
    subItems: [
      { id: 'sec-sec-1', title: '1. Role Hierarchy (Levels 1 to 5)', description: 'Sovereign MD, Executive Head, Senior Broker, and Client.' },
      { id: 'sec-sec-2', title: '2. Field-Level Redaction & Encryption', description: 'PII masking, passport number encryption, and salary data.' },
      { id: 'sec-sec-3', title: '3. JWT Token Refresh & Instant Revoke', description: 'Stateless authentication with instant session invalidation.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SECURITY MATRIX · RBAC 1-12-108 STANDARD</div>
  <h1 class="doc-title">🛡️ Sovereign Security Architecture & RBAC Matrix</h1>
  <p class="doc-lead">
    Rigorous security and access control model protecting ultra-high-net-worth client data and executive financials.
  </p>
</div>
`
  },
];
