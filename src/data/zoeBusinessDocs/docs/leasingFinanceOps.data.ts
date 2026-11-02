import type { BusinessDocItem } from '../types';

export const leasingFinanceOpsDocs: BusinessDocItem[] = [
  {
    id: 'doc-zoe-04',
    code: 'DOC-BUS-04',
    title: 'Ejari Tenancy Lifecycle, PDC Vault & Bounced Cheque Protocol',
    category: 'leasing',
    departmentFloor: 'Floor 10 — Leasing & Tenancy Suite',
    primaryAssistant: '3.4 Zoe AI & 3.13 Daisy Leasing',
    lastUpdated: '2026-08-26',
    summary:
      'Standard operating procedures for Ejari tenancy registration, RERA rent calculator, PDC vaulting, and bounced cheque legal notice execution.',
    tags: ['Ejari', 'Tenancy Contract', 'PDC Vault', 'Bounced Cheque', 'Form 12'],
    subItems: [
      {
        id: 'sec-4-1',
        title: '1. Standard Unified Tenancy Contract',
        description: 'Dubai Rental Law No. 26 of 2007 (as amended by Law 33 of 2008).',
      },
      {
        id: 'sec-4-2',
        title: '2. Post-Dated Cheque (PDC) Vault Operations',
        description: 'Physical cheque custody, date triggers, and clearance logging.',
      },
      {
        id: 'sec-4-3',
        title: '3. Bounced Cheque Legal Protocol',
        description: 'Civil execution via Dubai Courts and statutory demand letters.',
      },
      {
        id: 'sec-4-4',
        title: '4. Legal Notice & Eviction Playbook (Form 12)',
        description: '12-month notarized notice requirements under statutory conditions.',
      },
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
    Rental payments in Dubai are traditionally paid via 1, 2, 4, or 6 post-dated bank cheques (PDCs). The White Caves PDC Vault enforces double-entry verification with automated 7-day pre-deposit alerts audited by 3.14 Theodora AI.
  </p>
</div>
`,
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
    summary:
      'Master Chart of Accounts across 5 core categories (COGS, Operating Expenses, Current Liabilities, Fixed Assets, Current Assets) with all 37+ classified sub-items, UAE FTA 5% VAT rules, and 3-Year Pro-Forma revenue model.',
    tags: [
      'Chart of Accounts',
      'Expense Categories',
      'Payroll Sub-Items',
      'FTA VAT 5%',
      'Theodora CFO',
    ],
    subItems: [
      {
        id: 'sec-5-1',
        title: '1. Standardized Chart of Accounts (5 Master Classes)',
        description: 'COGS, Operating Expenses, Current Liabilities, Fixed Assets, Current Assets.',
      },
      {
        id: 'sec-5-2',
        title: '2. Itemized Sub-Items & General Ledger Mapping',
        description: 'All 37+ sub-items with ledger codes, UAE VAT rate, and CT deductibility.',
      },
      {
        id: 'sec-5-3',
        title: '3. UAE Federal Tax Authority (FTA) 5% VAT Rules',
        description: 'Tax Registration Number (TRN), input VAT, and quarterly filing.',
      },
      {
        id: 'sec-5-4',
        title: '4. 3-Year Pro-Forma Revenue Model (AED 39M–100M)',
        description: 'Conservative, Base, and Aggressive scenario financial projections.',
      },
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
`,
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
    summary:
      'Anti-Money Laundering (AML) goAML reporting, KYC verification, UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021).',
    tags: ['AML/KYC', 'goAML', 'UAE PDPL', 'Data Protection', 'Compliance Audit'],
    subItems: [
      {
        id: 'sec-6-1',
        title: '1. UAE Federal AML/CFT Statutory Mandate',
        description: 'Cabinet Resolution No. (10) of 2019 and goAML portal submission triggers.',
      },
      {
        id: 'sec-6-2',
        title: '2. Ultimate Beneficial Owner (UBO) Identification',
        description: 'Resolution No. 58 of 2020 on UBO declaration and register maintenance.',
      },
      {
        id: 'sec-6-3',
        title: '3. UAE Personal Data Protection Law (PDPL)',
        description:
          'Federal Decree-Law No. 45 of 2021 data subject rights and cross-border transfers.',
      },
      {
        id: 'sec-6-4',
        title: '4. Suspicious Activity Report (SAR) Escalation',
        description: 'Automated high-risk transaction detection and FIU reporting.',
      },
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
`,
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
    summary:
      'Detailed flowcharts and standard operating procedures for lead qualification, WhatsApp AI bot routing, Form F signing, and closing.',
    tags: ['Lead Pipeline', 'WhatsApp Flow', 'Form F Signing', 'Closing SOP', 'Agent Handoff'],
    subItems: [
      {
        id: 'sec-7-1',
        title: '1. Inbound WhatsApp Lead Qualification Flow',
        description: 'Nina AI bot intent capture, Clara deduplication, and agent assignment.',
      },
      {
        id: 'sec-7-2',
        title: '2. Secondary Resale Form F Contract Lifecycle',
        description: 'Seller Form A verification, Buyer Form B, MOU signing, and NOC.',
      },
      {
        id: 'sec-7-3',
        title: '3. Property Viewing & Chauffeur Coordination',
        description: 'Automated calendar booking, chauffeur dispatch, and digital feedback.',
      },
      {
        id: 'sec-7-4',
        title: '4. DLD Trustee Office Conveyancing & Handover',
        description: 'Final title deed transfer, manager cheques, and key handover.',
      },
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
`,
  },

  // -------------------------------------------------------------
  // DOC-BUS-08: 02_services & 02_services_and_infrastructure
  // -------------------------------------------------------------,
];
