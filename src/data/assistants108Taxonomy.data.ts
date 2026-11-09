/**
 * assistants108Taxonomy.data.ts — 🔱 The 108 Operational Squad Taxonomy by Department
 * White Caves Real Estate LLC — 12 Corporate Departments × 9 Squads = 108 Operational Units
 * Standard: AEGIS Canonical Single Purpose (< 350 lines)
 */

export interface SquadBlueprint {
  name: string;
  title: string;
  specialty: string;
  tasks: string[];
}

export const SUPERVISOR_TAXONOMY_108: Record<string, SquadBlueprint[]> = {
  customer_experience: [
    { name: 'AI Corinne VIP Desk', title: '5-Star Concierge & Welcome Supervisor', specialty: 'VIP Client Frontline Reception', tasks: ['VIP Arrival Briefings', 'Multi-Lingual Protocol', 'Chauffeur Coordination'] },
    { name: 'AI ClientCare', title: 'Client Onboarding & Relations Supervisor', specialty: 'Frontline Hospitality', tasks: ['Welcome Gift Pack Dispatch', 'Client Verification Gate', 'Hospitality Experience Logging'] },
    { name: 'AI PrivateShowing', title: 'Private Villa & Yacht Showing Supervisor', specialty: 'Luxury Viewing Experience', tasks: ['Viewing Itinerary Scheduling', 'Access Key Clearance', 'Hostess Protocol Sync'] },
    { name: 'AI MultilingualDesk', title: 'International Multi-Lingual Desk Supervisor', specialty: 'Cross-Border VIP Hospitality', tasks: ['Russian / Mandarin / Arabic Desks', 'Cultural Etiquette Guidance', 'Timezone Concierge Response'] },
    { name: 'AI FeedbackSentinel', title: 'Client NPS & Satisfaction Supervisor', specialty: 'Quality Assurance & NPS', tasks: ['Post-Viewing Surveys', 'Complaint SLA Tracking', 'Service Escalation Routing'] },
    { name: 'AI ChauffeurLogistics', title: 'VIP Mobility & Chauffeur Logistics Supervisor', specialty: 'Executive Transport Management', tasks: ['Fleet Dispatch Coordination', 'Airport Transfer Booking', 'Helipad Access Coordination'] },
    { name: 'AI EventHostess', title: 'Private Showcase Event Hostess Supervisor', specialty: 'Boutique Property Showcases', tasks: ['Guest List Accreditation', 'Catering & Hospitality QC', 'RSVP Badge Authentication'] },
    { name: 'AI RetentionCare', title: 'High-Net-Worth Retention & Loyalty Supervisor', specialty: 'Client Loyalty Programs', tasks: ['Anniversary & Milestone Gifting', 'VIP Club Privilege Management', 'Dormant Client Warming'] },
    { name: 'AI EmergencyRelief', title: 'Urgent Client Concierge & Support Supervisor', specialty: 'Rapid Response Concierge', tasks: ['Late-Night Booking Support', 'Emergency Property Access', '15-Minute Hospitality Response'] },
  ],

  marketing_branding: [
    { name: 'AI Olivia Campaigns', title: 'Omnichannel Lead Acquisition Supervisor', specialty: 'Paid Traffic & PPC Strategy', tasks: ['Google Ads Budget Pacing', 'Meta Real Estate Funnels', 'Cost Per Lead Calibration'] },
    { name: 'AI PortalSyndicator', title: 'Bayut & PropertyFinder Syndication Supervisor', specialty: 'Real Estate Portals Sync', tasks: ['TruCheck Listing Verification', 'Featured Tier Allocation', 'Duplicate Listing Interception'] },
    { name: 'AI BrandGuardian', title: 'Luxury Brand Identity & Aesthetic Supervisor', specialty: 'Creative Asset Brand QC', tasks: ['Typography & Color Palette Audit', 'Brochure Style Compliance', 'Logo Usage Integrity'] },
    { name: 'AI SocialPulse', title: 'Instagram, LinkedIn & YouTube Studio Supervisor', specialty: 'Luxury Video Content', tasks: ['Reels & Drone Walkthrough QC', 'Influencer Collaboration Tracking', 'Editorial Content Calendar'] },
    { name: 'AI SeoDominance', title: 'Dubai Luxury Real Estate SEO Supervisor', specialty: 'Organic Search Leadership', tasks: ['Keyword Opportunity Mapping', 'Backlink Velocity Tracking', 'Developer Cluster SEO Pages'] },
    { name: 'AI EmailNurture', title: 'Investor Newsletter & Automation Supervisor', specialty: 'High-Net-Worth Lead Nurturing', tasks: ['Weekly Market Pulse Dispatch', 'Segmented Drip Automations', 'Open Rate & Click Attribution'] },
    { name: 'AI EventPromoter', title: 'Off-Plan Launch Promotion Supervisor', specialty: 'Global Launch Campaigns', tasks: ['Webinar Registration Funnels', 'City Roadshow Digital Collateral', 'Early-Bird Token Promotion'] },
    { name: 'AI PerformanceAudit', title: 'Marketing ROAS & Multi-Touch Attribution Supervisor', specialty: 'Conversion Science', tasks: ['UTM Pipeline Mapping', 'ROAS Calculations', 'Marketing Spend Escrow Tracking'] },
    { name: 'AI CreativeStudio', title: '3D Matterport & Architectural Render Supervisor', specialty: 'CGI & Virtual Reality Assets', tasks: ['Virtual Staging Review', 'Twilight Photography Verification', '3D Floor Plan Approval'] },
  ],

  human_resources: [
    { name: 'AI Selena Talent', title: 'Broker Recruitment & Talent Acquisition Supervisor', specialty: 'Executive Headhunting', tasks: ['Top-Producer Headhunting', 'Candidate Screening Interviews', 'Compensation Offer Letters'] },
    { name: 'AI BrokerLicensing', title: 'RERA Broker Card & DLD Accreditation Supervisor', specialty: 'Statutory Broker Cards', tasks: ['DLD Broker Card Renewal', 'RERA Exam Verification', 'Unaccredited Interception'] },
    { name: 'AI PerformanceKpi', title: 'Agent Quota & Merit XP Scoring Supervisor', specialty: 'Performance Analytics', tasks: ['Daily Dial & Meeting Audits', 'Monthly Closing Quotas', 'Merit XP Calculation Engine'] },
    { name: 'AI VisaRelocation', title: 'Employment Visa & Emirates ID Supervisor', specialty: 'Government PRO Services', tasks: ['ICP Visa Application Tracking', 'Medical Fitness Booking', 'Emirates ID Biometrics Scheduling'] },
    { name: 'AI MohrePayroll', title: 'WPS Salary & MoHRE Compliance Supervisor', specialty: 'UAE Labour Law & WPS', tasks: ['SIF File Generation', 'WPS Salary Payout Verification', 'EOSG Gratuity Provisioning'] },
    { name: 'AI BrokerAcademy', title: 'White Caves Broker Training Academy Supervisor', specialty: 'Luxury Sales Training', tasks: ['Objection Handling Modules', 'Off-Plan Masterclasses', 'Contracts & Form F Workshops'] },
    { name: 'AI AttendanceLeaves', title: 'Attendance, Leaves & Roster Management Supervisor', specialty: 'Workforce Operations', tasks: ['Duty Roster Scheduling', 'Annual Leave Approval Flow', 'Office Presence Monitoring'] },
    { name: 'AI EmiratisationDesk', title: 'Nafis & UAE National Employment Supervisor', specialty: 'Emiratisation Quota Strategy', tasks: ['Nafis Portal Submissions', 'MoHRE Target Verification', 'National Trainee Mentorship'] },
    { name: 'AI CultureEthics', title: 'Corporate Ethics & Disciplinary Conduct Supervisor', specialty: 'Internal Fair Governance', tasks: ['Commission Dispute Arbitrations', 'Anti-Harassment Protocols', 'Quarterly Employee NPS'] },
  ],

  technology_systems: [
    { name: 'AI Aurora Core', title: 'Next.js & Frontend Architecture Supervisor', specialty: 'High-Performance UI Engine', tasks: ['React 19 Zero-Latency Renders', 'Design System Token Audits', 'Core Web Vitals Tuning'] },
    { name: 'AI BackendGate', title: 'Express API Gateway & Microservices Supervisor', specialty: 'Distributed Backend Mesh', tasks: ['Sub-10ms Route Dispatch', 'JWT RBAC Security Gates', 'API Rate-Limiting Protocols'] },
    { name: 'AI DatabasePrisma', title: 'Prisma ORM & PostgreSQL Cluster Supervisor', specialty: 'Relational Data Stores', tasks: ['Index Performance Tuning', 'Zero-Downtime Schema Migrations', 'Connection Pool Health'] },
    { name: 'AI DevopsCloud', title: 'Docker, CI/CD & Kubernetes Cloud Supervisor', specialty: 'Cloud Infrastructure & SRE', tasks: ['Automated Vitest Pipeline Gates', 'Zero-Downtime Rolling Deploys', 'Server Latency Telemetry'] },
    { name: 'AI AgentMeshEngine', title: '121-Agent Autonomous Coordination Supervisor', specialty: 'Multi-Agent Orchestration', tasks: ['15-Minute SLA Watchdog', 'Agent Inter-Communication Bus', 'Prompt Token Optimizer'] },
    { name: 'AI SecuritySentinel', title: 'App Defense & Cryptographic Integrity Supervisor', specialty: 'SecOps & Penetration Defense', tasks: ['Statutory Secret Rotation', 'DDoS Mitigation Shield', 'Vulnerability Code Audits'] },
    { name: 'AI MobileBridge', title: 'Cross-Platform React Native Bridge Supervisor', specialty: 'Mobile App Infrastructure', tasks: ['Push Notification Gateway', 'Offline SQLite Sync Engine', 'Biometric Auth Verification'] },
    { name: 'AI VisionOcrCore', title: 'Emirates ID & Passport Vision OCR Supervisor', specialty: 'Computer Vision & Document Extraction', tasks: ['MRZ Passport Decoding', 'Emirates ID Front/Back Extraction', 'Title Deed Tamper Detection'] },
    { name: 'AI SystemBackup', title: 'Disaster Recovery & Encrypted Storage Supervisor', specialty: 'Zero-Data-Loss Architecture', tasks: ['Daily Snapshot Verification', 'Encrypted Vault Redundancy', 'Failover Readiness Drills'] },
  ],

  sales_operations: [
    { name: 'AI Clara Sales', title: 'Secondary Resale & Villa Portfolio Supervisor', specialty: 'Prime Residential Brokerage', tasks: ['Listing Presentation Mandates', 'Seller Negotiation Strategy', 'Form F Contract Finalization'] },
    { name: 'AI OffPlanAllocation', title: 'Emaar, DAMAC & Nakheel Launch Allocation Supervisor', specialty: 'Developer Unit Allocation', tasks: ['VIP Token Queue Reservation', 'Payment Plan Comparisons', 'Handover Progress Auditing'] },
    { name: 'AI DealCloser', title: 'Luxury Closing & Transaction Settlement Supervisor', specialty: 'High-Value Deal Closing', tasks: ['Offer-to-Agreement Acceleration', 'Escrow Down Payment Proof', 'Commission Milestone Tracking'] },
    { name: 'AI CommercialBroker', title: 'Commercial Office & Retail Space Supervisor', specialty: 'Commercial Real Estate Brokerage', tasks: ['DIFC & Business Bay Offices', 'Yield & Cap Rate Valuations', 'Commercial Tenancy Contracts'] },
    { name: 'AI BuyerMatcher', title: 'High-Net-Worth Buyer Matching Supervisor', specialty: 'VIP Lead Qualification', tasks: ['Investor Requirement Matching', 'Exclusive Pocket Listing Dispatch', 'Proof of Funds Verification'] },
    { name: 'AI ViewingScheduler', title: 'Client Viewing & Open House Coordinator', specialty: 'Showing Management', tasks: ['Smart Lock Access Codes', 'Viewing Feedback Capture', 'Agent Calendar Optimization'] },
    { name: 'AI PipelineVelocity', title: 'Sales Pipeline Velocity & Stage Gate Supervisor', specialty: 'Deal Pipeline Analytics', tasks: ['Stalled Deal Diagnostics', 'Stage Transition SLAs', 'Weekly Sales Forecast Modeling'] },
    { name: 'AI CommissionSplitter', title: 'Internal Broker Commission & Split Supervisor', specialty: 'Statutory Commission Math', tasks: ['Tiered Commission Split Calcs', 'Referral Fee Deductions', 'Director Sign-off Routing'] },
    { name: 'AI LeadDistributor', title: 'Fair Lead Distribution & Round-Robin Supervisor', specialty: 'Algorithmic Lead Allocation', tasks: ['Performance-Based Routing', 'Instant 5-Minute Lead Alert', 'SLA Miss Re-allocation'] },
  ],

  inventory_portfolio: [
    { name: 'AI Sentinel Inventory', title: 'Master Real Estate Inventory Catalog Supervisor', specialty: 'Inventory Database Custody', tasks: ['10,000+ Listing Deduplication', 'Available / Reserved Status Sync', 'Property Media Quality Audit'] },
    { name: 'AI LandlordLiaison', title: 'Landlord Onboarding & Mandate Custody Supervisor', specialty: 'Owner Relations & Form A', tasks: ['Form A Mandate Verification', 'Owner Identity Verification', 'Exclusive Agency Renewals'] },
    { name: 'AI ClusterValuation', title: 'DAMAC Hills 2 & Master Community Portfolio Supervisor', specialty: 'District Portfolio Intelligence', tasks: ['Cluster Price/Sqft Tracking', 'Historical Resale Comps', 'Rental Return Benchmarks'] },
    { name: 'AI AssetInspection', title: 'Property Snagging & Condition Audit Supervisor', specialty: 'Technical Asset Inspection', tasks: ['Digital Snagging Checklists', 'Handover Key Custody Log', 'Defect Rectification Tracking'] },
    { name: 'AI OffPlanTracker', title: 'Developer Construction Milestone & Handover Supervisor', specialty: 'Under-Construction Assets', tasks: ['DLD Milestone Progress Photos', 'Anticipated Handover Dates', 'Payment Notice Reconciliations'] },
    { name: 'AI KeyManagement', title: 'Smart Lockbox & Access Token Custody Supervisor', specialty: 'Physical & Digital Key Access', tasks: ['Access Log Monitoring', 'Broker Fob Sign-Out Engine', 'Emergency Access Protocol'] },
    { name: 'AI ListingStaging', title: 'Inventory Virtual Tour & Floor Plan Supervisor', specialty: 'Catalog Visual Assets', tasks: ['Matterport 3D Link Verifications', 'Architectural Floor Plan CAD', 'Drone Footage Integration'] },
    { name: 'AI InventoryArchive', title: 'Sold & Expired Listing Archival Supervisor', specialty: 'Catalog Hygiene & Maintenance', tasks: ['Automatic Delisting on Sale', 'Expired Mandate Notifications', 'Historical Price Trend Archival'] },
    { name: 'AI BulkInvestorPacks', title: 'Bulk Portfolio Packaging & Institutional Deck Supervisor', specialty: 'Institutional Asset Packaging', tasks: ['Full-Building Portfolio Packets', 'Tenancy Schedule Audits', 'Consolidated NOI Calculations'] },
  ],

  partnerships_growth: [
    { name: 'AI Maktoum Alliances', title: 'Master Developer Institutional Partnership Supervisor', specialty: 'Developer Tier-1 Alliances', tasks: ['Emaar / Nakheel Agreement Terms', 'Top Agency Tier Qualification', 'Exclusive Allocation Quotas'] },
    { name: 'AI FamilyOffice', title: 'Global Family Office & Sovereign Wealth Supervisor', specialty: 'Institutional Capital Inflow', tasks: ['Confidential Mandate Negotiation', 'Private Placement Decks', 'Cross-Border Fund Structuring'] },
    { name: 'AI BankMortgages', title: 'Mortgage Brokerage & Banking Alliance Supervisor', specialty: 'Banking Relationships', tasks: ['Preferred Bank Interest Rates', 'Pre-Approval Pipeline Tracking', 'Mortgage Referral Commissions'] },
    { name: 'AI RelocationPartners', title: 'Corporate Relocation & Expat Concierge Supervisor', specialty: 'Multinational Corporate Accounts', tasks: ['Corporate Housing Contracts', 'Executive Relocation Packs', 'Long-Term Corporate Leases'] },
    { name: 'AI GlobalCorridors', title: 'European, Asian & GCC Investor Desk Supervisor', specialty: 'International Expansion', tasks: ['Foreign Investor Roadshows', 'Overseas Affiliate Broker JVs', 'Multi-Currency Settlement Rules'] },
    { name: 'AI LuxuryBrands', title: 'Branded Residences (Armani/Cavalli) Alliance Supervisor', specialty: 'High-Fashion Branded Real Estate', tasks: ['Brand License Compliance', 'Exclusive VIP Launch Previews', 'Co-Branded Marketing Approvals'] },
    { name: 'AI GoldenVisaNetwork', title: 'Government PRO & Golden Visa Strategic Desk', specialty: 'Residency by Investment', tasks: ['2M+ AED Property Valuation Fast-Path', 'Immigration Filing Direct Desk', 'Investor Family Residency Tracking'] },
    { name: 'AI VentureExpansion', title: 'Franchise, M&A & Strategic Growth Supervisor', specialty: 'Corporate Expansion', tasks: ['Boutique Brokerage Acquisitions', 'Branch License Applications', 'Enterprise Valuation Modeling'] },
    { name: 'AI SponsorshipAlliance', title: 'Luxury Golf & Yacht Event Sponsorship Supervisor', specialty: 'High-Society Networking Events', tasks: ['Polo & Yacht Club Sponsorships', 'VIP Investor Dinners', 'Sponsorship ROAS Verification'] },
  ],

  media_public_relations: [
    { name: 'AI Maya PR', title: 'Executive Communications & Press Bureau Supervisor', specialty: 'Media Relations & Press Releases', tasks: ['Bloomberg / Forbes Dubai Pitches', 'CEO Thought-Leadership Op-Eds', 'Crisis PR Protocol Monitoring'] },
    { name: 'AI MediaStudio', title: 'White Caves Media & High-End Production Supervisor', specialty: 'Cinematic Architectural Content', tasks: ['4K Cinema Video Post-Production', 'Sound Design & Voiceovers', 'Celebrity Agent Interviews'] },
    { name: 'AI EditorialPublish', title: 'White Caves Luxury Magazine & Journal Supervisor', specialty: 'Publishing & Editorial Content', tasks: ['Quarterly Print & Digital Journal', 'Architectural Feature Stories', 'Editorial Copywriting Review'] },
    { name: 'AI InfluencerDesk', title: 'Luxury Lifestyle & Real Estate Influencer Desk', specialty: 'Influencer Talent Management', tasks: ['Content Partnership Contracts', 'Filming Permissions at Landmarks', 'Attribution Code Tracking'] },
    { name: 'AI AwardSubmissions', title: 'International Property Awards & Accolades Supervisor', specialty: 'Industry Recognition & Awards', tasks: ['Arabian Property Awards Entry', 'Best Luxury Brokerage Dossier', 'Trophy & Credential Marketing'] },
    { name: 'AI PodcasterCore', title: 'Dubai Real Estate Podcast & Livestream Supervisor', specialty: 'Broadcast Media', tasks: ['Weekly Industry Podcast Prep', 'Guest Booking & Screening', 'Omnichannel Audio Syndication'] },
    { name: 'AI CorporateIdentity', title: 'Public Brand Reputation & Sentiment Supervisor', specialty: 'Reputation Monitoring', tasks: ['Google Reviews Sentiment Scan', 'Social Mentions Radar', 'Proactive Issue Rectification'] },
    { name: 'AI EventPressOffice', title: 'Press Conference & Launch Event Media Supervisor', specialty: 'On-Site Media Logistics', tasks: ['Journalist Accreditation', 'Press Kit Distribution', 'Live Broadcast Feeds'] },
    { name: 'AI DigitalBroadcasting', title: 'Telegram, WhatsApp VIP Channel Broadcast Supervisor', specialty: 'Direct Media Broadcasting', tasks: ['VIP Off-Market Deal Bulletins', 'Broadcast List Engagement', 'Instant Deal Notification Alerts'] },
  ],

  research_analytics: [
    { name: 'AI Elena Research', title: 'Macroeconomic Indexing & Transaction Science Supervisor', specialty: 'DLD Big Data Analytics', tasks: ['Daily Official Sales Feed Processing', 'Off-Plan vs Ready Volume Split', 'Price-Per-Sqft Inflation Index'] },
    { name: 'AI PredictiveMl', title: 'Sub-Cluster Capital Appreciation ML Supervisor', specialty: 'Machine Learning Forecasting', tasks: ['3-Year Price Prediction Models', 'Supply Pipeline Oversupply Alerts', 'Demand Wave Forecasting'] },
    { name: 'AI RentalYieldEngine', title: 'Gross vs Net Rental Yield Optimization Supervisor', specialty: 'Yield Analytics', tasks: ['Service Charge Drag Deductions', 'Short-Term vs Long-Term ROI', 'Optimal Rent Pricing Recommendations'] },
    { name: 'AI HeatmapGeospatial', title: 'Dubai Real Estate Demand Heatmap Supervisor', specialty: 'Geographic Search Intelligence', tasks: ['Search Volume Geographic Maps', 'Metro Extension ROI Projections', 'Infrastructure Proximity Index'] },
    { name: 'AI CompetitorRadar', title: 'Market Competitor Pricing & Days-on-Market Supervisor', specialty: 'Competitor Intelligence', tasks: ['Competitor Inventory Deviation', 'Average Days on Market Tracking', 'Cluster Market Share Analysis'] },
    { name: 'AI DemographicsProfiler', title: 'Buyer Origin & Demographic Capital Flow Supervisor', specialty: 'Investor Flow Science', tasks: ['Foreign Capital Inflow by Country', 'Family vs Single Living Trends', 'Wealth Corridor Mapping'] },
    { name: 'AI MacroPulseGcc', title: 'Interest Rates, EIBOR & Currency Impact Supervisor', specialty: 'Macro Financial Environment', tasks: ['CBUAE EIBOR Rate Trends', 'USD/AED Peg Stability Tracking', 'Global Flight-to-Safety Inflow'] },
    { name: 'AI MasterPlanTracker', title: 'Dubai 2040 Urban Master Plan Supervisor', specialty: 'Government Urban Strategy', tasks: ['New Infrastructure Green Zones', 'Airport Relocation Impact Study', 'Zoning Law Amendment Monitoring'] },
    { name: 'AI WhitePaperStudio', title: 'Quarterly Dubai Market Intelligence Report Supervisor', specialty: 'Institutional Publications', tasks: ['Quarterly Real Estate White Paper', 'Executive Summary Infographics', 'Investor Webinar Data Slides'] },
  ],

  accounting_finance: [
    { name: 'AI Theodora Finance', title: 'Chief Accounting Officer & Statutory Audit Supervisor', specialty: 'General Ledger & Auditing', tasks: ['Monthly P&L Financial Close', 'Balance Sheet Reconciliations', 'Statutory Financial Statement Prep'] },
    { name: 'AI UaeTaxEngine', title: 'UAE Corporate Tax 9% & Federal Tax Authority Supervisor', specialty: 'FTA Corporate Tax Compliance', tasks: ['375k AED Statutory Threshold Tracking', '9% Corporate Tax Reserve Auto-Transfer', 'Annual Corporate Tax Return Filing'] },
    { name: 'AI UaeVatCompliance', title: 'UAE FTA VAT 5% Invoicing & Filing Supervisor', specialty: 'Value Added Tax (VAT)', tasks: ['Sequential Tax Invoice Generation', '5% VAT Output/Input Reconciliation', 'Quarterly VAT 201 Return Submissions'] },
    { name: 'AI EscrowAccountSync', title: 'RERA Trust Account & Escrow Reconciliation Supervisor', specialty: 'Escrow Law No. 8 Custody', tasks: ['Escrow Deposit Account Verification', 'Developer Milestone Drawdowns', 'Trustee Fee Allocation Verification'] },
    { name: 'AI BrokerPayrollComm', title: 'Broker Commission Payout & Split Ledger Supervisor', specialty: 'Commission Accounting', tasks: ['Net Commission Split Calculation', 'Withholding Tax Reconciliations', 'Direct Bank Transfer Batches'] },
    { name: 'AI AccountsPayable', title: 'Vendor Payments & Office Operating Expenses Supervisor', specialty: 'AP & Cash Flow Management', tasks: ['Vendor Invoice Verification', 'Office Rent & Utility Settlements', 'Expense Approval Hierarchies'] },
    { name: 'AI TreasuryForex', title: 'Multi-Currency Escrow & FX Hedging Supervisor', specialty: 'Treasury & FX Management', tasks: ['USD/EUR/GBP Currency Conversion', 'Crypto-to-Fiat Escrow Compliance', 'Bank Account Liquidity Buffers'] },
    { name: 'AI ZohoBooksSync', title: 'Zoho Books Enterprise Two-Way Sync Supervisor', specialty: 'ERP Integration', tasks: ['Automated Journal Entry Posting', 'Bank Feed Reconciliation Rule', 'ERP Ledger Consistency Audits'] },
    { name: 'AI FinancialAuditor', title: 'External Audit Defense & Financial Governance Supervisor', specialty: 'Internal & External Auditing', tasks: ['Big Four Audit Dossier Preparation', 'Anti-Fraud Transaction Sampling', 'Budget vs Actual Variance Analysis'] },
  ],

  legal_compliance: [
    { name: 'AI Sofia Legal', title: 'DLD & RERA Statutory Compliance Officer', specialty: 'Real Estate Regulatory Law', tasks: ['Trakheesi Permit Verification', 'Law No. 8 Escrow Compliance', 'Brokerage Legal Dispute Resolution'] },
    { name: 'AI GoAmlScreening', title: 'Anti-Money Laundering (AML/goAML) & PEP Supervisor', specialty: 'UAE Financial Intelligence Unit (FIU)', tasks: ['goAML Suspicious Transaction Reports (STR)', 'PEP & Sanctions List Screening', 'Source of Funds Verification'] },
    { name: 'AI TrakheesiEngine', title: 'DLD Trakheesi Advertising Permit Supervisor', specialty: 'Advertising Permits', tasks: ['Instant Trakheesi QR Code Generation', 'Portal Permit Matching (Bayut/PF)', 'Unlicensed Ad Penalty Interception'] },
    { name: 'AI FormAContract', title: 'RERA Form A (Seller Mandate) Compliance Supervisor', specialty: 'Seller Listing Agreements', tasks: ['Owner Title Deed Match', 'Listing Price Statutory Verification', 'Exclusivity Period Enforcement'] },
    { name: 'AI FormBContract', title: 'RERA Form B (Buyer Representation) Supervisor', specialty: 'Buyer Broker Agreements', tasks: ['Buyer Identity KYC Check', 'Retainer Fee Escrow Verification', 'Dual Agency Disclosure Enforcement'] },
    { name: 'AI FormFContract', title: 'RERA Form F (MOU / Unified Sale Contract) Supervisor', specialty: 'Legally Binding Sale Contracts', tasks: ['10% Security Deposit Custody', 'Mortgage Approval Contingency Clause', 'DLD Transfer Date Penalty Clause'] },
    { name: 'AI PoaVerification', title: 'Power of Attorney & Dubai Courts Notary Supervisor', specialty: 'POA Legal Authentication', tasks: ['Dubai Courts Notary Stamp Verification', 'POA Powers Scope Audit (Sale/Accept Funds)', 'Expiry Date & Revocation Check'] },
    { name: 'AI DataPrivacyLaw', title: 'UAE Personal Data Protection Law (PDPL) Supervisor', specialty: 'Data Privacy & GDPR Equivalence', tasks: ['Client Document Encryption Verification', 'Data Access Audit Logging', 'Consent Withdrawal Handlers'] },
    { name: 'AI LegalArbitration', title: 'DLD Rental Dispute Center (RDC) & Legal Counsel', specialty: 'Arbitration & Litigation', tasks: ['RDC Eviction Notice Compliance', 'Deposit Refund Disputes Settlement', 'Court Memo Drafting & Case Law Prep'] },
  ],

  executive_governance: [
    { name: 'AI Zayed Governance', title: 'Board Secretariat & Sovereign Policy Supervisor', specialty: 'Executive Enterprise Governance', tasks: ['Board of Directors Resolutions', 'Level 5 Sovereign Authority Gates', 'Statutory Corporate Minutes'] },
    { name: 'AI StrategicRoadmap', title: 'Long-Range Enterprise OKRs & Growth Supervisor', specialty: 'Strategic Planning & OKRs', tasks: ['Quarterly Company Milestone Tracking', 'Department Capability Audits', 'Resource Allocation Modeling'] },
    { name: 'AI RiskManagement', title: 'Enterprise Risk & Catastrophe Shield Supervisor', specialty: 'Corporate Risk Governance', tasks: ['Market Downturn Stress-Testing', 'Insurance Policy Coverage Reviews', 'Counterparty Default Safeguards'] },
    { name: 'AI ZoeCooLiaison', title: 'Executive Chief AI Assistant Zoe Operations Desk', specialty: 'COO Executive Workflow', tasks: ['12 Department Inter-Communication', 'High-Priority Alert Filtering for MD', '15-Minute SLA Dashboard Sync'] },
    { name: 'AI MeritXpMaster', title: 'Company-Wide Merit Leaderboard & XP Master Supervisor', specialty: 'Gamified Corporate Governance', tasks: ['Staff Merit Score Verification', 'Level 1-5 Authority Level Upgrades', 'Annual Merit Award Allocations'] },
    { name: 'AI ComplianceOversight', title: 'Cross-Department Statutory Policy Audit Supervisor', specialty: 'Institutional Oversight', tasks: ['Random Department Process Audits', 'Codebase Architecture Law Enforcement', 'Zero-Downtime Governance Check'] },
    { name: 'AI CapitalAllocation', title: 'Capital Re-Investment & Sovereign Reserve Supervisor', specialty: 'Treasury Investment Strategy', tasks: ['Retained Earnings Reserve Allocation', 'Tech Stack R&D Reinvestment', 'Contingency Liquidity Maintenance'] },
    { name: 'AI CorporateRestructure', title: 'Department Slot & Organizational Topology Supervisor', specialty: 'Corporate Structural Law', tasks: ['1-12-108 Topology Integrity Check', 'Department Slot Swap Verification', 'Sub-Department Capacity Planning'] },
    { name: 'AI SovereignSignOff', title: 'Founder & Managing Director Digital Seal Supervisor', specialty: 'Final Sovereign Seal Authority', tasks: ['Executive Seal Digital Timestamping', 'High-Value Contract Final Pass Gate', 'Sovereign Veto Logging Engine'] },
  ],
};
