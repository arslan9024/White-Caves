/**
 * assistants108Registry.data.ts — 🔱 The Canonical 1-12-108 Hierarchy Protocol Master Registry
 * White Caves Real Estate LLC — Global Sovereign AI Command Grid
 *
 * PROTOCOL HIERARCHY:
 * Level 0: 1 Managing Director (Human) paired with 1 Executive Chief AI Assistant: "Zoe"
 * Level 1: 12 Corporate Departments with 12 Human Department Managers + 12 AI Department Manager Assistants
 * Level 2: 108 Operational Supervisors (12 Departments × 9 Supervisors each)
 * Total Active AI Mesh: 1 (Zoe) + 12 (Managers) + 108 (Supervisors) = 121 Autonomous AI Agents
 */

export interface DepartmentDef {
  id: string;
  name: string;
  code: string;
  color: string;
  gradient: string;
  icon: string;
  description: string;
  managerAi: {
    id: string;
    name: string;
    title: string;
    avatar: string;
  };
}

export interface SupervisorDef {
  id: string;
  name: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName: string;
  supervisorIndex: number; // 1 to 9
  icon: string;
  color: string;
  avatar: string;
  status: 'active' | 'optimal' | 'standby';
  description: string;
  specialty: string;
  assignedTasks: string[];
  capabilities: string[];
  slaResponseTime: string;
  metrics: {
    accuracyRate: number;
    tasksCompletedToday: number;
    systemHealth: 'optimal' | 'good' | 'warning';
  };
}

export interface ExecutiveCommandDef {
  managingDirector: {
    name: string;
    title: string;
    clearance: string;
    licenseDet: string;
    reraOrn: string;
  };
  executiveAi: {
    id: string;
    name: string;
    code: string;
    title: string;
    avatar: string;
    role: string;
    responsibilities: string[];
  };
}

// ── LEVEL 0: EXECUTIVE COMMAND (1 MD + 1 ZOE) ─────────────────────────────────
export const EXECUTIVE_COMMAND_1: ExecutiveCommandDef = {
  managingDirector: {
    name: 'ARSLAN MALIK BASHIR AHMAD',
    title: 'Managing Director & Founder',
    clearance: 'Level 5 Sovereign Founder Clearance',
    licenseDet: '1388443',
    reraOrn: '44483',
  },
  executiveAi: {
    id: 'zoe',
    name: 'AI Zoe',
    code: 'AI_ZOE_COO',
    title: 'Chief Operations Officer (COO) Executive AI',
    avatar: 'https://ui-avatars.com/api/?name=Zoe+COO&background=1E293B&color=EF4444',
    role: 'Direct Executive Partner to Managing Director',
    responsibilities: [
      'Autonomous orchestration of all 12 corporate departments',
      'Real-time aggregation of multi-agent tasks and 15-minute SLA tracking',
      'Strategic roadmap execution and high-level company governance',
      'Cross-departmental budget approval and statutory compliance verification',
    ],
  },
};

