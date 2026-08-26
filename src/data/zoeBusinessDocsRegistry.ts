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
 * - Brand Palette: White Caves Red (#EF4444) | Brilliant White (#FFFFFF) | Deep Slate Gray (#1E293B)
 */

export interface DocSubItem {
  id: string;
  title: string;
  description: string;
}

export interface BusinessDocItem {
  id: string;
  code: string;
  title: string;
  category: 'corporate' | 'departments' | 'licensing' | 'leasing' | 'finance' | 'compliance' | 'workflows' | 'crm_features' | 'vip_concierge' | 'tech_devops';
  departmentFloor: string;
  primaryAssistant: string;
  lastUpdated: string;
  summary: string;
  tags: string[];
  subItems: DocSubItem[];
  htmlContent: string;
}

export const ZOE_BUSINESS_CATEGORIES = [
  { id: 'all', label: 'All Business Docs', count: 10 },
  { id: 'corporate', label: '🏛️ Corporate & Identity', count: 1 },
  { id: 'departments', label: '🏢 12 Corporate Departments', count: 1 },
  { id: 'licensing', label: '📜 DET & RERA Licensing', count: 1 },
  { id: 'leasing', label: '📑 Ejari & Tenancy Playbook', count: 1 },
  { id: 'finance', label: '💰 42 Expense Catalog & VAT', count: 1 },
  { id: 'compliance', label: '🛡️ AML, KYC & Data Protection', count: 1 },
  { id: 'workflows', label: '🔄 Deal Lifecycles & Playbooks', count: 1 },
  { id: 'crm_features', label: '⚡ CRM Engine & Trakheesi', count: 1 },
  { id: 'vip_concierge', label: '👑 UHNW Private Vault & VIP', count: 1 },
  { id: 'tech_devops', label: '🚀 Sovereign OS & SQA Matrix', count: 1 },
] as const;

export const ZOE_BUSINESS_DOCS: BusinessDocItem[] = [
  {
    id: 'doc-zoe-01',
    code: 'DOC-BUS-01',
    title: 'Corporate Identity, Sovereign Profile & Legal Coordinates',
    category: 'corporate',
    departmentFloor: 'Floor 13 — Managing Director Suite',
    primaryAssistant: '3.10 Zoe AI (Executive Intelligence)',
    lastUpdated: '2026-08-26',
    summary: 'Master corporate profile, brand palette, official coordinates, legal ownership, and executive leadership structure.',
    tags: ['Corporate Profile', 'DET 1388443', 'RERA 44483', 'Arslan Malik', 'Floor 13'],
    subItems: [
      { id: 'sec-1-1', title: '1. Official Entity Coordinates', description: 'DET, RERA, Ejari, and MOL registration numbers.' },
      { id: 'sec-1-2', title: '2. Executive Leadership & Governance', description: 'Managing Director authorities and corporate powers.' },
      { id: 'sec-1-3', title: '3. Brand Identity & Visual Standard', description: 'RGB/HEX tokens, typography, and hyper-linked HTML rules.' },
      { id: 'sec-1-4', title: '4. Strategic Market Positioning', description: 'Ultra-luxury advisory model and prime Dubai catchment.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">OFFICIAL CORPORATE DOCUMENTATION · WHITE CAVES REAL ESTATE LLC</div>
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
    The brokerage is managed by <strong>Managing Director Arslan Malik Bashir Ahmad</strong>, holding absolute signing authority under Commercial Power of Attorney and RERA Certified Broker Credentials. All primary corporate agreements, escrow authorizations, employment sponsorship visas, and legal attestation certificates operate through the executive office on Floor 13.
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

  <h2 class="doc-section-heading" id="sec-1-4">3. Strategic Market Positioning</h2>
  <p class="doc-body">
    White Caves operates exclusively within the top-tier luxury residential and commercial segments in Dubai, focusing on Palm Jumeirah, Emirates Hills, Downtown Dubai, Dubai Marina, DIFC, and Dubai Water Canal. The agency combines bespoke AI intelligence personas (Zoe, Aurora, Theodora, Nadia, Henry, Linda, and Sophia) with ultra-high-net-worth concierge infrastructure.
  </p>
</div>
`
  },
  {
    id: 'doc-zoe-02',
    code: 'DOC-BUS-02',
    title: '12 Corporate Departments, Floor Matrices & Org Architecture',
    category: 'departments',
    departmentFloor: 'All Floors (1 to 13)',
    primaryAssistant: '3.10 Zoe AI (Chief Operations Officer)',
    lastUpdated: '2026-08-26',
    summary: 'Comprehensive structure of all 12 operational corporate departments, floor assignments, SLAs, and leadership.',
    tags: ['Departments', 'Org Chart', 'Floor Matrix', 'SLA', 'Executive Council'],
    subItems: [
      { id: 'sec-2-1', title: '1. Executive Council & Governance (Floor 13)', description: 'MD Office, Chief Architect Ada, and COO Zoe.' },
      { id: 'sec-2-2', title: '2. Commercial & Transactions (Floors 6–10)', description: 'Sales, Leasing, VIP Concierge, Finance & Compliance.' },
      { id: 'sec-2-3', title: '3. Technology & Engineering (Floors 1–5)', description: 'Frontend, Backend, Database, Security QA, and DevOps.' },
      { id: 'sec-2-4', title: '4. Department SLA & Escalation Protocol', description: 'P0/P1/P2 turnaround SLAs and handoff contracts.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">ORGANIZATIONAL ARCHITECTURE · WHITE CAVES REAL ESTATE LLC</div>
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
        <tr>
          <td><strong>01</strong></td>
          <td>Executive Council & MD Office</td>
          <td>Floor 13</td>
          <td>@Ada (Arch) & @Zoe (COO)</td>
          <td>Strategic vision, sovereign approvals, legal P&L governance.</td>
        </tr>
        <tr>
          <td><strong>02</strong></td>
          <td>Research & Intelligence Division</td>
          <td>Floor 12</td>
          <td>@Elena (CRO) & @Iris</td>
          <td>Market trends, DLD transaction analytics, preflight briefs.</td>
        </tr>
        <tr>
          <td><strong>03</strong></td>
          <td>Sales & Secondary Transactions</td>
          <td>Floor 11</td>
          <td>@Jaime & @Mila</td>
          <td>Off-plan launches, Form F resale transactions, client negotiation.</td>
        </tr>
        <tr>
          <td><strong>04</strong></td>
          <td>Leasing & Property Management</td>
          <td>Floor 10</td>
          <td>@Victoria & @Tara</td>
          <td>Ejari attestation, tenant onboarding, landlord portal, PDC vault.</td>
        </tr>
        <tr>
          <td><strong>05</strong></td>
          <td>Legal, Compliance & RERA Governance</td>
          <td>Floor 09</td>
          <td>@Sofia & @Neva</td>
          <td>AML/KYC screening, Trakheesi permits, Form 12 notices, PDPL.</td>
        </tr>
        <tr>
          <td><strong>06</strong></td>
          <td>Finance, VAT & Escrow Accounting</td>
          <td>Floor 08</td>
          <td>@Theodora (CFO) & @Invoice</td>
          <td>FTA 5% VAT filings, 42-expense catalog, escrow milestone disbursement.</td>
        </tr>
        <tr>
          <td><strong>07</strong></td>
          <td>VIP & Ultra-High-Net-Worth Concierge</td>
          <td>Floor 07</td>
          <td>@Linda & @Cassie</td>
          <td>Private off-market vault, Rolls-Royce/Yacht viewings, Level 5 NDAs.</td>
        </tr>
        <tr>
          <td><strong>08</strong></td>
          <td>Marketing, PR & WhatsApp Automation</td>
          <td>Floor 06</td>
          <td>@Nadia & @Rachel</td>
          <td>Omnichannel ad campaigns, WhatsApp AI concierge, SEO optimization.</td>
        </tr>
        <tr>
          <td><strong>09</strong></td>
          <td>AI Agents & System Integrations</td>
          <td>Floor 05</td>
          <td>@Aurora & @Joelle</td>
          <td>Machine learning personas, document OCR pipelines, webhook bridges.</td>
        </tr>
        <tr>
          <td><strong>10</strong></td>
          <td>Frontend UI/UX & Design System</td>
          <td>Floor 04</td>
          <td>@Una & @Lea</td>
          <td>React/Vite interfaces, luxury animations, mobile CRM touch suite.</td>
        </tr>
        <tr>
          <td><strong>11</strong></td>
          <td>Database Architecture & Data Pipelines</td>
          <td>Floor 03</td>
          <td>@Barbara & @Anima</td>
          <td>Prisma ORM, PostgreSQL clusters, Redis caching, telemetry.</td>
        </tr>
        <tr>
          <td><strong>12</strong></td>
          <td>DevOps, Cloud & Cyber Security</td>
          <td>Floor 02</td>
          <td>@Gwynne & @Katherine</td>
          <td>CI/CD pipelines, penetration testing, SQA release certifications.</td>
        </tr>
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
    <li><strong>P2 (Routine Maintenance & Ejari Attestation):</strong> 2-Hour turnaround SLA managed by Victoria Leasing Suite.</li>
  </ul>
</div>
`
  },
  {
    id: 'doc-zoe-03',
    code: 'DOC-BUS-03',
    title: 'Trade Licensing, RERA Classification & Form A/B/I Attestation',
    category: 'licensing',
    departmentFloor: 'Floor 09 — Legal & Compliance Suite',
    primaryAssistant: '3.10 Zoe AI & Sofia Compliance',
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
  <div class="doc-header-badge">REGULATORY PLAYBOOK · DUBAI LAND DEPARTMENT (DLD) & RERA</div>
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
        <tr>
          <td><strong>Form A</strong></td>
          <td>Seller’s Agency Agreement</td>
          <td>Property Owner ↔ White Caves Real Estate</td>
          <td>Grants marketing mandate, specifies listing price, commission %, and Trakheesi permit rights.</td>
        </tr>
        <tr>
          <td><strong>Form B</strong></td>
          <td>Buyer’s Agency Agreement</td>
          <td>Prospective Buyer ↔ White Caves Real Estate</td>
          <td>Authorizes White Caves to represent buyer, conduct property search, and negotiate acquisitions.</td>
        </tr>
        <tr>
          <td><strong>Form I</strong></td>
          <td>Agent-to-Agent Agreement</td>
          <td>White Caves ↔ External Licensed Broker</td>
          <td>Establishes legally binding commission split percentage for co-brokered sales transactions.</td>
        </tr>
        <tr>
          <td><strong>Form F (Unified MOU)</strong></td>
          <td>Sales & Purchase Contract</td>
          <td>Buyer ↔ Seller ↔ Broker(s)</td>
          <td>Primary legal sale agreement outlining purchase price, 10% deposit cheque, and transfer date.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="doc-section-heading" id="sec-3-4">3. Trakheesi Advertising Compliance</h2>
  <p class="doc-body">
    Under RERA Circular No. 1 of 2024, every property listing published online, in print, or on social media MUST have an active <strong>Trakheesi Advertising Permit Number</strong> and an embedded dynamic QR code linking directly to the DLD REST verification registry. Fines for non-compliant advertising range from AED 50,000 to license suspension.
  </p>
</div>
`
  },
  {
    id: 'doc-zoe-04',
    code: 'DOC-BUS-04',
    title: 'Ejari Tenancy Lifecycle, PDC Vault & Bounced Cheque Protocol',
    category: 'leasing',
    departmentFloor: 'Floor 10 — Leasing & Tenancy Suite',
    primaryAssistant: '3.10 Zoe AI & Victoria Leasing',
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
  <div class="doc-header-badge">LEASING & TENANCY PLAYBOOK · WHITE CAVES REAL ESTATE LLC</div>
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
    Rental payments in Dubai are traditionally paid via 1, 2, 4, or 6 post-dated bank cheques (PDCs). The White Caves PDC Vault enforces double-entry verification:
  </p>
  <ul>
    <li>Cheques are physically deposited in an institutional fireproof vault on Floor 8.</li>
    <li>Cheque serial numbers, bank names, branch codes, and maturity dates are entered into Theodora AI.</li>
    <li>Automated notifications are dispatched to tenants 7 days prior to cheque deposit.</li>
  </ul>

  <h2 class="doc-section-heading" id="sec-4-3">3. Bounced Cheque Operational Protocol</h2>
  <p class="doc-body">
    Under UAE Federal Decree-Law No. 14 of 2020 on the Commercial Transactions Law, a dishonored cheque serves as an <strong>Executory Title</strong>. If a rent cheque is returned unpaid:
  </p>
  <ol>
    <li><strong>Day 1 (Immediate Alert):</strong> Bank dispatch note received; tenant notified via WhatsApp and registered email.</li>
    <li><strong>Day 3 (Grace Period Expiry):</strong> Replacement via certified Manager's Cheque or instant cash deposit requested.</li>
    <li><strong>Day 7 (Direct Court Execution):</strong> The bounced cheque is submitted directly to the Dubai Courts Execution Judge for an attachment order without lengthy litigation.</li>
  </ol>
</div>
`
  },
  {
    id: 'doc-zoe-05',
    code: 'DOC-BUS-05',
    title: '42 Corporate Expense Catalog, 5% FTA VAT & Escrow Governance',
    category: 'finance',
    departmentFloor: 'Floor 08 — Finance & CFO Suite',
    primaryAssistant: '3.10 Zoe AI & Theodora AI (CFO)',
    lastUpdated: '2026-08-26',
    summary: 'Master 42 expense line catalog, operational unit economics, UAE Federal Tax Authority (FTA) 5% VAT filings, and Escrow Account Law No. 8 of 2007.',
    tags: ['42 Expenses', 'FTA VAT 5%', 'Escrow Law', 'P&L Model', 'Theodora CFO'],
    subItems: [
      { id: 'sec-5-1', title: '1. Master 42 Corporate Expense Breakdown', description: 'Itemized expense catalog across 6 financial categories.' },
      { id: 'sec-5-2', title: '2. UAE Federal Tax Authority (FTA) 5% VAT Rules', description: 'Tax Registration Number (TRN), input VAT, and quarterly filing.' },
      { id: 'sec-5-3', title: '3. Escrow Account Governance (Law No. 8 of 2007)', description: 'Off-plan trust accounts and milestone construction disbursements.' },
      { id: 'sec-5-4', title: '4. Brokerage Commission Splits & Payout Schedule', description: 'Agent split tiers (75/25 to 100%) and payout clearing days.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">FINANCIAL INTELLIGENCE · THEODORA AI CFO & AUDIT SUITE</div>
  <h1 class="doc-title">💰 42 Corporate Expense Catalog, 5% FTA VAT & Escrow Governance</h1>
  <p class="doc-lead">
    Comprehensive financial architecture governing operational expenditure, statutory UAE Value Added Tax (VAT), and developer escrow account compliance under Dubai Law No. 8 of 2007.
  </p>

  <h2 class="doc-section-heading" id="sec-5-1">1. Master 42 Corporate Expense Structure</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Category Code</th>
          <th>Expense Category</th>
          <th>Item Count</th>
          <th>Primary Monthly / Annual Cost Centers</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>CAT-01</strong></td>
          <td>Regulatory & Licensing</td>
          <td>7 Items</td>
          <td>DET Commercial License, RERA Brokerage ORN Renewal, DLD Trakheesi Permit Credits, Civil Defense Attestation.</td>
        </tr>
        <tr>
          <td><strong>CAT-02</strong></td>
          <td>Premises & Facilities</td>
          <td>8 Items</td>
          <td>Office Ejari Lease (D-72 Al Barsha), DEWA Commercial Utilities, High-Speed Fiber Internet, Facility Management.</td>
        </tr>
        <tr>
          <td><strong>CAT-03</strong></td>
          <td>Portal Syndication & Marketing</td>
          <td>9 Items</td>
          <td>Property Finder Enterprise Tier, Bayut / Dubizzle Premier Featured Packages, Meta Ads, Google Ads Dubai Luxury.</td>
        </tr>
        <tr>
          <td><strong>CAT-04</strong></td>
          <td>Technology & Cloud Infrastructure</td>
          <td>8 Items</td>
          <td>AWS Cloud Hosting, OpenAI & Anthropic LLM API Tokens, Pannellum 360 VR Servers, Twilio WhatsApp Gateway.</td>
        </tr>
        <tr>
          <td><strong>CAT-05</strong></td>
          <td>Staffing, Visas & Healthcare</td>
          <td>6 Items</td>
          <td>MOL Labor Quota Cards, Investor & Employment Residence Visas, DHA Mandated Medical Insurance, Gratuity Reserves.</td>
        </tr>
        <tr>
          <td><strong>CAT-06</strong></td>
          <td>Professional Services & Audit</td>
          <td>4 Items</td>
          <td>FTA External Tax Auditor, goAML Legal Compliance Counsel, Banking Escrow Maintenance, Annual SQA Security Audit.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="doc-section-heading" id="sec-5-2">2. UAE VAT (5%) Taxation Framework</h2>
  <p class="doc-body">
    White Caves Real Estate LLC is registered with the Federal Tax Authority (FTA). All brokerage commissions, advisory fees, and service charges carry a standard 5% VAT rate:
  </p>
  <ul>
    <li><strong>Tax Invoice Standard:</strong> All issued invoices MUST show the company Tax Registration Number (TRN), customer TRN (if corporate), line-item pricing, and exact 5% VAT in AED.</li>
    <li><strong>Quarterly VAT 201 Return:</strong> Filed before the 28th day following each calendar quarter through the FTA EmaraTax portal.</li>
  </ul>
</div>
`
  },
  {
    id: 'doc-zoe-06',
    code: 'DOC-BUS-06',
    title: 'Anti-Money Laundering (AML), KYC Tiering & UAE PDPL Compliance',
    category: 'compliance',
    departmentFloor: 'Floor 09 — Compliance & Legal Suite',
    primaryAssistant: '3.10 Zoe AI & Sofia Compliance',
    lastUpdated: '2026-08-26',
    summary: 'Statutory Anti-Money Laundering policies, goAML filing protocols, 3-tier KYC screening, and UAE Personal Data Protection Law (PDPL).',
    tags: ['AML', 'KYC', 'goAML', 'UAE PDPL', 'Suspicious Transaction'],
    subItems: [
      { id: 'sec-6-1', title: '1. Statutory AML/CFT Legal Framework', description: 'Federal Decree-Law No. (20) of 2018 on Anti-Money Laundering.' },
      { id: 'sec-6-2', title: '2. Three-Tier KYC Due Diligence', description: 'Standard, Enhanced Due Diligence (EDD), and PEP verification.' },
      { id: 'sec-6-3', title: '3. goAML Reporting & STR Triggers', description: 'Suspicious Transaction Reports and Real Estate Activity Reports (REAR).' },
      { id: 'sec-6-4', title: '4. UAE PDPL Data Protection Mandate', description: 'Federal Decree-Law No. 45 of 2021 on Personal Data Protection.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">STATUTORY COMPLIANCE · UAE FIU & MINISTRY OF ECONOMY</div>
  <h1 class="doc-title">🛡️ Anti-Money Laundering (AML), KYC Tiering & UAE PDPL Compliance</h1>
  <p class="doc-lead">
    Under UAE Federal Decree-Law No. 20 of 2018 and Cabinet Decision No. 10 of 2019, real estate brokerages are designated as Designated Non-Financial Businesses and Professions (DNFBPs) subject to direct supervision by the Ministry of Economy and the Financial Intelligence Unit (FIU).
  </p>

  <h2 class="doc-section-heading" id="sec-6-2">1. Three-Tier Customer Due Diligence (CDD)</h2>
  <div class="doc-table-wrap">
    <table class="doc-table">
      <thead>
        <tr>
          <th>KYC Tier</th>
          <th>Risk Category</th>
          <th>Transaction Threshold</th>
          <th>Verification Requirements</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Tier 1: Standard</strong></td>
          <td>Low Risk (UAE Resident / Salaried)</td>
          <td>Under AED 5,000,000</td>
          <td>Valid Emirates ID, Passport, Proof of Residential Address, Source of Funds self-declaration.</td>
        </tr>
        <tr>
          <td><strong>Tier 2: Medium</strong></td>
          <td>Corporate Entity / Foreign Buyer</td>
          <td>AED 5M – AED 20,000,000</td>
          <td>Certificate of Incumbency, Memorandum of Association, Ultimate Beneficial Owner (UBO 25%+) passport.</td>
        </tr>
        <tr>
          <td><strong>Tier 3: Enhanced (EDD)</strong></td>
          <td>Politically Exposed Person (PEP) / Cash / Crypto</td>
          <td>Exceeding AED 20,000,000 or High-Risk Jurisdictions</td>
          <td>Bank statements (6 months), certified source of wealth audit, executive approval by Managing Director.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="doc-section-heading" id="sec-6-3">2. Real Estate Activity Report (REAR) via goAML</h2>
  <p class="doc-body">
    Any real estate transaction involving <strong>cash payments equal to or exceeding AED 55,000</strong>, or involving virtual assets (cryptocurrency), MUST be reported through the <strong>FIU goAML Portal</strong> within 7 business days via a Real Estate Activity Report (REAR).
  </p>
</div>
`
  },
  {
    id: 'doc-zoe-07',
    code: 'DOC-BUS-07',
    title: 'End-to-End Deal Lifecycles & Workflow Operating Playbooks',
    category: 'workflows',
    departmentFloor: 'Floor 11 — Sales & Deal Closing Suite',
    primaryAssistant: '3.10 Zoe AI & Jaime Deals',
    lastUpdated: '2026-08-26',
    summary: 'Detailed playbooks for secondary resale transactions, off-plan developer launches, commercial leasing, and property handover.',
    tags: ['Deal Lifecycle', 'Form F', 'Trustee Office', 'Off-Plan SPA', 'Handover'],
    subItems: [
      { id: 'sec-7-1', title: '1. Secondary Market Resale Playbook', description: 'From listing inquiry to DLD Trustee Office deed transfer.' },
      { id: 'sec-7-2', title: '2. Off-Plan Developer Sales Playbook', description: 'EOI, allocation, Booking Form, and SPA execution.' },
      { id: 'sec-7-3', title: '3. Commercial Lease Negotiation', description: 'Fit-out periods, grace periods, and commercial Ejari.' },
      { id: 'sec-7-4', title: '4. Property Handover & Snagging Inspection', description: 'De-snagging, key release, and service charge NOC.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">OPERATIONAL WORKFLOW · TRANSACTION MANAGEMENT</div>
  <h1 class="doc-title">🔄 End-to-End Deal Lifecycles & Workflow Playbooks</h1>
  <p class="doc-lead">
    Standardized operational workflow diagrams and step-by-step procedures ensuring transaction security and compliance across every deal closed by White Caves Real Estate.
  </p>

  <h2 class="doc-section-heading" id="sec-7-1">1. Secondary Resale Closing Sequence (MOU to Transfer)</h2>
  <ol>
    <li><strong>Listing Mandate:</strong> Form A signed by seller; Trakheesi permit approved.</li>
    <li><strong>Viewing & Form B:</strong> Buyer signs Form B mandate prior to property viewing.</li>
    <li><strong>Contract Generation (Form F / MOU):</strong> Price, payment terms, and 10% security deposit cheque documented.</li>
    <li><strong>Developer NOC Application:</strong> Seller applies for No Objection Certificate (NOC) verifying all service charges are paid up to date.</li>
    <li><strong>DLD Trustee Transfer:</strong> Parties convene at DLD Registration Trustee Office; purchase price released via Manager’s Cheques, and digital title deed issued to buyer.</li>
  </ol>

  <h2 class="doc-section-heading" id="sec-7-2">2. Off-Plan Primary Launch Sequence</h2>
  <p class="doc-body">
    For off-plan sales (Emaar, Nakheel, Meraas, Damac, Sobha): Expression of Interest (EOI) token payment collected → Unit allocation confirmed → 10% down payment + 4% DLD fee paid → Sales & Purchase Agreement (SPA) and Oqood pre-registration certificate issued.
  </p>
</div>
`
  },
  {
    id: 'doc-zoe-08',
    code: 'DOC-BUS-08',
    title: 'CRM Platform Architecture, Lead Routing & Trakheesi Permit Engine',
    category: 'crm_features',
    departmentFloor: 'Floor 05 — AI & Systems Integration Suite',
    primaryAssistant: '3.10 Zoe AI & Aurora AI',
    lastUpdated: '2026-08-26',
    summary: 'Technical architecture of the White Caves Sovereign CRM, automated lead routing, scoring algorithms, and Trakheesi permit synchronization.',
    tags: ['CRM Architecture', 'Lead Scoring', 'Trakheesi Engine', 'PWA Offline', 'Webhooks'],
    subItems: [
      { id: 'sec-8-1', title: '1. Unified CRM Architecture & Data Bus', description: 'Co-located 4-way folder segregation and React state tree.' },
      { id: 'sec-8-2', title: '2. Automated Lead Scoring & Routing Matrix', description: 'Velocity scoring, budget weight, and agent queue balancing.' },
      { id: 'sec-8-3', title: '3. Trakheesi Permit Verification Bridge', description: 'Real-time DLD REST API validation and QR barcode engine.' },
      { id: 'sec-8-4', title: '4. PWA Progressive Offline Synchronization', description: 'IndexedDB caching and optimistic background replay.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">PLATFORM ARCHITECTURE · SOVEREIGN CRM ENGINE</div>
  <h1 class="doc-title">⚡ CRM Platform Architecture, Lead Routing & Trakheesi Engine</h1>
  <p class="doc-lead">
    The White Caves proprietary CRM platform is built on enterprise TypeScript, React, and Vite, incorporating automated lead intelligence and direct government API bridges.
  </p>

  <h2 class="doc-section-heading" id="sec-8-2">1. Automated Lead Routing Law</h2>
  <p class="doc-body">
    Incoming leads from portals, WhatsApp, and luxury landing pages are automatically ingested and scored on a 0–100 scale:
  </p>
  <ul>
    <li><strong>Score 90–100 (Ultra VIP / Cash Buyer):</strong> Instantly routed to Managing Director Arslan Malik and Senior Equity Partners.</li>
    <li><strong>Score 70–89 (High Intent Buyer):</strong> Routed to top 3 performing Area Specialists with a 15-minute contact lock.</li>
    <li><strong>Score < 70 (Nurturing / General Inquiry):</strong> Ingested into Nadia WhatsApp automated follow-up sequences.</li>
  </ul>
</div>
`
  },
  {
    id: 'doc-zoe-09',
    code: 'DOC-BUS-09',
    title: 'Ultra-High-Net-Worth (UHNW) Private Vault, Sovereign NDAs & VIP Viewings',
    category: 'vip_concierge',
    departmentFloor: 'Floor 07 — VIP & UHNW Suite',
    primaryAssistant: '3.10 Zoe AI & Linda VIP Concierge',
    lastUpdated: '2026-08-26',
    summary: 'Operating procedures for the Off-Market Private Vault, Level 5 NDA digital signing, crypto payments, and Rolls-Royce/Helicopter viewing tours.',
    tags: ['UHNW Vault', 'Private Island', 'Level 5 NDA', 'Crypto Escrow', 'VIP Concierge'],
    subItems: [
      { id: 'sec-9-1', title: '1. Off-Market Private Asset Vault', description: 'Trophy penthouses, mansions, and private islands above AED 50M.' },
      { id: 'sec-9-2', title: '2. Level 5 Digital NDA Signing Protocol', description: '5-Year binding non-disclosure with digital signature pad.' },
      { id: 'sec-9-3', title: '3. Multi-Currency & Crypto Escrow Gateway', description: 'BTC/ETH/USDT rate locking and licensed OTC clearance.' },
      { id: 'sec-9-4', title: '4. Bespoke Transport Coordination', description: 'Private jet transfers, Rolls-Royce chauffeur, and yacht viewings.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">VIP LUXURY CONCIERGE · ULTRA-HIGH-NET-WORTH (UHNW) SUITE</div>
  <h1 class="doc-title">👑 Ultra-High-Net-Worth (UHNW) Private Vault & VIP Protocol</h1>
  <p class="doc-lead">
    Dedicated concierge protocols tailored for royal families, institutional family offices, and ultra-high-net-worth individuals purchasing trophy assets exceeding AED 50,000,000.
  </p>

  <h2 class="doc-section-heading" id="sec-9-1">1. Private Vault & Level 5 Confidentiality</h2>
  <p class="doc-body">
    Off-market trophy assets (e.g. Palm Jumeirah beachfront mansions, World Islands plots) are shielded behind the <strong>UHNW Private Vault</strong>. Access requires biometric or two-factor VIP passkey authentication and execution of a legally binding <strong>Level 5 Digital Non-Disclosure Agreement (NDA)</strong> carrying 5-year confidentiality terms.
  </p>

  <h2 class="doc-section-heading" id="sec-9-4">2. Bespoke VIP Viewing Fleet</h2>
  <p class="doc-body">
    Clients viewing palatial listings are offered complimentary arrival coordination:
  </p>
  <ul>
    <li><strong>Luxury Chauffeur:</strong> Rolls-Royce Ghost or Bentley Mulsanne with certified executive chauffeur.</li>
    <li><strong>Superyacht Arrival:</strong> 68ft private superyacht for waterfront estate approaches from Dubai Marina / Palm Jumeirah.</li>
    <li><strong>Helicopter Aerial Tour:</strong> 45-minute aerial property inspection with pilot narration and architectural photography.</li>
  </ul>
</div>
`
  },
  {
    id: 'doc-zoe-10',
    code: 'DOC-BUS-10',
    title: 'Sovereign OS Infrastructure, CI/CD Runbooks & SQA Master Matrix',
    category: 'tech_devops',
    departmentFloor: 'Floor 02 — DevOps & Cyber Security Suite',
    primaryAssistant: '3.10 Zoe AI & Ada (Chief Architect)',
    lastUpdated: '2026-08-26',
    summary: 'Technical architecture, AEGIS V4 Policy compliance, 0-token local compilation gates, SQA automated testing, and release runbooks.',
    tags: ['Sovereign OS', 'AEGIS V4', 'CI/CD Runbook', 'SQA Matrix', 'Zero Token Gate'],
    subItems: [
      { id: 'sec-10-1', title: '1. Software Engineering Standard (RUP & 4-Way Segregation)', description: 'View-Logic-Style-Data folder standard across all components.' },
      { id: 'sec-10-2', title: '2. AEGIS Policy & Deduplication Law', description: 'O(n) complexity mandate, dead code sweep, and policy diff gates.' },
      { id: 'sec-10-3', title: '3. Zero-Token Local Compilation Gate', description: 'npm run build and local vitest validation before git push.' },
      { id: 'sec-10-4', title: '4. Incident Response & Disaster Recovery', description: 'Failover strategies, database backups, and rollback runbooks.' },
    ],
    htmlContent: `
<div class="doc-container">
  <div class="doc-header-badge">ENGINEERING GOVERNANCE · SOVEREIGN OS & SQA MATRIX</div>
  <h1 class="doc-title">🚀 Sovereign OS Infrastructure, CI/CD Runbooks & SQA Master Matrix</h1>
  <p class="doc-lead">
    Governing the engineering lifecycle, high-performance web standards, continuous integration, and test automation across all White Caves software systems.
  </p>

  <h2 class="doc-section-heading" id="sec-10-1">1. Architecture & Component Standards</h2>
  <p class="doc-body">
    All frontend modules strictly adhere to the <strong>Feature-First 4-Way Folder Segregation Standard</strong>:
  </p>
  <ul>
    <li><code>Component.tsx</code> — Pure declarative JSX view layer.</li>
    <li><code>logic/Component.logic.ts</code> — Hook layer isolating state, business rules, and API handlers.</li>
    <li><code>styles/Component.style.ts</code> — Styled-components implementing White Caves design system tokens.</li>
    <li><code>data/Component.data.ts</code> — Content strings, dictionary mappings, and test data structures.</li>
  </ul>

  <h2 class="doc-section-heading" id="sec-10-3">2. Quality Gates & SQA Certification</h2>
  <p class="doc-body">
    Every release passes automated verification gates (<code>npm run sqa:audit</code>, <code>npm run plans:validate</code>, <code>npm run aegis:health</code>) guaranteeing 100% test pass rate, 0 scanner issues, and clean bundle compilation before deployment to production.
  </p>
</div>
`
  },
];
