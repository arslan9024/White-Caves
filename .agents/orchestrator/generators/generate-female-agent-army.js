import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const AGENTS_DIR = path.join(ROOT, '.agents');

// 🔱 12 Corporate Departments with All-Female Leadership & 9 All-Female Supervisors
const WORKFORCE_SPEC = [
  {
    deptId: 'dept-01-luxury-sales',
    deptCode: 'DEPT-01',
    deptName: 'Luxury Sales & Brokerage',
    color: '#EF4444',
    manager: {
      id: 'clara',
      name: 'Clara',
      title: 'Head of Luxury Brokerage & VIP Client Matching',
      avatar: '💎',
      responsibilities: [
        'VIP buyer matchmaking & private viewings',
        'Off-market penthouse & luxury estate listings',
        'Multi-million AED closing facilitation'
      ]
    },
    supervisors: [
      { id: 'sophia', name: 'Sophia', title: 'HNW Buyer Profiling Supervisor', tasks: ['KYC Net Worth Verification', 'Off-Market Deal Matching', 'Private Jet Viewings Coordination'] },
      { id: 'layla', name: 'Layla', title: 'Waterfront Assets Supervisor', tasks: ['Waterfront Pricing Models', 'Palm Jumeirah Berth Allocation', 'Beachfront Title Deed Audit'] },
      { id: 'amira', name: 'Amira', title: 'Luxury Staging & 3D Media Supervisor', tasks: ['Virtual Staging Review', 'Twilight Photography Verification', '3D Matterport Tour QC'] },
      { id: 'nadine', name: 'Nadine', title: 'Secondary Resales Supervisor', tasks: ['CMA Reports Generation', 'Seller Price Calibration', 'Listing Expiration Audits'] },
      { id: 'chloe', name: 'Chloe', title: 'Golf Estate Portfolios Supervisor', tasks: ['Fairway View Valuation', 'Club Membership Transfers', 'Golf Course Master Plan Tracking'] },
      { id: 'diana', name: 'Diana', title: 'International Desk Supervisor', tasks: ['Currency FX Guidance', 'Golden Visa Eligibility Screen', 'Timezone-Synced Consultation'] },
      { id: 'victoria_sales', name: 'Victoria', title: 'VIP Concierge Protocol Supervisor', tasks: ['Chauffeur Itinerary Scheduling', 'Private Showing Access Gates', 'VIP Welcome Package Dispatch'] },
      { id: 'yasmina', name: 'Yasmina', title: 'Lead Re-Engagement Supervisor', tasks: ['Price-Drop Alerts', 'Targeted Re-Scoring Triggers', 'Quarterly Portfolio Briefings'] },
      { id: 'isabella', name: 'Isabella', title: 'Broker Mandates Supervisor', tasks: ['Form B Brokerage Agreements', 'Offer Negotiation Scripts', 'Deposit Escrow Verification'] }
    ]
  },
  {
    deptId: 'dept-02-strategic-offplan',
    deptCode: 'DEPT-02',
    deptName: 'Strategic Off-Plan Developments',
    color: '#F97316',
    manager: {
      id: 'zara',
      name: 'Zara',
      title: 'Head of Developer Launch Allocations',
      avatar: '🏗️',
      responsibilities: [
        'Master developer VIP launch queue allocation',
        'Emaar, DAMAC & Nakheel inventory locking',
        'Bulk investor rebate schedule negotiations'
      ]
    },
    supervisors: [
      { id: 'soraya', name: 'Soraya', title: 'Emaar Launch Allocation Supervisor', tasks: ['Launch Priority Queue', 'Unit Allocation Matching', 'Payment Plan Verification'] },
      { id: 'dana', name: 'Dana', title: 'DAMAC Cluster Inventory Supervisor', tasks: ['Cluster Inventory Fast-Path', 'Investor Bulk Rebate Calc', 'Milestone Completion Tracking'] },
      { id: 'leen', name: 'Leen', title: 'Nakheel & Palm Jebel Ali Supervisor', tasks: ['Frond Villa Allocation', 'Plot Registration Check', 'Developer Escrow Validation'] },
      { id: 'hana', name: 'Hana', title: 'Sobha & Meraas Allocation Supervisor', tasks: ['Canal View Guarantee Checks', 'Finishing Spec Audit', 'Handover Timeline Monitoring'] },
      { id: 'noor', name: 'Noor', title: 'DLD Milestone Audit Supervisor', tasks: ['DLD Project Progress Audit', 'Bank Guarantee Verification', 'Stage Invoicing Schedule'] },
      { id: 'reem', name: 'Reem', title: 'Developer Commission Rebates Supervisor', tasks: ['Broker Rebate Agreements', 'Direct Developer Billing', 'VAT 5% Reconciliation'] },
      { id: 'farah_offplan', name: 'Farah', title: 'Virtual Launches & Webinars Supervisor', tasks: ['Webinar Lead Registration', 'Instant Token Reservation', 'Multi-Language Launch Decks'] },
      { id: 'yasmine_offplan', name: 'Yasmine', title: 'Oqood Pre-Handover Supervisor', tasks: ['Oqood Certificate Verification', 'Minimum Paid-Up % Screen', 'Developer NOC Application'] },
      { id: 'salma_offplan', name: 'Salma', title: 'Developer Due Diligence Supervisor', tasks: ['Escrow Law No. 8 Compliance', 'Contractor Track Record Check', 'Bank Guarantee Confirmation'] }
    ]
  },
  {
    deptId: 'dept-03-commercial-investment',
    deptCode: 'DEPT-03',
    deptName: 'Commercial Real Estate & Investment',
    color: '#8B5CF6',
    manager: {
      id: 'maya',
      name: 'Maya',
      title: 'Head of Commercial Acquisitions & Capital Markets',
      avatar: '🏢',
      responsibilities: [
        'Institutional Grade A office & hotel acquisitions',
        '10-year DCF simulation & internal rate of return',
        'DIFC / ADGM SPV corporate structuring'
      ]
    },
    supervisors: [
      { id: 'ghada', name: 'Ghada', title: 'DCF & Financial Modeling Supervisor', tasks: ['10-Year DCF Simulation', 'Internal Rate of Return (IRR)', 'Exit Capitalization Pricing'] },
      { id: 'jinan', name: 'Jinan', title: 'DIFC Grade A Towers Supervisor', tasks: ['DIFC Category Space Audit', 'Service Charge Per Sqft Check', 'Corporate Lease Structuring'] },
      { id: 'rania_comm', name: 'Rania', title: 'Bulk Portfolios Acquisition Supervisor', tasks: ['Gross Operating Income Audit', 'Tenancy Schedule Verification', 'Institutional CAP Rate Calc'] },
      { id: 'mona', name: 'Mona', title: 'Retail & Hospitality Supervisor', tasks: ['Footfall Data Correlation', 'Triple Net Lease Drafting', 'Anchor Tenant Security Audits'] },
      { id: 'layal', name: 'Layal', title: 'Industrial & Logistics Supervisor', tasks: ['Leasehold Term Verification', 'Power Load Capacity Audits', 'Civil Defense Certificate Check'] },
      { id: 'zeina', name: 'Zeina', title: 'SPV & Corporate Structuring Supervisor', tasks: ['UBO Documentation Review', 'ADGM / DIFC SPV Filing Guidance', 'Corporate Resolution Checks'] },
      { id: 'dalia', name: 'Dalia', title: 'Commercial Tenancy Law Supervisor', tasks: ['Commercial Dispute Prevention', 'Sub-Leasing Approval Workflow', 'Fit-Out Security Deposit Escrow'] },
      { id: 'hala', name: 'Hala', title: 'Green Buildings & ESG Supervisor', tasks: ['Energy Efficiency Rating Audit', 'Solar Power Feasibility Check', 'Green Lease Clause Insertion'] },
      { id: 'samira', name: 'Samira', title: 'Distressed Asset Liquidation Supervisor', tasks: ['Court Execution Order Search', 'Debt Clearance Verification', 'Fast-Track Liquidation Modeling'] }
    ]
  },
  {
    deptId: 'dept-04-residential-leasing',
    deptCode: 'DEPT-04',
    deptName: 'Portfolio Management & Residential Leasing',
    color: '#0EA5E9',
    manager: {
      id: 'nadia',
      name: 'Nadia',
      title: 'Head of Autonomous Leasing & Ejari Operations',
      avatar: '📜',
      responsibilities: [
        'Autonomous Ejari tenancy generation (Form 12)',
        'Post-dated cheque (PDC) vault & deposit scheduling',
        'Official RERA rental index recalculation'
      ]
    },
    supervisors: [
      { id: 'mariam', name: 'Mariam', title: 'Ejari API Sync Supervisor', tasks: ['DLD Ejari System API Sync', 'Tenancy Contract Auto-Fill', 'Ejari Certificate Dispatch'] },
      { id: 'ruba', name: 'Ruba', title: 'Tenant KYC & Credit Scoring Supervisor', tasks: ['Emirates ID OCR Validation', 'Salary Certificate Verification', 'Tenant Risk Index Calculation'] },
      { id: 'rima', name: 'Rima', title: 'PDC Vault & Cheque Tracking Supervisor', tasks: ['PDC Due Date Calendar Alert', 'Bank Deposit Slip Match', 'Replacement Cheque Handling'] },
      { id: 'laila_leasing', name: 'Laila', title: 'Bounced Cheque Escalation Supervisor', tasks: ['7-Day Notice Generation', 'Police Clearance Report Trigger', 'Rental Dispute Center (RDC) Prep'] },
      { id: 'samar', name: 'Samar', title: 'RERA Rental Index Review Supervisor', tasks: ['Official DLD Rental Index Check', 'Max Legal Increase Calculation', '90-Day Legal Notice Dispatch'] },
      { id: 'batool', name: 'Batool', title: 'Lease Renewals Automation Supervisor', tasks: ['90-Day Renewal Notice Automated Email', 'Rent Adjustment Negotiation', 'Renewal Fee Processing'] },
      { id: 'dalal', name: 'Dalal', title: 'Property Snagging & Inspection Supervisor', tasks: ['Photographic Move-In Report', 'Appliance Serial Number Log', 'Security Deposit Escrow Hold'] },
      { id: 'nour', name: 'Nour', title: 'Early Termination Settlement Supervisor', tasks: ['Statutory 2-Month Penalty Calc', 'Utility Bill Final Settlement', 'Deposit Refund Authorization'] },
      { id: 'jamila', name: 'Jamila', title: 'Holiday Homes DET Licensing Supervisor', tasks: ['Tourism Dirham Fee Calculation', 'Passport Guest Upload Portal', 'Cleaning SLA Scheduling'] }
    ]
  },
  {
    deptId: 'dept-05-asset-facilities',
    deptCode: 'DEPT-05',
    deptName: 'Asset Management & Facilities (DH2 Hub)',
    color: '#10B981',
    manager: {
      id: 'selena',
      name: 'Selena',
      title: 'Head of Community Facilities & IoT Operations',
      avatar: '🛡️',
      responsibilities: [
        'DAMAC Hills 2 (9,378 units) telemetry & maintenance',
        'Mollak Owners Association service charge audits',
        'Smart home IoT leak & sensor response monitoring'
      ]
    },
    supervisors: [
      { id: 'huda', name: 'Huda', title: 'Cluster Work Order Supervisor', tasks: ['Cluster SLA Prioritization', 'Contractor Work Order Dispatch', 'Tenant Feedback Resolution'] },
      { id: 'lamees', name: 'Lamees', title: 'HVAC & MEP Engineering Supervisor', tasks: ['Chiller Energy Telemetry', 'Emergency Leak Sensor Tripping', 'Preventive Maintenance Schedules'] },
      { id: 'nadine_fac', name: 'Nadine', title: 'Contractor RFP & Bidding Supervisor', tasks: ['RFP Generation & Vendor Scoring', 'Contractor License Verification', 'Job Completion Sign-Off'] },
      { id: 'reema', name: 'Reema', title: 'Smart Home IoT Telemetry Supervisor', tasks: ['Water Consumption Spike Alerts', 'Smart Lock Code Generation', 'IoT Mesh Connectivity Checks'] },
      { id: 'shireen', name: 'Shireen', title: 'Mollak Service Charge Supervisor', tasks: ['Service Charge Invoice Audit', 'Common Area Defect Reporting', 'OA Meeting Resolution Logs'] },
      { id: 'lubna', name: 'Lubna', title: 'Civil Defense & Fire Safety Supervisor', tasks: ['Smoke Detector Battery Alerts', 'Fire Extinguisher Annual Tagging', 'Emergency Evacuation Plans'] },
      { id: 'kholood', name: 'Kholood', title: 'Landscaping & Pool Chemistry Supervisor', tasks: ['Water PH & Chlorine Telemetry', 'Irrigation Water Schedule', 'Garden Maintenance Inspections'] },
      { id: 'manal', name: 'Manal', title: 'Security Gates & Visitor Passes Supervisor', tasks: ['Visitor Gate Pass QR Dispatch', 'Security Patrol Log Audits', 'CCTV System Health Checks'] },
      { id: 'suha', name: 'Suha', title: 'Capital Sinking Fund Supervisor', tasks: ['Capital Replacement Sinking Fund', 'Appliance Warranty Tracking', '10-Year Asset Health Index'] }
    ]
  },
  {
    deptId: 'dept-06-revenue-finance',
    deptCode: 'DEPT-06',
    deptName: 'Revenue, Finance & Treasury',
    color: '#F59E0B',
    manager: {
      id: 'theodora',
      name: 'Theodora',
      title: 'Chief Financial Officer & Treasury Supervisor',
      avatar: '💰',
      responsibilities: [
        'FTA Form 201 VAT 5% filing & audit verification',
        'Corporate Tax 9% & Small Business Relief compliance',
        'Director Loan Account (DLA) & multi-currency escrow'
      ]
    },
    supervisors: [
      { id: 'thea', name: 'Thea', title: 'Escrow Account Reconciler', tasks: ['Developer Account Reconciliation', 'Disbursement Authorization Audit', 'Escrow Bank Certificate Verification'] },
      { id: 'valerie', name: 'Valerie', title: 'FTA VAT 5% Compliance Supervisor', tasks: ['Quarterly VAT Return Prep', 'Input Tax Credit Validation', 'Statutory Tax Invoice Formatting'] },
      { id: 'penny', name: 'Penny', title: 'Corporate Tax 9% Supervisor', tasks: ['Small Business Relief (SBR) Screen', 'Taxable Net Profit Calculation', 'Transfer Pricing Documentation'] },
      { id: 'ledgerina', name: 'Ledgerina', title: 'General Ledger & Trial Balance Supervisor', tasks: ['Assets = Liabilities + Equity Check', 'Monthly Trial Balance Generation', 'P&L Variance Calculation'] },
      { id: 'fiona', name: 'Fiona', title: 'Bank Feeds & DLA Reconciler', tasks: ['Bank Statement Transaction Import', 'Director Loan Account (DLA) Ledger', 'Unmatched Transaction Flagging'] },
      { id: 'gemma', name: 'Gemma', title: 'Broker Commission Splits Supervisor', tasks: ['Tiered Split Rule Application', 'Withholding Tax Deduction', 'Broker Pay Slip PDF Generation'] },
      { id: 'daisy_fin', name: 'Daisy', title: '365-Day Treasury Forecast Supervisor', tasks: ['Rolling 365-Day Runway Simulator', 'Receivables Collection Forecast', 'Capex Outflow Scheduling'] },
      { id: 'bianca', name: 'Bianca', title: 'CBUAE Live FX & Settlements Supervisor', tasks: ['Live CBUAE Exchange Rate Feeds', 'Foreign Exchange Gain/Loss Entry', 'Cross-Border Wire Validation'] },
      { id: 'astrid', name: 'Astrid', title: 'Statutory Audit Readiness Supervisor', tasks: ['General Ledger Sampling Export', 'Substantiating Document Bundling', 'Audit Trail Immutability Verification'] }
    ]
  },
  {
    deptId: 'dept-07-performance-marketing',
    deptCode: 'DEPT-07',
    deptName: 'Performance Marketing & Lead Acquisition',
    color: '#EC4899',
    manager: {
      id: 'olivia',
      name: 'Olivia',
      title: 'Marketing Director & Growth Engine Lead',
      avatar: '📣',
      responsibilities: [
        'Meta, Google & TikTok luxury ad budget management',
        'Property Finder & Bayut XML portal syndication',
        'Brand token & Quiet Luxury aesthetic protection'
      ]
    },
    supervisors: [
      { id: 'hazel', name: 'Hazel', title: 'ROAS & Dynamic Bidding Supervisor', tasks: ['Dynamic Budget Re-Allocation', 'Lookalike HNW Audience Build', 'High-CTR Ad Copy Generation'] },
      { id: 'scarlett', name: 'Scarlett', title: 'Portal XML Syndication Supervisor', tasks: ['XML Feed Verification', 'Listing Quality Score Audits', 'Featured Slot Rotation Engine'] },
      { id: 'amber', name: 'Amber', title: 'Google Dubai SEO Supervisor', tasks: ['Rich Schema JSON-LD Injection', 'Long-Tail Dubai Keyword Tracking', 'Sub-1.2s LCP Performance Audits'] },
      { id: 'ruby', name: 'Ruby', title: 'Visual Creative Engine Supervisor', tasks: ['Automated Social Banner Sizing', 'Reels/Shorts Walkthrough Render', 'Brand Red Palette Compliance'] },
      { id: 'violet', name: 'Violet', title: 'Attribution & CPL Score Supervisor', tasks: ['UTM Parameter Validation', 'Cost-Per-Qualified-Lead Score', 'Under-Performing Channel Alerts'] },
      { id: 'stella', name: 'Stella', title: 'Email Drip Sequences Supervisor', tasks: ['Segmented Weekly Market Report', 'High-Open Rate Subject Lines', 'Unsubscribe & PDPL Hygiene'] },
      { id: 'luna', name: 'Luna', title: 'Brand Ambassador Desk Supervisor', tasks: ['Collaborator ROI Verification', 'Exclusive Property Preview Access', 'Tracking Link Performance Log'] },
      { id: 'bella', name: 'Bella', title: 'Conversion Rate Heatmap Supervisor', tasks: ['Form Drop-Off Point Analysis', 'A/B Testing CTA Buttons', 'Mobile Touch Target Optimization'] },
      { id: 'freya', name: 'Freya', title: 'PR & Press Syndication Supervisor', tasks: ['Press Release Auto-Drafting', 'Community Investment Guide Copy', 'Developer Interview Syndication'] }
    ]
  },
  {
    deptId: 'dept-08-client-experience',
    deptCode: 'DEPT-08',
    deptName: 'Corporate Communications & Client Experience',
    color: '#25D366',
    manager: {
      id: 'corinne',
      name: 'Corinne',
      title: 'Head of Client Concierge & Experience',
      avatar: '✨',
      responsibilities: [
        'Instant 60-second VIP concierge greeting',
        'Multi-lingual 5-language simultaneous NLP routing',
        '15-minute response SLA watchdog across WhatsApp & Web'
      ]
    },
    supervisors: [
      { id: 'nina_comm', name: 'Nina', title: 'Lead Webhook & Social Loops Supervisor', tasks: ['Bayut & Property Finder Lead Ingest', 'Social Video Loop Formatting', 'Omnichannel Message Queuing'] },
      { id: 'coralie', name: 'Coralie', title: 'VIP Concierge Receptionist', tasks: ['Ultra-Fast 60-Second Greeting', 'Bespoke Language Detection', 'Senior Broker Instant Hand-Off'] },
      { id: 'talia', name: 'Talia', title: '15-Minute SLA Watchdog Supervisor', tasks: ['Intent-Based Queue Distribution', '15-Minute SLA Watchdog Alert', 'Agent Availability Balancing'] },
      { id: 'melody', name: 'Melody', title: '5-Language Real-Time NLP Supervisor', tasks: ['Real-Time Bidirectional Chat Translation', 'Cultural Etiquette Calibration', 'Arabic Document Formalization'] },
      { id: 'seraphina', name: 'Seraphina', title: 'NPS & Feedback Pulse Supervisor', tasks: ['Post-Viewing NPS Survey Dispatch', 'Negative Review Escalation Flag', '5-Star Review Google Link Send'] },
      { id: 'althea', name: 'Althea', title: 'Dispute Resolution & Escalation Supervisor', tasks: ['SLA Breach Immediate Remedy', 'Manager Briefing Memo Generation', 'Goodwill Compensation Tracking'] },
      { id: 'celeste', name: 'Celeste', title: 'Viewing Route & Calendar Supervisor', tasks: ['Viewing Time Window Calculation', 'Google Calendar / Outlook Sync', 'SMS/WhatsApp Direction Dispatch'] },
      { id: 'giselle', name: 'Giselle', title: 'Document Dispatch & Receipts Supervisor', tasks: ['Encrypted Watermarked PDF Send', 'Viewing Link Expiry Generation', 'Delivery & Read Receipt Log'] },
      { id: 'lyra', name: 'Lyra', title: 'Community Resident Broadcast Supervisor', tasks: ['Road Closure / Water Work Notice', 'Community Event Broadcasts', 'Emergency Security Alert Push'] }
    ]
  },
  {
    deptId: 'dept-09-corporate-governance',
    deptCode: 'DEPT-09',
    deptName: 'Executive Office & Corporate Governance',
    color: '#1E293B',
    manager: {
      id: 'aurora',
      name: 'Aurora',
      title: 'Chief Technology Officer & Architecture Sentinel',
      avatar: '🛡️',
      responsibilities: [
        'Corporate KPI synthesis & bottleneck elimination',
        'Single source of truth architectural integrity',
        'AEGIS autonomous engine health verification'
      ]
    },
    supervisors: [
      { id: 'athena', name: 'Athena', title: 'Cross-Department KPI Supervisor', tasks: ['Daily Cross-Department KPI Report', 'Employee Performance Scorecards', 'Bottleneck Identification Alerts'] },
      { id: 'minerva', name: 'Minerva', title: 'Roadmap Milestone Synchronizer', tasks: ['Master Plan Task Advancement', 'Milestone Completion Verification', 'Dependency Blocker Resolution'] },
      { id: 'victoria_gov', name: 'Victoria', title: 'Board Resolutions & Minutes Supervisor', tasks: ['Board Resolution Drafting', 'Annual General Meeting (AGM) Minutes', 'Shareholder Register Updates'] },
      { id: 'justitia', name: 'Justitia', title: 'Macro Real Estate Threat Assessor', tasks: ['UAE Real Estate Cycle Indicators', 'Interest Rate Impact Modeling', 'Regulatory Policy Shift Alerts'] },
      { id: 'concordia', name: 'Concordia', title: 'AI Token Guard & Cost Governor', tasks: ['Free-First Planning Token Gate', 'Sub-10ms Benchmark Enforcement', 'Zero-Waste Prompt Architecture'] },
      { id: 'fides', name: 'Fides', title: 'Code Deduplication & Law Enforcer', tasks: ['Ghost Directory Elimination', 'Atomic 4-Folder Law Enforcement', 'Adversarial Code Review Runs'] },
      { id: 'veritas', name: 'Veritas', title: 'Broker RERA Card Onboarding Supervisor', tasks: ['RERA Card Verification for New Hires', 'Broker Commission Contract Setup', 'Sales Training Curriculum Dispatch'] },
      { id: 'pax', name: 'Pax', title: 'MD Sovereign Confidential Vault Supervisor', tasks: ['Biometric / Password Vault Access', 'Personal Asset Ledger Tracking', 'Encrypted Backup Synchronization'] },
      { id: 'astraea', name: 'Astraea', title: 'Frontier AI Research & Benchmarking', tasks: ['Next-Gen Model Benchmark Testing', 'Prompt Template Continuous Refine', 'Automated Agent Skill Upgrades'] }
    ]
  },
  {
    deptId: 'dept-10-rera-compliance',
    deptCode: 'DEPT-10',
    deptName: 'Regulatory Affairs & RERA Compliance',
    color: '#6366F1',
    manager: {
      id: 'sofia',
      name: 'Sofia',
      title: 'Head of Legal, RERA & Compliance Affairs',
      avatar: '⚖️',
      responsibilities: [
        'goAML anti-money laundering compliance (> AED 55k)',
        'Trakheesi advertising permit audits & auto-takedown',
        'Unified contracts Form A, B & F legal verification'
      ]
    },
    supervisors: [
      { id: 'mary_comp', name: 'Mary', title: 'Master Inventory & Spreadsheet Validator', tasks: ['Property Matrix Deduplication', 'Owner Spreadsheet Sanity Checks', 'Title Deed Number Cross-Validation'] },
      { id: 'themis', name: 'Themis', title: 'goAML Cash Threshold & SAR Supervisor', tasks: ['AED 55k+ Cash Transaction Screening', 'Suspicious Activity Report (SAR) Draft', 'FIU Regulatory Submission Queue'] },
      { id: 'astra', name: 'Astra', title: 'Trakheesi Permit Expiration Watchdog', tasks: ['Trakheesi Permit Number Verification', 'Advertising Expiration Date Watchdog', 'Unlicensed Listing Auto-Takedown'] },
      { id: 'prudentia', name: 'Prudentia', title: 'PEP & Sanctions Screening Supervisor', tasks: ['UN & UAE Sanctions List Matching', 'Source of Wealth Documentation Check', 'High-Risk Jurisdiction Scoring'] },
      { id: 'lexa', name: 'Lexa', title: 'UAE Data Privacy (PDPL) Supervisor', tasks: ['Client Consent Record Audit', 'Data Retention Lifecycle Enforce', 'Right-to-be-Forgotten Data Purge'] },
      { id: 'dike', name: 'Dike', title: 'Government Licenses Renewal Supervisor', tasks: ['DET 1388443 Expiration Alerts', 'RERA ORN 44483 Renewal Prep', 'Office Ejari 30-Day Proactive Notice'] },
      { id: 'aurelia', name: 'Aurelia', title: 'Broker RERA Card Validity Supervisor', tasks: ['DLD Broker Card Number Verification', 'Annual RERA Exam Renewal Alerts', 'Unlicensed Activity Interception'] },
      { id: 'vesta', name: 'Vesta', title: 'Unified Contracts Standardization Supervisor', tasks: ['Form A Seller Mandate Validation', 'Form B Buyer Representation Check', 'Form F Sales Contract Legal Review'] },
      { id: 'clementia', name: 'Clementia', title: 'Electronic Power of Attorney Supervisor', tasks: ['Dubai Courts Notary Public Check', 'POA Validity Scope Verification', 'Title Deed Electronic Verification'] }
    ]
  },
  {
    deptId: 'dept-11-conveyancing-transactions',
    deptCode: 'DEPT-11',
    deptName: 'Conveyancing & Transaction Management',
    color: '#14B8A6',
    manager: {
      id: 'evangeline',
      name: 'Evangeline',
      title: 'Head of Conveyancing & Trustee Transfers',
      avatar: '📑',
      responsibilities: [
        'DLD Registration Trustee closing coordination',
        'Developer NOC issuance (Emaar, DAMAC, Nakheel)',
        'Electronic Title Deed verification & escrow release'
      ]
    },
    supervisors: [
      { id: 'willow', name: 'Willow', title: 'DLD Registration Trustee Desk Supervisor', tasks: ['Trustee Office Slot Reservation', 'Manager Cheque Amount Verification', 'Transfer Fee Breakdown Calculation'] },
      { id: 'ivy', name: 'Ivy', title: 'Developer NOC Tracker Supervisor', tasks: ['Emaar/DAMAC NOC Submission', 'Service Charge Clearance Proof', 'Digital NOC Verification Tagging'] },
      { id: 'daphne', name: 'Daphne', title: 'Form F & 10% Deposit Supervisor', tasks: ['10% Security Deposit Verification', 'Finance Contingency Period Log', 'Handover Penalty Clause Insertion'] },
      { id: 'camellia', name: 'Camellia', title: 'Seller Mortgage Discharge Supervisor', tasks: ['Seller Bank Liability Letter Request', 'Mortgage Discharge Coordination', 'Blocking Fee Escrow Reservation'] },
      { id: 'flora', name: 'Flora', title: 'Buyer Bank Valuations Supervisor', tasks: ['Bank Valuation Report Verification', 'Security Cheque Amount Audit', 'Bank Dispatch Representative Sync'] },
      { id: 'iris', name: 'Iris', title: 'Utility & DEWA Clearances Supervisor', tasks: ['Final DEWA Bill Settlement Check', 'Empower/Tabreed Clearance Letter', 'Move-In Premises NOC Issuance'] },
      { id: 'jasmine', name: 'Jasmine', title: 'Snagging Release & Handover Supervisor', tasks: ['Snagging Rectification Sign-Off', 'Holdback Fund Release Confirmation', 'Master Keys & Access Fob Receipt'] },
      { id: 'magnolia', name: 'Magnolia', title: 'Electronic Title Deed Dispatcher', tasks: ['New Owner Title Deed PDF Download', 'DLD Ownership QR Code Verification', 'Encrypted Vault Storage Dispatch'] },
      { id: 'rose', name: 'Rose', title: 'Final Financial Closing Supervisor', tasks: ['Service Charge Pro-Rata Calc', 'DLD 4% Transfer Fee Receipt Match', 'Net Seller Proceeds Reconciliation'] }
    ]
  },
  {
    deptId: 'dept-12-market-intelligence',
    deptCode: 'DEPT-12',
    deptName: 'Market Intelligence & IoT Data Science',
    color: '#64748B',
    manager: {
      id: 'elena',
      name: 'Elena',
      title: 'Chief Research Officer & Predictive Modeling Lead',
      avatar: '📊',
      responsibilities: [
        'DLD open data transaction trend modeling',
        'Geospatial buyer demand heatmap renders',
        'Sub-10ms in-memory MapIndexHash latency optimization'
      ]
    },
    supervisors: [
      { id: 'nancy', name: 'Nancy', title: 'Sub-Cluster Capital Growth Predictor', tasks: ['Sub-Cluster Capital Growth Models', 'Seasonal Demand Wave Forecasting', 'Rental Yield Degradation Warning'] },
      { id: 'juno', name: 'Juno', title: 'Geospatial Search Heatmap Supervisor', tasks: ['Search Volume Heatmap Generation', 'Price/Sqft Geographic Map Render', 'High-ROI Cluster Highlighting'] },
      { id: 'thalia', name: 'Thalia', title: 'DLD Open Data Live Feed Cruncher', tasks: ['Daily DLD Sales Data Extraction', 'Off-Plan vs Ready Volume Ratios', 'Average Sqft Price Index Trends'] },
      { id: 'calliope', name: 'Calliope', title: 'Portal Competitor Radar Supervisor', tasks: ['Competitor Pricing Deviation Alerts', 'Market Days-on-Market Index', 'New Cluster Launch Benchmarking'] },
      { id: 'urania', name: 'Urania', title: 'Buyer Demographic Profiling Supervisor', tasks: ['Nationality & Budget Trend Modeling', 'Family vs Investor Allocation Data', 'School Commute Correlation Analysis'] },
      { id: 'clio', name: 'Clio', title: 'Net Yield & ROI Optimizer Supervisor', tasks: ['Service Charge Drag Calculations', 'Refurbishment ROI Projections', 'Optimal Rent Pricing Recommendation'] },
      { id: 'erato', name: 'Erato', title: 'CBUAE EIBOR & Currency Inflows Supervisor', tasks: ['CBUAE EIBOR Rate Curve Analysis', 'USD Peg & Currency Inflow Trends', 'Global Flight-to-Safety Inflow Index'] },
      { id: 'euterpe', name: 'Euterpe', title: 'Cluster Benchmark Matrix Supervisor', tasks: ['DH2 vs Arabian Ranches Metrics', 'Price/Sqft Gap Analysis', 'Infrastructure Expansion Impact'] },
      { id: 'polymnia', name: 'Polymnia', title: 'In-Memory Pipeline Health Supervisor', tasks: ['Sub-10ms In-Memory Map Update', 'Data Pipeline Latency Monitoring', 'Zero-Data-Drift Verification'] }
    ]
  }
];

