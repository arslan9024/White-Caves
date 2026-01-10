export const DEPARTMENTS_SEED = [
  {
    name: 'Executive',
    code: 'EXEC',
    description: 'Strategic leadership and company-wide decision making',
    color: '#10B981',
    icon: 'Briefcase',
    head: { name: 'Arslan Malik', email: 'arslan@whitecaves.ae', title: 'CEO & Founder' },
    kpis: [
      { name: 'Revenue Target', target: 600000000, current: 425000000, unit: 'AED' },
      { name: 'AI Assistants Online', target: 32, current: 28, unit: 'count' }
    ],
    budget: { allocated: 5000000, spent: 3200000, currency: 'AED' },
    order: 1
  },
  {
    name: 'Operations',
    code: 'OPS',
    description: 'Inventory management, maintenance, and facility coordination',
    color: '#3B82F6',
    icon: 'Building2',
    head: { name: 'Omar Siddiqui', email: 'omar@whitecaves.ae', title: 'Director of Operations' },
    kpis: [
      { name: 'Properties Managed', target: 10000, current: 9378, unit: 'count' },
      { name: 'Occupancy Rate', target: 90, current: 87, unit: 'percent' }
    ],
    budget: { allocated: 2500000, spent: 1850000, currency: 'AED' },
    order: 2
  },
  {
    name: 'Sales',
    code: 'SALES',
    description: 'Property sales, lead management, and deal pipeline',
    color: '#8B5CF6',
    icon: 'TrendingUp',
    head: { name: 'Rashid Al Futtaim', email: 'rashid@whitecaves.ae', title: 'Director of Sales' },
    kpis: [
      { name: 'Monthly Deals', target: 50, current: 42, unit: 'count' },
      { name: 'Pipeline Value', target: 100000000, current: 79800000, unit: 'AED' }
    ],
    budget: { allocated: 3500000, spent: 2800000, currency: 'AED' },
    order: 3
  },
  {
    name: 'Finance',
    code: 'FIN',
    description: 'Payment processing, invoicing, and investment advisory',
    color: '#F59E0B',
    icon: 'Wallet',
    head: { name: 'Hana Al Zaabi', email: 'hana@whitecaves.ae', title: 'Director of Finance' },
    kpis: [
      { name: 'Monthly Revenue', target: 50000000, current: 35000000, unit: 'AED' },
      { name: 'Collections Rate', target: 98, current: 94, unit: 'percent' }
    ],
    budget: { allocated: 1500000, spent: 1100000, currency: 'AED' },
    order: 4
  },
  {
    name: 'Marketing',
    code: 'MKT',
    description: 'Property marketing, campaigns, and portal publishing',
    color: '#EC4899',
    icon: 'Megaphone',
    head: { name: 'Layla Al Suwaidi', email: 'layla@whitecaves.ae', title: 'Director of Marketing' },
    kpis: [
      { name: 'Leads Generated', target: 500, current: 450, unit: 'count' },
      { name: 'Portal Views', target: 150000, current: 125000, unit: 'count' }
    ],
    budget: { allocated: 2000000, spent: 1600000, currency: 'AED' },
    order: 5
  },
  {
    name: 'Communications',
    code: 'COMM',
    description: 'Customer messaging, WhatsApp operations, and chatbot management',
    color: '#25D366',
    icon: 'MessageSquare',
    head: { name: 'Khalid Al Mansoori', email: 'khalid@whitecaves.ae', title: 'Director of Communications' },
    kpis: [
      { name: 'Response Time', target: 2, current: 2.3, unit: 'minutes' },
      { name: 'Satisfaction Score', target: 95, current: 94, unit: 'percent' }
    ],
    budget: { allocated: 1200000, spent: 900000, currency: 'AED' },
    order: 6
  },
  {
    name: 'Compliance',
    code: 'COMP',
    description: 'KYC verification, AML monitoring, and RERA compliance',
    color: '#6366F1',
    icon: 'Shield',
    head: { name: 'Nadia Ibrahim', email: 'nadia@whitecaves.ae', title: 'Director of Compliance' },
    kpis: [
      { name: 'Compliance Score', target: 100, current: 98, unit: 'percent' },
      { name: 'KYC Profiles', target: 100, current: 89, unit: 'count' }
    ],
    budget: { allocated: 800000, spent: 550000, currency: 'AED' },
    order: 7
  },
  {
    name: 'Technology',
    code: 'TECH',
    description: 'Platform development, AI systems, and infrastructure',
    color: '#0EA5E9',
    icon: 'Server',
    head: { name: 'Tariq Al Qasimi', email: 'tariq@whitecaves.ae', title: 'Director of Technology' },
    kpis: [
      { name: 'System Uptime', target: 99.99, current: 99.97, unit: 'percent' },
      { name: 'API Requests', target: 150000, current: 125000, unit: 'daily' }
    ],
    budget: { allocated: 3000000, spent: 2400000, currency: 'AED' },
    order: 8
  },
  {
    name: 'Intelligence',
    code: 'INTEL',
    description: 'Market research, analytics, and off-plan tracking',
    color: '#0D9488',
    icon: 'Brain',
    head: { name: 'Yusuf Al Ghurair', email: 'yusuf@whitecaves.ae', title: 'Director of Intelligence' },
    kpis: [
      { name: 'Forecast Accuracy', target: 90, current: 87, unit: 'percent' },
      { name: 'Off-Plan Projects', target: 50, current: 42, unit: 'count' }
    ],
    budget: { allocated: 1000000, spent: 750000, currency: 'AED' },
    order: 9
  },
  {
    name: 'Legal',
    code: 'LEGAL',
    description: 'Contract management, legal reviews, and dispute resolution',
    color: '#DC2626',
    icon: 'Scale',
    head: { name: 'Aisha Al Ketbi', email: 'aisha@whitecaves.ae', title: 'Director of Legal' },
    kpis: [
      { name: 'Contracts Reviewed', target: 200, current: 156, unit: 'count' },
      { name: 'Avg Review Time', target: 2, current: 2.5, unit: 'days' }
    ],
    budget: { allocated: 900000, spent: 680000, currency: 'AED' },
    order: 10
  }
];