// ── LEVEL 1: 12 CORPORATE DEPARTMENTS & 12 AI MANAGERS ────────────────────────
export const CORPORATE_DEPARTMENTS_12: DepartmentDef[] = [
  {
    id: 'luxury_sales',
    name: 'Luxury Sales & Brokerage',
    code: 'DEPT-01',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    icon: 'TrendingUp',
    description: 'High-net-worth deal qualification, closing automation, and VIP investor matchmaking across Dubai.',
    managerAi: { id: 'mgr_clara', name: 'AI Clara', title: 'Director of Luxury Sales', avatar: 'https://ui-avatars.com/api/?name=Clara+Sales&background=EF4444&color=fff' },
  },
  {
    id: 'off_plan',
    name: 'Strategic Off-Plan Developments',
    code: 'DEPT-02',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    icon: 'Building',
    description: 'Developer launch prediction, inventory allocation, and commission rebate optimization.',
    managerAi: { id: 'mgr_zayed', name: 'AI Zayed', title: 'Director of Off-Plan Developments', avatar: 'https://ui-avatars.com/api/?name=Zayed+OffPlan&background=F97316&color=fff' },
  },
  {
    id: 'commercial_investment',
    name: 'Commercial Real Estate & Investment',
    code: 'DEPT-03',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    icon: 'Briefcase',
    description: 'Bulk asset valuation, institutional deal sorting, and ROI yield projection.',
    managerAi: { id: 'mgr_maktoum', name: 'AI Maktoum', title: 'Director of Commercial Investments', avatar: 'https://ui-avatars.com/api/?name=Maktoum+Commercial&background=8B5CF6&color=fff' },
  },
  {
    id: 'residential_leasing',
    name: 'Portfolio Management & Residential Leasing',
    code: 'DEPT-04',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    icon: 'Key',
    description: 'Autonomous Ejari contract generation, tenant screening, and lease renewal processing.',
    managerAi: { id: 'mgr_nadia', name: 'AI Nadia', title: 'Director of Residential Leasing', avatar: 'https://ui-avatars.com/api/?name=Nadia+Leasing&background=0EA5E9&color=fff' },
  },
  {
    id: 'asset_facilities',
    name: 'Asset Management & Facilities (DH2 Hub)',
    code: 'DEPT-05',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    icon: 'Wrench',
    description: 'IoT telemetry dispatching, DAMAC Hills 2 maintenance routing, and contractor bidding.',
    managerAi: { id: 'mgr_sentinel', name: 'AI Sentinel', title: 'Director of Asset & Facility Operations', avatar: 'https://ui-avatars.com/api/?name=Sentinel+DH2&background=10B981&color=fff' },
  },
  {
    id: 'revenue_treasury',
    name: 'Revenue, Finance & Treasury',
    code: 'DEPT-06',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    icon: 'DollarSign',
    description: 'Multi-currency reconciliation, VAT 5% filing, Corporate Tax 9%, and DLD escrow audit tracking.',
    managerAi: { id: 'mgr_theodora', name: 'AI Theodora', title: 'Chief Financial Director', avatar: 'https://ui-avatars.com/api/?name=Theodora+Finance&background=F59E0B&color=fff' },
  },
  {
    id: 'performance_marketing',
    name: 'Performance Marketing & Lead Acquisition',
    code: 'DEPT-07',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    icon: 'Megaphone',
    description: 'CPL optimization, automated Meta/Google ad bidding, and portal syndication.',
    managerAi: { id: 'mgr_olivia', name: 'AI Olivia', title: 'Director of Performance Marketing', avatar: 'https://ui-avatars.com/api/?name=Olivia+Marketing&background=EC4899&color=fff' },
  },
  {
    id: 'corporate_comms',
    name: 'Corporate Communications & Client Experience',
    code: 'DEPT-08',
    color: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    icon: 'MessageSquare',
    description: 'WhatsApp 15-minute SLA tracking, multi-lingual concierge, and VIP intake desk.',
    managerAi: { id: 'mgr_corinne', name: 'AI Corinne', title: 'Director of Client Experience', avatar: 'https://ui-avatars.com/api/?name=Corinne+Comms&background=25D366&color=fff' },
  },
  {
    id: 'executive_office',
    name: 'Executive Office & Corporate Governance',
    code: 'DEPT-09',
    color: '#1E293B',
    gradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    icon: 'Shield',
    description: 'Managing Director executive briefing, corporate audit logs, and strategic roadmap orchestration.',
    managerAi: { id: 'mgr_aurora', name: 'AI Aurora', title: 'Chief Technology & Architecture Director', avatar: 'https://ui-avatars.com/api/?name=Aurora+CTO&background=1E293B&color=fff' },
  },
  {
    id: 'regulatory_rera',
    name: 'Regulatory Affairs & RERA Compliance',
    code: 'DEPT-10',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    icon: 'FileCheck',
    description: 'Trakheesi permit matching, UAE PDPL validation, and Anti-Money Laundering (goAML) screening.',
    managerAi: { id: 'mgr_sofia', name: 'AI Sofia', title: 'Director of Legal & Regulatory Affairs', avatar: 'https://ui-avatars.com/api/?name=Sofia+Legal&background=6366F1&color=fff' },
  },
  {
    id: 'conveyancing_transactions',
    name: 'Conveyancing & Transaction Management',
    code: 'DEPT-11',
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    icon: 'Stamp',
    description: 'Developer NOC verification, Form F contract generation, and DLD trustee appointment coordination.',
    managerAi: { id: 'mgr_evangeline', name: 'AI Evangeline', title: 'Director of Conveyancing', avatar: 'https://ui-avatars.com/api/?name=Evangeline+NOC&background=14B8A6&color=fff' },
  },
  {
    id: 'market_iot_intelligence',
    name: 'Market Intelligence & IoT Data Science',
    code: 'DEPT-12',
    color: '#64748B',
    gradient: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
    icon: 'BarChart3',
    description: 'Dubai Land Department transaction index crunching, price forecasting, and community demand heatmaps.',
    managerAi: { id: 'mgr_elena', name: 'AI Elena', title: 'Chief Research & Intelligence Director', avatar: 'https://ui-avatars.com/api/?name=Elena+CRO&background=64748B&color=fff' },
  },
];

