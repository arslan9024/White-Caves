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

export interface SoftwareDocItem {
  id: string;
  code: string;
  title: string;
  category: 'srs' | 'sdd' | 'architecture' | 'api' | 'rbac' | 'dedup';
  phase: string;
  primaryAssistant: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  htmlContent: string;
}

export const AURORA_SOFTWARE_CATEGORIES = [
  { id: 'all', label: 'All Software Docs', count: 6 },
  { id: 'srs', label: '📋 SRS Requirements', count: 1 },
  { id: 'sdd', label: '📐 SDD System Design', count: 1 },
  { id: 'architecture', label: '🏛️ 4-Way Folder Standard', count: 1 },
  { id: 'api', label: '🔌 REST API Contracts', count: 1 },
  { id: 'rbac', label: '🛡️ RBAC 1-12-108 Matrix', count: 1 },
  { id: 'dedup', label: '⚡ Deduplication Engine', count: 1 },
] as const;

export const AURORA_SOFTWARE_DOCS: SoftwareDocItem[] = [
  {
    id: 'doc-aurora-01',
    code: 'DOC-SWE-01',
    title: 'SRS: AI Command Center & Enterprise Assistants Specification',
    category: 'srs',
    phase: 'Construction (Wave 65)',
    primaryAssistant: '3.11 Aurora AI (Architecture)',
    lastUpdated: '2026-08-25',
    summary: 'Functional and non-functional software requirements for all 26+ specialized AI assistants across the 12 corporate floors.',
    tags: ['SRS', 'AI Assistants', 'Henry AI 3.19', 'Theodora AI 3.14', 'Nadia AI 3.01'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SOFTWARE REQUIREMENTS SPECIFICATION (SRS) · ISO/IEC/IEEE 29148</div>
  <h1 class="doc-title">📋 AI Command Center & Enterprise Assistants Specification</h1>
  <p class="doc-lead">
    Formal specification of system requirements governing the White Caves AI Command Center, assistant dispatch protocols, and life-cycle telemetry.
  </p>

  <h2 class="doc-section-heading">1. Core Assistant Requirement Matrix</h2>
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
        <td><code>3.19</code></td>
        <td><strong>Henry AI</strong></td>
        <td>Document Studio & Legal Wizard</td>
        <td>Emirates ID OCR, Passport parser, Form A generator, Unified Ejari tenancy contracts, and digital e-signature capture. <a href="#assistant-3.19" class="doc-link">View Module →</a></td>
      </tr>
      <tr>
        <td><code>3.14</code></td>
        <td><strong>Theodora AI</strong></td>
        <td>Finance & Statutory Accounting</td>
        <td>67 Enterprise Reports engine, double-entry general ledger, FTA Form 201 VAT audit, and Corporate Tax 9% ledger. <a href="#assistant-3.14" class="doc-link">View Module →</a></td>
      </tr>
      <tr>
        <td><code>3.10</code></td>
        <td><strong>Zoe AI</strong></td>
        <td>Executive & Regulatory Docs Hub</td>
        <td>Hyper-linked business HTML documentation, DET 1388443 licensing, and corporate compliance oversight. <a href="#assistant-3.10" class="doc-link">View Module →</a></td>
      </tr>
      <tr>
        <td><code>3.11</code></td>
        <td><strong>Aurora AI</strong></td>
        <td>Software Architecture Intelligence</td>
        <td>SRS specifications, SDD topologies, RUP governance, and 4-way folder standards repository. <a href="#assistant-3.11" class="doc-link">View Module →</a></td>
      </tr>
    </tbody>
  </table>

  <h2 class="doc-section-heading">2. Non-Functional Performance Constraints</h2>
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
    lastUpdated: '2026-08-25',
    summary: 'High-level system design document, client-server topology, WebSocket event buses, Redis caching layers, and database schemas.',
    tags: ['SDD', 'Architecture Topology', 'Redis', 'WebSockets', 'Chart of Accounts'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SOFTWARE DESIGN DOCUMENT (SDD) · IEEE 1016-2009</div>
  <h1 class="doc-title">📐 System Design & Microservice Topologies</h1>
  <p class="doc-lead">
    Architectural blueprint illustrating data flows, state machines, microservices, and storage layers across White Caves Core.
  </p>

  <h2 class="doc-section-heading">1. High-Level Data Topology</h2>
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

  <h2 class="doc-section-heading">2. Real-Time Assistant Interconnect</h2>
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
    lastUpdated: '2026-08-25',
    summary: 'Strict mandatory standard organizing all React components into co-located View, Logic, Style, and Data layers.',
    tags: ['4-Way Standard', 'Component Architecture', 'Refactoring', 'i18n Dictionaries'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">FRONTEND ENGINEERING STANDARD · WHITE CAVES SDLC</div>
  <h1 class="doc-title">🏛️ Frontend 4-Way Folder Segregation Standard</h1>
  <p class="doc-lead">
    Every single frontend component in White Caves must strictly adhere to the 4-way subfolder pattern to guarantee separation of concerns, testability, and zero copy drift.
  </p>

  <div class="doc-card-grid">
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
    lastUpdated: '2026-08-25',
    summary: 'Endpoint definitions, payload schemas, JWT authentication headers, and response envelopes for core services.',
    tags: ['REST API', 'API Contracts', 'JWT Auth', 'Endpoints'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">API GATEWAY · OPENAPI 3.1 SPECIFICATION</div>
  <h1 class="doc-title">🔌 REST API Contracts & Gateway Specification</h1>
  <p class="doc-lead">
    Production API endpoint definitions powering client portals, CRM dashboards, and external broker integrations.
  </p>

  <h2 class="doc-section-heading">Key API Endpoints</h2>
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
`
  },
  {
    id: 'doc-aurora-05',
    code: 'DOC-SWE-05',
    title: 'RBAC 1-12-108 Security & Role-Based Access Control',
    category: 'rbac',
    phase: 'Permanent Standard',
    primaryAssistant: '3.11 Aurora AI (Architecture)',
    lastUpdated: '2026-08-25',
    summary: 'Role-based authorization matrix mapping 14 user roles across 3 operational tiers with Founder Level 5 Sovereign Bypass.',
    tags: ['RBAC', 'Security', 'Level 5 Master', 'Role Hierarchy', 'Founder Bypass'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SECURITY & GOVERNANCE · RBAC 1-12-108 SPECIFICATION</div>
  <h1 class="doc-title">🛡️ RBAC 1-12-108 Security & Access Control</h1>
  <p class="doc-lead">
    Deterministic authorization model guaranteeing that data isolation and administrative authority are strictly enforced.
  </p>

  <h2 class="doc-section-heading">1. Role Authority Levels</h2>
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
    lastUpdated: '2026-08-25',
    summary: 'Automated algorithms scanning, pruning, and consolidating duplicate handlers, redundant components, and legacy styles.',
    tags: ['Deduplication', 'Optimization', 'AEGIS V3', 'Dead Code Pruning'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">ENGINEERING AUTOMATION · AEGIS V3 DEDUPLICATION</div>
  <h1 class="doc-title">⚡ Continuous Codebase Deduplication & Optimization Engine</h1>
  <p class="doc-lead">
    Continuous scanning protocol enforcing time-complexity minimization (O(n²) → O(n)) and purging legacy redundant modules.
  </p>

  <h2 class="doc-section-heading">Deduplication Rules & Protocols</h2>
  <ul class="doc-list">
    <li><strong>Dead Code & Style Pruning:</strong> Automated purge of unused export symbols, orphaned CSS classes, and debug console artifacts.</li>
    <li><strong>Single-File Isolation:</strong> Loading and editing target files in discrete turns to prevent cross-file token wastage.</li>
    <li><strong>Unified Layout Consolidation:</strong> Single master sidebar and viewport routing eliminating redundant duplicate dashboards.</li>
  </ul>
</div>
`
  }
];
