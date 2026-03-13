/**
 * Clara Leads CRM Features and Capabilities
 * Demonstrates the full power of Clara AI for lead management
 */

export interface ClaraFeatureDemoData {
  [key: string]: unknown;
}

export interface ClaraFeature {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  usage: string;
  icon: string;
  demoData: ClaraFeatureDemoData;
}

export const CLARA_FEATURES: ClaraFeature[] = [
  {
    id: 'feature001',
    name: 'Lead Scoring',
    category: 'intelligence',
    description: 'Automatic lead scoring based on engagement, company fit, and behavior',
    benefits: [
      'Prioritize high-value prospects automatically',
      'Identify patterns in your best customers',
      'Reduce time to close with focused targeting'
    ],
    usage: 'Available for all leads with engagement history',
    icon: '⭐',
    demoData: {
      exampleLead: 'Acme Corporation',
      currentScore: 85,
      factors: ['Email engagement', 'Demo attendance', 'Budget aligned', 'Timeline ready']
    }
  },

  {
    id: 'feature002',
    name: 'Activity Insights',
    category: 'analytics',
    description: 'Comprehensive tracking of all lead interactions and communications',
    benefits: [
      'Never miss a follow-up opportunity',
      'Track engagement across email, calls, and meetings',
      'Understand customer journey and touchpoints'
    ],
    usage: 'Automatically logs all interactions',
    icon: '📊',
    demoData: {
      totalActivities: 1247,
      thisMonth: 342,
      byType: {
        emails: 125,
        calls: 89,
        meetings: 23,
        interactions: 105
      }
    }
  },

  {
    id: 'feature003',
    name: 'Next Best Action',
    category: 'automation',
    description: 'AI-powered recommendations for the next step in each customer relationship',
    benefits: [
      'Optimize sales workflow with smart recommendations',
      'Reduce decision fatigue with clear action paths',
      'Increase close rates with timely interventions'
    ],
    usage: 'Updated daily based on lead status',
    icon: '🎯',
    demoData: {
      recommendations: [
        'Send proposal follow-up',
        'Schedule discovery call',
        'Attend executive meeting',
        'Customer success onboarding'
      ],
      successRate: '78%'
    }
  },

  {
    id: 'feature004',
    name: 'Deal Forecasting',
    category: 'prediction',
    description: 'Predict deal closure likelihood and expected revenue impact',
    benefits: [
      'Forecast pipeline accurately month-over-month',
      'Identify at-risk deals early',
      'Plan revenue with confidence'
    ],
    usage: 'Based on historical patterns and current stage',
    icon: '🔮',
    demoData: {
      forecastAccuracy: '92%',
      expectedRevenue: '$745,000',
      closeProbability: '76%',
      daysToClose: '34'
    }
  },

  {
    id: 'feature005',
    name: 'Company Intelligence',
    category: 'research',
    description: 'Deep insights into prospective and existing customer organizations',
    benefits: [
      'Understand company size, growth, and leadership',
      'Research market trends and industry news',
      'Tailor pitches based on company specifics'
    ],
    usage: 'Available for all mapped company contacts',
    icon: '🏢',
    demoData: {
      insights: [
        'Enterprise technology company',
        'Revenue: $2.5M - $10M',
        'Employees: 150-500',
        'Recent funding or growth reported'
      ]
    }
  },

  {
    id: 'feature006',
    name: 'Email Intelligence',
    category: 'communication',
    description: 'Smart analysis of email engagement and communication patterns',
    benefits: [
      'Optimize email timing and content',
      'Identify engagement trends',
      'Personalize outreach automatically'
    ],
    usage: 'Analyzes all sent and received emails',
    icon: '✉️',
    demoData: {
      openRate: '68%',
      clickRate: '39%',
      responseRate: '56%',
      bestSendTime: 'Tuesday 10:00 AM'
    }
  },

  {
    id: 'feature007',
    name: 'Meeting Analytics',
    category: 'engagement',
    description: 'Insights from scheduled calls and meetings with prospects',
    benefits: [
      'Review meeting summaries and action items',
      'Track meeting outcomes and next steps',
      'Improve sales call performance'
    ],
    usage: 'Integrates with calendar and video platforms',
    icon: '📞',
    demoData: {
      totalMeetings: 89,
      avgDuration: '32 minutes',
      noShowRate: '8%',
      successRate: '67%'
    }
  },

  {
    id: 'feature008',
    name: 'Task Automation',
    category: 'workflow',
    description: 'Automatically create and prioritize sales tasks based on lead behavior',
    benefits: [
      'Reduce manual data entry and task creation',
      'Ensure no lead falls through the cracks',
      'Focus your team on high-value activities'
    ],
    usage: 'Runs continuously, adapts to your workflow',
    icon: '⚙️',
    demoData: {
      tasksCreated: 342,
      completionRate: '89%',
      avgTimePerTask: '6 minutes',
      timeSavedPerWeek: '14 hours'
    }
  },

  {
    id: 'feature009',
    name: 'Competitor Alerts',
    category: 'intelligence',
    description: 'Get notified when prospects mention competitors or industry trends',
    benefits: [
      'Stay ahead of competitive threats',
      'Identify change initiatives and buying signals',
      'Time outreach perfectly with market movements'
    ],
    usage: 'Monitors emails, calls, and web activity',
    icon: '🚀',
    demoData: {
      alertsThisMonth: 23,
      actionableInsights: 18,
      competitorsTracked: 12
    }
  },

  {
    id: 'feature010',
    name: 'Churn Prediction',
    category: 'retention',
    description: 'Identify at-risk customers before they leave',
    benefits: [
      'Proactively retain high-value customers',
      'Allocate customer success resources strategically',
      'Improve lifetime customer value'
    ],
    usage: 'Continuous monitoring of customer health',
    icon: '⚠️',
    demoData: {
      riskAssessments: 287,
      interventsPerWeek: 5,
      retentionImprovement: '23%'
    }
  },

  {
    id: 'feature011',
    name: 'Sales Plays',
    category: 'templates',
    description: 'Playbooks and templates pre-configured for your sales process',
    benefits: [
      'Share best practices across your sales team',
      'Standardize your sales methodology',
      'Reduce time to productivity for new hires'
    ],
    usage: 'Customizable for your business model',
    icon: '📖',
    demoData: {
      playsAvailable: 34,
      mostUsed: 'Enterprise sales play',
      usageRate: '76%'
    }
  },

  {
    id: 'feature012',
    name: 'Territory Management',
    category: 'organization',
    description: 'Intelligently assign leads and accounts to your sales team',
    benefits: [
      'Balance workload across your team',
      'Optimize account coverage',
      'Reduce conflicts and improve collaboration'
    ],
    usage: 'Rules-based or AI-powered assignment',
    icon: '🗺️',
    demoData: {
      territories: 8,
      teamsManaged: 3,
      leadsAssigned: 287,
      avgLeadsPerRep: '36'
    }
  }
];

