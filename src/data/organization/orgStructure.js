export const EXECUTIVES = [
  {
    id: 'exec-1',
    name: 'Arslan Malik',
    role: 'CEO & Founder',
    email: 'arslan@whitecaves.ae',
    phone: '+971501000001',
    avatar: '👨‍💼',
    photo: 'https://i.pravatar.cc/150?img=68',
    status: 'available',
    department: 'executive',
    assignedAssistants: ['zoe'],
    bio: 'Visionary leader with 20+ years in Dubai real estate. Founded White Caves to revolutionize luxury property experiences.',
    reportsTo: null,
    directReports: ['exec-2', 'exec-3', 'exec-4', 'dir-1', 'dir-2', 'dir-3', 'dir-4', 'dir-5', 'dir-6', 'dir-7', 'dir-8', 'dir-9', 'dir-10']
  },
  {
    id: 'exec-2',
    name: 'Fatima Hassan',
    role: 'Chief Operating Officer',
    email: 'fatima@whitecaves.ae',
    phone: '+971501000002',
    avatar: '👩‍💼',
    photo: 'https://i.pravatar.cc/150?img=47',
    status: 'in_meeting',
    department: 'executive',
    assignedAssistants: ['mary', 'nancy', 'sentinel', 'vesta', 'juno'],
    bio: 'Operations expert ensuring seamless property management and team coordination across all departments.',
    reportsTo: 'exec-1',
    directReports: ['dir-2', 'dir-10']
  },
  {
    id: 'exec-3',
    name: 'Ahmed Al Rashid',
    role: 'Chief Financial Officer',
    email: 'ahmed@whitecaves.ae',
    phone: '+971501000003',
    avatar: '👨‍💻',
    photo: 'https://i.pravatar.cc/150?img=60',
    status: 'available',
    department: 'executive',
    assignedAssistants: ['theodora', 'maven'],
    bio: 'Financial strategist managing AED 500M+ in annual transactions with expertise in real estate investments.',
    reportsTo: 'exec-1',
    directReports: ['dir-4']
  },
  {
    id: 'exec-4',
    name: 'Sarah Al Maktoum',
    role: 'Chief Marketing Officer',
    email: 'sarah@whitecaves.ae',
    phone: '+971501000004',
    avatar: '👩‍💻',
    photo: 'https://i.pravatar.cc/150?img=44',
    status: 'busy',
    department: 'executive',
    assignedAssistants: ['olivia'],
    bio: 'Marketing visionary driving brand presence across Dubai with innovative digital strategies.',
    reportsTo: 'exec-1',
    directReports: ['dir-5']
  }
];

