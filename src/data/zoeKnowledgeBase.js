export const COMPANY_INFO = {
  name: 'White Caves Real Estate LLC',
  location: 'Dubai, UAE',
  licenseNumber: 'DED-123456',
  established: 2018,
  vision: 'To be the premier digital solution for luxury real estate in Dubai',
  mission: 'Leveraging advanced technology and AI to streamline operations and enhance user experience'
};

export const DEPARTMENTS = {
  EXEC: {
    id: 'EXEC',
    name: 'Executive Office',
    purpose: 'Strategic direction, major deal approvals, stakeholder relations',
    head: 'Managing Director',
    headName: 'Arslan Malik',
    assistant: 'Zara (Assistant Manager)',
    teamMembers: ['Managing Director', 'Zara', 'Executive Assistant'],
    contactEmail: 'executive@whitecaves.ae',
    internalPhone: 'Ext. 100',
    directReportsFrom: ['SALES', 'PROPMGMT', 'MARKETING', 'OPERATIONS', 'TECHNOLOGY'],
    keyResponsibilities: [
      'Final approval on transactions > 5M AED',
      'Investor relations',
      'Company strategy and vision',
      'Partnership agreements'
    ],
    aiAssistant: 'Zoe'
  },
  SALES: {
    id: 'SALES',
    name: 'Sales & Leasing Division',
    purpose: 'Revenue generation through property transactions',
    head: 'Director of Sales',
    headName: 'Tariq Al-Farsi',
    teams: [
      { name: 'Residential Sales', focus: 'Villas, Apartments, Penthouses', teamLead: 'Sarah Chen' },
      { name: 'Commercial Leasing', focus: 'Office, Retail, Warehouse', teamLead: 'James Wilson' },
      { name: 'Off-Plan & New Developments', focus: 'Pre-construction projects', teamLead: 'Rashid Al-Maktoum' }
    ],
    keyMetrics: ['Monthly closings', 'Pipeline value', 'Conversion rate', 'Average deal size'],
    contactEmail: 'sales@whitecaves.ae',
    internalPhone: 'Ext. 201',
    reportingTo: 'EXEC',
    aiAssistants: ['Clara', 'Linda', 'Nancy']
  },
  PROPMGMT: {
    id: 'PROPMGMT',
    name: 'Property Management Division',
    purpose: 'Maximizing owner ROI through professional property management',
    head: 'Head of Property Management',
    headName: 'Layla Hassan',
    portfolioManaged: '125+ properties',
    propertyTypes: ['Luxury Villas (Palm, Emirates Hills)', 'Premium Apartments (Downtown, Marina)', 'Commercial Towers (DIFC, Business Bay)'],
    teams: [
      { name: 'Client Relations', focus: 'Owner satisfaction, reporting' },
      { name: 'Operations', focus: 'Maintenance, facilities, 24/7 emergency' },
      { name: 'Tenant Management', focus: 'Screening, contracts, rent collection' }
    ],
    contactEmail: 'management@whitecaves.ae',
    emergencyPhone: '+971-55-123-4567',
    internalPhone: 'Ext. 301',
    reportingTo: 'EXEC',
    aiAssistants: ['Mary', 'Olivia']
  },
  MARKETING: {
    id: 'MARKETING',
    name: 'Marketing & Business Development',
    purpose: 'Brand building, lead generation, digital presence',
    head: 'Marketing Director',
    headName: 'Omar Khalid',
    channels: [
      { channel: 'Digital Marketing', platforms: ['Instagram', 'LinkedIn', 'Property Finder', 'Bayut'] },
      { channel: 'Partnerships', focus: 'Developers, Banks, Immigration Consultants' },
      { channel: 'Events & Sponsorships', focus: 'Property exhibitions, investor meetups' }
    ],
    contactEmail: 'marketing@whitecaves.ae',
    internalPhone: 'Ext. 401',
    reportingTo: 'EXEC',
    aiAssistants: ['Olivia', 'Sophia']
  },
  OPERATIONS: {
    id: 'OPERATIONS',
    name: 'Operations & Finance',
    purpose: 'Legal compliance, financial management, administrative support',
    head: 'Chief Financial Officer',
    headName: 'Fatima Al-Zahra',
    teams: [
      { name: 'Transaction Processing', focus: 'DLD procedures, Ejari, contract legalization' },
      { name: 'Finance & Accounting', focus: 'Invoicing, commissions, financial reporting' },
      { name: 'HR & Administration', focus: 'Staff management, office operations' }
    ],
    contactEmail: 'operations@whitecaves.ae',
    internalPhone: 'Ext. 501',
    reportingTo: 'EXEC',
    aiAssistants: ['Nina', 'Theodora']
  }
};