/**
 * Get feature by ID
 */
export function getFeatureById(id: string): ClaraFeature | undefined {
  return CLARA_FEATURES.find(f => f.id === id);
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(category: string): ClaraFeature[] {
  return CLARA_FEATURES.filter(f => f.category === category);
}

/**
 * Get all feature categories
 */
export function getFeatureCategories(): string[] {
  const categories = [...new Set(CLARA_FEATURES.map(f => f.category))];
  return categories.sort();
}

/**
 * Search features
 */
export function searchFeatures(query: string): ClaraFeature[] {
  const lowerQuery = query.toLowerCase();
  return CLARA_FEATURES.filter(f =>
    f.name.toLowerCase().includes(lowerQuery) ||
    f.description.toLowerCase().includes(lowerQuery) ||
    f.benefits.some(b => b.toLowerCase().includes(lowerQuery)) ||
    f.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get feature usage stats
 */
export function getFeatureStats() {
  return {
    totalFeatures: CLARA_FEATURES.length,
    totalCategories: getFeatureCategories().length,
    categories: getFeatureCategories().reduce((acc: Record<string, number>, cat) => {
      acc[cat] = getFeaturesByCategory(cat).length;
      return acc;
    }, {})
  };
}

/**
 * Get top features
 */
export function getTopFeatures(count: number = 5): ClaraFeature[] {
  return CLARA_FEATURES.slice(0, count);
}

/**
 * Get recommended features based on business type
 */
export function getRecommendedFeatures(businessType: string = 'startup'): ClaraFeature[] {
  const recommendations: Record<string, string[]> = {
    startup: ['feature001', 'feature003', 'feature004', 'feature008', 'feature011'],
    sme: ['feature001', 'feature002', 'feature003', 'feature005', 'feature007', 'feature011'],
    enterprise: ['feature001', 'feature002', 'feature003', 'feature004', 'feature005', 'feature006', 'feature007', 'feature009', 'feature010', 'feature012']
  };

  const ids = recommendations[businessType] || recommendations.startup;
  return ids.map(id => getFeatureById(id)).filter(Boolean);
}

export default CLARA_FEATURES;
