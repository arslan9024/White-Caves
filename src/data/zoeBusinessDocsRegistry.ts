/**
 * zoeBusinessDocsRegistry.ts
 * Master Hyper-Linked HTML Business Documentation Registry for Zoe AI (Item Code: 3.10)
 * 
 * Corporate & Regulatory Coordinates:
 * - Commercial License (DET): 1388443
 * - RERA Brokerage ORN: 44483 (Classification: General Brokerage)
 * - Office Ejari: 0120250814005322 (Office D-72, El Shaye - 4 Building, Al Barsha South 3rd, Dubai)
 * - Establishment Card (MOL / ICP): 2/1/1192499
 * - Managing Director: Arslan Malik Bashir Ahmad
 */

export interface BusinessDocItem {
  id: string;
  code: string;
  title: string;
  category: 'corporate' | 'licensing' | 'leasing' | 'finance' | 'compliance' | 'departments';
  departmentFloor: string;
  primaryAssistant: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  htmlContent: string;
}

export const ZOE_BUSINESS_CATEGORIES = [
  { id: 'all', label: 'All Business Docs', count: 6 },
  { id: 'corporate', label: '🏛️ Corporate & Profile', count: 1 },
  { id: 'licensing', label: '📜 Regulatory & Trade License', count: 1 },
  { id: 'leasing', label: '📑 Tenancy & Ejari Playbook', count: 1 },
  { id: 'finance', label: '💰 42 Expense Catalog & VAT', count: 1 },
  { id: 'compliance', label: '🛡️ AML, KYC & RERA Rules', count: 1 },
  { id: 'departments', label: '🏢 12 Corporate Departments', count: 1 },
] as const;

