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
  // CATEGORY 1: LUXURY PROPERTY TRANSACTIONS (LPT-001 to LPT-005)
  {
    name: 'Ultra-Prime Property Acquisition',
    code: 'LPT-001',
    category: 'Luxury Property Transactions',
    tier: 'ultra',
    description: 'End-to-end acquisition of properties AED 50M+ with discretion, portfolio integration, and tax structuring',
    shortDescription: 'Ultra-luxury acquisition AED 50M+',
    icon: 'Crown',
    departmentCode: 'SALES',
    assistantCode: 'KAIROS',
    workflow: {
      stages: [
        { order: 1, name: 'Confidential Briefing', description: 'Private consultation and NDA', duration: '1-2 days', actions: ['Executive consultation', 'NDA signing', 'Requirements assessment'] },
        { order: 2, name: 'Portfolio Curation', description: 'Exclusive property selection', duration: '7-14 days', actions: ['Off-market sourcing', 'Portfolio integration analysis', 'Investment modeling'] },
        { order: 3, name: 'Private Viewing', description: 'Exclusive property access', duration: 'By appointment', actions: ['Helicopter tours', 'Private showings', 'Lifestyle preview'] },
        { order: 4, name: 'Bespoke Negotiation', description: 'Custom deal structuring', duration: '14-30 days', actions: ['Price negotiation', 'Tax optimization', 'Legal structuring'] },
        { order: 5, name: 'White Glove Closing', description: 'Concierge transaction completion', duration: '30-60 days', actions: ['Full legal coordination', 'Fund transfer management', 'VIP handover'] }
      ],
      estimatedDuration: '90-180 days',
      sla: '2 hours response'
    },
    pricing: { type: 'percentage', percentage: 1.75, details: '1.5-2% of property value + advisory fee' },
    targetAudience: ['uhnwi', 'family_offices', 'sovereign_funds'],
    metrics: { totalRequests: 24, completedRequests: 18, avgCompletionTime: 135, satisfactionScore: 99, revenue: 42500000 },
    order: 1
  },
  {
    name: 'Prime Residential Sales',
    code: 'LPT-002',
    category: 'Luxury Property Transactions',
    tier: 'premium',
    description: 'Full-service sales of villas/apartments (AED 10-50M) with staging, marketing, and negotiation',
    shortDescription: 'Luxury residential AED 10-50M',
    icon: 'Home',
    departmentCode: 'SALES',
    assistantCode: 'SOPHIA',
    workflow: {
      stages: [
        { order: 1, name: 'VIP Onboarding', description: 'Exclusive client consultation', duration: '1-3 days', actions: ['Personal consultation', 'Lifestyle assessment', 'Portfolio review'] },
        { order: 2, name: 'Property Selection', description: 'Curated property shortlist', duration: '5-10 days', actions: ['Market analysis', 'Property shortlisting', 'Virtual previews'] },
        { order: 3, name: 'Private Viewings', description: 'Exclusive property tours', duration: '3-7 days', actions: ['Private showings', 'Neighborhood tours', 'Developer meetings'] },
        { order: 4, name: 'Negotiation', description: 'Expert price negotiation', duration: '7-14 days', actions: ['Offer presentation', 'Counter-negotiation', 'Terms finalization'] },
        { order: 5, name: 'Transaction', description: 'Full closing support', duration: '14-30 days', actions: ['Contract review', 'DLD transfer', 'Key handover'] }
      ],
      estimatedDuration: '60-120 days',
      sla: '4 hours response'
    },
    pricing: { type: 'percentage', percentage: 2, details: '2% of property value' },
    targetAudience: ['hnwi', 'executives', 'entrepreneurs'],
    metrics: { totalRequests: 156, completedRequests: 128, avgCompletionTime: 85, satisfactionScore: 96, revenue: 28500000 },
    order: 2
  },
  {
    name: 'Waterfront & Island Properties',
    code: 'LPT-003',
    category: 'Luxury Property Transactions',
    tier: 'ultra',
    description: 'Specialized expertise in Palm Jumeirah, Bluewaters, Dubai Creek Harbour properties',
    shortDescription: 'Waterfront specialist service',
    icon: 'Waves',
    departmentCode: 'SALES',
    assistantCode: 'KAIROS',
    workflow: {
      stages: [
        { order: 1, name: 'Waterfront Briefing', description: 'Specialized market overview', duration: '1-2 days', actions: ['Market overview', 'Community comparison', 'Investment potential'] },
        { order: 2, name: 'Yacht Tour', description: 'Property viewing by water', duration: '1 day', actions: ['Yacht property tour', 'Beach access review', 'Marina inspection'] },
        { order: 3, name: 'Developer Relations', description: 'Direct developer access', duration: '3-7 days', actions: ['Developer negotiations', 'Exclusive inventory', 'Payment flexibility'] },
        { order: 4, name: 'Premium Closing', description: 'Enhanced closing service', duration: '21-45 days', actions: ['Legal coordination', 'Transfer management', 'Lifestyle setup'] }
      ],
      estimatedDuration: '45-90 days',
      sla: '2 hours response'
    },
    pricing: { type: 'percentage', percentage: 2.25, details: '2% + premium service fee' },
    targetAudience: ['international_investors', 'celebrity_clients', 'uhnwi'],
    metrics: { totalRequests: 68, completedRequests: 52, avgCompletionTime: 72, satisfactionScore: 98, revenue: 35200000 },
    order: 3
  },
  {
    name: 'Off-Plan Luxury Projects',
    code: 'LPT-004',
    category: 'Luxury Property Transactions',
    tier: 'premium',
    description: 'Exclusive access to pre-launch developments with early investor pricing',
    shortDescription: 'Pre-launch investment access',
    icon: 'Building2',
    departmentCode: 'SALES',
    assistantCode: 'SOPHIA',
    workflow: {
      stages: [
        { order: 1, name: 'Project Pipeline', description: 'Upcoming project preview', duration: '2-5 days', actions: ['Developer briefings', 'Project comparison', 'ROI analysis'] },
        { order: 2, name: 'Early Access', description: 'Pre-launch registration', duration: '1-3 days', actions: ['Priority registration', 'Unit selection', 'Price lock'] },
        { order: 3, name: 'Payment Planning', description: 'Flexible payment structuring', duration: '2-5 days', actions: ['Payment plan options', 'Post-handover plans', 'Financing coordination'] },
        { order: 4, name: 'Booking', description: 'Reservation completion', duration: '1-2 days', actions: ['SPA signing', 'Initial payment', 'Registration'] },
        { order: 5, name: 'Progress Monitoring', description: 'Construction updates', duration: 'Ongoing', actions: ['Site visits', 'Progress reports', 'Milestone tracking'] }
      ],
      estimatedDuration: '14-30 days initial, then ongoing',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 2.5, details: '2-3% (developer paid)' },
    targetAudience: ['investors', 'portfolio_diversifiers', 'speculative_investors'],
    metrics: { totalRequests: 312, completedRequests: 245, avgCompletionTime: 28, satisfactionScore: 94, revenue: 18500000 },
    order: 4
  },
  {
    name: 'Bulk Portfolio Transactions',
    code: 'LPT-005',
    category: 'Luxury Property Transactions',
    tier: 'corporate',
    description: 'Acquisition/disposal of multiple properties (5+ units) with portfolio optimization',
    shortDescription: 'Multi-property portfolio deals',
    icon: 'Layers',
    departmentCode: 'SALES',
    assistantCode: 'KAIROS',
    workflow: {
      stages: [
        { order: 1, name: 'Portfolio Analysis', description: 'Comprehensive portfolio review', duration: '5-10 days', actions: ['Asset inventory', 'Valuation analysis', 'Optimization strategy'] },
        { order: 2, name: 'Deal Structuring', description: 'Bulk transaction design', duration: '7-14 days', actions: ['Volume discounts', 'Transaction bundling', 'Tax efficiency'] },
        { order: 3, name: 'Institutional Negotiation', description: 'Professional negotiations', duration: '14-30 days', actions: ['Seller negotiations', 'Due diligence coordination', 'Terms finalization'] },
        { order: 4, name: 'Bulk Transfer', description: 'Multi-property transfer', duration: '30-60 days', actions: ['Simultaneous transfers', 'Fund management', 'Portfolio handover'] }
      ],
      estimatedDuration: '60-120 days',
      sla: '4 hours response'
    },
    pricing: { type: 'percentage', percentage: 1.25, details: '1-1.5% (volume discount)' },
    targetAudience: ['institutional_investors', 'reits', 'funds'],
    metrics: { totalRequests: 18, completedRequests: 12, avgCompletionTime: 95, satisfactionScore: 97, revenue: 48200000 },
    order: 5
  },
  // CATEGORY 2: PREMIUM LEASING SERVICES (PLS-001 to PLS-005)
  {
    name: 'Short-Term Luxury Leasing',
    code: 'PLS-001',
    category: 'Premium Leasing Services',
    tier: 'premium',
    description: 'Premium properties (3-11 months) with full concierge services for executives and productions',
    shortDescription: 'Short-term luxury rentals',
    icon: 'Clock',
    departmentCode: 'OPS',
    assistantCode: 'DAISY',
    workflow: {
      stages: [
        { order: 1, name: 'Requirements', description: 'Short-term needs assessment', duration: '1 day', actions: ['Duration confirmation', 'Amenity requirements', 'Location preferences'] },
        { order: 2, name: 'Curated Selection', description: 'Property matching', duration: '2-3 days', actions: ['Inventory matching', 'Availability check', 'Virtual tours'] },
        { order: 3, name: 'Booking', description: 'Reservation and contract', duration: '1-2 days', actions: ['Rate confirmation', 'Contract signing', 'Deposit payment'] },
        { order: 4, name: 'Concierge Setup', description: 'Property preparation', duration: '1 day', actions: ['Deep cleaning', 'Welcome supplies', 'Concierge briefing'] }
      ],
      estimatedDuration: '5-7 days',
      sla: '4 hours response'
    },
    pricing: { type: 'percentage', percentage: 8, details: '8% of rent + setup fee' },
    targetAudience: ['executives', 'seasonal_residents', 'productions'],
    metrics: { totalRequests: 245, completedRequests: 218, avgCompletionTime: 5, satisfactionScore: 95, revenue: 4200000 },
    order: 6
  },
  {
    name: 'Long-Term Premium Rentals',
    code: 'PLS-002',
    category: 'Premium Leasing Services',
    tier: 'essential',
    description: '1-3 year leases with comprehensive property management and tenant support',
    shortDescription: 'Premium long-term leasing',
    icon: 'Key',
    departmentCode: 'OPS',
    assistantCode: 'DAISY',
    workflow: {
      stages: [
        { order: 1, name: 'Inquiry', description: 'Requirements gathering', duration: 'Same day', actions: ['Requirements', 'Budget', 'Timeline'] },
        { order: 2, name: 'Viewings', description: 'Property tours', duration: '3-7 days', actions: ['Scheduled tours', 'Neighborhood orientation', 'Q&A'] },
        { order: 3, name: 'Application', description: 'Tenant vetting', duration: '2-3 days', actions: ['Background check', 'References', 'Income verification'] },
        { order: 4, name: 'Lease Signing', description: 'Contract execution', duration: '1-2 days', actions: ['Lease drafting', 'Review', 'Signing'] },
        { order: 5, name: 'Ejari & Handover', description: 'Registration and move-in', duration: '2-3 days', actions: ['DLD registration', 'Inventory', 'Key handover'] }
      ],
      estimatedDuration: '10-20 days',
      sla: '4 hours response'
    },
    pricing: { type: 'percentage', percentage: 5, details: '5% of annual rent (landlord paid)' },
    targetAudience: ['expat_families', 'corporate_assignees'],
    metrics: { totalRequests: 856, completedRequests: 742, avgCompletionTime: 12, satisfactionScore: 92, revenue: 5800000 },
    order: 7
  },
  {
    name: 'Corporate Housing Solutions',
    code: 'PLS-003',
    category: 'Premium Leasing Services',
    tier: 'corporate',
    description: 'Tailored housing packages for corporate relocations (5+ employees)',
    shortDescription: 'Corporate relocation housing',
    icon: 'Building',
    departmentCode: 'OPS',
    assistantCode: 'DAISY',
    workflow: {
      stages: [
        { order: 1, name: 'Corporate Assessment', description: 'Company needs analysis', duration: '2-3 days', actions: ['Employee count', 'Budget allocation', 'Location requirements'] },
        { order: 2, name: 'Portfolio Proposal', description: 'Housing options', duration: '3-5 days', actions: ['Inventory matching', 'Rate negotiation', 'Bulk pricing'] },
        { order: 3, name: 'Master Agreement', description: 'Corporate contract', duration: '3-7 days', actions: ['Terms negotiation', 'Legal review', 'Contract signing'] },
        { order: 4, name: 'Implementation', description: 'Housing rollout', duration: 'Ongoing', actions: ['Individual placements', 'Move coordination', 'Ongoing support'] }
      ],
      estimatedDuration: '14-30 days setup',
      sla: '2 hours response'
    },
    pricing: { type: 'percentage', percentage: 6, details: '6% + corporate account fee' },
    targetAudience: ['multinationals', 'government_entities'],
    metrics: { totalRequests: 48, completedRequests: 42, avgCompletionTime: 25, satisfactionScore: 96, revenue: 3500000 },
    order: 8
  },
  {
    name: 'Vacation Home Management',
    code: 'PLS-004',
    category: 'Premium Leasing Services',
    tier: 'premium',
    description: 'Turnkey management of luxury vacation properties with rental optimization',
    shortDescription: 'Vacation rental management',
    icon: 'Sun',
    departmentCode: 'OPS',
    assistantCode: 'SENTINEL',
    workflow: {
      stages: [
        { order: 1, name: 'Property Assessment', description: 'Vacation potential evaluation', duration: '2-3 days', actions: ['Property inspection', 'Market analysis', 'Rate optimization'] },
        { order: 2, name: 'Platform Setup', description: 'Multi-platform listing', duration: '5-7 days', actions: ['Photography', 'Listing creation', 'Calendar sync'] },
        { order: 3, name: 'Ongoing Management', description: 'Full-service operation', duration: 'Continuous', actions: ['Guest communication', 'Check-in/out', 'Cleaning coordination'] }
      ],
      estimatedDuration: 'Ongoing service',
      sla: '1 hour for urgent issues'
    },
    pricing: { type: 'percentage', percentage: 25, details: '20-30% of rental income' },
    targetAudience: ['absentee_owners', 'international_investors'],
    metrics: { totalRequests: 124, completedRequests: 112, avgCompletionTime: 7, satisfactionScore: 91, revenue: 2800000 },
    order: 9
  },
  {
    name: 'Serviced Apartment Placement',
    code: 'PLS-005',
    category: 'Premium Leasing Services',
    tier: 'essential',
    description: 'Luxury serviced apartments with hotel amenities for short-term stays',
    shortDescription: 'Serviced apartment booking',
    icon: 'Hotel',
    departmentCode: 'OPS',
    assistantCode: 'DAISY',
    workflow: {
      stages: [
        { order: 1, name: 'Search', description: 'Availability check', duration: 'Same day', actions: ['Date confirmation', 'Location matching', 'Amenity requirements'] },
        { order: 2, name: 'Selection', description: 'Property comparison', duration: '1-2 days', actions: ['Options presentation', 'Virtual tours', 'Rate comparison'] },
        { order: 3, name: 'Booking', description: 'Reservation', duration: 'Same day', actions: ['Rate lock', 'Payment processing', 'Confirmation'] }
      ],
      estimatedDuration: '1-3 days',
      sla: '2 hours response'
    },
    pricing: { type: 'percentage', percentage: 10, details: '10% of stay value' },
    targetAudience: ['business_travelers', 'medical_tourism'],
    metrics: { totalRequests: 312, completedRequests: 298, avgCompletionTime: 1.5, satisfactionScore: 93, revenue: 1250000 },
    order: 10
  },

  // CATEGORY 3: PROPERTY & PORTFOLIO MANAGEMENT (PPM-001 to PPM-005)
  {
    name: 'Full-Service Property Management',
    code: 'PPM-001',
    category: 'Property & Portfolio Management',
    tier: 'essential',
    description: 'End-to-end management: tenant sourcing, rent collection, maintenance, compliance',
    shortDescription: 'Complete property management',
    icon: 'Settings',
    departmentCode: 'OPS',
    assistantCode: 'SENTINEL',
    workflow: {
      stages: [
        { order: 1, name: 'Onboarding', description: 'Property setup', duration: '3-5 days', actions: ['Property inspection', 'Documentation', 'System setup'] },
        { order: 2, name: 'Tenant Management', description: 'Ongoing tenant relations', duration: 'Continuous', actions: ['Communication', 'Issue resolution', 'Lease renewals'] },
        { order: 3, name: 'Financial Management', description: 'Rent and expenses', duration: 'Monthly', actions: ['Rent collection', 'Expense tracking', 'Owner reporting'] },
        { order: 4, name: 'Maintenance', description: 'Property upkeep', duration: 'As needed', actions: ['Issue logging', 'Vendor coordination', 'Quality control'] }
      ],
      estimatedDuration: 'Ongoing service',
      sla: '4 hours for urgent issues'
    },
    pricing: { type: 'percentage', percentage: 6, details: '4-8% of monthly rent' },
    targetAudience: ['absentee_landlords', 'international_investors'],
    metrics: { totalRequests: 456, completedRequests: 423, avgCompletionTime: 5, satisfactionScore: 91, revenue: 4200000 },
    order: 11
  },
  {
    name: 'Luxury Concierge Services',
    code: 'PPM-002',
    category: 'Property & Portfolio Management',
    tier: 'ultra',
    description: '24/7 concierge, housekeeping, personal shopping, event planning',
    shortDescription: '24/7 luxury concierge',
    icon: 'Bell',
    departmentCode: 'OPS',
    assistantCode: 'JUNO',
    workflow: {
      stages: [
        { order: 1, name: 'Client Profiling', description: 'Lifestyle assessment', duration: '1-2 days', actions: ['Preference gathering', 'Service selection', 'Schedule setup'] },
        { order: 2, name: 'Service Activation', description: 'Concierge team assignment', duration: '1 day', actions: ['Team briefing', 'Contact setup', 'Emergency protocols'] },
        { order: 3, name: 'Ongoing Support', description: '24/7 availability', duration: 'Continuous', actions: ['Request fulfillment', 'Proactive service', 'Quality assurance'] }
      ],
      estimatedDuration: 'Ongoing service',
      sla: '15 minutes response'
    },
    pricing: { type: 'subscription', monthly: 5000, details: 'AED 2,500-10,000/month' },
    targetAudience: ['uhnwi_residents', 'vip_tenants'],
    metrics: { totalRequests: 89, completedRequests: 89, avgCompletionTime: 0.5, satisfactionScore: 98, revenue: 3200000 },
    order: 12
  },
  {
    name: 'Portfolio Performance Optimization',
    code: 'PPM-003',
    category: 'Property & Portfolio Management',
    tier: 'premium',
    description: 'AI-driven analysis of rental yields, occupancy rates, value appreciation',
    shortDescription: 'Portfolio analytics and optimization',
    icon: 'TrendingUp',
    departmentCode: 'INTEL',
    assistantCode: 'CIPHER',
    workflow: {
      stages: [
        { order: 1, name: 'Portfolio Audit', description: 'Comprehensive review', duration: '5-7 days', actions: ['Asset inventory', 'Performance analysis', 'Market comparison'] },
        { order: 2, name: 'Strategy Development', description: 'Optimization plan', duration: '3-5 days', actions: ['Yield optimization', 'Rebalancing recommendations', 'Exit strategies'] },
        { order: 3, name: 'Implementation', description: 'Action execution', duration: 'Ongoing', actions: ['Action items', 'Progress tracking', 'Quarterly reviews'] }
      ],
      estimatedDuration: 'Initial 2 weeks, then quarterly',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 1, details: '1% of portfolio value annually' },
    targetAudience: ['portfolio_owners', 'hnwi'],
    metrics: { totalRequests: 68, completedRequests: 62, avgCompletionTime: 14, satisfactionScore: 95, revenue: 4800000 },
    order: 13
  },
  {
    name: 'Smart Home Integration',
    code: 'PPM-004',
    category: 'Property & Portfolio Management',
    tier: 'premium',
    description: 'Installation and management of luxury home automation systems',
    shortDescription: 'Home automation services',
    icon: 'Smartphone',
    departmentCode: 'TECH',
    assistantCode: 'AURORA',
    workflow: {
      stages: [
        { order: 1, name: 'Assessment', description: 'Smart home evaluation', duration: '1-2 days', actions: ['Property assessment', 'Client requirements', 'System design'] },
        { order: 2, name: 'Installation', description: 'System setup', duration: '3-7 days', actions: ['Equipment installation', 'Integration', 'Testing'] },
        { order: 3, name: 'Training', description: 'Client onboarding', duration: '1 day', actions: ['System training', 'App setup', 'Support handoff'] },
        { order: 4, name: 'Maintenance', description: 'Ongoing support', duration: 'Continuous', actions: ['Updates', 'Troubleshooting', 'Enhancements'] }
      ],
      estimatedDuration: '7-14 days setup',
      sla: '4 hours for issues'
    },
    pricing: { type: 'custom', details: '15-20% of system cost + monthly fee' },
    targetAudience: ['tech_savvy_owners', 'new_builds'],
    metrics: { totalRequests: 156, completedRequests: 142, avgCompletionTime: 10, satisfactionScore: 94, revenue: 2100000 },
    order: 14
  },
  {
    name: 'Green & Sustainable Certification',
    code: 'PPM-005',
    category: 'Property & Portfolio Management',
    tier: 'premium',
    description: 'LEED/BREEAM certification and sustainable property management',
    shortDescription: 'Sustainability certification',
    icon: 'Leaf',
    departmentCode: 'OPS',
    assistantCode: 'JUNO',
    workflow: {
      stages: [
        { order: 1, name: 'Sustainability Audit', description: 'Environmental assessment', duration: '5-7 days', actions: ['Energy audit', 'Water assessment', 'Waste analysis'] },
        { order: 2, name: 'Improvement Plan', description: 'Green strategy', duration: '3-5 days', actions: ['Recommendations', 'ROI analysis', 'Implementation roadmap'] },
        { order: 3, name: 'Certification', description: 'Formal certification', duration: '30-90 days', actions: ['Documentation', 'Inspections', 'Certification'] }
      ],
      estimatedDuration: '60-120 days',
      sla: '48 hours response'
    },
    pricing: { type: 'fixed', amount: 25000, currency: 'AED', details: 'AED 15,000-50,000 setup' },
    targetAudience: ['esg_investors', 'corporate_owners'],
    metrics: { totalRequests: 24, completedRequests: 18, avgCompletionTime: 75, satisfactionScore: 96, revenue: 720000 },
    order: 15
  },

  // CATEGORY 4: INVESTMENT ADVISORY (IA-001 to IA-005)
  {
    name: 'Real Estate Investment Strategy',
    code: 'IA-001',
    category: 'Investment Advisory',
    tier: 'premium',
    description: 'Personalized investment roadmap based on risk profile, timeline, and goals',
    shortDescription: 'Investment strategy consulting',
    icon: 'Target',
    departmentCode: 'FIN',
    assistantCode: 'FELIX',
    workflow: {
      stages: [
        { order: 1, name: 'Discovery', description: 'Investor profiling', duration: '2-3 days', actions: ['Financial assessment', 'Risk profiling', 'Goal setting'] },
        { order: 2, name: 'Strategy Development', description: 'Investment roadmap', duration: '5-7 days', actions: ['Market analysis', 'Portfolio design', 'Timeline creation'] },
        { order: 3, name: 'Implementation', description: 'Strategy execution', duration: 'Ongoing', actions: ['Property sourcing', 'Transaction support', 'Performance tracking'] }
      ],
      estimatedDuration: 'Initial 2 weeks, then ongoing',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 1, details: '1% of investment amount (min AED 25,000)' },
    targetAudience: ['first_time_investors', 'portfolio_builders'],
    metrics: { totalRequests: 186, completedRequests: 162, avgCompletionTime: 18, satisfactionScore: 94, revenue: 5200000 },
    order: 16
  },
  {
    name: 'Market Intelligence & Research',
    code: 'IA-002',
    category: 'Investment Advisory',
    tier: 'premium',
    description: 'Custom reports on market trends, emerging areas, and yield projections',
    shortDescription: 'Custom market research',
    icon: 'BarChart2',
    departmentCode: 'INTEL',
    assistantCode: 'SAGE',
    workflow: {
      stages: [
        { order: 1, name: 'Brief', description: 'Research scope definition', duration: '1-2 days', actions: ['Requirements gathering', 'Scope definition', 'Timeline agreement'] },
        { order: 2, name: 'Research', description: 'Data collection and analysis', duration: '5-10 days', actions: ['Data gathering', 'Market analysis', 'Trend identification'] },
        { order: 3, name: 'Report Delivery', description: 'Insights presentation', duration: '2-3 days', actions: ['Report writing', 'Presentation', 'Q&A session'] }
      ],
      estimatedDuration: '10-15 days',
      sla: '48 hours response'
    },
    pricing: { type: 'fixed', amount: 15000, currency: 'AED', details: 'AED 5,000-25,000 per report' },
    targetAudience: ['institutional_investors', 'family_offices'],
    metrics: { totalRequests: 86, completedRequests: 78, avgCompletionTime: 12, satisfactionScore: 96, revenue: 1290000 },
    order: 17
  },
  {
    name: 'Development Site Acquisition',
    code: 'IA-003',
    category: 'Investment Advisory',
    tier: 'corporate',
    description: 'Land sourcing, feasibility studies, and developer partnerships',
    shortDescription: 'Development land acquisition',
    icon: 'MapPin',
    departmentCode: 'SALES',
    assistantCode: 'ATLAS',
    workflow: {
      stages: [
        { order: 1, name: 'Site Search', description: 'Land identification', duration: '2-4 weeks', actions: ['Location scouting', 'Zoning analysis', 'Availability confirmation'] },
        { order: 2, name: 'Feasibility', description: 'Development viability', duration: '2-3 weeks', actions: ['Financial modeling', 'Regulatory review', 'Risk assessment'] },
        { order: 3, name: 'Negotiation', description: 'Deal structuring', duration: '3-6 weeks', actions: ['Price negotiation', 'Terms finalization', 'Due diligence'] },
        { order: 4, name: 'Acquisition', description: 'Transaction completion', duration: '4-8 weeks', actions: ['Contract execution', 'Payment management', 'Transfer'] }
      ],
      estimatedDuration: '3-6 months',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 2.5, details: '2-3% of land value' },
    targetAudience: ['developers', 'land_bankers'],
    metrics: { totalRequests: 28, completedRequests: 18, avgCompletionTime: 120, satisfactionScore: 95, revenue: 12500000 },
    order: 18
  },
  {
    name: 'REIT & Fund Investment',
    code: 'IA-004',
    category: 'Investment Advisory',
    tier: 'premium',
    description: 'Access to UAE real estate funds and REIT investment opportunities',
    shortDescription: 'REIT and fund access',
    icon: 'PieChart',
    departmentCode: 'FIN',
    assistantCode: 'FELIX',
    workflow: {
      stages: [
        { order: 1, name: 'Investor Profiling', description: 'Suitability assessment', duration: '1-2 days', actions: ['Risk assessment', 'Investment horizon', 'Liquidity needs'] },
        { order: 2, name: 'Fund Selection', description: 'Investment matching', duration: '3-5 days', actions: ['Fund comparison', 'Performance analysis', 'Fee review'] },
        { order: 3, name: 'Investment', description: 'Capital deployment', duration: '3-7 days', actions: ['Subscription', 'Documentation', 'Fund transfer'] },
        { order: 4, name: 'Monitoring', description: 'Performance tracking', duration: 'Ongoing', actions: ['NAV updates', 'Distribution tracking', 'Rebalancing'] }
      ],
      estimatedDuration: '2-3 weeks initial',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 1, details: '1% AUM annually' },
    targetAudience: ['passive_investors', 'retirement_planners'],
    metrics: { totalRequests: 124, completedRequests: 112, avgCompletionTime: 15, satisfactionScore: 93, revenue: 2800000 },
    order: 19
  },
  {
    name: 'Exit Strategy Planning',
    code: 'IA-005',
    category: 'Investment Advisory',
    tier: 'premium',
    description: 'Optimal timing and method for property disposal to maximize returns',
    shortDescription: 'Exit strategy consulting',
    icon: 'LogOut',
    departmentCode: 'FIN',
    assistantCode: 'FELIX',
    workflow: {
      stages: [
        { order: 1, name: 'Portfolio Review', description: 'Asset assessment', duration: '3-5 days', actions: ['Performance analysis', 'Market timing', 'Tax implications'] },
        { order: 2, name: 'Exit Options', description: 'Strategy development', duration: '3-5 days', actions: ['Sale scenarios', 'Timing optimization', 'Buyer targeting'] },
        { order: 3, name: 'Execution', description: 'Exit implementation', duration: 'Variable', actions: ['Marketing', 'Negotiation', 'Transaction management'] }
      ],
      estimatedDuration: '2-4 weeks planning',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 1, details: '1% of final sale price' },
    targetAudience: ['investors_exiting', 'portfolio_rebalancers'],
    metrics: { totalRequests: 68, completedRequests: 58, avgCompletionTime: 21, satisfactionScore: 95, revenue: 3400000 },
    order: 20
  },

  // CATEGORY 5: LEGAL & COMPLIANCE SERVICES (LCS-001 to LCS-005)
  {
    name: 'UAE PASS Digital Onboarding',
    code: 'LCS-001',
    category: 'Legal & Compliance Services',
    tier: 'basic',
    description: 'Complete digital identity setup and verification via UAE PASS',
    shortDescription: 'UAE PASS verification',
    icon: 'Fingerprint',
    departmentCode: 'COMP',
    assistantCode: 'VERA',
    workflow: {
      stages: [
        { order: 1, name: 'Pre-requisites', description: 'Document preparation', duration: '1 hour', actions: ['Emirates ID check', 'Mobile verification', 'Document readiness'] },
        { order: 2, name: 'Registration', description: 'UAE PASS setup', duration: '30 min', actions: ['App download', 'Biometric verification', 'Account creation'] },
        { order: 3, name: 'Platform Link', description: 'White Caves integration', duration: '15 min', actions: ['OAuth connection', 'Profile sync', 'Verification complete'] }
      ],
      estimatedDuration: '2-4 hours',
      sla: '1 hour support'
    },
    pricing: { type: 'fixed', amount: 500, currency: 'AED', details: 'AED 500 one-time' },
    targetAudience: ['all_clients'],
    metrics: { totalRequests: 2450, completedRequests: 2380, avgCompletionTime: 2, satisfactionScore: 97, revenue: 1190000 },
    order: 21
  },
  {
    name: 'RERA/DLD Compliance Package',
    code: 'LCS-002',
    category: 'Legal & Compliance Services',
    tier: 'essential',
    description: 'Full transaction compliance including Form F, Ejari, DLD registration',
    shortDescription: 'Full regulatory compliance',
    icon: 'Shield',
    departmentCode: 'COMP',
    assistantCode: 'LAILA',
    workflow: {
      stages: [
        { order: 1, name: 'Document Collection', description: 'Required documents', duration: '1-2 days', actions: ['Identity docs', 'Property docs', 'Transaction docs'] },
        { order: 2, name: 'RERA Processing', description: 'Form F and compliance', duration: '2-3 days', actions: ['Form F preparation', 'Broker verification', 'RERA submission'] },
        { order: 3, name: 'DLD Registration', description: 'Transfer registration', duration: '1-2 days', actions: ['Transfer application', 'Fee payment', 'Title deed'] },
        { order: 4, name: 'Ejari', description: 'Tenancy registration', duration: '1 day', actions: ['Ejari submission', 'Certificate issuance', 'Completion'] }
      ],
      estimatedDuration: '5-7 days',
      sla: '4 hours response'
    },
    pricing: { type: 'fixed', amount: 2500, currency: 'AED', details: 'AED 2,500 per transaction' },
    targetAudience: ['all_transaction_parties'],
    metrics: { totalRequests: 1890, completedRequests: 1845, avgCompletionTime: 5, satisfactionScore: 95, revenue: 4612500 },
    order: 22
  },
  {
    name: 'Contract Review & Negotiation',
    code: 'LCS-003',
    category: 'Legal & Compliance Services',
    tier: 'essential',
    description: 'Legal review of sale/purchase agreements, leases, management contracts',
    shortDescription: 'Contract review services',
    icon: 'FileText',
    departmentCode: 'LEGAL',
    assistantCode: 'EVANGELINE',
    workflow: {
      stages: [
        { order: 1, name: 'Document Receipt', description: 'Contract submission', duration: 'Same day', actions: ['Contract upload', 'Scope confirmation', 'Priority setting'] },
        { order: 2, name: 'Legal Review', description: 'Comprehensive analysis', duration: '2-5 days', actions: ['Clause analysis', 'Risk identification', 'Recommendation drafting'] },
        { order: 3, name: 'Client Briefing', description: 'Review presentation', duration: '1 hour', actions: ['Findings presentation', 'Q&A', 'Negotiation strategy'] },
        { order: 4, name: 'Negotiation Support', description: 'Amendment assistance', duration: 'As needed', actions: ['Amendment drafting', 'Counter-proposal', 'Final review'] }
      ],
      estimatedDuration: '3-7 days',
      sla: '24 hours initial response'
    },
    pricing: { type: 'fixed', amount: 2500, currency: 'AED', details: 'AED 1,500-5,000 per contract' },
    targetAudience: ['all_clients'],
    metrics: { totalRequests: 568, completedRequests: 542, avgCompletionTime: 4, satisfactionScore: 94, revenue: 1420000 },
    order: 23
  },
  {
    name: 'Title Deed Verification',
    code: 'LCS-004',
    category: 'Legal & Compliance Services',
    tier: 'essential',
    description: 'Comprehensive due diligence on property ownership and encumbrances',
    shortDescription: 'Property ownership verification',
    icon: 'Search',
    departmentCode: 'LEGAL',
    assistantCode: 'LAILA',
    workflow: {
      stages: [
        { order: 1, name: 'Property Details', description: 'Information gathering', duration: '1 hour', actions: ['Title deed copy', 'Property ID', 'Owner details'] },
        { order: 2, name: 'DLD Verification', description: 'Official records check', duration: '1-2 days', actions: ['Ownership verification', 'Mortgage check', 'Lien search'] },
        { order: 3, name: 'Report', description: 'Findings documentation', duration: 'Same day', actions: ['Verification report', 'Risk assessment', 'Recommendations'] }
      ],
      estimatedDuration: '2-3 days',
      sla: '24 hours'
    },
    pricing: { type: 'fixed', amount: 1000, currency: 'AED', details: 'AED 1,000 per property' },
    targetAudience: ['buyers', 'investors'],
    metrics: { totalRequests: 1245, completedRequests: 1220, avgCompletionTime: 2, satisfactionScore: 98, revenue: 1220000 },
    order: 24
  },
  {
    name: 'Dispute Resolution & Mediation',
    code: 'LCS-005',
    category: 'Legal & Compliance Services',
    tier: 'essential',
    description: 'Resolution of tenant-landlord disputes and contract disagreements',
    shortDescription: 'Dispute resolution services',
    icon: 'Scale',
    departmentCode: 'LEGAL',
    assistantCode: 'EVANGELINE',
    workflow: {
      stages: [
        { order: 1, name: 'Case Assessment', description: 'Dispute evaluation', duration: '1-2 days', actions: ['Case review', 'Evidence gathering', 'Legal assessment'] },
        { order: 2, name: 'Mediation', description: 'Resolution attempts', duration: '3-7 days', actions: ['Party communication', 'Negotiation facilitation', 'Settlement drafting'] },
        { order: 3, name: 'Resolution', description: 'Case closure', duration: 'Variable', actions: ['Agreement signing', 'Implementation monitoring', 'Case closure'] }
      ],
      estimatedDuration: '1-4 weeks',
      sla: '24 hours initial response'
    },
    pricing: { type: 'hourly', rate: 350, currency: 'AED', details: 'AED 350/hour or fixed fee' },
    targetAudience: ['all_clients_in_dispute'],
    metrics: { totalRequests: 186, completedRequests: 164, avgCompletionTime: 12, satisfactionScore: 89, revenue: 820000 },
    order: 25
  },

  // CATEGORY 6: FINANCIAL SERVICES (FS-001 to FS-005)
  {
    name: 'Mortgage Facilitation',
    code: 'FS-001',
    category: 'Financial Services',
    tier: 'essential',
    description: 'Access to preferential mortgage rates from partner banks',
    shortDescription: 'Mortgage broker services',
    icon: 'Landmark',
    departmentCode: 'FIN',
    assistantCode: 'THEODORA',
    workflow: {
      stages: [
        { order: 1, name: 'Pre-qualification', description: 'Eligibility assessment', duration: '1-2 days', actions: ['Income verification', 'Credit check', 'Eligibility calculation'] },
        { order: 2, name: 'Bank Matching', description: 'Lender selection', duration: '2-3 days', actions: ['Rate comparison', 'Bank shortlisting', 'Pre-approval applications'] },
        { order: 3, name: 'Application', description: 'Full application', duration: '1-2 weeks', actions: ['Documentation', 'Property valuation', 'Final approval'] },
        { order: 4, name: 'Disbursement', description: 'Fund release', duration: '1 week', actions: ['Offer acceptance', 'Signing', 'Fund transfer'] }
      ],
      estimatedDuration: '3-4 weeks',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 0.75, details: '0.5-1% of loan amount (bank paid)' },
    targetAudience: ['buyers_financing'],
    metrics: { totalRequests: 456, completedRequests: 398, avgCompletionTime: 25, satisfactionScore: 92, revenue: 3800000 },
    order: 26
  },
  {
    name: 'Tax Optimization Strategy',
    code: 'FS-002',
    category: 'Financial Services',
    tier: 'premium',
    description: 'UAE tax structuring for international real estate investments',
    shortDescription: 'International tax planning',
    icon: 'Calculator',
    departmentCode: 'FIN',
    assistantCode: 'FELIX',
    workflow: {
      stages: [
        { order: 1, name: 'Tax Assessment', description: 'Current situation review', duration: '3-5 days', actions: ['Tax residency review', 'Investment structure analysis', 'Exposure assessment'] },
        { order: 2, name: 'Strategy Development', description: 'Optimization plan', duration: '5-7 days', actions: ['Structure recommendations', 'Legal entity setup', 'Compliance roadmap'] },
        { order: 3, name: 'Implementation', description: 'Structure setup', duration: '2-4 weeks', actions: ['Entity formation', 'Account setup', 'Reporting systems'] }
      ],
      estimatedDuration: '4-6 weeks',
      sla: '48 hours response'
    },
    pricing: { type: 'fixed', amount: 25000, currency: 'AED', details: 'AED 10,000-50,000 setup' },
    targetAudience: ['international_investors', 'cross_border_owners'],
    metrics: { totalRequests: 68, completedRequests: 58, avgCompletionTime: 35, satisfactionScore: 96, revenue: 1740000 },
    order: 27
  },
  {
    name: 'Currency Exchange & Transfer',
    code: 'FS-003',
    category: 'Financial Services',
    tier: 'essential',
    description: 'Competitive FX rates for international property payments',
    shortDescription: 'FX and transfers',
    icon: 'DollarSign',
    departmentCode: 'FIN',
    assistantCode: 'QUINN',
    workflow: {
      stages: [
        { order: 1, name: 'Rate Quote', description: 'FX rate provision', duration: 'Real-time', actions: ['Rate check', 'Comparison', 'Rate lock'] },
        { order: 2, name: 'Transfer Setup', description: 'Transaction preparation', duration: '1-2 hours', actions: ['Beneficiary setup', 'Compliance check', 'Transfer initiation'] },
        { order: 3, name: 'Execution', description: 'Fund transfer', duration: '1-3 days', actions: ['Fund transfer', 'Confirmation', 'Receipt'] }
      ],
      estimatedDuration: '1-3 days',
      sla: '1 hour for quotes'
    },
    pricing: { type: 'spread', percentage: 0.3, details: '0.1-0.5% above interbank rate' },
    targetAudience: ['overseas_buyers', 'overseas_sellers'],
    metrics: { totalRequests: 892, completedRequests: 875, avgCompletionTime: 1.5, satisfactionScore: 94, revenue: 2680000 },
    order: 28
  },
  {
    name: 'Insurance Portfolio',
    code: 'FS-004',
    category: 'Financial Services',
    tier: 'essential',
    description: 'Property, liability, and rental income insurance packages',
    shortDescription: 'Property insurance',
    icon: 'ShieldCheck',
    departmentCode: 'FIN',
    assistantCode: 'THEODORA',
    workflow: {
      stages: [
        { order: 1, name: 'Risk Assessment', description: 'Insurance needs analysis', duration: '1-2 days', actions: ['Property valuation', 'Risk profiling', 'Coverage needs'] },
        { order: 2, name: 'Quote Comparison', description: 'Insurer matching', duration: '2-3 days', actions: ['Multi-insurer quotes', 'Coverage comparison', 'Premium analysis'] },
        { order: 3, name: 'Policy Binding', description: 'Insurance activation', duration: '1-2 days', actions: ['Policy selection', 'Documentation', 'Premium payment'] }
      ],
      estimatedDuration: '5-7 days',
      sla: '24 hours response'
    },
    pricing: { type: 'commission', percentage: 17.5, details: '15-20% of premium' },
    targetAudience: ['property_owners', 'landlords'],
    metrics: { totalRequests: 568, completedRequests: 524, avgCompletionTime: 5, satisfactionScore: 91, revenue: 1420000 },
    order: 29
  },
  {
    name: 'Escrow Services Management',
    code: 'FS-005',
    category: 'Financial Services',
    tier: 'essential',
    description: 'Secure transaction holding with interest-bearing accounts',
    shortDescription: 'Escrow management',
    icon: 'Lock',
    departmentCode: 'FIN',
    assistantCode: 'QUINN',
    workflow: {
      stages: [
        { order: 1, name: 'Escrow Setup', description: 'Account creation', duration: '1-2 days', actions: ['Account opening', 'Terms agreement', 'Milestone definition'] },
        { order: 2, name: 'Fund Receipt', description: 'Deposit management', duration: 'As per transaction', actions: ['Deposit verification', 'Holding confirmation', 'Interest accrual'] },
        { order: 3, name: 'Release', description: 'Fund disbursement', duration: '1-2 days', actions: ['Milestone verification', 'Approval collection', 'Fund release'] }
      ],
      estimatedDuration: 'Transaction dependent',
      sla: '4 hours for release requests'
    },
    pricing: { type: 'percentage', percentage: 0.25, details: '0.25% of escrow amount' },
    targetAudience: ['off_plan_buyers', 'distant_sellers'],
    metrics: { totalRequests: 245, completedRequests: 232, avgCompletionTime: 45, satisfactionScore: 97, revenue: 980000 },
    order: 30
  },

  // CATEGORY 7: VALUE-ADDED SERVICES (VAS-001 to VAS-005)
  {
    name: 'Interior Design & Staging',
    code: 'VAS-001',
    category: 'Value-Added Services',
    tier: 'essential',
    description: 'Luxury interior design for sales enhancement or personalization',
    shortDescription: 'Interior design and staging',
    icon: 'Palette',
    departmentCode: 'MKT',
    assistantCode: 'STELLA',
    workflow: {
      stages: [
        { order: 1, name: 'Consultation', description: 'Design brief', duration: '1-2 days', actions: ['Style assessment', 'Budget setting', 'Scope definition'] },
        { order: 2, name: 'Design', description: 'Concept development', duration: '5-10 days', actions: ['Concept creation', '3D renders', 'Material selection'] },
        { order: 3, name: 'Execution', description: 'Implementation', duration: '2-8 weeks', actions: ['Procurement', 'Installation', 'Styling'] }
      ],
      estimatedDuration: '3-10 weeks',
      sla: '48 hours response'
    },
    pricing: { type: 'percentage', percentage: 15, details: '10-20% of project cost' },
    targetAudience: ['sellers', 'new_owners', 'landlords'],
    metrics: { totalRequests: 186, completedRequests: 168, avgCompletionTime: 42, satisfactionScore: 95, revenue: 2800000 },
    order: 31
  },
  {
    name: 'Property Marketing Premium',
    code: 'VAS-002',
    category: 'Value-Added Services',
    tier: 'essential',
    description: 'Professional photography, drone videography, 3D virtual tours',
    shortDescription: 'Premium property marketing',
    icon: 'Camera',
    departmentCode: 'MKT',
    assistantCode: 'OLIVIA',
    workflow: {
      stages: [
        { order: 1, name: 'Scheduling', description: 'Shoot planning', duration: '1-2 days', actions: ['Date scheduling', 'Property prep', 'Shot list'] },
        { order: 2, name: 'Production', description: 'Content creation', duration: '1 day', actions: ['Photography', 'Drone footage', 'Virtual tour capture'] },
        { order: 3, name: 'Post-production', description: 'Editing and delivery', duration: '3-5 days', actions: ['Photo editing', 'Video editing', 'Tour processing'] },
        { order: 4, name: 'Distribution', description: 'Multi-platform publishing', duration: '1-2 days', actions: ['Portal upload', 'Social posting', 'Analytics setup'] }
      ],
      estimatedDuration: '7-10 days',
      sla: '24 hours response'
    },
    pricing: { type: 'fixed', amount: 8000, currency: 'AED', details: 'AED 3,000-15,000 package' },
    targetAudience: ['sellers', 'landlords'],
    metrics: { totalRequests: 785, completedRequests: 742, avgCompletionTime: 8, satisfactionScore: 94, revenue: 5936000 },
    order: 32
  },
  {
    name: 'Relocation & Settling-In',
    code: 'VAS-003',
    category: 'Value-Added Services',
    tier: 'essential',
    description: 'Visa processing, school placements, utility connections, cultural orientation',
    shortDescription: 'Relocation assistance',
    icon: 'Plane',
    departmentCode: 'OPS',
    assistantCode: 'JUNO',
    workflow: {
      stages: [
        { order: 1, name: 'Needs Assessment', description: 'Relocation requirements', duration: '1-2 days', actions: ['Family profiling', 'Service selection', 'Timeline planning'] },
        { order: 2, name: 'Visa & Documentation', description: 'Legal requirements', duration: '2-4 weeks', actions: ['Visa processing', 'Emirates ID', 'License conversions'] },
        { order: 3, name: 'Setup Services', description: 'Daily life setup', duration: '1-2 weeks', actions: ['Utilities', 'Banking', 'School enrollment'] },
        { order: 4, name: 'Orientation', description: 'Cultural integration', duration: '1-3 days', actions: ['City orientation', 'Cultural briefing', 'Local tips'] }
      ],
      estimatedDuration: '4-8 weeks',
      sla: '24 hours response'
    },
    pricing: { type: 'fixed', amount: 15000, currency: 'AED', details: 'AED 7,500-25,000 per family' },
    targetAudience: ['new_residents', 'corporate_transferees'],
    metrics: { totalRequests: 124, completedRequests: 112, avgCompletionTime: 35, satisfactionScore: 96, revenue: 1680000 },
    order: 33
  },
  {
    name: 'Lifestyle Concierge',
    code: 'VAS-004',
    category: 'Value-Added Services',
    tier: 'ultra',
    description: 'Restaurant reservations, event tickets, club memberships, yacht charters',
    shortDescription: 'Lifestyle management',
    icon: 'Sparkles',
    departmentCode: 'OPS',
    assistantCode: 'JUNO',
    workflow: {
      stages: [
        { order: 1, name: 'Preference Profiling', description: 'Lifestyle assessment', duration: '1 day', actions: ['Interest mapping', 'Preference documentation', 'Contact list'] },
        { order: 2, name: 'Service Activation', description: 'Concierge setup', duration: '1 day', actions: ['Team assignment', 'Priority protocols', 'Communication setup'] },
        { order: 3, name: 'Ongoing Service', description: 'Request fulfillment', duration: 'Continuous', actions: ['Request handling', 'Proactive suggestions', 'Quality assurance'] }
      ],
      estimatedDuration: 'Ongoing service',
      sla: '1 hour response'
    },
    pricing: { type: 'subscription', monthly: 1500, details: 'AED 1,500/month retainer' },
    targetAudience: ['vip_clients', 'tenants'],
    metrics: { totalRequests: 86, completedRequests: 86, avgCompletionTime: 0.5, satisfactionScore: 98, revenue: 1548000 },
    order: 34
  },
  {
    name: 'AI-Powered Market Alerts',
    code: 'VAS-005',
    category: 'Value-Added Services',
    tier: 'basic',
    description: 'Personalized property alerts based on AI learning of preferences',
    shortDescription: 'Smart property alerts',
    icon: 'Bell',
    departmentCode: 'TECH',
    assistantCode: 'MARY',
    workflow: {
      stages: [
        { order: 1, name: 'Preference Setup', description: 'Alert configuration', duration: '30 min', actions: ['Property criteria', 'Budget range', 'Location preferences'] },
        { order: 2, name: 'AI Learning', description: 'Preference refinement', duration: 'Ongoing', actions: ['Interaction tracking', 'Preference updates', 'Algorithm tuning'] },
        { order: 3, name: 'Alert Delivery', description: 'Match notifications', duration: 'Real-time', actions: ['Match identification', 'Alert dispatch', 'Feedback collection'] }
      ],
      estimatedDuration: 'Ongoing service',
      sla: 'Real-time alerts'
    },
    pricing: { type: 'subscription', monthly: 500, details: 'AED 500/month' },
    targetAudience: ['all_registered_clients'],
    metrics: { totalRequests: 1245, completedRequests: 1245, avgCompletionTime: 0.1, satisfactionScore: 89, revenue: 622500 },
    order: 35
  },

  // CATEGORY 8: TECHNOLOGY SERVICES (TS-001 to TS-005)
  {
    name: 'White Caves AI Platform Access',
    code: 'TS-001',
    category: 'Technology Services',
    tier: 'ultra',
    description: 'Premium access to all 32 AI assistants for personal use',
    shortDescription: 'Full AI platform access',
    icon: 'Bot',
    departmentCode: 'TECH',
    assistantCode: 'AURORA',
    workflow: {
      stages: [
        { order: 1, name: 'Subscription', description: 'Account activation', duration: '1 day', actions: ['Account upgrade', 'Access provisioning', 'Training session'] },
        { order: 2, name: 'Onboarding', description: 'Platform training', duration: '2-3 hours', actions: ['Feature walkthrough', 'Use case examples', 'Support setup'] },
        { order: 3, name: 'Active Use', description: 'Ongoing access', duration: 'Continuous', actions: ['AI assistant usage', 'Feature updates', 'Premium support'] }
      ],
      estimatedDuration: 'Annual subscription',
      sla: '30 minutes response'
    },
    pricing: { type: 'subscription', annual: 10000, details: 'AED 10,000/year' },
    targetAudience: ['uhnwi_clients', 'corporate_accounts'],
    metrics: { totalRequests: 48, completedRequests: 48, avgCompletionTime: 1, satisfactionScore: 97, revenue: 480000 },
    order: 36
  },
  {
    name: 'Digital Portfolio Dashboard',
    code: 'TS-002',
    category: 'Technology Services',
    tier: 'premium',
    description: 'Real-time dashboard of property portfolio performance',
    shortDescription: 'Portfolio analytics dashboard',
    icon: 'LayoutDashboard',
    departmentCode: 'TECH',
    assistantCode: 'AURORA',
    workflow: {
      stages: [
        { order: 1, name: 'Data Integration', description: 'Property data sync', duration: '2-3 days', actions: ['Property linking', 'Data import', 'Metric configuration'] },
        { order: 2, name: 'Dashboard Setup', description: 'Customization', duration: '1-2 days', actions: ['Layout selection', 'KPI configuration', 'Alert setup'] },
        { order: 3, name: 'Go Live', description: 'Dashboard activation', duration: '1 day', actions: ['User training', 'Access provisioning', 'Support handoff'] }
      ],
      estimatedDuration: '1 week setup',
      sla: '4 hours for issues'
    },
    pricing: { type: 'subscription', monthly: 2500, details: 'AED 2,500/month' },
    targetAudience: ['portfolio_owners'],
    metrics: { totalRequests: 86, completedRequests: 82, avgCompletionTime: 5, satisfactionScore: 94, revenue: 2580000 },
    order: 37
  },
  {
    name: 'Predictive Analytics Reports',
    code: 'TS-003',
    category: 'Technology Services',
    tier: 'premium',
    description: 'AI-generated forecasts for property values and rental yields',
    shortDescription: 'AI market predictions',
    icon: 'Sparkles',
    departmentCode: 'INTEL',
    assistantCode: 'CIPHER',
    workflow: {
      stages: [
        { order: 1, name: 'Scope Definition', description: 'Report requirements', duration: '1-2 days', actions: ['Area selection', 'Metrics selection', 'Timeline definition'] },
        { order: 2, name: 'AI Analysis', description: 'Data processing', duration: '3-5 days', actions: ['Data aggregation', 'Model execution', 'Prediction generation'] },
        { order: 3, name: 'Report Delivery', description: 'Insights presentation', duration: '1-2 days', actions: ['Report compilation', 'Visualization', 'Presentation'] }
      ],
      estimatedDuration: '7-10 days',
      sla: '48 hours response'
    },
    pricing: { type: 'fixed', amount: 2500, currency: 'AED', details: 'AED 2,500/report' },
    targetAudience: ['serious_investors', 'developers'],
    metrics: { totalRequests: 124, completedRequests: 118, avgCompletionTime: 8, satisfactionScore: 93, revenue: 295000 },
    order: 38
  },
  {
    name: 'API Integration Services',
    code: 'TS-004',
    category: 'Technology Services',
    tier: 'corporate',
    description: 'Connect White Caves platform to client systems and portals',
    shortDescription: 'API and system integration',
    icon: 'Code',
    departmentCode: 'TECH',
    assistantCode: 'WILLOW',
    workflow: {
      stages: [
        { order: 1, name: 'Requirements', description: 'Integration scope', duration: '3-5 days', actions: ['System analysis', 'API design', 'Security review'] },
        { order: 2, name: 'Development', description: 'Integration build', duration: '2-4 weeks', actions: ['API development', 'Testing', 'Documentation'] },
        { order: 3, name: 'Deployment', description: 'Go-live', duration: '1 week', actions: ['Production deployment', 'Training', 'Support transition'] }
      ],
      estimatedDuration: '4-6 weeks',
      sla: '4 hours for production issues'
    },
    pricing: { type: 'fixed', amount: 30000, currency: 'AED', details: 'AED 15,000-50,000 setup' },
    targetAudience: ['corporate_clients', 'partner_firms'],
    metrics: { totalRequests: 18, completedRequests: 15, avgCompletionTime: 35, satisfactionScore: 95, revenue: 540000 },
    order: 39
  },
  {
    name: 'Blockchain Title Management',
    code: 'TS-005',
    category: 'Technology Services',
    tier: 'ultra',
    description: 'Digital title deeds on blockchain for enhanced security and transparency',
    shortDescription: 'Blockchain title deeds',
    icon: 'Link',
    departmentCode: 'TECH',
    assistantCode: 'HENRY',
    workflow: {
      stages: [
        { order: 1, name: 'Title Verification', description: 'Ownership confirmation', duration: '2-3 days', actions: ['DLD verification', 'Document collection', 'Chain of title'] },
        { order: 2, name: 'Blockchain Registration', description: 'Digital tokenization', duration: '3-5 days', actions: ['Token creation', 'Metadata upload', 'Smart contract'] },
        { order: 3, name: 'Certificate Issuance', description: 'Blockchain title', duration: '1-2 days', actions: ['Certificate generation', 'Owner notification', 'Platform access'] }
      ],
      estimatedDuration: '7-10 days',
      sla: '24 hours response'
    },
    pricing: { type: 'percentage', percentage: 0.5, details: '0.5% of property value' },
    targetAudience: ['tech_forward_investors'],
    metrics: { totalRequests: 24, completedRequests: 18, avgCompletionTime: 8, satisfactionScore: 96, revenue: 450000 },
    order: 40
  }
];