// Helper to generate 9 dedicated supervisors for each department (12 * 9 = 108)
function build108Supervisors(): SupervisorDef[] {
  const supervisors: SupervisorDef[] = [];

  const SUPERVISOR_TAXONOMY: Record<string, Array<{ name: string; title: string; specialty: string; tasks: string[] }>> = {
    luxury_sales: [
      { name: 'AI Sophia', title: 'HNW Buyer Profiling Supervisor', specialty: 'VIP Investor Discovery', tasks: ['KYC Net Worth Verification', 'Off-Market Deal Matching', 'Private Jet Viewings Coordination'] },
      { name: 'AI Hamdan', title: 'Penthouse & Villa Closing Supervisor', specialty: 'Luxury Contract Closing', tasks: ['Form B Brokerage Agreements', 'Offer Negotiation Scripts', 'Deposit Escrow Verification'] },
      { name: 'AI Layla', title: 'Waterfront Asset Supervisor', specialty: 'Palm Jumeirah & Marina Portfolios', tasks: ['Exclusive Waterfront Pricing', 'Marina Berth Allocation', 'Beachfront Title Deed Audit'] },
      { name: 'AI Rashid', title: 'Golf Estate Portfolio Supervisor', specialty: 'Jumeirah Golf & Hills Estates', tasks: ['Fairway View Valuation', 'Club Membership Transfers', 'Golf Course Master Plan Tracking'] },
      { name: 'AI Marcus', title: 'International Client Desk Supervisor', specialty: 'Cross-Border Inbound Investors', tasks: ['Currency FX Guidance', 'Golden Visa Eligibility Screen', 'Timezone-Synced Consultation'] },
      { name: 'AI Amira', title: 'Luxury Staging & Presentation Supervisor', specialty: 'High-End Visual Standards', tasks: ['Virtual Staging Review', 'Twilight Photography Verification', '3D Matterport Tour QC'] },
      { name: 'AI Karim', title: 'VIP Client Concierge Supervisor', specialty: 'White-Glove Buyer Relations', tasks: ['Chauffeur Itinerary Scheduling', 'Private Showing Access Gates', 'VIP Welcome Package Dispatch'] },
      { name: 'AI Nadine', title: 'Secondary Market Valuation Supervisor', specialty: 'Prime Resale Pricing Comps', tasks: ['Comparative Market Analysis (CMA)', 'Seller Expectation Calibration', 'Listing Expiration Audits'] },
      { name: 'AI Tariq', title: 'Lead Re-Engagement Supervisor', specialty: 'Dormant High-Value Leads', tasks: ['Automated Price-Drop Alerts', 'Targeted Re-Scoring Triggers', 'Quarterly Portfolio Briefings'] },
    ],
    off_plan: [
      { name: 'AI Rachid', title: 'Emaar Launch Allocation Supervisor', specialty: 'Emaar Master Developments', tasks: ['Launch Priority Token Queue', 'Unit Allocation Matching', 'Payment Plan Verification'] },
      { name: 'AI Falah', title: 'DAMAC Master Cluster Supervisor', specialty: 'DAMAC Lagoons & Riverside', tasks: ['Cluster Inventory Fast-Path', 'Investor Bulk Rebate Calc', 'Milestone Completion Tracking'] },
      { name: 'AI Soraya', title: 'Nakheel & Palm Jebel Ali Supervisor', specialty: 'Mega-Island Off-Plan Assets', tasks: ['Frond Villa Allocation', 'Plot Registration Check', 'Developer Escrow Account Validation'] },
      { name: 'AI Zaid', title: 'Sobha & Meraas Luxury Supervisor', specialty: 'Urban High-Density Luxury', tasks: ['Canal View Guarantee Checks', 'Finishing Spec Audit', 'Handover Timeline Monitoring'] },
      { name: 'AI Dana', title: 'Off-Plan Payment Milestone Supervisor', specialty: 'Construction Linked Payment Plans', tasks: ['DLD Project Progress Audit', 'Bank Guarantee Verification', 'Stage Invoicing Schedule'] },
      { name: 'AI Majed', title: 'Developer Commission Rebate Supervisor', specialty: 'Agency Commission Splitting', tasks: ['Broker Rebate Agreements', 'Direct Developer Billing', 'VAT 5% Reconciliation'] },
      { name: 'AI Leen', title: 'Virtual Launch Event Supervisor', specialty: 'Global Live Stream Launches', tasks: ['Webinar Lead Registration', 'Instant Token Reservation', 'Multi-Language Launch Decks'] },
      { name: 'AI Omar', title: 'Off-Plan Resale (Oqood) Supervisor', specialty: 'Pre-Handover Contract Transfers', tasks: ['Oqood Certificate Verification', 'Minimum Paid-Up % Screen', 'Developer NOC Application'] },
      { name: 'AI Youssef', title: 'Emerging Developer Due Diligence Supervisor', specialty: 'Boutique Developer Risk Assessment', tasks: ['Escrow Law No. 8 Compliance', 'Contractor Track Record Check', 'Bank Guarantee Confirmation'] },
    ],
    commercial_investment: [
      { name: 'AI Tarik', title: 'Institutional Bulk Acquisition Supervisor', specialty: 'Commercial Full Buildings', tasks: ['Gross Operating Income Audit', 'Tenancy Schedule Verification', 'Institutional CAP Rate Calc'] },
      { name: 'AI Bassam', title: 'Prime Office & DIFC Asset Supervisor', specialty: 'Grade A Commercial Office Towers', tasks: ['DIFC Category Space Audit', 'Service Charge Per Sqft Check', 'Corporate Lease Structuring'] },
      { name: 'AI Reem', title: 'Retail & Hospitality Yield Supervisor', specialty: 'F&B & Retail Plaza Investments', tasks: ['Footfall Data Correlation', 'Triple Net Lease Drafting', 'Anchor Tenant Security Audits'] },
      { name: 'AI Hani', title: 'Industrial & Logistics Hub Supervisor', specialty: 'Dubai South & JAFZA Warehouses', tasks: ['Leasehold Term Verification', 'Power Load Capacity Audits', 'Civil Defense Certificate Check'] },
      { name: 'AI Ghada', title: 'Commercial ROI & DCF Model Supervisor', specialty: 'Discounted Cash Flow Projections', tasks: ['10-Year DCF Simulation', 'Internal Rate of Return (IRR)', 'Exit Capitalization Pricing'] },
      { name: 'AI Nabil', title: 'Corporate Structuring & SPV Supervisor', specialty: 'Holding Company & DIFC SPV Setup', tasks: ['UBO Documentation Review', 'ADGM / DIFC SPV Filing Guidance', 'Corporate Resolution Checks'] },
      { name: 'AI Jinan', title: 'Commercial Tenancy Law Supervisor', specialty: 'UAE Commercial Real Estate Law', tasks: ['Commercial Lease Dispute Prevention', 'Sub-Leasing Approval Workflow', 'Fit-Out Security Deposit Escrow'] },
      { name: 'AI Walid', title: 'Green Building & ESG Compliance Supervisor', specialty: 'Al Sa\'fat Dubai Green Building', tasks: ['Energy Efficiency Rating Audit', 'Solar Power Feasibility Check', 'Green Lease Clause Insertion'] },
      { name: 'AI Samer', title: 'Distressed Asset Sourcing Supervisor', specialty: 'Bank Auction & Below-Market Deals', tasks: ['Court Execution Order Search', 'Debt Clearance Verification', 'Fast-Track Liquidation Modeling'] },
    ],
    residential_leasing: [
      { name: 'AI Yasmin', title: 'Autonomous Ejari Contract Supervisor', specialty: 'Ejari Registration & Form 12', tasks: ['DLD Ejari System API Sync', 'Tenancy Contract Auto-Fill', 'Ejari Certificate Dispatch'] },
      { name: 'AI Faisal', title: 'Tenant KYC & Credit Scoring Supervisor', specialty: 'AECB Credit & Identity Checks', tasks: ['Emirates ID OCR Validation', 'Salary Certificate Verification', 'Tenant Risk Index Calculation'] },
      { name: 'AI Mariam', title: 'Post-Dated Cheque (PDC) Vault Supervisor', specialty: 'Cheque Presentation & Reminders', tasks: ['PDC Due Date Calendar Alert', 'Bank Deposit Slip Match', 'Replacement Cheque Handling'] },
      { name: 'AI Bilal', title: 'Bounced Cheque Legal Escalation Supervisor', specialty: 'UAE Commercial Transactions Law', tasks: ['7-Day Notice Generation', 'Police Clearance Report Trigger', 'Rental Dispute Center (RDC) Prep'] },
      { name: 'AI Ruba', title: 'RERA Rent Increase Calculator Supervisor', specialty: 'Decree No. 43 of 2013 Compliance', tasks: ['Official DLD Rental Index Check', 'Max Legal Increase Calculation', '90-Day Legal Notice Dispatch'] },
      { name: 'AI Adnan', title: 'Lease Renewal & Extension Supervisor', specialty: 'Annual Contract Renewals', tasks: ['90-Day Renewal Notice Automated Email', 'Rent Adjustment Negotiation', 'Renewal Fee Processing'] },
      { name: 'AI Salma', title: 'Move-In Condition & Inventory Supervisor', specialty: 'Digital Snagging & Handover', tasks: ['Photographic Move-In Report', 'Appliance Serial Number Log', 'Security Deposit Escrow Hold'] },
      { name: 'AI Tamer', title: 'Early Termination & Settlement Supervisor', specialty: 'Lease Break Penalty Structuring', tasks: ['Statutory 2-Month Penalty Calc', 'Utility Bill Final Settlement', 'Deposit Refund Authorization'] },
      { name: 'AI Rima', title: 'Short-Term Holiday Home Supervisor', specialty: 'DET Holiday Home Licensing', tasks: ['Tourism Dirham Fee Calculation', 'Passport Guest Upload Portal', 'Cleaning SLA Scheduling'] },
    ],
    asset_facilities: [
      { name: 'AI Farah', title: 'DAMAC Hills 2 Cluster Maintenance Supervisor', specialty: 'DH2 Cluster Telemetry & Tickets', tasks: ['Cluster SLA Prioritization', 'Contractor Work Order Dispatch', 'Tenant Feedback Resolution'] },
      { name: 'AI Mazen', title: 'HVAC & MEP Engineering Supervisor', specialty: 'AC & Electrical Systems', tasks: ['Chiller Energy Telemetry', 'Emergency Leak Sensor Tripping', 'Preventive Maintenance Schedules'] },
      { name: 'AI Huda', title: 'Contractor Bidding & Tender Supervisor', specialty: 'Vendor Procurement & SOW', tasks: ['RFP Generation & Vendor Scoring', 'Contractor License Verification', 'Job Completion Sign-Off'] },
      { name: 'AI Saif', title: 'IoT Smart Home & Sensor Supervisor', specialty: 'Smart Metering & Water Sensors', tasks: ['Water Consumption Spike Alerts', 'Smart Lock Code Generation', 'IoT Mesh Connectivity Checks'] },
      { name: 'AI Noor', title: 'Community Association (OA) Supervisor', specialty: 'Mollak System & Service Charges', tasks: ['Service Charge Invoice Audit', 'Common Area Defect Reporting', 'OA Meeting Resolution Logs'] },
      { name: 'AI Khaled', title: 'Civil Defense & Safety Supervisor', specialty: 'Fire Safety & Dubai Civil Defense', tasks: ['Smoke Detector Battery Alerts', 'Fire Extinguisher Annual Tagging', 'Emergency Evacuation Plans'] },
      { name: 'AI Mona', title: 'Landscaping & Swimming Pool Supervisor', specialty: 'Villa Grounds & Pool Sanitation', tasks: ['Water PH & Chlorine Telemetry', 'Irrigation Water Schedule', 'Garden Maintenance Inspections'] },
      { name: 'AI Ziyad', title: 'Security & Access Gate Control Supervisor', specialty: 'RFID & Number Plate Recognition', tasks: ['Visitor Gate Pass QR Dispatch', 'Security Patrol Log Audits', 'CCTV System Health Checks'] },
      { name: 'AI Lamees', title: 'Asset Life-Cycle & Capex Supervisor', specialty: 'Long-Term Facility Depreciation', tasks: ['Capital Replacement Sinking Fund', 'Appliance Warranty Tracking', '10-Year Asset Health Index'] },
    ],
    revenue_treasury: [
      { name: 'AI EscrowGuard', title: 'DLD Escrow Account Audit Supervisor', specialty: 'Trust Account Law Compliance', tasks: ['Developer Account Reconciliation', 'Disbursement Authorization Audit', 'Escrow Bank Certificate Verification'] },
      { name: 'AI VatMaster', title: 'UAE FTA Form 201 VAT Supervisor', specialty: '5% Value Added Tax Reporting', tasks: ['Quarterly VAT Return Prep', 'Input Tax Credit Validation', 'Statutory Tax Invoice Formatting'] },
      { name: 'AI TaxStrategist', title: 'UAE 9% Corporate Tax Supervisor', specialty: 'Federal Decree-Law No. 47 of 2022', tasks: ['Small Business Relief (SBR) Screen', 'Taxable Net Profit Calculation', 'Transfer Pricing Documentation'] },
      { name: 'AI LedgerSync', title: 'Double-Entry Accounting Supervisor', specialty: 'Statutory Financial Statements', tasks: ['Assets = Liabilities + Equity Check', 'Monthly Trial Balance Generation', 'P&L Variance Calculation'] },
      { name: 'AI WioReconciler', title: 'Bank & Wio Ledger Reconciliation Supervisor', specialty: 'Real-Time Bank Feed Matching', tasks: ['Bank Statement Transaction Import', 'Director Loan Account (DLA) Ledger', 'Unmatched Transaction Flagging'] },
      { name: 'AI SplitCalc', title: 'Broker Commission Distribution Supervisor', specialty: 'Agent Commission Payouts', tasks: ['Tiered Split Rule Application', 'Withholding Tax Deduction', 'Broker Pay Slip PDF Generation'] },
      { name: 'AI CashFlowPredict', title: '12-Month Cash Flow Forecasting Supervisor', specialty: 'Predictive Treasury Liquidity', tasks: ['Rolling 365-Day Runway Simulator', 'Receivables Collection Forecast', 'Capex Outflow Scheduling'] },
      { name: 'AI CurrencyFX', title: 'Multi-Currency Settlement Supervisor', specialty: 'USD/EUR/GBP/SAR/AED Conversion', tasks: ['Live CBUAE Exchange Rate Feeds', 'Foreign Exchange Gain/Loss Entry', 'Cross-Border Wire Validation'] },
      { name: 'AI AuditReady', title: 'External Audit & Compliance Pack Supervisor', specialty: 'Big 4 Statutory Audit Prep', tasks: ['General Ledger Sampling Export', 'Substantiating Document Bundling', 'Audit Trail Immutability Verification'] },
    ],
    performance_marketing: [
      { name: 'AI AdMatrix', title: 'Meta & Google Ads Bidding Supervisor', specialty: 'Real-Time ROAS Optimization', tasks: ['Dynamic Budget Re-Allocation', 'Lookalike HNW Audience Build', 'High-CTR Ad Copy Generation'] },
      { name: 'AI PortalSyndicate', title: 'Property Portal Syndication Supervisor', specialty: 'Bayut, PropertyFinder & Dubizzle', tasks: ['XML Feed Verification', 'Listing Quality Score Audits', 'Featured Slot Rotation Engine'] },
      { name: 'AI SeoDominator', title: 'Google Dubai Real Estate SEO Supervisor', specialty: 'Keyword Dominance & Core Web Vitals', tasks: ['Rich Schema JSON-LD Injection', 'Long-Tail Dubai Keyword Tracking', 'Sub-1.2s LCP Performance Audits'] },
      { name: 'AI CreativeEngine', title: 'Luxury Graphic & Video Creative Supervisor', specialty: 'High-Converting Visuals', tasks: ['Automated Social Banner Sizing', 'Reels/Shorts Walkthrough Render', 'Brand Red Palette Compliance'] },
      { name: 'AI LeadCatcher', title: 'Multi-Channel Attribution & CPL Supervisor', specialty: 'First-Touch to Deal Attribution', tasks: ['UTM Parameter Validation', 'Cost-Per-Qualified-Lead Score', 'Under-Performing Channel Alerts'] },
      { name: 'AI EmailNurture', title: 'Automated Drip & Newsletter Supervisor', specialty: 'Investor Educational Sequences', tasks: ['Segmented Weekly Market Report', 'High-Open Rate Subject Lines', 'Unsubscribe & PDPL Hygiene'] },
      { name: 'AI InfluencerDesk', title: 'Luxury Brand Ambassador Supervisor', specialty: 'High-End Real Estate Influencers', tasks: ['Collaborator ROI Verification', 'Exclusive Property Preview Access', 'Tracking Link Performance Log'] },
      { name: 'AI HeatmapViewer', title: 'Landing Page UX & Conversion Supervisor', specialty: 'Heatmaps & Friction Analysis', tasks: ['Form Drop-Off Point Analysis', 'A/B Testing CTA Buttons', 'Mobile Touch Target Optimization'] },
      { name: 'AI ContentFactory', title: 'Dubai Market Editorial & PR Supervisor', specialty: 'Luxury Real Estate Journalism', tasks: ['Press Release Auto-Drafting', 'Community Investment Guide Copy', 'Developer Interview Syndication'] },
    ],
    corporate_comms: [
      { name: 'AI VIPReception', title: 'High-Net-Worth Concierge Supervisor', specialty: 'VIP Client First-Touch Protocol', tasks: ['Ultra-Fast 60-Second Greeting', 'Bespoke Language Detection', 'Senior Broker Instant Hand-Off'] },
      { name: 'AI ChatsRouter', title: 'Multi-Channel Chat Routing Supervisor', specialty: 'WhatsApp, Web & Instagram DM', tasks: ['Intent-Based Queue Distribution', '15-Minute SLA Watchdog Alert', 'Agent Availability Balancing'] },
      { name: 'AI Polyglot', title: '5-Language Real-Time Translation Supervisor', specialty: 'EN, AR, RU, FR, ZH Simultaneous NLP', tasks: ['Real-Time Bidirectional Chat Translation', 'Cultural Etiquette Calibration', 'Arabic Document Formalization'] },
      { name: 'AI SatisfactionPulse', title: 'Client Net Promoter Score (NPS) Supervisor', specialty: 'Customer Experience Auditing', tasks: ['Post-Viewing NPS Survey Dispatch', 'Negative Review Escalation Flag', '5-Star Review Google Link Send'] },
      { name: 'AI DisputeResolution', title: 'Client Complaint & Escalation Supervisor', specialty: 'De-Escalation & Resolution', tasks: ['SLA Breach Immediate Remedy', 'Manager Briefing Memo Generation', 'Goodwill Compensation Tracking'] },
      { name: 'AI MeetingSync', title: 'Executive Calendar & Viewing Dispatch Supervisor', specialty: 'Calendar & Route Optimization', tasks: ['Viewing Time Window Calculation', 'Google Calendar / Outlook Sync', 'SMS/WhatsApp Direction Dispatch'] },
      { name: 'AI DocumentDelivery', title: 'Brochure & Property Pack Dispatcher', specialty: 'Instant Asset Delivery', tasks: ['Encrypted Watermarked PDF Send', 'Viewing Link Expiry Generation', 'Delivery & Read Receipt Log'] },
      { name: 'AI CommunityBroadcast', title: 'DAMAC Hills 2 Resident Notice Supervisor', specialty: 'Cluster-Wide Communications', tasks: ['Road Closure / Water Work Notice', 'Community Event Broadcasts', 'Emergency Security Alert Push'] },
      { name: 'AI FounderLine', title: 'Direct Managing Director Escalation Desk', specialty: 'Sovereign Level 5 Inquiry Routing', tasks: ['Strategic Partner Direct Channel', 'VIP Founder Meeting Screening', 'Confidential Telegram/Signal Sync'] },
    ],
    executive_office: [
      { name: 'AI LionHeart', title: 'Executive Operations & KPI Supervisor', specialty: 'Corporate Efficiency & Workflow', tasks: ['Daily Cross-Department KPI Report', 'Employee Performance Scorecards', 'Bottleneck Identification Alerts'] },
      { name: 'AI StrategyForge', title: 'Master Roadmap & Milestone Supervisor', specialty: 'Strategic Milestone Governance', tasks: ['Master Plan Task Advancement', 'Milestone Completion Verification', 'Dependency Blocker Resolution'] },
      { name: 'AI BoardSecretary', title: 'Corporate Resolutions & Minutes Supervisor', specialty: 'Formal LLC-SO Governance Records', tasks: ['Board Resolution Drafting', 'Annual General Meeting (AGM) Minutes', 'Shareholder Register Updates'] },
      { name: 'AI RiskSentinel', title: 'Enterprise Risk & Threat Assessment Supervisor', specialty: 'Macro-Economic & Legal Risk', tasks: ['UAE Real Estate Cycle Indicators', 'Interest Rate Impact Modeling', 'Regulatory Policy Shift Alerts'] },
      { name: 'AI TokenGuard', title: 'AEGIS Token & Compute Optimization Supervisor', specialty: 'AI Resource & Token Efficiency', tasks: ['Free-First Planning Token Gate', 'Sub-10ms Benchmark Enforcement', 'Zero-Waste Prompt Architecture'] },
      { name: 'AI CodeSovereign', title: 'Full-Stack Architecture & Security Supervisor', specialty: 'Git Repository Cleanliness', tasks: ['Ghost Directory Elimination', 'Atomic 4-Folder Law Enforcement', 'Adversarial Code Review Runs'] },
      { name: 'AI TalentScout', title: 'Broker Recruitment & Onboarding Supervisor', specialty: 'Top Real Estate Talent Intake', tasks: ['RERA Card Verification for New Hires', 'Broker Commission Contract Setup', 'Sales Training Curriculum Dispatch'] },
      { name: 'AI SovereignVault', title: 'Managing Director Confidential Vault Supervisor', specialty: 'Founder Private Records', tasks: ['Biometric / Password Vault Access', 'Personal Asset Ledger Tracking', 'Encrypted Backup Synchronization'] },
      { name: 'AI FutureSight', title: 'AI Research & Frontier Model Evaluator', specialty: 'DeepSeek, Gemini & Claude Integration', tasks: ['Next-Gen Model Benchmark Testing', 'Prompt Template Continuous Refine', 'Automated Agent Skill Upgrades'] },
    ],
    regulatory_rera: [
      { name: 'AI AmlShield', title: 'Anti-Money Laundering (goAML) Supervisor', specialty: 'goAML Reporting & SAR Filing', tasks: ['AED 55k+ Cash Transaction Screening', 'Suspicious Activity Report (SAR) Draft', 'FIU Regulatory Submission Queue'] },
      { name: 'AI TrakheesiPermit', title: 'RERA Trakheesi Permit Verification Supervisor', specialty: 'Property Advertising Compliance', tasks: ['Trakheesi Permit Number Verification', 'Advertising Expiration Date Watchdog', 'Unlicensed Listing Auto-Takedown'] },
      { name: 'AI PepScreen', title: 'Politically Exposed Person (PEP) Supervisor', specialty: 'Global Sanctions & Watchlists', tasks: ['UN & UAE Sanctions List Matching', 'Source of Wealth Documentation Check', 'High-Risk Jurisdiction Scoring'] },
      { name: 'AI PdplGuard', title: 'UAE Personal Data Protection Law Supervisor', specialty: 'Data Privacy & Encryption', tasks: ['Client Consent Record Audit', 'Data Retention Lifecycle Enforce', 'Right-to-be-Forgotten Data Purge'] },
      { name: 'AI LicenseMonitor', title: 'Government License Expiry Watchdog', specialty: 'DET, RERA & MOL Countdown', tasks: ['DET 1388443 Expiration Alerts', 'RERA ORN 44483 Renewal Prep', 'Office Ejari 30-Day Proactive Notice'] },
      { name: 'AI BrokerCardCheck', title: 'Agent RERA Broker Card Verification Supervisor', specialty: 'Broker Licensing Compliance', tasks: ['DLD Broker Card Number Verification', 'Annual RERA Exam Renewal Alerts', 'Unlicensed Activity Interception'] },
      { name: 'AI FormStandardizer', title: 'RERA Unified Contract Standardizer (Form A/B/F)', specialty: 'Standard Real Estate Contracts', tasks: ['Form A Seller Mandate Validation', 'Form B Buyer Representation Check', 'Form F Sales Contract Legal Review'] },
      { name: 'AI PowerOfAttorney', title: 'POA & Title Deed Authentication Supervisor', specialty: 'Notarized Power of Attorney', tasks: ['Dubai Courts Notary Public Check', 'POA Validity Scope Verification', 'Title Deed Electronic Verification'] },
      { name: 'AI EthicsAuditor', title: 'Fair Housing & Conflict of Interest Supervisor', specialty: 'Ethical Brokerage Governance', tasks: ['Dual Agency Disclosure Check', 'Listing Price Accuracy Verification', 'Ethical Dispute Evidence Review'] },
    ],
    conveyancing_transactions: [
      { name: 'AI TrusteeBot', title: 'DLD Registration Trustee Booking Supervisor', specialty: 'Trustee Office Appointments', tasks: ['Trustee Office Slot Reservation', 'Manager Cheque Amount Verification', 'Transfer Fee Breakdown Calculation'] },
      { name: 'AI NocTracker', title: 'Developer NOC Application & Issuance Supervisor', specialty: 'Developer No Objection Certificate', tasks: ['Emaar/DAMAC NOC Submission', 'Service Charge Clearance Proof', 'Digital NOC Verification Tagging'] },
      { name: 'AI FormFGenerator', title: 'MOU / Form F Unified Sales Contract Supervisor', specialty: 'Binding Purchase Agreements', tasks: ['10% Security Deposit Verification', 'Finance Contingency Period Log', 'Handover Penalty Clause Insertion'] },
      { name: 'AI MortgageDischarge', title: 'Seller Mortgage Settlement & Release Supervisor', specialty: 'Bank Liability & Clearance Letters', tasks: ['Seller Bank Liability Letter Request', 'Mortgage Discharge Coordination', 'Blocking Fee Escrow Reservation'] },
      { name: 'AI BuyerMortgageSync', title: 'Buyer Bank Final Offer & Valuation Supervisor', specialty: 'Mortgage Final Offer Letter (FOL)', tasks: ['Bank Valuation Report Verification', 'Security Cheque Amount Audit', 'Bank Dispatch Representative Sync'] },
      { name: 'AI DewaTransfer', title: 'Utility & DEWA Move-Out Clearance Supervisor', specialty: 'Utility Account Ownership Transfer', tasks: ['Final DEWA Bill Settlement Check', 'Empower/Tabreed Clearance Letter', 'Move-In Premises NOC Issuance'] },
      { name: 'AI SnaggingRelease', title: 'Post-Inspection Snagging Holdback Supervisor', specialty: 'Handover Snagging Escrow', tasks: ['Snagging Rectification Sign-Off', 'Holdback Fund Release Confirmation', 'Master Keys & Access Fob Receipt'] },
      { name: 'AI TitleDeedDispatcher', title: 'New Electronic Title Deed Issuance Supervisor', specialty: 'DLD Title Deed Distribution', tasks: ['New Owner Title Deed PDF Download', 'DLD Ownership QR Code Verification', 'Encrypted Vault Storage Dispatch'] },
      { name: 'AI ClosingStatements', title: 'Statutory Buyer & Seller Settlement Supervisor', specialty: 'Financial Closing Statement', tasks: ['Service Charge Pro-Rata Calc', 'DLD 4% Transfer Fee Receipt Match', 'Net Seller Proceeds Reconciliation'] },
    ],
    market_iot_intelligence: [
      { name: 'AI Predict', title: 'Machine Learning Price Prediction Supervisor', specialty: 'AI Real Estate Forecasting', tasks: ['Sub-Cluster Capital Growth Models', 'Seasonal Demand Wave Forecasting', 'Rental Yield Degradation Warning'] },
      { name: 'AI Heatmap', title: 'Dubai Geospatial Demand Heatmap Supervisor', specialty: 'Geographic Search Density', tasks: ['Search Volume Heatmap Generation', 'Price/Sqft Geographic Map Render', 'High-ROI Cluster Highlighting'] },
      { name: 'AI DxbDataCruncher', title: 'DLD Open Data Live Feed Cruncher', specialty: 'Official Transaction Analytics', tasks: ['Daily DLD Sales Data Extraction', 'Off-Plan vs Ready Volume Ratios', 'Average Sqft Price Index Trends'] },
      { name: 'AI CompetitorRadar', title: 'Bayut & PropertyFinder Market Pulse Supervisor', specialty: 'Competitor Inventory Tracking', tasks: ['Competitor Pricing Deviation Alerts', 'Market Days-on-Market Index', 'New Cluster Launch Benchmarking'] },
      { name: 'AI TenantDemographics', title: 'Tenant & Buyer Demographic Profiler', specialty: 'Buyer Persona & Origin Science', tasks: ['Nationality & Budget Trend Modeling', 'Family vs Investor Allocation Data', 'School Commute Correlation Analysis'] },
      { name: 'AI YieldOptimizer', title: 'Portfolio Net Yield Optimization Supervisor', specialty: 'Gross to Net Yield Calibration', tasks: ['Service Charge Drag Calculations', 'Refurbishment ROI Projections', 'Optimal Rent Pricing Recommendation'] },
      { name: 'AI MacroPulse', title: 'Global Macro & UAE Currency Science Supervisor', specialty: 'Interest Rates & Currency Impact', tasks: ['CBUAE EIBOR Rate Curve Analysis', 'USD Peg & Currency Inflow Trends', 'Global Flight-to-Safety Inflow Index'] },
      { name: 'AI ClusterBenchmark', title: 'DAMAC Hills 2 vs Master Communities Supervisor', specialty: 'Comparative District Performance', tasks: ['DH2 vs Arabian Ranches Metrics', 'Price/Sqft Gap Analysis', 'Infrastructure Expansion Impact'] },
      { name: 'AI DataPipelineGuard', title: 'Market Intelligence Ingestion & Health Supervisor', specialty: 'ETL Pipeline Integrity', tasks: ['Sub-10ms In-Memory Map Update', 'Data Pipeline Latency Monitoring', 'Zero-Data-Drift Verification'] },
    ],
  };

  let globalIndex = 1;
  CORPORATE_DEPARTMENTS_12.forEach(dept => {
    const deptSupervisors = SUPERVISOR_TAXONOMY[dept.id] || [];
    deptSupervisors.forEach((sup, localIdx) => {
      supervisors.push({
        id: `sup_${dept.id}_${localIdx + 1}`,
        name: sup.name,
        code: `SUP-${dept.code}-${localIdx + 1}`,
        title: sup.title,
        departmentId: dept.id,
        departmentName: dept.name,
        supervisorIndex: localIdx + 1,
        icon: dept.icon,
        color: dept.color,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sup.name)}&background=${dept.color.replace('#', '')}&color=fff`,
        status: 'optimal',
        description: `Autonomous supervisor assigned to ${dept.name}, executing 3 core tasks with 15-minute SLA.`,
        specialty: sup.specialty,
        assignedTasks: sup.tasks,
        capabilities: [sup.specialty, ...sup.tasks],
        slaResponseTime: '< 15 mins',
        metrics: {
          accuracyRate: 99.8,
          tasksCompletedToday: 850 + Math.floor(Math.random() * 200),
          systemHealth: 'optimal',
        },
      });
      globalIndex++;
    });
  });

  return supervisors;
}

export const SUPERVISORS_108: SupervisorDef[] = build108Supervisors();

// Export aggregate count helper
export const CANONICAL_COUNTS = {
  managingDirector: 1,
  executiveAi: 1, // Zoe
  departments: 12,
  departmentManagers: 12,
  supervisorsPerDept: 9,
  totalSupervisors: 108,
  totalAiMesh: 1 + 12 + 108, // 121
};
