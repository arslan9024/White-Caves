export const LINDA_CONVERSATIONS = [
  {
    id: 'conv-001',
    contactName: 'Ahmed Al-Rashid',
    contactPhone: '+971 50 123 4567',
    avatar: 'AA',
    lastMessage: 'I am interested in a 3-bedroom villa in DAMAC Hills 2. Budget around AED 2.5M',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    unread: true,
    leadScore: 92,
    status: 'hot',
    intent: 'purchase',
    messages: [
      { id: 1, type: 'received', text: 'Hello, I saw your listing for DAMAC Hills 2 villas', time: '10:30 AM' },
      { id: 2, type: 'sent', text: 'Welcome! Yes, we have excellent options in DAMAC Hills 2. What are you looking for?', time: '10:32 AM' },
      { id: 3, type: 'received', text: 'I am interested in a 3-bedroom villa in DAMAC Hills 2. Budget around AED 2.5M', time: '10:35 AM' }
    ]
  },
  {
    id: 'conv-002',
    contactName: 'Sarah Johnson',
    contactPhone: '+971 55 987 6543',
    avatar: 'SJ',
    lastMessage: 'Can you send me the floor plans for the townhouses?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    unread: false,
    leadScore: 78,
    status: 'warm',
    intent: 'inquiry',
    messages: [
      { id: 1, type: 'received', text: 'Hi, do you have townhouses available?', time: '09:15 AM' },
      { id: 2, type: 'sent', text: 'Yes! We have lovely townhouses in Cluster 4 and 7. Would you like to see options?', time: '09:18 AM' },
      { id: 3, type: 'received', text: 'Can you send me the floor plans for the townhouses?', time: '09:22 AM' }
    ]
  },
  {
    id: 'conv-003',
    contactName: 'Mohammed Hassan',
    contactPhone: '+971 52 456 7890',
    avatar: 'MH',
    lastMessage: 'I want to schedule a viewing for this weekend',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    unread: true,
    leadScore: 85,
    status: 'hot',
    intent: 'viewing',
    messages: [
      { id: 1, type: 'received', text: 'I saw Villa 348 online. Is it still available?', time: '08:00 AM' },
      { id: 2, type: 'sent', text: 'Yes, Villa 348 in Cluster 6 is available! It is a beautiful 4BR villa with pool.', time: '08:05 AM' },
      { id: 3, type: 'received', text: 'I want to schedule a viewing for this weekend', time: '08:10 AM' }
    ]
  },
  {
    id: 'conv-004',
    contactName: 'Fatima Al-Maktoum',
    contactPhone: '+971 50 111 2222',
    avatar: 'FA',
    lastMessage: 'What are the payment plan options?',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    unread: false,
    leadScore: 70,
    status: 'warm',
    intent: 'financing',
    messages: [
      { id: 1, type: 'received', text: 'What are the payment plan options?', time: 'Yesterday' }
    ]
  },
  {
    id: 'conv-005',
    contactName: 'James Wilson',
    contactPhone: '+971 55 333 4444',
    avatar: 'JW',
    lastMessage: 'Thank you for the information. I will discuss with my wife.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    unread: false,
    leadScore: 55,
    status: 'cold',
    intent: 'research',
    messages: [
      { id: 1, type: 'received', text: 'Just looking for information about the area', time: '2 days ago' },
      { id: 2, type: 'sent', text: 'DAMAC Hills 2 is a premium golf community with world-class amenities...', time: '2 days ago' },
      { id: 3, type: 'received', text: 'Thank you for the information. I will discuss with my wife.', time: '2 days ago' }
    ]
  }
];