export const DIRECTORS = [
  {
    id: 'dir-1',
    name: 'Khalid Al Mansoori',
    role: 'Director of Communications',
    email: 'khalid@whitecaves.ae',
    phone: '+971502000001',
    avatar: '👨‍💼',
    photo: 'https://i.pravatar.cc/150?img=53',
    status: 'active',
    department: 'communications',
    assignedAssistants: ['linda', 'nina'],
    bio: 'Leads all customer communications including WhatsApp Business operations with 23+ agent network.',
    reportsTo: 'exec-1',
    teamSize: 25
  },
  {
    id: 'dir-2',
    name: 'Omar Siddiqui',
    role: 'Director of Operations',
    email: 'omar@whitecaves.ae',
    phone: '+971502000002',
    avatar: '👨‍💼',
    photo: 'https://i.pravatar.cc/150?img=52',
    status: 'active',
    department: 'operations',
    assignedAssistants: ['mary', 'sentinel', 'vesta', 'juno'],
    bio: 'Oversees inventory management, property maintenance, and facility operations for 9,378+ units.',
    reportsTo: 'exec-2',
    teamSize: 18
  },
  {
    id: 'dir-3',
    name: 'Rashid Al Futtaim',
    role: 'Director of Sales',
    email: 'rashid@whitecaves.ae',
    phone: '+971502000003',
    avatar: '👨‍💼',
    photo: 'https://i.pravatar.cc/150?img=59',
    status: 'active',
    department: 'sales',
    assignedAssistants: ['sophia', 'clara', 'hunter', 'kairos'],
    bio: 'Drives AED 600M annual sales target with a team of elite property consultants.',
    reportsTo: 'exec-1',
    teamSize: 32
  },
  {
    id: 'dir-4',
    name: 'Hana Al Zaabi',
    role: 'Director of Finance',
    email: 'hana@whitecaves.ae',
    phone: '+971502000004',
    avatar: '👩‍💼',
    photo: 'https://i.pravatar.cc/150?img=45',
    status: 'active',
    department: 'finance',
    assignedAssistants: ['theodora', 'maven'],
    bio: 'Manages all financial operations, payment processing, and investment advisory services.',
    reportsTo: 'exec-3',
    teamSize: 8
  },
  {
    id: 'dir-5',
    name: 'Layla Al Suwaidi',
    role: 'Director of Marketing',
    email: 'layla@whitecaves.ae',
    phone: '+971502000005',
    avatar: '👩‍💼',
    photo: 'https://i.pravatar.cc/150?img=43',
    status: 'active',
    department: 'marketing',
    assignedAssistants: ['olivia'],
    bio: 'Leads marketing campaigns, property listings, and multi-portal publishing strategies.',
    reportsTo: 'exec-4',
    teamSize: 12
  },
  {
    id: 'dir-6',
    name: 'Nadia Ibrahim',
    role: 'Director of Compliance',
    email: 'nadia@whitecaves.ae',
    phone: '+971502000006',
    avatar: '👩‍💼',
    photo: 'https://i.pravatar.cc/150?img=48',
    status: 'active',
    department: 'compliance',
    assignedAssistants: ['laila'],
    bio: 'Ensures RERA compliance, KYC verification, and AML monitoring across all transactions.',
    reportsTo: 'exec-1',
    teamSize: 5
  },
  {
    id: 'dir-7',
    name: 'Tariq Al Qasimi',
    role: 'Director of Technology',
    email: 'tariq@whitecaves.ae',
    phone: '+971502000007',
    avatar: '👨‍💻',
    photo: 'https://i.pravatar.cc/150?img=57',
    status: 'active',
    department: 'technology',
    assignedAssistants: ['aurora', 'hazel', 'willow', 'henry'],
    bio: 'Leads technology strategy, AI assistant development, and platform architecture.',
    reportsTo: 'exec-1',
    teamSize: 15
  },
  {
    id: 'dir-8',
    name: 'Yusuf Al Ghurair',
    role: 'Director of Intelligence',
    email: 'yusuf@whitecaves.ae',
    phone: '+971502000008',
    avatar: '👨‍💼',
    photo: 'https://i.pravatar.cc/150?img=51',
    status: 'active',
    department: 'intelligence',
    assignedAssistants: ['cipher', 'atlas'],
    bio: 'Leads market research, competitor analysis, and off-plan project tracking.',
    reportsTo: 'exec-1',
    teamSize: 6
  },
  {
    id: 'dir-9',
    name: 'Aisha Al Ketbi',
    role: 'Director of Legal',
    email: 'aisha@whitecaves.ae',
    phone: '+971502000009',
    avatar: '👩‍💼',
    photo: 'https://i.pravatar.cc/150?img=49',
    status: 'active',
    department: 'legal',
    assignedAssistants: ['evangeline'],
    bio: 'Manages all legal contracts, dispute resolution, and regulatory matters.',
    reportsTo: 'exec-1',
    teamSize: 4
  },
  {
    id: 'dir-10',
    name: 'Mariam Al Nahyan',
    role: 'Director of HR & Admin',
    email: 'mariam@whitecaves.ae',
    phone: '+971502000010',
    avatar: '👩‍💼',
    photo: 'https://i.pravatar.cc/150?img=46',
    status: 'active',
    department: 'operations',
    assignedAssistants: ['nancy'],
    bio: 'Leads human resources, recruitment, and administrative operations.',
    reportsTo: 'exec-2',
    teamSize: 7
  }
];