export const SERVICES = [
  {
    id: 'RES-SALE-001',
    category: 'Residential Transactions',
    name: 'Primary Market Sales (Off-Plan)',
    description: 'Assisting clients in purchasing directly from developers during pre-construction phase',
    targetClients: ['First-time buyers', 'Investors seeking capital growth'],
    keyFeatures: ['Early bird discounts access', 'Developer relationship benefits', 'Payment plan optimization'],
    typicalDuration: '3-24 months (until completion)',
    responsibleDepartment: 'SALES',
    responsibleTeam: 'Off-Plan & New Developments',
    processFlowRef: 'FLOW_OFFPLAN',
    successMetrics: ['Client ROI', 'Developer rebates secured']
  },
  {
    id: 'RES-SALE-002',
    category: 'Residential Transactions',
    name: 'Secondary Market Sales',
    description: 'Facilitating resale transactions for existing properties',
    targetClients: ['Property owners', 'Investors', 'End-users'],
    keyFeatures: ['Market valuation', 'Negotiation support', 'DLD transaction handling'],
    typicalDuration: '2-8 weeks',
    responsibleDepartment: 'SALES',
    responsibleTeam: 'Residential Sales',
    processFlowRef: 'FLOW_RESIDENTIAL_SALES',
    successMetrics: ['Sale price vs listing price', 'Time on market']
  },
  {
    id: 'RES-SALE-003',
    category: 'Residential Transactions',
    name: 'Luxury Villa & Penthouse Sales',
    description: 'Specialized service for high-net-worth individuals purchasing premium properties',
    targetClients: ['UHNWIs', 'Celebrities', 'Corporate executives'],
    keyFeatures: ['Discrete viewings', 'Negotiation expertise', 'Concierge closing services'],
    typicalDuration: '2-6 weeks',
    responsibleDepartment: 'SALES',
    responsibleTeam: 'Residential Sales',
    processFlowRef: 'FLOW_RESIDENTIAL_SALES',
    successMetrics: ['Sale price vs asking price', 'Client referrals']
  },
  {
    id: 'RES-LEASE-001',
    category: 'Residential Transactions',
    name: 'Long-term Residential Leasing',
    description: 'Finding and securing annual rental properties for tenants',
    targetClients: ['Families', 'Professionals', 'Expats'],
    keyFeatures: ['Extensive property portfolio', 'Tenant-landlord mediation', 'Ejari registration'],
    typicalDuration: '1-3 weeks',
    responsibleDepartment: 'SALES',
    responsibleTeam: 'Residential Sales',
    processFlowRef: 'FLOW_RESIDENTIAL_LEASE',
    successMetrics: ['Tenant satisfaction', 'Lease completion rate']
  },
  {
    id: 'RES-LEASE-002',
    category: 'Residential Transactions',
    name: 'Short-term/Holiday Home Management',
    description: 'Managing properties for vacation rentals and short-term stays',
    targetClients: ['Property investors', 'Holiday home owners'],
    keyFeatures: ['Dynamic pricing', 'Guest management', 'Cleaning coordination'],
    typicalDuration: 'Ongoing service',
    responsibleDepartment: 'PROPMGMT',
    responsibleTeam: 'Operations',
    processFlowRef: 'FLOW_SHORT_TERM',
    successMetrics: ['Occupancy rate', 'Guest reviews']
  },
  {
    id: 'COMM-LEASE-001',
    category: 'Commercial Real Estate',
    name: 'Office Space Leasing',
    description: 'Helping businesses find and secure optimal office spaces in Dubai business districts',
    targetClients: ['MNCs setting up regional HQ', 'Growing startups', 'Professional services firms'],
    keyFeatures: ['Market rate analysis', 'Layout optimization advice', 'Fit-out coordination'],
    typicalDuration: '4-8 weeks',
    responsibleDepartment: 'SALES',
    responsibleTeam: 'Commercial Leasing',
    processFlowRef: 'FLOW_COMMERCIAL_LEASE',
    successMetrics: ['Lease term secured', 'Square foot rate negotiated']
  },
  {
    id: 'COMM-LEASE-002',
    category: 'Commercial Real Estate',
    name: 'Retail Unit Acquisition',
    description: 'Securing prime retail locations for businesses',
    targetClients: ['Retail chains', 'F&B operators', 'Boutique brands'],
    keyFeatures: ['Footfall analysis', 'Competition mapping', 'Lease negotiation'],
    typicalDuration: '4-12 weeks',
    responsibleDepartment: 'SALES',
    responsibleTeam: 'Commercial Leasing',
    processFlowRef: 'FLOW_COMMERCIAL_LEASE',
    successMetrics: ['Location quality', 'Rental terms']
  },
  {
    id: 'COMM-LEASE-003',
    category: 'Commercial Real Estate',
    name: 'Warehouse & Industrial Leasing',
    description: 'Finding logistics and industrial spaces for businesses',
    targetClients: ['E-commerce companies', 'Manufacturers', 'Logistics providers'],
    keyFeatures: ['Access route analysis', 'Loading capacity assessment', 'Utility verification'],
    typicalDuration: '2-6 weeks',
    responsibleDepartment: 'SALES',
    responsibleTeam: 'Commercial Leasing',
    processFlowRef: 'FLOW_COMMERCIAL_LEASE',
    successMetrics: ['Space efficiency', 'Cost per sqft']
  },
  {
    id: 'PM-001',
    category: 'Property Management',
    name: 'Full-Service Property Management',
    description: 'End-to-end management of investment properties including tenant placement, maintenance, and financial reporting',
    targetClients: ['Absentee owners', 'International investors', 'Portfolio owners'],
    keyFeatures: ['Monthly digital reporting', 'Pre-vetted contractor network', 'Rental yield optimization'],
    typicalDuration: 'Ongoing (minimum 1-year contract)',
    responsibleDepartment: 'PROPMGMT',
    responsibleTeam: 'Client Relations & Operations',
    processFlowRef: 'FLOW_PROPERTY_MANAGEMENT',
    successMetrics: ['Owner retention rate', 'Tenant occupancy rate', 'Maintenance response time']
  },
  {
    id: 'PM-002',
    category: 'Property Management',
    name: 'Tenant Screening & Placement',
    description: 'Thorough vetting and placement of qualified tenants',
    targetClients: ['Property owners', 'Landlords'],
    keyFeatures: ['Background checks', 'Employment verification', 'Reference checks'],
    typicalDuration: '1-2 weeks',
    responsibleDepartment: 'PROPMGMT',
    responsibleTeam: 'Tenant Management',
    processFlowRef: 'FLOW_TENANT_SCREENING',
    successMetrics: ['Tenant quality score', 'Placement speed']
  },
  {
    id: 'PM-003',
    category: 'Property Management',
    name: 'Maintenance & Facility Management',
    description: '24/7 property maintenance and facility management services',
    targetClients: ['Property owners', 'Building managers'],
    keyFeatures: ['Emergency response', 'Preventive maintenance', 'Vendor management'],
    typicalDuration: 'Ongoing service',
    responsibleDepartment: 'PROPMGMT',
    responsibleTeam: 'Operations',
    processFlowRef: 'FLOW_MAINTENANCE',
    successMetrics: ['Response time', 'Resolution rate', 'Cost efficiency']
  },
  {
    id: 'PM-004',
    category: 'Property Management',
    name: 'Rental Collection & Disbursement',
    description: 'Professional rent collection and owner payment services',
    targetClients: ['Property owners', 'Portfolio investors'],
    keyFeatures: ['Automated collection', 'Late payment follow-up', 'Owner disbursement'],
    typicalDuration: 'Monthly cycle',
    responsibleDepartment: 'PROPMGMT',
    responsibleTeam: 'Client Relations',
    processFlowRef: 'FLOW_RENT_COLLECTION',
    successMetrics: ['Collection rate', 'Days to collection']
  },
  {
    id: 'PM-005',
    category: 'Property Management',
    name: 'Financial Reporting for Owners',
    description: 'Comprehensive financial reports and analytics for property owners',
    targetClients: ['Property owners', 'Investment funds'],
    keyFeatures: ['Monthly statements', 'Annual summaries', 'Tax documentation'],
    typicalDuration: 'Monthly/Annual',
    responsibleDepartment: 'PROPMGMT',
    responsibleTeam: 'Client Relations',
    processFlowRef: 'FLOW_FINANCIAL_REPORTING',
    successMetrics: ['Report accuracy', 'Delivery timeliness']
  },
  {
    id: 'PREMIUM-001',
    category: 'Premium Services',
    name: 'Real Estate Investment Consultation',
    description: 'Strategic advisory for building and optimizing real estate portfolios in Dubai',
    targetClients: ['Family offices', 'Institutional investors', 'High-net-worth individuals'],
    keyFeatures: ['Personalized market analysis', 'Tax efficiency planning', 'Exit strategy development'],
    typicalDuration: '1-3 months engagement',
    responsibleDepartment: 'EXEC',
    responsibleTeam: 'Executive Office with Sales support',
    processFlowRef: 'FLOW_INVESTMENT_CONSULTATION',
    successMetrics: ['Portfolio diversification achieved', 'Target ROI met']
  },
  {
    id: 'PREMIUM-002',
    category: 'Premium Services',
    name: 'Portfolio Diversification Strategy',
    description: 'Strategic planning for real estate portfolio optimization',
    targetClients: ['Portfolio owners', 'Investment funds'],
    keyFeatures: ['Risk assessment', 'Asset allocation', 'Market timing advice'],
    typicalDuration: '2-4 weeks',
    responsibleDepartment: 'EXEC',
    responsibleTeam: 'Executive Office',
    processFlowRef: 'FLOW_PORTFOLIO_STRATEGY',
    successMetrics: ['Risk reduction', 'Return optimization']
  },
  {
    id: 'PREMIUM-003',
    category: 'Premium Services',
    name: 'Market Entry Advisory for International Investors',
    description: 'Comprehensive guidance for foreign investors entering Dubai real estate market',
    targetClients: ['International investors', 'Foreign nationals'],
    keyFeatures: ['Legal framework guidance', 'Banking setup', 'Visa consultation'],
    typicalDuration: '2-6 weeks',
    responsibleDepartment: 'EXEC',
    responsibleTeam: 'Executive Office',
    processFlowRef: 'FLOW_MARKET_ENTRY',
    successMetrics: ['Successful market entry', 'Investment deployed']
  },
  {
    id: 'PREMIUM-004',
    category: 'Premium Services',
    name: 'DLD/RERA Transaction Facilitation',
    description: 'Complete handling of Dubai Land Department and RERA procedures',
    targetClients: ['Buyers', 'Sellers', 'Developers'],
    keyFeatures: ['Document preparation', 'Fee calculation', 'Submission handling'],
    typicalDuration: '1-2 weeks',
    responsibleDepartment: 'OPERATIONS',
    responsibleTeam: 'Transaction Processing',
    processFlowRef: 'FLOW_DLD_TRANSACTION',
    successMetrics: ['Processing time', 'First-time approval rate']
  }
];

