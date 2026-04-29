const ASSISTANT_METADATA = {
  zoe: { name: 'Zoe', color: '#EC4899' },
  linda: { name: 'Linda', color: '#06B6D4' },
  nina: { name: 'Nina', color: '#EF4444' },
  mary: { name: 'Mary', color: '#EC4899' },
  clara: { name: 'Clara', color: '#F59E0B' },
  nancy: { name: 'Nancy', color: '#10B981' },
  sophia: { name: 'Sophia', color: '#8B5CF6' },
  daisy: { name: 'Daisy', color: '#14B8A6' },
  theodora: { name: 'Theodora', color: '#F093FB' },
  olivia: { name: 'Olivia', color: '#4FACFE' },
  laila: { name: 'Laila', color: '#6366F1' },
  aurora: { name: 'Aurora', color: '#14B8A6' },
  hazel: { name: 'Hazel', color: '#EC4899' },
  willow: { name: 'Willow', color: '#3B82F6' },
  evangeline: { name: 'Evangeline', color: '#DC2626' },
  sentinel: { name: 'Sentinel', color: '#059669' },
  hunter: { name: 'Hunter', color: '#F59E0B' },
  henry: { name: 'Henry', color: '#6366F1' },
  cipher: { name: 'Cipher', color: '#8B5CF6' },
  atlas: { name: 'Atlas', color: '#0EA5E9' },
  vesta: { name: 'Vesta', color: '#10B981' },
  juno: { name: 'Juno', color: '#8B5CF6' },
  kairos: { name: 'Kairos', color: '#FFD700' },
  maven: { name: 'Maven', color: '#059669' }
};

