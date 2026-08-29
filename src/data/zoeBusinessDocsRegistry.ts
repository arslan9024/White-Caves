/**
 * zoeBusinessDocsRegistry.ts
 * Master Hyper-Linked HTML Business Documentation Registry for Zoe AI (Item Code: 3.4)
 * Complete 16-Module Structure Mapping 1:1 to /docs/business_docs Master Architecture
 * 
 * Corporate & Regulatory Coordinates:
 * - Commercial License (DET): 1388443
 * - RERA Brokerage ORN: 44483 (Classification: General Brokerage)
 * - Office Ejari: 0120250814005322 (Office D-72, El Shaye - 4 Building, Al Barsha South 3rd, Dubai)
 * - Establishment Card (MOL / ICP): 2/1/1192499
 * - Managing Director: Arslan Malik Bashir Ahmad
 * - Brand Palette: White Caves Red (#EF4444) | Brilliant White (#FFFFFF) | Deep Slate Gray (#1E293B)
 */

export interface DocSubItem {
  id: string;
  title: string;
  description: string;
}

export type ZoeBusinessDocCategory =
  | 'progress'
  | 'corporate'
  | 'departments'
  | 'services'
  | 'ai_command'
  | 'licensing'
  | 'leasing'
  | 'workflows'
  | 'requirements'
  | 'design_arch'
  | 'finance'
  | 'market_intel'
  | 'crm_features'
  | 'vip_concierge'
  | 'design_security'
  | 'seo'
  | 'srs_testing'
  | 'devops_release'
  | 'tech_devops';

export interface BusinessDocItem {
  id: string;
  code: string;
  title: string;
  category: ZoeBusinessDocCategory;
  departmentFloor: string;
  primaryAssistant: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  subItems: DocSubItem[];
  htmlContent: string;
}

export const ZOE_BUSINESS_CATEGORIES = [
  { id: 'all', label: 'All Business Docs', count: 17 },
  { id: 'progress', label: '🌟 00. Project Progress & Telemetry', count: 1 },
  { id: 'corporate', label: '🏛️ 01. Corporate & Identity', count: 1 },
  { id: 'departments', label: '🏢 01. 12 Departments Matrix', count: 1 },
  { id: 'licensing', label: '📜 03. RERA & Trade Licensing', count: 1 },
  { id: 'leasing', label: '📑 02. Ejari & Tenancy Playbook', count: 1 },
  { id: 'finance', label: '💰 07. 42 Expenses & 5% VAT', count: 1 },
  { id: 'design_security', label: '🛡️ 10. Design & PDPL Security', count: 1 },
  { id: 'workflows', label: '🔄 04. Deal Lifecycles & SOPs', count: 1 },
  { id: 'crm_features', label: '⚡ 09. CRM & 22-Role RBAC', count: 1 },
  { id: 'vip_concierge', label: '👑 09. UHNW Vault & VIP', count: 1 },
  { id: 'services', label: '🌟 02. Agency Services & SLAs', count: 1 },
  { id: 'design_arch', label: '📐 06. Architecture & Data Schema', count: 1 },
  { id: 'requirements', label: '📋 05. Functional Rules & Risks', count: 1 },
  { id: 'market_intel', label: '📊 08. Market Trends & Portals', count: 1 },
  { id: 'ai_command', label: '🤖 03. AI 44-Assistant Mesh', count: 1 },
  { id: 'seo', label: '🎯 11. SEO & Syndication', count: 1 },
  { id: 'srs_testing', label: '🧪 12/13. SRS & QA Test Plan', count: 1 },
  { id: 'devops_release', label: '🚀 14/15. DevOps & Release', count: 1 },
] as const;