export const CLARA_LEADS = [
  {
    id: 'lead-001',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed.rashid@email.com',
    phone: '+971 50 123 4567',
    source: 'WhatsApp',
    stage: 'qualified',
    score: 92,
    budget: 'AED 2.5M - 3M',
    propertyType: '3BR Villa',
    location: 'DAMAC Hills 2',
    assignedAgent: 'Omar Khalid',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    lastActivity: new Date(Date.now() - 3600000).toISOString(),
    activities: [
      { type: 'call', description: 'Initial qualification call completed', date: '2 hours ago' },
      { type: 'viewing', description: 'Viewing scheduled for Villa 348', date: 'Tomorrow' },
      { type: 'email', description: 'Sent property brochure', date: 'Yesterday' }
    ],
    notes: 'Serious buyer. Looking to close within 2 months. Prefers Cluster 6.'
  },
  {
    id: 'lead-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    phone: '+971 55 987 6543',
    source: 'Website',
    stage: 'contacted',
    score: 78,
    budget: 'AED 1.5M - 2M',
    propertyType: 'Townhouse',
    location: 'DAMAC Hills 2',
    assignedAgent: 'Aisha Rahman',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    lastActivity: new Date(Date.now() - 7200000).toISOString(),
    activities: [
      { type: 'email', description: 'Sent floor plans as requested', date: '3 hours ago' },
      { type: 'whatsapp', description: 'Initial inquiry via WhatsApp', date: '2 days ago' }
    ],
    notes: 'First-time buyer. Interested in move-in ready properties.'
  },
  {
    id: 'lead-003',
    name: 'Mohammed Hassan',
    email: 'mhassan@business.ae',
    phone: '+971 52 456 7890',
    source: 'Referral',
    stage: 'viewing',
    score: 85,
    budget: 'AED 4M - 5M',
    propertyType: '4BR Villa',
    location: 'DAMAC Hills 2 - Cluster 6',
    assignedAgent: 'Omar Khalid',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    lastActivity: new Date(Date.now() - 1800000).toISOString(),
    activities: [
      { type: 'viewing', description: 'Confirmed viewing for Saturday', date: '30 mins ago' },
      { type: 'call', description: 'Discussed financing options', date: 'Yesterday' }
    ],
    notes: 'Cash buyer. Relocating from Abu Dhabi. VIP client from referral.'
  },
  {
    id: 'lead-004',
    name: 'Fatima Al-Maktoum',
    email: 'fatima.maktoum@royalgroup.ae',
    phone: '+971 50 111 2222',
    source: 'WhatsApp',
    stage: 'proposal',
    score: 88,
    budget: 'AED 3M - 4M',
    propertyType: '3BR Villa',
    location: 'DAMAC Hills 2',
    assignedAgent: 'Aisha Rahman',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    lastActivity: new Date(Date.now() - 14400000).toISOString(),
    activities: [
      { type: 'proposal', description: 'Sent payment plan proposal', date: '4 hours ago' },
      { type: 'viewing', description: 'Completed viewing of 3 properties', date: '2 days ago' }
    ],
    notes: 'Interested in Villa 205. Waiting for payment plan approval.'
  },
  {
    id: 'lead-005',
    name: 'James Wilson',
    email: 'jwilson@intlcorp.com',
    phone: '+971 55 333 4444',
    source: 'Property Portal',
    stage: 'new',
    score: 55,
    budget: 'AED 1M - 1.5M',
    propertyType: 'Apartment',
    location: 'Any Dubai',
    assignedAgent: 'Unassigned',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    lastActivity: new Date(Date.now() - 86400000).toISOString(),
    activities: [
      { type: 'email', description: 'Auto-response sent', date: '1 day ago' }
    ],
    notes: 'Initial inquiry. Needs follow-up. May be researching for future purchase.'
  },
  {
    id: 'lead-006',
    name: 'Elena Petrova',
    email: 'elena.p@mail.ru',
    phone: '+971 54 555 6666',
    source: 'Exhibition',
    stage: 'negotiation',
    score: 95,
    budget: 'AED 5M+',
    propertyType: '5BR Mansion',
    location: 'DAMAC Hills 2 - Premium',
    assignedAgent: 'Omar Khalid',
    createdAt: new Date(Date.now() - 1209600000).toISOString(),
    lastActivity: new Date(Date.now() - 900000).toISOString(),
    activities: [
      { type: 'negotiation', description: 'Counter-offer submitted', date: '15 mins ago' },
      { type: 'call', description: 'Price negotiation call', date: '1 hour ago' },
      { type: 'viewing', description: 'Second viewing completed', date: 'Yesterday' }
    ],
    notes: 'VIP investor. Looking for premium property. Ready to close this week.'
  }
];

