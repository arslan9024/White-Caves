import { AI_ASSISTANTS, DEPARTMENTS } from './assistantRegistry';

export const ASSISTANT_FEATURES = {
  zoe: {
    features: [
      { id: 'dashboard', label: 'Dashboard', component: 'ExecutiveDashboard', icon: 'LayoutDashboard' },
      { id: 'suggestions', label: 'Suggestions', component: 'SuggestionInbox', icon: 'Lightbulb' },
      { id: 'analytics', label: 'Analytics', component: 'AnalyticsDashboard', icon: 'BarChart3' },
      { id: 'reports', label: 'Reports', component: 'ReportGenerator', icon: 'FileText' }
    ]
  },
  linda: {
    features: [
      { id: 'conversations', label: 'Conversations', component: 'ConversationManager', icon: 'MessageSquare' },
      { id: 'agents', label: 'Agent Status', component: 'AgentStatusPanel', icon: 'Users' },
      { id: 'templates', label: 'Templates', component: 'TemplateEditor', icon: 'FileEdit' },
      { id: 'broadcasts', label: 'Broadcasts', component: 'BroadcastManager', icon: 'Radio' }
    ]
  },
  nina: {
    features: [
      { id: 'bots', label: 'Bot Builder', component: 'BotBuilder', icon: 'Bot' },
      { id: 'flows', label: 'Flow Designer', component: 'FlowDesigner', icon: 'GitBranch' },
      { id: 'sessions', label: 'Sessions', component: 'SessionMonitor', icon: 'Activity' },
      { id: 'analytics', label: 'Analytics', component: 'BotAnalytics', icon: 'BarChart3' }
    ]
  },
  mary: {
    features: [
      { id: 'inventory', label: 'Inventory', component: 'InventoryManager', icon: 'Building2' },
      { id: 'data-tools', label: 'Data Tools', component: 'DataToolsSuite', icon: 'Database' },
      { id: 'assets', label: 'Asset Fetcher', component: 'AssetFetcher', icon: 'Download' },
      { id: 'import', label: 'Import', component: 'DataImporter', icon: 'Upload' }
    ]
  },
  nancy: {
    features: [
      { id: 'employees', label: 'Employees', component: 'EmployeeDirectory', icon: 'Users' },
      { id: 'recruitment', label: 'Recruitment', component: 'RecruitmentPipeline', icon: 'UserPlus' },
      { id: 'attendance', label: 'Attendance', component: 'AttendanceTracker', icon: 'Calendar' },
      { id: 'performance', label: 'Performance', component: 'PerformanceReviews', icon: 'TrendingUp' }
    ]
  },
  daisy: {
    features: [
      { id: 'leases', label: 'Leases', component: 'LeaseManager', icon: 'FileText' },
      { id: 'tenants', label: 'Tenants', component: 'TenantDirectory', icon: 'Users' },
      { id: 'maintenance', label: 'Maintenance', component: 'MaintenanceTracker', icon: 'Wrench' },
      { id: 'rentals', label: 'Rentals', component: 'RentalAnalytics', icon: 'BarChart3' }
    ]
  },
  clara: {
    features: [
      { id: 'pipeline', label: 'Pipeline', component: 'LeadPipeline', icon: 'Target' },
      { id: 'leads', label: 'Lead List', component: 'LeadDirectory', icon: 'Users' },
      { id: 'scoring', label: 'Scoring', component: 'LeadScoring', icon: 'Star' },
      { id: 'nurturing', label: 'Nurturing', component: 'NurturingWorkflows', icon: 'Heart' }
    ]
  },
  sophia: {
    features: [
      { id: 'deals', label: 'Deals', component: 'DealTracker', icon: 'Handshake' },
      { id: 'pipeline', label: 'Pipeline', component: 'SalesPipeline', icon: 'TrendingUp' },
      { id: 'forecast', label: 'Forecast', component: 'SalesForecast', icon: 'LineChart' },
      { id: 'commission', label: 'Commission', component: 'CommissionCalculator', icon: 'DollarSign' }
    ]
  },
  theodora: {
    features: [
      { id: 'invoices', label: 'Invoices', component: 'InvoiceManager', icon: 'FileText' },
      { id: 'payments', label: 'Payments', component: 'PaymentTracker', icon: 'CreditCard' },
      { id: 'reports', label: 'Reports', component: 'FinancialReports', icon: 'BarChart3' },
      { id: 'escrow', label: 'Escrow', component: 'EscrowManager', icon: 'Shield' }
    ]
  },
  olivia: {
    features: [
      { id: 'campaigns', label: 'Campaigns', component: 'CampaignManager', icon: 'Megaphone' },
      { id: 'social', label: 'Social', component: 'SocialMediaHub', icon: 'Share2' },
      { id: 'automation', label: 'Automation', component: 'AutomationRules', icon: 'Zap' },
      { id: 'intelligence', label: 'Intelligence', component: 'MarketIntelligence', icon: 'Brain' }
    ]
  },
  laila: {
    features: [
      { id: 'kyc', label: 'KYC', component: 'KycVerification', icon: 'UserCheck' },
      { id: 'aml', label: 'AML', component: 'AmlMonitoring', icon: 'Shield' },
      { id: 'contracts', label: 'Contracts', component: 'ContractReview', icon: 'FileCheck' },
      { id: 'audit', label: 'Audit Trail', component: 'AuditTrail', icon: 'History' }
    ]
  },
  aurora: {
    features: [
      { id: 'systems', label: 'Systems', component: 'SystemHealth', icon: 'Server' },
      { id: 'deployments', label: 'Deployments', component: 'DeploymentPipeline', icon: 'Rocket' },
      { id: 'docs', label: 'Documentation', component: 'DocumentationHub', icon: 'Book' },
      { id: 'ai-governance', label: 'AI Governance', component: 'AiGovernance', icon: 'Bot' }
    ]
  },
  hazel: {
    features: [
      { id: 'components', label: 'Components', component: 'ComponentLibrary', icon: 'Palette' },
      { id: 'design-system', label: 'Design System', component: 'DesignSystem', icon: 'Layout' },
      { id: 'accessibility', label: 'Accessibility', component: 'AccessibilityAudit', icon: 'Eye' },
      { id: 'themes', label: 'Themes', component: 'ThemeManager', icon: 'Sun' }
    ]
  },
  willow: {
    features: [
      { id: 'apis', label: 'APIs', component: 'ApiDashboard', icon: 'Code' },
      { id: 'database', label: 'Database', component: 'DatabaseMonitor', icon: 'Database' },
      { id: 'performance', label: 'Performance', component: 'PerformanceMetrics', icon: 'Activity' },
      { id: 'security', label: 'Security', component: 'SecurityCenter', icon: 'Lock' }
    ]
  },
  evangeline: {
    features: [
      { id: 'risks', label: 'Risk Analysis', component: 'LegalRiskAnalysis', icon: 'AlertTriangle' },
      { id: 'contracts', label: 'Contracts', component: 'ContractMonitor', icon: 'FileText' },
      { id: 'regulations', label: 'Regulations', component: 'RegulatoryTracker', icon: 'Scale' },
      { id: 'library', label: 'Library', component: 'BestPracticesLibrary', icon: 'Book' }
    ]
  },
  sentinel: {
    features: [
      { id: 'monitoring', label: 'Monitoring', component: 'PropertyMonitoring', icon: 'Eye' },
      { id: 'maintenance', label: 'Maintenance', component: 'PredictiveMaintenance', icon: 'Wrench' },
      { id: 'inspections', label: 'Inspections', component: 'InspectionScheduler', icon: 'Clipboard' },
      { id: 'emergency', label: 'Emergency', component: 'EmergencyResponse', icon: 'AlertCircle' }
    ]
  },
  hunter: {
    features: [
      { id: 'prospects', label: 'Prospects', component: 'ProspectAnalysis', icon: 'Search' },
      { id: 'outreach', label: 'Outreach', component: 'OutreachCampaigns', icon: 'Send' },
      { id: 'patterns', label: 'Patterns', component: 'PatternDetection', icon: 'Radar' },
      { id: 'enrichment', label: 'Enrichment', component: 'LeadEnrichment', icon: 'Plus' }
    ]
  },
  henry: {
    features: [
      { id: 'events', label: 'Events', component: 'EventTimeline', icon: 'Clock' },
      { id: 'audit', label: 'Audit Log', component: 'AuditLog', icon: 'History' },
      { id: 'analytics', label: 'Analytics', component: 'TimelineAnalytics', icon: 'BarChart3' },
      { id: 'reports', label: 'Reports', component: 'ComplianceReports', icon: 'FileText' }
    ]
  },
  cipher: {
    features: [
      { id: 'trends', label: 'Market Trends', component: 'MarketTrends', icon: 'TrendingUp' },
      { id: 'predictions', label: 'Predictions', component: 'PricePredictions', icon: 'LineChart' },
      { id: 'competitors', label: 'Competitors', component: 'CompetitorTracking', icon: 'Users' },
      { id: 'indicators', label: 'Indicators', component: 'EconomicIndicators', icon: 'Activity' }
    ]
  },
  atlas: {
    features: [
      { id: 'projects', label: 'Projects', component: 'ProjectPipeline', icon: 'Map' },
      { id: 'feasibility', label: 'Feasibility', component: 'FeasibilityAnalysis', icon: 'Calculator' },
      { id: 'developers', label: 'Developers', component: 'DeveloperTracking', icon: 'Building' },
      { id: 'zoning', label: 'Zoning', component: 'ZoningAnalysis', icon: 'Grid' }
    ]
  },
  vesta: {
    features: [
      { id: 'milestones', label: 'Milestones', component: 'MilestoneTracker', icon: 'Flag' },
      { id: 'snagging', label: 'Snagging', component: 'SnaggingManager', icon: 'CheckSquare' },
      { id: 'handover', label: 'Handover', component: 'HandoverCoordination', icon: 'Key' },
      { id: 'defects', label: 'Defects', component: 'DefectReporting', icon: 'AlertCircle' }
    ]
  },
  juno: {
    features: [
      { id: 'facilities', label: 'Facilities', component: 'FacilitiesManager', icon: 'Building' },
      { id: 'iot', label: 'IoT', component: 'IotDashboard', icon: 'Wifi' },
      { id: 'events', label: 'Events', component: 'CommunityEvents', icon: 'Calendar' },
      { id: 'energy', label: 'Energy', component: 'EnergyOptimization', icon: 'Zap' }
    ]
  },
  kairos: {
    features: [
      { id: 'vip', label: 'VIP Clients', component: 'VipClientManager', icon: 'Crown' },
      { id: 'concierge', label: 'Concierge', component: 'ConciergeServices', icon: 'Star' },
      { id: 'lifestyle', label: 'Lifestyle', component: 'LifestyleCoordination', icon: 'Heart' },
      { id: 'partners', label: 'Partners', component: 'PartnerNetwork', icon: 'Users' }
    ]
  },
  maven: {
    features: [
      { id: 'portfolio', label: 'Portfolio', component: 'PortfolioAnalysis', icon: 'PieChart' },
      { id: 'yields', label: 'Yields', component: 'YieldOptimization', icon: 'TrendingUp' },
      { id: 'tax', label: 'Tax Planning', component: 'TaxPlanning', icon: 'Calculator' },
      { id: 'recommendations', label: 'Advice', component: 'InvestmentAdvice', icon: 'Lightbulb' }
    ]
  }
};

export const getAssistantWithFeatures = (assistantId) => {
  const baseAssistant = AI_ASSISTANTS[assistantId];
  if (!baseAssistant) return null;
  
  const featuresConfig = ASSISTANT_FEATURES[assistantId];
  
  return {
    ...baseAssistant,
    features: featuresConfig?.features || [
      { id: 'dashboard', label: 'Dashboard', component: 'GenericDashboard', icon: 'LayoutDashboard' }
    ]
  };
};

export const getAllAssistantsWithFeatures = () => {
  return Object.keys(AI_ASSISTANTS).map(id => getAssistantWithFeatures(id));
};

export { AI_ASSISTANTS, DEPARTMENTS };

export default {
  ASSISTANT_FEATURES,
  getAssistantWithFeatures,
  getAllAssistantsWithFeatures
};