export const ASSISTANTS_SEED = [
  {
    name: 'Zoe',
    code: 'ZOE',
    role: 'MD Executive Assistant',
    departmentCode: 'EXEC',
    avatar: '/avatars/zoe.png',
    color: '#10B981',
    description: 'Executive AI assistant providing strategic intelligence, decision support, and organizational oversight for the Managing Director.',
    capabilities: ['Strategic Analysis', 'Executive Briefings', 'Decision Support', 'Organizational Oversight', 'Meeting Coordination'],
    features: [
      { id: 'dashboard', name: 'Executive Dashboard', icon: 'LayoutDashboard', route: '/md/dashboard' },
      { id: 'inbox', name: 'Suggestion Inbox', icon: 'Inbox', route: '/md/suggestions' },
      { id: 'analytics', name: 'Analytics', icon: 'BarChart3', route: '/md/analytics' },
      { id: 'reports', name: 'Reports', icon: 'FileText', route: '/md/reports' }
    ],
    accessLevel: 'executive',
    permissions: [{ resource: '*', actions: ['read', 'write', 'delete', 'approve'] }],
    status: 'online',
    health: { score: 100, lastCheck: new Date() },
    metrics: { tasksCompleted: 1250, avgResponseTime: 0.8, successRate: 99.2, activeConnections: 3 },
    order: 1
  },
  {
    name: 'Mary',
    code: 'MARY',
    role: 'Inventory Manager',
    departmentCode: 'OPS',
    avatar: '/avatars/mary.png',
    color: '#3B82F6',
    description: 'Manages property inventory database, data acquisition tools, and listing coordination across all platforms.',
    capabilities: ['Inventory Management', 'Data Acquisition', 'Asset Fetching', 'OCR Processing', 'Listing Sync'],
    features: [
      { id: 'inventory', name: 'Inventory', icon: 'Package', route: '/ops/inventory' },
      { id: 'data-tools', name: 'Data Tools', icon: 'Database', route: '/ops/data-tools' },
      { id: 'import', name: 'Data Import', icon: 'Upload', route: '/ops/import' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 98, lastCheck: new Date() },
    metrics: { tasksCompleted: 8750, avgResponseTime: 1.2, successRate: 97.5, activeConnections: 5 },
    order: 2
  },
  {
    name: 'Daisy',
    code: 'DAISY',
    role: 'Property Coordinator',
    departmentCode: 'OPS',
    avatar: '/avatars/daisy.png',
    color: '#22C55E',
    description: 'Coordinates leasing operations, tenant management, and rental analytics.',
    capabilities: ['Lease Management', 'Tenant Coordination', 'Maintenance Tracking', 'Rental Analytics'],
    features: [
      { id: 'leases', name: 'Leases', icon: 'FileText', route: '/ops/leases' },
      { id: 'tenants', name: 'Tenants', icon: 'Users', route: '/ops/tenants' },
      { id: 'maintenance', name: 'Maintenance', icon: 'Wrench', route: '/ops/maintenance' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 96, lastCheck: new Date() },
    metrics: { tasksCompleted: 5420, avgResponseTime: 1.5, successRate: 95.8, activeConnections: 4 },
    order: 3
  },
  {
    name: 'Sentinel',
    code: 'SENTINEL',
    role: 'Quality Control',
    departmentCode: 'OPS',
    avatar: '/avatars/sentinel.png',
    color: '#EF4444',
    description: 'Monitors property conditions, predicts maintenance needs, and manages emergency responses.',
    capabilities: ['Property Monitoring', 'Predictive Maintenance', 'Quality Inspections', 'Emergency Response'],
    features: [
      { id: 'monitoring', name: 'Monitoring', icon: 'Eye', route: '/ops/monitoring' },
      { id: 'maintenance', name: 'Predictive Maintenance', icon: 'Wrench', route: '/ops/predictive' },
      { id: 'inspections', name: 'Inspections', icon: 'ClipboardCheck', route: '/ops/inspections' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 100, lastCheck: new Date() },
    metrics: { tasksCompleted: 3250, avgResponseTime: 0.5, successRate: 99.8, activeConnections: 8 },
    order: 4
  },
  {
    name: 'Clara',
    code: 'CLARA',
    role: 'Lead Manager',
    departmentCode: 'SALES',
    avatar: '/avatars/clara.png',
    color: '#8B5CF6',
    description: 'Manages lead pipeline, scoring algorithms, and nurturing workflows for optimal conversion.',
    capabilities: ['Lead Management', 'Pipeline Optimization', 'Lead Scoring', 'Nurturing Automation'],
    features: [
      { id: 'pipeline', name: 'Pipeline', icon: 'GitBranch', route: '/sales/pipeline' },
      { id: 'leads', name: 'Lead List', icon: 'Users', route: '/sales/leads' },
      { id: 'scoring', name: 'Scoring', icon: 'Star', route: '/sales/scoring' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 97, lastCheck: new Date() },
    metrics: { tasksCompleted: 4820, avgResponseTime: 1.1, successRate: 96.5, activeConnections: 6 },
    order: 5
  },
  {
    name: 'Sophia',
    code: 'SOPHIA',
    role: 'Contract Manager',
    departmentCode: 'SALES',
    avatar: '/avatars/sophia.png',
    color: '#F59E0B',
    description: 'Manages deals, sales pipeline, forecasting, and commission calculations.',
    capabilities: ['Deal Management', 'Sales Pipeline', 'Forecasting', 'Commission Tracking'],
    features: [
      { id: 'deals', name: 'Deals', icon: 'Handshake', route: '/sales/deals' },
      { id: 'pipeline', name: 'Sales Pipeline', icon: 'TrendingUp', route: '/sales/sales-pipeline' },
      { id: 'forecast', name: 'Forecast', icon: 'LineChart', route: '/sales/forecast' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 99, lastCheck: new Date() },
    metrics: { tasksCompleted: 6150, avgResponseTime: 0.9, successRate: 98.2, activeConnections: 7 },
    order: 6
  },
  {
    name: 'Hunter',
    code: 'HUNTER',
    role: 'Lead Hunter',
    departmentCode: 'SALES',
    avatar: '/avatars/hunter.png',
    color: '#DC2626',
    description: 'Actively prospects new leads, runs outreach campaigns, and enriches lead data.',
    capabilities: ['Lead Prospecting', 'Outreach Campaigns', 'Pattern Detection', 'Lead Enrichment'],
    features: [
      { id: 'prospects', name: 'Prospects', icon: 'Target', route: '/sales/prospects' },
      { id: 'outreach', name: 'Outreach', icon: 'Send', route: '/sales/outreach' },
      { id: 'enrichment', name: 'Enrichment', icon: 'Sparkles', route: '/sales/enrichment' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 95, lastCheck: new Date() },
    metrics: { tasksCompleted: 2890, avgResponseTime: 2.1, successRate: 94.3, activeConnections: 3 },
    order: 7
  },
  {
    name: 'Kairos',
    code: 'KAIROS',
    role: 'VIP Services',
    departmentCode: 'SALES',
    avatar: '/avatars/kairos.png',
    color: '#FFD700',
    description: 'Provides white-glove service for VIP clients with concierge support and lifestyle partnerships.',
    capabilities: ['VIP Client Management', 'Concierge Services', 'Lifestyle Partnerships', 'Exclusive Access'],
    features: [
      { id: 'vip', name: 'VIP Clients', icon: 'Crown', route: '/sales/vip' },
      { id: 'concierge', name: 'Concierge', icon: 'Star', route: '/sales/concierge' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 100, lastCheck: new Date() },
    metrics: { tasksCompleted: 890, avgResponseTime: 0.6, successRate: 99.5, activeConnections: 2 },
    order: 8
  },
  {
    name: 'Linda',
    code: 'LINDA',
    role: 'WhatsApp Manager',
    departmentCode: 'COMM',
    avatar: '/avatars/linda.png',
    color: '#25D366',
    description: 'Manages WhatsApp Business conversations, agent status, templates, and broadcasts.',
    capabilities: ['WhatsApp Management', 'Agent Coordination', 'Template Management', 'Broadcast Campaigns'],
    features: [
      { id: 'conversations', name: 'Conversations', icon: 'MessageSquare', route: '/comm/conversations' },
      { id: 'agents', name: 'Agent Status', icon: 'Users', route: '/comm/agents' },
      { id: 'templates', name: 'Templates', icon: 'FileText', route: '/comm/templates' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 98, lastCheck: new Date() },
    metrics: { tasksCompleted: 12500, avgResponseTime: 0.3, successRate: 97.8, activeConnections: 15 },
    order: 9
  },
  {
    name: 'Nina',
    code: 'NINA',
    role: 'Client Relations',
    departmentCode: 'COMM',
    avatar: '/avatars/nina.png',
    color: '#06B6D4',
    description: 'Builds and manages chatbot flows, client sessions, and conversation analytics.',
    capabilities: ['Bot Building', 'Flow Design', 'Session Management', 'Conversation Analytics'],
    features: [
      { id: 'bot-builder', name: 'Bot Builder', icon: 'Bot', route: '/comm/bot-builder' },
      { id: 'flows', name: 'Flow Designer', icon: 'GitBranch', route: '/comm/flows' },
      { id: 'sessions', name: 'Sessions', icon: 'Activity', route: '/comm/sessions' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 96, lastCheck: new Date() },
    metrics: { tasksCompleted: 4280, avgResponseTime: 1.4, successRate: 95.2, activeConnections: 8 },
    order: 10
  },
  {
    name: 'Theodora',
    code: 'THEODORA',
    role: 'CFO Intelligence',
    departmentCode: 'FIN',
    avatar: '/avatars/theodora.png',
    color: '#F59E0B',
    description: 'Manages invoicing, payments, financial reporting, and escrow operations.',
    capabilities: ['Invoice Processing', 'Payment Management', 'Financial Reporting', 'Escrow Management'],
    features: [
      { id: 'invoices', name: 'Invoices', icon: 'Receipt', route: '/finance/invoices' },
      { id: 'payments', name: 'Payments', icon: 'CreditCard', route: '/finance/payments' },
      { id: 'reports', name: 'Reports', icon: 'FileText', route: '/finance/reports' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 100, lastCheck: new Date() },
    metrics: { tasksCompleted: 8920, avgResponseTime: 0.7, successRate: 99.1, activeConnections: 4 },
    order: 11
  },
  {
    name: 'Maven',
    code: 'MAVEN',
    role: 'Investment Advisor',
    departmentCode: 'FIN',
    avatar: '/avatars/maven.png',
    color: '#A855F7',
    description: 'Provides investment portfolio analysis, yield calculations, and tax planning guidance.',
    capabilities: ['Portfolio Analysis', 'Yield Calculation', 'Tax Planning', 'Investment Advice'],
    features: [
      { id: 'portfolio', name: 'Portfolio', icon: 'PieChart', route: '/finance/portfolio' },
      { id: 'yields', name: 'Yields', icon: 'TrendingUp', route: '/finance/yields' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 97, lastCheck: new Date() },
    metrics: { tasksCompleted: 1560, avgResponseTime: 2.3, successRate: 96.8, activeConnections: 2 },
    order: 12
  },
  {
    name: 'Olivia',
    code: 'OLIVIA',
    role: 'Research Lead',
    departmentCode: 'MKT',
    avatar: '/avatars/olivia.png',
    color: '#EC4899',
    description: 'Leads marketing campaigns, social media automation, and market intelligence gathering.',
    capabilities: ['Campaign Management', 'Social Media', 'Marketing Automation', 'Market Intelligence'],
    features: [
      { id: 'campaigns', name: 'Campaigns', icon: 'Megaphone', route: '/marketing/campaigns' },
      { id: 'social', name: 'Social Media', icon: 'Share2', route: '/marketing/social' },
      { id: 'automation', name: 'Automation', icon: 'Zap', route: '/marketing/automation' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 98, lastCheck: new Date() },
    metrics: { tasksCompleted: 3450, avgResponseTime: 1.8, successRate: 97.2, activeConnections: 5 },
    order: 13
  },
  {
    name: 'Laila',
    code: 'LAILA',
    role: 'Brand Manager',
    departmentCode: 'COMP',
    avatar: '/avatars/laila.png',
    color: '#6366F1',
    description: 'Handles KYC verification, AML monitoring, contract review, and audit trail management.',
    capabilities: ['KYC Verification', 'AML Monitoring', 'Contract Review', 'Audit Trail'],
    features: [
      { id: 'kyc', name: 'KYC', icon: 'UserCheck', route: '/compliance/kyc' },
      { id: 'aml', name: 'AML', icon: 'Shield', route: '/compliance/aml' },
      { id: 'contracts', name: 'Contracts', icon: 'FileText', route: '/compliance/contracts' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 100, lastCheck: new Date() },
    metrics: { tasksCompleted: 2180, avgResponseTime: 1.2, successRate: 99.5, activeConnections: 3 },
    order: 14
  },
  {
    name: 'Henry',
    code: 'HENRY',
    role: 'Compliance Officer',
    departmentCode: 'TECH',
    avatar: '/avatars/henry.png',
    color: '#0EA5E9',
    description: 'Manages event logging, audit trails, timeline analytics, and compliance reporting.',
    capabilities: ['Event Logging', 'Audit Trail', 'Timeline Analytics', 'Compliance Reporting'],
    features: [
      { id: 'events', name: 'Events', icon: 'Activity', route: '/tech/events' },
      { id: 'audit', name: 'Audit Log', icon: 'FileSearch', route: '/tech/audit' },
      { id: 'timeline', name: 'Timeline', icon: 'Clock', route: '/tech/timeline' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 99, lastCheck: new Date() },
    metrics: { tasksCompleted: 15600, avgResponseTime: 0.2, successRate: 99.9, activeConnections: 12 },
    order: 15
  },
  {
    name: 'Aurora',
    code: 'AURORA',
    role: 'CTO Intelligence',
    departmentCode: 'TECH',
    avatar: '/avatars/aurora.png',
    color: '#7C3AED',
    description: 'Oversees system health, deployments, documentation, and AI governance.',
    capabilities: ['System Monitoring', 'Deployment Management', 'Documentation', 'AI Governance'],
    features: [
      { id: 'systems', name: 'Systems Health', icon: 'Server', route: '/tech/systems' },
      { id: 'deployments', name: 'Deployments', icon: 'Rocket', route: '/tech/deployments' },
      { id: 'docs', name: 'Documentation', icon: 'Book', route: '/tech/docs' }
    ],
    accessLevel: 'executive',
    status: 'online',
    health: { score: 100, lastCheck: new Date() },
    metrics: { tasksCompleted: 2890, avgResponseTime: 0.5, successRate: 99.7, activeConnections: 6 },
    order: 16
  },
  {
    name: 'Hazel',
    code: 'HAZEL',
    role: 'Frontend UX',
    departmentCode: 'TECH',
    avatar: '/avatars/hazel.png',
    color: '#84CC16',
    description: 'Manages UI components, design system, accessibility, and theme customization.',
    capabilities: ['UI Components', 'Design System', 'Accessibility', 'Theme Management'],
    features: [
      { id: 'components', name: 'Components', icon: 'Layers', route: '/tech/components' },
      { id: 'design', name: 'Design System', icon: 'Palette', route: '/tech/design' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 96, lastCheck: new Date() },
    metrics: { tasksCompleted: 1420, avgResponseTime: 1.6, successRate: 95.4, activeConnections: 3 },
    order: 17
  },
  {
    name: 'Willow',
    code: 'WILLOW',
    role: 'Backend Ops',
    departmentCode: 'TECH',
    avatar: '/avatars/willow.png',
    color: '#14B8A6',
    description: 'Manages APIs, database operations, performance optimization, and security.',
    capabilities: ['API Management', 'Database Ops', 'Performance', 'Security'],
    features: [
      { id: 'apis', name: 'APIs', icon: 'Code', route: '/tech/apis' },
      { id: 'database', name: 'Database', icon: 'Database', route: '/tech/database' },
      { id: 'security', name: 'Security', icon: 'Lock', route: '/tech/security' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 98, lastCheck: new Date() },
    metrics: { tasksCompleted: 3560, avgResponseTime: 0.4, successRate: 98.6, activeConnections: 8 },
    order: 18
  },
  {
    name: 'Cipher',
    code: 'CIPHER',
    role: 'Market Intel',
    departmentCode: 'INTEL',
    avatar: '/avatars/cipher.png',
    color: '#0D9488',
    description: 'Analyzes market trends, generates predictions, and tracks competitor activities.',
    capabilities: ['Market Trends', 'Price Predictions', 'Competitor Tracking', 'Economic Analysis'],
    features: [
      { id: 'trends', name: 'Market Trends', icon: 'TrendingUp', route: '/intel/trends' },
      { id: 'predictions', name: 'Predictions', icon: 'Sparkles', route: '/intel/predictions' },
      { id: 'competitors', name: 'Competitors', icon: 'Users', route: '/intel/competitors' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 97, lastCheck: new Date() },
    metrics: { tasksCompleted: 1890, avgResponseTime: 3.2, successRate: 96.1, activeConnections: 4 },
    order: 19
  },
  {
    name: 'Atlas',
    code: 'ATLAS',
    role: 'API Monitor',
    departmentCode: 'INTEL',
    avatar: '/avatars/atlas.png',
    color: '#0369A1',
    description: 'Tracks off-plan projects, feasibility analysis, and zoning information.',
    capabilities: ['Project Tracking', 'Feasibility Analysis', 'Developer Monitoring', 'Zoning Info'],
    features: [
      { id: 'projects', name: 'Projects', icon: 'Building2', route: '/intel/projects' },
      { id: 'feasibility', name: 'Feasibility', icon: 'Calculator', route: '/intel/feasibility' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 95, lastCheck: new Date() },
    metrics: { tasksCompleted: 2340, avgResponseTime: 2.8, successRate: 94.7, activeConnections: 3 },
    order: 20
  },
  {
    name: 'Evangeline',
    code: 'EVANGELINE',
    role: 'Legal Risk',
    departmentCode: 'LEGAL',
    avatar: '/avatars/evangeline.png',
    color: '#DC2626',
    description: 'Analyzes legal risks, reviews contracts, and ensures regulatory compliance.',
    capabilities: ['Risk Analysis', 'Contract Review', 'Regulatory Compliance', 'Best Practices'],
    features: [
      { id: 'risks', name: 'Risk Analysis', icon: 'AlertTriangle', route: '/legal/risks' },
      { id: 'contracts', name: 'Contracts', icon: 'FileText', route: '/legal/contracts' },
      { id: 'regulations', name: 'Regulations', icon: 'Scale', route: '/legal/regulations' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 99, lastCheck: new Date() },
    metrics: { tasksCompleted: 1560, avgResponseTime: 2.1, successRate: 98.9, activeConnections: 2 },
    order: 21
  },
  {
    name: 'Vesta',
    code: 'VESTA',
    role: 'Project Handover',
    departmentCode: 'OPS',
    avatar: '/avatars/vesta.png',
    color: '#F97316',
    description: 'Manages project milestones, snagging, handovers, and defect tracking.',
    capabilities: ['Milestone Tracking', 'Snagging', 'Handover Management', 'Defect Tracking'],
    features: [
      { id: 'milestones', name: 'Milestones', icon: 'Flag', route: '/ops/milestones' },
      { id: 'snagging', name: 'Snagging', icon: 'ClipboardList', route: '/ops/snagging' },
      { id: 'handover', name: 'Handover', icon: 'Key', route: '/ops/handover' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 96, lastCheck: new Date() },
    metrics: { tasksCompleted: 1120, avgResponseTime: 1.9, successRate: 95.6, activeConnections: 4 },
    order: 22
  },
  {
    name: 'Juno',
    code: 'JUNO',
    role: 'Community Mgmt',
    departmentCode: 'OPS',
    avatar: '/avatars/juno.png',
    color: '#16A34A',
    description: 'Manages facilities, IoT integrations, community events, and energy optimization.',
    capabilities: ['Facility Management', 'IoT Integration', 'Event Management', 'Energy Optimization'],
    features: [
      { id: 'facilities', name: 'Facilities', icon: 'Building', route: '/ops/facilities' },
      { id: 'iot', name: 'IoT', icon: 'Wifi', route: '/ops/iot' },
      { id: 'events', name: 'Events', icon: 'Calendar', route: '/ops/events' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 94, lastCheck: new Date() },
    metrics: { tasksCompleted: 890, avgResponseTime: 2.4, successRate: 93.8, activeConnections: 3 },
    order: 23
  },
  {
    name: 'Nancy',
    code: 'NANCY',
    role: 'HR & Performance',
    departmentCode: 'OPS',
    avatar: '/avatars/nancy.png',
    color: '#E11D48',
    description: 'Manages employees, recruitment, attendance, and performance reviews.',
    capabilities: ['Employee Management', 'Recruitment', 'Attendance Tracking', 'Performance Reviews'],
    features: [
      { id: 'employees', name: 'Employees', icon: 'Users', route: '/hr/employees' },
      { id: 'recruitment', name: 'Recruitment', icon: 'UserPlus', route: '/hr/recruitment' },
      { id: 'attendance', name: 'Attendance', icon: 'Clock', route: '/hr/attendance' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 98, lastCheck: new Date() },
    metrics: { tasksCompleted: 2450, avgResponseTime: 1.3, successRate: 97.4, activeConnections: 5 },
    order: 24
  },
  {
    name: 'Penny',
    code: 'PENNY',
    role: 'Commission Tracker',
    departmentCode: 'FIN',
    avatar: '/avatars/penny.png',
    color: '#CA8A04',
    description: 'Calculates commissions, manages payout schedules, and tracks agent earnings.',
    capabilities: ['Commission Calculation', 'Payout Scheduling', 'Agent Earnings', 'Performance Bonuses'],
    features: [
      { id: 'commissions', name: 'Commissions', icon: 'DollarSign', route: '/finance/commissions' },
      { id: 'payouts', name: 'Payouts', icon: 'Send', route: '/finance/payouts' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 97, lastCheck: new Date() },
    metrics: { tasksCompleted: 1890, avgResponseTime: 0.9, successRate: 98.2, activeConnections: 3 },
    order: 25
  },
  {
    name: 'Quinn',
    code: 'QUINN',
    role: 'Payment Processor',
    departmentCode: 'FIN',
    avatar: '/avatars/quinn.png',
    color: '#4F46E5',
    description: 'Manages payment gateway, transaction tracking, and refund processing.',
    capabilities: ['Payment Gateway', 'Transaction Tracking', 'Refund Processing', 'Payment Reconciliation'],
    features: [
      { id: 'gateway', name: 'Payment Gateway', icon: 'CreditCard', route: '/finance/gateway' },
      { id: 'transactions', name: 'Transactions', icon: 'ArrowLeftRight', route: '/finance/transactions' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 100, lastCheck: new Date() },
    metrics: { tasksCompleted: 4560, avgResponseTime: 0.4, successRate: 99.8, activeConnections: 6 },
    order: 26
  },
  {
    name: 'Marcus',
    code: 'MARCUS',
    role: 'Campaign Manager',
    departmentCode: 'MKT',
    avatar: '/avatars/marcus.png',
    color: '#BE185D',
    description: 'Creates and manages marketing campaigns, A/B testing, and performance tracking.',
    capabilities: ['Campaign Creation', 'A/B Testing', 'Performance Tracking', 'Budget Management'],
    features: [
      { id: 'campaigns', name: 'Campaigns', icon: 'Target', route: '/marketing/campaign-manager' },
      { id: 'ab-testing', name: 'A/B Testing', icon: 'Split', route: '/marketing/ab-testing' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 95, lastCheck: new Date() },
    metrics: { tasksCompleted: 1230, avgResponseTime: 2.1, successRate: 94.5, activeConnections: 4 },
    order: 27
  },
  {
    name: 'Stella',
    code: 'STELLA',
    role: 'Content Creator',
    departmentCode: 'MKT',
    avatar: '/avatars/stella.png',
    color: '#DB2777',
    description: 'Manages content calendar, asset management, and copywriting.',
    capabilities: ['Content Calendar', 'Asset Management', 'Copywriting', 'Brand Voice'],
    features: [
      { id: 'calendar', name: 'Content Calendar', icon: 'Calendar', route: '/marketing/calendar' },
      { id: 'assets', name: 'Assets', icon: 'Image', route: '/marketing/assets' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 96, lastCheck: new Date() },
    metrics: { tasksCompleted: 2340, avgResponseTime: 1.7, successRate: 95.8, activeConnections: 3 },
    order: 28
  },
  {
    name: 'Vera',
    code: 'VERA',
    role: 'KYC Specialist',
    departmentCode: 'COMP',
    avatar: '/avatars/vera.png',
    color: '#7C3AED',
    description: 'Specializes in identity verification, document validation, and risk scoring.',
    capabilities: ['Identity Verification', 'Document Validation', 'Risk Scoring', 'Fraud Detection'],
    features: [
      { id: 'verification', name: 'Verification', icon: 'UserCheck', route: '/compliance/verification' },
      { id: 'documents', name: 'Documents', icon: 'FileCheck', route: '/compliance/documents' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 99, lastCheck: new Date() },
    metrics: { tasksCompleted: 3450, avgResponseTime: 0.8, successRate: 99.1, activeConnections: 5 },
    order: 29
  },
  {
    name: 'Ivy',
    code: 'IVY',
    role: 'Ejari Specialist',
    departmentCode: 'LEGAL',
    avatar: '/avatars/ivy.png',
    color: '#059669',
    description: 'Handles Ejari registration, contract compliance, and renewal processing.',
    capabilities: ['Ejari Registration', 'Contract Compliance', 'Renewal Processing', 'DLD Coordination'],
    features: [
      { id: 'ejari', name: 'Ejari', icon: 'FileText', route: '/legal/ejari' },
      { id: 'renewals', name: 'Renewals', icon: 'RefreshCw', route: '/legal/renewals' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 98, lastCheck: new Date() },
    metrics: { tasksCompleted: 2890, avgResponseTime: 1.1, successRate: 97.6, activeConnections: 4 },
    order: 30
  },
  {
    name: 'Max',
    code: 'MAX',
    role: 'Document Processor',
    departmentCode: 'LEGAL',
    avatar: '/avatars/max.png',
    color: '#78716C',
    description: 'Generates documents, processes OCR, and manages document archival.',
    capabilities: ['Document Generation', 'OCR Processing', 'Archival', 'Template Management'],
    features: [
      { id: 'generate', name: 'Generate', icon: 'FilePlus', route: '/legal/generate' },
      { id: 'ocr', name: 'OCR', icon: 'Scan', route: '/legal/ocr' },
      { id: 'archive', name: 'Archive', icon: 'Archive', route: '/legal/archive' }
    ],
    accessLevel: 'standard',
    status: 'online',
    health: { score: 94, lastCheck: new Date() },
    metrics: { tasksCompleted: 4120, avgResponseTime: 1.5, successRate: 93.8, activeConnections: 6 },
    order: 31
  },
  {
    name: 'Sage',
    code: 'SAGE',
    role: 'Market Analyst',
    departmentCode: 'INTEL',
    avatar: '/avatars/sage.png',
    color: '#65A30D',
    description: 'Analyzes market trends, generates pricing predictions, and tracks competitors.',
    capabilities: ['Market Trends', 'Pricing Predictions', 'Competitor Tracking', 'Investment Analysis'],
    features: [
      { id: 'analysis', name: 'Market Analysis', icon: 'BarChart2', route: '/intel/analysis' },
      { id: 'pricing', name: 'Pricing', icon: 'DollarSign', route: '/intel/pricing' }
    ],
    accessLevel: 'elevated',
    status: 'online',
    health: { score: 97, lastCheck: new Date() },
    metrics: { tasksCompleted: 1670, avgResponseTime: 2.5, successRate: 96.3, activeConnections: 3 },
    order: 32
  }
];

export const TEAMS_SEED = [
  {
    name: 'Executive Office',
    code: 'EXEC-OFFICE',
    departmentCode: 'EXEC',
    description: 'C-suite leadership team driving company strategy',
    lead: { name: 'Arslan Malik', email: 'arslan@whitecaves.ae', title: 'CEO' },
    responsibilities: ['Strategic Planning', 'Corporate Governance', 'Investor Relations'],
    size: { current: 4, capacity: 5 },
    kpis: [{ name: 'Strategic Initiatives', target: 12, current: 8, unit: 'quarterly' }]
  },
  {
    name: 'Property Operations',
    code: 'PROP-OPS',
    departmentCode: 'OPS',
    description: 'Day-to-day property management and maintenance',
    lead: { name: 'Omar Siddiqui', email: 'omar@whitecaves.ae', title: 'Director' },
    responsibilities: ['Property Maintenance', 'Vendor Management', 'Facility Operations'],
    size: { current: 12, capacity: 15 },
    kpis: [{ name: 'Maintenance Resolution', target: 48, current: 52, unit: 'hours' }]
  },
  {
    name: 'Inventory Team',
    code: 'INV-TEAM',
    departmentCode: 'OPS',
    description: 'Property inventory and listing management',
    lead: { name: 'Fatima Al Hashimi', email: 'fatima.h@whitecaves.ae', title: 'Manager' },
    responsibilities: ['Listing Management', 'Data Quality', 'Portal Publishing'],
    size: { current: 6, capacity: 8 },
    kpis: [{ name: 'Listings Updated', target: 500, current: 478, unit: 'weekly' }]
  },
  {
    name: 'Sales Team A',
    code: 'SALES-A',
    departmentCode: 'SALES',
    description: 'Primary sales off-plan and luxury properties',
    lead: { name: 'Mohammed Al Ameri', email: 'mohammed.a@whitecaves.ae', title: 'Team Lead' },
    responsibilities: ['Off-Plan Sales', 'Luxury Properties', 'VIP Clients'],
    size: { current: 12, capacity: 15 },
    kpis: [{ name: 'Monthly Sales', target: 25000000, current: 21500000, unit: 'AED' }]
  },
  {
    name: 'Sales Team B',
    code: 'SALES-B',
    departmentCode: 'SALES',
    description: 'Secondary market and investment properties',
    lead: { name: 'Sara Al Mazrouei', email: 'sara.m@whitecaves.ae', title: 'Team Lead' },
    responsibilities: ['Secondary Sales', 'Investment Properties', 'Client Matching'],
    size: { current: 10, capacity: 12 },
    kpis: [{ name: 'Monthly Sales', target: 20000000, current: 18200000, unit: 'AED' }]
  },
  {
    name: 'Leasing Team',
    code: 'LEASE-TEAM',
    departmentCode: 'SALES',
    description: 'Residential and commercial leasing operations',
    lead: { name: 'Khalid Al Shamsi', email: 'khalid.s@whitecaves.ae', title: 'Team Lead' },
    responsibilities: ['Tenant Acquisition', 'Lease Processing', 'Renewals'],
    size: { current: 8, capacity: 10 },
    kpis: [{ name: 'Leases Signed', target: 50, current: 42, unit: 'monthly' }]
  },
  {
    name: 'Finance Operations',
    code: 'FIN-OPS',
    departmentCode: 'FIN',
    description: 'Financial processing and accounting',
    lead: { name: 'Hana Al Zaabi', email: 'hana@whitecaves.ae', title: 'Director' },
    responsibilities: ['Accounts Receivable', 'Payroll', 'Financial Reporting'],
    size: { current: 6, capacity: 8 },
    kpis: [{ name: 'Collection Rate', target: 98, current: 94, unit: 'percent' }]
  },
  {
    name: 'Digital Marketing',
    code: 'DIGITAL-MKT',
    departmentCode: 'MKT',
    description: 'Online marketing and lead generation',
    lead: { name: 'Layla Al Suwaidi', email: 'layla@whitecaves.ae', title: 'Director' },
    responsibilities: ['SEO/SEM', 'Social Media', 'Content Marketing'],
    size: { current: 8, capacity: 10 },
    kpis: [{ name: 'Leads Generated', target: 450, current: 385, unit: 'monthly' }]
  },
  {
    name: 'Customer Support',
    code: 'CUST-SUPPORT',
    departmentCode: 'COMM',
    description: 'Client communications and support',
    lead: { name: 'Khalid Al Mansoori', email: 'khalid@whitecaves.ae', title: 'Director' },
    responsibilities: ['Client Support', 'WhatsApp Operations', 'Query Resolution'],
    size: { current: 15, capacity: 20 },
    kpis: [{ name: 'Response Time', target: 2, current: 2.3, unit: 'minutes' }]
  },
  {
    name: 'Compliance Team',
    code: 'COMP-TEAM',
    departmentCode: 'COMP',
    description: 'Regulatory compliance and KYC verification',
    lead: { name: 'Nadia Ibrahim', email: 'nadia@whitecaves.ae', title: 'Director' },
    responsibilities: ['KYC Processing', 'AML Monitoring', 'RERA Compliance'],
    size: { current: 4, capacity: 5 },
    kpis: [{ name: 'Compliance Score', target: 100, current: 98, unit: 'percent' }]
  },
  {
    name: 'Development Team',
    code: 'DEV-TEAM',
    departmentCode: 'TECH',
    description: 'Platform development and maintenance',
    lead: { name: 'Tariq Al Qasimi', email: 'tariq@whitecaves.ae', title: 'Director' },
    responsibilities: ['Platform Development', 'AI Systems', 'Infrastructure'],
    size: { current: 10, capacity: 12 },
    kpis: [{ name: 'Sprint Velocity', target: 50, current: 48, unit: 'points' }]
  },
  {
    name: 'Research Team',
    code: 'RESEARCH',
    departmentCode: 'INTEL',
    description: 'Market research and competitive analysis',
    lead: { name: 'Yusuf Al Ghurair', email: 'yusuf@whitecaves.ae', title: 'Director' },
    responsibilities: ['Market Research', 'Competitor Analysis', 'Price Tracking'],
    size: { current: 4, capacity: 6 },
    kpis: [{ name: 'Reports Published', target: 8, current: 6, unit: 'monthly' }]
  },
  {
    name: 'Legal Team',
    code: 'LEGAL-TEAM',
    departmentCode: 'LEGAL',
    description: 'Contract management and legal operations',
    lead: { name: 'Aisha Al Ketbi', email: 'aisha@whitecaves.ae', title: 'Director' },
    responsibilities: ['Contract Review', 'Dispute Resolution', 'Ejari Processing'],
    size: { current: 4, capacity: 5 },
    kpis: [{ name: 'Contracts Processed', target: 200, current: 156, unit: 'monthly' }]
  }
];

export const SERVICES_SEED = [
  {
    name: 'Off-Plan Purchase',
    code: 'OFF-PLAN-PURCHASE',
    category: 'Property Sales',
    description: 'Purchase new development properties directly from developers with flexible payment plans',
    shortDescription: 'New development properties with payment plans',
    icon: 'Building2',
    departmentCode: 'SALES',
    assistantCode: 'SOPHIA',
    workflow: {
      stages: [
        { order: 1, name: 'Research', description: 'Market analysis and project comparison', duration: '3-5 days', actions: ['Market analysis', 'Developer review', 'Project comparison'] },
        { order: 2, name: 'Selection', description: 'Unit selection and negotiation', duration: '5-7 days', actions: ['Unit selection', 'Floor plan review', 'Price negotiation'] },
        { order: 3, name: 'Booking', description: 'Reservation and documentation', duration: '1-2 days', actions: ['Reservation form', 'Initial deposit', 'Document collection'] },
        { order: 4, name: 'Payment Plan', description: 'Payment schedule setup', duration: '1-3 days', actions: ['Plan selection', 'Payment schedule', 'Contract signing'] },
        { order: 5, name: 'Handover', description: 'Final handover at completion', duration: 'At completion', actions: ['Inspection', 'Snagging', 'Key collection'] }
      ],
      estimatedDuration: '30-60 days',
      sla: '48 hours response'
    },
    pricing: { type: 'percentage', percentage: 2, details: 'Commission on sale value' },
    targetAudience: ['buyers', 'investors'],
    metrics: { totalRequests: 245, completedRequests: 198, avgCompletionTime: 45, satisfactionScore: 94, revenue: 12500000 },
    order: 1
  },
  {
    name: 'Secondary Market Sale',
    code: 'SECONDARY-SALE',
    category: 'Property Sales',
    description: 'Buy or sell existing properties in the secondary market with full transaction support',
    shortDescription: 'Buy/sell existing properties',
    icon: 'Home',
    departmentCode: 'SALES',
    assistantCode: 'SOPHIA',
    workflow: {
      stages: [
        { order: 1, name: 'Valuation', description: 'Professional property valuation', duration: '2-3 days', actions: ['Property inspection', 'Market comparison', 'Price recommendation'] },
        { order: 2, name: 'Listing', description: 'Property listing and marketing', duration: '1-2 days', actions: ['Photo shoot', 'Description writing', 'Portal upload'] },
        { order: 3, name: 'Marketing', description: 'Active marketing campaign', duration: 'Ongoing', actions: ['Portal featuring', 'Social media', 'Email campaigns'] },
        { order: 4, name: 'Negotiation', description: 'Offer and counter-offer management', duration: '3-7 days', actions: ['Offer presentation', 'Counter offers', 'Terms agreement'] },
        { order: 5, name: 'Closing', description: 'Transaction completion', duration: '7-14 days', actions: ['Contract signing', 'DLD transfer', 'Payment processing'] }
      ],
      estimatedDuration: '45-90 days',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 2, details: 'Commission on sale value' },
    targetAudience: ['buyers', 'sellers'],
    metrics: { totalRequests: 320, completedRequests: 256, avgCompletionTime: 67, satisfactionScore: 92, revenue: 18200000 },
    order: 2
  },
  {
    name: 'Luxury Property Sales',
    code: 'LUXURY-SALES',
    category: 'Property Sales',
    description: 'White-glove service for ultra-luxury properties above AED 10M with VIP treatment',
    shortDescription: 'Ultra-luxury property sales',
    icon: 'Crown',
    departmentCode: 'SALES',
    assistantCode: 'KAIROS',
    workflow: {
      stages: [
        { order: 1, name: 'VIP Introduction', description: 'Personal consultation and portfolio presentation', duration: '1-3 days', actions: ['Personal consultation', 'Lifestyle assessment', 'Portfolio presentation'] },
        { order: 2, name: 'Private Viewing', description: 'Exclusive property access', duration: 'By appointment', actions: ['Exclusive access', 'Champagne tour', 'Privacy guaranteed'] },
        { order: 3, name: 'Custom Terms', description: 'Bespoke negotiation', duration: '7-14 days', actions: ['Bespoke negotiation', 'Special conditions', 'Legal customization'] },
        { order: 4, name: 'White Glove Closing', description: 'Concierge closing service', duration: '14-30 days', actions: ['Concierge service', 'Full coordination', 'VIP handover'] }
      ],
      estimatedDuration: '90-180 days',
      sla: '4 hours response'
    },
    pricing: { type: 'percentage', percentage: 2.5, details: 'Premium commission on luxury sales' },
    targetAudience: ['buyers', 'investors'],
    metrics: { totalRequests: 48, completedRequests: 32, avgCompletionTime: 120, satisfactionScore: 98, revenue: 8500000 },
    order: 3
  },
  {
    name: 'Residential Rental',
    code: 'RESIDENTIAL-RENTAL',
    category: 'Property Rentals',
    description: 'End-to-end residential leasing with Ejari registration and tenant screening',
    shortDescription: 'Full-service residential leasing',
    icon: 'Key',
    departmentCode: 'OPS',
    assistantCode: 'DAISY',
    workflow: {
      stages: [
        { order: 1, name: 'Inquiry', description: 'Requirements gathering', duration: 'Same day', actions: ['Requirements gathering', 'Budget confirmation', 'Availability check'] },
        { order: 2, name: 'Viewing', description: 'Property tours', duration: '1-3 days', actions: ['Schedule viewing', 'Property tour', 'Q&A session'] },
        { order: 3, name: 'Application', description: 'Tenant application', duration: '1 day', actions: ['Application form', 'Document submission', 'Initial checks'] },
        { order: 4, name: 'Contract', description: 'Lease agreement', duration: '1-2 days', actions: ['Contract drafting', 'Terms review', 'Signing'] },
        { order: 5, name: 'Ejari', description: 'DLD registration', duration: '1-2 days', actions: ['DLD submission', 'Registration', 'Certificate issuance'] },
        { order: 6, name: 'Handover', description: 'Key handover', duration: '1 day', actions: ['Inventory check', 'Key handover', 'Welcome pack'] }
      ],
      estimatedDuration: '7-14 days',
      sla: '4 hours response'
    },
    pricing: { type: 'percentage', percentage: 5, details: '5% of annual rent' },
    targetAudience: ['tenants', 'landlords'],
    metrics: { totalRequests: 856, completedRequests: 742, avgCompletionTime: 10, satisfactionScore: 91, revenue: 3200000 },
    order: 4
  },
  {
    name: 'Commercial Leasing',
    code: 'COMMERCIAL-LEASE',
    category: 'Property Rentals',
    description: 'Office, retail, and warehouse leasing for businesses with fitout coordination',
    shortDescription: 'Business property leasing',
    icon: 'Building',
    departmentCode: 'OPS',
    assistantCode: 'DAISY',
    workflow: {
      stages: [
        { order: 1, name: 'Requirements', description: 'Space needs assessment', duration: '1-2 days', actions: ['Space needs', 'Location preferences', 'Budget range'] },
        { order: 2, name: 'Site Visit', description: 'Property tours', duration: '3-7 days', actions: ['Property tours', 'Space assessment', 'Infrastructure check'] },
        { order: 3, name: 'Negotiation', description: 'Terms negotiation', duration: '1-2 weeks', actions: ['Rent negotiation', 'Term discussion', 'Incentives'] },
        { order: 4, name: 'Fit-out', description: 'Space customization', duration: '2-8 weeks', actions: ['Design approval', 'Construction', 'Handover preparation'] },
        { order: 5, name: 'Lease Signing', description: 'Contract execution', duration: '3-5 days', actions: ['Contract finalization', 'Legal review', 'Execution'] }
      ],
      estimatedDuration: '30-60 days',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 5, details: '5% of annual rent' },
    targetAudience: ['tenants'],
    metrics: { totalRequests: 124, completedRequests: 89, avgCompletionTime: 45, satisfactionScore: 93, revenue: 1850000 },
    order: 5
  },
  {
    name: 'Property Management',
    code: 'PROPERTY-MGMT',
    category: 'Property Management',
    description: 'Full property management including tenant relations, maintenance, and rent collection',
    shortDescription: 'Complete property management',
    icon: 'Settings',
    departmentCode: 'OPS',
    assistantCode: 'SENTINEL',
    workflow: {
      stages: [
        { order: 1, name: 'Onboarding', description: 'Property assessment and setup', duration: '3-5 days', actions: ['Property inspection', 'Documentation', 'System setup'] },
        { order: 2, name: 'Ongoing Management', description: 'Day-to-day operations', duration: 'Monthly', actions: ['Rent collection', 'Maintenance coordination', 'Tenant relations'] }
      ],
      estimatedDuration: 'Ongoing',
      sla: '4 hours for urgent issues'
    },
    pricing: { type: 'percentage', percentage: 8, details: '8% of monthly rent' },
    targetAudience: ['landlords', 'investors'],
    metrics: { totalRequests: 456, completedRequests: 423, avgCompletionTime: 5, satisfactionScore: 89, revenue: 2100000 },
    order: 6
  },
  {
    name: 'Maintenance Request',
    code: 'MAINTENANCE',
    category: 'Property Management',
    description: 'Property maintenance and repair coordination with verified vendors',
    shortDescription: 'Maintenance and repairs',
    icon: 'Wrench',
    departmentCode: 'OPS',
    assistantCode: 'SENTINEL',
    workflow: {
      stages: [
        { order: 1, name: 'Report', description: 'Issue reporting', duration: 'Immediate', actions: ['Issue description', 'Photo upload', 'Priority setting'] },
        { order: 2, name: 'Assessment', description: 'Problem diagnosis', duration: '24 hours', actions: ['Technician visit', 'Problem diagnosis', 'Scope definition'] },
        { order: 3, name: 'Quote', description: 'Cost estimation', duration: '1-2 days', actions: ['Cost estimate', 'Parts list', 'Timeline'] },
        { order: 4, name: 'Work', description: 'Repair execution', duration: '1-5 days', actions: ['Schedule work', 'Execute repair', 'Quality check'] },
        { order: 5, name: 'Verify', description: 'Completion verification', duration: '1 day', actions: ['Tenant inspection', 'Sign-off', 'Case closure'] }
      ],
      estimatedDuration: '1-7 days',
      sla: '4 hours for emergencies'
    },
    pricing: { type: 'custom', details: 'Cost plus 15% management fee' },
    targetAudience: ['tenants', 'landlords'],
    metrics: { totalRequests: 1245, completedRequests: 1189, avgCompletionTime: 3, satisfactionScore: 87, revenue: 890000 },
    order: 7
  },
  {
    name: 'KYC Verification',
    code: 'KYC',
    category: 'Legal & Compliance',
    description: 'Know Your Customer identity verification and risk assessment',
    shortDescription: 'Identity verification',
    icon: 'UserCheck',
    departmentCode: 'COMP',
    assistantCode: 'LAILA',
    workflow: {
      stages: [
        { order: 1, name: 'Document Upload', description: 'Identity documents', duration: '5-10 min', actions: ['Passport upload', 'Visa upload', 'Emirates ID'] },
        { order: 2, name: 'Verification', description: 'Document validation', duration: '1-2 hours', actions: ['Document validation', 'Cross-reference', 'Authenticity check'] },
        { order: 3, name: 'Risk Score', description: 'Risk assessment', duration: '30 min', actions: ['Risk calculation', 'PEP check', 'Sanctions screening'] },
        { order: 4, name: 'Approval', description: 'Final decision', duration: '30 min', actions: ['Decision making', 'Notification', 'Documentation'] }
      ],
      estimatedDuration: '2-4 hours',
      sla: '4 hours'
    },
    pricing: { type: 'fixed', amount: 150, currency: 'AED' },
    targetAudience: ['all'],
    metrics: { totalRequests: 2340, completedRequests: 2298, avgCompletionTime: 2.5, satisfactionScore: 96, revenue: 345000 },
    order: 8
  },
  {
    name: 'Ejari Registration',
    code: 'EJARI',
    category: 'Legal & Compliance',
    description: 'Official tenancy contract registration with Dubai Land Department',
    shortDescription: 'DLD tenancy registration',
    icon: 'FileCheck',
    departmentCode: 'LEGAL',
    assistantCode: 'IVY',
    workflow: {
      stages: [
        { order: 1, name: 'Document Collection', description: 'Required documents', duration: '1-2 hours', actions: ['Passport copies', 'Visa pages', 'Title deed', 'Contract'] },
        { order: 2, name: 'DLD Portal', description: 'Online submission', duration: '30 min', actions: ['Data entry', 'Document upload', 'Fee payment'] },
        { order: 3, name: 'Certificate', description: 'Registration complete', duration: '24-48 hours', actions: ['Certificate issuance', 'PDF download', 'Tenant notification'] }
      ],
      estimatedDuration: '1-2 days',
      sla: '24 hours'
    },
    pricing: { type: 'fixed', amount: 220, currency: 'AED' },
    targetAudience: ['tenants', 'landlords'],
    metrics: { totalRequests: 1890, completedRequests: 1845, avgCompletionTime: 1.5, satisfactionScore: 94, revenue: 405900 },
    order: 9
  },
  {
    name: 'Invoice Processing',
    code: 'INVOICING',
    category: 'Financial Services',
    description: 'Automated invoice generation, tracking, and collection',
    shortDescription: 'Invoice management',
    icon: 'Receipt',
    departmentCode: 'FIN',
    assistantCode: 'THEODORA',
    workflow: {
      stages: [
        { order: 1, name: 'Generate', description: 'Invoice creation', duration: 'Instant', actions: ['Invoice creation', 'Line items', 'Tax calculation'] },
        { order: 2, name: 'Send', description: 'Delivery', duration: 'Instant', actions: ['Email dispatch', 'SMS notification', 'Portal update'] },
        { order: 3, name: 'Track', description: 'Payment tracking', duration: 'Ongoing', actions: ['View tracking', 'Reminder scheduling', 'Escalation rules'] },
        { order: 4, name: 'Collect', description: 'Payment receipt', duration: 'Due date', actions: ['Payment receipt', 'Multi-channel', 'Reconciliation'] }
      ],
      estimatedDuration: 'Real-time',
      sla: 'Instant'
    },
    pricing: { type: 'free', details: 'Included in service' },
    targetAudience: ['all'],
    metrics: { totalRequests: 8920, completedRequests: 8756, avgCompletionTime: 0.1, satisfactionScore: 95, revenue: 0 },
    order: 10
  },
  {
    name: 'Lead Generation',
    code: 'LEAD-GEN',
    category: 'Marketing',
    description: 'Multi-channel lead acquisition, scoring, and routing',
    shortDescription: 'Lead acquisition',
    icon: 'Target',
    departmentCode: 'MKT',
    assistantCode: 'OLIVIA',
    workflow: {
      stages: [
        { order: 1, name: 'Campaign', description: 'Ad management', duration: 'Ongoing', actions: ['Ad creation', 'Targeting', 'Budget management'] },
        { order: 2, name: 'Capture', description: 'Lead capture', duration: 'Real-time', actions: ['Form submission', 'Call tracking', 'Chat leads'] },
        { order: 3, name: 'Score', description: 'AI scoring', duration: 'Instant', actions: ['AI scoring', 'Intent analysis', 'Priority assignment'] },
        { order: 4, name: 'Route', description: 'Agent assignment', duration: 'Instant', actions: ['Agent matching', 'Availability check', 'Assignment'] }
      ],
      estimatedDuration: 'Continuous',
      sla: '5 minutes to first contact'
    },
    pricing: { type: 'custom', details: 'Based on marketing budget' },
    targetAudience: ['all'],
    metrics: { totalRequests: 4500, completedRequests: 3825, avgCompletionTime: 0.5, satisfactionScore: 88, revenue: 1200000 },
    order: 11
  },
  {
    name: 'Property Marketing',
    code: 'PROP-MARKETING',
    category: 'Marketing',
    description: 'Professional photography, listing creation, and multi-portal publishing',
    shortDescription: 'Property marketing',
    icon: 'Camera',
    departmentCode: 'MKT',
    assistantCode: 'OLIVIA',
    workflow: {
      stages: [
        { order: 1, name: 'Photography', description: 'Photo shoot', duration: '2-4 hours', actions: ['Photo shoot', 'Video tour', 'Drone footage'] },
        { order: 2, name: 'Listing', description: 'Content creation', duration: '1-2 days', actions: ['Description writing', 'Feature highlighting', 'SEO optimization'] },
        { order: 3, name: 'Multi-Platform', description: 'Portal publishing', duration: '1 day', actions: ['Bayut', 'Property Finder', 'Dubizzle', 'Website'] },
        { order: 4, name: 'Analytics', description: 'Performance tracking', duration: 'Ongoing', actions: ['View tracking', 'Lead monitoring', 'Performance reports'] }
      ],
      estimatedDuration: '3-5 days',
      sla: '48 hours'
    },
    pricing: { type: 'fixed', amount: 1500, currency: 'AED' },
    targetAudience: ['sellers', 'landlords'],
    metrics: { totalRequests: 785, completedRequests: 742, avgCompletionTime: 4, satisfactionScore: 92, revenue: 1113000 },
    order: 12
  }
];