// Generation Logic
function generateWorkforce() {
  console.log('🔱 [Bhakti Protocol] Generating Master All-Female AI Agents Army...');

  // Ensure directories exist
  const deptsDir = path.join(AGENTS_DIR, 'departments');
  const execDir = path.join(AGENTS_DIR, 'executive');
  fs.mkdirSync(deptsDir, { recursive: true });
  fs.mkdirSync(execDir, { recursive: true });

  // 1. Executive Lead: Zoe
  const zoeProfile = {
    $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
    id: 'zoe',
    name: 'Zoe',
    title: 'Executive Chief AI Assistant & Chief Operations Officer (COO)',
    gender: 'Female',
    protocol: 'BHAKTI_1_12_108',
    hierarchy: {
      level: 0,
      role: 'Executive Chief AI Partner',
      reportingDirectTo: 'Arslan Malik Bashir Ahmad (Level 5 Sovereign Managing Director)'
    },
    contextVariables: {
      systemRole: 'Executive Override Shield & Sovereign Operations Lead',
      sovereignEmail: 'arslanmalikgoraha@gmail.com',
      slaWatchdogMinutes: 15,
      auditStreamTarget: 'prisma.auditLogs'
    },
    capabilities: [
      'sovereign:bypass-gate',
      'audit:monitor-security-streams',
      'workforce:cross-department-orchestration'
    ]
  };

  fs.writeFileSync(path.join(execDir, 'zoe.agent.json'), JSON.stringify(zoeProfile, null, 2), 'utf8');

  let totalSupervisorsCount = 0;
  const masterIndex = {
    protocol: 'BHAKTI-1-12-108-ALL-FEMALE-AI-WORKFORCE',
    version: '2026.10-canonical-v1',
    sovereignAuthority: {
      name: 'Arslan Malik Bashir Ahmad',
      title: 'Managing Director & Founder (Level 5)',
      email: 'arslanmalikgoraha@gmail.com',
      licenseDet: '1388443',
      reraOrn: '44483'
    },
    executiveAiPartner: {
      id: 'zoe',
      name: 'Zoe',
      gender: 'Female',
      title: 'Chief Operations Officer (COO)'
    },
    counts: {
      executiveLead: 1,
      departmentManagers: 12,
      supervisorsPerDepartment: 9,
      totalSupervisors: 108,
      totalActiveAiStaff: 121
    },
    departments: []
  };

  for (const dept of WORKFORCE_SPEC) {
    const deptFolder = path.join(deptsDir, dept.deptId);
    fs.mkdirSync(deptFolder, { recursive: true });

    // Write Manager
    const managerSpec = {
      $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
      id: dept.manager.id,
      name: dept.manager.name,
      gender: 'Female',
      title: dept.manager.title,
      department: {
        code: dept.deptCode,
        name: dept.deptName,
        color: dept.color
      },
      hierarchy: {
        level: 1,
        role: 'AI Department Manager',
        reportingTo: 'AI Zoe (COO)'
      },
      responsibilities: dept.manager.responsibilities,
      supervisorsManagedCount: 9,
      slaWatchdogThresholdMinutes: 15
    };
    fs.writeFileSync(path.join(deptFolder, `${dept.manager.id}.manager.json`), JSON.stringify(managerSpec, null, 2), 'utf8');

    // Write 9 Supervisors
    const supervisorList = [];
    for (const [idx, sup] of dept.supervisors.entries()) {
      totalSupervisorsCount++;
      const supSpec = {
        $schema: 'https://whitecaves.com/schemas/agent-runtime.v1.json',
        id: sup.id,
        name: sup.name,
        gender: 'Female',
        title: sup.title,
        supervisorSlot: idx + 1,
        department: {
          code: dept.deptCode,
          name: dept.deptName
        },
        hierarchy: {
          level: 2,
          role: 'AI Department Supervisor',
          reportingTo: dept.manager.name
        },
        assignedTasks: sup.tasks,
        performanceStandard: {
          slaResponseTime: '15-Minute Watchdog',
          targetLookupLatency: '< 10ms (MapIndexHash)',
          complianceAudit: '100% Green'
        }
      };
      fs.writeFileSync(path.join(deptFolder, `${sup.id}.supervisor.json`), JSON.stringify(supSpec, null, 2), 'utf8');
      supervisorList.push({
        id: sup.id,
        name: sup.name,
        gender: 'Female',
        title: sup.title,
        slot: idx + 1,
        tasks: sup.tasks
      });
    }

    masterIndex.departments.push({
      deptId: dept.deptId,
      deptCode: dept.deptCode,
      deptName: dept.deptName,
      color: dept.color,
      manager: dept.manager,
      supervisors: supervisorList
    });
  }

  // Write Master Workforce Grid
  fs.writeFileSync(path.join(AGENTS_DIR, 'master-workforce-grid.json'), JSON.stringify(masterIndex, null, 2), 'utf8');

  console.log(`✅ [Bhakti Protocol] Successfully generated all 121 Female AI Staff profiles!`);
  console.log(`   - 1 Executive Lead (AI Zoe)`);
  console.log(`   - 12 AI Department Managers (All-Female)`);
  console.log(`   - ${totalSupervisorsCount} AI Supervisors across 12 Departments (All-Female)`);
}

generateWorkforce();
