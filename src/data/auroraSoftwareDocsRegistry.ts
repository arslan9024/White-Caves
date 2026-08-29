/**
 * auroraSoftwareDocsRegistry.ts
 * Master Hyper-Linked HTML Software Engineering & Architecture Documentation Registry for Aurora AI (Item Code: 3.11)
 * 
 * System Specifications:
 * - Architecture: Feature-First Co-Located 4-Way Folder Segregation (View, Logic, Style, Data)
 * - Methodology: Rational Unified Process (RUP) & Inception-Elaboration-Construction-Transition
 * - Security & Access: RBAC 1-12-108 Tier Matrix & Founder Level 5 Sovereign Bypass
 * - Core Assistants: 3.19 Henry AI (Document Studio), 3.14 Theodora AI (67 Reports), 3.10 Zoe AI (Executive Docs)
 */

export interface DocSubItem {
  id: string;
  title: string;
  description: string;
}

export interface SoftwareDocItem {
  id: string;
  code: string;
  title: string;
  category: 'srs' | 'sdd' | 'architecture' | 'api' | 'rbac' | 'dedup' | 'testing' | 'devops' | 'pwa' | 'waves';
  phase: string;
  primaryAssistant: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  subItems: DocSubItem[];
  htmlContent: string;
}

export const AURORA_SOFTWARE_CATEGORIES = [
  { id: 'all', label: 'All Software Docs', count: 10 },
  { id: 'srs', label: '📋 SRS Requirements', count: 1 },
  { id: 'sdd', label: '📐 SDD System Design', count: 1 },
  { id: 'architecture', label: '🏛️ 4-Way Folder Standard', count: 1 },
  { id: 'api', label: '🔌 REST API Contracts', count: 1 },
  { id: 'rbac', label: '🛡️ RBAC 1-12-108 Matrix', count: 1 },
  { id: 'dedup', label: '⚡ Deduplication Engine', count: 1 },
  { id: 'testing', label: '🧪 SQA & Vitest Matrices', count: 1 },
  { id: 'devops', label: '🚀 DevOps & CI/CD Runbooks', count: 1 },
  { id: 'pwa', label: '📱 PWA Offline & Service Worker', count: 1 },
  { id: 'waves', label: '🌊 Waves 12–16 Engineering', count: 1 },
] as const;