export const NANCY_EMPLOYEES = [
  {
    id: 'emp-001',
    name: 'Omar Khalid',
    email: 'omar.khalid@whitecaves.ae',
    phone: '+971 50 888 1111',
    position: 'Senior Sales Agent',
    department: 'Sales',
    startDate: '2022-03-15',
    status: 'active',
    performance: 94,
    avatar: 'OK',
    salary: 'AED 18,000',
    commission: '2.5%',
    totalSales: 'AED 42.5M',
    closedDeals: 17
  },
  {
    id: 'emp-002',
    name: 'Aisha Rahman',
    email: 'aisha.rahman@whitecaves.ae',
    phone: '+971 55 888 2222',
    position: 'Sales Agent',
    department: 'Sales',
    startDate: '2023-01-10',
    status: 'active',
    performance: 87,
    avatar: 'AR',
    salary: 'AED 12,000',
    commission: '2%',
    totalSales: 'AED 18.3M',
    closedDeals: 8
  },
  {
    id: 'emp-003',
    name: 'Khalid Al-Farsi',
    email: 'khalid.farsi@whitecaves.ae',
    phone: '+971 52 888 3333',
    position: 'Leasing Manager',
    department: 'Leasing',
    startDate: '2021-08-20',
    status: 'active',
    performance: 91,
    avatar: 'KF',
    salary: 'AED 22,000',
    commission: '1.5%',
    totalSales: 'AED 8.7M',
    closedDeals: 45
  },
  {
    id: 'emp-004',
    name: 'Maria Santos',
    email: 'maria.santos@whitecaves.ae',
    phone: '+971 50 888 4444',
    position: 'Customer Service Representative',
    department: 'Support',
    startDate: '2023-06-01',
    status: 'active',
    performance: 89,
    avatar: 'MS',
    salary: 'AED 8,000',
    commission: null,
    totalSales: null,
    closedDeals: null
  },
  {
    id: 'emp-005',
    name: 'Ahmed Youssef',
    email: 'ahmed.youssef@whitecaves.ae',
    phone: '+971 55 888 5555',
    position: 'Marketing Manager',
    department: 'Marketing',
    startDate: '2022-11-15',
    status: 'active',
    performance: 85,
    avatar: 'AY',
    salary: 'AED 20,000',
    commission: null,
    totalSales: null,
    closedDeals: null
  }
];

export const NANCY_JOB_POSTINGS = [
  {
    id: 'job-001',
    title: 'Senior Sales Agent',
    department: 'Sales',
    location: 'Dubai, UAE',
    type: 'Full-time',
    salary: 'AED 15,000 - 25,000 + Commission',
    posted: new Date(Date.now() - 604800000).toISOString(),
    status: 'open',
    applicants: 8,
    requirements: ['3+ years real estate experience', 'RERA certified', 'Strong negotiation skills', 'Fluent in English & Arabic'],
    description: 'Join our elite sales team to market luxury properties in DAMAC Hills 2.'
  },
  {
    id: 'job-002',
    title: 'Customer Service Representative',
    department: 'Support',
    location: 'Dubai, UAE',
    type: 'Full-time',
    salary: 'AED 6,000 - 10,000',
    posted: new Date(Date.now() - 1209600000).toISOString(),
    status: 'open',
    applicants: 15,
    requirements: ['Excellent communication skills', 'Customer service experience', 'Multi-lingual preferred'],
    description: 'Handle customer inquiries and support our clients throughout their property journey.'
  },
  {
    id: 'job-003',
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'Dubai, UAE',
    type: 'Full-time',
    salary: 'AED 12,000 - 18,000',
    posted: new Date(Date.now() - 259200000).toISOString(),
    status: 'open',
    applicants: 5,
    requirements: ['Digital marketing expertise', 'Social media management', 'Google Ads certification', 'Real estate experience preferred'],
    description: 'Drive our online presence and generate quality leads through digital channels.'
  }
];

export const NANCY_APPLICANTS = [
  {
    id: 'app-001',
    name: 'Rashid Ahmed',
    email: 'rashid.ahmed@email.com',
    phone: '+971 50 777 1111',
    jobId: 'job-001',
    appliedDate: new Date(Date.now() - 172800000).toISOString(),
    status: 'interview',
    experience: '5 years in luxury real estate',
    currentSalary: 'AED 14,000',
    expectedSalary: 'AED 20,000',
    notes: 'Strong candidate. Previously at Emaar. Interview scheduled for Thursday.'
  },
  {
    id: 'app-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+971 55 777 2222',
    jobId: 'job-002',
    appliedDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'screening',
    experience: '3 years customer service',
    currentSalary: 'AED 5,000',
    expectedSalary: 'AED 8,000',
    notes: 'Good communication skills. Multi-lingual (English, Hindi, Arabic).'
  },
  {
    id: 'app-003',
    name: 'David Chen',
    email: 'david.chen@email.com',
    phone: '+971 52 777 3333',
    jobId: 'job-003',
    appliedDate: new Date(Date.now() - 432000000).toISOString(),
    status: 'offer',
    experience: '4 years digital marketing',
    currentSalary: 'AED 15,000',
    expectedSalary: 'AED 17,000',
    notes: 'Excellent portfolio. Google certified. Offer extended, awaiting response.'
  }
];