export const ASSISTANT_DOCS = {
  zoe: {
    overview: 'Executive Assistant & Strategic Intelligence hub receiving AI-powered suggestions from all departments',
    phase: 'Production',
    version: '2.0',
    features: [
      { name: 'Executive Suggestion Inbox', status: 'active', description: 'Receives prioritized suggestions from all 24 assistants with confidence scoring' },
      { name: 'Priority Filtering', status: 'active', description: 'Filter by priority (critical/high/medium/low) and department' },
      { name: 'Status Management', status: 'active', description: 'Acknowledge, escalate, or archive suggestions' },
      { name: 'Cross-Department Analytics', status: 'active', description: 'KPI dashboards pulling data from all departments' },
      { name: 'Executive Calendar', status: 'active', description: 'Meeting management and scheduling' },
      { name: 'Task Management', status: 'active', description: 'Priority-based task tracking for leadership' },
      { name: 'Confidential Vault Access', status: 'active', description: 'Dual-approval access to sensitive documents' }
    ],
    roadmap: [
      { feature: 'Voice Command Integration', quarter: 'Q2 2025' },
      { feature: 'Mobile Executive App', quarter: 'Q2 2025' },
      { feature: 'AI Meeting Summarization', quarter: 'Q3 2025' }
    ],
    integrations: ['All Assistants', 'Google Calendar', 'Microsoft Teams'],
    dataFlows: { inputs: ['All Assistants'], outputs: ['Executive Reports'] }
  },
  linda: {
    overview: 'WhatsApp CRM Manager handling 23+ agent WhatsApp numbers with AI-powered lead qualification',
    phase: 'Production',
    version: '1.5',
    features: [
      { name: 'Multi-Agent Management', status: 'active', description: 'Manage 23+ WhatsApp Business accounts' },
      { name: 'Conversation Routing', status: 'active', description: 'Intelligent routing based on language, inquiry type, and agent availability' },
      { name: 'Template Messaging', status: 'active', description: 'Approved message templates for quick responses' },
      { name: 'Lead Pre-Qualification', status: 'active', description: 'AI-powered lead scoring from conversations' },
      { name: 'Quick Replies', status: 'active', description: 'Predefined responses for common inquiries' },
      { name: 'Broadcast Manager', status: 'active', description: 'Bulk messaging for campaigns and announcements' },
      { name: 'Agent Status Monitoring', status: 'active', description: 'Real-time agent availability tracking' }
    ],
    roadmap: [
      { feature: 'WhatsApp Business API Integration', quarter: 'Q1 2025' },
      { feature: 'AI Sentiment Analysis', quarter: 'Q2 2025' },
      { feature: 'Multi-Language Auto-Translation', quarter: 'Q2 2025' }
    ],
    integrations: ['WhatsApp Business', 'Clara (Leads)', 'Mary (Inventory)'],
    dataFlows: { inputs: ['Nina'], outputs: ['Clara', 'Mary'] }
  },
  nina: {
    overview: 'WhatsApp Bot Developer creating and managing conversation automation flows',
    phase: 'Production',
    version: '1.3',
    features: [
      { name: 'Bot Builder', status: 'active', description: 'Visual drag-and-drop bot creation interface' },
      { name: 'Flow Designer', status: 'active', description: 'Multi-step conversation flow management' },
      { name: 'Session Monitoring', status: 'active', description: 'Real-time bot session tracking' },
      { name: 'Bot Analytics', status: 'active', description: 'Performance metrics and engagement stats' },
      { name: 'Intent Classification', status: 'active', description: 'AI-powered message intent detection' },
      { name: 'Fallback Handling', status: 'active', description: 'Graceful escalation to human agents' }
    ],
    roadmap: [
      { feature: 'GPT-4 Integration', quarter: 'Q1 2025' },
      { feature: 'Multi-Channel Bots (Telegram, Messenger)', quarter: 'Q3 2025' }
    ],
    integrations: ['WhatsApp API', 'Linda (CRM)', 'OpenAI'],
    dataFlows: { inputs: [], outputs: ['Linda'] }
  },
  mary: {
    overview: 'Inventory CRM Manager for DAMAC Hills 2 with 9,378+ property units and data acquisition tools',
    phase: 'Production',
    version: '2.1',
    features: [
      { name: 'Property Database', status: 'active', description: 'Complete inventory of 9,378+ units across clusters' },
      { name: 'Cluster Browser', status: 'active', description: 'Navigate properties by cluster and unit type' },
      { name: 'DAMAC Asset Fetcher', status: 'active', description: 'Generate S3 URLs for property assets' },
      { name: 'Image Data Extractor', status: 'active', description: 'OCR-based data extraction from images' },
      { name: 'Web Data Harvester', status: 'active', description: 'Scrape property data from listing portals' },
      { name: 'Excel Import/Export', status: 'active', description: 'Bulk data management via spreadsheets' },
      { name: 'Filter & Search', status: 'active', description: 'Advanced filtering by status, price, size' }
    ],
    roadmap: [
      { feature: 'AI Property Valuation', quarter: 'Q2 2025' },
      { feature: 'Virtual Tour Integration', quarter: 'Q2 2025' },
      { feature: '3D Floor Plan Viewer', quarter: 'Q3 2025' }
    ],
    integrations: ['Clara (Leads)', 'Linda (WhatsApp)', 'Olivia (Marketing)'],
    dataFlows: { inputs: ['Clara', 'Sentinel'], outputs: ['Clara', 'Linda', 'Olivia'] }
  },
  nancy: {
    overview: 'HR Manager handling employee lifecycle, recruitment, and performance management',
    phase: 'Production',
    version: '1.4',
    features: [
      { name: 'Employee Directory', status: 'active', description: 'Complete staff database with profiles' },
      { name: 'Recruitment Pipeline', status: 'active', description: 'Candidate tracking from application to hire' },
      { name: 'Resume Screening', status: 'active', description: 'AI-powered resume analysis and scoring' },
      { name: 'Attendance Tracker', status: 'active', description: 'Time and attendance management' },
      { name: 'Performance Reviews', status: 'active', description: 'Periodic evaluation management' },
      { name: 'Onboarding Workflows', status: 'active', description: 'Automated new hire onboarding' },
      { name: 'Leave Management', status: 'active', description: 'Leave requests and approvals' }
    ],
    roadmap: [
      { feature: 'AI Interview Scheduler', quarter: 'Q2 2025' },
      { feature: 'Employee Wellness Tracking', quarter: 'Q3 2025' }
    ],
    integrations: ['Zoe (Executive)', 'Payroll Systems'],
    dataFlows: { inputs: [], outputs: ['Zoe'] }
  },
  daisy: {
    overview: 'Leasing & Tenant Manager for rental properties, Ejari registration, and tenant lifecycle',
    phase: 'Production',
    version: '1.6',
    features: [
      { name: 'Lease Management', status: 'active', description: 'Create and track lease agreements' },
      { name: 'Tenant Directory', status: 'active', description: 'Complete tenant database with contracts' },
      { name: 'Ejari Integration', status: 'active', description: 'Digital Ejari registration workflow' },
      { name: 'Maintenance Requests', status: 'active', description: 'Tenant maintenance ticket system' },
      { name: 'Rent Collection', status: 'active', description: 'Payment tracking and reminders' },
      { name: 'Rental Analytics', status: 'active', description: 'Occupancy rates and yield analysis' },
      { name: 'Renewal Management', status: 'active', description: 'Automated lease renewal workflows' }
    ],
    roadmap: [
      { feature: 'Smart Lock Integration', quarter: 'Q2 2025' },
      { feature: 'Tenant Portal App', quarter: 'Q3 2025' }
    ],
    integrations: ['Mary (Inventory)', 'Theodora (Finance)', 'Sentinel (Maintenance)'],
    dataFlows: { inputs: ['Mary', 'Sentinel'], outputs: ['Mary', 'Theodora'] }
  },
  clara: {
    overview: 'Leads CRM Manager with pipeline management, lead scoring, and conversion tracking',
    phase: 'Production',
    version: '2.0',
    features: [
      { name: 'Lead Pipeline', status: 'active', description: 'Visual pipeline with drag-and-drop stages' },
      { name: 'Lead Scoring', status: 'active', description: 'AI-powered lead qualification scoring' },
      { name: 'Activity Timeline', status: 'active', description: 'Complete interaction history per lead' },
      { name: 'Nurturing Workflows', status: 'active', description: 'Automated follow-up sequences' },
      { name: 'Lead Import/Export', status: 'active', description: 'Bulk lead management' },
      { name: 'Source Tracking', status: 'active', description: 'Attribution by lead source' },
      { name: 'Conversion Analytics', status: 'active', description: 'Pipeline performance metrics' }
    ],
    roadmap: [
      { feature: 'Predictive Lead Scoring', quarter: 'Q1 2025' },
      { feature: 'Auto Lead Assignment', quarter: 'Q2 2025' }
    ],
    integrations: ['Linda (WhatsApp)', 'Mary (Inventory)', 'Sophia (Sales)', 'Hunter (Prospecting)'],
    dataFlows: { inputs: ['Linda', 'Mary', 'Hunter'], outputs: ['Mary', 'Sophia', 'Linda'] }
  },
  sophia: {
    overview: 'Sales Pipeline Manager with deal tracking, forecasting, and commission calculations',
    phase: 'Production',
    version: '1.5',
    features: [
      { name: 'Deal Tracker', status: 'active', description: 'Track deals from offer to closing' },
      { name: 'Sales Pipeline', status: 'active', description: 'Visual deal progression management' },
      { name: 'Sales Forecasting', status: 'active', description: 'Revenue predictions and trends' },
      { name: 'Commission Calculator', status: 'active', description: 'Automated commission calculations' },
      { name: 'Territory Management', status: 'active', description: 'Agent territory assignments' },
      { name: 'Performance Dashboard', status: 'active', description: 'Agent and team performance metrics' }
    ],
    roadmap: [
      { feature: 'AI Deal Probability', quarter: 'Q2 2025' },
      { feature: 'Competitive Analysis', quarter: 'Q3 2025' }
    ],
    integrations: ['Clara (Leads)', 'Theodora (Finance)', 'Zoe (Executive)'],
    dataFlows: { inputs: ['Clara'], outputs: ['Theodora', 'Zoe'] }
  },
  theodora: {
    overview: 'Finance Director managing invoicing, payments, escrow, and financial reporting',
    phase: 'Production',
    version: '1.7',
    features: [
      { name: 'Invoice Management', status: 'active', description: 'Create and track invoices' },
      { name: 'Payment Tracker', status: 'active', description: 'Payment status and history' },
      { name: 'Escrow Management', status: 'active', description: 'Secure transaction holding accounts' },
      { name: 'Financial Reports', status: 'active', description: 'P&L, balance sheets, cash flow' },
      { name: 'Budget Analysis', status: 'active', description: 'Department budget tracking' },
      { name: 'Commission Payouts', status: 'active', description: 'Agent commission processing' }
    ],
    roadmap: [
      { feature: 'Stripe Integration', quarter: 'Q1 2025' },
      { feature: 'Automated Reconciliation', quarter: 'Q2 2025' }
    ],
    integrations: ['Sophia (Sales)', 'Daisy (Leasing)', 'Laila (Compliance)', 'Stripe'],
    dataFlows: { inputs: ['Sophia', 'Daisy'], outputs: ['Laila', 'Zoe'] }
  },
  olivia: {
    overview: 'Marketing & Automation Manager for campaigns, listings, and market intelligence',
    phase: 'Production',
    version: '1.8',
    features: [
      { name: 'Campaign Manager', status: 'active', description: 'Multi-channel marketing campaigns' },
      { name: 'Property Availability Sync', status: 'active', description: 'Auto-sync with Mary inventory' },
      { name: 'Social Media Hub', status: 'active', description: 'Schedule and publish social content' },
      { name: 'Listing Optimization', status: 'active', description: 'SEO and listing quality tools' },
      { name: 'Market Intelligence', status: 'active', description: 'Competitor tracking from Bayut/Dubizzle' },
      { name: 'Content Automation', status: 'active', description: 'AI-generated property descriptions' }
    ],
    roadmap: [
      { feature: 'AI Content Writer', quarter: 'Q2 2025' },
      { feature: 'Video Marketing Tools', quarter: 'Q3 2025' }
    ],
    integrations: ['Mary (Inventory)', 'Bayut', 'Property Finder', 'Dubizzle'],
    dataFlows: { inputs: ['Mary'], outputs: ['Zoe'] }
  },
  laila: {
    overview: 'Compliance Officer managing KYC/AML, regulatory compliance, and audit trails',
    phase: 'Production',
    version: '1.4',
    features: [
      { name: 'KYC Verification', status: 'active', description: 'Client identity verification workflows' },
      { name: 'AML Monitoring', status: 'active', description: 'Anti-money laundering checks' },
      { name: 'Contract Review', status: 'active', description: 'Legal document compliance checks' },
      { name: 'Audit Trail', status: 'active', description: 'Immutable activity logging' },
      { name: 'Regulatory Alerts', status: 'active', description: 'RERA/DLD compliance notifications' },
      { name: 'Risk Scoring', status: 'active', description: 'Transaction risk assessment' }
    ],
    roadmap: [
      { feature: 'UAE Pass Integration', quarter: 'Q1 2025' },
      { feature: 'Automated PEP Screening', quarter: 'Q2 2025' }
    ],
    integrations: ['Theodora (Finance)', 'Clara (Leads)', 'Evangeline (Legal)'],
    dataFlows: { inputs: ['Theodora', 'Clara'], outputs: ['Zoe', 'Evangeline'] }
  },
  aurora: {
    overview: 'CTO & Systems Architect overseeing technical operations, deployments, and AI governance',
    phase: 'Production',
    version: '1.6',
    features: [
      { name: 'System Health Dashboard', status: 'active', description: 'Real-time infrastructure monitoring' },
      { name: 'Deployment Pipeline', status: 'active', description: 'CI/CD and release management' },
      { name: 'Documentation Hub', status: 'active', description: 'Technical documentation portal' },
      { name: 'AI Governance', status: 'active', description: 'AI assistant performance and controls' },
      { name: 'Application Portfolio', status: 'active', description: 'Manage all company applications' },
      { name: 'Performance Analytics', status: 'active', description: 'App performance metrics' }
    ],
    roadmap: [
      { feature: 'Automated Testing Suite', quarter: 'Q2 2025' },
      { feature: 'Disaster Recovery Dashboard', quarter: 'Q3 2025' }
    ],
    integrations: ['All Assistants', 'GitHub', 'Vercel'],
    dataFlows: { inputs: ['All'], outputs: ['All'] }
  },
  hazel: {
    overview: 'Elite Frontend Engineer maintaining the design system and UI component library',
    phase: 'Production',
    version: '1.3',
    features: [
      { name: 'Component Library', status: 'active', description: 'Reusable UI component catalog' },
      { name: 'Design System', status: 'active', description: 'Tokens, typography, spacing standards' },
      { name: 'Theme Manager', status: 'active', description: 'Light/dark theme configuration' },
      { name: 'Accessibility Audit', status: 'active', description: 'WCAG compliance checking' },
      { name: 'Responsive Testing', status: 'active', description: 'Multi-device preview tools' },
      { name: 'Icon Library', status: 'active', description: 'Lucide icon management' }
    ],
    roadmap: [
      { feature: 'Storybook Integration', quarter: 'Q2 2025' },
      { feature: 'Figma Sync', quarter: 'Q3 2025' }
    ],
    integrations: ['Aurora (Tech Lead)', 'Figma'],
    dataFlows: { inputs: ['Aurora'], outputs: ['Aurora'] }
  },
  willow: {
    overview: 'Elite Backend Engineer managing APIs, database optimization, and system reliability',
    phase: 'Production',
    version: '1.4',
    features: [
      { name: 'API Dashboard', status: 'active', description: 'API health and usage monitoring' },
      { name: 'Database Monitor', status: 'active', description: 'Query performance and optimization' },
      { name: 'Performance Metrics', status: 'active', description: 'Response times and throughput' },
      { name: 'Security Center', status: 'active', description: 'Security scanning and alerts' },
      { name: 'Cache Management', status: 'active', description: 'Redis cache configuration' },
      { name: 'Data Pipeline', status: 'active', description: 'ETL job monitoring' }
    ],
    roadmap: [
      { feature: 'GraphQL Playground', quarter: 'Q2 2025' },
      { feature: 'Auto-Scaling Config', quarter: 'Q3 2025' }
    ],
    integrations: ['Aurora (Tech Lead)', 'MongoDB', 'Redis'],
    dataFlows: { inputs: ['Aurora'], outputs: ['Aurora'] }
  },
  evangeline: {
    overview: 'Legal Risk Analyst monitoring contracts, regulations, and transaction compliance',
    phase: 'Production',
    version: '1.2',
    features: [
      { name: 'Legal Risk Analysis', status: 'active', description: 'Proactive legal issue identification' },
      { name: 'Contract Monitoring', status: 'active', description: 'Track contract status and renewals' },
      { name: 'Regulatory Tracker', status: 'active', description: 'RERA/DLD regulation updates' },
      { name: 'Dispute Prevention', status: 'active', description: 'Early warning system for conflicts' },
      { name: 'Best Practices Library', status: 'active', description: 'Legal templates and guidelines' },
      { name: 'Clause Analysis', status: 'active', description: 'AI-powered contract clause review' }
    ],
    roadmap: [
      { feature: 'AI Contract Drafting', quarter: 'Q2 2025' },
      { feature: 'Court Case Tracking', quarter: 'Q3 2025' }
    ],
    integrations: ['Laila (Compliance)', 'Theodora (Finance)', 'Clara (Leads)'],
    dataFlows: { inputs: ['Laila', 'Theodora', 'Clara'], outputs: ['Zoe', 'Laila'] }
  },
  sentinel: {
    overview: 'Property Monitoring AI with IoT integration, predictive maintenance, and emergency response',
    phase: 'Production',
    version: '1.1',
    features: [
      { name: 'Property Monitoring', status: 'active', description: 'IoT sensor data dashboard' },
      { name: 'Predictive Maintenance', status: 'active', description: 'AI-predicted maintenance needs' },
      { name: 'Inspection Scheduler', status: 'active', description: 'Automated inspection scheduling' },
      { name: 'Vendor Management', status: 'active', description: 'Contractor database and dispatch' },
      { name: 'Emergency Response', status: 'active', description: '24/7 emergency coordination' },
      { name: 'Work Order System', status: 'active', description: 'Maintenance work order tracking' }
    ],
    roadmap: [
      { feature: 'Smart Home Integration', quarter: 'Q2 2025' },
      { feature: 'Drone Inspection', quarter: 'Q4 2025' }
    ],
    integrations: ['Mary (Inventory)', 'Daisy (Leasing)', 'Juno (Facilities)'],
    dataFlows: { inputs: ['Mary'], outputs: ['Mary', 'Daisy'] }
  },
  hunter: {
    overview: 'Lead Prospecting AI scanning markets for potential buyers and sellers',
    phase: 'Production',
    version: '1.0',
    features: [
      { name: 'Prospect Analysis', status: 'active', description: 'Identify high-potential prospects' },
      { name: 'Market Scanning', status: 'active', description: 'Monitor listing portals for opportunities' },
      { name: 'Pattern Detection', status: 'active', description: 'Buying/selling pattern recognition' },
      { name: 'Outreach Campaigns', status: 'active', description: 'Automated prospect outreach' },
      { name: 'Lead Enrichment', status: 'active', description: 'Enhance lead data with external sources' },
      { name: 'Cold Lead Warming', status: 'active', description: 'Re-engage dormant prospects' }
    ],
    roadmap: [
      { feature: 'Social Media Prospecting', quarter: 'Q2 2025' },
      { feature: 'AI Intent Scoring', quarter: 'Q3 2025' }
    ],
    integrations: ['Clara (Leads)', 'Mary (Inventory)', 'Olivia (Marketing)'],
    dataFlows: { inputs: ['Mary', 'Olivia'], outputs: ['Clara'] }
  },
  henry: {
    overview: 'Record Keeper & Timeline Master creating immutable audit trails and compliance reports',
    phase: 'Production',
    version: '1.0',
    features: [
      { name: 'Event Timeline', status: 'active', description: 'Chronological activity visualization' },
      { name: 'Audit Log', status: 'active', description: 'Immutable action records' },
      { name: 'Timeline Analytics', status: 'active', description: 'Pattern analysis across events' },
      { name: 'Compliance Reports', status: 'active', description: 'Automated compliance documentation' },
      { name: 'Search & Query', status: 'active', description: 'Powerful event search engine' },
      { name: 'SLA Monitoring', status: 'active', description: 'Service level agreement tracking' }
    ],
    roadmap: [
      { feature: 'Blockchain Anchoring', quarter: 'Q3 2025' },
      { feature: 'AI Anomaly Detection', quarter: 'Q4 2025' }
    ],
    integrations: ['All Assistants', 'Zoe (Executive)', 'Laila (Compliance)'],
    dataFlows: { inputs: ['All'], outputs: ['Zoe', 'Laila', 'Aurora'] }
  },
  cipher: {
    overview: 'Predictive Market Analyst using DLD data and economic indicators for property valuation',
    phase: 'Production',
    version: '1.0',
    features: [
      { name: 'Market Trends', status: 'active', description: 'Real-time market trend analysis' },
      { name: 'Price Predictions', status: 'active', description: 'AI-powered valuation forecasts' },
      { name: 'Competitor Tracking', status: 'active', description: 'Monitor competitor activity' },
      { name: 'Economic Indicators', status: 'active', description: 'Track macro-economic factors' },
      { name: 'Investment Scoring', status: 'active', description: 'Property investment ratings' },
      { name: 'Demand Forecasting', status: 'active', description: 'Predict area demand trends' }
    ],
    roadmap: [
      { feature: 'DLD API Integration', quarter: 'Q2 2025' },
      { feature: 'AI Market Reports', quarter: 'Q3 2025' }
    ],
    integrations: ['Mary (Inventory)', 'Henry (Audit)', 'Maven (Investment)', 'Olivia (Marketing)'],
    dataFlows: { inputs: ['Mary', 'Henry'], outputs: ['Zoe', 'Olivia', 'Maven'] }
  },
  atlas: {
    overview: 'Development & Project Intelligence for off-plan projects, zoning, and developer tracking',
    phase: 'Production',
    version: '1.0',
    features: [
      { name: 'Project Pipeline', status: 'active', description: 'Track upcoming developments' },
      { name: 'Feasibility Analysis', status: 'active', description: 'ROI and viability assessments' },
      { name: 'Developer Tracking', status: 'active', description: 'Developer reputation database' },
      { name: 'Zoning Analysis', status: 'active', description: 'Land use and zoning maps' },
      { name: 'Market Gap Detection', status: 'active', description: 'Identify underserved markets' },
      { name: 'ROI Projections', status: 'active', description: 'Investment return modeling' }
    ],
    roadmap: [
      { feature: 'Dubai Municipality Integration', quarter: 'Q2 2025' },
      { feature: '3D Development Viewer', quarter: 'Q4 2025' }
    ],
    integrations: ['Mary (Inventory)', 'Clara (Leads)', 'Cipher (Market)'],
    dataFlows: { inputs: ['Cipher', 'Mary'], outputs: ['Mary', 'Clara', 'Cipher'] }
  },
  vesta: {
    overview: 'Project & Snagging Coordinator tracking construction milestones and handover processes',
    phase: 'Production',
    version: '1.0',
    features: [
      { name: 'Milestone Tracker', status: 'active', description: 'Construction progress monitoring' },
      { name: 'Snagging Manager', status: 'active', description: 'Digital defect reporting' },
      { name: 'Handover Coordination', status: 'active', description: 'Unit handover workflows' },
      { name: 'Defect Reporting', status: 'active', description: 'Photo-based defect logging' },
      { name: 'Developer Communication', status: 'active', description: 'Automated developer updates' },
      { name: 'Image Recognition', status: 'active', description: 'AI defect detection from photos' }
    ],
    roadmap: [
      { feature: 'AR Snagging Tool', quarter: 'Q3 2025' },
      { feature: 'Warranty Tracking', quarter: 'Q4 2025' }
    ],
    integrations: ['Mary (Inventory)', 'Linda (WhatsApp)', 'Atlas (Projects)'],
    dataFlows: { inputs: ['Atlas', 'Mary'], outputs: ['Mary', 'Linda'] }
  },
  juno: {
    overview: 'Smart Community & Facilities Manager with IoT integration and energy optimization',
    phase: 'Production',
    version: '1.0',
    features: [
      { name: 'Facilities Manager', status: 'active', description: 'Community amenity management' },
      { name: 'IoT Dashboard', status: 'active', description: 'Smart building sensor data' },
      { name: 'Community Events', status: 'active', description: 'Event scheduling and promotion' },
      { name: 'Energy Optimization', status: 'active', description: 'Utility usage optimization' },
      { name: 'Access Control', status: 'active', description: 'Gate and door access management' },
      { name: 'Service Automation', status: 'active', description: 'Automated service requests' }
    ],
    roadmap: [
      { feature: 'Resident Mobile App', quarter: 'Q2 2025' },
      { feature: 'Solar Panel Integration', quarter: 'Q4 2025' }
    ],
    integrations: ['Sentinel (Monitoring)', 'Mary (Inventory)', 'Nina (Bots)'],
    dataFlows: { inputs: ['Sentinel', 'Mary'], outputs: ['Nina', 'Sentinel'] }
  },
  kairos: {
    overview: 'Luxury Concierge & VIP Experience curator for high-net-worth clients',
    phase: 'Production',
    version: '1.0',
    features: [
      { name: 'VIP Client Manager', status: 'active', description: 'Premium client database' },
      { name: 'Concierge Services', status: 'active', description: 'Personalized service coordination' },
      { name: 'Lifestyle Coordination', status: 'active', description: 'Interior design, relocation services' },
      { name: 'Partner Network', status: 'active', description: 'Premium service provider directory' },
      { name: 'Exclusive Access', status: 'active', description: 'Early access to premium listings' },
      { name: 'White-Glove Service', status: 'active', description: 'End-to-end transaction support' }
    ],
    roadmap: [
      { feature: 'Private Jet Booking', quarter: 'Q2 2025' },
      { feature: 'Art Collection Advisory', quarter: 'Q4 2025' }
    ],
    integrations: ['Clara (Leads)', 'Linda (WhatsApp)', 'Sophia (Sales)'],
    dataFlows: { inputs: ['Clara', 'Sophia'], outputs: ['Clara', 'Linda'] }
  },
  maven: {
    overview: 'Investment Strategy & Portfolio Optimizer analyzing yields and providing investment advice',
    phase: 'Production',
    version: '1.0',
    features: [
      { name: 'Portfolio Analysis', status: 'active', description: 'Multi-property portfolio tracking' },
      { name: 'Yield Optimization', status: 'active', description: 'Rental yield maximization' },
      { name: 'Tax Planning', status: 'active', description: 'Tax-efficient investment strategies' },
      { name: 'Investment Advice', status: 'active', description: 'Buy/hold/sell recommendations' },
      { name: 'Risk Assessment', status: 'active', description: 'Investment risk scoring' },
      { name: 'Performance Tracking', status: 'active', description: 'ROI and appreciation tracking' }
    ],
    roadmap: [
      { feature: 'Golden Visa Calculator', quarter: 'Q2 2025' },
      { feature: 'International Market Comparison', quarter: 'Q4 2025' }
    ],
    integrations: ['Cipher (Market)', 'Theodora (Finance)', 'Mary (Inventory)', 'Zoe (Executive)'],
    dataFlows: { inputs: ['Cipher', 'Theodora', 'Mary'], outputs: ['Zoe', 'Clara'] }
  }
};

export const getAssistantDocs = (assistantId) => {
  const docs = ASSISTANT_DOCS[assistantId];
  const metadata = ASSISTANT_METADATA[assistantId];
  if (!docs) return null;
  return {
    ...docs,
    name: metadata?.name || assistantId.charAt(0).toUpperCase() + assistantId.slice(1),
    color: metadata?.color || '#8B5CF6'
  };
};

export const getAllAssistantDocs = () => {
  return Object.entries(ASSISTANT_DOCS).map(([id, docs]) => ({
    id,
    ...docs
  }));
};

export default ASSISTANT_DOCS;