export const SERVICE_FLOWS = {
  FLOW_RESIDENTIAL_SALES: {
    id: 'FLOW_RESIDENTIAL_SALES',
    name: 'Residential Sales Journey',
    steps: [
      { step: 1, title: 'Initial Client Consultation', description: 'Understanding client needs, budget, and preferences', duration: '1-2 hours', responsible: 'Sales Agent' },
      { step: 2, title: 'Needs Assessment & Budget Finalization', description: 'Detailed requirement gathering and financial qualification', duration: '1-3 days', responsible: 'Sales Agent' },
      { step: 3, title: 'Property Shortlisting & Viewing', description: 'Curating properties and scheduling virtual/physical viewings', duration: '1-2 weeks', responsible: 'Sales Agent' },
      { step: 4, title: 'Offer Submission & Price Negotiation', description: 'Preparing and submitting offers, negotiating terms', duration: '2-5 days', responsible: 'Sales Agent + Team Lead' },
      { step: 5, title: 'MOU Signing', description: 'Memorandum of Understanding preparation and signing', duration: '1-2 days', responsible: 'Legal Team' },
      { step: 6, title: 'Due Diligence & Title Deed Verification', description: 'Property verification and legal checks', duration: '3-7 days', responsible: 'Legal Team' },
      { step: 7, title: 'Sales Agreement Preparation & Signing', description: 'Final contract preparation and execution', duration: '2-3 days', responsible: 'Legal Team' },
      { step: 8, title: 'DLD Transaction Processing', description: 'Transfer at Dubai Land Department', duration: '1-2 days', responsible: 'Operations Team' },
      { step: 9, title: 'Key Handover & Post-Sale Service', description: 'Property handover and aftercare initiation', duration: '1 day', responsible: 'Sales Agent' }
    ]
  },
  FLOW_PROPERTY_MANAGEMENT: {
    id: 'FLOW_PROPERTY_MANAGEMENT',
    name: 'Property Management Journey',
    steps: [
      { step: 1, title: 'Owner Onboarding & Agreement Signing', description: 'Initial meeting, service explanation, contract signing', duration: '1-2 days', responsible: 'Client Relations' },
      { step: 2, title: 'Property Valuation & Rental Assessment', description: 'Market analysis and rental price determination', duration: '2-3 days', responsible: 'Valuation Team' },
      { step: 3, title: 'Marketing & Tenant Screening', description: 'Property listing and qualified tenant search', duration: '1-4 weeks', responsible: 'Marketing + Tenant Management' },
      { step: 4, title: 'Lease Agreement & Ejari Registration', description: 'Contract preparation and official registration', duration: '2-3 days', responsible: 'Legal Team' },
      { step: 5, title: 'Security Deposit Collection & Handover', description: 'Deposit handling and property handover to tenant', duration: '1 day', responsible: 'Operations' },
      { step: 6, title: 'Monthly Rent Collection & Owner Disbursement', description: 'Ongoing rent collection and payment to owner', duration: 'Monthly', responsible: 'Finance Team' },
      { step: 7, title: 'Maintenance Request Management', description: 'Handling and coordinating all maintenance issues', duration: 'Ongoing', responsible: 'Operations' },
      { step: 8, title: 'Quarterly Property Inspection', description: 'Regular property condition assessments', duration: 'Quarterly', responsible: 'Operations' },
      { step: 9, title: 'Annual Contract Renewal/Exit Process', description: 'Lease renewal negotiations or move-out handling', duration: '2-4 weeks', responsible: 'Client Relations' }
    ]
  },
  FLOW_INVESTMENT_CONSULTATION: {
    id: 'FLOW_INVESTMENT_CONSULTATION',
    name: 'Investment Consultation Journey',
    steps: [
      { step: 1, title: 'Investor Profile & Risk Assessment', description: 'Understanding investment goals and risk tolerance', duration: '1-2 meetings', responsible: 'Executive Team' },
      { step: 2, title: 'Market Opportunity Analysis', description: 'Deep dive into current market conditions and opportunities', duration: '1 week', responsible: 'Research Team' },
      { step: 3, title: 'Portfolio Strategy Development', description: 'Creating customized investment strategy', duration: '1-2 weeks', responsible: 'Executive Team' },
      { step: 4, title: 'Property Sourcing & Financial Modeling', description: 'Identifying properties and projecting returns', duration: '2-4 weeks', responsible: 'Sales + Finance' },
      { step: 5, title: 'Legal & Regulatory Compliance Check', description: 'Ensuring all legal requirements are met', duration: '1 week', responsible: 'Legal Team' },
      { step: 6, title: 'Transaction Execution Support', description: 'Facilitating property acquisition', duration: '2-4 weeks', responsible: 'Sales Team' },
      { step: 7, title: 'Post-Investment Performance Monitoring', description: 'Ongoing portfolio tracking and reporting', duration: 'Ongoing', responsible: 'Client Relations' }
    ]
  }
};

