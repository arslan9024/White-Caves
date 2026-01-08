export const BUSINESS_MODEL_CONFIG = {
  company: {
    name: 'White Caves Real Estate LLC',
    tagline: 'Luxury Living in Dubai',
    license: 'DED-123456',
    rera: 'ORN-12345',
    established: 2020,
    headquarters: {
      address: 'Level 15, The Opus Tower',
      area: 'Business Bay',
      city: 'Dubai',
      country: 'UAE'
    }
  },

  aiAssistantEcosystem: {
    description: 'Integrated AI-powered CRM ecosystem for comprehensive real estate operations',
    assistants: {
      linda: {
        name: 'Linda',
        role: 'WhatsApp CRM Manager',
        primaryFunction: 'Customer engagement and lead capture via WhatsApp',
        kpis: ['Response Time', 'Lead Score Accuracy', 'Conversation Conversion Rate'],
        integrations: ['WhatsApp Business API', 'Clara Leads CRM'],
        ownerOnly: true
      },
      mary: {
        name: 'Mary',
        role: 'Inventory CRM Manager',
        primaryFunction: 'Property inventory management and data acquisition',
        kpis: ['Data Accuracy', 'Asset Coverage', 'Update Frequency'],
        integrations: ['DAMAC S3 Assets', 'Property Database'],
        ownerOnly: true
      },
      clara: {
        name: 'Clara',
        role: 'Leads CRM Manager',
        primaryFunction: 'Lead pipeline management and conversion tracking',
        kpis: ['Conversion Rate', 'Pipeline Value', 'Lead Response Time'],
        integrations: ['Linda WhatsApp', 'Mary Inventory', 'Email Marketing'],
        ownerOnly: true
      },
      nina: {
        name: 'Nina',
        role: 'WhatsApp Bot Developer',
        primaryFunction: 'Automated bot management for 24/7 customer engagement',
        kpis: ['Automation Rate', 'Bot Uptime', 'Query Resolution Rate'],
        integrations: ['WhatsApp API', 'Linda CRM'],
        ownerOnly: true
      },
      nancy: {
        name: 'Nancy',
        role: 'HR Manager',
        primaryFunction: 'Employee management and recruitment automation',
        kpis: ['Time to Hire', 'Employee Satisfaction', 'Retention Rate'],
        integrations: ['Job Portals', 'Payroll System'],
        ownerOnly: true
      }
    }
  },

  featureMapping: {
    leadCapture: {
      flow: ['WhatsApp Message', 'Linda Processing', 'Lead Creation in Clara', 'Agent Assignment'],
      automation: 'semi-automatic',
      timeToComplete: '< 5 minutes'
    },
    propertyMatching: {
      flow: ['Lead Requirements', 'Clara Analysis', 'Mary Inventory Query', 'Property Suggestions'],
      automation: 'ai-powered',
      timeToComplete: '< 1 minute'
    },
    viewingSchedule: {
      flow: ['Client Request', 'Nina Bot', 'Calendar Check', 'Confirmation'],
      automation: 'fully-automatic',
      timeToComplete: '< 30 seconds'
    },
    salesClosure: {
      flow: ['Negotiation', 'Clara Tracking', 'Document Prep', 'Transaction Complete'],
      automation: 'manual',
      timeToComplete: 'Variable'
    }
  },

  revenueStreams: [
    {
      id: 'property_sales',
      name: 'Property Sales Commission',
      description: 'Commission on successful property sales',
      rate: '2-3% of sale value',
      target: 'AED 50M/month',
      aiSupport: ['clara', 'mary', 'linda']
    },
    {
      id: 'leasing',
      name: 'Leasing Commission',
      description: 'Commission on rental agreements',
      rate: '5% of annual rent',
      target: 'AED 2.5M/month',
      aiSupport: ['clara', 'linda']
    },
    {
      id: 'property_management',
      name: 'Property Management',
      description: 'Ongoing property management services',
      rate: '8% of monthly rent',
      target: 'AED 500K/month',
      aiSupport: ['mary']
    },
    {
      id: 'consulting',
      name: 'Investment Consulting',
      description: 'Real estate investment advisory',
      rate: 'Fixed fee per engagement',
      target: 'AED 200K/month',
      aiSupport: ['clara', 'mary']
    }
  ],

  operationalMetrics: {
    customerAcquisition: {
      leadSources: ['WhatsApp', 'Website', 'Referral', 'Property Portals', 'Exhibitions'],
      conversionFunnel: {
        inquiry: 100,
        qualified: 45,
        viewing: 25,
        negotiation: 12,
        closed: 8
      }
    },
    inventory: {
      totalUnits: 9378,
      focus: 'DAMAC Hills 2 (Akoya Oxygen)',
      dataFields: 25,
      updateFrequency: 'Real-time'
    },
    team: {
      totalEmployees: 24,
      departments: ['Sales', 'Leasing', 'Marketing', 'Support', 'Operations'],
      avgPerformance: 88
    }
  },

  accessControl: {
    ownerExclusive: [
      'AI Assistant Hub',
      'All CRM Systems (Linda, Mary, Clara, Nina, Nancy)',
      'Business Analytics Dashboard',
      'Employee Performance Data',
      'Financial Reports',
      'System Settings'
    ],
    managerAccess: [
      'Team Performance',
      'Lead Assignment',
      'Inventory View',
      'Basic Reports'
    ],
    agentAccess: [
      'Assigned Leads',
      'Property Catalog',
      'Personal Performance'
    ]
  }
};

export const getAssistantConfig = (assistantId) => {
  return BUSINESS_MODEL_CONFIG.aiAssistantEcosystem.assistants[assistantId] || null;
};

export const getRevenueStream = (streamId) => {
  return BUSINESS_MODEL_CONFIG.revenueStreams.find(s => s.id === streamId) || null;
};

export const isOwnerOnlyFeature = (featureName) => {
  return BUSINESS_MODEL_CONFIG.accessControl.ownerExclusive.includes(featureName);
};

export default BUSINESS_MODEL_CONFIG;
