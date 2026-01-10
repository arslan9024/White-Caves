export const ASSISTANT_FEATURES = {
  zoe: {
    id: 'zoe',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'suggestions', label: 'Suggestion Inbox', icon: 'Lightbulb' },
      { id: 'reports', label: 'Executive Reports', icon: 'FileText' },
      { id: 'analytics', label: 'KPI Analytics', icon: 'BarChart3' },
      { id: 'briefings', label: 'MD Briefings', icon: 'Briefcase' },
      { id: 'planning', label: 'Strategic Planning', icon: 'Target' }
    ]
  },
  mary: {
    id: 'mary',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'inventory', label: 'Property Inventory', icon: 'Building2' },
      { id: 'data_tools', label: 'Data Tools Suite', icon: 'Wrench' },
      { id: 'asset_fetcher', label: 'DAMAC Asset Fetcher', icon: 'Download' },
      { id: 'import', label: 'Excel Import', icon: 'FileSpreadsheet' },
      { id: 'ocr', label: 'OCR Extraction', icon: 'ScanText' }
    ]
  },
  linda: {
    id: 'linda',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'conversations', label: 'Conversations', icon: 'MessageSquare' },
      { id: 'agents', label: 'Agent Status', icon: 'Users' },
      { id: 'templates', label: 'Templates', icon: 'FileText' },
      { id: 'broadcasts', label: 'Broadcasts', icon: 'Radio' },
      { id: 'scoring', label: 'Lead Scoring', icon: 'Target' }
    ]
  },
  nina: {
    id: 'nina',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'bot_builder', label: 'Bot Builder', icon: 'Bot' },
      { id: 'flows', label: 'Flow Designer', icon: 'GitBranch' },
      { id: 'sessions', label: 'Sessions', icon: 'MessageCircle' },
      { id: 'analytics', label: 'Bot Analytics', icon: 'BarChart3' }
    ]
  },
  clara: {
    id: 'clara',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'pipeline', label: 'Lead Pipeline', icon: 'Filter' },
      { id: 'leads', label: 'Lead List', icon: 'Users' },
      { id: 'scoring', label: 'Lead Scoring', icon: 'Target' },
      { id: 'nurturing', label: 'Nurturing Workflows', icon: 'Workflow' },
      { id: 'timeline', label: 'Activity Timeline', icon: 'Clock' }
    ]
  },
  sophia: {
    id: 'sophia',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'deals', label: 'Active Deals', icon: 'Handshake' },
      { id: 'pipeline', label: 'Sales Pipeline', icon: 'TrendingUp' },
      { id: 'forecast', label: 'Sales Forecast', icon: 'LineChart' },
      { id: 'commission', label: 'Commission Calculator', icon: 'Calculator' }
    ]
  },
  nancy: {
    id: 'nancy',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'employees', label: 'Employees', icon: 'Users' },
      { id: 'recruitment', label: 'Recruitment', icon: 'UserPlus' },
      { id: 'attendance', label: 'Attendance', icon: 'Calendar' },
      { id: 'performance', label: 'Performance Reviews', icon: 'Award' }
    ]
  },
  daisy: {
    id: 'daisy',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'leases', label: 'Lease Management', icon: 'FileText' },
      { id: 'tenants', label: 'Tenants', icon: 'Users' },
      { id: 'maintenance', label: 'Maintenance', icon: 'Wrench' },
      { id: 'analytics', label: 'Rental Analytics', icon: 'BarChart3' }
    ]
  },
  theodora: {
    id: 'theodora',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'invoices', label: 'Invoices', icon: 'Receipt' },
      { id: 'payments', label: 'Payments', icon: 'CreditCard' },
      { id: 'reports', label: 'Financial Reports', icon: 'FileText' },
      { id: 'escrow', label: 'Escrow Management', icon: 'Lock' },
      { id: 'budget', label: 'Budget Analysis', icon: 'PieChart' }
    ]
  },
  olivia: {
    id: 'olivia',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'campaigns', label: 'Campaigns', icon: 'Megaphone' },
      { id: 'social', label: 'Social Media', icon: 'Share2' },
      { id: 'automation', label: 'Automation', icon: 'Zap' },
      { id: 'intelligence', label: 'Market Intelligence', icon: 'Brain' }
    ]
  },
  laila: {
    id: 'laila',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'kyc', label: 'KYC Verification', icon: 'UserCheck' },
      { id: 'aml', label: 'AML Monitoring', icon: 'Shield' },
      { id: 'contracts', label: 'Contract Review', icon: 'FileText' },
      { id: 'audit', label: 'Audit Trail', icon: 'History' }
    ]
  },
  aurora: {
    id: 'aurora',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'systems', label: 'Systems Health', icon: 'Activity' },
      { id: 'deployments', label: 'Deployments', icon: 'Rocket' },
      { id: 'documentation', label: 'Documentation', icon: 'Book' },
      { id: 'governance', label: 'AI Governance', icon: 'Shield' }
    ]
  },
  hazel: {
    id: 'hazel',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'components', label: 'Component Library', icon: 'Layers' },
      { id: 'design_system', label: 'Design System', icon: 'Palette' },
      { id: 'accessibility', label: 'Accessibility', icon: 'Eye' },
      { id: 'themes', label: 'Theme Manager', icon: 'Sun' }
    ]
  },
  willow: {
    id: 'willow',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'apis', label: 'API Management', icon: 'Code' },
      { id: 'database', label: 'Database', icon: 'Database' },
      { id: 'performance', label: 'Performance', icon: 'Gauge' },
      { id: 'security', label: 'Security', icon: 'Lock' }
    ]
  },
  evangeline: {
    id: 'evangeline',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'risks', label: 'Risk Analysis', icon: 'AlertTriangle' },
      { id: 'contracts', label: 'Contracts', icon: 'FileText' },
      { id: 'regulations', label: 'Regulations', icon: 'Scale' },
      { id: 'library', label: 'Best Practices', icon: 'BookOpen' }
    ]
  },
  sentinel: {
    id: 'sentinel',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'monitoring', label: 'Property Monitoring', icon: 'Eye' },
      { id: 'maintenance', label: 'Predictive Maintenance', icon: 'Wrench' },
      { id: 'inspections', label: 'Inspections', icon: 'ClipboardCheck' },
      { id: 'emergency', label: 'Emergency Response', icon: 'AlertCircle' }
    ]
  },
  hunter: {
    id: 'hunter',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'prospects', label: 'Prospects', icon: 'Users' },
      { id: 'outreach', label: 'Outreach Campaigns', icon: 'Send' },
      { id: 'patterns', label: 'Pattern Detection', icon: 'Sparkles' },
      { id: 'enrichment', label: 'Lead Enrichment', icon: 'Database' }
    ]
  },
  henry: {
    id: 'henry',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'events', label: 'Event Log', icon: 'List' },
      { id: 'audit', label: 'Audit Trail', icon: 'History' },
      { id: 'timeline', label: 'Timeline Analytics', icon: 'Clock' },
      { id: 'reports', label: 'Compliance Reports', icon: 'FileText' }
    ]
  },
  cipher: {
    id: 'cipher',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'trends', label: 'Market Trends', icon: 'TrendingUp' },
      { id: 'predictions', label: 'Price Predictions', icon: 'LineChart' },
      { id: 'competitors', label: 'Competitor Tracking', icon: 'Users' },
      { id: 'indicators', label: 'Economic Indicators', icon: 'BarChart3' }
    ]
  },
  atlas: {
    id: 'atlas',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'projects', label: 'Projects', icon: 'Building2' },
      { id: 'feasibility', label: 'Feasibility Analysis', icon: 'Calculator' },
      { id: 'developers', label: 'Developer Tracking', icon: 'Users' },
      { id: 'zoning', label: 'Zoning Analysis', icon: 'Map' }
    ]
  },
  vesta: {
    id: 'vesta',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'milestones', label: 'Milestones', icon: 'Flag' },
      { id: 'snagging', label: 'Snagging', icon: 'ClipboardCheck' },
      { id: 'handover', label: 'Handover', icon: 'Key' },
      { id: 'defects', label: 'Defect Reports', icon: 'AlertCircle' }
    ]
  },
  juno: {
    id: 'juno',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'facilities', label: 'Facilities', icon: 'Building' },
      { id: 'iot', label: 'IoT Devices', icon: 'Cpu' },
      { id: 'events', label: 'Community Events', icon: 'Calendar' },
      { id: 'energy', label: 'Energy Optimization', icon: 'Zap' }
    ]
  },
  kairos: {
    id: 'kairos',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'vip', label: 'VIP Clients', icon: 'Crown' },
      { id: 'concierge', label: 'Concierge Services', icon: 'Sparkles' },
      { id: 'lifestyle', label: 'Lifestyle Coordination', icon: 'Compass' },
      { id: 'partners', label: 'Partner Network', icon: 'Handshake' }
    ]
  },
  maven: {
    id: 'maven',
    features: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', default: true },
      { id: 'portfolio', label: 'Portfolio Analysis', icon: 'PieChart' },
      { id: 'yields', label: 'Yield Optimization', icon: 'TrendingUp' },
      { id: 'tax', label: 'Tax Planning', icon: 'Calculator' },
      { id: 'advice', label: 'Investment Advice', icon: 'Lightbulb' }
    ]
  }
};

export const getAssistantFeatures = (assistantId) => {
  return ASSISTANT_FEATURES[assistantId]?.features || [];
};

export const getDefaultFeature = (assistantId) => {
  const features = ASSISTANT_FEATURES[assistantId]?.features || [];
  return features.find(f => f.default)?.id || features[0]?.id || 'dashboard';
};

export const getFeatureById = (assistantId, featureId) => {
  const features = ASSISTANT_FEATURES[assistantId]?.features || [];
  return features.find(f => f.id === featureId);
};

export default ASSISTANT_FEATURES;