export const ZOE_BUSINESS_DOCS: BusinessDocItem[] = [
  // -------------------------------------------------------------
  // DOC-BUS-00: PROJECT_PROGRESS
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-00',
    code: 'DOC-BUS-00',
    title: 'Project Progress Tracker, Wave Velocity & Autopilot Telemetry',
    category: 'progress',
    departmentFloor: 'Floor 13 — Executive Flight Deck & Architecture Suite',
    primaryAssistant: '3.4 Zoe AI & 3.43 Ada Chief Architect',
    lastUpdated: '2026-08-26',
    summary: 'Real-time project execution telemetry, Waves 1–68 completion status, test suite health metrics (100% green), 0 scanner target issues, and Turn-by-Turn RUP milestones.',
    tags: ['Project Progress', 'Waves 1–68', 'Autopilot Telemetry', 'AEGIS V3', 'Turn 88'],
    subItems: [
      { id: 'sec-prog-1', title: '1. Executive KPI Summary & Global Health', description: 'Wave completion, test suite pass rate, and scanner status.' },
      { id: 'sec-prog-2', title: '2. 12 Corporate Departments Operating Matrix', description: 'Floor 1–13 SLA assignments and assistant mesh.' },
      { id: 'sec-prog-3', title: '3. Turn-by-Turn Autopilot Milestones (Turns 82–88)', description: 'Detailed log of continuous automated engineering passes.' },
      { id: 'sec-prog-4', title: '4. Full Test Matrix & Build Verification Gates', description: 'Vitest, strict TypeScript compiler, and production bundle health.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">AEGIS 3.0 SOVEREIGN ARCHITECTURE · EXECUTIVE TELEMETRY · LIVE PROGRESS</div>
  <h1 class="doc-title">🌟 White Caves Project Progress & Engineering Telemetry</h1>
  <p class="doc-lead">
    Complete real-time platform development report governing all 68 Waves, 44 AI Persona Assistants, 12 Corporate Floors, and zero-defect automated testing gates.
  </p>

  <h2 class="doc-section-heading" id="sec-prog-1">1. Executive KPI Summary & Global Health</h2>
  <div class="doc-card-grid">
    <div class="doc-card">
      <div class="doc-card-label">Global Wave Progress</div>
      <div class="doc-card-value" style="color: #60A5FA;">100%</div>
      <div class="doc-card-sub">Waves 1 to 68 Complete</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Test Suite Pass Rate</div>
      <div class="doc-card-value" style="color: #10B981;">100%</div>
      <div class="doc-card-sub">81/81 Test Files Passing</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Critical Scanner Issues</div>
      <div class="doc-card-value" style="color: #EF4444;">0</div>
      <div class="doc-card-sub">Clean Autopilot Scanner Gate</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">AI Persona Mesh</div>
      <div class="doc-card-value" style="color: #8B5CF6;">44</div>
      <div class="doc-card-sub">3.1 Nadia to 3.44 AEGIS</div>
    </div>
  </div>

  <h2 class="doc-section-heading" id="sec-prog-2">2. 12 Corporate Departments Operating Matrix</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Floor</th>
          <th>Department</th>
          <th>Lead Executive</th>
          <th>Primary AI Assistant</th>
          <th>Turnaround SLA</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Floor 13</strong></td><td>Executive Governance</td><td>Arslan Malik (MD)</td><td>3.4 Zoe AI & 3.43 Ada</td><td>Immediate</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 12</strong></td><td>Strategic Planning & RUP</td><td>Margaret Lead</td><td>3.42 Margaret AI</td><td>&lt; 30 Mins</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 11</strong></td><td>Autopilot Systems & DevOps</td><td>Gwynne Lead</td><td>3.44 AEGIS Autopilot</td><td>&lt; 5 Mins</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 10</strong></td><td>Architecture & Standards</td><td>Ada Lovelace</td><td>3.43 Ada Chief Arch</td><td>&lt; 15 Mins</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 09</strong></td><td>Legal & Compliance</td><td>Sofia / Laila</td><td>3.15 Laila Compliance</td><td>&lt; 1 Hour</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 08</strong></td><td>Finance & CFO Treasury</td><td>Theodora CFO</td><td>3.14 Theodora CFO</td><td>&lt; 2 Hours</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 07</strong></td><td>Marketing & Portals</td><td>Olivia Lead</td><td>3.2 Olivia Marketing</td><td>&lt; 15 Mins</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 06</strong></td><td>WhatsApp Communications</td><td>Nadia / Nina</td><td>3.1 Nadia & 3.5 Nina</td><td>&lt; 2 Mins</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 05</strong></td><td>Luxury Sales & Brokerage</td><td>Sophia Lead</td><td>3.3 Sophia Sales</td><td>&lt; 30 Mins</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 04</strong></td><td>Leasing & Ejari</td><td>Victoria Lead</td><td><a class="doc-link" href="#assistant-3.19">3.19 Henry AI</a></td><td>&lt; 1 Hour</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 03</strong></td><td>Market Intelligence</td><td>Elena CRO</td><td>3.16 Cipher Market</td><td>&lt; 4 Hours</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
        <tr><td><strong>Floor 02</strong></td><td>Conveyancing & Trustee</td><td>Evangeline Lead</td><td>3.17 Evangeline Legal</td><td>&lt; 2 Hours</td><td><span style="color: #10B981; font-weight: 800;">✓ Active</span></td></tr>
      </tbody>
    </table>
  </div>

  <h2 class="doc-section-heading" id="sec-prog-3">3. Autonomous Autopilot Milestones (Turns 82–88)</h2>
  <div class="step-flow">
    <div class="step-box">
      <div class="step-num">Turn 88</div>
      <div class="step-title">Chart of Accounts & Expense Sub-Items</div>
      <div class="step-desc">Standardized 5 core accounting classes, dynamic category pills in Theodora CRM, and synchronized master schema.</div>
    </div>
    <div class="step-arrow">↓</div>
    <div class="step-box">
      <div class="step-num">Turn 87</div>
      <div class="step-title">Structural Rearrangement & 16-Module Zoe Hub</div>
      <div class="step-desc">Upgraded Zoe AI Docs to 16 Hyperlinked HTML modules, shredded duplicate legacy folders, verified build gate.</div>
    </div>
    <div class="step-arrow">↓</div>
    <div class="step-box">
      <div class="step-num">Turns 82–86</div>
      <div class="step-title">5-Turn Scanner Elimination Sprint</div>
      <div class="step-desc">Reduced critical target issues from 56 down to 0, created atomic test suites across all property, security, and PWA components.</div>
    </div>
  </div>

  <h2 class="doc-section-heading" id="sec-prog-4">4. Full Test Matrix & Build Verification Gates</h2>
  <div class="alert-box alert-success">
    <strong>Production Verification Gate:</strong> Strict TypeScript Compiler passed with 0 errors (<code>npm run typecheck</code>), Vite production bundle generated with PWA service worker in 51.90s (<code>npm run build</code>), and Planning Governance verified with 0 drift (<code>npm run plans:validate</code>).
  </div>
</div>
`
  },
  // -------------------------------------------------------------
  // DOC-BUS-01: 01_company_structure
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-01',
    code: 'DOC-BUS-01',
    title: 'Corporate Identity, Sovereign Profile & Legal Coordinates',
    category: 'corporate',
    departmentFloor: 'Floor 13 — Managing Director Suite',
    primaryAssistant: '3.4 Zoe AI (Executive Intelligence)',
    lastUpdated: '2026-08-26',
    summary: 'Master corporate profile, brand palette, official coordinates, legal ownership, and executive leadership structure.',
    tags: ['Corporate Profile', 'DET 1388443', 'RERA 44483', 'Arslan Malik', 'Floor 13'],
    subItems: [
      { id: 'sec-1-1', title: '1. Official Entity Coordinates', description: 'DET, RERA, Ejari, and MOL registration numbers.' },
      { id: 'sec-1-2', title: '2. Executive Leadership & Governance', description: 'Managing Director authorities and corporate powers.' },
      { id: 'sec-1-3', title: '3. Brand Identity & Visual Standard', description: 'RGB/HEX tokens, typography, and hyper-linked HTML rules.' },
      { id: 'sec-1-4', title: '4. Stakeholder & Investor Registry', description: 'Shareholders, banking partners, and institutional stakeholders.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">OFFICIAL CORPORATE DOCUMENTATION · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 01</div>
  <h1 class="doc-title">🏛️ Corporate Identity, Sovereign Profile & Legal Coordinates</h1>
  <p class="doc-lead">
    White Caves Real Estate LLC is an ultra-prime Dubai luxury real estate brokerage established under the statutory authority of Dubai Department of Economy and Tourism (DET) and the Real Estate Regulatory Agency (RERA).
  </p>

  <div class="doc-card-grid" id="sec-1-1">
    <div class="doc-card">
      <div class="doc-card-label">Commercial License (DET)</div>
      <div class="doc-card-value">1388443</div>
      <div class="doc-card-sub">Dubai Economy & Tourism Registered</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">RERA Brokerage ORN</div>
      <div class="doc-card-value">44483</div>
      <div class="doc-card-sub">Classification: General Brokerage</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Office Ejari Number</div>
      <div class="doc-card-value">0120250814005322</div>
      <div class="doc-card-sub">Office D-72, El Shaye - 4 Building</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Establishment Card (MOL / ICP)</div>
      <div class="doc-card-value">2/1/1192499</div>
      <div class="doc-card-sub">Federal Immigration & Labor Approved</div>
    </div>
  </div>

  <h2 class="doc-section-heading" id="sec-1-2">1. Executive Leadership & Authority</h2>
  <p class="doc-body">
    The brokerage is managed by <strong>Managing Director Arslan Malik Bashir Ahmad</strong>, holding absolute signing authority under Commercial Power of Attorney and RERA Certified Broker Credentials. All primary corporate agreements, escrow authorizations, employment sponsorship visas, and legal attestation certificates operate through the executive office on Floor 13 with support from <a class="doc-link" href="#assistant-3.19">3.19 Henry AI</a>.
  </p>

  <h2 class="doc-section-heading" id="sec-1-3">2. Brand Identity & Visual Guidelines</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Color Token</th>
          <th>Hex Value</th>
          <th>RGB Specification</th>
          <th>Application Area</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>White Caves Red</strong></td>
          <td><code>#EF4444</code></td>
          <td>rgb(239, 68, 68)</td>
          <td>Primary brand badges, accent buttons, critical alerts, sovereign borders</td>
        </tr>
        <tr>
          <td><strong>Brilliant White</strong></td>
          <td><code>#FFFFFF</code></td>
          <td>rgb(255, 255, 255)</td>
          <td>High-contrast typography, hero titles, card backgrounds in light theme</td>
        </tr>
        <tr>
          <td><strong>Deep Slate Gray</strong></td>
          <td><code>#1E293B</code></td>
          <td>rgb(30, 41, 59)</td>
          <td>Executive dark backdrops, table row striping, card surfaces</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="doc-section-heading" id="sec-1-4">3. Stakeholder & Institutional Banking Registry</h2>
  <p class="doc-body">
    White Caves maintains commercial banking relationships with Emirates NBD and Dubai Islamic Bank for client escrow and operating accounts, fully compliant with UAE Central Bank and RERA Trust Account Law No. 8 of 2007.
  </p>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-02: 01_company_structure (Departments & Floor Matrix)
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-02',
    code: 'DOC-BUS-02',
    title: '12 Corporate Departments, Floor Operating Matrices & SLAs',
    category: 'departments',
    departmentFloor: 'All Floors (1 to 13)',
    primaryAssistant: '3.4 Zoe AI (Chief Operations Officer)',
    lastUpdated: '2026-08-26',
    summary: 'Comprehensive structure of all 12 operational corporate departments, floor assignments, team sizes, and turnaround SLAs.',
    tags: ['Departments', 'Org Chart', 'Floor Matrix', 'SLA', 'Executive Council'],
    subItems: [
      { id: 'sec-2-1', title: '1. Executive Council & Governance (Floor 13)', description: 'MD Office, Chief Architect Ada, and COO Zoe.' },
      { id: 'sec-2-2', title: '2. Commercial Operations (Floors 6–12)', description: 'Sales, Leasing, VIP Concierge, Finance & Legal Compliance.' },
      { id: 'sec-2-3', title: '3. Technology & Engineering (Floors 1–5)', description: 'Frontend, Backend, Database, Security QA, and DevOps.' },
      { id: 'sec-2-4', title: '4. Department SLA & Escalation Protocol', description: 'P0/P1/P2 turnaround SLAs and handoff contracts.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">ORGANIZATIONAL ARCHITECTURE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 01</div>
  <h1 class="doc-title">🏢 12 Corporate Departments & Floor Operating Matrix</h1>
  <p class="doc-lead">
    The White Caves operational model is divided into 12 specialized departments across 13 dedicated building floors, coordinating between executive leadership, commercial advisory, and autonomous AI agents.
  </p>

  <h2 class="doc-section-heading" id="sec-2-1">1. Department Master Roster</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Department Name</th>
          <th>Floor</th>
          <th>Lead / Persona</th>
          <th>Core Operating Scope</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>01</strong></td><td>Executive Council & MD Office</td><td>Floor 13</td><td>@Ada (Arch) & @Zoe (COO)</td><td>Strategic vision, sovereign approvals, legal P&L governance.</td></tr>
        <tr><td><strong>02</strong></td><td>Research & Intelligence Division</td><td>Floor 12</td><td>@Elena (CRO) & @Iris</td><td>Market trends, DLD transaction analytics, preflight briefs.</td></tr>
        <tr><td><strong>03</strong></td><td>Sales & Secondary Transactions</td><td>Floor 11</td><td>@Jaime & @Sophia</td><td>Off-plan launches, Form F resale transactions, client negotiation.</td></tr>
        <tr><td><strong>04</strong></td><td>Leasing & Property Management</td><td>Floor 10</td><td>@Victoria & @Daisy</td><td>Ejari attestation, tenant onboarding, landlord portal, PDC vault.</td></tr>
        <tr><td><strong>05</strong></td><td>Legal, Compliance & RERA Governance</td><td>Floor 09</td><td>@Sofia & @Evangeline</td><td>AML/KYC screening, Trakheesi permits, Form 12 notices, PDPL.</td></tr>
        <tr><td><strong>06</strong></td><td>Finance, VAT & Escrow Accounting</td><td>Floor 08</td><td>@Theodora (CFO) & @Invoice</td><td>FTA 5% VAT filings, 42-expense catalog, escrow milestone disbursement.</td></tr>
        <tr><td><strong>07</strong></td><td>VIP & Ultra-High-Net-Worth Concierge</td><td>Floor 07</td><td>@Linda & @Kairos</td><td>Private off-market vault, Rolls-Royce/Yacht viewings, Level 5 NDAs.</td></tr>
        <tr><td><strong>08</strong></td><td>Marketing, PR & WhatsApp Automation</td><td>Floor 06</td><td>@Nadia & @Nina</td><td>Omnichannel ad campaigns, WhatsApp AI concierge, SEO optimization.</td></tr>
        <tr><td><strong>09</strong></td><td>AI Agents & System Integrations</td><td>Floor 05</td><td>@Aurora & @Joelle</td><td>Machine learning personas, document OCR pipelines, webhook bridges.</td></tr>
        <tr><td><strong>10</strong></td><td>Frontend UI/UX & Design System</td><td>Floor 04</td><td>@Una & @Hazel</td><td>React/Vite interfaces, luxury animations, mobile CRM touch suite.</td></tr>
        <tr><td><strong>11</strong></td><td>Database Architecture & Data Pipelines</td><td>Floor 03</td><td>@Barbara & @Willow</td><td>Prisma ORM, PostgreSQL clusters, Redis caching, telemetry.</td></tr>
        <tr><td><strong>12</strong></td><td>DevOps, Cloud & Cyber Security</td><td>Floor 02</td><td>@Gwynne & @Katherine</td><td>CI/CD pipelines, penetration testing, SQA release certifications.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 class="doc-section-heading" id="sec-2-4">2. SLA Standards & Escalation Tiers</h2>
  <p class="doc-body">
    All client inquiries, contract requests, and compliance flags operate under strict Service Level Agreements (SLAs):
  </p>
  <ul>
    <li><strong>P0 (Critical / VIP Inquiry):</strong> 5-Minute response SLA enforced by Nadia WhatsApp Gateway and Floor 7 Concierge.</li>
    <li><strong>P1 (Form A/B Contract Generation):</strong> 15-Minute generation SLA via Henry Document OCR Hub.</li>
    <li><strong>P2 (Routine Maintenance & Ejari Attestation):</strong> 2-Hour turnaround SLA managed by Daisy Leasing Suite.</li>
  </ul>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-03: 03_regulatory_compliance_legal & 05_requirements
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-03',
    code: 'DOC-BUS-03',
    title: 'Trade Licensing, RERA Classification, Unified Forms & Trakheesi',
    category: 'licensing',
    departmentFloor: 'Floor 09 — Legal & Compliance Suite',
    primaryAssistant: '3.4 Zoe AI & 3.15 Laila Compliance',
    lastUpdated: '2026-08-26',
    summary: 'Statutory requirements for Dubai DET licensing, RERA broker accreditation, Form A/B/I contract drafting, and DLD e-signatures.',
    tags: ['Trade License', 'RERA Form A', 'Form B', 'Form I', 'DLD Trakheesi'],
    subItems: [
      { id: 'sec-3-1', title: '1. DET Commercial License 1388443', description: 'License activities, permitted business lines, and validity.' },
      { id: 'sec-3-2', title: '2. RERA Broker Accreditation (ORN 44483)', description: 'Broker license categories and broker card mandates.' },
      { id: 'sec-3-3', title: '3. Mandatory RERA Form Protocols', description: 'Form A (Seller), Form B (Buyer), Form I (Agent Split), Form F (MOU).' },
      { id: 'sec-3-4', title: '4. Trakheesi Permit Advertising Rules', description: 'QR code verification and statutory penalties.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">REGULATORY PLAYBOOK · DUBAI LAND DEPARTMENT (DLD) & RERA · DOCS FOLDER 03</div>
  <h1 class="doc-title">📜 Trade Licensing, RERA Classification & Form Protocols</h1>
  <p class="doc-lead">
    Under Dubai Real Estate Law No. 85 of 2006, all real estate brokerage operations in the Emirate of Dubai must comply with strict RERA registration, licensing, and standardized contracting standards.
  </p>

  <h2 class="doc-section-heading" id="sec-3-1">1. Commercial License & Scope (DET 1388443)</h2>
  <p class="doc-body">
    White Caves Real Estate LLC is authorized for <strong>Real Estate Buying & Selling Brokerage (Activity Code: 7010.01)</strong> and <strong>Leasing Property Brokerage (Activity Code: 7020.01)</strong> across residential, commercial, and industrial property assets throughout the Emirate of Dubai.
  </p>

  <h2 class="doc-section-heading" id="sec-3-3">2. Standardized RERA Unified Forms</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Form Code</th>
          <th>Official Form Name</th>
          <th>Contracting Parties</th>
          <th>Statutory Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Form A</strong></td><td>Seller’s Agency Agreement</td><td>Property Owner ↔ White Caves Real Estate</td><td>Grants marketing mandate, specifies listing price, commission %, and Trakheesi permit rights.</td></tr>
        <tr><td><strong>Form B</strong></td><td>Buyer’s Agency Agreement</td><td>Prospective Buyer ↔ White Caves Real Estate</td><td>Authorizes White Caves to represent buyer, conduct property search, and negotiate acquisitions.</td></tr>
        <tr><td><strong>Form I</strong></td><td>Agent-to-Agent Agreement</td><td>White Caves ↔ External Licensed Broker</td><td>Establishes legally binding commission split percentage for co-brokered sales transactions.</td></tr>
        <tr><td><strong>Form F (Unified MOU)</strong></td><td>Sales & Purchase Contract</td><td>Buyer ↔ Seller ↔ Broker(s)</td><td>Primary legal sale agreement outlining purchase price, 10% deposit cheque, and transfer date.</td></tr>
      </tbody>
    </table>
  </div>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-04: 02_leasing_property_management & 09_crm_features
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-04',
    code: 'DOC-BUS-04',
    title: 'Ejari Tenancy Lifecycle, PDC Vault & Bounced Cheque Protocol',
    category: 'leasing',
    departmentFloor: 'Floor 10 — Leasing & Tenancy Suite',
    primaryAssistant: '3.4 Zoe AI & 3.13 Daisy Leasing',
    lastUpdated: '2026-08-26',
    summary: 'Standard operating procedures for Ejari tenancy registration, RERA rent calculator, PDC vaulting, and bounced cheque legal notice execution.',
    tags: ['Ejari', 'Tenancy Contract', 'PDC Vault', 'Bounced Cheque', 'Form 12'],
    subItems: [
      { id: 'sec-4-1', title: '1. Standard Unified Tenancy Contract', description: 'Dubai Rental Law No. 26 of 2007 (as amended by Law 33 of 2008).' },
      { id: 'sec-4-2', title: '2. Post-Dated Cheque (PDC) Vault Operations', description: 'Physical cheque custody, date triggers, and clearance logging.' },
      { id: 'sec-4-3', title: '3. Bounced Cheque Legal Protocol', description: 'Civil execution via Dubai Courts and statutory demand letters.' },
      { id: 'sec-4-4', title: '4. Legal Notice & Eviction Playbook (Form 12)', description: '12-month notarized notice requirements under statutory conditions.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">LEASING & TENANCY PLAYBOOK · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 02 & 09</div>
  <h1 class="doc-title">📑 Ejari Tenancy Lifecycle, PDC Vault & Bounced Cheque Protocol</h1>
  <p class="doc-lead">
    Governed by Dubai Law No. 26 of 2007 and Law No. 33 of 2008, this standard operating procedure governs the entire residential and commercial tenancy lifecycle from initial contract signing to final security deposit handover.
  </p>

  <h2 class="doc-section-heading" id="sec-4-1">1. Tenancy Contract & Ejari Registration</h2>
  <p class="doc-body">
    All leases must be executed using the official DLD Unified Tenancy Contract format and registered in the <strong>Ejari System</strong> within 48 hours of execution. Minimum documentation required:
  </p>
  <ul>
    <li>Original signed Unified Tenancy Contract (Landlord & Tenant).</li>
    <li>Tenant Passport, Residence Visa, and valid Emirates ID copies.</li>
    <li>Landlord Title Deed copy (issued by DLD).</li>
    <li>DEWA Premise Number (9-digit barcode) and previous final clearance bill.</li>
  </ul>

  <h2 class="doc-section-heading" id="sec-4-2">2. Post-Dated Cheque (PDC) Vault & Security</h2>
  <p class="doc-body">
    Rental payments in Dubai are traditionally paid via 1, 2, 4, or 6 post-dated bank cheques (PDCs). The White Caves PDC Vault enforces double-entry verification with automated 7-day pre-deposit alerts.
  </p>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-05: 07_business_model
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-05',
    code: 'DOC-BUS-05',
    title: 'Chart of Accounts, 5 Expense Categories & 5% FTA VAT Model',
    category: 'finance',
    departmentFloor: 'Floor 08 — Finance & CFO Suite',
    primaryAssistant: '3.4 Zoe AI & 3.14 Theodora CFO',
    lastUpdated: '2026-08-26',
    summary: 'Master Chart of Accounts across 5 core categories (COGS, Operating Expenses, Current Liabilities, Fixed Assets, Current Assets) with all 37+ classified sub-items, UAE FTA 5% VAT rules, and 3-Year Pro-Forma revenue model.',
    tags: ['Chart of Accounts', 'Expense Categories', 'Payroll Sub-Items', 'FTA VAT 5%', 'Theodora CFO'],
    subItems: [
      { id: 'sec-5-1', title: '1. Standardized Chart of Accounts (5 Master Classes)', description: 'COGS, Operating Expenses, Current Liabilities, Fixed Assets, Current Assets.' },
      { id: 'sec-5-2', title: '2. Itemized Sub-Items & General Ledger Mapping', description: 'All 37+ sub-items with ledger codes, UAE VAT rate, and CT deductibility.' },
      { id: 'sec-5-3', title: '3. UAE Federal Tax Authority (FTA) 5% VAT Rules', description: 'Tax Registration Number (TRN), input VAT, and quarterly filing.' },
      { id: 'sec-5-4', title: '4. 3-Year Pro-Forma Revenue Model (AED 39M–100M)', description: 'Conservative, Base, and Aggressive scenario financial projections.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">FINANCIAL INTELLIGENCE · THEODORA AI CFO & AUDIT SUITE · DOCS FOLDER 07</div>
  <h1 class="doc-title">💰 Chart of Accounts, Expense Sub-Items & 5% FTA VAT Model</h1>
  <p class="doc-lead">
    Comprehensive financial architecture governing operational expenditures, balance sheet liabilities, payroll allocations, statutory UAE Value Added Tax (VAT), and 3-year commercial revenue projections.
  </p>

  <h2 class="doc-section-heading" id="sec-5-1">1. Master 5-Category Chart of Accounts</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Category Code</th>
          <th>Account Class</th>
          <th>Sub-Item Scope</th>
          <th>Primary Accounting Function</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>CAT-01</strong></td><td><strong>Cost Of Goods Sold (COGS)</strong></td><td>Direct Property Fulfillment (5000)</td><td>Direct listing fulfillment, developer allocation outlays, and deal production costs.</td></tr>
        <tr><td><strong>CAT-02</strong></td><td><strong>Operating Expenses (OPEX)</strong></td><td>24 Classified Expense Accounts (5010–5240)</td><td>Marketing, Payroll-009 air travel, rent, utilities, IT, maintenance, vehicle expenses, wages.</td></tr>
        <tr><td><strong>CAT-03</strong></td><td><strong>Other Current Liability</strong></td><td>8 Payroll & Tax Payables (2010–2080)</td><td>Payroll deductions, net salaries payable, GCC VAT payable, reimbursements payable.</td></tr>
        <tr><td><strong>CAT-04</strong></td><td><strong>Fixed Asset</strong></td><td>Furniture & Capital Hardware (1510)</td><td>Executive desks, workstations, smart meeting displays, showroom infrastructure.</td></tr>
        <tr><td><strong>CAT-05</strong></td><td><strong>Other Current Asset</strong></td><td>Prepaids, Taxes & Cash (1010–1130)</td><td>Advance tax, employee advances, prepaid lease expenses, client cash receipts.</td></tr>
      </tbody>
    </table>
  </div>

  <h2 class="doc-section-heading" id="sec-5-2">2. Itemized Sub-Items & General Ledger Mapping</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Sub-Item Name</th>
          <th>Category / Class</th>
          <th>Ledger Code</th>
          <th>UAE VAT Rate</th>
          <th>Corporate Tax Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Cost of Goods Sold</strong></td><td>Cost Of Goods Sold</td><td>5000</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Advertising And Marketing</strong></td><td>Expense (OPEX)</td><td>5010</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>[ Payroll-009 ] Air Travel Allowance Expense</strong></td><td>Expense (OPEX)</td><td>5020</td><td>0.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Automobile Expense</strong></td><td>Expense (OPEX)</td><td>5030</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Bad Debt</strong></td><td>Expense (OPEX)</td><td>5040</td><td>0.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Bank Fees and Charges</strong></td><td>Expense (OPEX)</td><td>5050</td><td>0.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Consultant Expense</strong></td><td>Expense (OPEX)</td><td>5060</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Credit Card Charges</strong></td><td>Expense (OPEX)</td><td>5070</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Depreciation Expense</strong></td><td>Expense (OPEX)</td><td>5080</td><td>0.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Fuel/Mileage Expenses</strong></td><td>Expense (OPEX)</td><td>5090</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>IT and Internet Expenses</strong></td><td>Expense (OPEX)</td><td>5100</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Janitorial Expense</strong></td><td>Expense (OPEX)</td><td>5110</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Lodging</strong></td><td>Expense (OPEX)</td><td>5120</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Meals and Entertainment</strong></td><td>Expense (OPEX)</td><td>5130</td><td>5.0%</td><td>✓ 50% CT Deductible (FTA Art. 32)</td></tr>
        <tr><td><strong>Office Supplies</strong></td><td>Expense (OPEX)</td><td>5140</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Other Expenses</strong></td><td>Expense (OPEX)</td><td>5150</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Parking</strong></td><td>Expense (OPEX)</td><td>5160</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Postage</strong></td><td>Expense (OPEX)</td><td>5170</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Printing and Stationery</strong></td><td>Expense (OPEX)</td><td>5180</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Purchase Discounts</strong></td><td>Expense (OPEX)</td><td>5190</td><td>0.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Rent Expense</strong></td><td>Expense (OPEX)</td><td>5200</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Repairs and Maintenance</strong></td><td>Expense (OPEX)</td><td>5210</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Salaries and Employee Wages</strong></td><td>Expense (OPEX)</td><td>5220</td><td>0.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Telephone Expense</strong></td><td>Expense (OPEX)</td><td>5230</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>Travel Expense</strong></td><td>Expense (OPEX)</td><td>5240</td><td>5.0%</td><td>✓ 100% CT Deductible</td></tr>
        <tr><td><strong>[ Payroll-003 ] Deductions Payable</strong></td><td>Other Current Liability</td><td>2010</td><td>0.0%</td><td>Balance Sheet Liability</td></tr>
        <tr><td><strong>Employee Reimbursements</strong></td><td>Other Current Liability</td><td>2020</td><td>0.0%</td><td>Balance Sheet Liability</td></tr>
        <tr><td><strong>Excise Tax Payable</strong></td><td>Other Current Liability</td><td>2030</td><td>0.0%</td><td>Balance Sheet Liability</td></tr>
        <tr><td><strong>GCC VAT Payable</strong></td><td>Other Current Liability</td><td>2040</td><td>0.0%</td><td>Balance Sheet Liability</td></tr>
        <tr><td><strong>[ Payroll-005 ] Hold Salary Payable</strong></td><td>Other Current Liability</td><td>2050</td><td>0.0%</td><td>Balance Sheet Liability</td></tr>
        <tr><td><strong>[ Payroll-004 ] Net Salary Payable</strong></td><td>Other Current Liability</td><td>2060</td><td>0.0%</td><td>Balance Sheet Liability</td></tr>
        <tr><td><strong>[ Payroll-001 ] Reimbursements Payable</strong></td><td>Other Current Liability</td><td>2070</td><td>0.0%</td><td>Balance Sheet Liability</td></tr>
        <tr><td><strong>[ Payroll-002 ] Statutory Deductions Payable</strong></td><td>Other Current Liability</td><td>2080</td><td>0.0%</td><td>Balance Sheet Liability</td></tr>
        <tr><td><strong>Furniture and Equipment</strong></td><td>Fixed Asset</td><td>1510</td><td>5.0%</td><td>Capital Asset (Depreciable)</td></tr>
        <tr><td><strong>Advance Tax</strong></td><td>Other Current Asset</td><td>1110</td><td>0.0%</td><td>Current Asset (Prepaid)</td></tr>
        <tr><td><strong>Employee Advance</strong></td><td>Other Current Asset</td><td>1120</td><td>0.0%</td><td>Current Asset (Receivable)</td></tr>
        <tr><td><strong>Prepaid Expenses</strong></td><td>Other Current Asset</td><td>1130</td><td>0.0%</td><td>Current Asset (Prepaid)</td></tr>
        <tr><td><strong>Sales to Customers (Cash)</strong></td><td>Other Current Asset</td><td>1010</td><td>0.0%</td><td>Current Asset (Liquid Cash)</td></tr>
      </tbody>
    </table>
  </div>

  <div class="alert-box alert-success" style="margin-top: 1rem;">
    <strong>UAE Federal Tax Authority (FTA) Compliance:</strong> All standard expenses marked with 5.0% VAT generate recoverable input tax credits against output VAT collected on real estate brokerage commissions (GCC VAT Payable - 2040).
  </div>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-06: 10_design_system_and_security
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-06',
    code: 'DOC-BUS-06',
    title: 'Statutory AML/KYC Framework, UAE PDPL & Security Standard',
    category: 'design_security',
    departmentFloor: 'Floor 09 — Legal & Compliance Suite',
    primaryAssistant: '3.4 Zoe AI & 3.15 Laila Compliance',
    lastUpdated: '2026-08-26',
    summary: 'Anti-Money Laundering (AML) goAML reporting, KYC verification, UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021).',
    tags: ['AML/KYC', 'goAML', 'UAE PDPL', 'Data Protection', 'Compliance Audit'],
    subItems: [
      { id: 'sec-6-1', title: '1. UAE Federal AML/CFT Statutory Mandate', description: 'Cabinet Resolution No. (10) of 2019 and goAML portal submission triggers.' },
      { id: 'sec-6-2', title: '2. Ultimate Beneficial Owner (UBO) Identification', description: 'Resolution No. 58 of 2020 on UBO declaration and register maintenance.' },
      { id: 'sec-6-3', title: '3. UAE Personal Data Protection Law (PDPL)', description: 'Federal Decree-Law No. 45 of 2021 data subject rights and cross-border transfers.' },
      { id: 'sec-6-4', title: '4. Suspicious Activity Report (SAR) Escalation', description: 'Automated high-risk transaction detection and FIU reporting.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">STATUTORY COMPLIANCE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 10</div>
  <h1 class="doc-title">🛡️ Statutory AML/KYC Framework & UAE PDPL Standard</h1>
  <p class="doc-lead">
    Governed by UAE Federal Law No. (20) of 2018 on Anti-Money Laundering and Federal Decree-Law No. 45 of 2021 on Personal Data Protection.
  </p>

  <h2 class="doc-section-heading" id="sec-6-1">1. Anti-Money Laundering (AML) Compliance Tiers</h2>
  <div class="doc-card-grid">
    <div class="doc-card">
      <div class="doc-card-label">Cash Reporting Threshold</div>
      <div class="doc-card-value">AED 55,000+</div>
      <div class="doc-card-sub">Mandatory FIRS Reporting to UAE FIU</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">goAML System Registration</div>
      <div class="doc-card-value">Active & Linked</div>
      <div class="doc-card-sub">Supervised by Ministry of Economy</div>
    </div>
  </div>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-07: 04_workflows
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-07',
    code: 'DOC-BUS-07',
    title: 'Deal Lifecycles, Resale Form F, WhatsApp Bot & Inbound Playbooks',
    category: 'workflows',
    departmentFloor: 'Floor 06 / Floor 11 — Sales & Marketing Desk',
    primaryAssistant: '3.4 Zoe AI & 3.3 Sophia Sales',
    lastUpdated: '2026-08-26',
    summary: 'Detailed flowcharts and standard operating procedures for lead qualification, WhatsApp AI bot routing, Form F signing, and closing.',
    tags: ['Lead Pipeline', 'WhatsApp Flow', 'Form F Signing', 'Closing SOP', 'Agent Handoff'],
    subItems: [
      { id: 'sec-7-1', title: '1. Inbound WhatsApp Lead Qualification Flow', description: 'Nina AI bot intent capture, Clara deduplication, and agent assignment.' },
      { id: 'sec-7-2', title: '2. Secondary Resale Form F Contract Lifecycle', description: 'Seller Form A verification, Buyer Form B, MOU signing, and NOC.' },
      { id: 'sec-7-3', title: '3. Property Viewing & Chauffeur Coordination', description: 'Automated calendar booking, chauffeur dispatch, and digital feedback.' },
      { id: 'sec-7-4', title: '4. DLD Trustee Office Conveyancing & Handover', description: 'Final title deed transfer, manager cheques, and key handover.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">WORKFLOW PLAYBOOKS · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 04</div>
  <h1 class="doc-title">🔄 Deal Lifecycles, Resale Form F & Inbound Playbooks</h1>
  <p class="doc-lead">
    Step-by-step transaction flowcharts governing lead ingestion, automated AI qualification, property viewings, DLD Form F conveyance, and developer NOC clearance.
  </p>

  <h2 class="doc-section-heading" id="sec-7-1">1. Inbound Lead Ingestion & Qualification Pipeline</h2>
  <div class="step-flow">
    <div class="step-box">Lead Ingestion (WhatsApp / Portal)</div>
    <div class="step-arrow">➔ 30s ➔</div>
    <div class="step-box">Nina AI Intent & Cassie 100-Pt Score</div>
    <div class="step-arrow">➔ <5m ➔</div>
    <div class="step-box">Licensed Agent WhatsApp Desk</div>
  </div>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-08: 02_services & 02_services_and_infrastructure
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-08',
    code: 'DOC-BUS-08',
    title: 'Core Real Estate Services Catalog & Disaster Recovery Infrastructure',
    category: 'services',
    departmentFloor: 'Floor 02 / Floor 10 / Floor 11',
    primaryAssistant: '3.4 Zoe AI & Aurora CTO',
    lastUpdated: '2026-08-26',
    summary: '9 Core CRM and real estate brokerage services, Service Level Agreements (SLAs), and 99.9% Disaster Recovery Plan (RPO 1h / RTO 4h).',
    tags: ['Core Services', 'Disaster Recovery', 'RPO 1hr', 'RTO 4hr', 'Database Scaling', 'SLA'],
    subItems: [
      { id: 'sec-8-1', title: '1. 9 Core Brokerage Services Catalog', description: 'Primary sales, leasing, asset management, and VIP advisory offerings.' },
      { id: 'sec-8-2', title: '2. Disaster Recovery Strategy (RPO 1hr / RTO 4hr)', description: 'Backup schedule, automated failover, and data integrity protocols.' },
      { id: 'sec-8-3', title: '3. High-Performance Database Scaling Architecture', description: 'Read-replicas, connection pooling, sharding, and Redis caching.' },
      { id: 'sec-8-4', title: '4. Service Level Agreements (SLAs)', description: '99.9% platform availability guarantee and incident resolution matrix.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SERVICES & INFRASTRUCTURE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 02</div>
  <h1 class="doc-title">🌟 Core Real Estate Services Catalog & Disaster Recovery Plan</h1>
  <p class="doc-lead">
    Detailed service specifications for all 9 White Caves commercial offerings combined with enterprise infrastructure standards enforcing 99.9% uptime, 1-hour Recovery Point Objective (RPO), and 4-hour Recovery Time Objective (RTO).
  </p>

  <h2 class="doc-section-heading" id="sec-8-1">1. 9 Core Brokerage Services Catalog</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Service Code</th>
          <th>Service Name</th>
          <th>Target Market</th>
          <th>Fee Structure / Revenue Model</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>SRV-01</strong></td><td>Off-Plan Project Advisory</td><td>Global Investors & High-Net-Worth</td><td>4% – 7% Developer Commission + Escrow Safety Check</td></tr>
        <tr><td><strong>SRV-02</strong></td><td>Secondary Residential Resale</td><td>Dubai Homeowners & Buyers</td><td>2% Seller + 2% Buyer Brokerage Fee (RERA Unified Form F)</td></tr>
        <tr><td><strong>SRV-03</strong></td><td>Luxury Leasing & Ejari Attestation</td><td>Tenants & Landlords</td><td>5% Annual Rent Commission + AED 250 Ejari Registration</td></tr>
        <tr><td><strong>SRV-04</strong></td><td>Full-Service Property Management</td><td>Overseas & Institutional Landlords</td><td>8% – 10% Annual Rental Yield Management Fee</td></tr>
        <tr><td><strong>SRV-05</strong></td><td>UHNW Private Vault Acquisition</td><td>Ultra-High-Net-Worth (AED 20M+)</td><td>Bespoke Advisory Retainer + 2% Success Commission</td></tr>
      </tbody>
    </table>
  </div>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-09: 06_design_architecture
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-09',
    code: 'DOC-BUS-09',
    title: 'System Design Architecture, REST API Reference & Prisma Schema',
    category: 'design_arch',
    departmentFloor: 'Floor 03 / Floor 05 — Software Architecture Suite',
    primaryAssistant: '3.4 Zoe AI & 3.16 Aurora CTO',
    lastUpdated: '2026-08-26',
    summary: 'Microservices architecture, REST API contracts, 17 Prisma models with 90+ database indexes, and Data Dictionary standard.',
    tags: ['System Architecture', 'REST API Reference', 'Prisma Schema', 'Data Dictionary', 'PostgreSQL'],
    subItems: [
      { id: 'sec-9-1', title: '1. Microservices System Architecture', description: 'React 18 frontend, Express API gateway, Prisma ORM, and background workers.' },
      { id: 'sec-9-2', title: '2. REST API Reference & Contract Standard', description: 'Standardized JSON envelopes, error handling, and route endpoints.' },
      { id: 'sec-9-3', title: '3. Prisma Database Models (17 Master Entities)', description: 'Lead, Property, Transaction, Document, AuditLog, and Tenant models.' },
      { id: 'sec-9-4', title: '4. Enterprise Data Dictionary', description: 'Field definitions, validation constraints, and business meanings.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">SYSTEM ARCHITECTURE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 06</div>
  <h1 class="doc-title">📐 System Architecture, REST API Reference & Prisma Schema</h1>
  <p class="doc-lead">
    Complete architectural blue-print for the White Caves cloud platform, specifying API standards, database models, data flow pipelines, and UI/UX design token specifications.
  </p>

  <h2 class="doc-section-heading" id="sec-9-1">1. High-Level Technology Topology</h2>
  <div class="step-flow">
    <div class="step-box">React 18 / Vite / TypeScript Client</div>
    <div class="step-arrow">➔ JWT / HTTPS ➔</div>
    <div class="step-box">Express API Gateway + Zod Validation</div>
    <div class="step-arrow">➔ Prisma ORM ➔</div>
    <div class="step-box">PostgreSQL Cluster + Redis Cache</div>
  </div>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-10: 08_integrations_and_research
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-10',
    code: 'DOC-BUS-10',
    title: 'Dubai Real Estate Market Intelligence, Portals & Competitor Analysis',
    category: 'market_intel',
    departmentFloor: 'Floor 12 — Research & Intelligence Suite',
    primaryAssistant: '3.4 Zoe AI & 3.22 Cipher Market',
    lastUpdated: '2026-08-26',
    summary: 'Dubai macroeconomic trends, PropertyFinder/Bayut API integration research, and competitive intelligence benchmarking.',
    tags: ['Market Research', 'PropertyFinder API', 'Bayut API', 'Competitor Benchmark', 'DLD Open Data'],
    subItems: [
      { id: 'sec-10-1', title: '1. Dubai Real Estate Macro Trends 2026', description: 'AED 180B+ transaction volume, migration dynamics, and high-yield clusters.' },
      { id: 'sec-10-2', title: '2. Major Portal XML / REST Ingestion Specs', description: 'Property Finder Webhooks, Bayut Live Sync, and Dubizzle feeds.' },
      { id: 'sec-10-3', title: '3. Competitive Matrix & Strategic Moats', description: 'Comparison against traditional brokerages and PropTech platforms.' },
      { id: 'sec-10-4', title: '4. DLD Open Data Price Indices (Mo’asher)', description: 'Official transaction index synchronization and price heatmaps.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">MARKET RESEARCH & INTELLIGENCE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 08</div>
  <h1 class="doc-title">📊 Dubai Real Estate Market Intelligence & Portal APIs</h1>
  <p class="doc-lead">
    Comprehensive research into Dubai's luxury real estate macroeconomic climate, portal syndication protocols, and competitive landscape.
  </p>

  <h2 class="doc-section-heading" id="sec-10-1">1. Dubai Luxury Real Estate Catchment</h2>
  <div class="doc-card-grid">
    <div class="doc-card">
      <div class="doc-card-label">Primary Flagship Catchment</div>
      <div class="doc-card-value">DAMAC Hills 2</div>
      <div class="doc-card-sub">9,378+ Villa & Townhouse Portfolio</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Secondary Prime Corridors</div>
      <div class="doc-card-value">Palm & Downtown</div>
      <div class="doc-card-sub">Ultra-Luxury Penthouse & Villa Resale</div>
    </div>
  </div>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-11: 03_ai_assistants
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-11',
    code: 'DOC-BUS-11',
    title: 'AI Command Center Architecture & 44-Assistant Swarm Mesh',
    category: 'ai_command',
    departmentFloor: 'Floor 13 / Floor 05 — AI Operations Suite',
    primaryAssistant: '3.4 Zoe AI & 3.44 AEGIS AI',
    lastUpdated: '2026-08-26',
    summary: 'Complete operating architecture for all 44 AI assistants (3.1 Nadia to 3.44 AEGIS), task routing, intent detection, and multi-agent coordination.',
    tags: ['44 AI Personas', 'AI Mesh', 'Nadia', 'Zoe', 'Aurora', 'Margaret', 'Ada', 'AEGIS'],
    subItems: [
      { id: 'sec-11-1', title: '1. Canonical 44-Assistant Roster (3.1 to 3.44)', description: 'Complete table of all 44 AI assistants with roles and floor coordinates.' },
      { id: 'sec-11-2', title: '2. Executive Council Governance Mesh', description: 'Zoe, Aurora, Margaret, Ada, and AEGIS executive coordination.' },
      { id: 'sec-11-3', title: '3. Intent Detection & Routing Engine', description: 'Natural language classification and zero-latency subagent dispatch.' },
      { id: 'sec-11-4', title: '4. Graceful Fallback & Human Escalation Matrix', description: 'Rule-based fail-safe handling and licensed broker handover.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">AI SWARM INTELLIGENCE · WHITE CAVES REAL ESTATE LLC · DOCS FOLDER 03</div>
  <h1 class="doc-title">🤖 AI Command Center Architecture & 44-Assistant Mesh</h1>
  <p class="doc-lead">
    The White Caves AI Command Center coordinates 44 specialized artificial intelligence personas across all 12 corporate departments, executing automated deal processing, WhatsApp conversations, statutory compliance, and software engineering.
  </p>

  <h2 class="doc-section-heading" id="sec-11-1">1. Canonical AI Assistant Roster & Numbering (3.1 – 3.44)</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Assistant Identity</th>
          <th>Corporate Floor</th>
          <th>Specialization & Role</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>3.1</strong></td><td>Nadia AI</td><td>Floor 06 (Marketing)</td><td>WhatsApp CRM, Broadcast Campaigns & 15-min SLA</td></tr>
        <tr><td><strong>3.2</strong></td><td>Nina AI</td><td>Floor 06 (Marketing)</td><td>WhatsApp Bot Flow Designer & Intent Simulator</td></tr>
        <tr><td><strong>3.3</strong></td><td>Sophia AI</td><td>Floor 11 (Sales)</td><td>Sales Deals Kanban & Commission Split Engine</td></tr>
        <tr><td><strong>3.4</strong></td><td>Zoe AI</td><td>Floor 13 (Executive)</td><td>Executive Briefing Desk, Operations & Business Docs</td></tr>
        <tr><td><strong>3.5</strong></td><td>Evangeline AI</td><td>Floor 09 (Legal)</td><td>DLD Unified Form A/B/F & NDA Studio</td></tr>
        <tr><td><strong>3.6</strong></td><td>Cassie AI</td><td>Floor 11 (Sales)</td><td>100-Point Predictive Lead Scoring Engine</td></tr>
        <tr><td><strong>3.7</strong></td><td>Atlas AI</td><td>Floor 12 (Off-Plan)</td><td>Off-Plan Project Intelligence & Capital Gain Simulator</td></tr>
        <tr><td><strong>3.8</strong></td><td>Clara AI</td><td>Floor 11 (Sales)</td><td>Lead Ingestion Webhook & Deduplication Engine</td></tr>
        <tr><td><strong>3.9</strong></td><td>Mary AI</td><td>Floor 10 (Leasing)</td><td>Master 9,378+ Inventory Grid & Area Clustering</td></tr>
        <tr><td><strong>3.10</strong></td><td>Linda AI</td><td>Floor 07 (VIP)</td><td>Agent WhatsApp Session Desk & Media Vault</td></tr>
        <tr><td><strong>3.11</strong></td><td>Olivia AI</td><td>Floor 06 (Marketing)</td><td>Multi-Portal Syndication & CPL Ad Optimizer</td></tr>
        <tr><td><strong>3.12</strong></td><td>Nancy AI</td><td>Floor 01 (HR)</td><td>HR Broker Sales Podium & RERA Card Expiry Guard</td></tr>
        <tr><td><strong>3.13</strong></td><td>Daisy AI</td><td>Floor 10 (Leasing)</td><td>Lease Renewals, Ejari Handover & PDC Vault</td></tr>
        <tr><td><strong>3.14</strong></td><td>Theodora AI</td><td>Floor 08 (Finance)</td><td>Finance, VAT 5% Accounting & 67 Master Reports</td></tr>
        <tr><td><strong>3.15</strong></td><td>Laila AI</td><td>Floor 09 (Legal)</td><td>RERA Compliance, Trakheesi Verifier & AML Audit</td></tr>
        <tr><td><strong>3.16</strong></td><td>Aurora AI</td><td>Floor 05 (Tech)</td><td>CTO Infrastructure, APIs & Software Architecture Hub</td></tr>
        <tr><td><strong>3.17</strong></td><td>Hazel AI</td><td>Floor 04 (Design)</td><td>Frontend & UX 100-Point Design Token Guard</td></tr>
        <tr><td><strong>3.18</strong></td><td>Willow AI</td><td>Floor 03 (Backend)</td><td>Backend Microservices, JWT Auth & Queue Desk</td></tr>
        <tr><td><strong>3.19</strong></td><td>Henry AI</td><td>Floor 09 (Legal)</td><td>Document Studio, Emirates ID / Title Deed OCR</td></tr>
        <tr><td><strong>3.20</strong></td><td>Sentinel AI</td><td>Floor 10 (Leasing)</td><td>Property State Machine & Asset Quality Gate</td></tr>
        <tr><td><strong>3.21</strong></td><td>Hunter AI</td><td>Floor 11 (Sales)</td><td>Outbound Luxury Prospecting & VIP Lead Matcher</td></tr>
        <tr><td><strong>3.22</strong></td><td>Cipher AI</td><td>Floor 12 (Off-Plan)</td><td>DLD Transaction Regressor & Market Pricing CMA</td></tr>
        <tr><td><strong>3.23</strong></td><td>Vesta AI</td><td>Floor 10 (Leasing)</td><td>Digital Snagging Photo Inspector & Move-In Checklist</td></tr>
        <tr><td><strong>3.24</strong></td><td>Juno AI</td><td>Floor 10 (Leasing)</td><td>Community Facilities Booking & Ticket SLA Router</td></tr>
        <tr><td><strong>3.25</strong></td><td>Kairos AI</td><td>Floor 07 (VIP)</td><td>UAE Golden Visa Eligibility & Crypto FX Advisory</td></tr>
        <tr><td><strong>3.26</strong></td><td>Maven AI</td><td>Floor 12 (Off-Plan)</td><td>10-Year DCF ROI & Portfolio Rebalancing</td></tr>
        <tr><td><strong>3.27</strong></td><td>Prism AI</td><td>Floor 11 (Sales)</td><td>Vector Property Matching & Ranked Top Picks</td></tr>
        <tr><td><strong>3.28</strong></td><td>Sage AI</td><td>Floor 08 (Finance)</td><td>Mortgage Affordability & CBUAE EIBOR Simulator</td></tr>
        <tr><td><strong>3.29</strong></td><td>Echo AI</td><td>Floor 06 (Marketing)</td><td>Unified Omnichannel Client Timeline & Inactivity Alerts</td></tr>
        <tr><td><strong>3.30</strong></td><td>Mira AI</td><td>Floor 06 (Marketing)</td><td>Real-Time Arabic-English Translation & DLD RTL</td></tr>
        <tr><td><strong>3.31</strong></td><td>Rex AI</td><td>Floor 09 (Legal)</td><td>Blockchain Title Deed Verifier & Anti-Fraud Guard</td></tr>
        <tr><td><strong>3.32</strong></td><td>Iris AI</td><td>Floor 04 (Design)</td><td>Generative AI Virtual Staging & 3D Floorplans</td></tr>
        <tr><td><strong>3.33</strong></td><td>Apex AI</td><td>Floor 01 (HR)</td><td>Agent Performance Coach & Incentive Tiering</td></tr>
        <tr><td><strong>3.34</strong></td><td>Halo AI</td><td>Floor 07 (VIP)</td><td>Client Satisfaction & Post-Handover NPS Tracker</td></tr>
        <tr><td><strong>3.35</strong></td><td>Oracle AI</td><td>Floor 12 (Off-Plan)</td><td>Market Narrative Intelligence & DLD Spike Detector</td></tr>
        <tr><td><strong>3.36</strong></td><td>Flux AI</td><td>Floor 05 (Tech)</td><td>Real-Time DLD Open API Stream & Portal Ingestion</td></tr>
        <tr><td><strong>3.37</strong></td><td>Nova AI</td><td>Floor 12 (Off-Plan)</td><td>Developer Launch Intelligence & Pre-Launch Radar</td></tr>
        <tr><td><strong>3.38</strong></td><td>Quill AI</td><td>Floor 09 (Legal)</td><td>Automated Bilingual SPA & Tenancy Form Generator</td></tr>
        <tr><td><strong>3.39</strong></td><td>Lumen AI</td><td>Floor 08 (Finance)</td><td>Geospatial Heatmaps & Board Deck PPT Exporter</td></tr>
        <tr><td><strong>3.40</strong></td><td>Crest AI</td><td>Floor 12 (Off-Plan)</td><td>Automated Valuation Model (AVM) & DLD Comps</td></tr>
        <tr><td><strong>3.41</strong></td><td>Archer AI</td><td>Floor 11 (Sales)</td><td>Lead Scoring Engine & Agent Auto-Assignment Queue</td></tr>
        <tr><td><strong>3.42</strong></td><td>Margaret AI</td><td>Floor 13 (Executive)</td><td>Master Strategic Plans Hub, Wave Backlogs & Roadmaps</td></tr>
        <tr><td><strong>3.43</strong></td><td>Ada AI</td><td>Floor 13 (Executive)</td><td>Chief Architecture Hub, Zero-Token Gates & SDLC</td></tr>
        <tr><td><strong>3.44</strong></td><td>AEGIS AI</td><td>Floor 13 (Executive)</td><td>Autonomous Autopilot, Swarm Orchestration & Telemetry</td></tr>
      </tbody>
    </table>
  </div>
</div>
`
  },

  // -------------------------------------------------------------
  // DOC-BUS-12: 09_crm_features & 09_user_roles_permissions
  // -------------------------------------------------------------
  {
    id: 'doc-zoe-12',
    code: 'DOC-BUS-12',
    title: 'CRM Engine Specification, Advanced UI Modules & 22-Role RBAC',
    category: 'crm_features',
    departmentFloor: 'Floor 05 / Floor 09 — Product & Security Desk',
    primaryAssistant: '3.4 Zoe AI & 3.16 Aurora CTO',
    lastUpdated: '2026-08-26',
    summary: 'Complete technical specifications for Unified CRM, Landlord/Tenant Portals, Valuation Modules, and 22-Role Field-Level RBAC Matrix.',
    tags: ['Unified CRM', 'Landlord Portal', 'Tenant Portal', 'RBAC Matrix', 'Field Permissions'],
    subItems: [
      { id: 'sec-12-1', title: '1. Unified CRM Core Architecture', description: 'Modular widget architecture, tab routing, and real-time state sync.' },
      { id: 'sec-12-2', title: '2. Dedicated Landlord & Tenant Portals', description: 'KYC onboarding, lease document download, maintenance tickets, and rent payments.' },
      { id: 'sec-12-3', title: '3. 22 User Roles & Access Control Policy', description: 'Managing Director, Broker, Accountant, Tenant, and Investor permission tiers.' },
      { id: 'sec-12-4', title: '4. Field-Level Permission Security Matrix', description: 'Masking of confidential phone numbers, banking details, and commission splits.' },
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
`
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
    summary: 'Ultra-High-Net-Worth private vault access rules, Level 5 Non-Disclosure Agreements (NDAs), and luxury viewing concierge.',
    tags: ['UHNW Vault', 'Off-Market Mansions', 'Level 5 NDA', 'Rolls-Royce Viewing', 'Superyacht'],
    subItems: [
      { id: 'sec-13-1', title: '1. Private Vault & Level 5 Confidentiality', description: 'Biometric passkey access, 5-year digital NDAs, and watermark tracking.' },
      { id: 'sec-13-2', title: '2. Trophy Asset Acquisition Protocol', description: 'Palm Jumeirah beachfront mansions, Emirates Hills palaces, and private islands.' },
      { id: 'sec-13-3', title: '3. Bespoke VIP Viewing Fleet', description: 'Rolls-Royce Ghost, 68ft private superyacht, and helicopter aerial tours.' },
      { id: 'sec-13-4', title: '4. UAE Golden Visa & Multi-Currency Settlement', description: 'AED, USD, EUR, and crypto-to-fiat escrow settlement advisory.' },
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
`
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
    summary: 'Search engine optimization master plan, bilingual English/Arabic keyword clusters, programmatic landing pages, and multi-portal XML syndication.',
    tags: ['SEO Strategy', 'Dubai Keywords', 'Schema Markup', 'Programmatic SEO', 'Syndication'],
    subItems: [
      { id: 'sec-14-1', title: '1. High-Intent Dubai Real Estate Keyword Clusters', description: 'DAMAC Hills 2, Palm Jumeirah luxury villas, and Golden Visa search terms.' },
      { id: 'sec-14-2', title: '2. Structured Data Schema & Rich Snippets', description: 'RealEstateListing, Organization, Place, and BreadcrumbList JSON-LD schema.' },
      { id: 'sec-14-3', title: '3. Programmatic Landing Page Architecture', description: 'Dynamic community + bedroom landing pages generating organic traffic.' },
      { id: 'sec-14-4', title: '4. Portal XML Syndication Protocol', description: 'Automated listing pushes to PropertyFinder, Bayut, and Dubizzle.' },
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
`
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
    summary: 'Formal IEEE-compliant Software Requirements Specification (SRS), Software Design Document (SDD), and comprehensive QA Test Plan with UAT scenarios.',
    tags: ['SRS Master', 'SDD Architecture', 'QA Test Plan', 'UAT Scenarios', 'Vitest Playwright'],
    subItems: [
      { id: 'sec-15-1', title: '1. Software Requirements Specification Master', description: 'Functional decomposition, performance constraints, and external interface specs.' },
      { id: 'sec-15-2', title: '2. Software Design Document (SDD)', description: 'Module topology, state management, cache invalidation, and data flow.' },
      { id: 'sec-15-3', title: '3. Master QA Test Plan & Coverage Thresholds', description: 'Unit, integration, accessibility, and E2E test suites with 90%+ code coverage.' },
      { id: 'sec-15-4', title: '4. User Acceptance Testing (UAT) Scenarios', description: 'Simulated broker deals, tenant lease execution, and admin financial reports.' },
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
`
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
    summary: 'Production deployment runbooks, Docker/Kubernetes container orchestration, P1–P4 incident response procedures, and release gate change management.',
    tags: ['DevOps Runbook', 'Incident Response', 'Monitoring 99.9%', 'Release Management', 'CI/CD'],
    subItems: [
      { id: 'sec-16-1', title: '1. Production Deployment Runbook', description: 'Zero-downtime rolling deployments, environment variables, and preflight health checks.' },
      { id: 'sec-16-2', title: '2. Incident Response & P1–P4 Escalation Matrix', description: 'Mean Time to Detect (MTTD < 5m) and Mean Time to Resolve (MTTR < 30m).' },
      { id: 'sec-16-3', title: '3. Real-Time Telemetry & Health Monitoring', description: 'Prometheus metrics, Grafana dashboards, and error budget alerting.' },
      { id: 'sec-16-4', title: '4. Release Management & SemVer Change Control', description: 'Version bumping, CHANGELOG generation, and automated rollback triggers.' },
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
`
  },
];
