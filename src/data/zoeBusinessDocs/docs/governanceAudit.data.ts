import type { BusinessDocItem } from '../types';

export const governanceAuditDocs: BusinessDocItem[] = [
  {
    id: 'doc-zoe-12',
    code: 'DOC-BUS-12',
    title: 'CRM Engine Specification, Advanced UI Modules & 22-Role RBAC',
    category: 'crm_features',
    departmentFloor: 'Floor 05 / Floor 09 — Product & Security Desk',
    primaryAssistant: '3.4 Zoe AI & 3.16 Aurora CTO',
    lastUpdated: '2026-08-26',
    summary:
      'Complete technical specifications for Unified CRM, Landlord/Tenant Portals, Valuation Modules, and 22-Role Field-Level RBAC Matrix.',
    tags: ['Unified CRM', 'Landlord Portal', 'Tenant Portal', 'RBAC Matrix', 'Field Permissions'],
    subItems: [
      {
        id: 'sec-12-1',
        title: '1. Unified CRM Core Architecture',
        description: 'Modular widget architecture, tab routing, and real-time state sync.',
      },
      {
        id: 'sec-12-2',
        title: '2. Dedicated Landlord & Tenant Portals',
        description:
          'KYC onboarding, lease document download, maintenance tickets, and rent payments.',
      },
      {
        id: 'sec-12-3',
        title: '3. 22 User Roles & Access Control Policy',
        description:
          'Managing Director, Broker, Accountant, Tenant, and Investor permission tiers.',
      },
      {
        id: 'sec-12-4',
        title: '4. Field-Level Permission Security Matrix',
        description:
          'Masking of confidential phone numbers, banking details, and commission splits.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">CRM ENGINE & PERMISSIONS · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 09</div>
  <h1 class="doc-title">⚡ CRM Engine Specification & 22-Role RBAC Matrix</h1>
  <p class="doc-lead">
    Master software specification for the White Caves CRM Engine, interactive client self-service portals, and granular 22-role Role-Based Access Control (RBAC) security framework.
  </p>

  <h2 class="doc-section-heading" id="sec-12-3">1. 22-Role Organizational Access Matrix</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Role Code</th>
          <th>Role Title</th>
          <th>Access Tier</th>
          <th>Security Boundary</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>ROLE-01</strong></td><td>Managing Director</td><td>Full Admin (L5)</td><td>Unrestricted access across all 12 departments, financial ledgers, and audit logs.</td></tr>
        <tr><td><strong>ROLE-02</strong></td><td>Chief Operations Officer</td><td>Executive (L4)</td><td>Full operational authority, task assignment, and department SLA oversight.</td></tr>
        <tr><td><strong>ROLE-03</strong></td><td>RERA Licensed Broker</td><td>Commercial (L3)</td><td>Assigned leads, personal listings, Form A/B creation, client WhatsApp desk.</td></tr>
        <tr><td><strong>ROLE-04</strong></td><td>Finance & VAT Officer</td><td>Finance (L3)</td><td>Expense ledger, VAT 201 reports, bank reconciliation, commission payouts.</td></tr>
        <tr><td><strong>ROLE-05</strong></td><td>Verified Property Landlord</td><td>Portal (L1)</td><td>Personal asset portfolio, tenancy contracts, PDC schedule, maintenance tickets.</td></tr>
        <tr><td><strong>ROLE-06</strong></td><td>Registered Tenant</td><td>Portal (L1)</td><td>Ejari certificate, payment receipts, maintenance requests, move-in snags.</td></tr>
      </tbody>
    </table>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-13: 09_crm_features (UHNW Vault)
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-13',
    code: 'DOC-BUS-13',
    title: 'UHNW Private Vault, Off-Market Confidentiality & VIP Concierge',
    category: 'vip_concierge',
    departmentFloor: 'Floor 07 — VIP Private Wealth Suite',
    primaryAssistant: '3.4 Zoe AI & 3.25 Kairos Luxury',
    lastUpdated: '2026-08-26',
    summary:
      'Ultra-High-Net-Worth private vault access rules, Level 5 Non-Disclosure Agreements (NDAs), and luxury viewing concierge.',
    tags: ['UHNW Vault', 'Off-Market Mansions', 'Level 5 NDA', 'Rolls-Royce Viewing', 'Superyacht'],
    subItems: [
      {
        id: 'sec-13-1',
        title: '1. Private Vault & Level 5 Confidentiality',
        description: 'Biometric passkey access, 5-year digital NDAs, and watermark tracking.',
      },
      {
        id: 'sec-13-2',
        title: '2. Trophy Asset Acquisition Protocol',
        description:
          'Palm Jumeirah beachfront mansions, Emirates Hills palaces, and private islands.',
      },
      {
        id: 'sec-13-3',
        title: '3. Bespoke VIP Viewing Fleet',
        description: 'Rolls-Royce Ghost, 68ft private superyacht, and helicopter aerial tours.',
      },
      {
        id: 'sec-13-4',
        title: '4. UAE Golden Visa & Multi-Currency Settlement',
        description: 'AED, USD, EUR, and crypto-to-fiat escrow settlement advisory.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">UHNW PRIVATE WEALTH · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 09</div>
  <h1 class="doc-title">👑 UHNW Private Vault & VIP Concierge Protocol</h1>
  <p class="doc-lead">
    Governing off-market trophy property acquisitions, high-security digital NDAs, and concierge services for ultra-high-net-worth investors and sovereign family offices.
  </p>

  <h2 class="doc-section-heading" id="sec-13-1">1. Private Vault & Level 5 Confidentiality</h2>
  <p class="doc-body">
    Off-market trophy assets (e.g. Palm Jumeirah beachfront mansions, World Islands plots) are shielded behind the <strong>UHNW Private Vault</strong>. Access requires biometric or two-factor VIP passkey authentication and execution of a legally binding <strong>Level 5 Digital Non-Disclosure Agreement (NDA)</strong> carrying 5-year confidentiality terms.
  </p>

  <h2 class="doc-section-heading" id="sec-13-3">2. Bespoke VIP Viewing Fleet</h2>
  <div class="doc-card-grid">
    <div class="doc-card">
      <div class="doc-card-label">Chauffeur Service</div>
      <div class="doc-card-value">Rolls-Royce Ghost</div>
      <div class="doc-card-sub">Complimentary Land Transport</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Waterfront Approach</div>
      <div class="doc-card-value">68ft Superyacht</div>
      <div class="doc-card-sub">Palm Jumeirah Private Marina</div>
    </div>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-14: 11_seo
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-14',
    code: 'DOC-BUS-14',
    title: 'SEO Strategy, High-Intent Dubai Keywords & Syndication Engine',
    category: 'seo',
    departmentFloor: 'Floor 06 — Marketing & Growth Suite',
    primaryAssistant: '3.4 Zoe AI & 3.11 Olivia Marketing',
    lastUpdated: '2026-08-26',
    summary:
      'Search engine optimization master plan, bilingual English/Arabic keyword clusters, programmatic landing pages, and multi-portal XML syndication.',
    tags: ['SEO Strategy', 'Dubai Keywords', 'Schema Markup', 'Programmatic SEO', 'Syndication'],
    subItems: [
      {
        id: 'sec-14-1',
        title: '1. High-Intent Dubai Real Estate Keyword Clusters',
        description: 'DAMAC Hills 2, Palm Jumeirah luxury villas, and Golden Visa search terms.',
      },
      {
        id: 'sec-14-2',
        title: '2. Structured Data Schema & Rich Snippets',
        description: 'RealEstateListing, Organization, Place, and BreadcrumbList JSON-LD schema.',
      },
      {
        id: 'sec-14-3',
        title: '3. Programmatic Landing Page Architecture',
        description: 'Dynamic community + bedroom landing pages generating organic traffic.',
      },
      {
        id: 'sec-14-4',
        title: '4. Portal XML Syndication Protocol',
        description: 'Automated listing pushes to PropertyFinder, Bayut, and Dubizzle.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SEARCH ENGINE OPTIMIZATION · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 11</div>
  <h1 class="doc-title">🎯 SEO Strategy, Dubai Real Estate Keywords & Syndication</h1>
  <p class="doc-lead">
    Growth marketing and organic search architecture driving qualified buyer and tenant traffic across Google UAE, international luxury markets, and automated portal distribution.
  </p>

  <h2 class="doc-section-heading" id="sec-14-1">1. Priority Dubai Real Estate Keyword Targets</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Keyword Target</th>
          <th>Monthly Search Vol (UAE)</th>
          <th>Intent Category</th>
          <th>Target Landing Page</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>"DAMAC Hills 2 villas for rent"</strong></td><td>18,100</td><td>High Commercial / Leasing</td><td><code>/properties/damac-hills-2/rent</code></td></tr>
        <tr><td><strong>"Dubai luxury penthouses for sale"</strong></td><td>12,400</td><td>High Transaction / Resale</td><td><code>/properties/luxury-penthouses</code></td></tr>
        <tr><td><strong>"UAE Golden Visa real estate 2026"</strong></td><td>9,800</td><td>Investor Advisory</td><td><code>/services/golden-visa</code></td></tr>
      </tbody>
    </table>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-15: 12_srs & 13_testing
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-15',
    code: 'DOC-BUS-15',
    title: 'Software Requirements Specification (SRS), Architecture & QA Matrix',
    category: 'srs_testing',
    departmentFloor: 'Floor 02 / Floor 05 — SQA & Software Engineering',
    primaryAssistant: '3.4 Zoe AI & 3.43 Ada Architecture',
    lastUpdated: '2026-08-26',
    summary:
      'Formal IEEE-compliant Software Requirements Specification (SRS), Software Design Document (SDD), and comprehensive QA Test Plan with UAT scenarios.',
    tags: ['SRS Master', 'SDD Architecture', 'QA Test Plan', 'UAT Scenarios', 'Vitest Playwright'],
    subItems: [
      {
        id: 'sec-15-1',
        title: '1. Software Requirements Specification Master',
        description:
          'Functional decomposition, performance constraints, and external interface specs.',
      },
      {
        id: 'sec-15-2',
        title: '2. Software Design Document (SDD)',
        description: 'Module topology, state management, cache invalidation, and data flow.',
      },
      {
        id: 'sec-15-3',
        title: '3. Master QA Test Plan & Coverage Thresholds',
        description:
          'Unit, integration, accessibility, and E2E test suites with 90%+ code coverage.',
      },
      {
        id: 'sec-15-4',
        title: '4. User Acceptance Testing (UAT) Scenarios',
        description: 'Simulated broker deals, tenant lease execution, and admin financial reports.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SOFTWARE ENGINEERING & SQA · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 12 & 13</div>
  <h1 class="doc-title">🧪 Software Requirements Specification (SRS) & QA Test Plan</h1>
  <p class="doc-lead">
    Rigorous software engineering specifications, formal system design documents, and multi-tier quality assurance matrices ensuring sovereign platform stability and zero regressions.
  </p>

  <h2 class="doc-section-heading" id="sec-15-3">1. Multi-Tier Test Suite Topology</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Test Layer</th>
          <th>Framework / Tool</th>
          <th>Execution Target</th>
          <th>Quality Threshold</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Unit & Logic Tests</strong></td><td>Vitest 3.x</td><td>Services, hooks, reducers, pure functions</td><td>100% Passing · >90% Coverage</td></tr>
        <tr><td><strong>Component View Tests</strong></td><td>React Testing Library</td><td>Interactive UI widgets, buttons, forms, modal states</td><td>100% Passing · Design Token Audit</td></tr>
        <tr><td><strong>E2E Integration Tests</strong></td><td>Playwright</td><td>Full user deal journeys, auth flows, checkout</td><td>100% Passing · Zero Flakiness</td></tr>
      </tbody>
    </table>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-16: 14_devops & 15_release_management
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-16',
    code: 'DOC-BUS-16',
    title: 'DevOps Deployment Runbook, Incident Response & Release Governance',
    category: 'devops_release',
    departmentFloor: 'Floor 02 / Floor 13 — Cloud Infrastructure & Release Office',
    primaryAssistant: '3.4 Zoe AI & 3.44 AEGIS Autopilot',
    lastUpdated: '2026-08-26',
    summary:
      'Production deployment runbooks, Docker/Kubernetes container orchestration, P1–P4 incident response procedures, and release gate change management.',
    tags: [
      'DevOps Runbook',
      'Incident Response',
      'Monitoring 99.9%',
      'Release Management',
      'CI/CD',
    ],
    subItems: [
      {
        id: 'sec-16-1',
        title: '1. Production Deployment Runbook',
        description:
          'Zero-downtime rolling deployments, environment variables, and preflight health checks.',
      },
      {
        id: 'sec-16-2',
        title: '2. Incident Response & P1–P4 Escalation Matrix',
        description: 'Mean Time to Detect (MTTD < 5m) and Mean Time to Resolve (MTTR < 30m).',
      },
      {
        id: 'sec-16-3',
        title: '3. Real-Time Telemetry & Health Monitoring',
        description: 'Prometheus metrics, Grafana dashboards, and error budget alerting.',
      },
      {
        id: 'sec-16-4',
        title: '4. Release Management & SemVer Change Control',
        description: 'Version bumping, CHANGELOG generation, and automated rollback triggers.',
      },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">DEVOPS & RELEASE MANAGEMENT · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 14 & 15</div>
  <h1 class="doc-title">🚀 DevOps Deployment Runbook & Release Governance</h1>
  <p class="doc-lead">
    Operational deployment runbooks, automated CI/CD pipeline controls, real-time health monitoring, and structured incident response protocols guaranteeing enterprise stability.
  </p>

  <h2 class="doc-section-heading" id="sec-16-2">1. Incident Severity & Escalation Matrix</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Severity</th>
          <th>Definition</th>
          <th>Response SLA</th>
          <th>Escalation Path</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>P1 (Critical)</strong></td><td>Platform outage, payment failure, data breach flag</td><td>5 Minutes</td><td>Direct MD notification + AEGIS automated rollback</td></tr>
        <tr><td><strong>P2 (High)</strong></td><td>Portal syndication down, WhatsApp webhook delay > 1m</td><td>15 Minutes</td><td>On-call DevOps Lead (@Gwynne) + Aurora CTO</td></tr>
        <tr><td><strong>P3 (Medium)</strong></td><td>Non-critical UI glitch, report generation slowdown</td><td>2 Hours</td><td>Assigned department developer sprint</td></tr>
        <tr><td><strong>P4 (Low)</strong></td><td>Minor copy typo, documentation formatting update</td><td>24 Hours</td><td>Standard weekly release cycle</td></tr>
      </tbody>
    </table>
  </div>
</div>
`,
  },
];