export const getServicesByDepartment = (departmentId) => {
  return SERVICES.filter(s => s.responsibleDepartment === departmentId);
};

export const getServicesByCategory = (category) => {
  return SERVICES.filter(s => s.category === category);
};

export const getDepartmentByService = (serviceId) => {
  const service = SERVICES.find(s => s.id === serviceId);
  if (service) {
    return DEPARTMENTS[service.responsibleDepartment];
  }
  return null;
};

export const searchKnowledgeBase = (query) => {
  const lowerQuery = query.toLowerCase();
  const results = {
    departments: [],
    services: [],
    flows: [],
    contacts: []
  };

  Object.values(DEPARTMENTS).forEach(dept => {
    const searchText = `${dept.name} ${dept.purpose} ${dept.headName} ${dept.head}`.toLowerCase();
    if (searchText.includes(lowerQuery)) {
      results.departments.push(dept);
    }
  });

  SERVICES.forEach(service => {
    const searchText = `${service.name} ${service.description} ${service.category}`.toLowerCase();
    if (searchText.includes(lowerQuery)) {
      results.services.push(service);
    }
  });

  Object.values(SERVICE_FLOWS).forEach(flow => {
    const searchText = `${flow.name} ${flow.steps.map(s => s.title).join(' ')}`.toLowerCase();
    if (searchText.includes(lowerQuery)) {
      results.flows.push(flow);
    }
  });

  return results;
};

export default {
  COMPANY_INFO,
  DEPARTMENTS,
  SERVICES,
  SERVICE_FLOWS,
  getServicesByDepartment,
  getServicesByCategory,
  getDepartmentByService,
  searchKnowledgeBase
};
