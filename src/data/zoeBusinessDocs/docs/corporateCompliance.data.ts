import type { BusinessDocItem } from '../types';

export const corporateComplianceDocs: BusinessDocItem[] = [
  {
    id: 'doc-zoe-00',
    code: 'DOC-BUS-00',
    title: 'Project Progress Tracker, Wave Velocity & Autopilot Telemetry',
    category: 'progress',
    departmentFloor: 'Floor 13 — Executive Flight Deck & Architecture Suite',
    primaryAssistant: '3.4 Zoe AI & 3.43 Ada Chief Architect',
    lastUpdated: '2026-08-26',
    summary:
      'Real-time project execution telemetry, Waves 1–68 completion status, test suite health metrics (100% green), 0 scanner target issues, and Turn-by-Turn RUP milestones.',
    tags: ['Project Progress', 'Waves 1–68', 'Autopilot Telemetry', 'AEGIS V3', 'Turn 88'],
    subItems: [
      {
        id: 'sec-prog-1',
        title: '1. Executive KPI Summary & Global Health',
        description: 'Wave completion, test suite pass rate, and scanner status.',
      },
      {
        id: 'sec-prog-2',
        title: '2. 12 Corporate Departments Operating Matrix',
        description: 'Floor 1–13 SLA assignments and assistant mesh.',
      },
      {
        id: 'sec-prog-3',
        title: '3. Turn-by-Turn Autopilot Milestones (Turns 82–88)',
        description: 'Detailed log of continuous automated engineering passes.',
      },
      {
        id: 'sec-prog-4',
        title: '4. Full Test Matrix & Build Verification Gates',
        description: 'Vitest, strict TypeScript compiler, and production bundle health.',
      },
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
`,
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
    summary:
      'Master corporate profile, brand palette, official coordinates, legal ownership, and executive leadership structure.',
    tags: ['Corporate Profile', 'DET 1388443', 'RERA 44483', 'Arslan Malik', 'Floor 13'],
    subItems: [
      {
        id: 'sec-1-1',
        title: '1. Official Entity Coordinates',
        description: 'DET, RERA, Ejari, and MOL registration numbers.',
      },
      {
        id: 'sec-1-2',
        title: '2. Executive Leadership & Governance',
        description: 'Managing Director authorities and corporate powers.',
      },
      {
        id: 'sec-1-3',
        title: '3. Brand Identity & Visual Standard',
        description: 'RGB/HEX tokens, typography, and hyper-linked HTML rules.',
      },
      {
        id: 'sec-1-4',
        title: '4. Stakeholder & Investor Registry',
        description: 'Shareholders, banking partners, and institutional stakeholders.',
      },
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
`,
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
    summary:
      'Comprehensive structure of all 12 operational corporate departments, floor assignments, team sizes, and turnaround SLAs.',
    tags: ['Departments', 'Org Chart', 'Floor Matrix', 'SLA', 'Executive Council'],
    subItems: [
      {
        id: 'sec-2-1',
        title: '1. Executive Council & Governance (Floor 13)',
        description: 'MD Office, Chief Architect Ada, and COO Zoe.',
      },
      {
        id: 'sec-2-2',
        title: '2. Commercial Operations (Floors 6–12)',
        description: 'Sales, Leasing, VIP Concierge, Finance & Legal Compliance.',
      },
      {
        id: 'sec-2-3',
        title: '3. Technology & Engineering (Floors 1–5)',
        description: 'Frontend, Backend, Database, Security QA, and DevOps.',
      },
      {
        id: 'sec-2-4',
        title: '4. Department SLA & Escalation Protocol',
        description: 'P0/P1/P2 turnaround SLAs and handoff contracts.',
      },
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
`,
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
    summary:
      'Statutory requirements for Dubai DET licensing, RERA broker accreditation, Form A/B/I contract drafting, and DLD e-signatures.',
    tags: ['Trade License', 'RERA Form A', 'Form B', 'Form I', 'DLD Trakheesi'],
    subItems: [
      {
        id: 'sec-3-1',
        title: '1. DET Commercial License 1388443',
        description: 'License activities, permitted business lines, and validity.',
      },
      {
        id: 'sec-3-2',
        title: '2. RERA Broker Accreditation (ORN 44483)',
        description: 'Broker license categories and broker card mandates.',
      },
      {
        id: 'sec-3-3',
        title: '3. Mandatory RERA Form Protocols',
        description: 'Form A (Seller), Form B (Buyer), Form I (Agent Split), Form F (MOU).',
      },
      {
        id: 'sec-3-4',
        title: '4. Trakheesi Permit Advertising Rules',
        description: 'QR code verification and statutory penalties.',
      },
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
        <tr><td><strong>Form F (Unified MOU)</strong></td><td>Sales & Purchase Contract</td><td>Buyer ↔ Seller ↔ Broker(s)</td><td>Primary legal sale agreement outlining purchase price, 10% deposit cheque, and transfer date. Verified by 3.19 Henry AI Document Studio.</td></tr>
      </tbody>
    </table>
  </div>
</div>
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-04: 02_leasing_property_management & 09_crm_features
  // -------------------------------------------------------------,
];
