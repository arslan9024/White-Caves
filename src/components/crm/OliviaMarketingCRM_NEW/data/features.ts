// Olivia Marketing CRM Features Catalog

export interface OliviaFeature {
  name: string;
  category: string;
  status: 'active' | 'beta' | 'planned' | 'development';
  description: string;
  sourceFiles?: string[];
  capabilities: string[];
  nextMilestone?: string;
}

export const OLIVIA_FEATURES: OliviaFeature[] = [
  {
    name: 'Campaign Management',
    category: 'Marketing',
    status: 'active',
    description: 'Create, manage, and track advertising campaigns across multiple platforms.',
    sourceFiles: ['OliviaMarketingCRM.jsx'],
    capabilities: ['Campaign creation', 'Budget allocation', 'ROI tracking', 'Lead measurement']
  },
  {
    name: 'Social Media Analytics',
    category: 'Analytics',
    status: 'active',
    description: 'Track followers, engagement, and performance across social platforms.',
    sourceFiles: ['OliviaMarketingCRM.jsx'],
    capabilities: ['Platform tracking', 'Growth metrics', 'Engagement analysis', 'Post analytics']
  },
  {
    name: 'Property Listing Optimization',
    category: 'Listings',
    status: 'active',
    description: 'Optimize property listings with performance metrics and quality scoring.',
    sourceFiles: ['OliviaMarketingCRM.jsx'],
    capabilities: ['View tracking', 'Inquiry monitoring', 'Quality scoring', 'Availability mgmt']
  },
  {
    name: 'Market Research & Insights',
    category: 'Analytics',
    status: 'active',
    description: 'Real-time market insights including price trends, hotspots, and demand analysis.',
    sourceFiles: ['OliviaMarketingCRM.jsx'],
    capabilities: ['Price indexing', 'Trend analysis', 'Hotspot identification', 'Demand forecasting']
  },
  {
    name: 'Automated Publishing',
    category: 'Publishing',
    status: 'active',
    description: 'Schedule and auto-publish content across multiple social and web platforms.',
    sourceFiles: ['OliviaMarketingCRM.jsx'],
    capabilities: ['Multi-platform publishing', 'Schedule management', 'Content templates', 'Auto-posting']
  },
  {
    name: 'Website Monitoring',
    category: 'Monitoring',
    status: 'active',
    description: 'Monitor competing property websites and track market data from multiple sources.',
    sourceFiles: ['OliviaMarketingCRM.jsx'],
    capabilities: ['Site health check', 'Data scraping', 'Competitor tracking', 'Historical analysis']
  },
  {
    name: 'Marketing Automation',
    category: 'Automation',
    status: 'beta',
    description: 'Automate marketing workflows, email campaigns, and lead nurturing sequences.',
    sourceFiles: ['OliviaMarketingCRM.jsx'],
    capabilities: ['Email automation', 'Lead nurturing', 'Workflow scheduling', 'Performance tracking'],
    nextMilestone: 'Add conditional logic to automations'
  },
  {
    name: 'AI Content Generation',
    category: 'AI',
    status: 'planned',
    description: 'Generate marketing copy, property descriptions, and social media posts using AI.',
    sourceFiles: ['OliviaMarketingCRM.jsx'],
    capabilities: ['Text generation', 'Image captions', 'SEO optimization', 'Multi-language support'],
    nextMilestone: 'Integrate OpenAI API'
  }
];