export const NINA_BOTS = [
  {
    id: 'bot-001',
    name: 'Lion0',
    status: 'active',
    phone: '+971 50 100 0001',
    messagesHandled: 423,
    automationRate: 82,
    uptime: 99.8,
    lastActive: new Date(Date.now() - 60000).toISOString(),
    purpose: 'Lead Qualification',
    language: 'English/Arabic',
    triggers: ['property inquiry', 'pricing', 'availability']
  },
  {
    id: 'bot-002',
    name: 'Lion1',
    status: 'active',
    phone: '+971 50 100 0002',
    messagesHandled: 289,
    automationRate: 75,
    uptime: 99.5,
    lastActive: new Date(Date.now() - 300000).toISOString(),
    purpose: 'Customer Support',
    language: 'English',
    triggers: ['support', 'complaint', 'maintenance']
  },
  {
    id: 'bot-003',
    name: 'Lion2',
    status: 'paused',
    phone: '+971 50 100 0003',
    messagesHandled: 180,
    automationRate: 70,
    uptime: 95.2,
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    purpose: 'Viewing Scheduler',
    language: 'English/Arabic',
    triggers: ['schedule', 'viewing', 'appointment']
  }
];

export const BUSINESS_MODEL = {
  company: {
    name: 'White Caves Real Estate LLC',
    license: 'DED-123456',
    rera: 'ORN-12345',
    established: '2020',
    headquarters: 'Business Bay, Dubai, UAE',
    employees: 24,
    branches: 2
  },
  services: [
    {
      id: 'sales',
      name: 'Property Sales',
      description: 'Premium property sales in Dubai luxury developments',
      commission: '2-3%',
      aiAssistant: 'clara',
      monthlyValue: 'AED 45.2M'
    },
    {
      id: 'leasing',
      name: 'Property Leasing',
      description: 'Residential and commercial leasing services',
      commission: '5% annual rent',
      aiAssistant: 'clara',
      monthlyValue: 'AED 2.8M'
    },
    {
      id: 'management',
      name: 'Property Management',
      description: 'Full-service property management for landlords',
      commission: '8% monthly rent',
      aiAssistant: 'mary',
      monthlyValue: 'AED 450K'
    },
    {
      id: 'consulting',
      name: 'Investment Consulting',
      description: 'Real estate investment advisory services',
      commission: 'Fixed fee',
      aiAssistant: 'clara',
      monthlyValue: 'AED 150K'
    }
  ],
  aiValueStreams: [
    {
      assistant: 'linda',
      value: 'Lead Capture & Qualification',
      metrics: { leadsPerMonth: 150, conversionRate: '32%', costSaving: 'AED 25K/month' }
    },
    {
      assistant: 'mary',
      value: 'Inventory Management',
      metrics: { propertiesManaged: 9378, updateAccuracy: '99.5%', timeSaved: '120 hrs/month' }
    },
    {
      assistant: 'clara',
      value: 'Sales Pipeline Automation',
      metrics: { pipelineValue: 'AED 45.2M', avgClosingTime: '45 days', automationRate: '65%' }
    },
    {
      assistant: 'nina',
      value: '24/7 Customer Engagement',
      metrics: { queriesHandled: 892, responseTime: '<30 sec', satisfaction: '94%' }
    },
    {
      assistant: 'nancy',
      value: 'HR Process Automation',
      metrics: { recruitmentTime: '15 days', employeeSatisfaction: '88%', costSaving: 'AED 10K/month' }
    }
  ],
  targets: {
    monthly: {
      sales: 'AED 50M',
      leads: 200,
      viewings: 80,
      closings: 10
    },
    quarterly: {
      sales: 'AED 150M',
      newListings: 50,
      teamGrowth: 5
    }
  }
};

export default {
  LINDA_CONVERSATIONS,
  CLARA_LEADS,
  NANCY_EMPLOYEES,
  NANCY_JOB_POSTINGS,
  NANCY_APPLICANTS,
  NINA_BOTS,
  BUSINESS_MODEL
};