export const AURORA_SOFTWARE_DOCS: SoftwareDocItem[] = [
  {
    id: 'doc-aurora-01',
    code: 'DOC-SWE-01',
    title: 'SRS: AI Command Center & 44 Enterprise Assistants Specification',
    category: 'srs',
    phase: 'Construction (Wave 65)',
    primaryAssistant: '3.16 Aurora AI (CTO Architecture)',
    lastUpdated: '2026-08-26',
    summary: 'Functional and non-functional software requirements for all 44 specialized AI assistants across the 12 corporate floors and executive command suite.',
    tags: ['SRS', 'AI Command Center', '44 Assistants', 'Henry AI 3.19', 'Theodora AI 3.14', 'Zoe AI 3.4', 'Margaret AI 3.42', 'Ada AI 3.43', 'AEGIS AI 3.44'],
    subItems: [
      { id: 'sec-srs-1', title: '1. Functional Assistant Matrix (44 Personas)', description: 'Item codes 3.1 to 3.44, capabilities, and system specifications.' },
      { id: 'sec-srs-2', title: '2. Non-Functional Latency & Availability', description: 'Latency SLA < 250ms and 99.99% availability.' },
      { id: 'sec-srs-3', title: '3. Data Security & Isolation Rules', description: 'Role-gated payloads and client credential shielding.' },
      { id: 'sec-srs-4', title: '4. Inter-Assistant Event Protocol', description: 'Real-time telemetry and cross-assistant triggers.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SOFTWARE REQUIREMENTS SPECIFICATION (SRS) · ISO/IEC/IEEE 29148</div>
  <h1 class="doc-title">📋 AI Command Center & 44 Enterprise Assistants Specification</h1>
  <p class="doc-lead">
    Formal specification of system requirements governing the White Caves AI Command Center, 44 assistant dispatch protocols, and life-cycle telemetry.
  </p>

  <h2 class="doc-section-heading" id="sec-srs-1">1. Canonical 44-Assistant Functional Architecture</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Item Code</th>
          <th>Assistant Identity</th>
          <th>Operational Domain</th>
          <th>System Specifications</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>3.4</code></td>
          <td><strong>Zoe AI</strong></td>
          <td>Executive Advisory & Governance</td>
          <td>Managing Director executive briefing desk, 12-department SLA monitoring, and DET 1388443 business hub. <a href="#assistant-zoe" class="doc-link">View Module →</a></td>
        </tr>
        <tr>
          <td><code>3.14</code></td>
          <td><strong>Theodora AI</strong></td>
          <td>Finance & Statutory Accounting</td>
          <td>67 Enterprise Reports engine, double-entry general ledger, FTA Form 201 VAT 5% audit, and Corporate Tax 9% ledger. <a href="#assistant-theodora" class="doc-link">View Module →</a></td>
        </tr>
        <tr>
          <td><code>3.15</code></td>
          <td><strong>Laila AI</strong></td>
          <td>Regulatory Compliance & AML</td>
          <td>PEP & sanctions screening, Trakheesi QR verification, goAML statutory risk scorecard, and broker audit file. <a href="#assistant-laila" class="doc-link">View Module →</a></td>
        </tr>
        <tr>
          <td><code>3.16</code></td>
          <td><strong>Aurora AI</strong></td>
          <td>CTO Architecture & APIs</td>
          <td>SRS specifications, SDD topologies, RUP lifecycles, and 4-way folder standards repository. <a href="#assistant-aurora" class="doc-link">View Module →</a></td>
        </tr>
        <tr>
          <td><code>3.19</code></td>
          <td><strong>Henry AI</strong></td>
          <td>Document Studio & OCR Wizard</td>
          <td>Emirates ID OCR, Passport parser, Title Deed validation, Unified Ejari tenancy contracts, and digital signatures. <a href="#assistant-henry" class="doc-link">View Module →</a></td>
        </tr>
        <tr>
          <td><code>3.42</code></td>
          <td><strong>Margaret AI</strong></td>
          <td>Strategic Planning & Backlog</td>
          <td>Master Plan roadmap (Waves 01–65), sprint milestone allocation, and feature coverage traceability matrix. <a href="#assistant-margaret" class="doc-link">View Module →</a></td>
        </tr>
        <tr>
          <td><code>3.43</code></td>
          <td><strong>Ada AI</strong></td>
          <td>Chief Architecture & SDLC</td>
          <td>Zero-token local verification gates, deduplication law, and RBAC 1-12-108 security matrix. <a href="#assistant-ada" class="doc-link">View Module →</a></td>
        </tr>
        <tr>
          <td><code>3.44</code></td>
          <td><strong>AEGIS AI</strong></td>
          <td>Autonomous Autopilot & Swarm</td>
          <td>170-agent mesh orchestrator, live telemetry scanner (0 issues), and daily turn execution chronology. <a href="#assistant-aegis" class="doc-link">View Module →</a></td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="doc-section-heading" id="sec-srs-2">2. Non-Functional Performance Constraints</h2>
  <ul class="doc-list">
    <li><strong>Latency SLA:</strong> Assistant response execution time must remain &lt; 250ms for local calculations and &lt; 1.2s for OCR parses.</li>
    <li><strong>Availability:</strong> 99.99% uptime with offline-first indexed caching fallback.</li>
    <li><strong>Test Coverage:</strong> 100% GREEN Vitest assertion coverage on all logic and style modules.</li>
  </ul>
</div>
`
  },
  {
    id: 'doc-aurora-02',
    code: 'DOC-SWE-02',
    title: 'SDD: System Design & Microservice Topologies',
    category: 'sdd',
    phase: 'Construction (Wave 65)',
    primaryAssistant: '3.11 Aurora AI (Architecture)',
    lastUpdated: '2026-08-26',
    summary: 'High-level system design document, client-server topology, WebSocket event buses, Redis caching layers, and database schemas.',
    tags: ['SDD', 'Architecture Topology', 'Redis', 'WebSockets', 'Chart of Accounts'],
    subItems: [
      { id: 'sec-sdd-1', title: '1. High-Level Data Topology', description: 'Client-server separation, gateway routes, and database tiers.' },
      { id: 'sec-sdd-2', title: '2. Real-Time Event Bus', description: 'WebSocket channels and cross-assistant pub/sub triggers.' },
      { id: 'sec-sdd-3', title: '3. Storage Schemas & Models', description: 'Prisma data models and relational integrity rules.' },
      { id: 'sec-sdd-4', title: '4. Redis Cache & Buffer Tiers', description: 'Key eviction policies and offline IndexedDB sync.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SOFTWARE DESIGN DOCUMENT (SDD) · IEEE 1016-2009</div>
  <h1 class="doc-title">📐 System Design & Microservice Topologies</h1>
  <p class="doc-lead">
    Architectural blueprint illustrating data flows, state machines, microservices, and storage layers across White Caves Core.
  </p>

  <h2 class="doc-section-heading" id="sec-sdd-1">1. High-Level Data Topology</h2>
  <div class="code-block">
+-------------------------------------------------------------------------+
|                  REACT 18 / VITE HIGH-DENSITY FRONTEND                  |
|  (4-Way Architecture: Component.tsx | logic/ | styles/ | data/)        |
+--------------------+-----------------------------------+----------------+
                     |                                   |
                     v REST APIs                         v WebSockets (Live Sync)
+--------------------+-----------------------------------+----------------+
|                     EXPRESS 4.x / NODE.JS BACKEND                       |
|  - Auth & RBAC Guard (/api/v1/auth)                                     |
|  - Financial Reporting Engine (/api/finance/reports)                    |
|  - Document OCR & PDF Generator (/api/documents/tenancy)                |
|  - Nadia Lead Dispatch Hub (/api/leads/routing)                         |
+--------------------+-----------------------------------+----------------+
                     |                                   |
                     v Queries                           v Key-Value Cache
+--------------------+-------------------+   +-----------+----------------+
|        MONGODB / PRISMA CLUSTER        |   |      REDIS CACHE POOL      |
|  - Users & Roles (1-12-108)            |   |  - Report Summaries (TTL)  |
|  - Properties Ledger (9,378 units)     |   |  - Session Tokens          |
|  - Double-Entry Journal Lines          |   |  - OCR Result Buffers      |
+----------------------------------------+   +----------------------------+
  </div>

  <h2 class="doc-section-heading" id="sec-sdd-2">2. Real-Time Assistant Interconnect</h2>
  <p>
    AI assistants communicate across an asynchronous message bus. When <a href="#assistant-3.19" class="doc-link">3.19 Henry AI</a> finalizes a lease, an event triggers <a href="#assistant-3.14" class="doc-link">3.14 Theodora AI</a> to book security deposits and commission VAT receivables automatically.
  </p>
</div>
`
  },
  {
    id: 'doc-aurora-03',
    code: 'DOC-SWE-03',
    title: 'Frontend 4-Way Folder Segregation Standard',
    category: 'architecture',
    phase: 'Permanent Standard',
    primaryAssistant: '3.11 Aurora AI (Architecture)',
    lastUpdated: '2026-08-26',
    summary: 'Strict mandatory standard organizing all React components into co-located View, Logic, Style, and Data layers.',
    tags: ['4-Way Standard', 'Component Architecture', 'Refactoring', 'i18n Dictionaries'],
    subItems: [
      { id: 'sec-4way-1', title: '1. Layer Breakdown & File Roles', description: 'View (.tsx), Logic (.logic.ts), Style (.style.ts), Data (.data.ts).' },
      { id: 'sec-4way-2', title: '2. Unit Test Mirroring', description: 'Independent test files for View, Logic, Style, and Data.' },
      { id: 'sec-4way-3', title: '3. Anti-Pattern Prohibitions', description: 'No raw inline hex colors, no monolithic mixed hook files.' },
      { id: 'sec-4way-4', title: '4. Performance Memoization Rules', description: 'useMemo and useCallback enforcement for render optimization.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">FRONTEND ENGINEERING STANDARD · WHITE CAVES SDLC</div>
  <h1 class="doc-title">🏛️ Frontend 4-Way Folder Segregation Standard</h1>
  <p class="doc-lead">
    Every single frontend component in White Caves must strictly adhere to the 4-way subfolder pattern to guarantee separation of concerns, testability, and zero copy drift.
  </p>

  <div class="doc-card-grid" id="sec-4way-1">
    <div class="doc-card">
      <div class="doc-card-label">1. View Layer</div>
      <div class="doc-card-value">Component.tsx</div>
      <div class="doc-card-sub">Stateless presentational shell drawing variables</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">2. Logic Layer</div>
      <div class="doc-card-value">logic/Component.logic.ts</div>
      <div class="doc-card-sub">React hooks, event handlers, and data fetching</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">3. Style Layer</div>
      <div class="doc-card-value">styles/Component.style.ts</div>
      <div class="doc-card-sub">Stateless styled-components & tokenized CSS</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">4. Data Layer</div>
      <div class="doc-card-value">data/Component.data.ts</div>
      <div class="doc-card-sub">Static text, mock datasets, and translation maps</div>
    </div>
  </div>
</div>
`
  },
  {
    id: 'doc-aurora-04',
    code: 'DOC-SWE-04',
    title: 'REST API Contracts & Gateway Specification',
    category: 'api',
    phase: 'Construction (Wave 65)',
    primaryAssistant: '3.11 Aurora AI (Architecture)',
    lastUpdated: '2026-08-26',
    summary: 'Endpoint definitions, payload schemas, JWT authentication headers, and response envelopes for core services.',
    tags: ['REST API', 'API Contracts', 'JWT Auth', 'Endpoints'],
    subItems: [
      { id: 'sec-api-1', title: '1. Authentication Endpoints (/api/v1/auth)', description: 'Login, JWT issuance, token refresh, and session revoke.' },
      { id: 'sec-api-2', title: '2. Finance Endpoints (/api/finance)', description: 'Report execution, journal entries, and VAT summaries.' },
      { id: 'sec-api-3', title: '3. Document Endpoints (/api/documents)', description: 'Ejari generation, OCR scanner ingest, and e-signatures.' },
      { id: 'sec-api-4', title: '4. Standard Response Envelope', description: 'HTTP status codes, data payloads, and error schemas.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">API GATEWAY · OPENAPI 3.1 SPECIFICATION</div>
  <h1 class="doc-title">🔌 REST API Contracts & Gateway Specification</h1>
  <p class="doc-lead">
    Production API endpoint definitions powering client portals, CRM dashboards, and external broker integrations.
  </p>

  <h2 class="doc-section-heading" id="sec-api-1">Key API Endpoints</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Method</th>
          <th>Endpoint URI</th>
          <th>Auth Scope</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>POST</code></td>
          <td><code>/api/v1/auth/login</code></td>
          <td>Public</td>
          <td>Authenticates user and returns signed JWT with RBAC tier claims.</td>
        </tr>
        <tr>
          <td><code>GET</code></td>
          <td><code>/api/finance/reports/:reportId/execute</code></td>
          <td>Level 4+ (Finance)</td>
          <td>Executes one of the 67 Theodora AI financial reports in real-time.</td>
        </tr>
        <tr>
          <td><code>POST</code></td>
          <td><code>/api/documents/tenancy/generate</code></td>
          <td>Level 3+ (Leasing)</td>
          <td>Generates unified Ejari contract PDF and initializes e-sign tracker.</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`
  },
  {
    id: 'doc-aurora-05',
    code: 'DOC-SWE-05',
    title: 'RBAC 1-12-108 Security & Role-Based Access Control',
    category: 'rbac',
    phase: 'Permanent Standard',
    primaryAssistant: '3.11 Aurora AI (Architecture)',
    lastUpdated: '2026-08-26',
    summary: 'Role-based authorization matrix mapping 14 user roles across 3 operational tiers with Founder Level 5 Sovereign Bypass.',
    tags: ['RBAC', 'Security', 'Level 5 Master', 'Role Hierarchy', 'Founder Bypass'],
    subItems: [
      { id: 'sec-rbac-1', title: '1. Role Authority Tiers (Levels 1 to 5)', description: 'Sovereign MD, Executive Head, Broker, and Tenant.' },
      { id: 'sec-rbac-2', title: '2. Field-Level Redaction Rules', description: 'PII masking, passport number encryption, and salary data.' },
      { id: 'sec-rbac-3', title: '3. Founder Level 5 Wildcard Bypass', description: 'Universal read/write access across all 12 corporate floors.' },
      { id: 'sec-rbac-4', title: '4. Token Invalidation & Session Defense', description: 'Instant revocation and CSRF protection headers.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SECURITY & GOVERNANCE · RBAC 1-12-108 SPECIFICATION</div>
  <h1 class="doc-title">🛡️ RBAC 1-12-108 Security & Access Control</h1>
  <p class="doc-lead">
    Deterministic authorization model guaranteeing that data isolation and administrative authority are strictly enforced.
  </p>

  <h2 class="doc-section-heading" id="sec-rbac-1">1. Role Authority Levels</h2>
  <ul class="doc-list">
    <li><strong>Level 5 (Managing Director Sovereign):</strong> Reserved exclusively for Arslan Malik with wildcard access (<code>['*']</code>) across all 12 corporate floors.</li>
    <li><strong>Level 4 (Department Head / Executive):</strong> Full read/write authority within specific corporate floor domains (e.g. Theodora AI for Finance).</li>
    <li><strong>Level 3 (Senior Broker / Associate):</strong> Access to personal pipeline, client communications, and Henry document generators.</li>
    <li><strong>Level 2 (Client / Investor):</strong> Restricted to authenticated tenant and investor portals.</li>
  </ul>
</div>
`
  },
  {
    id: 'doc-aurora-06',
    code: 'DOC-SWE-06',
    title: 'Continuous Codebase Deduplication & Optimization Engine',
    category: 'dedup',
    phase: 'Permanent Automation',
    primaryAssistant: '3.11 Aurora AI (Architecture)',
    lastUpdated: '2026-08-26',
    summary: 'Automated algorithms scanning, pruning, and consolidating duplicate handlers, redundant components, and legacy styles.',
    tags: ['Deduplication', 'Optimization', 'AEGIS V3', 'Dead Code Pruning'],
    subItems: [
      { id: 'sec-dedup-1', title: '1. O(n²) to O(n) Algorithmic Refactoring', description: 'Map/Set index lookups replacing nested array iterations.' },
      { id: 'sec-dedup-2', title: '2. Dead Code & Debug Pruning', description: 'Automated cleanup of orphaned exports and console statements.' },
      { id: 'sec-dedup-3', title: '3. Single-File Isolation Standard', description: 'Discrete turn modifications preventing cross-file regressions.' },
      { id: 'sec-dedup-4', title: '4. Unified Master Layout Consolidation', description: 'Master sidebar, viewport frame, and elimination of legacy tabs.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">ENGINEERING AUTOMATION · AEGIS V3 DEDUPLICATION</div>
  <h1 class="doc-title">⚡ Continuous Codebase Deduplication & Optimization Engine</h1>
  <p class="doc-lead">
    Continuous scanning protocol enforcing time-complexity minimization (O(n²) → O(n)) and purging legacy redundant modules.
  </p>

  <h2 class="doc-section-heading" id="sec-dedup-1">Deduplication Rules & Protocols</h2>
  <ul class="doc-list">
    <li><strong>Dead Code & Style Pruning:</strong> Automated purge of unused export symbols, orphaned CSS classes, and debug console artifacts.</li>
    <li><strong>Single-File Isolation:</strong> Loading and editing target files in discrete turns to prevent cross-file token wastage.</li>
    <li><strong>Unified Layout Consolidation:</strong> Single master sidebar and viewport routing eliminating redundant duplicate dashboards.</li>
  </ul>
</div>
`
  },
  {
    id: 'doc-aurora-07',
    code: 'DOC-SWE-07',
    title: 'Software Quality Assurance (SQA) & Automated Vitest Matrix',
    category: 'testing',
    phase: 'Permanent Quality Gate',
    primaryAssistant: '3.11 Aurora AI & Katherine QA',
    lastUpdated: '2026-08-26',
    summary: '100% test coverage standards, Vitest fork execution, E2E Playwright tests, WCAG 2.1 AA accessibility audits, and memory bounds.',
    tags: ['SQA', 'Vitest', 'Unit Tests', 'E2E Testing', 'WCAG 2.1 AA'],
    subItems: [
      { id: 'sec-sqa-1', title: '1. Vitest Execution Architecture', description: 'cross-env max-old-space-size=8192 and fork pool execution.' },
      { id: 'sec-sqa-2', title: '2. Co-Located Test Mirroring', description: 'Every Component.tsx accompanied by Component.test.tsx.' },
      { id: 'sec-sqa-3', title: '3. E2E Playwright Integration Suites', description: 'Critical booking, deal pipeline, and authentication journeys.' },
      { id: 'sec-sqa-4', title: '4. Accessibility & Contrast Auditing', description: 'Automated Axe testing and 4.5:1 text contrast validation.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">QUALITY ASSURANCE · SQA MASTER TEST MATRIX</div>
  <h1 class="doc-title">🧪 SQA & Automated Vitest Master Matrix</h1>
  <p class="doc-lead">
    Testing architecture ensuring zero regressions across all 3,868 source modules through automated Vitest suites and Playwright E2E verification.
  </p>

  <h2 class="doc-section-heading" id="sec-sqa-1">1. Test Execution Standard</h2>
  <p class="doc-body">
    All test runs execute with memory allocations scaled for large AST parsing:
  </p>
  <div class="code-block">
npx cross-env NODE_OPTIONS=--max-old-space-size=8192 vitest run --pool=forks
  </div>
</div>
`
  },
  {
    id: 'doc-aurora-08',
    code: 'DOC-SWE-08',
    title: 'DevOps Infrastructure, CI/CD Pipelines & Deployment Runbooks',
    category: 'devops',
    phase: 'Permanent Operations',
    primaryAssistant: '3.11 Aurora AI & Gwynne DevOps',
    lastUpdated: '2026-08-26',
    summary: 'GitHub Actions workflow configurations, staging and production release runbooks, SSL certificates, and incident response matrices.',
    tags: ['DevOps', 'CI/CD', 'GitHub Actions', 'Runbooks', 'Incident Response'],
    subItems: [
      { id: 'sec-ops-1', title: '1. GitHub Actions Multi-Stage Pipeline', description: 'Lint, typecheck, vitest, and production Vite compilation.' },
      { id: 'sec-ops-2', title: '2. Production Deployment Runbook', description: 'Zero-downtime blue/green deployment and asset hashing.' },
      { id: 'sec-ops-3', title: '3. Rollback & Emergency Fast-Forward', description: 'Automated git branch fast-forward and database migrations.' },
      { id: 'sec-ops-4', title: '4. Telemetry & Error Logging', description: 'Prometheus metrics, health check pings, and incident alerts.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">OPERATIONS & INFRASTRUCTURE · CI/CD RUNBOOK</div>
  <h1 class="doc-title">🚀 DevOps Infrastructure, CI/CD Pipelines & Runbooks</h1>
  <p class="doc-lead">
    Operating manual for continuous deployment, environment isolation, automated rollbacks, and server health monitoring.
  </p>

  <h2 class="doc-section-heading" id="sec-ops-1">1. Multi-Stage Pipeline Steps</h2>
  <ol class="doc-list">
    <li><strong>Stage 1 (Code Quality):</strong> ESLint and TypeScript compilation validation.</li>
    <li><strong>Stage 2 (Unit & Integration Tests):</strong> Full Vitest suite execution with 100% green gate.</li>
    <li><strong>Stage 3 (Production Bundle):</strong> Vite build creating hashed chunk assets and Workbox Service Worker.</li>
    <li><strong>Stage 4 (Release Certification):</strong> Master release certificate emission and deployment to live edge servers.</li>
  </ol>
</div>
`
  },
  {
    id: 'doc-aurora-09',
    code: 'DOC-SWE-09',
    title: 'Progressive Web App (PWA) Offline Engine & Service Worker Lifecycle',
    category: 'pwa',
    phase: 'Construction (Wave 65)',
    primaryAssistant: '3.11 Aurora AI (Architecture)',
    lastUpdated: '2026-08-26',
    summary: 'Workbox service worker caching strategies, IndexedDB offline transaction queue, background sync replay, and install prompts.',
    tags: ['PWA', 'Workbox', 'Service Worker', 'Offline Sync', 'IndexedDB'],
    subItems: [
      { id: 'sec-pwa-1', title: '1. Workbox Precache Manifest', description: 'Pre-caching 480 critical asset entries and application shells.' },
      { id: 'sec-pwa-2', title: '2. Offline Lead & Form Queueing', description: 'IndexedDB storage capturing viewings when network is offline.' },
      { id: 'sec-pwa-3', title: '3. Background Sync & Replay Engine', description: 'Automatic API flush when device reconnects to internet.' },
      { id: 'sec-pwa-4', title: '4. Install Banner & Standalone UX', description: 'A2HS prompt triggers and native application look-and-feel.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">MOBILE ARCHITECTURE · PWA v1.3.0 SPECIFICATION</div>
  <h1 class="doc-title">📱 Progressive Web App (PWA) Offline Engine</h1>
  <p class="doc-lead">
    High-availability offline architecture allowing brokers in remote basement parking or desert development sites to capture leads without interruption.
  </p>

  <h2 class="doc-section-heading" id="sec-pwa-1">1. Workbox Caching Strategy</h2>
  <p class="doc-body">
    Static assets, web fonts, and luxury property thumbnails are cached with Stale-While-Revalidate strategies, ensuring instant load times (< 80ms) even on low-speed 3G mobile networks.
  </p>
</div>
`
  },
  {
    id: 'doc-aurora-10',
    code: 'DOC-SWE-10',
    title: 'Waves 12–16 Engineering Blueprint & Product Automation',
    category: 'waves',
    phase: 'Execution (Waves 12–16)',
    primaryAssistant: '3.11 Aurora AI & Engineering Leads',
    lastUpdated: '2026-08-26',
    summary: 'Deep technical specifications covering Automation Engine, PDF/Document Streaming, Socket.io Real-Time, Media Transforms, and Security Hardening.',
    tags: ['Wave 12', 'Wave 13', 'Wave 14', 'Wave 15', 'Wave 16'],
    subItems: [
      { id: 'sec-wave-12', title: '1. Wave 12: Automation & Document Streaming', description: 'Cron cadence, Puppeteer PDF generators, and Handlebars templates.' },
      { id: 'sec-wave-13', title: '2. Wave 13: Real-Time & 360 Media', description: 'Socket.io rooms, Cloudinary transforms, and Pannellum VR routes.' },
      { id: 'sec-wave-14', title: '3. Wave 14: Validation & Product Automation', description: 'Zod schemas, lead auto-rescore, and mortgage calculators.' },
      { id: 'sec-wave-15', title: '4. Wave 15 & 16: Caching & Security Hardening', description: 'Redis key pool strategy, PWA offline scope, and /api/v1 CSRF guard.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">ENGINEERING ROADMAP · WAVES 12–16 SPECIFICATION</div>
  <h1 class="doc-title">🌊 Waves 12–16 Engineering Blueprint & Product Automation</h1>
  <p class="doc-lead">
    Core platform micro-architectures implemented across consecutive engineering waves, establishing end-to-end automation, real-time push, and military-grade security.
  </p>

  <h2 class="doc-section-heading" id="sec-wave-12">1. Wave 12: Automation & Document Streaming</h2>
  <ul class="doc-list">
    <li><strong>SchedulerService:</strong> Background cron engine processing lease expiry reminders and PDC deposit alerts.</li>
    <li><strong>DocumentService:</strong> Streaming PDF generation for Ejari contracts, Form A/B/I, and financial statements.</li>
  </ul>

  <h2 class="doc-section-heading" id="sec-wave-13">2. Wave 13: Real-Time Notifications & 360 VR</h2>
  <ul class="doc-list">
    <li><strong>Socket.io Push:</strong> Real-time room multiplexing for live viewing bookings and price drop alerts.</li>
    <li><strong>Pannellum 360:</strong> WebGL high-resolution virtual tours for luxury penthouses and off-plan villas.</li>
  </ul>
</div>
`
  },
];