export const DEPARTMENTS_CONFIG = {
  communications: {
    id: 'communications',
    name: 'Communications',
    description: 'Customer messaging, WhatsApp operations, and chatbot management',
    director: 'dir-1',
    assistants: ['linda', 'nina'],
    color: '#25D366',
    icon: 'MessageSquare',
    kpis: {
      activeConversations: 156,
      responseTime: '2.3 min',
      satisfactionScore: 94,
      leadsGenerated: 47
    }
  },
  operations: {
    id: 'operations',
    name: 'Operations',
    description: 'Inventory management, maintenance, and facility coordination',
    director: 'dir-2',
    assistants: ['mary', 'sentinel', 'vesta', 'juno'],
    color: '#3B82F6',
    icon: 'Building2',
    kpis: {
      propertiesManaged: 9378,
      maintenanceRequests: 23,
      occupancyRate: 87,
      handoversThisMonth: 12
    }
  },
  sales: {
    id: 'sales',
    name: 'Sales',
    description: 'Property sales, lead management, and deal pipeline',
    director: 'dir-3',
    assistants: ['sophia', 'clara', 'hunter', 'kairos'],
    color: '#8B5CF6',
    icon: 'TrendingUp',
    kpis: {
      activeDeals: 30,
      pipelineValue: 79800000,
      conversionRate: 68,
      monthlyTarget: 70
    }
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    description: 'Payment processing, invoicing, and investment advisory',
    director: 'dir-4',
    assistants: ['theodora', 'maven'],
    color: '#F59E0B',
    icon: 'Wallet',
    kpis: {
      monthlyRevenue: 35000000,
      pendingInvoices: 12,
      collectionsRate: 94,
      portfolioValue: 425000000
    }
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    description: 'Property marketing, campaigns, and portal publishing',
    director: 'dir-5',
    assistants: ['olivia'],
    color: '#EC4899',
    icon: 'Megaphone',
    kpis: {
      activeCampaigns: 8,
      featuredListings: 10,
      portalViews: 125000,
      socialEngagement: 45
    }
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Strategic leadership and company-wide decision making',
    director: null,
    assistants: ['zoe'],
    color: '#10B981',
    icon: 'Briefcase',
    kpis: {
      pendingSuggestions: 8,
      meetingsToday: 8,
      tasksUrgent: 4,
      aiAssistantsOnline: 24
    }
  },
  compliance: {
    id: 'compliance',
    name: 'Compliance',
    description: 'KYC verification, AML monitoring, and RERA compliance',
    director: 'dir-6',
    assistants: ['laila'],
    color: '#6366F1',
    icon: 'Shield',
    kpis: {
      kycProfiles: 89,
      pendingReviews: 12,
      amlAlerts: 3,
      complianceScore: 98
    }
  },
  technology: {
    id: 'technology',
    name: 'Technology',
    description: 'Platform development, AI systems, and infrastructure',
    director: 'dir-7',
    assistants: ['aurora', 'hazel', 'willow', 'henry'],
    color: '#0EA5E9',
    icon: 'Server',
    kpis: {
      systemUptime: 99.97,
      deploymentsThisWeek: 5,
      apiRequests: 125000,
      errorRate: 0.02
    }
  },
  intelligence: {
    id: 'intelligence',
    name: 'Intelligence',
    description: 'Market research, analytics, and off-plan tracking',
    director: 'dir-8',
    assistants: ['cipher', 'atlas'],
    color: '#0D9488',
    icon: 'Brain',
    kpis: {
      marketReports: 15,
      offPlanProjects: 42,
      priceAlerts: 7,
      forecastAccuracy: 87
    }
  },
  legal: {
    id: 'legal',
    name: 'Legal',
    description: 'Contract management, legal reviews, and dispute resolution',
    director: 'dir-9',
    assistants: ['evangeline'],
    color: '#DC2626',
    icon: 'Scale',
    kpis: {
      activeContracts: 156,
      pendingReviews: 8,
      disputesOpen: 2,
      avgReviewTime: '2.5 days'
    }
  }
};

export const getExecutiveById = (id) => EXECUTIVES.find(e => e.id === id);
export const getDirectorById = (id) => DIRECTORS.find(d => d.id === id);
export const getDepartmentConfig = (deptId) => DEPARTMENTS_CONFIG[deptId];
export const getDirectorByDepartment = (deptId) => {
  const config = DEPARTMENTS_CONFIG[deptId];
  return config?.director ? getDirectorById(config.director) : null;
};

export default {
  EXECUTIVES,
  DIRECTORS,
  DEPARTMENTS_CONFIG,
  getExecutiveById,
  getDirectorById,
  getDepartmentConfig,
  getDirectorByDepartment
};