export const ZOE_BUSINESS_DOCS: BusinessDocItem[] = [
  {
    id: 'doc-zoe-01',
    code: 'DOC-BUS-01',
    title: 'Corporate Identity & Sovereign Master Profile',
    category: 'corporate',
    departmentFloor: 'Floor 13 — Managing Director Suite',
    primaryAssistant: '3.10 Zoe AI (Executive Intelligence)',
    lastUpdated: '2026-08-25',
    summary: 'Master corporate profile, brand palette, official coordinates, legal ownership, and executive leadership structure.',
    tags: ['Corporate Profile', 'DET 1388443', 'RERA 44483', 'Arslan Malik', 'Floor 13'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">OFFICIAL CORPORATE DOCUMENTATION · WHITE CAVES REAL ESTATE LLC</div>
  <h1 class="doc-title">🏛️ Corporate Identity & Sovereign Profile</h1>
  <p class="doc-lead">
    White Caves Real Estate LLC is an ultra-prime Dubai luxury brokerage established under the authority of Dubai Department of Economy and Tourism (DET) and the Real Estate Regulatory Agency (RERA).
  </p>

  <div class="doc-card-grid">
    <div class="doc-card">
      <div class="doc-card-label">Commercial License (DET)</div>
      <div class="doc-card-value">1388443</div>
      <div class="doc-card-sub">Dubai Economy & Tourism Registered</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">RERA Brokerage ORN</div>
      <div class="doc-card-value">44483</div>
      <div class="doc-card-sub">Office Classification: General Brokerage</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Headquarters Ejari Number</div>
      <div class="doc-card-value">0120250814005322</div>
      <div class="doc-card-sub">Office D-72, El Shaye - 4 Building, Al Barsha South 3rd</div>
    </div>
    <div class="doc-card">
      <div class="doc-card-label">Establishment Card (MOL/ICP)</div>
      <div class="doc-card-value">2/1/1192499</div>
      <div class="doc-card-sub">Ministry of Human Resources & Emiratisation</div>
    </div>
  </div>

  <h2 class="doc-section-heading">Executive Leadership & Key Contacts</h2>
  <table class="doc-table">
    <thead>
      <tr>
        <th>Role</th>
        <th>Designation</th>
        <th>Authority Level</th>
        <th>Executive AI Assistant</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Arslan Malik Bashir Ahmad</strong></td>
        <td>Founder & Managing Director</td>
        <td><span class="badge-level5">Level 5 Master Sovereign</span></td>
        <td><a href="#assistant-3.10" class="doc-link">3.10 Zoe AI</a> / <a href="#assistant-3.19" class="doc-link">3.19 Henry AI</a></td>
      </tr>
      <tr>
        <td><strong>Executive Council</strong></td>
        <td>Strategic Operations & Architecture</td>
        <td>Level 4 Executive</td>
        <td><a href="#assistant-3.11" class="doc-link">3.11 Aurora AI</a></td>
      </tr>
      <tr>
        <td><strong>Finance & Accounting</strong></td>
        <td>CFO & Statutory Tax Compliance</td>
        <td>Level 4 Departmental</td>
        <td><a href="#assistant-3.14" class="doc-link">3.14 Theodora AI</a></td>
      </tr>
    </tbody>
  </table>

  <h2 class="doc-section-heading">Brand Standard & Color Palette</h2>
  <div class="brand-palette-strip">
    <div class="palette-block" style="background:#EF4444;color:#fff;">White Caves Red<br><strong>#EF4444</strong></div>
    <div class="palette-block" style="background:#FFFFFF;color:#0F172A;border:1px solid #CBD5E1;">Brilliant White<br><strong>#FFFFFF</strong></div>
    <div class="palette-block" style="background:#1E293B;color:#fff;">Deep Slate Gray<br><strong>#1E293B</strong></div>
  </div>
</div>
`
  },
  {
    id: 'doc-zoe-02',
    code: 'DOC-BUS-02',
    title: 'Trade Licensing & Regulatory Governance Matrix',
    category: 'licensing',
    departmentFloor: 'Floor 07 — Compliance & Legal Floor',
    primaryAssistant: '3.10 Zoe AI & 3.07 Sofia AI',
    lastUpdated: '2026-08-25',
    summary: 'DET Trade License compliance, RERA broker card renewal rules, Trakheesi permit validation, and DLD portal sync.',
    tags: ['Licensing', 'DET', 'RERA', 'Trakheesi', 'Broker Cards', 'Floor 07'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">REGULATORY COMPLIANCE · DUBAI LAND DEPARTMENT (DLD)</div>
  <h1 class="doc-title">📜 Trade Licensing & Regulatory Governance Matrix</h1>
  <p class="doc-lead">
    Operating standard for continuous regulatory adherence under Dubai Law No. 7 of 2006 (Real Estate Registration) and Law No. 85 of 2006 (Regulating the Real Estate Brokers Register).
  </p>

  <div class="alert-box alert-success">
    <strong>✅ Statutory Compliance Status:</strong> All corporate credentials verified active with Dubai DET (1388443) and RERA (44483). Next annual renewal scheduled for Q3 2027.
  </div>

  <h2 class="doc-section-heading">Mandatory Regulatory Registers</h2>
  <ul class="doc-list">
    <li><strong>RERA Broker Registration Numbers (BRN):</strong> All 100 sales and leasing consultants must possess active BRN cards verified through <a href="#assistant-3.19" class="doc-link">3.19 Henry AI Document Studio</a>.</li>
    <li><strong>Trakheesi Advertising Permits:</strong> No property listing may be advertised on portals (Bayut, Dubizzle, PropertyFinder) without a valid 14-digit Trakheesi QR permit generated via Floor 10 Marketing.</li>
    <li><strong>Ejari Certificate Verification:</strong> Office headquarters registered under Ejari <code>0120250814005322</code> valid through August 2027.</li>
  </ul>

  <div class="doc-action-card">
    <h3>🔗 Cross-Assistant Action Routing</h3>
    <p>Need to issue a compliant tenancy contract or verify title deed credentials?</p>
    <a href="#assistant-3.19" class="btn-action">Launch 3.19 Henry Document Wizard →</a>
  </div>
</div>
`
  },
  {
    id: 'doc-zoe-03',
    code: 'DOC-BUS-03',
    title: 'Tenancy & Ejari Operational Playbook',
    category: 'leasing',
    departmentFloor: 'Floor 06 — Tenancy & Leasing Floor',
    primaryAssistant: '3.19 Henry AI (Document Wizard)',
    lastUpdated: '2026-08-25',
    summary: 'Standard tenancy contract generation, Post-Dated Cheque (PDC) scheduling, bounced cheque escalation, Form 12 eviction legal notice, and security deposit escrow rules.',
    tags: ['Tenancy', 'Ejari', 'PDCs', 'Form 12', 'Bounced Cheque', 'Floor 06', '3.19 Henry AI'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">LEASING STANDARDS · EJARI UNIFIED LEASE CONTRACT</div>
  <h1 class="doc-title">📑 Tenancy & Ejari Operational Playbook</h1>
  <p class="doc-lead">
    End-to-end lifecycle for Dubai residential and commercial leases governed by Dubai Law No. 26 of 2007 (Landlord and Tenant Relationship) and Law No. 33 of 2008.
  </p>

  <h2 class="doc-section-heading">1. Tenancy Contract Generation & E-Sign Flow</h2>
  <p>
    Standard tenancy contracts are generated digitally using <a href="#assistant-3.19" class="doc-link">3.19 Henry AI</a> with instant Emirates ID & Passport OCR ingestion:
  </p>
  <div class="step-flow">
    <div class="step-box">1. Passport / EID Upload</div>
    <div class="step-arrow">➔</div>
    <div class="step-box">2. Auto-Fill Form & Rental Terms</div>
    <div class="step-arrow">➔</div>
    <div class="step-box">3. Digital E-Sign Capture</div>
    <div class="step-arrow">➔</div>
    <div class="step-box">4. Ejari Certificate PDF Export</div>
  </div>

  <h2 class="doc-section-heading">2. Post-Dated Cheque (PDC) & Escrow Tracking</h2>
  <table class="doc-table">
    <thead>
      <tr>
        <th>Cheque Installment</th>
        <th>Due Date Cadence</th>
        <th>Notification Lead Time</th>
        <th>Default Escalation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Installment 1 (Signing)</td>
        <td>On Lease Execution Date</td>
        <td>Immediate Deposit</td>
        <td>Contract Hold until Clear</td>
      </tr>
      <tr>
        <td>Installment 2</td>
        <td>+90 Days / +180 Days</td>
        <td>T-14 Days SMS & WhatsApp</td>
        <td>Formal Notice (Law 33/2008)</td>
      </tr>
      <tr>
        <td>Installment 3 & 4</td>
        <td>Quarterly Cadence</td>
        <td>T-14 Days Automated Ping</td>
        <td>RDC Eviction Filing</td>
      </tr>
    </tbody>
  </table>

  <h2 class="doc-section-heading">3. Form 12 & Rental Dispute Center (RDC) Eviction</h2>
  <p>
    In case of 30-day non-payment or contractual breach, <a href="#assistant-3.19" class="doc-link">3.19 Henry AI</a> auto-generates legal Form 12 with Notary Public electronic dispatch.
  </p>
</div>
`
  },
  {
    id: 'doc-zoe-04',
    code: 'DOC-BUS-04',
    title: '42 Master Real Estate Expense Catalog & VAT Specifications',
    category: 'finance',
    departmentFloor: 'Floor 08 — Finance & Accounting Floor',
    primaryAssistant: '3.14 Theodora AI (CFO Intelligence)',
    lastUpdated: '2026-08-25',
    summary: 'Standardized 42 UAE expense accounts, Federal Tax Authority (FTA) 5% VAT deductibility, Corporate Tax (9%) rules, and double-entry general ledger mappings.',
    tags: ['42 Expenses', 'VAT 5%', 'Corporate Tax 9%', 'Theodora AI', 'Chart of Accounts', 'Floor 08'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">FINANCIAL ENGINEERING · UAE STATUTORY TAX COMPLIANCE</div>
  <h1 class="doc-title">💰 42 Master Real Estate Expense Catalog & VAT Standard</h1>
  <p class="doc-lead">
    Authoritative chart of accounts for White Caves Real Estate LLC, certified under UAE Federal Decree-Law No. 8 of 2017 (VAT) and Federal Decree-Law No. 47 of 2022 (Corporate Tax).
  </p>

  <div class="alert-box alert-info">
    <strong>📊 Reporting Integration:</strong> View live statutory execution across all <a href="#assistant-3.14" class="doc-link">3.14 Theodora AI — 67 Enterprise Reports Engine</a> including FTA Form 201 VAT Audit (3.14.R40) and Corporate Tax Report (3.14.R41).
  </div>

  <h2 class="doc-section-heading">Expense Account Clusters (Sample)</h2>
  <table class="doc-table">
    <thead>
      <tr>
        <th>Code</th>
        <th>Account Title</th>
        <th>VAT Rate</th>
        <th>FTA Form 201 Box</th>
        <th>CT Deductibility</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>EXP-6101</code></td>
        <td>Office Rent & Ejari Overhead</td>
        <td>5% Standard</td>
        <td>Box 9 (Standard-Rated Input)</td>
        <td>100% Tax Deductible</td>
      </tr>
      <tr>
        <td><code>EXP-6105</code></td>
        <td>RERA Company License Renewal</td>
        <td>0% Exempt</td>
        <td>Box 10 (Exempt Expenses)</td>
        <td>100% Tax Deductible</td>
      </tr>
      <tr>
        <td><code>EXP-6201</code></td>
        <td>Broker Commission Payouts</td>
        <td>5% Standard</td>
        <td>Box 9 (Standard-Rated Input)</td>
        <td>100% Tax Deductible</td>
      </tr>
      <tr>
        <td><code>EXP-6302</code></td>
        <td>Bayut / Dubizzle / PF Portal Fees</td>
        <td>5% Standard</td>
        <td>Box 9 (Standard-Rated Input)</td>
        <td>100% Tax Deductible</td>
      </tr>
      <tr>
        <td><code>EXP-6801</code></td>
        <td>Director Loan Account Reconciliation</td>
        <td>0% Out of Scope</td>
        <td>Non-Taxable Equity</td>
        <td>Capital Account Movement</td>
      </tr>
    </tbody>
  </table>
</div>
`
  },
  {
    id: 'doc-zoe-05',
    code: 'DOC-BUS-05',
    title: 'AML, KYC & RERA Compliance Standard',
    category: 'compliance',
    departmentFloor: 'Floor 07 — Compliance & Legal Floor',
    primaryAssistant: '3.07 Sofia AI & 3.10 Zoe AI',
    lastUpdated: '2026-08-25',
    summary: 'Anti-Money Laundering (AML) goAML reporting, Politically Exposed Persons (PEP) screening, ultimate beneficial owner (UBO) declaration, and sanctions checks.',
    tags: ['AML', 'KYC', 'goAML', 'PEP Screening', 'UBO', 'Floor 07'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">STATUTORY COMPLIANCE · CENTRAL BANK & FIU UAE</div>
  <h1 class="doc-title">🛡️ AML, KYC & RERA Compliance Standard</h1>
  <p class="doc-lead">
    Framework adhering to UAE Federal Decree-Law No. 20 of 2018 on Anti-Money Laundering and Combating the Financing of Terrorism (AML/CFT).
  </p>

  <h2 class="doc-section-heading">Key Statutory Mandates</h2>
  <ul class="doc-list">
    <li><strong>Cash Transaction Limits:</strong> Single transactions involving cash exceeding AED 55,000 are strictly forbidden without automated goAML filing with the UAE Financial Intelligence Unit.</li>
    <li><strong>Virtual Asset Verification:</strong> Cryptocurrency settlements must pass through licensed UAE Central Bank crypto-to-fiat gateways with proof of source of funds.</li>
    <li><strong>Customer Due Diligence (CDD):</strong> 100% of buyers, sellers, and landlords must complete passport verification, residence visa checks, and PEP sanctions list clearance.</li>
  </ul>
</div>
`
  },
  {
    id: 'doc-zoe-06',
    code: 'DOC-BUS-06',
    title: '12 Corporate Departments Sovereign Structure',
    category: 'departments',
    departmentFloor: 'Floors 01 to 12 + Floor 13 MD Suite',
    primaryAssistant: '3.10 Zoe AI (Executive Intelligence)',
    lastUpdated: '2026-08-25',
    summary: 'The immutable 12-department corporate governance structure spanning Floor 01 (Executive Sales) to Floor 12 (Operations) and Floor 13 (MD Sovereign Suite).',
    tags: ['12 Departments', 'Floors 01-13', 'Corporate Hierarchy', 'MD Sovereign Suite', 'Zoe AI'],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">CORPORATE ARCHITECTURE · 12 OPERATIONAL FLOORS</div>
  <h1 class="doc-title">🏢 12 Corporate Departments Sovereign Structure</h1>
  <p class="doc-lead">
    The non-negotiable architectural foundation of White Caves Real Estate LLC, organizing all 100 agents, workflows, and AI assistants across dedicated floors.
  </p>

  <div class="department-grid">
    <div class="dept-card"><span class="floor-badge">Floor 13</span> <strong>Managing Director Sovereign Suite</strong> — Arslan Malik</div>
    <div class="dept-card"><span class="floor-badge">Floor 12</span> <strong>Operations & Facilities</strong> — Maintenance & Logistics</div>
    <div class="dept-card"><span class="floor-badge">Floor 11</span> <strong>AI & Technology Integrations</strong> — Systems & Models</div>
    <div class="dept-card"><span class="floor-badge">Floor 10</span> <strong>Marketing & PR</strong> — Portals & Campaigns</div>
    <div class="dept-card"><span class="floor-badge">Floor 09</span> <strong>Sales & CRM Engineering</strong> — Client Pipeline</div>
    <div class="dept-card"><span class="floor-badge">Floor 08</span> <strong>Finance & Accounting</strong> — VAT 5%, Corporate Tax, Audit</div>
    <div class="dept-card"><span class="floor-badge">Floor 07</span> <strong>Compliance & Legal Affairs</strong> — DET, RERA, AML</div>
    <div class="dept-card"><span class="floor-badge">Floor 06</span> <strong>Tenancy & Leasing Administration</strong> — Ejari, PDCs</div>
    <div class="dept-card"><span class="floor-badge">Floor 05</span> <strong>DevOps & Infrastructure</strong> — Cloud & Security</div>
    <div class="dept-card"><span class="floor-badge">Floor 04</span> <strong>Quality Assurance & Testing</strong> — 100% Verification</div>
    <div class="dept-card"><span class="floor-badge">Floor 03</span> <strong>Database & Market Intelligence</strong> — Dubai Ledger</div>
    <div class="dept-card"><span class="floor-badge">Floor 02</span> <strong>Backend & Core API Engineering</strong> — Microservices</div>
    <div class="dept-card"><span class="floor-badge">Floor 01</span> <strong>Frontend & UX Design</strong> — Sovereign Portal</div>
  </div>
</div>
`
  }
];
